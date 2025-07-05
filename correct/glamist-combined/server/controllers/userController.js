import usermodel from "../models/usermodel.js";

export const getUserData = async (req, res) => {
    try {
        const user = await usermodel.findById(req.userId);

        if(!user){
            return res.json({success: false, message: 'user not found'});
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                role: user.role,
                isAccVerify: user.isAccVerify
            }
        });
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {name, email} = req.body;

        // Check if email already exists for another user
        const existingUser = await usermodel.findOne({ email, _id: { $ne: req.userId } });
        if (existingUser) {
            return res.json({success: false, message: 'Email already in use'});
        }

        const user = await usermodel.findById(req.userId);
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        user.name = name;
        user.email = email;
        await user.save();

        return res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}