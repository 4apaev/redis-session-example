import { createHmac } from 'crypto'

const {
    TOKEN_LINK,
    TOKEN_SECRET,
} = process.env

/////////////////////////////////////////////////////////////////////

export function create(o) {
    const head = encode({ typ: 'jwt', alg: 'HS256', r: Math.random() })
    const body = encode(o)
    const sig = sign(head, body)
    return [ head, body, sig ].join(TOKEN_LINK)
}

export function verify(s) {
    const [ head, body, sig ] = s.split(TOKEN_LINK)
    if (sig === sign(head, body))
        return decode(body)
    return false
}

export function sign(...a) {
    return createHmac('SHA256', TOKEN_SECRET)
        .update(a.join(TOKEN_LINK))
        .digest('base64')
}

/////////////////////////////////////////////////////////////////////

export function enc(s) {
    return Buffer.from(s).toString('base64')
}

export function dec(s) {
    return Buffer.from(s, 'base64').toString()
}

export function encode(o) {
    return enc(JSON.stringify(o))
}

export function decode(s) {
    try {
        return JSON.parse(dec(s))
    }
    catch (_) {
        console.error('[decode:Invalid JSON]', _)
        return false
    }
}
