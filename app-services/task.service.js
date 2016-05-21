(function () {
    'use strict';

    angular
        .module('app')
        .factory('TaskService', TaskService);

    TaskService.$inject = ['$filter', '$q'];
    function TaskService($filter, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetByTaskname = GetByTaskname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getTasks());
            return deferred.promise;
        }

        function GetByTaskname(taskname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getTasks(), {taskname: taskname});
            var task = filtered.length ? filtered[0] : null;
            deferred.resolve(task);
            return deferred.promise;
        }

        function Create(task) {
            var deferred = $q.defer();
            GetByTaskname(task.taskname)
                .then(function (duplicateTask) {
                    if (duplicateTask !== null) {
                        deferred.resolve({
                            success: false,
                            message: 'Название "' + task.taskname + '" уже используется'
                        });
                    } else {
                        var tasks = getTasks();
                        var lastTask = tasks[tasks.length - 1] || {id: 0};
                        task.id = lastTask.id + 1;
                        task.status = 'Новое';
                        var d = new Date();
                        task.startTime = formatDate(d);
                        tasks.push(task);
                        setTasks(tasks);
                        deferred.resolve({success: true});
                    }
                });
            return deferred.promise;
        }

        function Update(task) {
            var deferred = $q.defer();
            var tasks = getTasks();
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === task.id) {
                    tasks[i] = task;
                    break;
                }
            }
            setTasks(tasks);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();
            var tasks = getTasks();
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                if (task.id === id) {
                    tasks.splice(i, 1);
                    break;
                }
            }
            setTasks(tasks);
            deferred.resolve();
            return deferred.promise;
        }

        function getTasks() {
            if (!localStorage.tasks) {
                localStorage.tasks = JSON.stringify([]);
            }
            return JSON.parse(localStorage.tasks);
        }

        function setTasks(tasks) {
            localStorage.tasks = JSON.stringify(tasks);
        }

        function formatDate(date) {
            var dd = date.getDate();
            if (dd < 10) dd = '0' + dd;

            var mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;

            var yy = date.getFullYear() % 100;
            if (yy < 10) yy = '0' + yy;

            return dd + '.' + mm + '.' + yy;
        }
    }
})();