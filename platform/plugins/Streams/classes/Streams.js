"use strict";
/*jshint node:true */
/**
 * Streams model
 * @module Streams
 * @main Streams
 */
var Q = require('Q');
var fs = require('fs');

/**
 * Static methods for the Streams model
 * @class Streams
 * @extends Base.Streams
 * @static
 */
function Streams() { }
module.exports = Streams;

var Base_Streams = require('Base/Streams');
Q.mixin(Streams, Base_Streams);


/*
 * This is where you would place all the static methods for the models,
 * the ones that don't strongly pertain to a particular row or table.
 * Just assign them as methods of the Streams object.
 
 * * * */

if (!Q.plugins.Users) {
	throw new Q.Exception("Streams: Users plugin is required");
}

var util = require('util');
var Db = Q.require('Db');
var Users = Q.plugins.Users;
var socket = null;

Q.makeEventEmitter(Streams);

/**
 * Read levels
 * @property READ_LEVEL
 * @type object
 */
/**
 * Can't see the stream
 * @config READ_LEVEL['none']
 * @type integer
 * @default 0
 * @final
 */
/**
 * Can see icon and title
 * @config READ_LEVEL['see']
 * @type integer
 * @default 10
 * @final
 */
/**
 * Can preview stream and its content
 * @config READ_LEVEL['content']
 * @type integer
 * @default 20
 * @final
 */
/**
 * Can see participants in the stream
 * @config READ_LEVEL['participants']
 * @type integer
 * @default 30
 * @final
 */
/**
 * Can play stream in a player
 * @config READ_LEVEL['messages']
 * @type integer
 * @default 40
 * @final
 */
Streams.READ_LEVEL = {
	'none':			0,		// can't see the stream
	'see':			10,		// can see icon and title
	'content':		20,		// can preview stream and its content
	'participants':	30,		// can see participants in the stream
	'messages':		40		// can play stream in a player
};
/**
 * Write levels
 * @property WRITE_LEVEL
 * @type object
 */
/**
 * Cannot affect stream or participants list
 * @config WRITE_LEVEL['none']
 * @type integer
 * @default 0
 * @final
 */
/**
 * Can become a participant, chat, and leave
 * @config WRITE_LEVEL['join']
 * @type integer
 * @default 10
 * @final
 */
/**
 * Can vote for a relation message posted to the stream
 * @config WRITE_LEVEL['vote']
 * @type integer
 * @default 13
 * @final
 */
/**
 * Can post messages, but manager must approve
 * @config WRITE_LEVEL['postPending']
 * @type integer
 * @default 15
 * @final
 */
/**
 * Can post messages which appear immediately
 * @config WRITE_LEVEL['post']
 * @type integer
 * @default 20
 * @final
 */
/**
 * Can post messages relating other streams to this one
 * @config WRITE_LEVEL['relate']
 * @type integer
 * @default 23
 * @final
 */
/**
 * Can post messages requesting edits of stream
 * @config WRITE_LEVEL['suggest']
 * @type integer
 * @default 25
 * @final
 */
/**
 * Can post messages to edit stream content immediately
 * @config WRITE_LEVEL['edit']
 * @type integer
 * @default 30
 * @final
 */
/**
 * Can post a message requesting to close the stream
 * @config WRITE_LEVEL['closePending']
 * @type integer
 * @default 35
 * @final
 */
/**
 * Don't delete, just prevent any new changes to stream
 * however, joining and leaving is still ok
 * @config WRITE_LEVEL['close']
 * @type integer
 * @default 40
 * @final
 */
Streams.WRITE_LEVEL = {
	'none':			0,		// cannot affect stream or participants list
	'join':			10,		// can become a participant, chat, and leave
	'vote':         13,		// can vote for a relation message posted to the stream
	'postPending':	18,		// can post messages which require manager's approval
	'post':			20,		// can post messages which take effect immediately
	'relate':       23,		// can relate other streams to this one
	'relations':    25,		// can update properties of relations directly
	'suggest':      28,		// can suggest edits of stream
	'edit':			30,		// can edit stream content immediately
	'closePending':	35,		// can post a message requesting to close the stream
	'close':		40		// don't delete, just prevent any new changes to stream
							// however, joining and leaving is still ok
};
/**
 * Admin levels
 * @property ADMIN_LEVEL
 * @type object
 */
