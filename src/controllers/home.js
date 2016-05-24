(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'ProjectService', 'TaskService', '$rootScope', 'FlashService'];
    function HomeController(UserService, ProjectService, TaskService, $rootScope, FlashService) {

        // Кнопка скролла вверх

        $.scrollUp({
            scrollName: 'scrollUp',
            scrollDistance: 300,
            scrollFrom: 'top',
            scrollSpeed: 1000,
            easingType: 'linear',
            animation: 'fade',
            animationSpeed: 500,
            scrollText: '',
            scrollImg: true
        });


        // Навигация

        $('.single-page-nav').singlePageNav({
            offset: $('.single-page-nav').outerHeight(),
            speed: 700,
            updateHash: true
        });

        $('.navbar-toggle').click(function () {
            $('.single-page-nav').toggleClass('show');
        });

        $('.single-page-nav a').click(function () {
            $('.single-page-nav').removeClass('show');
        });


        // работа с проектами

        var vm = this;
        vm.project = null;
        vm.temporaryProject = null;
        vm.allProjects = [];
        vm.createProject = createProject;
        vm.viewProject = viewProject;
        vm.allowChangeProject = false;
        vm.toggleAllowChangeProject = toggleAllowChangeProject;
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
            ProjectService.Create(vm.temporaryProject)
                .then(function (response) {
                    if (response.success) {
                        // FlashService.Success('Проект успешно создан.', true);
                    } else {
                        FlashService.Error(response.message);
                    }
                });
            $('#createProject').modal('hide');
        }

        function viewProject(currentProject) {
            vm.project = currentProject;
        }

        function toggleAllowChangeProject() {
            vm.allowChangeProject = !vm.allowChangeProject;
        }

        function modifyProject() {
            ProjectService.Update(vm.project);
            $('#modalViewProject').modal('hide');
        }

        function deleteProject(id) {
            ProjectService.Delete(id);
            loadProjects();
            $('#modalViewProject').modal('hide');
        }


        // работа с задачами

        vm.task = null;
        vm.temporaryTask = null;
        vm.allTasks = [];
        vm.createTask = createTask;
        vm.viewTask = viewTask;
        vm.toggleAllowChangeTask = toggleAllowChangeTask;
        vm.modifyTask = modifyTask;
        vm.deleteTask = deleteTask;

        loadTasks();

        function loadTasks() {
            TaskService.GetAll()
                .then(function (tasks) {
                    vm.allTasks = tasks;
                });
        }

        function createTask() {
            TaskService.Create(vm.task)
                .then(function (response) {
                    if (response.success) {
                        var currentProject = ProjectService.GetProject(vm.task.project);
                        if (currentProject.tasks != undefined) {
                            currentProject.tasks += ', ' + vm.task.taskname;
                        } else {
                            currentProject.tasks = vm.task.taskname;
                        }
                        ProjectService.Update(currentProject);
                    } else {
                        FlashService.Error(response.message);
                    }
                });
            $('#createTask').modal('hide');
        }

        var temporaryTaskname = null;

        function viewTask(currentTask) {
            temporaryTaskname = currentTask.taskname;
            vm.task = currentTask;
            vm.allowChangeTask = false;
        }

        function toggleAllowChangeTask() {
            vm.allowChangeTask = !vm.allowChangeTask;
        }

        function modifyTask() {
            TaskService.Update(vm.task);
            var currentProject = ProjectService.GetProject(vm.task.project);
            currentProject.tasks = currentProject.tasks.replace(temporaryTaskname, vm.task.taskname);
            ProjectService.Update(currentProject);
            $('#modalViewTask').modal('hide');
        }

        function deleteTask(id) {
            TaskService.Delete(id);
            loadTasks();
            $('#modalViewTask').modal('hide');
        }


        // работа с пользователями

        vm.user = null;
        vm.temporaryUser = null;
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
            vm.temporaryUser.id = vm.user.id;
            vm.temporaryUser.role = vm.user.role;
            UserService.Update(vm.temporaryUser);

            // Не удается изменить $rootScope !!!
            $rootScope.globals.currentUser.username = vm.temporaryUser.username;

            loadCurrentUser();
            $('#modifyUser').modal('hide');
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