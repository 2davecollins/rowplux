var exec = require('cordova/exec');
exports.isEnabled = function(success) {
    exec(success, null, "RowPlux", "isEnabled",[]);
};
exports.scan = function( success, error, params) {
    exec(success, error, "RowPlux", "scan", []);
};
exports.startBluetooth = function( success, error, params) {
        exec(success, error, "RowPlux", "startBluetooth", []);
    };
exports.stopBluetooth = function( success, error, params) {
    exec(success, error, "RowPlux", "stopBluetooth", []);
    };
exports.findPairedDevices = function( success, error, params) {
    exec(success, error, "RowPlux", "findPairedDevices",[]);
};
exports.unPairDevice = function( success, error, params) {
    exec(success, error, "RowPlux", "unPairDevice", [params]);
};
exports.connect = function( success, error, params) {
    exec(success, error, "RowPlux", "connect", [params]);
};
exports.disconnect = function( success, error, params) {
    exec(success, error, "RowPlux", "disconnect", []);
};
exports.startRecording = function( success, error, params) {
    exec(success, error, "RowPlux", "startRecording", [params]);
};
exports.stopRecording = function( success, error, params) {
    exec(success, error, "RowPlux", "stopRecording", []);
};
exports.getDescription = function( success, error, params) {
    exec(success, error, "RowPlux", "getDescription", []);
};
exports.getVersion = function( success, error, params) {
    exec(success, error, "RowPlux", "getVersion", []);
};
exports.getBattery = function( success, error, params) {
    exec(success, error, "RowPlux", "getBattery", []);
};
exports.test = function( success, error, params) {
    exec(success, error, "RowPlux", "test", [params]);
};
