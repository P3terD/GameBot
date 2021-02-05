const mongo = require('./mongo')
const profileSchema = require('./schema/profile-schema')

module.exports.addCoins = async (guildId, userId, coins) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log('Running findOneAndUptade')

            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $inc: {
                    coins
                }
            }, {
                upsert: true,
                new: true
            })

            console.log('RESULT: ', result)

            return result.coins
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.getCoins = async (guildId, userId) => {
    return await mongo().then(async mongoose => {
        try {
            console.log('Running result');

            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            console.log('RESULT:', result);

            let coins = 0;

            if(result) {
                coins = result.coins
            } else {
                console.log('Inserting a document')
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }

            return coins
        } finally {
            mongoose.connection.close()
        }
    })
}