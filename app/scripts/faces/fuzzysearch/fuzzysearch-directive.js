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
}])
.directive('faceHeader', [ function($http, $injector, $compile) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'partials/faces/face-header.tmpl.html',
    link: function($scope, $element) {
    }
  };
}])
.directive('faceResultListView', [ function($http, $injector, $compile) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'partials/faces/face-list-view.tmpl.html',
    link: function($scope, $element) {
    }
  };
}]);