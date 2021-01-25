const { description } = require("./ping")

module.exports = {
    name: 'server',
    description: 'server info',
    execute(msg, args, embed) {
        msg.channel.send(embed.setDescription(
            `Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`
        ));
    }
}