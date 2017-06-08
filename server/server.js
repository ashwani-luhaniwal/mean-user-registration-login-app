// require('rootpath')();
// load environment variables
require('dotenv').config();

const express   = require('express'),
    port        = process.env.NODE_ENV === 'production' ? 80 : 4000,
    app         = express(),
    cors        = require('cors'),
    bodyParser  = require('body-parser'),
    expressJwt  = require('express-jwt'),
    mongoose    = require('mongoose'),
    path        = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// tell express where to look for static assets
app.use(express.static(path.join(__dirname, '/public')));

// use JWT auth to secure the api
app.use(expressJwt({ secret: process.env.SECRET }).unless({ path: ['/users/authenticate', '/users/register'] }));

// routes
app.use(require('./app/routes'));

// connect to our database
mongoose.connect(process.env.DB_URI);

// start server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});