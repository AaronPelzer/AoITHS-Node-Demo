/* 
    INSTEAD OF USING THE STUDENT API (/API/Students) 
    THIS IS DIRECTLY INTERACTING WITH THE DATABASE (SQLITE)
    CRUD - CREATE | RETRIEVE | UPDATE | DELETE 
    METHODS BELOW WITH EACH PAGE
*/

// REQUIRED MODULES
var express = require('express'),
    router = express.Router(),
    sqlite = require('sqlite3').verbose(),
    db = new sqlite.Database('./aoit.sqlite');

// PAGE SETTINGS REQUIRED FOR EACH PAGE
var page = {
    title: "Student Roster",
    subTitle: ""
};

// TEST FUNC TO DETECT ID PARAM BEING PASSED
router.param('id', function (req, res, next, id) {
    console.log(id + " was pushed to server");
    next();
});


// PAGE ROUTES BEGINS

// GETS INDEX PAGE (views/Students/index.*ejs*) / [GETS ALL] STUDENTS FROM DATABASE / C- [R]etrieve -UD
router.get('/', function(req, res) { 
    var query = "SELECT * FROM Students";
	
    db.all(query, function (err, rows) {

        if (err) {
            console.log(err);
        }
        res.render('Students/index', {
            title: page.title,
            subTitle: "Roster",
            results: rows
        });
    });
});


// GETS CREATE PAGE FORM (views/Students/create.*ejs*) / NO DATABASE ACTION
router.get('/Create', function (req, res) {
    res.render('Students/create', {
        title: "Add Student Name"
    });
});


// SENDS DATA FROM CREATE PAGE TO DATABASE / POST METHOD / SENDS SINGLE DETAILS / [C]reate -RUD 
router.post('/Create', function (req, res) {
    
    var posted = req.body;
    
    var query = "INSERT INTO students (FirstName, LastName, ProfileImage, Hobby, Portfolio, SchoolID) VALUES(?,?,?,?,?,?)";
    
    db.prepare(query).run([posted.FirstName, posted.LastName, posted.ProfileImage, posted.Hobby, posted.Portfolio, posted.SchoolID], function(err){
        
        if(err){
            res.send(err); return;
        }
        res.redirect('/Details/' + this.lastID);
    });
    
});


// HELPER - CHECKS IF ID EXISTS - ERROR HANDLING
function exists(data, action, id, next){
    var o;
    
    switch(typeof data) {
        // REVISE FOR ERROR HANDLING
        case 'undefined':
            var err = new Error("Maybe the wrong page or ID??");
                err.status = 404;
            
            o = { url: "error" };
            
            next(err);
            break;
        case 'object':
            o = {
                url: "Students/" + action,
                p: {
                    title: "Details",
                    results: data,
                    studentId: id
                }
            };
            break;
    }
    return o;
}


// GETS DETAILS PAGE (views/Students/details.*ejs*) / [GETS ONE] STUDENTS FROM DATABASE / C- [R]etrieve -UD
router.get('/Details/:id', function(req,res, next){
    
    var query = "SELECT * FROM students, school WHERE students.ID = ?";
    
    db.prepare(query).get([req.params.id], function(err, row) {
        if(err){
            res.send(err); return;
        }
        
        // ADD ROUTE AS PARAMETER FOR DYNAMIC 
        var status = exists(row, "details", req.params.id, next);
        
        if(status.url === "error"){
            return;
        } else {
            res.render(status.url, status.p);
        }
        
    });
});


// GETS DETAILS IN EDIT MODE (views/Students/edit.*ejs*) / [GETS ONE] STUDENTS FROM DATABASE / C- [R]etrieve -UD
router.get('/Edit/:id', function(req, res, next){
    var query = "SELECT * FROM students WHERE ID = ?";
    
    db.prepare(query).get([req.params.id], function(err, row){
        
        var status = exists(row, "edit", req.params.id, next);
        
        if(status.url === "error"){
            return;
        } else {
            res.render(status.url, status.p);
        }

    });
});


// SENDS DATA FROM EDIT PAGE TO DATABASE / POST METHOD / SENDS SINGLE DETAILS / CR - [U]pdate -D
router.post('/Edit/:id', function(req,res){
    
    var query = "UPDATE students SET FirstName=?, LastName=?, ProfileImage=?, Hobby=?, Portfolio=?, SchoolID=? WHERE ID = ?";
    
    var p = db.prepare(query);
    
    p.run([req.body.FirstName, req.body.LastName, req.body.ProfileImage, req.body.Hobby, req.body.Portfolio, req.body.SchoolID, req.params.id], function(err, row){
        
        if(err){
            console.log(err); return;
        }
        
        res.redirect('/Details/' + req.params.id);
    });
    
});


// SENDS ID FROM EDIT PAGE TO DATABASE / POST METHOD / SENDS STUDENT ID / CRU - [D]elete
router.post('/Delete/:id', function(req,res){
    
    var query = "DELETE FROM students WHERE ID=?";
    
    var p = db.prepare(query);
    
    p.run([req.params.id], function(err, row){
        
        if(err){
            console.log(err); return;
        } 
        res.send({ status: 1 });
    });
    
});


module.exports = router;