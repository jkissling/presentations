import promise from 'promise-polyfill'
import 'es6-object-assign/auto'
import request from 'esri/request'
import 'linq4js'
import start from './start'

const anyWin = window as any

if (!anyWin.Promise) {
  anyWin.Promise = promise
}

(async () => {
    const config = await request('config/config.json')
    start(config.data)
})()