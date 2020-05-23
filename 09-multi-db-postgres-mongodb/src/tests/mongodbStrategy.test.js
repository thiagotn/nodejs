const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

const MOCK_HEROE_CREATE = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const MOCK_HEROE_FOR_READ = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super teia'
}

const MOCK_HEROE_FOR_UPDATE = {
    nome: `Coringa-${Date.now()}`,
    poder: 'Guarda Chuva'
}

let MOCK_HEROE_FOR_UPDATE_ID = ''


const context = new Context(new Mongodb())
describe('Mongodb Suite de testes', function () {
    this.beforeAll(async() => {
        await context.connect()
        await context.create(MOCK_HEROE_FOR_READ)
        const result = await context.create(MOCK_HEROE_FOR_UPDATE)
        MOCK_HEROE_FOR_UPDATE_ID = result._id
    })

    it('Verificar conexão', async() => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })

    it('Cadastrar herói', async() => {
        const { nome, poder} = await context.create(MOCK_HEROE_CREATE)
        assert.deepEqual({ nome, poder }, MOCK_HEROE_CREATE)
    })

    it('Listar heróis', async() => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROE_FOR_READ.nome, poder: MOCK_HEROE_FOR_READ.poder})
        assert.deepEqual({ nome, poder }, MOCK_HEROE_FOR_READ)
    })

    it('Atualizar herói', async() => {
        const result = await context.update(MOCK_HEROE_FOR_UPDATE_ID, { 
            poder: "Sorriso"
        })
        assert.deepEqual(result.nModified, 1)
    })

    it('Remover herói', async() => {
        const result = await context.delete(MOCK_HEROE_FOR_UPDATE_ID)
        assert.deepEqual(result.n, 1)
    })
})