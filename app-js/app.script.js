(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            .when('#section1', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html#section1',
                controllerAs: 'vm'
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })
        // .otherwise({redirectTo: '/login'});
    }

    // после обновления страницы автоматический вход в систему
    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        // перенаправление на страницу авторизации
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

    // Parallax
    $('.projects-section').parallax({
        imageSrc: 'img/bg-1.jpg',
        speed: 0.2
    });
    $('.tasks-section').parallax({
        imageSrc: 'img/bg-2.jpg',
        speed: 0.2
    });
    $('.users-section').parallax({
        imageSrc: 'img/bg-3.jpg',
        speed: 0.2
    });

    // jQuery Scroll Up / Перемотать вверх
    $.scrollUp({
        scrollName: 'scrollUp',
        scrollDistance: 300,
        scrollFrom: 'top',
        scrollSpeed: 1000,
        easingType: 'linear',
        animation: 'fade',
        animationSpeed: 300,
        scrollText: '',
        scrollImg: true
    });

    // Навигация
    $('.single-page-nav').singlePageNav({
        offset: $('.single-page-nav').outerHeight(),
        speed: 1000,
        updateHash: true
    });

    $('.navbar-toggle').click(function () {
        $('.single-page-nav').toggleClass('show');
    });

    $('.single-page-nav a').click(function () {
        $('.single-page-nav').removeClass('show');
    });
})();