const mongoose  = require("mongoose");

const Schema = mongoose.Schema;

//very imp*** = JS me ek convention hai ki, agar kisi method ka naam uppercase letter se shuru ho rha hai toh iska matlab 
//ki usme jo save hogi wo class ya toh  constructor function jaise ki Schema. toh jo class ya constructor function usse thoda
// alag tareeke se call kiya jata hai, issilyre hum  baar baar "new" ka use karte hai

const menuSchema = new Schema({
   name:{ type: String, required: true},
   image:{ type: String, required: true},
   price:{ type: Number, required: true},
   size:{ type: String, required: true}
});

const Menu = mongoose.model('Menu',menuSchema);

module.exports = Menu;
// export kar rhe taaki apne controller se queery run kare in that file itself.
