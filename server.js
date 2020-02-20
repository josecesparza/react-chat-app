const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/Users');
const chats = require('./routes/api/Chats');
const messages = require('./routes/api/Messages');

const app = express();

//BodyParser Middleware
app.use(bodyParser.json());

//DB Congig
const db = require('./config/keys').mongoURI;
// mongoose.connect(require('./config/keys').mongoURI, { useNewUrlParser: true });

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//User Routes
app.use('/api/users', users);
app.use('/api/chats', chats);
app.use('/api/messages', messages);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
