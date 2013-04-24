var mongo = require('mongoskin')
var conn = mongo.db('mongodb://hollie:jersey@widmore.mongohq.com:10010/UniversityChat');

exports.index = function(req, res){
  res.render('index', { title: 'Express', username : "", message : "", user:req.session.user});
};



exports.receiveForm = function(req, res){
    
    conn.collection('users').findOne({Email:req.body.Email, Password:req.body.Password}, function(err,user) {
        if (err) throw err;
        if (user) {
            req.session.user = user;
            res.redirect('/chatRooms');
        } else {
            res.render('index',{title:'Home', username : req.body.Email, message: 'Invalid Login', user: req.session.user});
        }
    });
};