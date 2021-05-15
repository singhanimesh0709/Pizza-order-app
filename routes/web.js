const authControllers = require("../app/http/controllers/authControllers");
const cartControllers = require("../app/http/controllers/customers/cartControllers");
const homeControllers = require("../app/http/controllers/homeControllers");


//middlewares
const guest = require("../app/http/middlewares/guest");




function initRoutes(app){
  
    app.get('/', homeControllers().index);

    
    app.get('/login',guest,authControllers().login);
    app.post('/login',authControllers().postLogin);
    
    app.get('/register',guest,authControllers().register);
    app.post('/register',authControllers().postRegister);

    app.post('/logout',authControllers().logout);

    app.get('/cart',cartControllers().index);
    app.post('/update-cart',cartControllers().update);
    
}


module.exports = initRoutes;