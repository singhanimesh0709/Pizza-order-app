function authControllers(){
    return{
        
        login:(req,res)=>{
            res.render('auth/login');
        },
        
        register:(req,res)=>{
            res.render('auth/register');
        }

    }
}



module.exports = authControllers;