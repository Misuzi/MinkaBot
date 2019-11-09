module.exports = {
	name: 'pet',
	description: 'pets minka',
	async execute(message, args, sql_database) {
                const Sequelize = require('sequelize');

                const Pets = sql_database.define('pets', {
                        user_id: {
                                type: Sequelize.STRING,
                                unique: true,
                        },
                        count: {
                                type: Sequelize.INTEGER,
                                defaultValue: 1,
                                allowNull: false,
                        },
                });
                Pets.sync();

                const username = message.author.id;
                const user = await Pets.findOne({ where: { user_id: username } });
                if (user) {
                        console.log(user.get('count'));
                        await user.increment('count');
                        console.log(user.get('count'));
                        message.channel.send('Minka has been pet by you ' 
                                        + user.get('count') 
                                        + ' times!\nMinka appreciates.');
                }
                else
                {
                        try {
                                const new_user = await Pets.create({
                                        user_id: username,
                                        count: 1
                                });
                                
                        }
                        catch (e) {
                                if (e.name === 'SequelizeUniqueConstraintError') {
                                        return message.reply('Error adding new user');
                                }
                        }
                        message.channel.send('Minka has been pet!\n'
                                                +'Minka appreciates.');
                }
	},
};