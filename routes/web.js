const authControllers = require("../app/http/controllers/authControllers");
const cartControllers = require("../app/http/controllers/customers/cartControllers");
const orderControllers = require("../app/http/controllers/customers/orderControllers");
const homeControllers = require("../app/http/controllers/homeControllers");
const AdminOrderControllers = require("../app/http/controllers/admin/orderControllers");


//middlewares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");







function initRoutes(app){
  
    app.get('/', homeControllers().index);

    
    app.get('/login',guest,authControllers().login);
    app.post('/login',authControllers().postLogin);
    
    app.get('/register',guest,authControllers().register);
    app.post('/register',authControllers().postRegister);

    app.post('/logout',authControllers().logout);

    app.get('/cart',cartControllers().index);
    app.post('/update-cart',cartControllers().update);
    
    //customer routes
    app.post('/orders',auth,orderControllers().store);
    app.get('/customers/orders',auth,orderControllers().index);

    // admin routes
    app.get('/admin/orders',admin,AdminOrderControllers().index);
    
}


module.exports = initRoutes;