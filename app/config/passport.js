const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/users');

function init(passport){
passport.use( new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
        //matching user
        User.findOne({email: email})
        .then((user)=>{
            if(!user){
                return done(null,false,{message:"This email isn't registered"});
            }

            //matching password
            bcrypt.compare(password, user.password,(err,isMatch)=>{
                 if(err) throw err;   
                if(isMatch){
                    return done(null,user,{message:"Logged in successfully!"});
                }else{
                    return done(null,false,{message:"Wrong username or password !"});
                }

            })
        })
       .catch(err => console.log(err)); 

    })
)


passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    })
});
}

module.exports= init;