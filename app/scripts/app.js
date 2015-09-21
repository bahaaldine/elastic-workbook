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
          url: '/'
        })
        .state('home.demos', {
          url: '/',
          abstract: true
        })
        .state('home.demos.geoshapes', {
          url: '/demos/geoshapes',
          views: {
            '@': {
              templateUrl: 'views/demos/geoshapes/index.html'
            }
          }
        })
    }]);