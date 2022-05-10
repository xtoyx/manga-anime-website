const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cors = require('cors')
const MangaRoute = require('./routes/Manga');
const tagsRoute = require('./routes/tags');
const CommentRoute = require('./routes/Comments');
const cookieParser = require('cookie-parser');
const AdminLikeMangas = require('./routes/AdminLikeMangas')
var fs  = require('fs');

// Create express app
const app = express();
app.use(express.json());
var zip = require('express-easy-zip');
chalk.level = 1;
const error = chalk.bold.red;
const warning = chalk.hex('#FFA500');
const GoodTogo=chalk.bold.green;
app.use(cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }))
    // Database
mongoose.connect('mongodb://localhost:27017/website-test-register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
    console.log(GoodTogo("Connected to MongoDB database..."));
});

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(zip());



// Routes
app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.use('/MangaLikedByAdmin',AdminLikeMangas);
app.use('/comments', CommentRoute);
app.use('/m', MangaRoute);
app.use('/tags', tagsRoute);


const util = require('util');
const TextEncoder = new util.TextEncoder();

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var ws = fs.createWriteStream(`logs/${today.toLocaleDateString("en-US",options)}.log`, { 
    'flags'   : 'w',
    'encoding': 'utf8',
    'mode'    : 0666,
});
process.stdout.wr = process.stdout.write;
process.stdout.er = process.stderr.write;

process.stdout.write = function(mes, c) {
    ws.write(mes + '\r\n');
    process.stdout.wr(mes, c)   
};
process.stderr.write = function(mes, c) {
    ws.write(mes + '\r\n');
    process.stdout.er(mes, c)   
};

// Starting server
app.listen(5001, console.log(GoodTogo("Listening on port 5001")));