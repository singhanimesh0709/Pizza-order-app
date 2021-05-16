// yha pe hum clienr side javascript likhenge, aur yha pe jo hum likhnge wo baadme humare tool ke madad se 
// jake public ke app.js me save hoga , aur usko hum include karenge in our real proj code/routes

import axios from 'axios' // ye node modules se simport ho rhui hai
import Noty from 'noty' 
import {initAdmin} from './admin' // intAdmin ko import aise hi karenge, but whas se export ka tareeka bada gya hai

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

initAdmin();
// just called it, all that code fromadmin.js file will be compiled here niw.