## Setup

1. Create Widget-Folder
2. Create [Widget.js](https://developers.arcgis.com/web-appbuilder/guide/extend-basewidget.htm)

```
define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // Custom widget code goes here 
  });
});
```

3. Create [manifest.json](https://developers.arcgis.com/web-appbuilder/guide/widget-manifest.htm)

```
{
    "name": "FlickrSearch",
    "platform": "HTML",
    "version": "2.2",
    "wabVersion": "2.2",
    "author": "Julian Kissling",
    "description": "Search Flickr based on a Location",
    "properties": {
        "hasConfig": false,
        "hasStyle": false,
        "hasLocale": false,
        "hasUIFile": false,
        "hasSettingPage": false
    }
}
```

4. Create Config to test
- Copy `sample-configs/config-demo.json` to `configs/dev.json`
- Add webmap id: `21278abfa1a94d168b989861e0ccba70`
- Remove Widgets and add ours
```
"widgets": [{
      "label": "Flickr Search",
      "uri": "widgets/FlickrSearch/Widget"
    }]
```
- Go to [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)


## Dev

### Add Content
Add template string in Widget.js
```
define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {
  return declare([BaseWidget], {
    baseClass: 'jimu-widget-demo',
    templateString: '<div>Let us implement a custom widget</div>'
  });
});
```
Result: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)

### UI File
1. Create Widget.html
```
<div>
    <div class="title">Search Tweets</div>
</div>
```
2. Show that it fails: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)
3. Set UIFile true in manifest
4. Show that it works: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)


### Style
#### Setup Style
1. Create css folder
2. Create style.css
3. Enable in manifest.json

#### Add styling
1. Change Widget.html
```
<div>
    <div class="title">Search Tweets</div>
</div>
```
2. Add css
```
.flickr-search .title {
    font-weight: bold;
}
```
3. Show that it works: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)
4. Open Dev Tools and show that the base class has been added to the topmost div

### NLS
#### Setup NLS
1. Create nls folder
2. Create [strings.js](https://developers.arcgis.com/web-appbuilder/guide/add-i18n-support.htm)
3. Enable in manifest.json

#### Add translations
1. Add key in Widget.html
```
<div>
    <div class="title">${nls.description}</div>
</div>
```
2. Add key in strings.js
```
define({
    root:{
        description: "Search Tweets"
    },
    "de": true    
});
```

3. Create german translation `nls/de/strings.js`
```
define({
    root:{
        description: "Tweets suchen"
    }
});
```

### Add SearchWidget
1. Create div in Widget.html
```
<div dojo-data-attach-point="searchNode"></div>
```
2. Load Widget ["esri/dijit/Search"](https://developers.arcgis.com/javascript/3/jsapi/search-amd.html)

3. Create Instance of Widget
```
define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/dijit/Search"],
function(declare, BaseWidget, Search) {
  return declare([BaseWidget], {
    baseClass: 'flickr-search',
    
    postCreate: function() {
        this.search = new Search({
            map: this.map
        }, this.searchNode)
        this.search.startup()
    }
  });
});
```

4. Show that it works: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)

### Add Flickr search
1. Add [Flickr.js](C:\Users\juki\Documents\Presentations\DevSummit Berlin\AWAB) 
2. Load Flickr Module
```
define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/dijit/Search", './Flickr',],
function(declare, BaseWidget, Search, Flickr) {
  return declare([BaseWidget], {
    baseClass: 'flickr-search',
    
    postCreate: function() {
        this.search = new Search({
            map: this.map
        }, this.searchNode)
        this.flickr = new Flickr(`8631193d4f1d73d892953db7cf160395`)
    }
  });
});
```
3. Add html
```
<div>
    <div class="title">${nls.description}</div>
    <div data-dojo-attach-point="searchNode"></div>
    <div class="image-container" data-dojo-attach-point="imageNode"></div>
</div>
```
4. Add Event
```
this.search.on('select-result', ({result}) => {
    if (!result) return
    // this.showImages(result.feature.geometry)
})
```

5. Add Method to retrieve images
```
showImages: async function (point) {
  this.imageNode.innerHTML = ''
  let images = await this.flickr.getImages(point)
  if (!images) return
  for (const p of images) {
    let img = document.createElement('img')
    img.src = p.small
    img.className = 'flickr-image'
    img.onclick = function () {
      window.open(p.flickr, '_blank')
    }
    // img.onmouseover = this.showImageOnMap.bind(this, p.photo)
    this.imageNode.append(img)
  }
},
```

6. Show that it works: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)

