(function(){
  'use strict';
/**
 * @ngdoc function
 * @name workbookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workbookApp
 */
angular.module('workbook.controllers', [])
  .controller('workbookCtrl', [
  '$scope',
  '$log',
  '$state',
  '$timeout',
  '$location',
  'menu',
  function ($scope, $log, $state, $timeout, $location, menu) {

    var vm = this;

    //functions for menu-link and menu-toggle
    vm.isOpen = isOpen;
    vm.toggleOpen = toggleOpen;
    vm.isSectionSelected = isSectionSelected;
    vm.autoFocusContent = false;
    vm.menu = menu;

    vm.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    function isOpen(section) {
      return menu.isSectionSelected(section);
    }

    function toggleOpen(section) {
      menu.toggleSelectSection(section);
    }

    function isSectionSelected(section) {
      var selected = false;
      var openedSection = menu.openedSection;
      if(openedSection === section){
        selected = true;
      }
      else if(section.children) {
        section.children.forEach(function(childSection) {
          if(childSection === openedSection){
            selected = true;
          }
        });
      }
      return selected;
    }

    $scope.vm = vm;
    $scope.$state = $state;
  }]);
})();