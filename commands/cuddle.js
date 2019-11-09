module.exports = {
	name: 'cuddle',
	description: 'cuddles minka',
	execute(message, args, sql_database) {
        message.channel.send('You have cuddled Minka!\n' 
							+'Minka purrs.');
    },
};