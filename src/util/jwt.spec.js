import {
    it,
    describe,
} from 'node:test'


import {
    ok,
    deepStrictEqual as equal,
    notDeepStrictEqual as nope,
} from 'assert'


import * as Jwt from './jwt.js'

describe('Jwt', () => {
    it('enc/dec', () => {
        const a = 'doggo'
        const b = Jwt.enc(a)
        nope(a, b, '"doggo" not equal encoded "doggo"')
        equal(a, Jwt.dec(b))
    })

    it('encode/decode', () => {
        const a = { type: 'doggo', name: 'shoshi' }
        const b = Jwt.encode(a)
        equal(a, Jwt.decode(b))
    })

    it('ok: create/verify', () => {
        const a = { type: 'dog', name: 'bob' }
        const b = Jwt.create(a)
        equal(a, Jwt.verify(b))
    })

    it('nope: create/verify', () => {
        nope(
            Jwt.create({ type: 'cat', name: 'alice' }),
            Jwt.create({ type: 'dog', name: 'bob'   }),
        )
    })

    it('sign', () => {
        const a = Jwt.sign('a', 'b', 'c')
        console.log(a)
        console.log(Jwt.dec(a))
    })

})
