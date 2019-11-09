// Project: MinkaBot
// Author: Misuzi
// File: index.js
// Description: Main Executable for MinkaBot

//=================================================================================
// Setup Server
//=================================================================================

// Required modules
const FS = require('fs');							// File System module
const Discord = require('discord.js');				// Discord module
const Sequelize = require('sequelize');				// SQL module

// Configuration files
const { configs } = require('./config.json');		// Configurations
const { auth_token } = require('./token.json');		// Authentication Token

// Initialize a new Discord client
const client = new Discord.Client();				// Discord Client Object

// Create Commands list
client.commands = new Discord.Collection();			// Discord commands structure
const commandFiles = FS.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {					// Iterates over each file in /commands
	const command = require(`./commands/${file}`);	// Command name is .js file name
	client.commands.set(command.name, command);		// Adds to command list
}

// Create Cooldown Tracker list
const cooldowns = new Discord.Collection();

//=================================================================================
// SQL Database Setup
//=================================================================================
// Connects to local database
const sql_database = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	storage: 'database.sqlite', 	// SQLite only
});

// Load each SQL Structure from its file in sql_structures folder
const sqlStructFiles = FS.readdirSync('./sql_structures').filter(file => file.endsWith('.js'));
for (const file of sqlStructFiles) {					
	const sql_structure = require(`./sql_structures/${file}`);	
	sql_structure.execute(sql_database);
}

//=================================================================================
// Discord bot behavior
//=================================================================================

// Startup ////////////////////////////////////////////////////////////////////////
// When the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    // SYNC EACH?
	sql_database.sync();						// Synchronize the SQL Database
	client.user.setActivity('M!help');	// Set status of bot
	console.log('Ready!');				// Output Ready to console
});

// Message handler ////////////////////////////////////////////////////////////////
// Is called when a message is detected in a server
// Executes a command if the message is worth responding to
client.on('message', async message => {

	// Ignore Message if is from another bot
	if (message.author.bot) return;

	// Accept message if it starts with one of the specified prefixes
	prefix_used = 0;
	message_is_valid = 0;
	for (i = 0; i < configs.prefixes.length; i++) {
		if (message.content.startsWith(configs.prefixes[i])) {
			message_is_valid = 1;
			prefix_used = i;
		}
	}
	if (!message_is_valid) return;

    // Parse args
    const args = message.content.slice(configs.prefixes[prefix_used].length).split(/ +/);


    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

	// Add a new cooldown
    if (!cooldowns.has(command.name)) {
	    cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        if (timestamps.has(message.author.id)) {
	        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	        if (now < expirationTime) {
		        const timeLeft = (expirationTime - now) / 1000;
		        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	        }
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Attempt to run command
    try {
	    command.execute(message, args, sql_database);
    } catch (error) {
	    console.error(error);
	    message.reply('there was an error trying to execute that command!');
    }
});

//=================================================================================
// login to Discord with your app's token
client.login(auth_token);