const Mongoose = require('mongoose')

Mongoose.connect('mongodb://thiago:minhasenha@localhost:27017/heroes', 
    { useNewUrlParser: true }, function(error) {
        if (!error) return;
        console.log('Falha na conexão', error)
    })

const connection = Mongoose.connection
connection.once('open', () => console.log('conectado ao mongodb'))

// setTimeout(() => {
//     const state = connection.readyState
//     console.log('state', state)    
// }, 1000) 

/**
 * 0 - desconectado
 * 1 - conectado
 * 2 - conectando
 * 3 - desconectando
 */

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

const model = Mongoose.model('heroes', heroesSchema)

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman', 
        poder: 'Dinheiro'
    }) 
    console.log('resultCadastrar', resultCadastrar)

    const listHeroes = await model.find( { nome: 'Mulher Maravilha', poder: 'Velocidade' })
    console.log('resultListar', listHeroes)
}

main()