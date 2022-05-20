const express = require('express')
const app = express()
const cookieSession = require("cookie-session");
const mongoose = require('mongoose')
const passportSetup = require("./passport");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const authRoute = require("./routes/auth");
const UserRoute = require("./routes/UserRoute.js");
require("dotenv").config()
const cors = require('cors')
var fs  = require('fs');

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/website-test-register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
const db = mongoose.connection;

db.once('open', () => {
    console.log("Connected to MongoDB database...");
});

app.use(
    cookieSession({ name: "session", keys: ["toy"], maxAge: 10 * 24 * 60 * 60 * 100 })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: process.env.Remote_Server_IP+":3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

//Routes
app.use("/auth", authRoute);
app.use("/api", UserRoute);



app.listen(5000, () => {
    console.log('Server started on 5000')
})

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