import { IFlickrPhoto } from "./Flickr"

export enum ImageSize {
    Small = "s",
    Medium = 'm',
    Large = 'l'
}

export class Photo {
    public farm = this.params.farm;
    public server = this.params.server;
    public id = this.params.id;
    public secret = this.params.secret;
    public owner = this.params.owner;

    public get small() {
        return this.getImageUrl(ImageSize.Small);
    }
    
    public get medium() {
        return this.getImageUrl(ImageSize.Medium);
    }

    public get large() {
        return this.getImageUrl(ImageSize.Large);
    }

    public get flickr() {
        return this.getFlickrUrl();
    }

    constructor(private params: IFlickrPhoto) {
    }

    public getImageUrl(size: ImageSize) {
        return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.id}_${this.secret}_${size}.jpg`;
    }
    
    public getFlickrUrl() {
        return `https://www.flickr.com/photos/${this.owner}/${this.id}`;
    }

    openExternal = () => {
        window.open(this.flickr, '_blank')
    }
}
