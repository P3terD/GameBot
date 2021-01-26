module.exports = {
    name: 'ping',
    description: 'shows ping',
    async execute(msg, args, embed) {
        const m = await msg.channel.send(embed.setDescription('pong!'));
        m.edit(embed.setDescription(`${m.createdTimestamp - msg.createdTimestamp}ms.`));
    }
}