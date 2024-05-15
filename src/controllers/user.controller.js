import User from "../model/user.model.js"; // Importing the User model
import { sendMail } from '../utils/sendmail.js'; // Importing the sendMail function

// Controller function to handle user registration
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructuring name, email, and password from request body

        // Checking if name, email, or password is missing
        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide name, email, and password"
            });
        }

        // Checking if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already exists",
            });
        }

        // Creating a new user with the provided name, email, and password
        const user = await User.create({ name, email, password });

        // Generating a token for the user
        const token = await user.generateToken();

        // Saving the user to the database
        await user.save();

        // Composing the email message for registration confirmation
        const msg = `
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>We are thrilled to have you with us. Your registration has been successfully completed.</p>
            <p>As a member of our community, you now have access to exclusive content, updates, and more. We are committed to providing you with the best experience possible.</p>
            <p>If you have any questions or need assistance, our support team is here for you.</p>
            <p>Warm regards,</p>
            <p>The InnoByte Team</p>
        `;

        // Sending registration confirmation email
        sendMail(email, msg, "Registration Successful");

        // Sending a success response with the newly registered user and token
        res.status(201).send({
            success: true,
            user: user,
            token
        });
    } catch (error) {
        // Handling any errors that occur during registration
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// Controller function to handle user login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body; // Destructuring email and password from request body

        // Finding the user by email
        const user = await User.findOne({ email });

        // If user not found, send 401 Unauthorized response
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }

        // Comparing provided password with stored password hash
        const isMatch = user.comparePassword(password);

        // If passwords don't match, send 404 Not Found response
        if (!isMatch) {
            return res.status(404).send({
                success: false,
                message: "Invalid password"
            });
        }

        // Generating token for the user
        const token = await user.generateToken();

        // Sending a success response with the authenticated user and token
        res.status(200).send({
            success: true,
            user: user,
            token
        });
    } catch (error) {
        // Handling any errors that occur during login
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}
