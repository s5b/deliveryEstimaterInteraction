/*jslint nomen: true, todo: true, vars: true, white: true */
/*global angular, _, moment */

/* Services */


angular.module('de.services', []).
  service('de', ['$rootScope', '$location', function ($rootScope, $location) {
        'use strict';
        /* Add a detached scope to the service so that the controllers can actively watch for changes in the data. */
        var de = $rootScope.$new(false);

        var itemTypes = { LETTER: 'letter', PARCEL: 'parcel' };
        /* Purely an optimisation to reduce the processing when creating the regular expression for matching the item type in the parser. */
        var itemTypesPattern = _.reduce(itemTypes, function (items, value) {
            items.push(value);
            return items;
        }, []).join('|');

        /* Default the model for initialisation, and also as the basis for parser. */
        var defaultModel = function () {
            return {
                fromPostcode: '',
                toPostcode: '',
                when: new Date(),
                itemType: itemTypes.LETTER
            };
        };

        /* A simple postcode table. */
        var postcodes = function () {
            return [
                { postcode: '2000', label: '2000 - Sydney' },
                { postcode: '3000', label: '3000 - Melbourne' },
                { postcode: '4000', label: '4000 - Brisbane' },
                { postcode: '5000', label: '5000 - Adelaide' },
                { postcode: '6000', label: '6000 - Perth' }
            ];
        };
        /* Purely an optimisation for the validation of postcodes in the parser. */
        var validPostcodes = _.map(postcodes(), 'postcode');

        /* A bunch of methods for validating and converting the parsed fragments of the URL for storage in the model. The regular expression matcher (see below) also helps with the validation. */
        var validateConvertPostcode = function (input) { return _.contains(validPostcodes, input) ? input : ''; };
        var validateConvertAsIs = function (input) { return input; };
        var validateConvertAsISO8601Short = function (input) { return new Date(input); };

        /* A bunch of methods for converting the model for output into the URL fragments. */
        var outputConversionAsIs = function (output) { return output; };
        var outputConversionISO8601Sort = function (output) { return moment(output).format('YYYY-MM-DD'); };

        /* Determine whether the model has a complete set of values. */
        var validParameters = function (parameters) {
            return parameters.fromPostcode.length > 0 && parameters.toPostcode.length > 0 && parameters.when !== undefined && parameters.itemType !== undefined;
        };

        var urlParameterSeparator = '/';
        /* A declaration of the model parameters to be stored into and source from the URL.
           The key defines the parameter name in the model.
           token: The prefix name of the parameter in the URL.
           pattern: The regular expression pattern used to match the value of the parameter on input.
           inputConversion: A function to validate and convert valid input parameters.
           outputConversion: A function to format model parameters for the URL.
         */
        var urlFragmentComponents = {
            'fromPostcode' : { token: 'dePostcodeFrom', pattern: '\\d{4}', inputConversion: validateConvertPostcode, outputConversion: outputConversionAsIs },
            'toPostcode': { token: 'dePostcodeTo', pattern: '\\d{4}', inputConversion: validateConvertPostcode, outputConversion: outputConversionAsIs },
            'when': { token: 'deWhen', pattern: '\\d{4}-\\d{2}-\\d{2}', inputConversion: validateConvertAsISO8601Short, outputConversion: outputConversionISO8601Sort },
            'itemType': { token: 'deItemType', pattern: itemTypesPattern, inputConversion: validateConvertAsIs, outputConversion: outputConversionAsIs }
        };
        /* Construct the parameter regular expression for use by the parser. */
        var parameterMatcher = function (token, pattern) {
            return urlParameterSeparator + token + urlParameterSeparator + '(' + pattern + ')\\b';
        };

        /* The parser for the hash fragment in the URL. */
        var parseHashFragment = function (hashFragment) {
            var match;
            var modelParameters = _.reduce(urlFragmentComponents, function (allParameters, metadata, parameter) {
                allParameters.push(parameter);
                return allParameters;
            }, []);
            /* Initialise the model - because things have changed in the URL; previously defined parts may be missing now. */
            de.parameters = defaultModel();
            /* Iterate over the declaration, processing each of the expected parameters. */
            _.forEach(urlFragmentComponents, function (metadata, parameter) {
                match = new RegExp(parameterMatcher(metadata.token, metadata.pattern)).exec(hashFragment);
                /* If a match is found then convert the value (if possible), otherwise the default value remains set. */
                if (match) {
                    de.parameters[parameter] = metadata.inputConversion(match[1]);
                    _.remove(modelParameters, function (targetParameter) { return targetParameter === parameter; });
                }
            });
            de.modelComplete = modelParameters.length === 0 && validParameters(de.parameters);
        };

        /* TODO: Add a parameter to setLocationFragment that wne set will change the .html part of the request - that is, go to another page. */
        /* FIXME: This implementation assumes that it is the only one that will change the hash fragment - beware!
        /* The URL fragment builder, based on the values in the model. This method is intended to be the onclick target for the button on the input form. */
        var setLocationFragment = function () {
            var hashFragment = _.reduce(urlFragmentComponents, function (urlFragment, metadata, parameter) {
                urlFragment += urlParameterSeparator + metadata.token + urlParameterSeparator + metadata.outputConversion(de.parameters[parameter]);
                return urlFragment;
            }, '');
            $location.path(hashFragment);
        };

        /* Force a reset on the model complete flag - used from UI when the form has errors on submit. */
        var resetModelComplete = function () {
            de.modelComplete = false;
        };

        /* Exposed methods and fields. */
        de.parameters = defaultModel();
        de.itemTypes = itemTypes;
        de.postcodes = postcodes;

        de.parseHashFragment = parseHashFragment;
        de.setLocationFragment = setLocationFragment;

        de.modelComplete = false;
        de.resetModelComplete = resetModelComplete;

        /* Watch the URL fragment for changes and call the parser when it does change. */
        de.$watch(function () { return $location.path(); }, function () { parseHashFragment($location.path()); });

        return de;
    }]);
