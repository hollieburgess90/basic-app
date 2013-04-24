var mongo = require('mongoskin');

var conn = mongo.db('mongodb://hollie:jersey@widmore.mongohq.com:10010/UniversityChat');


/*
 * GET users listing.
 */

exports.list = function(req, res){
    if (req.session.user) {
        res.send("respond with a resource");
    } else {
        res.redirect("/");
    }
};

exports.home = function(req, res){
    if (req.session.user) {
         res.render('homepage', { title: 'Express', user: req.session.user });
    } else {    
        res.redirect("/");
    }
};

exports.logout = function(req, res){
    req.session.user = null;
    res.redirect("/");
};


exports.signup = function(req, res){
    res.render('signup', { title: 'Express', user: req.session.user });
};

exports.signuppost = function(req, res){
    res.redirect('/');
    console.log(req.body.Email);
    conn.collection('users').insert({Email: req.body.Email, Password: req.body.Password});
  
    res.redirect('/');
};




exports.list = function(req, res){
    if (req.session.user){
        conn.collection("users").find({}).toArray(function(err,result) {
            res.render("usersList",{title:"Users",users: result, user : req.session.user}); 
         });
    } else {
        res.redirect("/");
    }
};

exports.create = function(req, res){
    if (req.session.user){
         var newUsers = { name: req.body.name }; 
            conn.collection("users").insert(newUsers,function(err,result) {
            res.redirect("/users");
         });
    } else {
        res.redirect("/");
    }
};


exports.edit = function(req, res){
    conn.collection("users").findOne({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
       res.render("usersEdit",{title:"Friends",user: req.session.user}); 
    });
};


exports.update = function(req, res){
    if (req.session.user){
        conn.collection("users").findOne({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
            
            res.Email = req.body.email});
            res.description = req.body.description;
            
         conn.collection("users").save(res,function(err) {
            res.redirect("/users");  
        });
    } else { 
       res.redirect("/");
    }
};


exports.del = function(req, res){
    if (req.session.user){
         conn.collection("users").remove({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
            res.redirect("/users");               
        });
    } else {
        res.redirect("/");
    }    
};

