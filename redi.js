import Redis from 'ioredis';
import pkg from 'dotenv';
pkg.config();
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

// Function to retrieve data, checking the cache first
async function setData(key, value) {
    await redis.set(key, JSON.stringify(value));
    return value;
}


async function checkRedis(key) {

    const cachedData = redis.get(key);
    if (cachedData) {
        // Data exists in cache, return it
        return cachedData
    } else {
        return null
    }
}

const exportobj = {
    setData,
    checkRedis
}


export default exportobj



