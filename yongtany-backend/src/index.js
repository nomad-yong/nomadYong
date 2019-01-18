const express = require('express');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// Routes
app.use('/users', require('routes/users.routes'));
app.use('/posts', require('routes/posts.routes'));

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, err => {
  if(err) {
    throw err;
  } else {
    console.log(`
        --------------------------------
        Server runnging on port: ${port}
        --------------------------------
        `);
  }
});
console.log(`Server listening at ${port}`);