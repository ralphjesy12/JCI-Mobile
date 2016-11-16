angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})
.controller('LoginCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout,$http,localStorageService) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.items = {};
    $scope.name = 'GOOGL';
    $scope.$watch('online', function(newStatus) {
        // if(newStatus){
        $scope.doRefresh();
        // }
    });
    $scope.isEmpty = function (obj) {
        for (var i in obj) if (obj.hasOwnProperty(i)) return false;
        return true;
    };

    $scope.doRefresh = function() {

        $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%27'+$scope.name+'%27)&env=store://datatables.org/alltableswithkeys&format=json')
        .success(function(data){

            localStorageService.set('quotes', data.query.results.quote);

            angular.forEach(data.query.results.quote, function(value, key) {
                if(typeof $scope.items[key] !== 'undefined'){
                    if($scope.items[key] && $scope.items[key].value!=value){
                        $scope.items[key] = {
                            value : value,
                            status : 'new'
                        };
                    }else{
                        $scope.items[key] = {
                            value : value,
                            status : 'old'
                        };
                    }
                }else{
                    $scope.items[key] = {
                        value : value,
                        status : 'old'
                    };
                }
            });

            // $scope.items = data.query.results.quote;
            $scope.$broadcast('scroll.refreshComplete');

        }).error(function(){

            var quotes = {};
            if(quotes = localStorageService.get('quotes')){

                console.log('Fetched from Cache');
                angular.forEach(quotes, function(value, key) {
                    if(typeof $scope.items[key] !== 'undefined'){
                        if($scope.items[key] && $scope.items[key].value!=value){
                            $scope.items[key] = {
                                value : value,
                                status : 'new'
                            };
                        }else{
                            $scope.items[key] = {
                                value : value,
                                status : 'old'
                            };
                        }
                    }else{
                        $scope.items[key] = {
                            value : value,
                            status : 'old'
                        };
                    }
                });
            }else{
                $scope.items = {
                    "message": {
                        value : "Opps! There was a problem loading the feed!",
                        status : 'old'
                    }
                };
            }

            $scope.$broadcast('scroll.refreshComplete');
            // $('.feed').fadeIn();
        });


    };

    var quotes = {};
    if(quotes = localStorageService.get('quotes')){

        console.log('Fetched from Cache');
        angular.forEach(quotes, function(value, key) {
            if(typeof $scope.items[key] !== 'undefined'){
                if($scope.items[key] && $scope.items[key].value!=value){
                    $scope.items[key] = {
                        value : value,
                        status : 'new'
                    };
                }else{
                    $scope.items[key] = {
                        value : value,
                        status : 'old'
                    };
                }
            }else{
                $scope.items[key] = {
                    value : value,
                    status : 'old'
                };
            }
        });
    }else{

        console.log('Fetched from Remote');
        $scope.doRefresh();
    }

});
