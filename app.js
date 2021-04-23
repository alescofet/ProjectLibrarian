require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const path          = require('path');
const bcrypt        = require(`bcrypt`)
const flash         = require(`connect-flash`)
const session       = require(`express-session`)
const passport      = require(`passport`)
const LocalStrategy = require(`passport-local`).Strategy
const chalk         = require(`chalk`)

//PASO 9:Importar modelo User
const User = require(`./models/User.model`)
const Book = require(`./models/Book.model`)

mongoose
  .connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => {
    console.log(chalk.green.inverse(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  })
  .catch(err => {
    console.error(chalk.red.inverse('Error connecting to mongo', err))
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//PASO 3: Configurar el middleware de Session.
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

//PASO 4: Configurar la serializacion del usuario.
passport.serializeUser((user, callback)=>{
    callback(null, user._id)
  })
  
  //PASO 5: Configurar la deserializacion del usuario.
  passport.deserializeUser((id, callback)=>{
    User.findById(id)
    .then((result) => {
      callback(null, result)
    }).catch((err) => {
      callback(err)
    });
  })
  
  //PASO 6: Configurar el middleware de flash
  app.use(flash())
  
  //PASO 7: Configurar el middleware del Strategy.
  passport.use(
    new LocalStrategy(
      {
        usernameField: `username`,
        passwordField: `password`,
        passReqToCallback: true,
      },
      (req, username, password, next) => {
        User.findOne({ username })
          .then((user) => {
            if (!user) {
              //si el usuario no existe
              return next(null, false, { message: `incorrect username` });
            }
            if (!bcrypt.compareSync(password, user.password)) {
              //Si la contraseña no coincide
              return next(null, false, { message: `Incorrect password` });
            }
            return next(null, user);
          })
          .catch((err) => {
            next(err);
          });
      }
    )
  );
  
 //PASO 10: Configurar middleware de passport
app.use(passport.initialize())
app.use(passport.session())

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index.routes'));
app.use(`/`, require(`./routes/auth.routes`))
app.use(`/books`, require(`./routes/books.routes`))
app.use(`/profile`, require(`./routes/profile.routes`))

app.listen(process.env.PORT, ()=>{
    console.log(chalk.green.inverse(`Conectado en el puerto ${process.env.PORT}`));
    
  })