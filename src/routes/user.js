import Client from '../db/connect.js'
import * as Jwt from '../util/jwt.js'

const SESSION_PERIOD = 1000 * process.env.SESSION_PERIOD
const COOLDOWN_PERIOD = 1000 * process.env.COOLDOWN_PERIOD

/** @typedef { import('http').IncomingMessage } Req */
/** @typedef { import('http').ServerResponse  } Res */

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function get(rq, rs) {
    const mail = rq.path.split('/').pop()
    const name = await Client.hGet('user:' + mail, 'name')

    if (name)
        rs.json(200, { name, mail })
    else
        rs.fail(404, 'User not found')
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function remove(rq, rs) {
    const uid = 'user:' + rq.path.split('/').pop()
    const exists = await Client.exists(uid)

    if (!exists)
        return rs.fail(404, 'User not found')

    try {
        await Client.del(uid)
        rs.json(200, { ok: 1 })
    }

    catch (e) {
        console.error(e)
        rs.fail(500, 'Failed to remove user')
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function create(rq, rs) {
    const {
        mail,
        pass,
        name,
    } = rq.body

    try {
        await Client.hSet('user:' + mail, {
            name,
            mail,
            pass: Jwt.sign(pass),
        })

        rs.json(200, {
            name,
            mail,
        })
    }
    catch (e) {
        console.error(e)
        rs.fail(500, 'Failed to create user')
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function login(rq, rs) {
    const {
        mail,
        pass,
    } = rq.body

    try {
        const user = await Client.hGetAll('user:' + mail)

        if (!user || user.pass !== Jwt.sign(pass))
            return rs.fail(401)

        const exp = SESSION_PERIOD + rq.timestamp
        const token = Jwt.create({ exp, mail })

        await Client.set(mail, exp)
        await Client.expire(mail, SESSION_PERIOD / 1000)

        rs.json(200, { token })
    }
    catch (e) {
        console.error(e)
        rs.fail(500, 'Failed to login user')
    }
}

/**
 * @param { Req } rq
 * @param { Res } rs
 */
export async function auth(rq, rs) {
    const token = rq.get('authorization')
    const user = Jwt.verify(token)

    if (!user) {
        console.error('signature mismatch')
        return rs.status = 401
    }

    const exp = await Client.get(user.mail)
    if (!exp) {
        console.error('token mismatch', user)
        return rs.status = 401
    }

    let diff = exp - rq.timestamp

    if (diff > 0) {
        rq.user = user
    }
    else if (diff += COOLDOWN_PERIOD > 0) {
        console.log('session cooldown %dsec', diff / 1000)
        rs.status = 403
    }

    else {
        console.log('session expired')
        rs.status = 401
    }

    return rs.status
}
