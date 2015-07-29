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
	connection.write(chalk.bgRed('Yooooo, client! Let\'s chat!\n'));
	connection.write(chalk.bgMagenta('For chat history, type "chat_history" (without quotes). If you want to yell, type "yell" and then your message\n'))
	connection.write(chalk.bgYellow("You can chat in color by entering 'color yourColor' followed by your message. The options are red, green and yellow\n"));
	connection.write(chalk.bgGreen("But first, enter a username in this format - 'username yourName'" + "\n"))
	connection.write(chalk.bgWhite("To see all users logged in, type 'list users'\n"))
	connection.write(chalk.bold('There are currently ' +connections.length+ " users logged in. \n"));
connection.on('data', function(clientInput){
	var cleanInput = clientInput.trim();
	fs.readFile('./data.json', 'utf8', function(err,data){
		var parsed = JSON.parse(data);
		var chatData = cleanInput;
		
		if(chatData.substr(0,8) === "username"){
			clientName = chatData.substr(9, chatData.length+1);
			console.log(clientName);
			userObj.name = clientName;
		} else if (chatData.substr(0,4) === "yell"){
			var chatData = chatData.substr(5, chatData.length+1).toUpperCase();
			console.log('chatData changed to uppercase')
			for (var i = 0; i<connections.length; i++){
				connections[i].sock.write(userObj.name+" says: "+chatData + "\n");
			}
		} else if (chatData.substr(0,9) === "color red") {
					var chatData = chalk.red(chatData.substr(10, chatData.length+1));
					console.log(chalk.red('color changed to red'));
					for (var i = 0; i<connections.length; i++){
						connections[i].sock.write(userObj.name+(" says: ")+chatData+ "\n");
					}
		} else if (chatData.substr(0,11) === "color green") {
					var chatData = chalk.green(chatData.substr(12, chatData.length+1));
					console.log(chalk.green('color changed to green'));
					for (var i = 0; i<connections.length; i++){
						connections[i].sock.write(userObj.name+(" says: ")+chatData+ "\n");
					}
		} else if (chatData.substr(0,12) === "color yellow") {
					var chatData = chalk.yellow(chatData.substr(13, chatData.length+1));
					console.log(chalk.yellow('color changed to yellow'));
					for (var i = 0; i<connections.length; i++){
						connections[i].sock.write(userObj.name+(" says: ")+chatData+ "\n");
					}
		} else if (chatData.substr(0,10) === "list users"){
					//var userString = connections.join().replace(/,/g, " ");
					connections.forEach(function(e,i,a){
						connection.write(e.name+" ");
					})

					//connection.write(userString);
		} else {
			for (var i = 0; i<connections.length; i++){
				connections[i].sock.write(userObj.name+" says: "+chatData + "\n");
			}
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






