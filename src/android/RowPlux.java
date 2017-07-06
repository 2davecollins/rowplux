package com.rowcatcher.rowplux;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Parcelable;
import android.util.Log;
import android.widget.Toast;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import info.plux.pluxapi.Communication;
import info.plux.pluxapi.Constants;
import info.plux.pluxapi.PluxDevice;
import info.plux.pluxapi.bioplux.BiopluxCommunication;
import info.plux.pluxapi.bioplux.BiopluxCommunicationFactory;
import info.plux.pluxapi.bioplux.BiopluxException;
import info.plux.pluxapi.bioplux.OnBiopluxDataAvailable;
import info.plux.pluxapi.bioplux.utils.BiopluxFrame;
import info.plux.pluxapi.bioplux.utils.CommandReplyString;
import info.plux.pluxapi.bioplux.utils.EventData;
import info.plux.pluxapi.bioplux.utils.Source;

public class RowPlux extends CordovaPlugin {
    RowPluxMain rp = new RowPluxMain();  //not used
    private RowPluxReceiver mReceiver = new RowPluxReceiver();
    private static final String TAG = "RowPlux";
    private static final int REQUEST_CONNECT_DEVICE_SECURE = 1;
    private static final int REQUEST_CONNECT_DEVICE_INSECURE = 2;
    private static final int REQUEST_ENABLE_BT = 3;
    private String remoteMAC = "00:07:80:D8:AB:52";

    public static final String geolocation_permission = Manifest.permission.ACCESS_COARSE_LOCATION;
    public static final int SEARCH_REQ_CODE = 0;

    private boolean keepCallback = true;
    private boolean isConnected = false;
    private boolean isRecording = false;
    private boolean alllowToast = false;

    private int seq = 0;

    ArrayList<Integer> dataList;
    ArrayList<Integer> seqList;
    ArrayList<Long> timeList;
    Date dateTime;


    private final String idKey          = "type";
    private final String statusKey      = "status";
    private final String errorKey       = "error";
    private final String messageKey     = "message";
    private final String nameKey        = "deviceName";    
    private final String addressKey     = "address";
    private final String bluetoothOnKey = "bluetoothOn";
    private final String connKey        = "pluxConn";
    private final String batKey         = "battery";
    private final String aquKey         = "pluxAqu";
    private final String dataKey        = "analogData";
    private final String timeKey        = "timestamp";
    private final String dIPKey         = "digitalIP";
    private final String seqKey         = "sequence";
    private final String channelKey     = "channel";
    private final String sensKek        = "sensitivity";
    private final String toastKey       = "showMessages";

    
    private final boolean isBluetoothOn = true;
    private final boolean isPluxConn    = true;
    private final boolean isPluxAqu     = true;


    ArrayList<BluetoothDevice> bleDevices;
    BluetoothAdapter mBluetoothAdapter;
    BluetoothDevice dev = null;
    BluetoothSocket sock= null;
    IntentFilter filter;
    BiopluxCommunication bioplux;
    Constants.States state;

    CallbackContext scanCallbackContext;
    CallbackContext connectCallbackContext;
    CallbackContext disconnectCallbackContext;
    CallbackContext getVersionCallback;
    CallbackContext getDescriptionCallback;
    CallbackContext getBatteryCallback;   
    CallbackContext recordingCallbackContext;
    CallbackContext stopRecordingCallbackContext;
    CallbackContext isEnabledCallbackContext;
    CallbackContext hasPermissionsCallbackContext;


    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        dataList = new ArrayList<Integer>();
        seqList = new ArrayList<Integer>();
        timeList = new ArrayList<Long>();

