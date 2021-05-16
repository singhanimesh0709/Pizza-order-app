const User = require("../../models/users");
const bcrypt = require('bcrypt');
const passport = require("passport");





function authControllers(){
     const _getRedirectUrl = (req)=>{
         return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders'
     }
    
    
    
    return{
        
        login:(req,res)=>{
            res.render('auth/login');
        },
        postLogin:(req,res,next)=>{

         passport.authenticate('local',(err,user,info)=>{
             if(err){
                 req.flash('error',info.message)
                 return next(err)
             }
             if(!user){
                req.flash('error',info.message)
                console.log('pw wrong');
                return res.redirect('/login');//bcoz agar user nhi hai iska matlab ya toh password galat hai ya fir user nhi hai toh bola wapis login pe jaao.
            }
            //agar code yha aya toh iska matlab user hai
            req.logIn(user,(err)=>{
              if(err){
                req.flash('error',info.message)
                 return next(err)  
              } 
              console.log('logged in');

            
              return res.redirect(_getRedirectUrl(req));
              // isme req hum isliye paas kar rhe taaki pta kar sake what's is req.user.role. admin ko admin/orders pe and customer ko customer/orders pe redirect karenge

            })
         })(req, res, next);
        },
        
        register:(req,res)=>{
            res.render('auth/register');
        },
        postRegister:(req,res)=>{

            const{ name, email, password }= req.body;   // destructuring ES6
         //validate request
         if(!name || !email || !password){
            req.flash('error','All fields required'); 
            req.flash('name',name);// name key ke andar name save kar diya . similarly email bhi 
            req.flash('email',email);// and as we already know that flash can be accessed from the front end .
           
            return res.redirect('/register');// so we can access flash from front end by just using the messages.keyname  method. see for yourself in register.ejs. exmaple: messages.error, messages.name..
            // agar hum response return nhi karte hai toh wo page bass buffer karte rehta hai. isiliye we always need to send a response.
         }// so if all fields area filled, we'll  check further
         //checking if emails already exists
         User.findOne({email:email})
             .then((user)=>{
                 if(user){ 
                    req.flash('error','Email already exists');
                    req.flash('name',name);                 
                    req.flash('email',email); 
                    return res.redirect('/register');  
                  }
                //hashing paassword
          bcrypt.hash(password,10).then(result=>{
            const hashedPassword = result;

            //creating a user---> ye pooora maine yha cut paste kiya taaki hashed password use kar paau.
       const user = new User({
          name: name,
          email: email,
          password: hashedPassword
      })
      //saving user
      user.save()
      .then((user)=>{
          // iss then ke andar humme mil jata hai jo bhi humara data hai, jo user abhi save hua hai.
          // also login karwa denge
       return res.redirect('/'); // fillhall redirecting to home page, later will take them to orders page
      }).catch(err=>{
         req.flash('error','Something went wrong!');
        return  res.redirect('/register');
      });
        })
    });
        
       },
        logout:(req,res)=>{
            req.logout();
            return res.redirect('/login');
        }

    }
}



module.exports = authControllers;