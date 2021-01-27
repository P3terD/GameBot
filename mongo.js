const mongoose = require('mongoose')
const { mongoURl } = require('./config.json')

module.exports = async () => {
    await mongoose.connect(mongoURl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return mongoose;
}