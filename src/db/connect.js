import Redis from 'redis'
import { sign } from '../util/jwt.js'

const {
    REDIS_HOST,
    REDIS_PORT,
    ADMIN_PASS,
    ADMIN_MAIL,
    // REDIS_USERNAME,
    // REDIS_PASSWORD,
} = process.env

export const Client = Redis.createClient({
    url: `redis://${ REDIS_HOST }:${ REDIS_PORT }`,
})
export default Client

Client.once('connect', async () => {
    console.log('Client Connected')

    await Client.hSet('user:admin@shoshi.dog', {
        name: 'admin',
        mail: ADMIN_MAIL,
        pass: sign(ADMIN_PASS),
    })

    console.log('Admin Created')
})

try {
    await Client.connect()
}
catch (e) {
    console.error('Failed to connect', e)
}
