const moment = require("moment");
const Order = require("../../../models/order");




function orderControllers(){
    return{
        store:(req,res)=>{
          const {phone, address} = req.body;
          if(!phone || !address){
              req.flash('error',"All fields are required");
          }
          const order = new Order({
             customerId : req.user._id ,
             items: req.session.cart.items,
             phone: phone,
             address: address
          })
          order.save()
          .then((result)=>{
              Order.populate(result,{path: 'customerId'},(err,placedOrder)=>{
                req.flash('success','Order successfully placed');
                delete req.session.cart; // deleting items in cart coz order is placed. JS me kisi bhi object ki  property aise delete hoti hai.
               
               //emitting event
               const eventEmitter = req.app.get('eventEmitter');
               eventEmitter.emit('orderPlaced',placedOrder);
               return res.redirect('/customers/orders');    
              })
             
          
            }).catch((err)=>{
              req.flash('error','Something went wrong');
              console.log('error occured in here, order contollers')
              return res.redirect('/customers/orders');
          })
        },


        //controller for order list page 
        index:(req,res)=>{
            Order.find({customerId: req.user._id}, null,{sort:{'createdAt': -1}})
            .then((result)=>{
                res.header('Cache-Control', 'no-store');
            res.render('customers/orders',{orders: result, moment: moment}); // yaad rakhne ki baat ye hai kki result ek array pf all order from customer hai. so we can use .forEach in ejs.
            })
        },



        single: (req,res)=>{
            Order.findById(req.params.id).then((order)=>{
                if(req.user._id.toString() === order.customerId.toString()){
                    return res.render('customers/singleOrder',{order: order});
                }
                return res.redirect('/');
            })
        }
    }
}

module.exports = orderControllers;