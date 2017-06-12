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

    db.users.findOne({ username: username}, function(err, user) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstname,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, process.env.SECRET)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray((err, users) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        // return users (without hashed passwords)
        users = _.map(users, (user) => {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne({ username: userParam.username }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user) {
            // username already exists
            deferred.reject('Username "' + userParam.username + '" is already taken');
        } else {
            createUser();
        }
    });

    createUser();

    return deferred.promise;
}

function createUser() {
    // set user object to userParam without the cleartext password
    var user = _.omit(userParam, 'password');

    // add hashed password to user object
    user.hash = bcrypt.hashSync(userParam.password, 10);

    db.users.insert(user, (err, doc) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        deferred.resolve();
    });
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne({ username: userParam.username }, (err, user) => {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }

                if (user) {
                    // username already exists
                    deferred.reject('Username "' + req.body.username + '" is already taken');
                } else {
                    updateUser();
                }
            });
        } else {
            updateUser();
        }

    });

    updateUser();

    return deferred.promise;
}

function updateUser() {
    // fields to update
    var set = {
        firstName: userParam.firstName,
        lastName: userParam.lastName,
        username: userParam.username
    };

    // update password if it was entered
    if (userParam.password) {
        set.hash = bcrypt.hashSync(userParam.password, 10);
    }

    db.users.update({ _id: mongo.helper.toObjectID(_id) }, { $set: set }, (err, doc) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        deferred.resolve();
    });
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove({ _id: mongo.helper.toObjectID(_id) }, (err) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        deferred.resolve();
    });

    return deferred.promise;
}