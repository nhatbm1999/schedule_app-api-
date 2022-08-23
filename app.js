const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user_routes');
const productRoutes = require('./api/routes/product_routes');
const eventRoutes = require('./api/routes/event_routes');

mongoose.connect(
    ('mongodb+srv://nhatbm:Minhnhat99@cluster0.jvnum.mongodb.net/ctxh_database?retryWrites=true&w=majority'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

// app.use('/api/member',memberRoutes,);
// app.use('/api/user', userRoutes);
// app.use('/api/event', eventRoutes);

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', eventRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;