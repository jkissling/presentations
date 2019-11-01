import webMercatorUtils = require("esri/geometry/support/webMercatorUtils")
import { Photo } from "./Photo"

export interface IFlickrPhoto {
    farm: string
    server: string
    id: number
    secret: string
    owner: string
}

interface IFlickrPhotoLocation {
    location: {longitude: number, latitude: number}
}

export default class Flickr {
    private key: string
    
    constructor(key: string) {
        this.key = key
    }

    public async getImages(point: __esri.Point) {
        const geom = webMercatorUtils.webMercatorToGeographic(point) as __esri.Point
        const url = this.getFlickerSearchUrl(geom)
        
        const result = await this.asyncFetch(url)
        if (result.stat != "ok") return
        
        const flickerPhotos: IFlickrPhoto[] = result.photos.photo
        
        const photos = flickerPhotos.map(t => new Photo(t))

        return photos
    }

    public getFlickerSearchUrl(point: __esri.Point) {
        return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.key}&lat=${point.y}&lon=${point.x}&radius=1&format=json&content_type=1&safe_search=1&has_geo=1`
    }


    public async getPhotoLocation(photo: Photo): Promise<IFlickrPhotoLocation> {
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=${this.key}&photo_id=${photo.id}&format=json`
        const result = await this.asyncFetch(url)
        
        if (result.stat != 'ok') return null
        
        return result.photo
    }

    public async asyncFetch(theUrl) {
        try {
            const response = await fetch(theUrl)
            let responseText = await response.text()

            responseText = responseText.replace("jsonFlickrApi(", "");
            responseText = responseText.slice(0, -1)

            return JSON.parse(responseText);

        } catch (e) {
            console.error(e)
        }
    }
}





