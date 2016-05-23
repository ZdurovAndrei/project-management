(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$filter', '$q'];
    function UserService($filter, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.ModifyRole = ModifyRole;
        service.Delete = Delete;
        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), {username: username});
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();
            GetByUsername(user.username)
                .then(function (duplicateUser) {
                    if (duplicateUser !== null) {
                        deferred.resolve({success: false, message: 'Логин "' + user.username + '" уже используется'});
                    } else {
                        var users = getUsers();
                        var lastUser = users[users.length - 1] || {id: 0};
                        if (lastUser.id == 0) {
                            user.role = 'Admin';
                        } else {
                            user.role = 'Developer';
                        }
                        user.id = lastUser.id + 1;
                        users.push(user);
                        setUsers(users);
                        deferred.resolve({success: true});
                    }
                });
            return deferred.promise;
        }

        function Update(temporaryUser) {
            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === temporaryUser.id) {
                    users[i] = temporaryUser;
                    break;
                }
            }
            setUsers(users);
        }

        function ModifyRole(id) {
            var deferred = $q.defer();
            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    if (users[i].role === 'Developer') {
                        users[i].role = 'Manager';
                    } else {
                        users[i].role = 'Developer';
                    }
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();
            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();
            return deferred.promise;
        }

        function getUsers() {
            if (!localStorage.users) {
                localStorage.users = JSON.stringify([]);
            }
            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    }
})();