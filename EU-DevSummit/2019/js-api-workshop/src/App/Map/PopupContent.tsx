import { AppState } from '../States/AppState';
import React from 'react';
import { observer, inject } from 'mobx-react';

@observer
export class PopupContent extends React.Component<{}> {
    componentDidMount() {}

    render() {
        return <div>
            <p>Hello World</p>
            <p>This is Awesome</p>
        </div>
    }
}