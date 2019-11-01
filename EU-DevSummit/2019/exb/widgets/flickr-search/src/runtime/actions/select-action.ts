import { AbstractMessageAction, MessageType, Message, getAppStore, appActions, ExtentChangeMessage, SelectDataRecordMessage, SpatialDataRecordsSelectionChangeMessage, loadArcGISJSAPIModules } from 'jimu-core';

export default class SelectAction extends AbstractMessageAction {
  filterMessageType(messageType: MessageType): boolean {
    return messageType === MessageType.SpatialDataRecordsSelectionChange;
  }

  filterMessage(message: Message): boolean { return true; }

  onExecute(message: Message, actionConfig?: any): Promise<boolean> | boolean {
    return loadArcGISJSAPIModules(['esri/Graphic']).then(modules => {
      let Graphic: __esri.GraphicConstructor = null;
      [Graphic] = modules;

      switch (message.type) {
        case MessageType.SpatialDataRecordsSelectionChange:
          let {records} = message as SpatialDataRecordsSelectionChangeMessage;
          if (!records || !records.length) return;
          getAppStore().dispatch(appActions.widgetMutableStatePropChange(this.widgetId, 'selectedRecord', (records[0] as any).feature));
          break;
      }
      return true;
    })
  }
}