(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyUserController', ModifyUserController);

    ModifyUserController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function ModifyUserController(UserService, $location, $rootScope, FlashService) {
        var vm = this;
        vm.modifyUser = modifyUser;

        function modifyUser() {
            vm.dataLoading = true;
            UserService.Update(vm.user)
                .then(function (response) {
                    $location.path('/');
                });
        }
    }
})();
