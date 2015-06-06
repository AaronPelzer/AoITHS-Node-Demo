// REQUIRED MODULES
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    multer = require('multer');

// SETUP EXPRESS CONFIGURATION
app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer());

app.use(express.static(__dirname + '/public'));

// ROUTES
var students =  require("./controller/students.js");

app.use('/', students);

// ERROR HANDLING FOR THE UNSEEN
app.get('*', function(req, res, next){
    var err = new Error("Maybe the wrong page or ID??");
        err.status = 404;
        next(err);
});

app.use(function(err, req, res, next){
    
    // res.status(err.status);
    res.render('error', {
       title: "404 Not Found",
        msg: 'That what you think exists, does not. Try once more but differently~',
        error: err
    });
});

// SERVER INITILIZATION
var port = process.env.PORT || 8081;

http.listen(port, function () {
    console.log("Server Listening on " + port);
});