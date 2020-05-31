const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "invalid env! required 'prod' or 'dev'")

const configPath = join('./config', `.env.${env}`)
config ({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_KEY = process.env.JWT_KEY

const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroesRoutes = require('./routes/heroesRoutes')
const AuthRoutes = require('./routes/authRoutes')
const UtilRoutes = require('./routes/utilRoutes')

const Postgres = require('./db/strategies/postgres/postgres')
const UserSchema = require('./db/strategies/postgres/schemas/userSchema')

const app = new Hapi.Server({
    port: process.env.PORT
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
    const contextMongoDb = new Context(new MongoDb(MongoDb.connect(), HeroesSchema)) 
    
    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UserSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

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
        key: JWT_KEY,
        // options: {
        //     expiresIn: 20
        // }
        validate: async (data, request) => {
            // validate if user is active
            const result = await contextPostgres.read({
                username: data.username.toLowerCase(),
                id: data.id
            })

            if(!result) return {
                isValid: false
            }

            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroesRoutes(contextMongoDb), HeroesRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY, contextPostgres), AuthRoutes.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ])

    await app.start();
    console.log('Hapi HTTP Server is running...')

    return app
}

module.exports = main()