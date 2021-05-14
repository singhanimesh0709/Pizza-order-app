function cartControllers(){
    return{
        index:(req,res)=>{
            res.render('customers/cart');
        },

        update:(req,res)=>{
           // console.log(req);
           
        if(!req.session.cart){// checking if there is a cart key inn our session , if not we'lll ccretre one
           req.session.cart =  {
              items:{},
              totalQty: 0,
              totalPrice: 0

           }
        }
        let cart = req.session.cart; // ya toh ye empty wla hoga ya fir jo bhi sesson ke ndar hai o wla save ho jayega
        // so we need to check if this is empty or an already saved one. i.e item alredy exiast in caer tor not
        
        if(!cart.items[req.body._id]){ // ye scenario tab ka hai  jab pizza nhi hai in the cart
           cart.items[req.body._id]={ 
               item: req.body ,
                qty: 1   
            }// yha qty 1 isliye kiya, kyuki abhi hum  cart ke andar add  kar rhe hai aur kyuki pehli baar kar rhe haitoh qiantity honi chahiuye 1
          cart.totalQty= cart.totalQty + 1;
          cart.totalPrice= cart.totalPrice+ req.body.price;
        
        }else{// agar pizza a;ready cart ke andar hai tab ka scenario
             cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1; // already jitti quantity hai usse plus one
             cart.totalQty =  cart.totalQty + 1;
             cart.totalPrice = cart.totalPrice + req.body.price;
        }
         
        return res.json({totalQty: cart.totalQty});
        
       // console.log(req.body); so when we did this it showed undefined in console, coz by default express does not know how to recieve JSON, we need library for that.
         
            }
        }
    }




module.exports = cartControllers;


//prototype of how our cart is:-
 // let cart ={
            //     items:{
            //         pizza1Id: {items: pizzaObject, qty:0},
             //        pizza2Id: {items: pizzaObject, qty:0},
             //        pizza3Id: {items: pizzaObject, qty:0}.....
            //     },
            //     totalQty: 0,
            //     totalPrice:0
            //     }--  format in which we'll sace data 
             
           
           
            // items:{---- remember and notice that this alsoa an object.
                //         pizza1Id: {items: pizzaObject, qty:0},
                 //        pizza2Id: {items: pizzaObject, qty:0},
                 //        pizza3Id: {items: pizzaObject, qty:0}.....
                //     }
                

                //for(let pizza of Object.values(session.cart.items))
                //object.values(session.cart.items)---ye kya karega,
                // items object ke andar ke sirf values return karega
                //{items: pizzaObject, qty:0} -- joki ye hai, aur iski key thi pizz1Id
                // for(let pizza of ...) se kya hoga ab ye pizza var ek ek value ko milega aur hum 
                // iske dwara iterate karenge.

