import express from 'express';
import dotenv from 'dotenv';
import userRoute from './src/routes/user.route.js'
import Database from './src/db/mongoose.js'
const app = express();
app.use(express.json());






dotenv.config();
Database();
app.use(userRoute);





const PORT = process.env.PORT || 3030;
app.listen((PORT), () => {
    console.log(`SERVER IS RUNNING ON ${PORT}`);
})