7. Add Image Hover and load Graphic
```
showImageOnMap: async function (point) {
  let geocoded = await this.flickr.getPhotoLocation(point)
  let graphic = new Graphic({
    geometry: {
      x: geocoded.location.longitude,
      y: geocoded.location.latitude
    },
    symbol: {
      type: "esriPMS",
      url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB20.png",
      width: 24,
      height: 24
    }
  })
  this.map.graphics.clear()
  this.map.graphics.add(graphic)
}
```
6. Show that it works: [App](http://fusek.esri-de.com:3344/webappbuilder/stemapp/?config=configs/dev.json)

```
define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'esri/dijit/Search',
    './Flickr',
    'esri/graphic'
  ],
  function (declare, BaseWidget, Search, Flickr, Graphic) {
    return declare([BaseWidget], {
      baseClass: 'flickr-search',

      postCreate: function () {
        this.inherited(arguments)
        this.search = new Search({
          map: this.map
        }, this.searchNode)
        this.search.startup()
        this.flickr = new Flickr(<YOUR API KEY>)
        this.search.on('select-result', ({result}) => {
          if (!result) return
          this.showImages(result.feature.geometry)
        })
      },

      showImages: async function (point) {
          this.imageNode.innerHTML = ''
          let images = await this.flickr.getImages(point)
          if (!images) return

          for (const p of images) {
            let img = document.createElement('img')
            img.src = p.small
            img.className = 'flickr-image'
            img.onclick = function () {
              window.open(p.flickr, '_blank')
            }
            img.onmouseover = this.showImageOnMap.bind(this, p.photo)
            this.imageNode.append(img)
          }
        },
      showImageOnMap: async function (point) {
        let geocoded = await this.flickr.getPhotoLocation(point)
        let graphic = new Graphic({
          geometry: {
            x: geocoded.location.longitude,
            y: geocoded.location.latitude
          },
          symbol: {
            type: "esriPMS",
            url: "https://static.arcgis.com/images/Symbols/Firefly/FireflyB20.png",
            width: 24,
            height: 24
          }
        })
        this.map.graphics.clear()
        this.map.graphics.add(graphic)
      }

    });
  });
```

## Add Conifg.json
1. Create config.json
2. Add API Key
```
{
    "apiKey": <YOUR API KEY>
}
```
3. Activate config in manifest.json
4. Use Config in Widget.js
```
this.flickr = new Flickr(this.config.apiKey)
```

5. Show config in [WAB](http://fusek.esri-de.com:3344/webappbuilder/)

## Add setting
1. Create Folder `setting`
2. Copy NLS and CSS folder into it
3. Create Setting.js
```
define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting'
],
function(declare, BaseWidgetSetting) {

  return declare([BaseWidgetSetting], {

    postCreate: function(){
      //the config object is passed in
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.textNode.value = config.apiKey;
    },

    getConfig: function(){
      //WAB will get config object through this method
      return {
        apiKey: this.textNode.value
      };
    }
  });
});
```

4. Create Setting.html
```
<div>
    <label>Api Key</label>
    <input data-dojo-attach-point="textNode" />
</div>
```

5. Activate Setting in manifest.json

6. Show config in [WAB](http://fusek.esri-de.com:3344/webappbuilder/)

## Add FeatureAction
0. Show [Docs](https://developers.arcgis.com/web-appbuilder/guide/create-a-feature-action-in-your-widget.htm)
1. Create `GetImagesFeatureAction.js`
```
define([
    'dojo/_base/declare',
    'jimu/BaseFeatureAction',
    'jimu/WidgetManager'
], function (declare, BaseFeatureAction, WidgetManager) {
    var clazz = declare(BaseFeatureAction, {

        isFeatureSupported: function (featureSet) {
            return featureSet.features.length > 0 && featureSet.features[0].geometry.type === 'point';
        },

        onExecute: function (featureSet) {
            WidgetManager.getInstance().triggerWidgetOpen(this.widgetId)
                .then(function (myWidget) {
                    // Do Stuff here
                });
        }

    });
    return clazz;
});
```

2. Add manifest property
```
"featureActions": [{
    "name": "GetImages",
    "uri": "GetImagesFeatureAction"
}]
```

3. Add Name in nls
```
_featureAction_GetImages: "Get Images"
```

4. Implement functionality
```
myWidget.showImages(featureSet.features[0].geometry)
```