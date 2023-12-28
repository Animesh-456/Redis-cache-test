import mongoose from 'mongoose';
//import autoIncrement from 'mongoose-auto-increment';

// how our document look like
const employeeSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: {
        unique: true,
        type: String,
        default: null
    },
});


// autoIncrement.initialize(mongoose.connection);
// userSchema.plugin(autoIncrement.plugin, 'user');
// we need to turn it into a model
// const postUser = mongoose.model('user', userSchema);

// export default postUser;
const Redisuser = new mongoose.model("redisuser", employeeSchema);

export default Redisuser