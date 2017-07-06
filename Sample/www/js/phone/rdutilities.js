var rDUtilities = (function(window){
		
	//global
		
	function checkLocation(){
		navigator.geolocation.getCurrentPosition(onSuccessLoc, onErrorLoc, { 
					maximumAge: 10000,
				 	timeout: 10000,
				 	enableHighAccuracy: false
				});

		
	}
	function createArray(length){
		var labelArray = [];

		for (var i = 0; i < length; i++){
			labelArray.push("");

		}
		return labelArray;
	}	
	function refreshPage() {
		//reftesh page
	  jQuery.mobile.pageContainer.pagecontainer('change', window.location.href, {
		allowSamePageTransition: true,
		transition: 'none',
		reloadPage: true 
		// 'reload' parameter not working yet: //github.com/jquery/jquery-mobile/issues/7406
	  });
	}	
	function showLoadingMessage(msg, theme,txtOnly){
		$.mobile.loading("show",{
		 		text:msg,
		 		textVisible:true,
		 		theme:theme,
				textonly:txtOnly
		});
	}
	function hideLoadingMessage(timeDelay){
		setTimeout(function(){
		   $.mobile.loading("hide");
				  
		},timeDelay);
	 }
	 function setConfirm(msg,title,btn1,btn2,btn3,fn){
		 
		   if(navigator.notification){			
				navigator.notification.confirm (							
					msg,  			// message
            		fn,      		// callback to invoke with index of button pressed
            		title, 			// title
            		[btn1,btn2,btn3]// buttonLabels
				);						
				
			}else{					
				alert(title+"\n"+msg);
			}	
	  
	 }
	 function alertDismissed(){
				console.log("Ok dismissed");
	 }
	 function setNotification(msg,title){
		  if(navigator.notification){
			  navigator.notification.alert (			  		
				msg,
				alertDismissed,
				title,
				'ok'
			  );						
			
		  }else{					
				alert(title+"\n"+msg);
		  }	
	}	
	function generateUUID() {
        // code to generate a unique number
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }	
	function getDateTimeNow(){
		var currentdate = new Date(); 
		var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + " : "
				+ currentdate.getMilliseconds();
				
		return datetime;
	}	
    function msTimeToString(timeMs) {
        var t = new Date(parseInt(timeMs));
        var year = t.getFullYear();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = months[t.getMonth()];
        var date = t.getDate();
        var hours = t.getHours();
        var hrs = hours > 9 ? hours : "0" + hours;
        var minutes = t.getMinutes();
        var mins = minutes > 9 ? minutes : "0" + minutes;

        var returnTime = date + " " + month + " " + year + "-" + hrs + ":" + mins;
		
        return returnTime;
    }
	function secondsToString(Seconds){		
		var date = new Date(1970,0,1);
		date.setSeconds(Seconds); // specify value for SECONDS here			
		return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
		
	}
	function secondsToHms(d) {
			d = Number(d);
			var h = Math.floor(d / 3600);
			d %= 3600;
			var m = Math.floor(d / 60);
			var s = Math.floor(d % 60);
			return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
	}
	function secondsToStringShort(totalSeconds){
		var h,m,s;		
		h = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		m = Math.floor(totalSeconds / 60);
		s = Math.round((totalSeconds % 60)/10);
		return h +":" +  (m < 10 ? "0" : "") + m  +"."+s;		
	}
	
	function millisecondsToString(milliseconds) {
        var oneHour = 3600000;
        var oneMinute = 60000;
        var oneSecond = 1000;
        var seconds = 0;
        var minutes = 0;
        var hours = 0;
        var result;

        if (milliseconds >= oneHour) {
            hours = Math.floor(milliseconds / oneHour);
        }

        milliseconds = hours > 0 ? (milliseconds - hours * oneHour) : milliseconds;

        if (milliseconds >= oneMinute) {
            minutes = Math.floor(milliseconds / oneMinute);
        }

        milliseconds = minutes > 0 ? (milliseconds - minutes * oneMinute) : milliseconds;

        if (milliseconds >= oneSecond) {
            seconds = Math.floor(milliseconds / oneSecond);
        }

        milliseconds = seconds > 0 ? (milliseconds - seconds * oneSecond) : milliseconds;

        if (hours > 0) {
            result = (hours > 9 ? hours : "0" + hours) + ":";
        } else {
            result = "0:";
        }

        if (minutes > 0) {
            result += (minutes > 9 ? minutes : "0" + minutes) + ":";
        } else {
            result += "00:";
        }

        if (seconds > 0) {
            result += (seconds > 9 ? seconds : "0" + seconds);
        } else {
            result += "00";
        }

        return result;
    }
	function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

	
	
	return{
		checkLocation			: checkLocation,
		checkTime				: checkTime,
		createArray				: createArray,		
		showLoadingMessage		: showLoadingMessage,
		hideLoadingMessage		: hideLoadingMessage,
		setConfirm				: setConfirm,
		setNotification			: setNotification,
		generateUUID			: generateUUID,
		msTimeToString			: msTimeToString,		
		millisecondsToString	: millisecondsToString,
		secondsToString			: secondsToString,
		secondsToStringShort	: secondsToStringShort,
		secondsToHms			: secondsToHms,
		getDateTimeNow			: getDateTimeNow,		
		
	};
	
	
})(window);