'use strict';

angular.module('workbook.faces.fuzzysearch.directives', [])
.directive('fuzzysearch', [ function() {
  return {
  	restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'partials/faces/fuzzysearch.tmpl.html',
    link: function($scope, $element) {
    }
  };
}]);