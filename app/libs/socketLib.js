/**
 * modules dependencies.  SOCKETLIB.JS
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib.js');
const check = require('./checkLib.js');
const response = require('./responseLib');

let setServer = server => {
	let allOnlineUsers = [];

	let io = socketio.listen(server);

	let myIo = io.of('/');

	myIo.on('connection', socket => {
		console.log('on connection--emitting verify user');

		socket.emit('verifyUser', '');
		socket.emit('online-user-list', allOnlineUsers);

		// code to verify the user and make him online

		socket.on('set-user', authToken => {
			console.log('set-user called');
			tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
				if (err) {
					socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' });
				} else {
					console.log('user is verified..setting details');
					let currentUser = user.data;
					// setting socket user id
					socket.userId = currentUser.userId;
					let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
					console.log(`${fullName} is online`);
					socket.emit(currentUser.userId, 'You are online');

					let userObj = { userId: currentUser.userId, fullName: fullName };
					allOnlineUsers.push(userObj);
					console.log(allOnlineUsers);

                    // setting room name
                    socket.room = 'edChat'
                    // joining chat-group room.
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
				}
			});
		}); // end of listening set-user event

		// socket.on('get-userlist', authToken => {
		// 	console.log('get-userlist');
		// 	tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
		// 		if (err) {
		// 			socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' });
		// 		} else {
		// 			var userData = onlineUsers.userController(req, res, next);
		// 		}
		// 	});
		// }); // end of listening set-user event

		socket.on('disconnect', () => {
			// disconnect the user from socket
			// remove the user from online list
			// unsubscribe the user from his own channel

			console.log('user is disconnected');
			// console.log(socket.connectorName);
			console.log(socket.userId);
			var removeIndex = allOnlineUsers.map(function(user) {return user.userId;}).indexOf(socket.userId);
			allOnlineUsers.splice(removeIndex, 1);
			console.log(allOnlineUsers);

            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
			socket.leave(socket.room);
		}); // end of on disconnect
	});
};

module.exports = {
	setServer: setServer
};
