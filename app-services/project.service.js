﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$filter', '$q'];
    function ProjectService($filter, $q) {
        var service = {};
        service.GetAll = GetAll;
        service.GetByProjectname = GetByProjectname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getProjects());
            return deferred.promise;
        }

        function GetByProjectname(projectname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getProjects(), {projectname: projectname});
            var project = filtered.length ? filtered[0] : null;
            deferred.resolve(project);
            return deferred.promise;
        }

        function Create(project) {
            var deferred = $q.defer();
            GetByProjectname(project.projectname)
                .then(function (duplicateProject) {
                    if (duplicateProject !== null) {
                        deferred.resolve({
                            success: false,
                            message: 'Название "' + project.projectname + '" уже используется'
                        });
                    } else {
                        var projects = getProjects();
                        var lastProject = projects[projects.length - 1] || {id: 0};
                        project.id = lastProject.id + 1;
                        projects.push(project);
                        setProjects(projects);
                        deferred.resolve({success: true});
                    }
                });
            return deferred.promise;
        }

        function Update(project) {
            var deferred = $q.defer();
            var projects = getProjects();
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].id === project.id) {
                    projects[i] = project;
                    break;
                }
            }
            setProjects(projects);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();
            var projects = getProjects();
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                if (project.id === id) {
                    projects.splice(i, 1);
                    break;
                }
            }
            setProjects(projects);
            deferred.resolve();
            return deferred.promise;
        }

        function getProjects() {
            if (!localStorage.projects) {
                localStorage.projects = JSON.stringify([]);
            }
            return JSON.parse(localStorage.projects);
        }

        function setProjects(projects) {
            localStorage.projects = JSON.stringify(projects);
        }
    }
})();