const economy = require('../economy')

module.exports = {
    name: 'balance',
    aliases: ['bal'],
    type: 'economy',
    description: 'shows your amount of coins', 
    async execute(msg, args, embed, guildId, userId, target) {
        const coins = await economy.getCoins(guildId, userId);

        msg.channel.send(embed.setDescription(`***${target}'s Balance***\n\n**Coins:** ${coins} :coin:`))
    }
}