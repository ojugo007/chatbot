const Redis = require('redis');
const dotenv = require('dotenv');

dotenv.config()

const REDIS_URL = process.env.REDIS_URL || `redis://localhost:6379` ||  `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

class Cache {
    constructor() {
        this.redis = null;
    }

    async connect() {
        try {
            this.redis = await Redis.createClient({
                url: REDIS_URL
            });

            this.redis.connect()

            this.redis.on('connect', () => {
                console.log('Redis connected')
            })

            this.redis.on('error', () => {
                console.log('Redis connection error')
            })

    
        } catch (error) {
            console.log(error)
        }

    }
}

const instance = new Cache();

module.exports = instance;