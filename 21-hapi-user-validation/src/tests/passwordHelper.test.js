const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const PASSWORD = 'Th1@g00l84'
const HASH = '$2b$04$3ZwnuAcDkONQTcnOIvXZqOVoUEnMSepnCdaQyO4R6D7aFWGA9gNI6'
describe('UserHelper Teste Suíte', function() {
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(PASSWORD)
        assert.ok(result.length > 10)
    })

    it('Deve validar a senha', async () => {
        const result = await PasswordHelper.comparePassword(PASSWORD, HASH)
        assert(result)
    })

    it('Deve invalidar a senha se passar senha inválida', async () => {
        const result = await PasswordHelper.comparePassword(PASSWORD, 'hahahah')
        assert(!result)
    })
})