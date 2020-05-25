const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroesRoutes = require('./routes/heroesRoutes')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroesSchema)) 

    app.route([
        ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods())
    ])

    await app.start();
    console.log('Hapi HTTP Server is running...')

    return app
}

module.exports = main()