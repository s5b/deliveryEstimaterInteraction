'use strict';

/* Controllers */

angular.module('deInput.controllers', [
    'de.services'
    ]).
  controller('dataCapture', ['$scope', '$location', 'de', function ($scope, $location, de) {
        $scope.parameters = de.parameters;
        de.$watch('parameters', function (parameters) {
            $scope.parameters = parameters;
        });
        $scope.postcodes = de.postcodes();
        $scope.itemTypes = de.itemTypes;

        $scope.inputValidation = function (isInvalid) { return isInvalid ? 'error' : ''; };

        $scope.estimate = function (isValid) {
            if (isValid) {
                console.log('-- Attempt estimate --');
                de.setLocationFragment();
            } else {
                console.log('XXXXXX Fix the input XXXXXX');
            }
        }
  }]);