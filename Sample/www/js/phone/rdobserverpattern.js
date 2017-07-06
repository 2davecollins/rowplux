function ArrayList(){
	//initialize with an empty array
	this.aList = []; 
}
				
ArrayList.prototype.Count = function(){
	return this.aList.length;
};
				
ArrayList.prototype.Add = function( object ){
	 //Object are placed at the end of the array
	return this.aList.push( object );
	
};

ArrayList.prototype.GetAt = function( index ) {
	//Index must be a number
	if( index > -1 && index < this.aList.length )
		return this.aList[index];
	else
		return undefined; //Out of bound array, return undefined
};
				
ArrayList.prototype.Clear = function(){
	this.aList = [];
};

ArrayList.prototype.RemoveAt = function ( index ) {
	// index must be a number

	var m_count = this.aList.length;
			
	if ( m_count > 0 && index > -1 && index < this.aList.length ){
		switch( index ){
			case 0:
				this.aList.shift();
				break;
			case m_count - 1:
				this.aList.pop();
				break;
			default:
				var head   = this.aList.slice( 0, index );
				var tail   = this.aList.slice( index + 1 );
				this.aList = head.concat( tail );
				break;
		}
	}
};

ArrayList.prototype.Insert = function ( object, index ){
	var m_count       = this.aList.length;
	var m_returnValue = -1;
			
	if ( index > -1 && index <= m_count ){
		switch(index){
			case 0:
				this.aList.unshift(object);
				m_returnValue = 0;
				break;
			case m_count:
				this.aList.push(object);
				m_returnValue = m_count;
				break;
			default:
				var head      = this.aList.slice(0, index - 1);
				var tail      = this.aList.slice(index);
				this.aList    = this.aList.concat(tail.unshift(object));
				m_returnValue = index;
				break;
		}
	}
					
	return m_returnValue;
};

ArrayList.prototype.IndexOf = function( object, startIndex ){
	var m_count       = this.aList.length;
	var m_returnValue = - 1;
			
	if ( startIndex > -1 && startIndex < m_count ){
		var i = startIndex;
				
		while( i < m_count ){
			if ( this.aList[i] == object ){
				m_returnValue = i;
				break;
			}
					
			i++;
		}
	}
	return m_returnValue;
};
				
				
ArrayList.prototype.LastIndexOf = function( object, startIndex ){
	var m_count       = this.aList.length;
	var m_returnValue = - 1;
	if ( startIndex > -1 && startIndex < m_count ){
		var i = m_count - 1;
		while( i >= startIndex ){
			if ( this.aList[i] == object ){
				m_returnValue = i;
				break;
			}
			i--;
		}
	}
	return m_returnValue;
};
/*
*	Observer
*
*/
		
function Observer(){
	this.Update = function(){
		//return;
	};
}

/*
*
*	Subject
*/

function Subject(){
	this.observers = new ArrayList();
}

Subject.prototype.Notify = function( context ){
	var m_count = this.observers.Count();
			
	for( var i = 0; i < m_count; i++ )
		this.observers.GetAt(i).Update( context );
};

Subject.prototype.AddObserver = function( observer ){
	if( !observer.Update )
		throw 'Wrong parameter';
	this.observers.Add( observer );
};

Subject.prototype.RemoveObserver = function( observer ){
	if( !observer.Update )
		throw 'Wrong parameter';
   
	this.observers.RemoveAt(this.observers.IndexOf( observer, 0 ));
};

/*
*
*	Add Inheritance
*/		

function inherits(base, extension){
	for (var property in base){
		try	{
			extension[property] = base[property];
		}catch(warning){
		}
	}
}

var Observable = {
    observers: []
  , addObserver: function(topic, observer) {
      this.observers[topic] || (this.observers[topic] = []);

      this.observers[topic].push(observer);
    }
  , removeObserver: function(topic, observer) {
      if (!this.observers[topic])
        return;

      var index = this.observers[topic].indexOf(observer);

      if (~index) {
        this.observers[topic].splice(index, 1);
      }
    }
  , notifyObservers: function(topic, message1,message2) {
      if (!this.observers[topic])
        return;

      for (var i = this.observers[topic].length - 1; i >= 0; i--) {
        this.observers[topic][i](message1,message2);
      }
    }
  };

Observable.addObserver('startRecording', function(time1, time2){
	console.log("Start Recording observer:" + time1 + " : "+time2);
	intervalRecording	= rDataMapping.startRecording(time1);
	intervalPlotting	= rDataCharting.startPlotting(time2);
	intervalStorage		= rDataStorage.startStorage(time1);
	intervalSimulation	= rDataSimulation.startPlotting(time2);
	intervalFirebase	= rDataFirebase.startFirebaseUpdate(time2);
	//intervalFirebase	= rDataFirebase.startFirebaseUpdate(10000);
  
});

Observable.addObserver('stopRecording', function(){
	
	console.log("Stop Recording observer :");
    rDataMapping.stopRecording(intervalRecording);
	rDataStorage.stopStorage(intervalStorage);
	rDataCharting.stopPlotting(intervalPlotting);
	rDataSimulation.stopPlotting(intervalSimulation);
	rDataFirebase.stopFirebaseUpdate(intervalFirebase);
	  
});

