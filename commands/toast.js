module.exports = {
	name: 'toast',
	description: 'sends toast',
	async execute(message, args, sql_database) {
        const fs = require('fs');

        // One toast
        if (args.length < 1)
        {
            message.channel.send('Toast');
        }
        else
        {
            var num_toast = parseInt(args[0], 10);
            if (num_toast > 50) num_toast = 50;
            for (i = 0; i < num_toast; i++)
            {
                message.channel.send('Toast');
            }
        }
	},
};