        setupBLE();
        initplux();

    }

    @Override
    public void onStart() {
        super.onStart();
    }

    @Override
    public void onStop() {
        super.onStop();
    }
    
    private void initplux(){
        bioplux = new BiopluxCommunicationFactory().getCommunication(Communication.BTH, webView.getContext(), new OnBiopluxDataAvailable() {
            @Override
            public void onBiopluxDataAvailable(BiopluxFrame biopluxFrame) {
                //Log.d(TAG,"Frame Data available ****** <<<<<< Frame >>>>>"+biopluxFrame.toString());

                int [] data = biopluxFrame.getAnalogData();
                seq = biopluxFrame.getSequence();
                dataList.add(data[0]);
                long timestamp = System.currentTimeMillis();
                dateTime = new Date(timestamp);
                timeList.add(timestamp);
                seqList.add(seq);
                int digInput = biopluxFrame.getDigitalInput();
                int dataLength = data.length;
                Log.d(TAG,"seq "+seq+" :"+data[0]+" :"+dateTime);
                if(recordingCallbackContext != null){

                    if(seq %100 == 0){
                        JSONObject returnObj = new JSONObject();
                        addProperty(returnObj, idKey, "startRecording");
                        addProperty(returnObj,dataKey,dataList);
                        addProperty(returnObj,timeKey,timeList);
                        addProperty(returnObj,seqKey,seqList);
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                        pluginResult.setKeepCallback(true);
                        recordingCallbackContext.sendPluginResult(pluginResult);
                        Log.d(TAG,"cordova reply sent ...");
                        dataList.clear();
                        timeList.clear();
                        seqList.clear();
                    }
                }
            }

            @Override
            public void onBiopluxDataAvailable(String s, int[] ints) {
                Log.d(TAG,"bioplux string available *******  <<<<<< String >>>>> "+s);
            }
        });
    }

    public void setupBLE(){
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if(mBluetoothAdapter == null){
            Log.d(TAG, "Bluetooth not Supported: ");
        }else {
            if (!mBluetoothAdapter.isEnabled()) {
                Log.d(TAG,"Bluetoot not Enabled asking .....");
                //showToast("Bluetooth not Enabled");

                //TODO add to cordova call
                //Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
               // cordova.startActivityForResult(this,enableBtIntent,90);


            } else {
               //showToast("Bluetooth isEnabled ");
            }
        }

        cordova.getActivity().registerReceiver(mReceiver,updateIntentFilter());


    }
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "activity result in plugin: requestCode(" + requestCode + "), resultCode(" + resultCode + ")");
        if (requestCode == 90) {
            if (resultCode == this.cordova.getActivity().RESULT_OK) {
                Log.d(TAG, "result: ok" );
                //TODO call on isEnabled

            } else {
                Log.d(TAG, "result: error:" );
                showToast("Bluetooth Denied start");

            }
        }
    }
    protected static IntentFilter updateIntentFilter(){
        final IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothDevice.ACTION_FOUND);
        filter.addAction(BluetoothAdapter.ACTION_CONNECTION_STATE_CHANGED);
        filter.addAction(Constants.ACTION_STATE_CHANGED);
        filter.addAction(Constants.ACTION_DATA_AVAILABLE);
        filter.addAction(Constants.ACTION_COMMAND_REPLY);
        filter.addAction(Constants.ACTION_EVENT_AVAILABLE);
        filter.addAction(Constants.ACTION_DISCONNECTED);
        filter.addAction(Constants.ACTION_MESSAGE_SCAN);

        return filter;
    }

    //Broadcast Receiver

    public class RowPluxReceiver extends BroadcastReceiver{
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            Log.d(TAG," Broacast Action  <<<<<<<<<<<<<<<<<<<<< Action >>>>>>>>>>>>>>>>>>>"+action);
            if(Constants.ACTION_STATE_CHANGED.equals(action)){
                String indentifier = intent.getStringExtra(Constants.IDENTIFIER);
                Constants.States state = Constants.States.getStates(intent.getIntExtra(Constants.EXTRA_STATE_CHANGED,0));
                Log.d(TAG,">>>>>>>  Device :"+indentifier+ ": "+state.name());
                if(state.name().equals("CONNECTED")){
                    isConnected = true;

                    if(connectCallbackContext != null){
                        JSONObject returnObj = new JSONObject();
                        addProperty(returnObj, idKey, "connect");
                        addProperty(returnObj, bluetoothOnKey, isBluetoothOn);
                        addProperty(returnObj, connKey, isPluxConn);
                        addProperty(returnObj, messageKey,"Connected");
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                        pluginResult.setKeepCallback(true);
                        connectCallbackContext.sendPluginResult(pluginResult);
                    }


                }else if(state.name().equals("DISCONNECTED")){
                    isConnected = false;

                    if(disconnectCallbackContext != null){
                        JSONObject returnObj = new JSONObject();
                        addProperty(returnObj, idKey, "disconnect");
                        addProperty(returnObj, bluetoothOnKey, isBluetoothOn);
                        addProperty(returnObj, connKey, !isPluxConn);
                        addProperty(returnObj, messageKey,"Disconnected");
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                        pluginResult.setKeepCallback(true);
                        disconnectCallbackContext.sendPluginResult(pluginResult);
                    }

                }else if(state.name().equals("ACQUISITION_OK")){
                    Log.d(TAG,"ACQUISITION_OK");

                }else if(state.name().equals("ACQUISITION_STOPPING")){
                    Log.d(TAG,"ACQUISITION_STOPPING");

                }

            }else if(Constants.ACTION_DATA_AVAILABLE.equals(action)){
                Log.d(TAG,">>>>>>>  <<<<< ACTION_DATA_AVAILABLE");
                BiopluxFrame frames = intent.getParcelableExtra(Constants.EXTRA_DATA);
                Log.d(TAG, frames.toString());


            }else if(Constants.ACTION_COMMAND_REPLY.equals(action)){
                Log.d(TAG,">>>>>>>   ACTION_COMMAND_REPLY");
                String indentifier = intent.getStringExtra(Constants.IDENTIFIER);
                Parcelable parcelable = intent.getParcelableExtra(Constants.EXTRA_COMMAND_REPLY);
                if(parcelable.getClass().equals((PluxDevice.class))){
                    Log.d(TAG,">>>>>  Pluxdevice :"+parcelable.toString());

                    if(getVersionCallback != null){
                        JSONObject returnObj = new JSONObject();
                        addProperty(returnObj, idKey, "getVersion");
                        addProperty(returnObj,messageKey,parcelable.toString());
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                        pluginResult.setKeepCallback(true);
                        getVersionCallback.sendPluginResult(pluginResult);
                    }

                }else if(parcelable.getClass().equals(EventData.class)){
                    Log.d(TAG,">>>>>  Eventdata :"+parcelable.toString());
                    EventData event = intent.getParcelableExtra(Constants.EXTRA_COMMAND_REPLY);
                    int batLevel = event.getBatteryLevel();
                    
                    //TODO convert int to meaningful result  batKey;
                    Log.d(TAG,"Eventdata Command reply   :"+batLevel);

                    if(getBatteryCallback != null){
                        JSONObject returnObj = new JSONObject();
                        addProperty(returnObj, idKey, "getBattery");
                        addProperty(returnObj,batKey,batLevel);
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                        pluginResult.setKeepCallback(true);
                        getBatteryCallback.sendPluginResult(pluginResult);
                    }


                }else if(parcelable.getClass().equals(CommandReplyString.class)){
                    CommandReplyString crs = intent.getParcelableExtra(Constants.EXTRA_COMMAND_REPLY);
                    Log.d(TAG,">>>>>  Commandreply :"+parcelable.toString());
                    String cmdReply = crs.getCommandReply();
                    Log.d(TAG,"Command reply   :"+crs.getCommandReply());
                    if(cmdReply.contains("OK")){
                        //"Send excess data here because of reciever not register error prevents sending from stopRecording");
                        if(dataList.size() >0 &&(recordingCallbackContext != null)){
                            Log.d(TAG,"Sending excess data to plugin :"+seq);
                            JSONObject returnObj = new JSONObject();
                            addProperty(returnObj, idKey, "startRecording");
                            addProperty(returnObj,dataKey,dataList);
                            addProperty(returnObj,timeKey,timeList);
                            addProperty(returnObj,seqKey,seqList);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                            pluginResult.setKeepCallback(true);
                            recordingCallbackContext.sendPluginResult(pluginResult);
                        }
                        dataList.clear();
                        timeList.clear();
                        seqList.clear();

                    }

                    if(cmdReply.contains("Description")){
                        Log.d(TAG,"description   new  : "+cmdReply);

                        if(getDescriptionCallback != null){
                            JSONObject returnObj = new JSONObject();
                            addProperty(returnObj, idKey, "getDescription");
                            addProperty(returnObj,messageKey,cmdReply);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                            pluginResult.setKeepCallback(true);
                            getDescriptionCallback.sendPluginResult(pluginResult);
                        }

                    }
                    //TODO how to decode commandreplystring
                }

            }else if(Constants.ACTION_EVENT_AVAILABLE.equals(action)){
                Log.d(TAG,">>>>>>>   ACTION_EVENT_AVAILABLE");
                EventData event = intent.getParcelableExtra(Constants.EXTRA_EVENT);
                String str = "";
                if(event.eventDescription.equals(Constants.ON_BODY_EVENT)){
                    Log.d(TAG,">>>> ["+event.identifier+"] "+"onBody: "+ false);
                }else  if(event.eventDescription.equals(Constants.BATTERY_EVENT)){
                    Log.d(TAG,">>>> Battery level: "+ event.batteryLevel);
                }

            }else if(Constants.ACTION_DEVICE_READY.equals(action)){
                Log.d(TAG,">>>>>>>   ACTION_DEVICE_READY");
                String indentifier = intent.getStringExtra(Constants.IDENTIFIER);
                PluxDevice pluxDevice = intent.getParcelableExtra(Constants.PLUX_DEVICE);
                Log.d(TAG,">>>>>> "+pluxDevice.toString());


            }else if(Constants.ACTION_MESSAGE_SCAN.equals(action)){

                Log.d(TAG,">>>>>>>   ACTION_MESSAGE_SCAN");
                BluetoothDevice device = intent.getParcelableExtra(Constants.EXTRA_DEVICE_SCAN);
                String deviceName = device.getName();
                String deviceHardwareAddress = device.getAddress();
                String answer = deviceName+":"+deviceHardwareAddress;
                Log.d(TAG,deviceName+" : "+deviceHardwareAddress);
                
                if(scanCallbackContext != null){
                    JSONObject returnObj = new JSONObject();
                    addProperty(returnObj, idKey, "scan");
                    addProperty(returnObj, nameKey, deviceName);
                    addProperty(returnObj, addressKey, deviceHardwareAddress);
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                    pluginResult.setKeepCallback(true);
                    scanCallbackContext.sendPluginResult(pluginResult);
                }

            }else if(Constants.ACTION_DISCONNECTED.equals(action)){
                Log.d(TAG,">>>>>>>   ACTION_DISCONNECTED");
            }

            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                Log.d(TAG," Bluetooth Action_Found");
            }
            if(BluetoothAdapter.ACTION_DISCOVERY_STARTED.equals(action)){
                Log.d(TAG,"Discovery Started");

            }
            if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                Log.d(TAG,"Discovery Finished");
            }
            if(BluetoothAdapter.ACTION_CONNECTION_STATE_CHANGED.equals(action)){
                Log.d(TAG,"ACTION_CONNECTION_STATE_CHANGED");

            }
            if(BluetoothAdapter.ACTION_STATE_CHANGED.equals(action)){
                Log.d(TAG,"Bluetooth state Changed");
                int indentifier = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE,-1);
                if(indentifier == BluetoothAdapter.STATE_OFF){

                }else{

                }

            }
        }
    };

    @Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("isEnabled".equals(action)) {
            isEnabled(callbackContext);
			return true;
		}else if("hasPermissions".equals(action)){
            hasPermissions(callbackContext);
            return true;
        }else if("scan".equals(action)){
            scan(args, callbackContext);
            return true;
        }else if("startBluetooth".equals(action)){
			startBluetooth(args,callbackContext);
            return true;
        }else if("stopBluetooth".equals(action)){
			stopBluetooth(args,callbackContext);
			return true;
		}else if("findPairedDevices".equals(action)){
			findPairedDevices(args,callbackContext);
			return true;
		}else if("unPairDevice".equals(action)){
			unPair(args,callbackContext);
			return true;
		}else if("connect".equals(action)){
            connect(args,callbackContext);
            return true;
        }else if("disconnect".equals(action)){
            disconnect(args,callbackContext);
            return true;
        }else if("startRecording".equals(action)){
            startRecording(args,callbackContext);
            return true;
        }else if("stopRecording".equals(action)){
            stopRecording(args,callbackContext);
            return true;
        }else if("getDescription".equals(action)){
            getDescription(args,callbackContext);
            return true;
        }else if("getVersion".equals(action)){
            getVersion(args,callbackContext);
            return true;
        }else if("getBattery".equals(action)){
            getBattery(args,callbackContext);
            return true;
        }else if("test".equals(action)){
			test(args.getString(0),callbackContext);
			return true;
		}

		return false;
	}

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);

        for(int r:grantResults)
        {
            if(r == PackageManager.PERMISSION_DENIED)
            {
                Log.d(TAG, "Permission Denied");
                if(hasPermissionsCallbackContext != null){
                    JSONObject returnObj = new JSONObject();
                    addProperty(returnObj, idKey, "hasPermissions");
                    addProperty(returnObj,statusKey,false);
                    addProperty(returnObj, messageKey, "permission denied geolocation");
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                    pluginResult.setKeepCallback(true);
                    hasPermissionsCallbackContext.sendPluginResult(pluginResult);
                }

                return;
            }
        }
        Log.d(TAG, "Permission Granted");
        if(hasPermissionsCallbackContext != null){
            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "hasPermissions");
            addProperty(returnObj,statusKey,true);
            addProperty(returnObj, messageKey, "has permission geolocation");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            hasPermissionsCallbackContext.sendPluginResult(pluginResult);
        }
    }

    private void hasPermissions(CallbackContext callbackContext) {

        hasPermissionsCallbackContext = callbackContext;
        showToast("Check permissions ");

        if(cordova.hasPermission(geolocation_permission)) {
            Log.d(TAG, "Has Permission");
            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "hasPermissions");
            addProperty(returnObj,statusKey,true);
            addProperty(returnObj, messageKey, "has permission geolocation");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            hasPermissionsCallbackContext.sendPluginResult(pluginResult);
        }else{
            Log.d(TAG, "Has No Permission");
            getPermission(SEARCH_REQ_CODE);
        }


    }

    private void isEnabled(CallbackContext callbackContext) {

        isEnabledCallbackContext = callbackContext;
        showToast("Bluetooth isEnabled ");

        if(mBluetoothAdapter.isEnabled()){
            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "isEnabled");
            addProperty(returnObj, bluetoothOnKey, isBluetoothOn);
            addProperty(returnObj, messageKey, "Bluetooth on");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);
           
        }else{
            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "isEnabled");
            addProperty(returnObj, bluetoothOnKey, !isBluetoothOn);
            addProperty(returnObj, messageKey, "Bluetooth off");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);
           
        }
    }

	private void scan(JSONArray args, CallbackContext callbackContext) {

        scanCallbackContext = callbackContext;
        showToast("Scanning ...");
        if(mBluetoothAdapter.isEnabled()){
            bioplux.scan();
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth is off"));
        }
	}
	private void startBluetooth(JSONArray args, CallbackContext callbackContext) {
        showToast("Starting Bluetooth.. ");

        turnOnBT(callbackContext);

	}
	private void stopBluetooth(JSONArray args, CallbackContext callbackContext) {
        showToast("Stopping Bluetooth.. ");
        turnOffBT(callbackContext);


	}
	private void findPairedDevices(JSONArray args, CallbackContext callbackContext) {
        showToast("Finding Paired devices... ");

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (!mBluetoothAdapter.isEnabled()) {
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
            return;
        }
        Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
        if (pairedDevices.size() > 0) {
            for (BluetoothDevice device : pairedDevices) {
                String deviceName = device.getName();
                String deviceHardwareAddress = device.getAddress(); // MAC address
                JSONObject returnObj = new JSONObject();
                addProperty(returnObj, idKey, "findPaired");
                addProperty(returnObj, nameKey, deviceName);
                addProperty(returnObj, addressKey, deviceHardwareAddress);//
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);

            }
        } else {
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "No Paired Device"));
        }


	}
    private void unPair(JSONArray args, CallbackContext callbackContext) {
		if (args == null || args.length() == 0) {
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Invalid parameters..."));
            return;

        } else {

            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if(!mBluetoothAdapter.isEnabled()){
                Log.d(TAG, "Bluetooth Not Enabled...");
                callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
                return;
            }
            JSONObject obj = getArgsObject(args);
            String address = "";

            if( getAddress(obj) != null){
                address = getAddress(obj);
            }else{
                callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "Invalid Address"));
                return;
            }
            Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
            if (pairedDevices.size() > 0) {
                for (BluetoothDevice device : pairedDevices) {
                    if(address.equals(device.getAddress())) {
                        try {
                            Method m = device.getClass()
                                    .getMethod("removeBond", (Class[]) null);
                            m.invoke(device, (Object[]) null);
                        } catch (Exception e) {
                            callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "Unpair error..."));

                        }
                    }
                }
                JSONObject returnObj = new JSONObject();
                addProperty(returnObj, idKey, "unpair");
                addProperty(returnObj, messageKey,"Device unpaired");
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);
            }

		}
	}
    private void connect(JSONArray args, CallbackContext callbackContext) {
        showToast("Connecting bioplux.... ");
        connectCallbackContext = callbackContext;
        JSONObject obj = getArgsObject(args);
        alllowToast = getToastPermission(obj);


        if(mBluetoothAdapter.isEnabled()){
            String address = "";
            if( getAddress(obj) != null){
                address = getAddress(obj);
            }else{
                callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "Invalid Address"));
                return;
            }
            if(!isConnected) {
                try {
                    bioplux.connect(address);
                } catch (BiopluxException e) {
                    e.printStackTrace();
                    Log.d(TAG,"Bioplux exception "+e);
                }catch(NullPointerException e){
                    Log.d(TAG,"NullPoint : "+e);

                }
            }else{
                callbackContext.error(createErrorJSONObect(connKey, isPluxConn, "Connected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }

    }
    private void disconnect(JSONArray args, CallbackContext callbackContext) {
        showToast("Disconnecting bioplux...");
        disconnectCallbackContext =callbackContext;
        if(mBluetoothAdapter.isEnabled()) {
            try {
                bioplux.disconnect();
            } catch (BiopluxException e) {
                e.printStackTrace();
                Log.d(TAG, "Bioplux exception " + e);
            } catch (NullPointerException e) {
                Log.d(TAG, "NullPoint : " + e);
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }    
    private void startRecording(JSONArray args, CallbackContext callbackContext) {
        recordingCallbackContext =callbackContext;

        if(mBluetoothAdapter.isEnabled()){
            JSONObject obj = getArgsObject(args);
            String address ="";
            if( getAddress(obj) != null){
                address = getAddress(obj);
            }else{
                callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "Invalid Address"));
                return;
            }
            int channel = obj.optInt(channelKey, 1);
            int sens = obj.optInt(sensKek,1);
            Log.d(TAG, "Channel :"+channel);
            if(isConnected) {
                showToast("Bioplux start");
                dataList.clear();
                timeList.clear();
                seqList.clear();
                List<Source> sources = new ArrayList<>();
                Source ch1Source = new Source(channel,16,(byte)0x01,sens);
                sources.add(ch1Source);
                try {
                    bioplux.start(100f,sources);
                } catch (BiopluxException e) {
                    e.printStackTrace();
                    Log.d(TAG,"Bioplux exception "+e);
                }catch(NullPointerException e){
                    Log.d(TAG,"NullPoint : "+e);
                }

            }else{
                callbackContext.error(createErrorJSONObect(connKey, !isPluxConn, "Disconnected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }
    private void stopRecording(JSONArray args, CallbackContext callbackContext) {
        //stopRecordingCallbackContext = callbackContext;
        if(mBluetoothAdapter.isEnabled()){
            if(isConnected) {
                Log.d(TAG,"Stoping : ");
                showToast("Bioplux stop");
                try {
                    bioplux.stop();
                } catch (BiopluxException e) {
                    e.printStackTrace();
                    Log.d(TAG,"Bioplux exception : "+e);
                }catch (NullPointerException e){
                    Log.d(TAG,"NullPoint : "+e);
                }catch(IllegalArgumentException e){
                    //TODO reciever not registered from api
                    Log.d(TAG,"Receiver not registered : "+e);
                }
                JSONObject returnObj = new JSONObject();
                addProperty(returnObj, idKey, "stopRecording");
                addProperty(returnObj,messageKey,"Recording Stopped");
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);

            }else{
                callbackContext.error(createErrorJSONObect(connKey, !isPluxConn, "Disconnected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth is off"));

        }
    }
    private void getDescription(JSONArray args, CallbackContext callbackContext) {
        showToast("GetDescription ");
        getDescriptionCallback = callbackContext;
        if(mBluetoothAdapter.isEnabled()){
            if(isConnected) {
                try {
                    Log.d(TAG, "Get Description call ....");
                    bioplux.getDescription();
                } catch (BiopluxException e) {
                    Log.d(TAG, "get Description error  :" + e);

                }catch(NullPointerException e){
                    Log.d(TAG,"NullPoint "+e);
                }
            }else{
                callbackContext.error(createErrorJSONObect(connKey, !isPluxConn, "Disconnected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }
    private void getVersion(JSONArray args, CallbackContext callbackContext) {
        showToast("GetVersion ");
        getVersionCallback = callbackContext;
        if(mBluetoothAdapter.isEnabled()){
            if(isConnected) {
                try {
                    Log.d(TAG, "Get Version call ....");
                    bioplux.getVersion();
                } catch (BiopluxException e) {
                    Log.d(TAG, "get Version error  :" + e);

                }catch(NullPointerException e){
                    Log.d(TAG,"NullPoint "+e);
                }
            }else{
                callbackContext.error(createErrorJSONObect(connKey, !isPluxConn, "Disconnected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }
    private void getBattery(JSONArray args, CallbackContext callbackContext) {
        showToast("Battery level");
        getBatteryCallback = callbackContext;
        if(mBluetoothAdapter.isEnabled()){
            if(isConnected) {
                try {
                    Log.d(TAG, "Get Battery call ....");
                    bioplux.getBattery();
                } catch (BiopluxException e) {
                    Log.d(TAG, "get Battery error  :" + e);

                }catch(NullPointerException e){
                    Log.d(TAG,"NullPoint "+e);
                }
            }else{
                callbackContext.error(createErrorJSONObect(connKey, !isPluxConn, "Disconnected"));
            }
        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }

    private void test(String msg, CallbackContext callbackContext) {

		if (msg == null || msg.length() == 0) {
			callbackContext.error("Empty message!");
		} else {
            showToast(msg);
            rp.setName(msg);
            String name = rp.getName();
			callbackContext.success(name);
		}
	}

	/****************************************************************************************


	****************************************************************************************/
    //Turn on Bluetooth
    public void turnOnBT(CallbackContext callbackContext) {
        Log.d(TAG, "Turning On Bluetooth ..: ");
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if(!mBluetoothAdapter.isEnabled()){
            Intent enableBTIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            cordova.getActivity().startActivityForResult(enableBTIntent,REQUEST_ENABLE_BT);

            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "startBluetooth");
            addProperty(returnObj, bluetoothOnKey, isBluetoothOn);
            addProperty(returnObj, messageKey,"Bluetooth on");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);

        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, isBluetoothOn, "Bluetooth is on"));
        }
    }
    //Turn Off Bluetooth
    public void turnOffBT(CallbackContext callbackContext){
        Log.d(TAG, "Turning Off Bluetooth: ");
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter.isEnabled()) {
            mBluetoothAdapter.disable();

            JSONObject returnObj = new JSONObject();
            addProperty(returnObj, idKey, "stopBluetooth");
            addProperty(returnObj, bluetoothOnKey, !isBluetoothOn);
            addProperty(returnObj, connKey, !isPluxConn);
            addProperty(returnObj, messageKey,"Bluetooth Off");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
            pluginResult.setKeepCallback(true);
            callbackContext.sendPluginResult(pluginResult);

        }else{
            callbackContext.error(createErrorJSONObect(bluetoothOnKey, !isBluetoothOn, "Bluetooth Not Enabled"));
        }
    }


    /****************************************************************************************
        Utility Functions

     ****************************************************************************************/

    private void showToast(String msg){
        if(alllowToast == true){
            Toast.makeText(webView.getContext(), msg, Toast.LENGTH_SHORT).show();
        }
    }

    private void getPermission(int requestCode){
        cordova.requestPermission(this, requestCode, geolocation_permission);
    }

    public void pause(int delay){
        try {
            Thread.sleep(delay);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    private JSONObject createErrorJSONObect(String keyType, boolean state, String data1){
        JSONObject returnObj = new JSONObject();
        addProperty(returnObj, keyType, state);
        addProperty(returnObj, messageKey, data1);
        PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, returnObj);

        return returnObj;

    }
    private JSONObject createErrorJSONObectString(String keyType, String state, String data1){
        JSONObject returnObj = new JSONObject();
        addProperty(returnObj, keyType, state);
        addProperty(returnObj, messageKey, data1);
        PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, returnObj);

        return returnObj;

    }
    private JSONObject createSuccessJSONObect(String keyType, boolean state, String data1,boolean keepTheCallback){
        JSONObject returnObj = new JSONObject();
        addProperty(returnObj, keyType, state);
        addProperty(returnObj, messageKey, data1);
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, returnObj);
        pluginResult.setKeepCallback(keepTheCallback);

        return returnObj;

    }
    private void addProperty(JSONObject obj, String key, Object value) {

        try {
            if (value == null) {
                obj.put(key, JSONObject.NULL);
            } else {
                obj.put(key, value);
            }
        } catch (JSONException e) {
        }
    }
    private JSONObject getArgsObject(JSONArray args) {
        if (args.length() == 1) {
            try {
                return args.getJSONObject(0);
            } catch (JSONException ex) {
            }
        }

        return null;
    }
    private String getAddress(JSONObject obj) {
        //Get the address string from arguments
        String address = obj.optString(addressKey, null);

        if (address == null) {
            return null;
        }
        //Validate address format
        if (!BluetoothAdapter.checkBluetoothAddress(address)) {
            return null;
        }

        return address;
    }

    private boolean getToastPermission(JSONObject obj){
       return obj.optBoolean(toastKey,false);
    }

}