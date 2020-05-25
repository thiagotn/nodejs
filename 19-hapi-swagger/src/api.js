const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')

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

const SwaggerOptions = {
    info: {
        title: 'API Heróis - Curso NodeBR',
        version: 'v1.0'
    },
    // lang: 'pt'
}

async function main() {
    const context = new Context(new MongoDb(MongoDb.connect(), HeroesSchema)) 

    await app.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: SwaggerOptions 
        }
    ])

    app.route([...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods())])

    await app.start();
    console.log('Hapi HTTP Server is running...')

    return app
}

module.exports = main()