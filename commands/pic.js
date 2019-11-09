function pad(n, len)
{
    s = n.toString();
    if (s.length < len) {
        s = ('0000000000' + s).slice(-len);
    }

    return s;
}


module.exports = {
	name: 'pic',
	description: 'gets a random minka pic',
	execute(message, args, sql_database) {
        const Discord = require('discord.js');		// Discord module
        const { configs } = require('../config.json');

        pic_num = 0;
        pic_count = configs.pic_count;
        // If the number is not specified - choose random pic
        if (args.length < 1)
        {
            pic_num = Math.floor(Math.random() * pic_count);
        }
        // If number is specified - use that pic
        else
        {
            if (isNaN(parseInt(args[0])))
            {
                pic_num = Math.floor(Math.random() * pic_count);
                message.channel.send("Invalid pic number, but here's a Minka pic for your efforts.");
            }
            else if (parseInt(args[0]) > pic_count - 1 || parseInt(args[0]) < 0)
            {
                pic_num = Math.floor(Math.random() * pic_count);
                message.channel.send("Invalid pic number, but here's a Minka pic for your efforts.");
            }
            else
            {
                pic_num = parseInt(args[0]);
            }
        }
        const pic = new Discord.Attachment('images/pic' + pad(pic_num, 3) + '.jpg');
        const embed = {
            //title: 'Minka',
            image: {
                url: 'attachment://pic' + pad(pic_num, 3) + '.jpg',
            }
        }
        message.channel.send({ files: [pic], embed: embed});
	},
};