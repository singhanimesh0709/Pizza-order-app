const Order = require("../../../models/order");

function AdminOrderControllers(){
    return{
        index:(req,res)=>{
            Order.find({status:{$ne: 'Completed'}},null,{sort:{'createdAt': -1}})
            .populate('customerId','-password').exec((err,orders)=>{
                // by passing in status = $ne : completed, we're telling that send us oreders only which are not completed.
                // .populate is used  bcoz when we ccalled oreders from database we just dont want the cudtomer id, we want the dfull data of the customer, and that iss done by populate 
                // and as we had already connected user data to order model, we can do this .but doing so willl give us the password also, which we dont want , so pass in secomd parameter, and -password, meanig we dont want that.
                // in .exec, we get err and second parameter as the result we obtain from populate method.
                
                if(req.xhr){ // checking if its an ajax call
                    return res.json(orders);
                }else {
                    return res.render('admin/orders');
                }
                
                
                
                
            })
        }
    }
}


module.exports = AdminOrderControllers;
