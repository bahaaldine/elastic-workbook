'use strict';

 angular.module('workbook.wizard.directives', [])
  .directive('wizardStepType', [ '$http', '$injector', '$compile', 
    function($http, $injector, $compile) {
    return {
      scope: true,
      link: function($scope, $element, attrs) {
        attrs.$observe('type', function(value) {
          if ( value != null && value != "" ) {
            var directive = $injector.get(value+'Directive')[0];
            $http.get(directive.templateUrl).then(function(response){
              var html = $compile(response.data)($scope);
              $element.replaceWith(html);
              $element = html;
              //$compile($element)($scope);
              directive.link($scope, $element);
            });
          }
        });
      }
    };
  }])
  .directive('wizardDefineFace', ["$q", "$mdToast", function($q, $mdToast) {
    return {
      scope: true,
      require: '^wizardStepType',
      templateUrl: 'partials/wizard/wizard-define-face.tmpl.html',
      link: function($scope, $element, $attrs, ctrl) {
        var validateStep = function() {
          var message = "";
          var deferred = $q.defer();

          if ( angular.isUndefined($scope.wizard.name) ) {
            message = "Face name is required";
          } 

          if ( angular.isUndefined($scope.wizard.faces.selected) ) {
            message += "<br/> Face type is required";
          } 

          if ( message.length > 0 ) {
            $scope.showAlert(message);
            deferred.reject(false);
          }
          else {
            deferred.resolve(true);
          }


          return deferred.promise
        }

        $scope.wizard.validateStep = validateStep;
      }
    };
  }])
  .directive('wizardIndices', ["$q", function($q) {
    return {
      scope: true,
      templateUrl: 'partials/wizard/wizard-indices.tmpl.html',
      link: function($scope, $element) {
        var validateStep = function() {
          var deferred = $q.defer();

          if ( $scope.wizard.indices.added.length > 0 ) {
            // Here we get the mapping with indices, and search type
            // so fields can ba filetered based on the search type
            $scope.esClient.getMapping({ index: $scope.wizard.indices.added }
              , $scope.wizard.faces.selected.searchType).then(function(client) {
              $scope.wizard.fields.available = client.resp;
              deferred.resolve(true);
            });
          } else {
            $scope.showAlert("At least on index is required");
            deferred.reject(false);
          }

          return deferred.promise
        }

        $scope.wizard.validateStep = validateStep;
      },
      controller: function($scope) {
      }
    };
  }])
  .directive('wizardSearchInput', ["$q", function($q) {
    return {
      scope: true,
      templateUrl: 'partials/wizard/wizard-search-input.tmpl.html',
      link: function($scope, $element) {
        var validateStep = function() {
          var deferred = $q.defer();
          if ( angular.isUndefined($scope.wizard.fields.input.selected.name) ) {
            $scope.showAlert("Face input is required");
            deferred.reject(false);
          } else {
            deferred.resolve(true);
          }

          return deferred.promise
        }

        $scope.wizard.validateStep = validateStep;
      },
      controller: function($scope) {
      }
    };
  }])
  .directive('wizardSearchOutput', ["$q", function($q) {
    return {
      scope: true,
      templateUrl: 'partials/wizard/wizard-search-output.tmpl.html',
      link: function($scope, $element) {
        var validateStep = function() {
          var deferred = $q.defer();
          
          if ( $scope.wizard.fields.output.added.length > 0 ) {
            deferred.resolve(true);
          } else {
            $scope.showAlert("At least one Face output is required");
            deferred.reject(false);
          }

          return deferred.promise
        }

        $scope.wizard.validateStep = validateStep;
      },
      controller: function($scope) {
      }
    };
  }])
  .directive('wizardLayout', ["$q", function($q) {
    return {
      scope: true,
      templateUrl: 'partials/wizard/wizard-layout.tmpl.html',
      link: function($scope, $element) {
        var validateStep = function() {
          var deferred = $q.defer();
          
          deferred.resolve(true);

          return deferred.promise
        }

        $scope.wizard.validateStep = validateStep;
      },
      controller: function($scope) {
      }
    };
  }]);
