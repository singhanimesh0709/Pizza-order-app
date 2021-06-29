import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js';
import Noty from 'noty'
import {placeOrder} from './apiService'


export  async function initStripe(){
    
    // for stripe logic
    const stripe = await loadStripe('pk_test_51IpBaaSFpFUn1YzlQFQTEqm9lRBam7BVGwsybb00GnvNSqJv6FBYld9XnGubsfS6jZUiPTKysqCGgk1eBM5GIVpx00ovGVsWD0');
    let card = null; // we declared it outside now so that we can acces it when we destroy it, warna wo function e tha toh access nhi milta.

    function mountWidget(){
    const elements =  stripe.elements();
    let style = { // uss card element ki styling.
       base: {
         iconColor: '#32325d',
         color: '#32325d',
         fontWeight: '500',
         fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
         fontSize: '15px',
         fontSmoothing: 'antialiased',
         
         '::placeholder': {
           color: '#aab7c4',
         },
       },
       invalid: {
         iconColor: '#fa755a',
         color: '#fa755a',
       },
     }
    card = elements.create('card',{style: style , hidePostalCode: true})// first param i the widget we want to use, and second param is the styling object. aur ye bhi ek instance return karta hai toh usse variable me sstore kiya.
   card.mount('#cardPay');
  }  

  const paymentType = document.querySelector('#paymentType');
if(!paymentType){
    return;
}
 paymentType.addEventListener('change',(event)=>{
    
    if(event.target.value === 'card'){
        //display widget of card num
        mountWidget();
    }else{
        //destroy the widget
        card.destroy();
    }
    })


//Ajax call for order now form(stripe)
const paymentForm = document.querySelector('#payment-form');
let formObject = {}
if(paymentForm){
   paymentForm.addEventListener('submit',(event)=>{
      event.preventDefault();
      let formData = new FormData(paymentForm); // coz paymentaform ia our form , now remember we got it bu query
      
      for(let [key,value] of formData.entries()){
         formObject[key] = value; // so after all iterations formObject has three things --> phone, address, paymentType
      }

      if(!card){// matlab COD select kiya hai
        //AJAX call
        placeOrder(formObject);// calling that ajax request function
        return; // so that script aage neeche createToken pe naa jaye.
    }  //---> agar isme nhi ghusa toh iska matlab hai ki, pay with card select kiya hi, then we need to verify.
        
        
        
        
        //verifying ---> lekin ye tabhi karna hia jab, pay with card select hua ho.
        stripe.createToken(card).then((result)=>{
            
          formObject.stripeToken = result.token.id;// updating the formObject
          placeOrder(formObject); // ab updated formobject jayega on server, with stripeToken.
        }).catch((err)=>{
            console.log(err);
        })
      
      
      });
}

}