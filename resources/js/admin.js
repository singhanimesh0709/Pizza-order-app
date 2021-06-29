import axios from 'axios';
import moment from 'moment';
import Noty from 'noty'



export function initAdmin(socket){
const orderTableBody = document.querySelector('#orderTableBody');
let orders = [];// thing to remember, orders is an array.
let markup;

axios.get('/admin/orders',{headers:{"X-Requested-With":"XMLHttpRequest"}})
.then((res)=>{
orders = res.data;
markup = generateMarkup(orders);
orderTableBody.innerHTML = markup;

}).catch(err=>{console.log(err)});
 


function renderItems(items){
    let menuItems = Object.values(items) // Object.values returns the values of that object, in pou case it'll be item object and qty
    return menuItems.map((menuItem)=>{// menuItems is this ==> {"item":{"_id":"5eee66cfa27a66807cf2bea7","name":"Paneer pizza","image":"pizza.png","price":200,"size":"small"},"qty":1}, an array of these objects...
        
        return ` <p>${menuItem.item.name} - ${menuItem.qty}pcs </p>`
   
    }).join('')
}

/*remember we populated full userr data also with the help of customerId. so thats why we have access to order.customerId.name */

function generateMarkup(orders){
    return orders.map((order)=>{
        
        return `
        <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p> 
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td> 
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/orders/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="Order Placed"
                                    ${ order.status === 'Order Placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="Confirmed" ${ order.status === 'Confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="Prepared" ${ order.status === 'Prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="Delivered" ${ order.status === 'Delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="Completed" ${ order.status === 'Completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-2 py-2">
                    ${ order.paymentStatus ? 'Paid' : 'Not paid' }
                </td>
            </tr>
        `
    }).join('')
}

socket.on('orderPlaced',(placedOrder)=>{
    new Noty({// for adding the  alerts.
        type:"success",
        timeout: 1000,
        progressBar:false,
        theme: "metroui",
    
        text: 'New Order!'
      }).show();

    //orders.push('placedOrder'); -----> issse kya hoga ki wo order array ke end me chala jayega, aur fi wo humme last me dikhrga
orders.unshift(placedOrder);// so here we add the new order at first place in array
orderTableBody.innerHTML = ''; // we cleare the  innerHtML so that we can run generate markup gain
orderTableBody.innerHTML = generateMarkup(orders); // and now we run generate markup for updated array orders

})
}

// module.export = initAdmin ---> this wont work as  now we're in frontend js, 
// so according to ES6 just add 'export' keyword before the function  you want to export and then just import like using import keword.

