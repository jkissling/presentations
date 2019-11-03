import { observer, inject } from 'mobx-react';
import { AppState } from '../States/AppState';
import React from 'react';
import MapView from 'esri/views/MapView'
import Map from 'esri/Map'
import './MapComponent.scss'
import FeatureLayer from 'esri/layers/FeatureLayer';
import { PopupContent } from './PopupContent';
import ReactDOM from 'react-dom';

@inject('appState')
@observer
export class MapComponent extends React.Component<{
    appState?: AppState
}> {

    private mapNode = React.createRef<HTMLDivElement>()

    private mapView: MapView
    private map: Map

    private fl: FeatureLayer

    public componentDidMount() {
        this.map = new Map({
            basemap: 'topo'
        })


        this.mapView = new MapView({
            map: this.map,
            container: this.mapNode.current
        })

        const ptFieldInfos = {
            title: "{URBANNAME}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "CTRYCODE",
                            label: "Country Code"
                        },
                        {
                            fieldName: "POP2020",
                            label: "Population 2020",
                            format: {
                                digitSeparator: true,
                                places: 0
                            }
                        },
                        {
                            fieldName: "POP1950",
                            label: "Population 1950",
                            format: {
                                digitSeparator: false,
                                places: 4
                            }
                        }]
                }]
        }

        const ptExpr = {
            title: "{Name}",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "expression/timesHundred"
                },
                {
                    fieldName: "POP1950",
                    label: "Population 1950",
                    format: {
                        digitSeparator: false,
                        places: 0
                    }
                }]
            }],
            expressionInfos: [{
                name: "timesHundred",
                title: "POP1950 x 100",
                expression: "$feature.POP1950 * $feature.POP2020"
            }]
        }

        const ptHTMLString = {
            title: "{URBANNAME}",
            content: `<ol>
                <li> Country Code: CTRYCODE </li>
                <li> Country: {CTRYNAME} </li>
            </ol>`
        }

        const ptComponent = {
            title: "{URBANNAME}",
            content: this.buildPopup
        }

        const ptAsync = {
            title: "{URBANNAME}",
            content: this.buildAsync
        }

        this.fl = new FeatureLayer({
            url: "https://services.arcgis.com/nGt4QxSblgDfeJn9/arcgis/rest/services/World_LargestUrbanAreas_fs/FeatureServer/0",
            // popupTemplate: ptFieldInfos
            // popupTemplate: ptExpr
            // popupTemplate: ptHTMLString
            // popupTemplate: ptComponent
            popupTemplate: ptAsync
        })

        this.map.add(this.fl)
    }

    buildPopup = () => {
        const node = document.createElement('div')
        ReactDOM.render(
            <PopupContent></PopupContent>,
            node
        )
        return node
    }

    buildAsync = async () => {
        await this.sleep(5000)
        return this.buildPopup()
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    public render() {
        return <div className="map" ref={this.mapNode}>
        </div>
    }

}