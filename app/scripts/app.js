'use strict';

/**
 * @ngdoc overview
 * @name workbookApp
 * @description
 * # workbookApp
 *
 * Main module of the application.
 */
angular
  .module('workbookApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch', 
    'ngMaterial',
    'ngAria',
    'infinite-scroll',
    'elasticsearch',
    'hljs',
    'ngOdometer',
    'workbook.controllers',
    'workbook.filters',
    'workbook.elasticsearch',
    'workbook.menu',
    'workbook.demos'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$logProvider',
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('home', {
          url: '/',
          title: 'Getting started'
        })
        .state('home.demos', {
          url: '/demos',
          abstract: true
        })
        .state('home.demos.text', {
          url: '/demos/text',
          abstract: true
        })
        .state('home.demos.text.fulltextsearch', {
          url: '/demos/text/fulltextsearch',
          title: 'Full text search demo',
          views: {
            '@': {
              templateUrl: 'views/demos/fulltextsearch/index.html'
            }
          }
        })
        .state('home.demos.text.fuzzysearch', {
          url: '/demos/text/fuzzysearch',
          title: 'Fuzzy search demo',
          views: {
            '@': {
              templateUrl: 'views/demos/fuzzysearch/index.html'
            }
          }
        })
        .state('home.demos.text.typeahead', {
          url: '/demos/text/typeahead',
          title: 'Type ahead demo',
          views: {
            '@': {
              templateUrl: 'views/demos/typeahead/index.html'
            }
          }
        })
        .state('home.demos.text.didyoumean', {
          url: '/demos/text/didyoumean',
          title: 'Did you mean demo',
          views: {
            '@': {
              templateUrl: 'views/demos/didyoumean/index.html'
            }
          }
        })
        .state('home.demos.geo', {
          url: '/demos/geo',
          abstract: true
        })
        .state('home.demos.geo.geoshapes', {
          url: '/demos/geo/geoshapes',
          title: 'Geoshapes demo',
          views: {
            '@': {
              templateUrl: 'views/demos/geoshapes/index.html'
            }
          }
        })
        .state('home.demos.geo.dragthemap', {
          url: '/demos/geo/dragthemap',
          title: 'Drag the map demo',
          views: {
            '@': {
              templateUrl: 'views/demos/dragthemap/index.html'
            }
          }
        })
        .state('home.demos.faceted', {
          url: '/demos/faceted',
          abstract: true
        })
        .state('home.demos.faceted.simpleaggregation', {
          url: '/demos/faceted/simpleaggregation',
          title: 'Simple aggregation demo',
          views: {
            '@': {
              templateUrl: 'views/demos/simpleaggregation/index.html'
            }
          }
        })
    }])
    .config(['$mdThemingProvider', function($mdThemingProvider) {
      // Extend the red theme with a few different colors
      var elastic = $mdThemingProvider.extendPalette('teal', {
        '500': '39bdb1'
      });

      $mdThemingProvider.definePalette('elastic', elastic);

      $mdThemingProvider.theme('default')
        .primaryPalette('elastic')
        .accentPalette('amber');
    }]);