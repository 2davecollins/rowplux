# rowplux
This plugin allows cordova application to use the biosignalsplux api on an Android device 

## Requirements
cordova android version 4.0 or greater
android version 5.0 or greater

## Installation
[//]: # (TODO Add url)

cordova plugin add

## Methods
* isEnabled
* scan
* startBluetooth
* stopBluetooth
* findPairedDevices
* unPairDevice
* connect
* disconnect
* getDescription
* getVersion
* getBattery
* startRecording
* stopRecording

### isEnabled
This call will check if Bluetooth is enabled it will also check if geolocation permission has been granted.
A request to turn on permission may be prompted. A message will return if permission is denied by the user this is applicable for android marshmallow and later.

rowplux.isEnabled(isEnabledSuccess);

No error callback. 
No params required.

success data {
    type:"isEnabled",
    bluetoothOn:true or false,
    message:Bluetooth on or Bluetooth off
}


### scan
This call will check for any devices that contain the character "plux" in the name.
No params are required.

rowplux.scan(scanSuccess,scanError);

The scanSuccess callback contains the information
    {
        type:"scan",
        deviceName:"Device name",
        address:"mac address"
    }

The error callback returns

    {
        bluetoothOn:false
        message:"Error Message"
    }


### startBluetooth
This call will allow bluetooth to be switched on.
No params are required.

rowplux.startBluetooth(startBluetoothSuccess,startBluetoothError);

The startBluetoothSuccess callback contains the information

    {
        type:"startBluetooth",
        message:Bluetooth on,
        bluetoothOn:true
    }

The startBluetoothError callback contains the information

    {
        bluetoothOn:true or false
        message:Error Message
    }

### stopBluetooth

This call will allow bluetooth to be switched off
No params are required.

rowplux.stopBluetooth(stopBluetoothSuccess,stopBluetoothError);

The stopBluetoothSuccess callback contains the information

    {
        type:"startBluetooth",
        message:"Bluetooth Off",
        bluetoothOn:false,  
        pluxConn:false      
    }

The stopBluetoothError callback contains the information

    {
        bluetoothOn:false,        
        message:"Bluetooth Not Enabled""
    }


### findPairedDevices
This call will return a list of paired devices.

No params are required.

rowplux.findPairdDevices(pairedSuccess,pairedError);


The pairedSuccess callback contains the information

    {
        type:"scan",
        deviceName:"Device name",
        address:"mac address"
    }

The pairedError callback contains the information

    {
        message:"No Paired Device"
        bluetoothOn:true or false
    }

### unPairDevice

This call will unpair the device given in params address.

   var params = {"address": macAddress };


   rowplux.unPairDevice( unPairSuccess, unPairError, params );

The unPairSuccess callback contains the information

    {
        type:"unpair"
        message:"Device unpaired"
    }

The unPairError callback contains the information

    {
        message:"Bluetooth Not Enabled"
                 or "Unpair error..."
                 or "Invalid Address"

        bluetoothOn: true or false

    }
      


### connect

This call will connect to the biosignalsplux device if device not previously paired it will pair using code 123.

var params = {"address": macAddress };

rowplux.connect(connectSuccess,connectError,params);

The connectSuccess callback contains the information

    {
        type:"connect"
        bluetoothOn:true,
        pluxConn:true,
        message:"Connected" 

    }

The connectError callback contains the information.

    {
        message:"Bluetooth Not Enabled"
                 or "Connected"
                 or "Invalid Address"

        bluetoothOn: true or false
        pluxConn: true or false

    }

### disconnect
This call will disconnect a connected biosignalsplux device.
No params required

rowplux.disconnect(disconnectSuccess, disconnectError)

The disconnectSuccess callback contains the information.

    {
        type:"disconnect"
        bluetoothOn:true,
        pluxConn:false,
        message:"Disconnected" 

    }

The disconnectError callback contains the information.

    {
        message:"Bluetooth Not Enabled",
        bluetoothOn: true or false      

    }

### getDescription

This call will return the description of a connected biosignalsplux device.
No params required

rowplux.getDescription(decriptionSuccess,descriptionError);

The decriptionSuccess callback contains the information.

     {
        type:"getDescription"        
        message: description returned from device

    }

The descriptionError callback contains the information.

     {       
        bluetoothOn: true or false,
        pluxConn: true or false ,
        message:"Bluetooth Not Enabled"
                or "Disconnected"    

    }

### getVersion

This call will return from a connected device
* Name
* Number of channels
* PID 
* FW version 
* HW version

No params are required

rowplux.getVersion(versionSuccess,versionError);

The versionSuccess callback contains the information.

     {
        type:"getVersion"        
        message: data from device

    }

The descriptionError callback contains the information.

     {       
        bluetoothOn: true or false,
        pluxConn: true or false ,
        message:"Bluetooth Not Enabled"
                or "Disconnected"   

    }


### getBattery

This call will return the state of connected biosignalsplux device battery the api returns a long value

No params are required

rowplux.getBatter(batterySuccess,batteryError);

The batterySuccess callback contains the information.

     {
        type:"getBattery",
        battery: level from device       

    }

The batteryError callback contains the information.

     {       
        bluetoothOn: true or false,
        pluxConn: true or false ,
        message:"Bluetooth Not Enabled"
                or "Disconnected"    

    }

### startRecording

This call will start recording data from a connected biosignalsplux device

var params = {"address": macAddress, "channel":1, "sensitivity":1 };

* select from channels 1 to 4
* sensitivity from 1 to 100
  * 1 being the most sensitive returning every sequence
  * 10 will return every tenth sequence
  * 100 will return every hundred sequence

rowplux.startRecording(startSuccess,startError,params);

The plugin returns data for every one hundred sequences and any extra after recording stops.

The startSuccess contains the information.

    {
        type:"startRecording"
        analogData: array of data from device
        timestamp: array of timestamps when data recorded
        sequence: array order of data recorded
    }


The startError callback contains the information.

    {
        message:"Bluetooth Not Enabled"
                 or "Disconnected"
                 or "Invalid Address"

        bluetoothOn: true or false
        pluxConn: true or false

    }

### stopRecording

This call will stop recording a biosignals device.
No params required

rowplux.stopRecording(stopSuccess,stopError);

The stopSuccess callback contains the information

    {
        type:"stopRecording"
        message:"Recording Stopped"
    }



The stopError callback contains the information.

    {
        message:"Bluetooth Not Enabled"
                 or "Disconnected"             

        bluetoothOn: true or false
        pluxConn: true or false

    }

    note for second and subsequent startRecording stopRecording cycles the api throws an error
    
    reciever not registered this requires further investigating.





