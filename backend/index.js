import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import expenseRoute from './routes/expenses.js'
import authRoute from './routes/auth.js'


dotenv.config();

const app= express();
const port = 8000;

const corsOptions={
    origin: true,
    methods: ["POST", "GET" ,"PUT", "DELETE"],
    credentials: true
}

const connect = async()=>{
    try{
        await mongoose.connect("mongodb+srv://riyazmittu:ceAli8riORdTtkt4@cluster0.ivgarot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('connected to Mongodb');


    }catch(err){
        console.log('Mongodb connection failed',err.message);
    }
}

//Middleware
app.use(express.json());
app.use(cors(corsOptions));

//any request to /user
app.use('/user', userRoute);

//any req to /expense 
app.use("/expense",expenseRoute);

//login and register
app.use('/auth',authRoute);

app.listen(port,()=>{
    connect();  
    console.log('server listening on port',port);
})