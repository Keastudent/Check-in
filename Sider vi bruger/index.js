function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
}

var ConnDeviceId;
var deviceList =[];
 
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
    bleDeviceList.addEventListener('touchstart', conn, false);
}

function onDeviceReady(){
	refreshDeviceList();
}

	 
function refreshDeviceList(){
	document.getElementById("bleDeviceList").innerHTML = '';
	if (cordova.platformId === 'android') {
		ble.scan([], 5, onDiscoverDevice, onError);
	} else {
		ble.scan([blue.serviceUUID], 5, onDiscoverDevice, onError);
	}
}


function onDiscoverDevice(device){
	
		var listItem = document.createElement('li'),
		html = device.name+ "," + device.id;
		listItem.innerHTML = html;
		document.getElementById("bleDeviceList").appendChild(listItem);
	
}


function conn(){
	var  deviceTouch= event.srcElement.innerHTML;
	document.getElementById("debugDiv").innerHTML ="";
	var deviceTouchArr = deviceTouch.split(",");
	ConnDeviceId = deviceTouchArr[1];
	document.getElementById("debugDiv").innerHTML += "<br>"+deviceTouchArr[0]+"<br>"+deviceTouchArr[1];
	ble.connect(ConnDeviceId, onConnect, onConnError);
 }

 function onData(data){
	document.getElementById("receiveDiv").innerHTML =  "Received: " + bytesToString(data) + "<br/>";
}

function data(txt){
	messageInput.value = txt;
}	

function sendData() {
	 var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}
	
function onSend(){
	document.getElementById("sendDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}

function disconnect() {
	ble.disconnect(deviceId, onDisconnect, onError);
}

function onError(reason)  {
	alert("ERROR: " + reason);
}