'use strict';

 angular.module('workbook.menu.directives', [])
  .directive('menuToggle', [ '$timeout', function($timeout) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-toggle.tmpl.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.isOpen = function() {
          return controller.isOpen($scope.section);
        };
        $scope.toggle = function() {
          controller.toggleOpen($scope.section);
        };
      }
    };
  }])
  .directive('menuLink', function () {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-link.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();

        $scope.focusSection = function () {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
  });