var net = require('net');
var fs = require('fs');
var chalk = require('chalk');
var port = 5000;
var connections = [];

var server = net.createServer(function(connection){
	console.log('connected to client');
	var userObj = {
		sock: connection,
		//name: clientName
	}
	//var user = connection;
	connections.push(userObj);
	connection.setEncoding('utf8');
	connection.write(chalk.red('Yooooo, client! Let\'s chat!\nFor a chat history, type "chat_history" (without double quotes). Otherwise, start chatting!\n'));
	connection.write(chalk.bold('There are currently ' +connections.length+ " users logged in. \n"));
	connection.write(chalk.green("First enter a username like this - 'username yourName'\n"))
connection.on('data', function(clientInput){
	var cleanInput = clientInput.trim();
	var length = connections.length;
	fs.readFile('./data.json', 'utf8', function(err,data){
		var parsed = JSON.parse(data);
		var chatData = cleanInput;
		
		if(chatData.substr(0,8) === "username"){
			clientName = chatData.substr(9, chatData.length+1);
			console.log(clientName);
			userObj.name = clientName;
		}

		////not working
		if (chatData.substr(0,4) === "/yell"){
			var chatData = chatData.toUpperCase();
			for (var i = 0; i<connections.length; i++){
				connections[i].sock.write(chatData + "\n");
			}
		}

		for (var i = 0; i<connections.length; i++){
			connections[i].sock.write(userObj.name+" Says: "+chatData + "\n");
		}

		console.log("someone chatted: "+chatData);
		parsed.push(chatData);

		var stringed = JSON.stringify(parsed);
		fs.writeFile('./data.json', stringed, function(){});

	if (cleanInput === "chat_history"){
		connection.write(stringed + "\n");
	}



	})//end of readFile




})//end of on.data





})//end of net.createServer




server.listen(port,function(){
	console.log('server listening on ' +port);
})






















