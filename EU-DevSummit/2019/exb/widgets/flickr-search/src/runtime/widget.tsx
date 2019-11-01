/** @jsx jsx */
import './style.scss'
import { AllWidgetProps, jsx } from 'jimu-core';
import { IMConfig } from '../config';
import { Photo } from './Photo';
import { React, BaseWidget, DataSourceComponent } from 'jimu-core';
import { WebMapDataSource } from 'jimu-arcgis/lib/data-source';
import FeatureLayerView = require('esri/views/layers/FeatureLayerView');
import Flickr from './Flickr';
import MapView = require('esri/views/MapView');
import Search = require('esri/widgets/Search')

interface IState {
  photos: Photo[],
  webMapDs: WebMapDataSource,
  selectedRecord: __esri.Graphic
  loadingImages: boolean
  lastExternal: __esri.Graphic
}

interface IMutableStateProps {
  mutableStateProps: { selectedRecord: __esri.Graphic }
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & IMutableStateProps, IState>{
  public searchRef = React.createRef<HTMLDivElement>()
  public viewRef = React.createRef<HTMLDivElement>()
  public flickr: Flickr
  public search: Search;
  public webMap: __esri.WebMap
  public mapView: __esri.MapView
  public highlightHandle: __esri.Handle

  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      webMapDs: null,
      selectedRecord: null,
      loadingImages: false,
      lastExternal: null
    }

  }

  componentDidMount() {
    this.flickr = new Flickr(this.props.config.apiKey)
    this.search = new Search({
      container: this.searchRef.current
    })

    this.search.on('select-result', t => {
      this.clearImages()
      const { feature } = t.result
      this.getImages(feature.geometry as __esri.Point)
    })

    this.search.on('search-clear', this.clearImages)
  }

  componentDidUpdate() {
    const externalSelection = this.props.mutableStateProps ? this.props.mutableStateProps.selectedRecord : null
    this.showAndLoadExternalSelection(externalSelection)
  }

  isDsConfigured = () => {
    if (this.props.useDataSources && this.props.useDataSources.length === 1) return true;
    return false;
  }

  setDataSource = (ds: WebMapDataSource) => {
    this.setState({
      webMapDs: ds
    }, this.initializeMap)
  }

  initializeMap = () => {
    this.mapView = new MapView({
      map: this.state.webMapDs.map,
      container: this.viewRef.current
    })
    this.search.view = this.mapView
  }

  showAndLoadExternalSelection = (selection: __esri.Graphic) => {
    if (selection !== this.state.lastExternal && this.mapView) {
      if (this.highlight(selection)) {
        this.search.clear()
        this.clearImages()

        this.setState({
          lastExternal: selection
        })

        this.getImages(selection.geometry as __esri.Point)
      }
    }
  }

  getImages = async (point: __esri.Point) => {
    this.setState({ loadingImages: true })
    const photos = await this.flickr.getImages(point)
    this.setState({ photos: photos, loadingImages: false })
  }

  clearImages = () => {
    this.setState({ photos: [] })
  }

  highlight = (graphic: __esri.Graphic) => {
    if (this.highlightHandle) this.highlightHandle.remove()
    if (!graphic) return

    const lv = this.mapView.layerViews.find(t => t.layer.id === graphic.layer.id) as FeatureLayerView
    if (lv) {
      this.highlightHandle = lv.highlight(graphic.attributes.OBJECTID)

      this.mapView.goTo({
        target: graphic,
        zoom: 10
      })
      return true
    }

    return false
  }

  Image = (photo: Photo) => {
    return <div key={photo.id} className="flickr-image" onClick={photo.openExternal}>
      <img src={photo.small} ></img>
    </div>
  }

  render() {
    return <div className="flickr-search">

      {
        this.isDsConfigured() && this.props.useDataSources &&
        <DataSourceComponent useDataSource={this.props.useDataSources[0]} onDataSourceCreated={this.setDataSource}></DataSourceComponent>
      }

      <div className="wrapper">

        <div className="left">
          <div className="search" ref={this.searchRef}></div>
          <div className="image-container">
            {this.state.photos.map(t => this.Image(t))}
            {this.state.loadingImages && <div>Loading Images...</div>}
          </div>
        </div>

        <div className="right">
          {this.isDsConfigured() && <div className="map" ref={this.viewRef}></div>}
          {!this.isDsConfigured() && <div>Please set a datasource to search your own locations</div>}
        </div>

      </div>
    </div>
  }
}
