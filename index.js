const fs = require('fs');
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const mongo = require('./mongo');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

const cooldowns = new Discord.Collection;

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

    const target = msg.mentions.users.first() || msg.author;

    const guildId = msg.guild.id;
    const userId = target.id;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmout = (command.cooldown || 3) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmout;
        
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            if (timeLeft > 60) {
                const timeLeftMin = timeLeft / 60;

                if (timeLeftMin > 60) {
                    const timeLeftH = timeLeftMin / 60;
                    return msg.reply(`please wait ${timeLeftH.toFixed(1)} more hour(s) before using the \`${command.name}\` command`)
                } else {
                    return msg.reply(`please wait ${timeLeftMin.toFixed(1)} more minute(s) before using the \`${command.name}\` command`)
                }
            } else {
                return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command`)   
            }
        }
    } else {
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmout);
    }

    try {
        command.execute(msg, args, embed, guildId, userId, target);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
})

client.login(token);