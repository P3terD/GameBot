const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['h', 'commands'],
    usage: '[command name]',
    execute(msg, args, embed) {
        const data = [];
        const { commands } = msg.client;

        if(!args.length) {

            data.push('**Here\'s a list of all my commands:** ');
            data.push(commands.map(command => `\`${command.name}\``).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return msg.channel.send(embed.setDescription(data));
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return msg.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** \n${command.name}`);

        if (command.aliases) data.push(`\n**Aliases:** \n${command.aliases.join(', ')}`);
        if (command.description) data.push(`\n**Description:** \n${command.description}`);
        if (command.usage) data.push(`\n**Usage:** \n${prefix}${command.name} ${command.usage}`);

        msg.channel.send(embed.setDescription(data));
    }

}