'use strict';

/* Controllers */

angular.module('deOutput.controllers', [
    'de.services'
    ]).
  controller('resultsDisplay', ['$scope', '$location', 'de', function ($scope, $location, de) {
        $scope.showResults = '';
        de.$watch('modelComplete', function (modelComplete) {
            $scope.showResults = modelComplete ? 'show' : '';
            /* TODO: Make the AJAX call to the back-end using de.parameters. */
        });
  }]);