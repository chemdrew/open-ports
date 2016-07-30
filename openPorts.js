var telnet = require('telnet-client');
var ProgressBar = require('progress');

var arguments = process.argv, i = 0;
if (arguments.length < 5) {
    console.log(`
        invalid cli format\n
        node openPorts.js <address> <minPort> <maxPort>
    `);
    process.exit();
}
var address = arguments[2];
var minPort = parseInt(arguments[3]);
var maxPort = parseInt(arguments[4]);
var ports = [];

var i = minPort;
for (i; i < maxPort; i++) {
    ports.push(i);
}

var bar = new ProgressBar('scanning :bar :current/:total', { total: ports.length, width: 50, complete: '█', incomplete: '▒' });
var concurrentRequests = (maxPort - minPort < 500) ? maxPort - minPort : 500;

var params = {
    host: address,
    port: undefined,
    timeout: 1000
};

function scan() {
    bar.tick();
    var connection = new telnet();
    params.port = count;
    connection.port = params.port;
    connection.host = params.host;

    connection.on('error', function(e) {
        ports.splice(ports.indexOf(connection.port), 1);
        connection.end();
        finished(connection.port);
    });

    connection.connect(params);
}

var count = minPort;
function finished(port) {
    count++;
    if (count <= maxPort) scan();
    else if (port >= maxPort) {
        console.log( `open ports: [${ports.join('] [')}]` );
        process.exit();
    }
}
var i = 0;
for (i; i < concurrentRequests; i++) {
    scan();
    count++;
}
