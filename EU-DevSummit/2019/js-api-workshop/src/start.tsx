import lang from './lang/strings.json'

import * as ReactDOM from 'react-dom'
import React from 'react'
import App from './App/App'
import { States } from './App/States/States'
import { Provider } from 'mobx-react'

export default function start(config: any) {

    const state = new States(lang, config)

    ReactDOM.render(
        <Provider {...state}>
            <App />
        </Provider>,
        document.getElementById('root')
    )
}