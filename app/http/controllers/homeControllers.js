const Menu = require('../../models/menu');

function homeControllers(){
    return{
        index:(req,res)=>{

            //yha database query krenge, aur fetch karenge
            Menu.find().then((pizzas)=>{// .find() se sara data milta hai in db, aur jab wo recieve hota hai toh wo humme usse then() me acces ho jata hai,
                
                 // console.log(pizzas); ----- remember pizzas is an array of objectts 
                res.render('home',{pizzas:pizzas}); // so we pass it to the template file. and thus we'll acess in front end.
            }) 

           
        }
    }
}



module.exports = homeControllers;




/*

Menu.find().then((pizzas)=>{
                
    console.log(pizzas);  
    res.render('home',{pizzas:pizzas}); 
}) 

const pizzas = await Menu.find()
 console.log(pizzas);
return  res.render('home',{pizzas:pizzas})


both works in same way, same result.

*/