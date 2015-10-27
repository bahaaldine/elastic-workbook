'use strict';

 angular.module('workbook.faces.directives', [])
  .directive('face', [ '$http', '$injector', '$compile', 
    function($http, $injector, $compile) {
    return {
      link: function($scope, $element, attrs) {
        attrs.$observe('type', function(value) {
          if ( value != null && value != "" ) {
            var directive = $injector.get(value.toLowerCase()+'Directive')[0];
            $http.get(directive.templateUrl).then(function(response){
              var html = $compile(response.data)($scope);
              $element.replaceWith(html);
              $element = html;
            });
          }
        });
      }
    };
  }])
  .directive('faceHeader', [ function() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'partials/faces/face-header.tmpl.html',
      link: function($scope, $element) {
      }
    };
  }])
  .directive('faceResultListView', ['WorkbookService',
     function(WorkbookService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'partials/faces/face-list-view.tmpl.html',
      link: function($scope, $element) {
      },
      controller: function($scope) {
        $scope.ctrl.toPrettyJSON = WorkbookService.toPrettyJSON;
        $scope.ctrl.toSummary = WorkbookService.toSummary;
        $scope.ctrl.getResultURL = WorkbookService.getResultURL;
      }
    };
  }])
  .directive('faceSearchBar', [
     function() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'partials/faces/face-search-bar.tmpl.html',
      link: function($scope, $element) {
      }
    };
  }]);