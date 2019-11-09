module.exports = {
	name: 'help',
	description: 'help dialog',
	execute(message, args, sql_database) {
		message.channel.send('Commands:\n'
							+'=========\n'
							+'M!help\n'
							+'M!pet\n'
							+'M!pic\n'
							+'M!solve [scramble]\n'
							+'M!toast\n'
							+'M!cuddle');
	},
};