const moment = require("moment");
const Order = require("../../../models/order");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)




function orderControllers(){
    return{
        store:(req,res)=>{
          const {phone, address,stripeToken,paymentType} = req.body;
          if(!phone || !address){
              //req.flash('error',"All fields are required"); --> not required now as we are usimg the axios, ka noty
             return res.status(422).json({message:"All fields are required"}); 
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
                //req.flash('success','Order successfully placed'); ---> this we'lll d o now by NOTY
               
                if(paymentType === 'card'){
                //stripe logic
                stripe.charges.create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: 'inr',
                  description: `Pizza order: ${placedOrder._id}`  
                }).then(()=>{
                    placedOrder.paymentStatus = true;
                    placedOrder.paymentType = paymentType;

                    placedOrder.save().then((updOrd)=>{
                      //emitting event
                          const eventEmitter = req.app.get('eventEmitter');
                          eventEmitter.emit('orderPlaced',updOrd);
                           delete req.session.cart; // deleting items in cart coz order is placed. JS me kisi bhi object ki  property aise delete hoti hai.  
                           return res.json({message:"Payment successful, and order placed."})   
                    }).catch((err)=>{
                       console.log('error in updating updOrd');
                    })

                }).catch((err)=>{
                    delete req.session.cart;
                    return res.json({message:"Payment failed, but order is placed , you can pay at the time of delivery."})  
                })
               }else{
                    //emitting event
               const eventEmitter = req.app.get('eventEmitter');
               eventEmitter.emit('orderPlaced',placedOrder);
                delete req.session.cart; // deleting items in cart coz order is placed. JS me kisi bhi object ki  property aise delete hoti hai.  
                return res.json({message:"Order successfully placed."}) 
               //return res.redirect('/customers/orders');  -- now we don't reditrect, we send JSON  and we'll reidrect there in fronend js , by window.location.hreef
               }
               
              
                
            })
             
          
            }).catch((err)=>{
                return res.status(500).json({message:"Something went wrong 😕"})
                //   req.flash('error','Something went wrong');
              console.log('error occured in here, order contollers')
            //   return res.redirect('/customers/orders');
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