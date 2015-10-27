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
    'ngMessages',
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
    'workbook.factories',
    'workbook.elasticsearch',
    'workbook.menu',
    'workbook.wizard',
    'workbook.home',
    'workbook.faces'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$logProvider',
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('home', {
          url: '/',
          title: 'Getting started',
          views: {
            '@': {
              templateUrl: 'views/workbook/home.html'
            }
          }
        })
        .state('home.wizard', {
          url: 'wizard',
          title: 'Wizard',
          views: {
            '@': {
              templateUrl: 'views/workbook/wizard.html'
            }
          }
        })
        .state('home.face', {
          url: 'face',
          views: {
            '@': {
              templateUrl: 'views/workbook/face.html'
            }
          },
          hide: {
            sidenav: true,
            toolbar: true
          }
        })
        .state('home.face.search', {
          url: '/search',
          title: 'search',
          views: {
            '@': {
              templateUrl: 'views/workbook/face-search.html'
            }
          },
          hide: {
            sidenav: true,
            toolbar: true
          }
        })
        .state('home.face.map', {
          url: '/map',
          title: 'map',
          views: {
            '@': {
              templateUrl: 'views/workbook/face-map.html'
            }
          },
          hide: {
            sidenav: true,
            toolbar: true
          }
        })
        .state('home.face.analytics', {
          url: '/analytics',
          title: 'analytics',
          views: {
            '@': {
              templateUrl: 'views/workbook/face-analytics.html'
            }
          },
          hide: {
            sidenav: true,
            toolbar: true
          }
        })
        .state('home.settings', {
          url: 'settings',
          title: 'settings',
          views: {
            '@': {
              templateUrl: 'views/workbook/settings.html'
            }
          },
          hide: {
            sidenav: true,
            toolbar: true
          }
        })
        .state('home.demos', {
          url: 'demos',
          abstract: true
        })
        .state('home.demos.text', {
          url: '/text',
          abstract: true
        })
        .state('home.demos.text.fulltextsearch', {
          url: '/fulltextsearch',
          title: 'Full text search demo',
          views: {
            '@': {
              templateUrl: 'views/demos/fulltextsearch/index.html'
            }
          }
        })
        .state('home.demos.text.fuzzysearch', {
          url: '/fuzzysearch',
          title: 'Fuzzy search demo',
          views: {
            '@': {
              templateUrl: 'views/demos/fuzzysearch/index.html'
            }
          }
        })
        .state('home.demos.text.typeahead', {
          url: '/typeahead',
          title: 'Type ahead demo',
          views: {
            '@': {
              templateUrl: 'views/demos/typeahead/index.html'
            }
          }
        })
        .state('home.demos.text.didyoumean', {
          url: '/didyoumean',
          title: 'Did you mean demo',
          views: {
            '@': {
              templateUrl: 'views/demos/didyoumean/index.html'
            }
          }
        })
        .state('home.demos.geo', {
          url: '/geo',
          abstract: true
        })
        .state('home.demos.geo.geoshapes', {
          url: '/geoshapes',
          title: 'Geoshapes demo',
          views: {
            '@': {
              templateUrl: 'views/demos/geoshapes/index.html'
            }
          }
        })
        .state('home.demos.geo.dragthemap', {
          url: '/dragthemap',
          title: 'Drag the map demo',
          views: {
            '@': {
              templateUrl: 'views/demos/dragthemap/index.html'
            }
          }
        })
        .state('home.demos.faceted', {
          url: '/faceted',
          abstract: true
        })
        .state('home.demos.faceted.simpleaggregation', {
          url: '/simpleaggregation',
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

      $mdThemingProvider.theme("error-toast");
    }]);