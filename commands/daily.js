const economy = require('../economy')

module.exports = {
    name: 'daily',
    description: 'Receive 50 coins a day',
    cooldown: 24 * 60 * 60,
    async execute(msg, args, embed, guildId, userId, target) {
        const coins = 50;

        const newCoins = await economy.addCoins(guildId, userId, coins);

        msg.channel.send(embed.setDescription(`You received: \n\n ${coins} :coin:`))
    }
}