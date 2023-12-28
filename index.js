import Redis from 'ioredis';
import pkg from 'dotenv';
pkg.config();
import Fastify from 'fastify'
import exportobj from './redi.js';
import supabase from './db.js';
import Redisuser from './schema.js';
import Connection from './db.js';
import { json } from 'express';


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

//this is for anim branch 

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
    // Server is now listening on ${address}
})




