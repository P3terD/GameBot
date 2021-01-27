const mongoose = require('mongoose')

const reqString = {
    type: String,
    require: true
}

const profileSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('profiles', profileSchema)