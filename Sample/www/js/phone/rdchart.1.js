var rDataCharting = (function(window){		
	
	var LineChart;
	var intervalChartRecord;	
	
	function startPlotting(time,ctxLine1){
		var core;
		var d,d1,d2,d3,d4;		
		var framePerSeconds = 30;
		var chartTime = time/framePerSeconds;
		
		
		
		var colorBG1 = "rgba(75,192,192,0.4)";
		var colorBorder1 = "rgba(75,192,192,1)";
		var colorBG2 = "rgba(255, 0, 0, 0.2)";
		var colorBorder2 = "rgba(255, 0, 0, 1)";
		var colorBG3 = "rgba(0, 128, 0, 0.2)";
		var colorBorder3 = "rgba(0, 128, 0, 1)";
		var colorBG4 = "rgba(153, 102, 255, 0.2)";
		var colorBorder4 = "rgba(153,102,255,1)";
				
		var LineChart = createLineChart (dataArrayLabels,dataArray1,0,colorBG1,colorBorder1,ctxLine1);
	
				
		LineChart1.render();
					
		
		intervalChartRecord = setInterval( function(){			
			ch1 = vm.ch1    || 0;			
			ch2 = vm.ch2    || 0;
            ch3 = vm.ch3    || 0;			
			ch4 = vm.ch4    || 0;
			
		
			// 1 channel 1
			// 2 channel 2
			// 3 channel 3
			// 4 channel 4		
			
			dataSource[0] = ch1;
			dataSource[1] = ch2;
			dataSource[2] = ch3;
			dataSource[3] = ch4;
			
			
			elements = [ch1,ch2,ch3,ch4];			
			LineChart.config.data.datasets[0].data.push(elements[0]);
			//LineChart2.config.data.datasets[0].data.push(elements[1]);
			//LineChart3.config.data.datasets[0].data.push(elements[2]);
			//LineChart4.config.data.datasets[0].data.push(elements[3]);
			
			if(count == xaxis){
				//var Start = count;
				//var End = count + k;
				j++;
				k = j +1;
				l = k +1;
						
							
				var ArrayData1 = LineChart1.config.data.datasets[0].data;
				//var ArrayData2 = LineChart2.config.data.datasets[0].data;
				//var ArrayData3 = LineChart3.config.data.datasets[0].data;
				//var ArrayData4 = LineChart4.config.data.datasets[0].data;
				
				
				
				dataArray1 = ArrayData1.slice(30);
				//dataArray2 = ArrayData2.slice(30);
				//dataArray3 = ArrayData3.slice(30);
				//dataArray4 = ArrayData4.slice(30);
							
				dataArrayL1 = [];
				//dataArrayL2 = [];
				//dataArrayL3 = [];
				//dataArrayL4 = [];
				console.log(dataArrayLabels);
					
				
				
				if(chartDur === 0){
					console.log("Piece Complete");
					
				}else if(chartDur == 1){
										
					console.log("1 min ");
					tempArray = fillArray(59,"");
					tempArray1 = setXAxis(tempArray, 10, j-1,true);
					tempArray1 = tempArray1.slice(30);
					tempArray2 = fillArray(29,"");
					tempArray3 = setXAxis(tempArray2, 10,j,false);
					//console.log("******   "+tempArray1.length+"  "+tempArray3.length);
					dataArrayLabels = tempArray1.concat(tempArray3);				
					//console.log(dataArrayLabels.length);
					
					xaxis += 30;
					
					
				}else if(chartDur == 2){
					console.log("5 min ");
					tempArray = fillArray(180,"");
					//console.log("Fill array count :"+count);
					dataArrayLabels = fillXAxis(tempArray,count);										
					xaxis += 180;
					
					
				}else if(chartDur == 3){
					console.log("10 min ");
					
					
				}else if(chartDur == 4){
					console.log("30 min ");
					
					
				}else if(chartDur == 5){
					
				}
								
				LineChart1.destroy();
				
				
				LineChart1 = createLineChart (dataArrayLabels,dataArrayL1,0,colorBG1,colorBorder1,ctxLine1);
				//LineChart2 = createLineChart (dataArrayLabels,dataArrayL2,1,colorBG1,colorBorder2, ctxLine2 );
				//LineChart3 = createLineChart (dataArrayLabels,dataArrayL3,2,colorBG1,colorBorder3, ctxLine3 );
				//LineChart4 = createLineChart (dataArrayLabels,dataArrayL4,3,colorBG1,colorBorder4, ctxLine4 );
				
				
						
				LineChart1.render();
				//LineChart2.render();
				//LineChart3.render();
				//LineChart4.render();
				
				updateDataGraph(LineChart1,dataArray1);
				//updateDataGraph(LineChart2,dataArray2);
				//updateDataGraph(LineChart3,dataArray3);
				//updateDataGraph(LineChart4,dataArray4);
					
				
			}else{
			
				LineChart1.update();
				//LineChart2.update();
				//LineChart3.update();
				//LineChart4.update();
			}
				
			count++; 
			
		},time);
	
		return intervalChartRecord;
		
	}
	function updateDataGraph(LineChart,arrayDataIn){
		for(var i=0; i<arrayDataIn.length; i++){
			LineChart.config.data.datasets[0].data.push(arrayDataIn[i]);
			LineChart.update();
		}
		
	}
	function updateLine(dataArray1,dataArray2){
		// labels: ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"],
		
		var dataSrc ={
    		labels: ["","", "", "", "", "", "", "", "", "0"],
    		datasets: [{
            	label: "CH 1",
            	fill: false,
            	lineTension: 0.1,
            	backgroundColor: "rgba(75,192,192,0.4)",
            	borderColor: "rgba(75,192,192,1)",
            	borderCapStyle: 'butt',
            	borderDash: [],
            	borderDashOffset: 0.0,
            	borderJoinStyle: 'miter',
            	pointBorderColor: "rgba(75,192,192,1)",
            	pointBackgroundColor: "#fff",
            	pointBorderWidth: 1,
            	pointHoverRadius: 5,
            	pointHoverBackgroundColor: "rgba(75,192,192,1)",
            	pointHoverBorderColor: "rgba(220,220,220,1)",
            	pointHoverBorderWidth: 2,
            	pointRadius: 1,
            	pointHitRadius: 10,
            	data: dataArray1
        		},
				{
            	label: "CH 2",
            	fill: false,
            	lineTension: 0.1,
            	backgroundColor: "rgba(255, 99, 132, 0.2)",
            	borderColor: "rgba(255,99,132,1)",
            	borderCapStyle: 'butt',
            	borderDash: [],
            	borderDashOffset: 0.0,
            	borderJoinStyle: 'miter',
            	pointBorderColor: "rgba(255,99,132,1)",
            	pointBackgroundColor: "#fff",
            	pointBorderWidth: 1,
            	pointHoverRadius: 5,
            	pointHoverBackgroundColor: "rgba(75,192,192,1)",
            	pointHoverBorderColor: "rgba(220,220,220,1)",
            	pointHoverBorderWidth: 2,
            	pointRadius: 1,
            	pointHitRadius: 10,
            	data: dataArray2
        		},
				{
            	label: "CH 3",
            	fill: false,
            	lineTension: 0.1,
            	backgroundColor: "rgba(255, 206, 86, 0.2)",
            	borderColor: "rgba(255,99,132,1)",
            	borderCapStyle: 'butt',
            	borderDash: [],
            	borderDashOffset: 0.0,
            	borderJoinStyle: 'miter',
            	pointBorderColor: "rgba(255, 206, 86, 1)",
            	pointBackgroundColor: "#fff",
            	pointBorderWidth: 1,
            	pointHoverRadius: 5,
            	pointHoverBackgroundColor: "rgba(75,192,192,1)",
            	pointHoverBorderColor: "rgba(220,220,220,1)",
            	pointHoverBorderWidth: 2,
            	pointRadius: 1,
            	pointHitRadius: 10,
            	data: dataArray2
        		},
				{
            	label: "CH 4",
            	fill: false,
            	lineTension: 0.1,
            	backgroundColor: "rgba(75, 192, 192, 0.2)",
            	borderColor: "rgba(255,99,132,1)",
            	borderCapStyle: 'butt',
            	borderDash: [],
            	borderDashOffset: 0.0,
            	borderJoinStyle: 'miter',
            	pointBorderColor: "rgba(75, 192, 192, 1)",
            	pointBackgroundColor: "#fff",
            	pointBorderWidth: 1,
            	pointHoverRadius: 5,
            	pointHoverBackgroundColor: "rgba(75,192,192,1)",
            	pointHoverBorderColor: "rgba(220,220,220,1)",
            	pointHoverBorderWidth: 2,
            	pointRadius: 1,
            	pointHitRadius: 10,
            	data: dataArray2
        		}]			
		};
		
		return dataSrc;
		
	}
	function fillArray(N,char){
		var arr = new Array(N).join().split(',').map(function(item, index){ return char;});
		return arr;
		
	}
	function setXAxis(ArrayIn, interval,mins,initial){
		var sec;
		for(var i = 0; i<ArrayIn.length; i++){
			sec = i < 10 ? "0"+i : i;
			if(i%interval === 0){
				ArrayIn[i] = mins+":"+sec;
			}
			
		}
		if(initial){
			ArrayIn.push(mins+":"+59);
		}else{
			ArrayIn.push(mins+":"+29);
		}
			
		return ArrayIn;
		
	}
	function fillXAxis (tempArray,index){
		
		tempArray[0] = index;
		tempArray[60-1] = index + 1;
		tempArray[120-1] = index +2;
		tempArray[180-1] = index +3;
		//tempArray[210] = index +4;
		
		return tempArray;	
		
	}
	
	function upDateLabels(Num, Start, End){
		//var array1 = [End.toString()];
		var array0 = [End.toString()];
		var array1 = fillArray(2*Num/3,"");
		var array2 = [Start.toString()];
		var array3 = fillArray((Num/3),"");
		
		
		var array4 = array0.concat(array1);
		array4 = array4.concat(array2);
		array4 = array4.concat(array3);
		console.log(array4);
		
		return array4;
	}
	
	function createLineChart (dataArrayLabels,dataArray,labelNo,colorBG,colorBorder, ctxLine ){
		var labels = getLabelsArray();
		var optionLine =  {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true,
							display: true
						}
					}]
				},
				 tooltips : {
					enabled: false      
				}
		};
		var dataSrc = updateLineGeneric(dataArrayLabels,dataArray,labels[labelNo],colorBG,colorBorder);
		
				
		return new Chart(ctxLine, { type: 'line',data: dataSrc,	options: optionLine });
	}
	
	function updateLineGeneric(dataArralLabels,dataArray,label,bgColor,borderColor){
		
				
		var dataSrc ={
    		labels: dataArralLabels,
    		datasets: [{
            	label: label,
            	fill: false,
            	lineTension: 0.1,
            	backgroundColor: bgColor,
            	borderColor: borderColor,
            	borderCapStyle: 'butt',
            	borderDash: [],
            	borderDashOffset: 0.0,
            	borderJoinStyle: 'miter',
            	pointBorderColor: "rgba(75,192,192,1)",
            	pointBackgroundColor: "#fff",
            	pointBorderWidth: 1,
            	pointHoverRadius: 5,
            	pointHoverBackgroundColor: "rgba(75,192,192,1)",
            	pointHoverBorderColor: "rgba(220,220,220,1)",
            	pointHoverBorderWidth: 2,
            	pointRadius: 1,
            	pointHitRadius: 10,
            	data: dataArray
        		}]			
		};
		
		return dataSrc;
		
	}	
		
	function stopPlotting(interval){	
		
	
		
		var dataEmptyArray = [0,0,0,0,0,0,0,0,0,0];
		if(LineChart){
			dataEmptyArray = [0,0,0,0,0,0,0,0,0,0];
		
			LineChart1.config.data.datasets[0].data = dataEmptyArray;
			LineChart.config.data.datasets[1].data = dataEmptyArray;
			LineChart.update();
		}
		
		clearInterval(intervalChartRecord);
		intervalChartRecord = null;
		console.log("Chart stop");
			
			
	}
	
	
	return{
	
		startPlotting	: startPlotting,
		stopPlotting	: stopPlotting
		
		
	};
	
	
})(window);