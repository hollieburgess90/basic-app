var mongo = require('mongoskin');

var conn = mongo.db('mongodb://hollie:jersey@widmore.mongohq.com:10010/UniversityChat');

exports.list = function(req, res){
    if (req.session.user) {
        conn.collection("chatRooms").find({"members":req.session.user._id}).toArray(function(err,result) {
           res.render("chatRoomsList",{title:"Chatrooms",chatRooms: result,user : req.session.user}); 
        });
    } else {
        res.redirect("/");
    }
};

exports.create = function(req, res){
    if (req.session.user){
        var newChatroom = { name: req.body.name, members : [req.session.user._id] } 
        conn.collection("chatRooms").insert(newChatroom,function(err,result) {
            res.redirect("/chatRooms");
         });
    } else {
        res.redirect("/");
    }
};


exports.edit = function(req, res){
    if (req.session.user) {
        conn.collection("chatRooms").findOne({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
            conn.collection("users").find({}).toArray(function(err,users) {
                res.render("chatRoomsEdit",{title:"Chatrooms",chatRoom: result, user : req.session.user, users: users}); 
            });
        });
    } else {
      res.redirect("/");
    } 
};


exports.update = function(req, res){
    if (req.session.user) {
        conn.collection("chatRooms").findOne({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
      
            result.name = req.body.name;
            result.description = req.body.description;
            
            var members = [];
            
            for(var incomingField in req.body)
            {
                if(req.body.hasOwnProperty(incomingField))
                {
                    if (incomingField.substring(0,5) == "user-") 
                    {
                        members.push(incomingField.substring(5,incomingField.length));
                    }
                }
            }
      
            result.members = members;
      
            conn.collection("chatRooms").save(result,function(err){
                res.redirect("/chatRooms");  
            });
        });
    } else {
         res.redirect("/");
    }
};


exports.del = function(req, res){
    if (req.session.user){
        conn.collection("chatRooms").remove({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
            res.redirect("/chatRooms");       
        });
    } else {
        res.redirect("/");
    }
};

exports.chat = function(req, res){
    if (req.session.user){
        conn.collection("chatRooms").findOne({_id : conn.ObjectID.createFromHexString(req.params.id) },function(err,result) {
            res.render("chatRoomsChat",{title:"Chatrooms",chatRoom: result, user : req.session.user}); 
        });
    } else {
        res.redirect("/");
    }
};