/**
 * Cannot do anything related to admin / users
 * @config ADMIN_LEVEL['none']
 * @type integer
 * @default 0
 * @final
 */
/**
 * Can post on your stream about participating
 * @config ADMIN_LEVEL['tell']
 * @type integer
 * @default 10
 * @final
 */
/**
 * Able to create invitations for others, granting access
 * @config ADMIN_LEVEL['invite']
 * @type integer
 * @default 20
 * @final
 */
/**
 * Can approve posts and give people any adminLevel < 'manage'
 * @config ADMIN_LEVEL['manage']
 * @type integer
 * @default 30
 * @final
 */
/**
 * Can give people any adminLevel <= 'own'
 * @config ADMIN_LEVEL['own']
 * @type integer
 * @default 40
 * @final
 */
Streams.ADMIN_LEVEL = {
	'none':			0,		// cannot do anything related to admin / users
	'tell':		10,		// can post on your stream about participating
	'invite':		20,		// able to create invitations for others, granting access
	'manage':		30,		// can approve posts and give people any adminLevel < 30
	'own':			40		// can give people any adminLevel <= 40
};
/**
 * Access sources
 * @property ACCESS_SOURCES
 * @type object
 */
/**
 * Public access
 * @config ACCESS_SOURCES['public']
 * @type integer
 * @default 0
 * @final
 */
/**
 * From contact
 * @config ACCESS_SOURCES['contact']
 * @type integer
 * @default 1
 * @final
 */
/**
 * Direct access
 * @config ACCESS_SOURCES['direct']
 * @type integer
 * @default 2
 * @final
 */
/**
 * Inherited public access
 * @config ACCESS_SOURCES['inherited_public']
 * @type integer
 * @default 3
 * @final
 */
/**
 * Inherited from contact
 * @config ACCESS_SOURCES['inherited_contact']
 * @type integer
 * @default 4
 * @final
 */
/**
 * Inherited direct access
 * @config ACCESS_SOURCES['inherited_direct']
 * @type integer
 * @default 5
 * @final
 */
Streams.ACCESS_SOURCES = {
	'public':				0,
	'contact':				1,
	'direct':				2,
	'inherited_public':		3,
	'inherited_contact':	4,
	'inherited_direct':		5
};

Streams.defined = {};

/**
 * Call this function to set a constructor for a stream type
 * @static
 * @method define
 * @param {String} type The type of the message, e.g. "Streams/chat/message"
 * @param {String|Function} ctor Your message's constructor, or path to a javascript file which will define it
 * @param {Object} methods An optional hash of methods. You can also override methods of the
 *  Stream object, such as "url".
 */
Streams.define = function (type, ctor, methods) {
	if (typeof type === 'object') {
		for (var t in type) {
			Streams.define(t, type[t]);
		}
		return;
	};
	type = Q.normalize(type);
	if (typeof ctor !== 'function') {
		throw new Q.Error("Q.Streams.Stream.define requires ctor to be a function");
	}
	function CustomStreamConstructor() {
		CustomStreamConstructor.constructors.apply(this, arguments);
		ctor.apply(this, arguments);
	}
	Q.mixin(CustomStreamConstructor, Streams.Stream);
	Q.extend(CustomStreamConstructor.prototype, methods);	
	return Streams.defined[type] = CustomStreamConstructor;
};

/**
 * Start internal listener for Streams plugin. Accepts messages such as<br/>
 * "Streams/Stream/join",
 * "Streams/Stream/leave",
 * "Streams/Stream/create",
 * "Streams/Stream/remove",
 * "Streams/Message/post",
 * "Streams/Message/postMessages",
 * "Streams/Stream/invite"
 * @method listen
 * @static
 * @param {Object} options={} So far no options are implemented.
 */
