var vm;
var macAddress = "00:07:80:D8:AB:52";
var loop;
var ctxLine = $("#pluxChart");
var ts,d;
var app = {
    initialize: function() {
        this.bindEvents();
        this.setupVue();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        setTimeout(function(){
             vm.hasPermissions();
             vm.clock();
        },500)
       
    },
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    setupVue: function() {
        vm = new Vue({
            el: "#vue-instance",
            data: {
                randomWord: '',
                name:'dave',
                device:'default',
                paired:[],
                biopluxDevices:[],                
                data1:[],               
                labels:[],
                timestamp:[],
                status:'',
                error: '',
                isBluetoothOn: 0,
                ch1:0,
                ch2:0,
                ch3:0,
                ch4:0,
                clockDisplay:'',
                a:1
                
            },
            methods: {
                selectDevice: function(addressMac){
                    var defaultAddress = addressMac;
                    console.log(defaultAddress);
                    vm.device = defaultAddress;
                    macAddress = addressMac;
                    vm.connect(macAddress);

                },
                hasPermissions: function(){
                    vm.status = "";
                    vm.error = "";
                    rowplux.hasPermissions(function(msg){
                        vm.message = msg.message;
                        if(msg.status){
                            console.log("permissions state "+msg.status);
                            vm.isEnabled(); 
                        }
                       
                        
                    })

                },
                isEnabled: function(){
                    vm.status = "";
                    vm.error = "";
                    rowplux.isEnabled(function(msg){
                        vm.status = msg.message;
                        if(msg.bluetoothOn != null){
                                 $("#bthOn").prop("checked",msg.bluetoothOn).checkboxradio("refresh"); 
                        }
                        if(msg.pluxConn != null){
                            $("#isConn").prop("checked",msg.pluxConn).checkboxradio("refresh"); 
                        }
                        
                    })

                },
              
                scan: function() {
                    vm.status="";
                    vm.error = "";
                    vm.biopluxDevices = [];
                    vm.paired = []                  
                    rowplux.scan(function(msg){
                        vm.biopluxDevices.push(msg);

                        },function(err){
                        vm.error = err.message;
                        }                  
                    );                 
                   
                },
                bthOn: function(){
                    vm.status = "";
                    vm.error = "";                   
                    rowplux.startBluetooth(                                              
                        function(msg){
                            console.log("Bluetooth on");
                            vm.status = msg.message;
                            console.log("Bluetooth on :"+msg.status);
                             if(msg.bluetoothOn != null){
                                 $("#bthOn").prop("checked",msg.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(msg.pluxConn != null){
                                $("#isConn").prop("checked",msg.pluxConn).checkboxradio("refresh"); 
                            }                   
                           
                        },function(err){
                            console.log("Bluetooth on error"+err.status);
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }                                                
                        }                      
                    );
                },
                bthOff: function(){                  
                    vm.status = "";
                    vm.error = "";
                    rowplux.stopBluetooth(
                       
                        function(msg){
                           
                            vm.status = msg.message;
                             if(msg.bluetoothOn != null){
                                 $("#bthOn").prop("checked",msg.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(msg.pluxConn != null){
                                $("#isConn").prop("checked",msg.pluxConn).checkboxradio("refresh"); 
                            }
                        },function(err){
                           
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }                            

                        }
                      
                    );
                },
                pairedDevices: function(){                   
                    vm.status="";
                    vm.error = "";
                    vm.biopluxDevices = [];
                    vm.paired = []   
                    rowplux.findPairedDevices(                       
                        function(msg){
                            console.log("paired devices "+msg.address);
                            vm.paired.push(msg);
                        },function(err){
                            console.log("Bluetooth off err");
                            vm.error = err.message;
                        }
                       
                    );
                },
                unPair: function(){
                    var params = {
                        "address": macAddress
                    };
                    vm.status="";
                    vm.error = "";                    
                    vm.biopluxDevices = [];
                    vm.paired = []   
                    rowplux.unPairDevice(                       
                        function(msg){
                            console.log("unpaired devices ");
                            vm.status = msg.message;
                            
                        },function(err){                            
                            vm.error = err.message;
                        },params
                    );
                },               
                connect : function(){
                     var params = {
                        "address": macAddress,
                        "showMessages":true
                    };
                    vm.status="";
                    vm.error ="";
                    rowplux.connect(                        
                        function(msg){
                            console.log("Description :"+msg.message);
                             vm.status = msg.message;
                            if(msg.bluetoothOn != null){
                                 $("#bthOn").prop("checked",msg.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(msg.pluxConn != null){
                                $("#isConn").prop("checked",msg.pluxConn).checkboxradio("refresh"); 
                            }

                        },function(err){
                            console.log("Error :"+err.message);
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }                            

                        },params
                    );

                },
                disconnect: function(){
                    
                    vm.status="";
                    vm.error ="";                   
                    rowplux.disconnect(                        
                        function(msg){
                            console.log("Description :"+msg.status);
                            vm.status = msg.message;
                            if(msg.bluetoothOn != null){
                                 $("#bthOn").prop("checked",msg.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(msg.pluxConn != null){
                                $("#isConn").prop("checked",msg.pluxConn).checkboxradio("refresh"); 
                            }

                        },function(err){
                            console.log("Error :"+err.status);
                            vm.error = err.message;
                             if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            } 

                        }                       
                    );

                },
                getVersion:function(){                  
                    vm.status="";
                    vm.error ="";
                    rowplux.getVersion(                       
                        function(msg){
                            console.log("Version :"+msg.status);
                             vm.status = msg.message;

                        },function(err){
                            console.log("Error :"+err);
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }                            


                        }                    
                    );
                },
                getBattery:function(){                   
                    vm.status="";
                    vm.error ="";
                    rowplux.getBattery(                       
                        function(msg){
                            console.log("Battery :"+msg.battery);
                             vm.status = msg.battery;

                        },function(err){
                            console.log("Error :"+err);
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }
                        }                        
                    );
                },
                getDescription:function(){                   
                    vm.status="";
                    vm.error ="";
                    rowplux.getDescription(                       
                        function(msg){
                            console.log("Description :"+msg.message);
                             vm.status = msg.message;

                        },function(err){
                            console.log("Error :"+err.message);
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }
                        }
                    );
                },
                clock: function(){
                     var today = new Date(),
                        h = rDUtilities.checkTime(today.getHours()),
                        m = rDUtilities.checkTime(today.getMinutes()),
                        s = rDUtilities.checkTime(today.getSeconds());
                        vm.clockDisplay = h + ":" + m + ":" + s;
                        t = setTimeout(function () {
                            vm.clock();
                        }, 500)

                },               
                startRecording: function(){
                    rDataCharting.startChart();
                    var ch = $("input[name='ch-select']:checked").val();
                    console.log("Channel "+ch);

                    var params = {
                        "address": macAddress,
                        "channel":ch,
                        "sensitivity":1
                    };
                    vm.status="";
                    vm.error ="";
                    rowplux.startRecording(
                        function(msg){
                             vm.data1 = JSON.parse(msg.analogData);                                                      
                             ts = JSON.parse(msg.timestamp);
                             ts = ts[0];
                             d = new Date(ts);

                             //TODO
                            //console.log(ts+ "  :  "+d.getSeconds());
                            //console.log("length"+vm.data1.length+" :"+msg.sequence);
                            //console.log("Data :"+vm.data1);

                             vm.labels = rDUtilities.createArray(vm.data1.length);                             
                             rDataCharting.upDateChart();

                        },
                        function(err){
                            vm.error = err.message;
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            } 
                        },params
                    );
                     

                },
                stopRecording: function(){                  
                    vm.status="";
                    vm.error ="";
                    rowplux.stopRecording(
                        function(msg){
                            console.log(msg.message);
                            vm.status = msg.message;                          

                        },
                        function(err){ 

                            if(err.message){
                                 vm.error = err.message;
                            }                                  
                           
                            if(err.bluetoothOn != null){
                                 $("#bthOn").prop("checked",err.bluetoothOn).checkboxradio("refresh"); 
                            }
                            if(err.pluxConn != null){
                                $("#isConn").prop("checked",err.pluxConn).checkboxradio("refresh"); 
                            }  

                        }                     
                    );

                }                
            }
        });
    }
};

app.initialize();
