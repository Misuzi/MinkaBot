module.exports = {
	name: 'solve',
	description: 'solves scrambles',
	async execute(message, args, sql_database) {
        const fs = require('fs');
        const contents = fs.readFileSync('words_dictionary.json'); // Load library
        var dict = JSON.parse(contents);
        var scrambled_letters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var letter_check = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var results = [];
        var pass = 0;
        var test = 0;
        if (args.length < 1)
        {
            message.channel.send('Minka can\'t solve nothing');
        }
        else
        {
            scrambled_word = args[0].toLowerCase();
            for (i = 0; i < scrambled_word.length; i++)
            {
                scrambled_letters[scrambled_word.charCodeAt(i) - 97]++;
            }
            for (var dict_word in dict)
            {
                if (scrambled_word.length != dict_word.length)
                {
                    // Not same length - do nothing
                    test++;
                }
                else
                {
                    // reset letters
                    letter_check = scrambled_letters.slice(0);
                    pass = 1;
                    // decrement letters
                    for (i = 0; i < dict_word.length; i++)
                    {
                        letter_check[dict_word.charCodeAt(i) - 97]--;
                        if (letter_check[dict_word.charCodeAt(i) - 97] < 0)
                        {
                            pass = 0;
                        }
                    }
                    if (pass == 1)
                    {
                        results.push(dict_word);
                    }
                }
            }
            // Print results
            var result_out = "Minka has found " + results.length + " possible words: ";
            for (i = 0; i < results.length; i++)
            {
                if (i != 0)
                {
                    result_out += ", "
                }
                result_out += results[i];
            }
            result_out.concat(".");
            message.channel.send(result_out);
        }
	},
};