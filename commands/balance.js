const economy = require('../economy')

module.exports = {
    name: 'balance',
    aliases: ['bal'],
    async execute(msg, args, embed) {
        const target = msg.mentions.users.first() || msg.author;

        const guildId = msg.guild.id;
        const userId = target.id;

        const coins = await economy.getCoins(guildId, userId);

        msg.channel.send(embed.setDescription(`***${target}'s Balance***\n\n**Coins:** ${coins}`))
    }
}