Streams.listen = function (options) {

	// Start internal server
	var server = Q.listen();
	server.attached.express.post('/Q/node', Streams_request_handler);

	// Start external socket server
	var pubHost = Q.Config.get(['Streams', 'node', 'host'], Q.Config.get(['Q', 'node', 'host'], null));
	var pubPort = Q.Config.get(['Streams', 'node', 'port'], Q.Config.get(['Q', 'node', 'port'], null));

	if (pubHost === null) {
		throw new Q.Exception("Streams: Missing config field: Streams/node/host");
	}
	if (pubPort === null) {
		throw new Q.Exception("Streams: Missing config field: Streams/node/port");
	}

	// Handle messages being posted to streams
	Streams.Stream.on('post', function (stream, byUserId, msg, clientId) {
		if (_messageHandlers[msg.fields.type]) {
			_messageHandlers[msg.fields.type].call(this, msg);
		}
		Streams.Stream.emit('post/'+msg.fields.type, stream, byUserId, msg);
		stream.notifyParticipants('Streams/post', byUserId, msg);
	});

	/**
	 * @property socketServer
	 * @type {SocketNamespace}
	 * @private
	 */
	socket = Users.Socket.listen({
		host: pubHost,
		port: pubPort,
		https: Q.Config.get(['Q', 'node', 'https'], false) || {}
	});

};

