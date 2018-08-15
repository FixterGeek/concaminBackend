require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('./helpers/passport');
const session      = require('express-session');
const MongoStore = require('connect-mongo')(session);


mongoose.Promise = Promise;
mongoose
  //.connect('mongodb://brendijs:brendijs@ds129670.mlab.com:29670/concamin', {useMongoClient: true})
  .connect('mongodb://bliss:bliss@cluster0-shard-00-00-u2eux.mongodb.net:27017,cluster0-shard-00-01-u2eux.mongodb.net:27017,cluster0-shard-00-02-u2eux.mongodb.net:27017/concamin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
app.use(require('cors')());

// app.use(session({
//     store: new MongoStore({

//       connect: mongoose.connection
//     }),
//     secret:"brendijs",
//     resave:true,
//     saveUninitialized:true,
//     //cookie:{maxAge:456789, httpOnly:true}
// }));

app.use(passport.initialize());
app.use(passport.session());

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/auth', auth);
const posts = require('./routes/posts');
app.use('/posts', posts);
const chats = require('./routes/chats');
app.use('/chats', chats);
const groups = require('./routes/groups');
app.use('/groups', groups);
const comments = require('./routes/comments');
app.use('/comments', comments)


module.exports = app;
