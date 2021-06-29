import axios from 'axios' // ye node modules se simport ho rhui hai
import Noty from 'noty'

export function placeOrder(formObject){
    axios.post('/orders',formObject).then((res)=>{
        new Noty({// for adding the  alerts. jo wha oahle flash kar rha tha
           type:"success",
           timeout: 1000,
           progressBar:false,
           theme: "metroui",
     
           text: res.data.message
         }).show();
         // and now we want it to rredirect to /cutomers/orders
         setTimeout(()=>{
         window.location.href = '/customers/orders'
         },1500)
     
        }).catch((err)=>{
           
           new Noty({// for adding the  alerts. jo wha oahle flash kar rha tha
              type:"error",
              timeout: 1000,
              progressBar:false,
              theme: "metroui",
        
              text: "Something went wrong!"
            }).show();
            console.log(err);
        })
}