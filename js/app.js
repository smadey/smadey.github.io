define([
    'angular',
    'angularUIRouter'
], function (angular) {
        'use strict';

        /* App Module */

        var app = angular.module('App', ['ui.router']);

        app.controller('HomeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.currentRouterName = 'home';

            $scope.age = new Date().getFullYear() - 1990 + 1;
        }]);

        app.controller('DeveloperCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.currentRouterName = 'developer';
        }]);

        app.controller('ACGNCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.currentRouterName = 'acgn';
        }]);

        app.controller('GamesCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.currentRouterName = 'games';
        }]);

        app.controller('ContactCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.currentRouterName = 'contact';
        }]);

        app.config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $stateProvider.state('home', {
                    url: '/',
                    templateUrl: 'views/index.html',
                    controller: 'HomeCtrl'
                }).state('developer', {
                    url: '/developer',
                    templateUrl: 'views/developer.html',
                    controller: 'DeveloperCtrl'
                }).state('acgn', {
                    url: '/acgn',
                    templateUrl: 'views/acgn.html',
                    controller: 'ACGNCtrl'
                }).state('games', {
                    url: '/games',
                    templateUrl: 'views/games.html',
                    controller: 'GamesCtrl'
                }).state('contact', {
                    url: '/contact',
                    templateUrl: 'views/contact.html',
                    controller: 'ContactCtrl'
                });
                $urlRouterProvider.otherwise('/');
            }
        ]);

        return app;
});
