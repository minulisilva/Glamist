import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required: true, unique: true},
    password: {type: String,required: true},
    role: {type: String, enum: ['admin', 'customer'], default: 'customer'},
    verifyOtp: {type: String,default: ''},
    verifyOtpExpat: {type: Number,default: 0},
    isAccVerify: {type: Boolean,default: false},
    resetOtp: {type: String,default: ''},
    resetOtpExpat: {type: Number,default: 0},

})

const usermodel = mongoose.models.user || mongoose.model('user',userSchema);

export default usermodel;