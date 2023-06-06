const redis = require('redis');
const { promisify } = require('util');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

const SET_ASYNC = promisify(redisClient.set).bind(redisClient);
const GET_ASYNC = promisify(redisClient.get).bind(redisClient);

module.exports = {
    SET_ASYNC,
    GET_ASYNC
}