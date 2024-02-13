import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

adminSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt)
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}

const Admin = mongoose.model('Admin',adminSchema);
export default Admin;