const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/connection');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../client/build')));

connectDB();

//redirects requests to router
// app.use('/', require('./routes/router'));
app.get('/api', (req, res) => {
  const message = {
    name: 'hello there',
  };
  res.json({ message });
});

// app.get('/refresh');
app.use(authRoutes);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server running on PORT:${PORT}`);
});
