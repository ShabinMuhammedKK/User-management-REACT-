import asyncHandler from 'express-async-handler';
import Admin from  '../models/adminModel';
import generateToken from '../utils/generateToken.js';

const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id);
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        generateToken(res, admin._id);
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});


const adminLogout = asyncHandler(async (req, res) => {
    
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Admin logged out successfully' });
});
// Add other admin controller functions as needed

export { authAdmin, registerAdmin,adminLogout };