function Streams_request_handler (req, res, next) {
	var parsed = req.body;
	if (!parsed || !parsed['Q/method']) {
		return next();
	}
	var participant, stream, msg, posted, streams, deviceId, title, k;
	var clientId = parsed["Q.clientId"];
	var stream = parsed.stream
		&& Streams.Stream.construct(JSON.parse(parsed.stream), true);
	switch (parsed['Q/method']) {
		case 'Users/device':
			break;
		case 'Users/logout':
			var userId = parsed.userId;
			var sessionId = parsed.sessionId;
			if (userId && sessionId) {
				var clients = Users.clients[userId];
				for (var cid in clients) {
					if (clients[cid].sessionId === sessionId) {
						clients[cid].disconnect();
					}
				}
			}
			Users.pushNotifications(userId, sessionId, {
				badge: 0
			});
			break;
		case 'Streams/Stream/join':
			participant = new Streams.Participant(JSON.parse(parsed.participant));
			participant.fillMagicFields();
			userId = participant.fields.userId;
			if (Q.Config.get(['Streams', 'logging'], false)) {
				Q.log('Streams.listen: Streams/Stream/join {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '"}'
				);
			}
			// invalidate cache for this stream
//				Streams.getParticipants.forget(stream.fields.publisherId, stream.fields.name);
			// inform user's clients about change
			Users.Socket.emitToUser(userId, 'Streams/join', participant);
			Streams.Stream.emit('join', stream, userId, clientId);
			break;
		case 'Streams/Stream/visit':
			participant = JSON.parse(parsed.participant);
			userId = participant.userId;
			Streams.Stream.emit('visit', stream, userId, clientId);
			break;
		case 'Streams/Stream/leave':
			participant = new Streams.Participant(JSON.parse(parsed.participant));
			participant.fillMagicFields();
			userId = participant.fields.userId;
			if (Q.Config.get(['Streams', 'logging'], false)) {
				Q.log('Streams.listen: Streams/Stream/leave {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '"}'
				);
			}
			// invalidate cache for this stream
//				Streams.getParticipants.forget(stream.fields.publisherId, stream.fields.name);
			// inform user's clients about change
			Users.Socket.emitToUser(userId, 'Streams/leave', participant);
			Streams.Stream.emit('leave', stream, userId, clientId);
			break;
		case 'Streams/Stream/remove':
			if (Q.Config.get(['Streams', 'logging'], false)) {
				Q.log('Streams.listen: Streams/Stream/remove {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '"}'
				);
			}
			// invalidate cache
			stream.notifyParticipants('Streams/remove', null, {
				publisherId: stream.fields.publisherId, 
				name: stream.fields.name
			});
			Streams.Stream.emit('remove', stream, clientId);
			break;
		case 'Streams/Stream/create':
			if (Q.Config.get(['Streams', 'logging'], false)) {
				Q.log('Streams.listen: Streams/Stream/create {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '"}'
				);
			}
			Streams.Stream.emit('create', stream, clientId);
			// no need to notify anyone
			break;
		case 'Streams/Message/post':
			msg = Streams.Message.construct(JSON.parse(parsed.message), true);
			msg.fillMagicFields();
			if (Q.Config.get(['Streams', 'logging'], false)) {
				Q.log('Streams.listen: Streams/Message/post {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '", "msg.type": "' + msg.fields.type
					+ '"}'
				);
			}
			Streams.Stream.emit('post', stream, msg.fields.byUserId, msg, clientId);
			break;
		case 'Streams/Message/postMessages':
			posted = JSON.parse(parsed.posted);
			streams = parsed.streams && JSON.parse(parsed.streams);
			if (!streams) break;
			for (k in posted) {
				msg = Streams.Message.construct(posted[k], true);
				msg.fillMagicFields();
				stream = Streams.Stream.construct(
					streams[msg.fields.publisherId][msg.fields.streamName], true
				);
				if (Q.Config.get(['Streams', 'logging'], false)) {
					Q.log('Streams.listen: Streams/Message/post {'
						+ '"publisherId": "' + stream.fields.publisherId
						+ '", "name": "' + stream.fields.name
						+ '", "msg.type": "' + msg.fields.type
						+ '"}'
					);
				}
				Streams.Stream.emit('post', stream, msg.fields.byUserId, msg, clientId);
			}
			break;
		case 'Streams/Stream/invite':
			var userIds, invitingUserId, username, appUrl, parts, rest, label, myLabel,
			    readLevel, writeLevel, adminLevel, displayName, expiry, logKey;
			try {
				userIds = JSON.parse(parsed.userIds);
				invitingUserId = parsed.invitingUserId;
				username = parsed.username;
				appUrl = parsed.appUrl;
				readLevel = parsed.readLevel || null;
				writeLevel = parsed.writeLevel || null;
				adminLevel = parsed.adminLevel || null;
				displayName = parsed.displayName || '';
				expiry = parsed.expiry ? new Date(parsed.expiry*1000) : null;
			} catch (e) {
				return res.send({data: false});
			}
			res.send({data: true});
			if (logKey = Q.Config.get(['Streams', 'logging'], false)) {
				Q.log(
				    'Streams.listen: Streams/Stream/invite {'
					+ '"publisherId": "' + stream.fields.publisherId
					+ '", "name": "' + stream.fields.name
					+ '", "userIds": ' + parsed.userIds
					+ '}',
					logKey
				);
			}

			if (expiry && expiry <= new Date()) {
			    break;
			}
			
			persist();
			
			return;
		default:
			break;
	}
	return next();
	
	function persist () {
	
		Q.each(userIds, function (i, userId) {
			var token = null;
							
		    // TODO: Change this to a getter, so that we can do throttling in case there are too many userIds
			(new Streams.Participant({
				"publisherId": stream.fields.publisherId,
				"streamName": stream.fields.name,
				"userId": userId,
				"state": "participating"
			})).retrieve(_participant);
			
			function _participant(err, rows) {
				if (rows && rows.length) {
					// User is already a participant in the stream.
					return;
				}
				(new Streams.Invite({
					"userId": userId,
					"state": "pending",
					"publisherId": stream.fields.publisherId,
					"streamName": stream.fields.name,
					"invitingUserId": invitingUserId,
					"displayName": displayName,
					"appUrl": appUrl,
					"readLevel": readLevel,
					"writeLevel": writeLevel,
					"adminLevel": adminLevel,
					"expireTime": expiry
				})).save(_inviteSaved);
			}

			function _inviteSaved(err) {
				if (err) {
					Q.log("ERROR: Failed to save Streams.Invite for user '"+userId+"' during invite");
					Q.log(err);
					return;
				}
				token = this.fields.token;
				// now ready to save Streams.Invited row
				(new Streams.Invited({
					"token": token,
					"userId": userId,
					"state": "pending",
					"expireTime": expiry
				})).save(_invitedSaved);
			}

			function _invitedSaved(err) {
				if (err) {
					Q.log("ERROR: Failed to save Streams.Invited for user '"+userId+"' during invite");
					Q.log(err);
					return;
				}
				var invite = this;
				(new Streams.Participant({
					"publisherId": stream.fields.publisherId,
					"streamName": stream.fields.name,
					"streamType": stream.fields.type,
					"userId": userId,
					"state": "invited",
					"reason": ""
				})).save(true, _participantSaved);
				
				// Write some files, if requested
				// SECURITY: Here we trust the input, which should only be sent internally
				if (parsed.template) {
					new Users.User({id: userId})
					.retrieve(function () {
						var fields = Q.extend({}, parsed, {
							stream: stream,
							user: this,
							invite: invite,
							link: invite.url(),
							app: Q.app,
							communityId: Users.communityId(),
							communityName: Users.communityName(),
							appRootUrl: Q.Config.expect(['Q', 'web', 'appRootUrl'])
						});
						var html = Q.Handlebars.render(parsed.template, fields);
						var path = Streams.invitationsPath(invitingUserId)
							+'/'+parsed.batchName;
						var filename = path + '/'
							+ Q.normalize(stream.fields.publisherId) + '-'
							+ Q.normalize(stream.fields.name) + '-'
							+ this.fields.id + '.html';
						fs.writeFile(filename, html, function (err) {
							if (err) {
								Q.log(err);
							}
						});
					});
				}
			}

			function _participantSaved(err) {
				if (err) {
					Q.log("ERROR: Failed to save Streams.Participant for user '"+userId+"' during invite");
					Q.log(err);
					return;
				}

				// Now post a message to Streams/invited stream
				Streams.fetchOne(invitingUserId, userId, 'Streams/invited', _stream);
			}

			function _stream(err, invited) {
				if (err) {
					Q.log("ERROR: Failed to get invited stream for user '"+userId+"' during invite");
					Q.log(err);
					return;
				}
				Streams.Stream.emit('invite', invited.getFields(), userId, stream);
				if (!invited.testWriteLevel('post')) {
					Q.log("ERROR: Not authorized to post to invited stream for user '"+userId+"' during invite");
					return;
				}
				var invitedUrl = Streams.invitedUrl(token);
				displayName = displayName || "Someone";
				var msg = {
					publisherId: invited.fields.publisherId,
					streamName: invited.fields.name,
					byUserId: invitingUserId,
					type: 'Streams/invite',
					sentTime: new Db.Expression("CURRENT_TIMESTAMP"),
					state: 'posted',
					content: displayName + " invited you to " + invitedUrl,
					instructions: JSON.stringify({
						token: token,
						displayName: displayName,
						appUrl: appUrl,
						invitedUrl: invitedUrl,
						type: stream.fields.type,
						title: stream.fields.title,
						content: stream.fields.content
					})
				};
				invited.post(msg, function (err) {
					if (err) {
						Q.log("ERROR: Failed to save message for user '"+userId+"' during invite");
						Q.log(err);
					}
				});
			}
		});

    }
}

