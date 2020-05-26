const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MINHA_CHAVE_SECRETA'

const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroesRoutes = require('./routes/heroesRoutes')
const AuthRoutes = require('./routes/authRoutes')

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
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: SwaggerOptions 
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (data, request) => {
            // validate if user is active
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroesRoutes(context), HeroesRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
    ])

    await app.start();
    console.log('Hapi HTTP Server is running...')

    return app
}

module.exports = main()