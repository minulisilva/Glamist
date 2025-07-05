import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usermodel from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req,res)=>{
    const {name, email, password, adminCode} = req.body;

    if(!name || !email || !password ){
        return res.json({success: false, message:'missing details'})
    }

    try {
        const existingUser = await usermodel.findOne({email})

        if(existingUser){
            return res.json({ success: false, message: "user already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for admin registration
        const isAdmin = adminCode === process.env.ADMIN_SECRET_CODE;
        
        const user = new usermodel({
            name,
            email, 
            password: hashedPassword,
            role: isAdmin ? 'admin' : 'customer'
        });
        
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60* 60*1000
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject:'welcome to glamist beauty',
            text: `welcome to glamist salon website. your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);
        return res.json({success: true, isAdmin});
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req,res)=> {
    const {name,email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'email and password are required'})
    }

    try {
        const user = await usermodel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'invalid password'})
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60* 60*1000
        });

        return res.json({
            success: true,
            isAdmin: user.role === 'admin'
        });
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: "logged out"})
        
    } catch (error) {
        return res.json({success: false, message: error.message});

    }

}

export const sendVerifyOtp = async (req,res)=>{
    try {
        const userId = req.userId;

        const user = await usermodel.findById(userId);

        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

        if(user.isAccVerify){
            return res.json({success: false, message: "Account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000) );

        user.verifyOtp = otp;
        user.verifyOtpExpat = Date.now() + 24 * 60 * 60 * 1000

        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject:'Account verification otp',
            text: `your otp is ${otp}. verify your account using this otp.`
        }

        await transporter.sendMail(mailOption);
        return res.json({success: true, message: 'verification otp sent on email'});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async (req,res) =>{
    const {otp} = req.body;
    const userId = req.userId;

    if(!otp){
        return res.json({success: false, message: 'OTP is required'});
    }

    try {
        const user = await usermodel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpat < Date.now()){
            return res.json({success: false, message: 'OTP expired'});
        }

        user.isAccVerify = true;
        user.verifyOtp = '';
        user.verifyOtpExpat = 0;

        await user.save();
        return res.json({success: true, message: 'Email verified successfully'});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req,res) =>{

    try {
        return res.json({success: true});

        
    } catch (error) {
        return res.json({success: false, message: error.message});

        
    }
}

//send pwd reset otp
export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: 'email is required'})
    }

    try {

        const user = await usermodel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'user not found'});

        }
        const otp = String(Math.floor(100000 + Math.random() * 900000) );

      user.resetOtp = otp;
      user.resetOtpExpat = Date.now() + 15 * 60 * 1000

      await user.save();
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject:'pwd reset otp',
        text: `your otp is for resetting is ${otp}.use this to  resetting password.`
      }

      await transporter.sendMail(mailOption);
      return res.json({success: true, message: 'otp is sent to your mail'});



        
    } catch (error) {
        return res.json({success: false, message: error.message});

        
    }

}

//reset pwd

export const resetpassword = async (req,res)=>{
    const {email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'email,otp,newpwd are required.'});

    }

    try {

        const user = await usermodel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'user not found'});

        }
        if(user.resetOtp === ""|| user.resetOtp !== otp){
            return res.json({success: false, message: 'invalid otp'});

        }

        if(user.resetOtpExpat < Date.now()){
            return res.json({success: false, message: 'expired otp'});

        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpat = 0;

        await user.save();

        return res.json({success: true, message: 'password reset sucessfully'});

        
    } catch (error) {
        return res.json({success: false, message: error.message});

        
    }
}