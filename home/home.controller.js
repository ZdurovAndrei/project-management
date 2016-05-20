(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'ProjectService', '$rootScope', 'FlashService'];
    function HomeController(UserService, ProjectService, $rootScope, FlashService) {
        var vm = this;
        vm.user = null;
        vm.allUsers = [];
        vm.modifyUser = modifyUser;
        vm.modifyRoleUser = modifyRoleUser;
        vm.deleteUser = deleteUser;
        vm.isAdmin = false;

        // работа с пользователями
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
            $('#modifyUser').modal('hide');
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
        
        // работа с проектами
        vm.project = null;
        vm.allProjects = [];
        vm.createProject = createProject;
        vm.modifyProject = modifyProject;
        vm.deleteProject = deleteProject;

        loadProjects();
        function loadProjects() {
            ProjectService.GetAll()
                .then(function (projects) {
                    vm.allProjects = projects;
                });
        }

        function createProject() {
            ProjectService.Create(vm.project)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Проект успешно создан.', true);
                    } else {
                        FlashService.Error(response.message);
                    }
                });
            loadProjects();
            $('#createProject').modal('hide');
        }

        function modifyProject() {
            ProjectService.Update(vm.project);
            loadProjects();
            $('#modifyProject').modal('hide');
        }

        function deleteProject(id) {
            ProjectService.Delete(id);
            loadProjects();
        }
    }

})();