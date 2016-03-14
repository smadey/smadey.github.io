require.config({
    paths: {
        'jquery': '../lib/jquery/jquery.min',
        'angular': '../lib/angular/angular.min',
        'angularUIRouter': '../lib/angular/angular-ui-router.min'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularUIRouter': ['angular']
    },
    waitSeconds: 15
});


require( [
    'angular',
    'app'
], function(angular, app) {
    'use strict';

    angular.bootstrap(document, [app.name]);
});
