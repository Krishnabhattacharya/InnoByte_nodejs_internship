import express from 'express';
import { loginController, registerController } from '../controllers/user.controller.js';

// Create a new instance of Express router
const userRoute = express.Router();

// Route for user registration
userRoute.post("/api/signup", registerController);

// Route for user login
userRoute.post("/api/login", loginController);

// Export the userRoute for use in other files
export default userRoute;
