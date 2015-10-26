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
  }]);