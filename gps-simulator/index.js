const mqtt = require("mqtt");

var gps = require('gps-simulator/gps-simulator.js');
var gpsData = require('gps-simulator/gps-simulator-data.js');

// There are 4 routes in gpsData, named routes01 -> routes04
// Each route, there are 2 directions: AB and BA
// So to get one route data, just use: gpsData.routes01.AB, for example.

var busId = 'Bus 01';

var gpsSimulator = new gps.GpsSimulator(gpsData.routes[0].AB, busId);
const client = mqtt.connect("mqtt://127.0.0.1:1883"); //連接到mqtt服務端

gpsSimulator.start(function(position, beStopped, movableObject, currentRouteIndex) {
	var str = "Route " + currentRouteIndex + ", speed " + movableObject.velocity * 3.6 + " km/h";
	console.log('[ ' + new Date() + ' ] ' + str);
	
	var gps_sensor = {
		"deviceId" : busId,
		"violationPoint": "",
		"Time" : new Date(),
		"Location" : [position.latitude, position.longitude],
		"latitude" : position.latitude,
		"longitude" : position.longitude,
		"timestamp" : new Date()
	};
	console.log(gps_sensor)
        client.publish("edgex/gps", JSON.stringify(gps_sensor), { qos: 0, retain: true });

	// Do something you want with gps_sensor
	
	if (beStopped == true) {
		console.log(busId + ' has been stopped');
		console.log('======================================');
	}
});
