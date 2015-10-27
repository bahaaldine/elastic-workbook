'use strict';

angular.module('workbook.faces.typeahead.directives', [])
.directive('typeahead', [ function() {
  return {
  	restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'partials/faces/typeahead.tmpl.html',
    link: function($scope, $element) {
    }
  };
}]);