const express= require('express');
const cors= require('cors');


const app= express();


app.set('trust proxy', 1);


app.use(cors());
app.use(express.json());

const rateLimit= require('express-rate-limit');
const limiter= rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);




const authRoutes= require('./routes/authRoutes');
const userRoutes= require('./routes/userRoutes');
const recordRoutes= require('./routes/recordRoutes');
const dashboardRoutes= require('./routes/dashboardRoutes');
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/records',recordRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.get('/',(req,res)=>{
    res.send("Welcome to Finance Backend");
})

app.use((err,req,res,next)=>{
    res.status(500).json({message: err.message || "Internal Server Error"});

    });

module.exports=app;

