const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')

const app = new Hapi.Server({
    port: 5000
})

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroesSchema)) 

    app.route({
        path: '/heroes',
        method: 'GET',
        handler: (request, headers) => {
            return context.read()
        }
    })

    await app.start();
    console.log('Hapi HTTP Server is running...')
}

main()