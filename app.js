const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

require('dotenv/config');

// Habilita CORS para todo el proyecto desde el inicio
app.use(cors());
app.options('*', cors());

// Middleware
// En lugar de bodyparser deprecated
app.use(express.json());

//Middleware para ver el log de los request
app.use(morgan('tiny'));

app.use(authJwt());
app.use(errorHandler);

//Routes
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');


const api = process.env.API_URL;


app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);


//Database
mongoose.connect(process.env.DB_Connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database connection is ready')
})
.catch((err) => {
    console.log(err);
})


//Server
app.listen(3000, () => {
    console.log(api);
    console.log('server is running');
})