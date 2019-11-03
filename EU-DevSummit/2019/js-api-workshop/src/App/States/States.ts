import { AppState } from './AppState';

export class States {
    public appState: AppState

    constructor(lang, config) {
        this.appState = new AppState(lang, config)
    }
}