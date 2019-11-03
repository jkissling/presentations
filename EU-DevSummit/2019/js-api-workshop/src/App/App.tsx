import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import DevTools from 'mobx-react-devtools'
import './App.scss'
import { inject, observer } from 'mobx-react'
import { AppState } from './States/AppState'
import { computed, observable, action } from 'mobx'
import { MapComponent } from './Map/MapComponent'

declare var process

@inject('appState')
@observer
class App extends React.Component<{
    appState?: AppState
}> {
    @computed
    public get nls() {
        return this.props.appState.nls
    }

    public render() {
        return (
            <div className="app">
                <MapComponent />
                {process.env.NODE_ENV === 'development' ? <DevTools /> : null}
            </div>
        )
    }
}

export default hot(App)
