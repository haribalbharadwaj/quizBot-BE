const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    quizzesCreated: { 
        type: Number,
         default: 0 
        },
    totalQuestions: { 
        type: Number,
         default: 0
         },
    totalImpressions: {
         type: Number,
          default: 0 
        }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;