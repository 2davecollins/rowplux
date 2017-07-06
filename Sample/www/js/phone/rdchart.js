var rDataCharting = (function(window){		
	
	var LineChart;
	var intervalChartRecord;
	var newPluxChart;	
	
	function startPlotting(time,ctx){
		var canvas = document.getElementById("pluxChart");
		var ctx = canvas.getContext('2d');
		var noPoints = 90;
		

		// Global Options:
		Chart.defaults.global.defaultFontColor = 'black';
		Chart.defaults.global.defaultFontSize = 16;			
		
		
		// var daArr = [];
		// for (var i = 0; i < noPoints; i++){
		// 	labelArray.push("");

		// }
		// for (var i = 0; i < 59; i++){
		// 	daArr.push(5);

		// }
		var labelArray = [0];
		console.log("1  :"+labelArray);
		var d1 = [0];
		var d2 = [0];
		var d3 = [0];
		var d4 = [0];

		var data = {
		labels:labelArray,
		datasets: [
			
			{
			label: "Ch 1",
			fill: true,
			lineTension: 0.1,
			backgroundColor: "rgba(167,105,0,0.4)",
			borderColor: "rgb(167, 105, 0)",
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: "white",
			pointBackgroundColor: "black",
			pointBorderWidth: 1,
			pointHoverRadius: 4,
			pointHoverBackgroundColor: "brown",
			pointHoverBorderColor: "yellow",
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			// notice the gap in the data and the spanGaps: false
			data:d1,
			spanGaps: false,
		},
		{
			label: "Ch 2",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(225,0,0,0.4)",
			borderColor: "red", // The main line color
			borderCapStyle: 'square',
			borderDash: [], // try [5, 15] for instance
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: "black",
			pointBackgroundColor: "white",
			pointBorderWidth: 1,
			pointHoverRadius: 8,
			pointHoverBackgroundColor: "yellow",
			pointHoverBorderColor: "brown",
			pointHoverBorderWidth: 2,
			pointRadius: 4,
			pointHitRadius: 10,
			// notice the gap in the data and the spanGaps: true
			data:d2,
			spanGaps: false,
		},
		{
			label: "Ch 3",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(225,0,0,0.4)",
			borderColor: "red", // The main line color
			borderCapStyle: 'square',
			borderDash: [], // try [5, 15] for instance
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: "black",
			pointBackgroundColor: "white",
			pointBorderWidth: 1,
			pointHoverRadius: 8,
			pointHoverBackgroundColor: "yellow",
			pointHoverBorderColor: "brown",
			pointHoverBorderWidth: 2,
			pointRadius: 4,
			pointHitRadius: 10,
			// notice the gap in the data and the spanGaps: true
			data:d3,
			spanGaps: false,
		},
		{
			label: "Ch 4",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(225,0,0,0.4)",
			borderColor: "red", // The main line color
			borderCapStyle: 'square',
			borderDash: [], // try [5, 15] for instance
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: "black",
			pointBackgroundColor: "white",
			pointBorderWidth: 1,
			pointHoverRadius: 8,
			pointHoverBackgroundColor: "yellow",
			pointHoverBorderColor: "brown",
			pointHoverBorderWidth: 2,
			pointRadius: 4,
			pointHitRadius: 10,
			// notice the gap in the data and the spanGaps: true
			data:d4,
			spanGaps:false,
		}
		

		]};
		var options = {
			scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						},
						scaleLabel: {
							display: false,							
							fontSize: 20 
						}
					}]            
			}  
		};

		// Chart declaration:
		var myPluxChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: options
		});
		

		function addData(chart, label, data1,data2) {
			chart.data.labels.push(label);
			chart.data.datasets[0].data.push(data1);
			chart.data.datasets[1].data.push(data2);			
			chart.update();
		}
		function removeData(chart){
			chart.data.labels.shift();
			chart.data.datasets[0].data.shift();
			chart.data.datasets[1].data.shift();

		}
		
		intervalChartRecord = setInterval(function(){
			
			
			setTimeout(function(){				
				d1 = vm.data1;
				d2 = vm.data2;
				d3 = vm.data3;
				d4 = vm.data4;				
				myPluxChart.data.datasets[0].data = d1;
				myPluxChart.data.datasets[1].data = d2;
				myPluxChart.data.datasets[2].data = d3;
				myPluxChart.data.datasets[3].data = d4;
				console.log("1  :"+vm.labels);
				myPluxChart.data.labels = vm.labels;
				myPluxChart.update();
			},time/2);			
		},time);

	}	
		
	function stopPlotting(){
		if(intervalChartRecord){
			clearInterval(intervalChartRecord);
			intervalChartRecord = null;
		}			
	}
	function startChart(){
		var canvas = document.getElementById("pluxChart");
		var ctx = canvas.getContext('2d');
	
		Chart.defaults.global.defaultFontColor = 'black';
		Chart.defaults.global.defaultFontSize = 16;			
		
		
		var labelArray = [0];
		console.log("1  :"+labelArray);		
		var d1 = [0];		

		var data = {
		labels:labelArray,
		datasets: [			
			{
				label: "Ch 1",
				fill: true,
				lineTension: 0.1,
				backgroundColor: "rgba(167,105,0,0.4)",
				borderColor: "rgb(167, 105, 0)", //main color
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "white",
				pointBackgroundColor: "black",
				pointBorderWidth: 1,
				pointHoverRadius: 4,
				pointHoverBackgroundColor: "brown",
				pointHoverBorderColor: "yellow",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,		
				data:d1,
				spanGaps: false,
			},
			

		]};
		var options = {
			scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						},
						scaleLabel: {
							display: false,							
							fontSize: 20 
						}
					}]            
			}  
		};

		// Chart declaration:
		newPluxChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: options
		});			
		

	}
	function upDateChart(){
						
		newPluxChart.data.datasets[0].data = vm.data1;			
		newPluxChart.data.labels = vm.labels;
		newPluxChart.update();

	}
	
	return{
	
		startPlotting	: startPlotting,
		stopPlotting	: stopPlotting,
		upDateChart		: upDateChart,
		startChart		: startChart
		
		
	};
	
	
})(window);