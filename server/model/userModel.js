import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    }
})


userSchema.statics.register = async function(email, password) {

    //validation
    if (!email || !password){
        throw Error('All fields must be filled');
    }

    if (!validator.isEmail(email)){
        throw Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)){
        throw Error('Password not strong enough');
    }

    //finding email and hashing password
    const exists = await this.findOne({email});
    if (exists){
        throw Error('email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email, password : hash});
    return user;

}

//static login method
userSchema.statics.login = async function(email,password){
    //validation
    if (!email || !password){
        throw Error('All fields must be filled');
    }

     //finding email and comparing passwords
    const user = await this.findOne({email});
    if (!user){
        throw Error('No user with this email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match){
        throw Error('Incorrect Password');
    }

    return user;
}

const user = mongoose.model('User', userSchema);

export default user;