module.exports = {
    name: 'ping',
    description: 'shows ping',
    async execute(msg, args, embed) {
        const m = await msg.channel.send("pong");
        m.edit(embed.setDescription(`${m.createdTimestamp - msg.createdTimestamp}ms.`));
    }
}