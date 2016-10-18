var myApp = angular.module('ngApp', ['ngRoute','ui.router','ngResource','ui.bootstrap'])

	.config(['$stateProvider',
             '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {
				 $urlRouterProvider.otherwise("/home");
				 
				 $stateProvider
					.state('home', {
						url: "/home",
						title: "Home",
						templateUrl: "views/home.html",
						controller : "HomePageController"
					})
			 }
		 ])
	.controller('MyCtrl', function() {

	})
	.controller('HomePageController', function($scope,$resource,$http,SessionService,$uibModal,$log) {
		$scope.selectedTask={};
		$scope.isTaskSelected = false;
		$scope.comment={
			text:"",
			timestamp:""
		};
		if(SessionService.get("taskList") != null || SessionService.get("taskList") != undefined){
			$scope.currentTask = SessionService.get("taskList");
		}
		else{
			$scope.currentTask = [];
		}
		
		
		$scope.addTask = function(){
			console.log("Test");
			var modalInstance = $uibModal.open({
			  animation: true,
			  templateUrl: 'views/add-task-dialog.html',
			  controller: 'addTaskDialogController',
			  size: 'lg'
			});

			modalInstance.result.then(function (taskData) {
			  console.log("TAsk Data "+JSON.stringify(taskData));
			  $scope.currentTask.push(taskData);
			  SessionService.set("taskList",$scope.currentTask);
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};
		  
		$scope.completeTask = function(task){
			task.status="complete";
		}
		
		$scope.selectTask = function(task){
			$scope.selectedTask=task;
			$scope.isTaskSelected = true;
			$scope.clearCommentBox();
		}
		
		$scope.addComment = function(comment){
			$scope.comment.timestamp = new Date();
			console.log("Comment "+JSON.stringify($scope.comment));
			$scope.selectedTask.comments.push({
				text:comment,
				timestamp: new Date()
			});
			SessionService.set("taskList",$scope.currentTask);
			$scope.clearCommentBox();
		}
		$scope.clearCommentBox = function(){
			$scope.comment.text = "";
			$scope.comment.timestamp = "";
		}
	})
	
	.controller('addTaskDialogController', function($scope,$uibModalInstance) {
		$scope.taskData = {
			title:"",
			description:"",
			status:"open",
			comments:[]
		};
		$scope.addTask = function(){
			$uibModalInstance.close($scope.taskData);
		};
		
		$scope.cancelDialog= function(){
			$uibModalInstance.dismiss('cancel');
		}
	})
	
	.factory("SessionService", ['$window', function($window) {
			return {
				set:function(key, val) {
						$window.localStorage.setItem(key, JSON.stringify(val));
					},
				get: function(key) {
						var str = $window.localStorage.getItem(key);
						var result = undefined;
						try {
							result = str ? JSON.parse(str) : result;
						}
						catch (e) {
							console.log('Parse error for localStorage ' + key);
						}
						return result;
					},
				unset: function(key) {
						$window.localStorage.removeItem(key);
					},
			}
		}
	])
	.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });