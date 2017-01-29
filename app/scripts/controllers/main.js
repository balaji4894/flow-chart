'use strict';

/**
 * @ngdoc function
 * @name ngSankeyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngSankeyApp
 */
angular.module('ngSankeyApp')
  .controller('MainCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.configData = {
    	nodes:[{
	    	name:"Step1",
	    	id:0,
	    	data:[{
	    		id:0,
	    		name:'Substep1',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	},{
	    		id:1,
	    		name:'Substep2',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	}],
	    	color:'brown'
	    },{
	    	name:"Step2",
	    	id:1,
	    	data:[{
	    		id:0,
	    		name:'Substep1',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	},{
	    		id:0,
	    		name:'Substep2',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	}],
	    	color:'grey'
	    },{
	    	name:"Step3",
	    	id:2,
	    	data:[{
	    		id:0,
	    		name:'Substep1',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	},{
	    		id:1,
	    		name:'Substep1',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'red'
	    	}],
	    	color:'brown'
	    },{
	    	name:"Step4",
	    	id:3,
	    	data:[{
	    		id:0,
	    		name:'Substep1',
	    		data:[{
	    			name:"value",
	    			value:20
	    		}],
	    		color:'green'
	    	}],
	    	color:'brown'
	    }],

	    links:[{
	    	source:{
	    		id:0,
	    		name:"Step1"
	    	},
	    	target:{
	    		id:1,
	    		name:"Step2"
	    	},
	    	value:100
	    },{
	    	source:{
	    		id:0,
	    		name:"Step1"
	    	},
	    	target:{
	    		id:2,
	    		name:"Step3"
	    	},
	    	value:100
	    },{
	    	source:{
	    		id:1,
	    		name:"Step2"
	    	},
	    	target:{
	    		id:2,
	    		name:"Step3"
	    	},
	    	value:100
	    },{
	    	source:{
	    		id:1,
	    		name:"Step2"
	    	},
	    	target:{
	    		id:3,
	    		name:"Step4"
	    	},
	    	value:100
	    }]
    };

  });
