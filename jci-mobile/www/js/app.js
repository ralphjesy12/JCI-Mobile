// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'LocalStorageModule',

    'starter.common.directives',
    'starter.app.services',
    'starter.app.filters',
    'starter.app.controllers',
    'starter.auth.controllers',
    'starter.views',

])
.run(function($ionicPlatform,$window, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
})
.config(function($stateProvider, $urlRouterProvider ) {


    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/loginregister.html',
                controller: 'LoginCtrl'
            }
        }
    })
    .state('app.feed', {
        url: '/feed',
        views: {
            'menuContent': {
                templateUrl: 'templates/feed.html',
                controller: 'FeedsCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
})

.factory('Content', ['$http', Content]);


function Content($http) {

    function getcontent(callback, url) {
        var articles = [];
        var article = {};
        $http.get(url).success(function(response) {
            if (response.content[0].length > 0) {
                for (var i = 0; i < response.content[0].length; i++) {
                    article = {
                        title:response.content[0][i].title,
                        subtitle:response.content[0][i].subtitle
                    }
                    articles.push(article);
                }
            } else {
                //
            }
        }).error(function() {
            //
        }).then(function() {
            callback(articles);
        });;
    }
    return {
        getcontent: getcontent
    }
}
