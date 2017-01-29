(function(){

	'use strict'

	function TestDirective(){
		var linkFn = function(scope, element, attrs){
			
			element.append("<div class='col-md-12'id='chart_div'></div>");
			var nodes = scope.config.nodes;
			var links = scope.config.links;

			var height = 500;
			var subDataYPadding = 50, subDataXPadding = 5;
			var nodePaddingX = 100, nodePaddingY = 100;
			// Hash nodes againts their id
			var indexedNodesByid={};
			nodes.forEach(function(node){
				indexedNodesByid[node.id] = node;
			});

			// Uses the DFS to assign the node levels
			var findNodeLXPositions = function(){
				var i, j, n=links.length, m=nodes.length;

				// Identify all inward and outward links of a node
				for(i=0;i<n;i++){
					var source=null,target=null;
					for(j=0;j<m;j++){
						if(!source){
							source = (nodes[j] === indexedNodesByid[links[i].source.id])?nodes[j]:null;	
						}
						if(!target){
							target = (nodes[j]=== indexedNodesByid[links[i].target.id])?nodes[j]:null;	
						}
						if(source && target){
							if(!source.outwardLinks){
								source.outwardLinks = [];
							}

							if(!target.inwardLinks){
								target.inwardLinks = [];
							}
							source.outwardLinks.push(links[i]);
							target.inwardLinks.push(links[i]);	
							break;
						}
					}	
				}

				var x=1;
				var nonRootNodes = [];
				var unlinkedNodes = [];
				
				//	Identify all nodes x positions
				var updateLXPositions = function(nodes,lx){
					if(nodes.length == 0){
						return ;
					}
					var remainingNodes = [];
					nodes.forEach(function(node){
						if(!node.outwardLinks){
							node.lx = lx;
						}
						else {
							node.lx = lx;
							node.outwardLinks.forEach(function(link){
								remainingNodes.push(indexedNodesByid[link.target.id]);
							});
						}
					});
					updateLXPositions(remainingNodes,lx+1);
				}
				updateLXPositions(nodes,0);	
			}
			findNodeLXPositions();

			//Hash nodes based on their lx
			var indexedNodesBylx={};
			nodes.forEach(function(node){
				if(!indexedNodesBylx[node.lx]){
					indexedNodesBylx[node.lx] = [];
					indexedNodesBylx[node.lx].push(node);
				}
				else{
					indexedNodesBylx[node.lx].push(node);	
				}
			});

			// Assigns nodes x and dx to draw nodes
			var findNodeXPositions = function(n, nodePaddingX, width){
				var nodeWidth = (width-(n*nodePaddingX))/n;

				nodes.forEach(function(node,i){
					node.dx = nodeWidth;
					node.x = (nodeWidth+nodePaddingX)*(node.lx);
				});
			};
			findNodeXPositions(Object.keys(indexedNodesBylx).length, nodePaddingX, element.parent().prop("offsetWidth"));
			
			// Assigns node's dy and y positions
			var findNodeYPositions = function(nodePaddingY, height){
				angular.forEach(indexedNodesBylx,function(nodes,lx){
					nodes.sort(function(a,b){
						return a.id -b.id;
					});
					var nodeHeight = (height - (nodePaddingY*(nodes.length-1)))/nodes.length ;
					angular.forEach(nodes,function(node,i){
						node.dy = nodeHeight;
						node.ly = i;
						node.y = node.ly * (node.dy+nodePaddingY);
					});
				});
			};
			findNodeYPositions(nodePaddingY, height);

			// Assign x,dx,y and dy for subNodes within each node
			var subNodes = [];
			var findNodeSubDataPositions = function(subDataYPadding, subDataXPadding){
				nodes.forEach(function(node){
					var subNodeHeight = (node.dy - ((node.data.length) * subDataYPadding) )/(node.data.length);
					node.data.forEach(function(d, i){
						d.x = node.x + subDataXPadding;
						d.dx = node.dx - (subDataXPadding * 2);
						d.y = node.y+(subNodeHeight+subDataYPadding-2) * i + subDataYPadding;
						d.dy = subNodeHeight;
						subNodes.push(d);
					});
				});
				console.log(nodes);
			}
			findNodeSubDataPositions(subDataYPadding,subDataXPadding);
			
			//Uses d3 to draw the chart
			var drawChart = function(){
				var svg = d3
					.select('#chart_div')
					.append("svg")
					.attr("width",element.parent().prop("offsetWidth"))
					.attr("height",height);
				var nodesG = svg
					.append("g")
					.attr("id","nodes-g")
					.selectAll("rect")
					.data(nodes)
					.enter();

					nodesG
					.append("rect")
					.attr('x',function(d){return d.x})
					.attr('y',function(d){return d.y})
					.attr('width',function(d){return d.dx})
					.attr('height',function(d){return d.dy})
					.attr('fill',function(d){return "transparent"})
					.attr('stroke',function(d){return d.color});
					
					nodesG
					.append("text")
					.attr('text-anchor','middle')
					.attr('x',function(d){ return d.x+d.dx/2 })
					.attr('y',function(d){ return d.y + 15})
					.attr('font-family','Arial')
					.attr('font-size','12 px')
					.attr('fill','black')
					.text(function(d){
						return d.name;
					});

				var subNodesG = svg
					.append("g")
					.attr("id","sub-nodes-g")
					.selectAll("rect")
					.data(subNodes)
					.enter();

					subNodesG
					.append("rect")
					.attr('x',function(d){return d.x})
					.attr('y',function(d){return d.y})
					.attr('width',function(d){return d.dx})
					.attr('height',function(d){return d.dy})
					.attr('fill',function(d){return d.color})
					.attr('stroke',function(d){return d.color});

					subNodesG
					.append("text")
					.attr('text-anchor','middle')
					.attr('x',function(d){ return d.x+d.dx/2 })
					.attr('y',function(d){ return d.y+d.dy*0.67 })
					.attr('font-family','Arial')
					.attr('font-size','12 px')
					.attr('fill','white')
					.text(function(d){
						var returnString='';
						angular.forEach(d.data,function(s){
							returnString+=(s.name+' : '+s.value);
						});
						return returnString;
					});

					subNodesG
					.append("text")
					.attr('text-anchor','middle')
					.attr('x',function(d){ return d.x+d.dx/2 })
					.attr('y',function(d){ return d.y+d.dy*0.33})
					.attr('font-family','Arial')
					.attr('font-size','12 px')
					.attr('fill','white')
					.text(function(d){
						return d.name;
					});

				var linksG = svg
					.append("g")
			};
			drawChart();

		};

		linkFn.$inject = ['scope', 'element', 'attrs'];

		return {
			type:'AE',
			templateUrl:'views/testDirective.html',
			link:linkFn,
			scope:{
				config : '=config'
			}
		}
	}

	TestDirective.$inject = [];

	angular.module('ngSankeyApp')
		.directive('testDirective',TestDirective);

})();