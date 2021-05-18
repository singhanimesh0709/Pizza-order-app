require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const { Socket } = require('dgram');
const Emitter = require('events');

  
 


const app = express();

const PORT = process.env.PORT || 3000;

//Database connection
const db = 'mongodb+srv://animesh:4405tiger@nodeproj1.fvwrz.mongodb.net/pizza?retryWrites=true&w=majority';
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('MongoDB Connected');})
.catch(err=> console.log(err));

const connection = mongoose.connection;// baad me use hoga uske liye kar rhe save isse


//session store and ---
//session config-- express-session ek middleware ki tarah  kaam kaerti hai, so we use app .use
app.use(session({
    secret: process.env.COOKIE_SECRET ,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL  // ab ye by default sessions naam ke collection me sessions store karega.
        //client: connection.getClient()-- to use existing connection
    }),
    saveUninitialized: false ,
    cookie:{maxAge: 1000 * 60 * 60 * 24} // 24 hrs validity of cookie
}))

app.use(flash());


//passport config---> important to put it after session config, coz it uses session.
require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());// as passport usses sessionn som we initialized that.
// we can even create local strategy here, but that code is a bit big, do we do that in a sepaarate file.


//assets
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//globall middlewares 
app.use((req,res,next)=>{
res.locals.session = req.session;
res.locals.user = req.user;// jobhi logged in user hai wo set hojayega ispe.
next();
});


//set template engine
app.use(expressLayouts);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine','ejs'); 

//rioutes
require('./routes/web')(app);



const server = app.listen(PORT,()=>{
console.log(`listening on port  ${PORT}`);
});

//event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter',eventEmitter); //---> binding it to app, so that we can use it anywhere in application

// socket 
const io = require('socket.io')(server);

io.on('connection',(socket)=>{
    
    socket.on('join',(roomName)=>{ 
       
        socket.join(roomName);
    })
})

 eventEmitter.on('orderUpdated',(data)=>{

     io.to(`order_${data.id}`).emit('orderUpdated',data);
 })

 eventEmitter.on('orderPlaced',(placedOrder)=>{//placedOrder is the data we recieved.
  io.to('adminRoom').emit('orderPlaced',placedOrder);
 })