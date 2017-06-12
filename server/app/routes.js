// create a new express router
const express       = require('express'),
    router          = express.Router(),
    usersController = require('./controllers/users.controller');

// export the router
module.exports = router;

// define the routes
// users route
router.get('/users');

// routes
router.post('/authenticate', usersController.authenticate);
router.post('/register', usersController.register);
router.get('/', usersController.getAll);
router.get('/current', usersController.getCurrent);
router.put('/:_id', usersController.update);
router.delete('/:_id', usersController.delete);