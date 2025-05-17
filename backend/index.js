const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookies = require('cookie-parser');
const indexRouter = require('./routes/index');
const exceptionMiddleware = require('./middlewares/exceptions');

const app = express();

app.get('/', (req, res) => {
    res.end('<h1>Index page</h1>')
})

app.use(express.json());
app.use(cookies());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/auth', indexRouter);

app.use(exceptionMiddleware);

const port = process.env.PORT;
try{
    app.listen(port, () => console.log(`Server running on port ${port}`));
} catch (e) {
    console.log(e);
}
