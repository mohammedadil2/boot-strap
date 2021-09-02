var REST_API = 'rest/v2/';
var PARTIALS_URI = 'bootstrap/templates/';
var dashApp   = angular.module('dashApp', ['ngResource']);

dashApp.run(['$rootScope', '$resource', '$location', function($rootScope, $resource, $location) {
	$rootScope.Drug = $resource(REST_API + 'rest/drugs/:Id', {Id:'@id'});
}]);

/** Controllers */
dashApp.controller('drugsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
	// scope stuff
	$scope.drugs 	 = $rootScope.Drug.query(function() {
			console.log($scope.drugs);
		});
}]);
/** ./Controllers */
