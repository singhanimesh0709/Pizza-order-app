const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
customerId:{ 
    type:mongoose.Schema.Types.ObjectId, // ***order collection ka link to user collection, bcoz we dont want to save it as a string.
    ref: 'User', // refference of the model
    required: true
},
items:{type: Object, required:true},// remember in cart we had an items object
phone:{type:String, required: true},
address:{type:String, required: true},
paymentType:{type:String, default: 'COD'},
status:{type:String, default: 'Order Placed'}

},{timestamps:true})

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;