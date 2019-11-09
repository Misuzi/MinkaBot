module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, sql_database) {
		message.channel.send('Pong.');
	},
};