import Http from 'node:http'
import init from '../mw/init.js'
import logger from '../mw/logger.js'
import statiq from '../mw/static.js'
import reader, { withBody } from '../mw/reader.js'

import * as User from './user.js'

export default Http.createServer(Router)

/**
 * @param { import('http').IncomingMessage } rq
 * @param { import('http').ServerResponse } rs
 */
async function Router(rq, rs) {
    logger(rq, rs)
    init(rq, rs)

    const { path, method } = rq

    if (withBody.has(method))
        await reader(rq, rs)

    if (path.startsWith('/api'))
        await handleApi(rq, rs)

    else if (path == '/login')
        await User.login(rq, rs)

    else if (method == 'GET')
        statiq(rq, rs)
    else
        rs.fail(404)
}

async function handleApi(rq, rs) {
    await User.auth(rq, rs)

    if (rs.status >= 400)
        return rs.fail(rs.status)

    if (rq.path.startsWith('/api/user'))
        await handleUser(rq, rs)
}

async function handleUser(rq, rs) {
    if (rq.method == 'POST')
        await User.create(rq, rs)

    else if (rq.method == 'DELETE')
        await User.remove(rq, rs)

    else if (rq.method == 'GET')
        await User.get(rq, rs)

    else
        rs.fail(405)
}
