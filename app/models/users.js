const mongoose  = require("mongoose");

const Schema = mongoose.Schema;

//very imp*** = JS me ek convention hai ki, agar kisi method ka naam uppercase letter se shuru ho rha hai toh iska matlab 
//ki usme jo save hogi wo class ya toh  constructor function jaise ki Schema. toh jo class ya constructor function usse thoda
// alag tareeke se call kiya jata hai, issilyre hum  baar baar "new" ka use karte hai

const userSchema = new Schema({
   name:{ type: String, required: true},
   email:{ type: String, required: true},
   password:{ type: String, required: true},
   role:{ type: String, default:'Customer'}
},{timestamps: true});

const User = mongoose.model('User',userSchema);

module.exports = User;
// export kar rhe taaki apne controller se queery run kare in that file itself.
