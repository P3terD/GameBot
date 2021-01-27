const fs = require('fs');
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const mongo = require('./mongo');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", async () =>{
    console.log('Ready!');
    client.user.setActivity(";help", { type:"LISTENING" });

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo!')
        } finally {
            mongoose.connection.close()
        }
    })
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const embed = new Discord.MessageEmbed()
    .setColor(msg.guild.me.displayHexColor)
    .setAuthor('GameBot', 'https://i.imgur.com/J05QPuL.png');

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(msg, args, embed);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
})

client.login(token);