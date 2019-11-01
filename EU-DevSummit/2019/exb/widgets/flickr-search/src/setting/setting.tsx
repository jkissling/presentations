import {React, FormattedMessage, Immutable, DataSourceManager} from 'jimu-core';
import {BaseWidgetSetting, AllWidgetSettingProps, AllDataSourceTypes, DataSourceChooser} from 'jimu-for-builder';
import {IMConfig} from '../config';
import './style.scss'

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, any>{
  
  render(){
    return <div className="flickr-search-settings">
      <DataSourceChooser
        types={Immutable([AllDataSourceTypes.WebMap])}
        selectedDataSourceIds={Immutable((this.props.useDataSources && this.props.useDataSources[0]) ? [this.props.useDataSources[0].dataSourceId] : [])}
        widgetId={this.props.id} mustUseDataSource={true}/>
    </div>
  }
}