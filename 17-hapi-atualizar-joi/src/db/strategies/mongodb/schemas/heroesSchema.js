const Mongoose = require('mongoose')

const heroesSchema = Mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    poder: {
        type: String,
        require: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})
module.exports = Mongoose.model('heroes', heroesSchema)

