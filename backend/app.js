const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('cookie-session');

const discussionRoutes = require('./routes/discussion');
const userRoutes = require('./routes/user');

const path = require('path');

//Création d'une application express

const app = express();

//Middleware permettant d'accéder à l'API depuis n'importe quelle origine

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Middleware qui aide à sécuriser l'API en définissant divers en-tes HTTP
app.use(helmet());

//middleware qui sécurise les cookies en http-only
app.use(session({
  name:'session',
  secret: 's3Cur3',
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:5000'
 }
}));


//middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.json());

//middleware qui permet de charger les fichiers qui sont dans le répertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware qui va transmettre les requêtes de ces url vers les routes correspondantes
app.use('/api/discussion', discussionRoutes);
app.use('/api/user', userRoutes);

module.exports = app;