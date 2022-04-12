const router = require('express').Router()
const { add, list, show, webHook } = require('../controllers/transaction')

router.get('/transactions', list)
router.get('/transaction/:id', show)
router.post('/transaction', add)

module.exports = router
