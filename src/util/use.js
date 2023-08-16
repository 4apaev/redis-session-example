const {
    keys,
    assign,
} = Object

export function use(a, b) {
    return Object.defineProperties(a,
        Object.getOwnPropertyDescriptors(b))
}

export function each(it, cb, ctx) {
    for (let [ k, v ] of it?.entries?.() ?? Object.entries(it))
        cb.call(ctx, k, v)
    return ctx
}

export function mix() {
    return Object.assign(use.o, ...arguments)
}

export default use(use, {
    get o() {
        return Object.create(null)
    },

    keys,
    assign,
    each,
    mix,
})
