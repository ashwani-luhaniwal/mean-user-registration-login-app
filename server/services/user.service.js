const _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    Q = require('q'),
    mongo = require('mongoskin'),
    db = mongo.db(process.env.DB_URI, {native_parser: true});
    // db = mongoose.connect(process.env.DB_URI);
    
db.bind('users');

module.exports = {
    authenticate:   authenticate,
    getAll:         getAll,
    getById:        getById,
    create:         create,
    update:         update,
    delete:         _delete
}

function authenticate(username, password) {
    let deferred = Q.defer();

    
}

function getAll() {

}

function getById(_id) {

}

function create(userParam) {

}

function update(_id, userParam) {

}

function _delete(_id) {

}