import Server from './routes/router.js'

const {
    APP_PORT,
    APP_NAME,
} = process.env

Server.listen(APP_PORT, () =>
    console.table({
        name: APP_NAME,
        port: +APP_PORT,
        pid: process.pid,
        dir: process.cwd(),
    }))