// Connection from socket.io
Users.on('connected', function(client, wasOnline) {
	if (!wasOnline) {
		// post "connected" message to Streams/participating stream
		new Streams.Stream({
			publisherId: client.userId,
			name: 'Streams/participating'
		}).post(client.userId, {
			type: 'Streams/connected'
		}, function(err) {
			if (err) console.error(err);
		});
	}
});

Users.on('disconnected', function (userId) {
	// post "disconnected" message to Streams/participating stream
	new Streams.Stream({
		publisherId: userId,
		name: 'Streams/participating'
	}).post({
		byUserId: userId,
		type: 'Streams/disconnected'
	}, function(err) {
		if (err) console.error(err);
		Q.log('User disconnected: ' + userId);
	});	
});

/**
 * Retrieve stream participants
 * @method getParticipants
 * @static
 * @param {String} publisherId The publisher Id
 * @param {String} streamName The name of the stream
 * @param {Function} [callback=null] Callback receives a map of {userId: participant} pairs
 */
Streams.getParticipants = function(publisherId, streamName, callback) {
	var args = arguments;
	if (!callback) return;
	Streams.Participant.SELECT('*').where({
		publisherId: publisherId,
		streamName: streamName
	}).execute(function (err, rows) {
		if (err) {
			Q.log(err);
//			Streams.getParticipants.forget(publisherId, streamName);
			callback({});
		} else {
			var result = {};
			for (var i=0; i<rows.length; ++i) {
				result [ rows[i].fields.userId ] = rows[i];
			}
			callback(result);
		}
	});
};

/**
 * Retrieve stream with calculated access rights
 * @method fetch
 * @static
 * @param {String}  asUserId
 *	The user id to calculate access rights
 * @param {String} publisherId
 *	The publisher Id
 * @param {String|Array|Db.Range} streamName
 *	The name of the stream, or an array of names, or a Db.Range
 * @param callback=null {function}
 *	Callback receives the (err, stream) as parameters
 * @param {String} [fields='*']
 *  Comma delimited list of fields to retrieve in the stream.
 *  Must include at least "publisherId" and "name".
 *  since make up the primary key of the stream table.
 *  You can skip this argument if you want.
 * @param {Object} [options={}]
 *  Provide additional query options like 'limit', 'offset', 'orderBy', 'where' etc.
 *  @see Db_Query_Mysql::options().
 */
