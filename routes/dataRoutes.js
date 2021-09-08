module.exports = (app) => {
    const data = require('../controllers/dataController')
    const router = require('express').Router()

    router.get('/', data.findLast)
    router.get('/log', data.findAll)

    app.use('/api/data', router)

}