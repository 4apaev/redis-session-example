import Redis from 'redis'
import { sign } from '../util/jwt.js'

const {
    REDIS_HOST,
    REDIS_PORT,
    // REDIS_USERNAME,
    // REDIS_PASSWORD,
} = process.env

export const Client = Redis.createClient({
    host: REDIS_HOST,
    port: +REDIS_PORT,
})

export default Client

Client.on('error', console.error)

Client.once('connect', async () => {
    console.log('Client Connected')

    await Client.hSet('user:admin@shoshi.dog', {
        name: 'admin',
        mail: 'admin@shoshi.dog',
        pass: sign('qwerty'),
    })

    console.log('Admin Created')
})

await Client.connect()
