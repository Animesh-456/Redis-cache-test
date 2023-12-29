import mongoose, { mongo } from 'mongoose';
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


const postSchema = mongoose.Schema({
    title: String,
    description: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'redisuser',
        default: null,
    },
})


// autoIncrement.initialize(mongoose.connection);
// userSchema.plugin(autoIncrement.plugin, 'user');
// we need to turn it into a model
// const postUser = mongoose.model('user', userSchema);

// export default postUser;
export const Redisuser = new mongoose.model("redisuser", employeeSchema);

export const post = new mongoose.model("post", postSchema)

