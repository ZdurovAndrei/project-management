(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope'];
    function HomeController(UserService, $rootScope) {
        var vm = this;
        vm.user = null;
        vm.allUsers = [];
        vm.modifyUser = modifyUser;
        vm.modifyRoleUser = modifyRoleUser;
        vm.deleteUser = deleteUser;
        vm.isAdmin = false;

        loadCurrentUser();

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                    if (vm.user.role == 'Admin') {
                        loadUsers();
                        vm.isAdmin = true;
                    }
                });
        }

        function loadUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }
        
        function modifyUser() {
            UserService.Update(vm.user);
            loadUsers();
        }

        function modifyRoleUser(id) {
            UserService.ModifyRole(id);
            loadUsers();
        }

        function deleteUser(id) {
            UserService.Delete(id);
            loadUsers();
        }
    }

})();