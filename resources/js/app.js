// yha pe hum clienr side javascript likhenge, aur yha pe jo hum likhnge wo baadme humare tool ke madad se 
// jake public ke app.js me save hoga , aur usko hum include karenge in our real proj code/routes

import axios from 'axios' // ye node modules se simport ho rhui hai
import Noty from 'noty' 
import {initAdmin} from './admin' // intAdmin ko import aise hi karenge, but whas se export ka tareeka bada gya hai
import moment from 'moment'
// getting all buttons to add event listener
let addToCart = document.querySelectorAll('.add-to-cart');
let cartnum = document.querySelector(".cartnum");

function updateCart(pizza){
   axios.post('/update-cart',pizza)
   .then(res=>{
     
      cartnum.innerText = res.data.totalQty;
      
      new Noty({// for adding the  alerts. iske baad css bhi set karna hoga
         type:"warning",
         timeout: 1000,
         progressBar:false,
         theme: "metroui",

         text: `${pizza.name} added to cart`
       }).show();

   })
   .catch(err=>{
      new Noty({// for adding the  alerts. iske baad css bhi set karna hoga
         type:"error",
         timeout: 1000,
         progressBar:false,
         theme: "metroui",

         text: "Something went wrong!"
       }).show();
 
   })
    
}




addToCart.forEach((btn)=>{
   btn.addEventListener('click',(e)=>{
    
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
               
    
   }) 
    
    
    

})

// removing alert msg after x seconds
const alertMsg = document.querySelector('#success-alert');
if(alertMsg){
  
   setTimeout(()=>alertMsg.remove(),2000);
   
}




//===========to updaet stustus on our ordeer page================== 
let statuses = document.querySelectorAll('.status-line');
let hiddenItem = document.getElementById("hiddenItem");
let order = hiddenItem ? hiddenItem.value : null
order = JSON.parse(order);
let time = document.createElement('small'); // ye aese elemnt isliye create kar rhe bcoz, we need to change position of this time also with changing status, and even its position.

function updateStatus(order){

statuses.forEach(status=>{// ---> ye karna zaroori hai warna, updatedOrder ke liye 2-2 orange ho rhe the, poorani class ko rmove kiiiya.
   status.classList.remove('step-completed');
   status.classList.remove('current');
})//---> toh pahle ye saare classes clear kardega,  aur fir naye se nya logic chalayega humara jo neeche code me hai.

let stepCompleted = true;
statuses.forEach((status)=>{
   let dataStatus = status.dataset.status;
   if(stepCompleted){
     status.classList.add('step-completed');
     // ye iska matlab ab uss li ke class me step-ccompleted add hoga matlab wo grey ho jayega. 
     // aur kyukihumne pahle se hi stepCompleted = true kiya hai  iskam matlab first wla humesha grey rahega.
}
if(dataStatus === order.status){
stepCompleted = false;  // we do this bcoz, all the next elements should be black in colour only, if not did alll will become grey,as we have set statusCompleted = true be default.
time.innerText = moment(order.updatedAt).format('hh:mm A');
status.appendChild(time); // appendchild matlab, li ke andar span ke baad time yaani small tag aa jayega.

if(status.nextElementSibling){ //--> last wale pe rokne ke liye check kiya.
   status.nextElementSibling.classList.add('current')
   // here we check if status in that li element is same as order.status in the DB , then we add current class to the next li element .
   // and thus that will become orange. coz if dataStatus == order.status , means that this step is complete and current step is next one.
}
   
}
})

}

updateStatus(order);


//socket------------------
let socket = io('http://localhost:3000');
initAdmin(socket);
// just called it, all that code fromadmin.js file will be compiled here niw.

//join
if(order){
   socket.emit('join',`order_${order._id}`)
}
 // we have this order coz we fetched it from thr hiddenItem  input tag above.
// this sends a messaag eto the server , joi n karke emit karega aur bolega ceate a rooom of name which was passed as second parameter.

let adminArea = window.location.pathname;
if(adminArea.includes('admin')){
   socket.emit('join', 'adminRoom'); //--> we use same 'join' message coz we already have finctionality for that in our server .js. and this time we make only one room
}


socket.on('orderUpdated',(data)=>{
  const updatedOrder = {...order};// this how we copy an object in node.
   updatedOrder.updatedAt = moment().format(); // storing current time in the the updatedAt field .
   updatedOrder.status = data.status;
   updateStatus(updatedOrder);// ---> as this is the function that changes colours in our that status page, and everything on client side, so we pass on this updatedOrder to it.

   new Noty({// for adding the  alerts.
      type:"warning",
      timeout: 1000,
      progressBar:false,
      theme: "metroui",

      text: 'Order Updated'
    }).show();

}) 



