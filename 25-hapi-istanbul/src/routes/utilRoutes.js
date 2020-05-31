const BaseRoute = require('./base/baseRoute')
const Path = require('path')

class UtilRoutes extends BaseRoute {
    constructor() {
        super()
    }

    coverage() {
        return {
            path: '/coverage/{params*}',
            method: 'GET',
            options: {
                auth: false,
                handler: {
                    directory: {
                        path: Path.join(__dirname, '../../coverage'),
                        redirectToSlash: true,
                        index: true
                    }
                }
            }
        }
    }
}

module.exports = UtilRoutes