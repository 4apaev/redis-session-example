export default class Qurl extends URL {
    get tos() {
        return this.toString()
    }

    get path() {
        return this.pathname
    }

    set path(x) {
        let [ p, ...s ] = x.split('?')
        this.pathname = p
        this.search = s.join('?')
    }

    get query()  {
        const q = {}
        for (let [ k, v ] of this.searchParams) {
            q[ k ] = k in q
                ? [].concat(q[ k ], v)
                : v
        }
        return q
    }

    set query(x) {
        for (const [ k, v ] of new URLSearchParams(x)) {
            this.searchParams[ this.searchParams.has(k)
                ? 'append'
                : 'set' ](k, v)
        }
    }
}
