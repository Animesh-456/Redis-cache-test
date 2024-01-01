import Redis from 'ioredis';
import pkg from 'dotenv';
pkg.config();
import Fastify from 'fastify'
import exportobj from './redi.js';
import { Redisuser, post } from './schema.js';
import Connection from './db.js';

Connection();
const fastify = Fastify({
    logger: false
})


fastify.get('/', async (request, reply) => {

    let res = await exportobj.checkRedis("user");

    console.log("redis log is ", JSON.parse(res))
    if (res) {
        reply.send(JSON.parse(res))
        //return
    } else {
        let response = await Redisuser.find();
        if (!response.length) {
            let data = {
                fname: "Animesh",
                lname: "Mondal",
                email: "anim29006@gmail.com"
            }
            let u = new Redisuser(data);
            await u.save();
            reply.send(u);
            exportobj.setData("user", u)
        }
        //let response = await Redisuser.deleteOne({ email: "anim29006@gmail.com" });
        reply.send("the empty response is ", response)
    }

})

fastify.get("/update", async (request, reply) => {
    let fname = "Helge";
    let email = "anim29006@gmail.com" //Passing static data to update

    const result = await Redisuser.findOneAndUpdate({ email: email }, { $set: { fname: fname } }, { new: true })

    exportobj.setData("user", result)

    reply.send(result)

})


fastify.get("/getall", async (request, reply) => {

    const result = await Redisuser.find()

    console.log(result) // logging the result

    reply.send(result) // sending the user

})



//this endpoint is just used to show a particular user from db 
fastify.get("/getuser", async (request, reply) => {

    const result = await Redisuser.find({ email: "anim29006@gmail.com" })

    console.log(result) // logging the result

    reply.send(result) // sending the user

})


fastify.post("/addposts", async (request, reply) => {
    const id = request.body.id;

    console.log("the id from postman is ", id)
    let data =
    {
        title: "Post2",
        description: "This is post 2",
        user_id: id
    }


    let posts = new post(data)
    await posts.save()

    reply.send(posts)
})


fastify.get("/allpostsbyuser", async (request, reply) => {
    //All mongodb commands will be listed 
    const id = request.query.id;
    console.log("the id is :", id)
    const result = await post.aggregate([  //Aggregate

        {
            $lookup: {
                from: 'redisusers', // Name of the collection to join (users collection in this case)
                localField: 'user_id', // Field in the posts collection
                foreignField: '_id', // Field in the users collection
                as: 'userDetails' // Alias for the joined user details
            }
        },

    ]);

    const res = await post.find(); //to get all the posts from post collection 

    const response = await post.find({ title: 'Post1' }).count() //to count the nuber of posts with title post1 
    //const rep = await post.updateOne({ title: "Post3" }, { description: "This is post 3" }, { upsert: true }) // upsert is used if there is no result found with that title it will create a new one
    //const rep = await post.findOneAndUpdate({ title: "Post5" }, { $set: { description: "This is a description 5" } }, { upsert: true })
    //const b = await post.find({ $or: [{ title: 'Post1' }, { description: 'This is post 1' }] })


    //const remove = await post.deleteOne({ title: 'Post5' })

    reply.send(res)
})

//this is for anim branch 


fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
    // Server is now listening on ${address}
})