Streams.fetch = function (asUserId, publisherId, streamName, callback, fields, options) {
	if (!callback) return;
	if (!publisherId || !streamName) callback(new Error("Wrong arguments"));
	if (streamName.charAt(streamName.length-1) === '/') {
		streamName = new Db.Range(streamName, true, false, streamName.slice(0, -1)+'0');
	}
	if (Q.isPlainObject(fields)) {
		options = fields;
		fields = '*';
	}
	fields = fields || '*';
	Streams.Stream.SELECT(fields)
	.where({publisherId: publisherId, name: streamName})
	.options(options)
	.execute(function(err, res) {
		if (err) {
		    return callback(err);
		}
		if (!res.length) {
		    return callback(null, []);
		}
		var p = new Q.Pipe(res.map(function(a) { return a.fields.name; }),
		function(params, subjects) {
			for (var name in params) {
				if (params[name][0]) {
					callback(params[name][0]); // there was an error
					return;
				}
			}
			callback(null, subjects); // success
		});
		for (var i=0; i<res.length; i++) {
			res[i].calculateAccess(asUserId, p.fill(res[i].fields.name));
		}
	});
};

/**
 * Retrieve stream with calculated access rights
 * @method fetchOne
 * @static
 * @param {String} asUserId
 *	The user id to calculate access rights
 * @param {String} publisherId
 *	The publisher Id
 * @param {String} streamName
 *	The name of the stream
 * @param {Function} [callback=null]
 *	Callback receives the (err, stream) as parameters
 * @param {String} [fields='*']
 *  Comma delimited list of fields to retrieve in the stream.
 *  Must include at least "publisherId" and "name".
 *  since make up the primary key of the stream table.
 *  You can skip this argument if you want.
 * @param {Object} [options={}]
 *  Provide additional query options like 'limit', 'offset', 'orderBy', 'where' etc.
 *  @see Db_Query_Mysql::options().
 */
Streams.fetchOne = function (asUserId, publisherId, streamName, callback, fields, options) {
	if (!callback) return;
	if (!publisherId || !streamName) callback(new Error("Wrong arguments"));
	if (streamName.charAt(streamName.length-1) === '/') {
		streamName = new Db.Range(streamName, true, false, streamName.slice(0, -1)+'0');
	}
	if (Q.isPlainObject(fields)) {
		options = fields;
		fields = '*';
	}
	Streams.Stream.SELECT('*')
	.where({publisherId: publisherId, name: streamName})
	.options(options)
	.limit(1).execute(function(err, res) {
		if (err) {
		    return callback(err);
		}
		if (!res.length) {
		    callback(null, null);
		}
		res[0].calculateAccess(asUserId, function () {
		    callback.call(res[0], null, res[0]);
		});
	});
};

/**
 * Register a message handler
 * @method messageHandler
 * @static
 * @param {String} msgType
 *	Type of stream
 * @param {Function} callback
 *	The handler for stream messages
 */
Streams.messageHandler = function(msgType, callback) {
	if (callback === undefined) {
		return _messageHandlers[msgType];
	}
	if (typeof callback !== 'function') {
		throw new Q.Exception("Streams: callback passed to messageHandler is not a function");
	}
	_messageHandlers[msgType] = callback;
};

Streams.invitedUrl = function _Streams_invitedUrl(token) {
	return Q.url(Q.Config.get(['Streams', 'invites', 'baseUrl'], "i"))
		+ "/" + token;
};

Streams.invitationsPath = function _Streams_invitationsPath(userId) {
	var subpath = Q.Config.get(
		'Streams', 'invites', 'subpath',
		'{{app}}/uploads/Streams/invitations'
	);
	return Q.app.FILES_DIR + '/' + subpath.interpolate({
		app: Q.Config.expect(['Q', 'app'])
	}) + '/' + Q.Utils.splitId(userId);
};

/**
 * @property _messageHandlers
 * @type object
 * @private
 */
var _messageHandlers = {};
/**
 * @property _streams
 * @type object
 * @private
 */
var _streams = {};

/* * * */