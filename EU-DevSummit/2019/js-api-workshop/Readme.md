# React Template

## Setup
Install dependencies:
```
npm install
```

Run Dev Server
```
npm start
```
If an node error appears (`certificate not found` | `not enough data`) make sure you have the right certificate and the certificate has the correct name and password.
--> Follow the instructions in [Certificate.md](./certificate.md)


## Introduction

This template is based on [React](https://reactjs.org/) and [MobX](https://mobx.js.org), enables programming with TypeScript and bundles up with WebPack.

It provides a smooth way to create Web Apps on a modern Framework, using an observable based Library (MobX) which behaves in many ways like the good old KnockoutJS.

## Advantages

In comparsion to the KnockoutJS Template we used for years, here are the advantages:

-   The Community of React is like 1000 times bigger than KnockoutJS community
-   React is way faster
-   Hot Module Replacement. As you code in VS-Code, the Hot-Module-Replacer immediatly detects changes in your code and feeds them to the browser. In many cases a Page Reload (F5) is not necessary anymore, since you see the changes immediatly
-   Because you are using TSX, all Components are striclty typed. Everything you pass between Components gets validated at compile time and makes debuggin much easier
-   Compatible with Esris JS Api (4.x, 3.x)
-   No usage of Esri-JS Loader because Esri Modules can be imported like "normal" dependencies
-   MobX in many ways behaves like Knockout. It even is possible to port Knockout stuff to React/MobX, but is not recommended

## Disadvantages

-   Logic and View gets combinend in tsx resulting in larger files, so split up your components earlier to smaller pieces to keep your code clean
-   React in its nature does not support two-way binding. You can feed an observable into an input box, but you need also to hook on events on the input box to retreive the new value :(

# Where to start

## TSX

Tsx is awesome, everyone who knows XAML knows that :)

Make sure to `import React from 'react'`, otherwise you get strange errors on your tsx declaration:

```tsx
import React from 'react'

export class ParentComponent extends React.Component {
    public render() {
        return (
            <div>
                <p>Hi there</p>
            </div>
        )
    }
}
```

You can also compose your tsx with variables:

```tsx
import React from 'react'

export class ParentComponent extends React.Component {
    public render() {

        const aButton = <button>This is a cool Button</button>

        let notLoggedIn = <div></div>

        if(this.loggedIn) {
            notLoggedIn = <div>
                <p>Sorry you are not logged in
            </div>
        }

        return <div>
            <p>Hi there</p>

            {aButton}
            {notLoggedIn}
        </div>
    }
}
```

For a List-Rendering, check the paragraph latter in this file.

## If Statements in Rendering

Have a look at this [Page](https://blog.logrocket.com/conditional-rendering-in-react-c6b0e5af381e).

## Create a new Component

A basic component looks like this.

Checklist:

-   make sure to flag the Component-Class with `@observer`. If you dont do that, the ui of this component does not update when `@observables` change
-   mark any function which changes `@observables` with either `@action` or better `@action.bound`. Its not necessary but provides better performance

```tsx
import { observer } from 'mobx-react'
import React from 'react'
import { observable, action } from 'mobx'
import { ChildComponent } from './ChildComponent'

@observer
export class ParentComponent extends React.Component {
    // this Property will be observable
    // its like 'public counter = ko.observable(0)'
    @observable
    public counter = 0

    // this action will change observables
    // because its using @action.bound, the function gets bound to this
    // automatcly. Use of '$component.incrementCounter.bind(this)' gets obsolete
    @action.bound
    private incrementCounter() {
        this.counter++
    }

    @action.bound
    private counterChanged(newCounter) {
        this.counter = newCounter
    }

    public render() {
        return (
            <div>
                The magic number is: {this.counter}
                <button onClick={this.incrementCounter}>
                    Increment the Counter
                </button>
                <ChildComponent
                    counter={this.counter}
                    onCounterChanged={this.counterChanged}
                />
            </div>
        )
    }
}
```

## Talk between Components

A Simple Component which takes `counter` as param. In Knockout it was possible to change `counter` directly in the Child Component. This is

```tsx
import { observer } from 'mobx-react'
import React from 'react'
import { action } from 'mobx'

// like in knockout, create an interface which defines
// the structure of the params (=props in react slang)
interface ChildComponentProps {
    counter: number
    onCounterChanged: (newCounter) => void
}

// don't forget to mark this as observer
@observer
export class ChildComponent extends React.Component<ChildComponentProps> {
    @action.bound
    private incrementCounter() {
        this.props.onCounterChanged(this.props.counter + 1)
    }

    public render() {
        return (
            <div>
                The magic number is: {this.props.counter}
                <button onClick={this.incrementCounter}>
                    Increment the Counter
                </button>
            </div>
        )
    }
}
```

Maybe you notice how clumsy the work with `this.props.blablabla` is. This is were `@computed` can be used.

A Computed depends (like in knockout) from other observables. Since you are not allowed to "copy" the observables from the props into your local properties, this is the only way to go.

NOT ALLOWED!!!!:

```tsx
// don't forget to mark this as observer
@observer
export class ChildComponent extends React.Component<ChildComponentProps> {
    @observable
    public counterCopy: number

    constructor(props: ChildComponentProps) {
        super(props)

        // this line will only copy the value of the observable
        this.counterCopy = props.counter
    }
}
```

The right way. Please notice that @computeds have to be Properties, and not simple members!!

```tsx
// don't forget to mark this as observer
@observer
export class ChildComponent extends React.Component<ChildComponentProps> {
    // the computed will track the props.counter
    @computed
    // make sure to use `get` !
    public get counter() {
        return this.props.counter
    }

    constructor(props: ChildComponentProps) {
        super(props)
    }
}
```

to improve readablity inside of render use destructuring

```tsx
// don't forget to mark this as observer
@observer
export class ChildComponent extends React.Component<ChildComponentProps> {
    // not so nice
    public render() {
        return (
            <div>
                The magic number is: {this.props.counter}
                <button onClick={this.props.incrementCounter}>
                    Increment the Counter
                </button>
            </div>
        )
    }

    // nicer
    public render() {
        const { counter } = this.props

        return (
            <div>
                The magic number is: {counter}
                <button onClick={this.incrementCounter}>
                    Increment the Counter
                </button>
            </div>
        )
    }
}
```

## How about Styling?

You can simply import your Components .scss File right in Typescript

```ts
import './MapComponent.scss'
```

Webpack will import it as css-reference. Its best practice to give the parent Element of your component a class and inside of scss, wrap everthing with this class:

```scss
.map-component {
    // al the style goes here
}
```

```tsx
@observer
export class MapComponent extends React.Component {
    public render() {
        return <div className="map-component">{/* here comes the code */}</div>
    }
}
```

This makes sure your style does not affect other components. Still be prepared that Sub-components take over styles if you reuse some classes

## Handling Events


```tsx
import { observer } from 'mobx-react'
import React, { ChangeEvent } from 'react'
import { action, observable } from 'mobx'

// don't forget to mark this as observer
@observer
export class InputComponent extends React.Component {
    @observable
    public text = ''

    @action.bound
    private onTextChange(event: ChangeEvent<HTMLInputElement>) {
        this.text = event.target.value
    }

    public render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.text}
                    onChange={this.onTextChange}
                />{' '}
                <br />
                The text was: {this.text}
            </div>
        )
    }
}
```

Please note that if in this case `text` would not be an observable, the text inside of input-box would not change!

## Adding a map

See `src/App/Map/MapComponent.tsx`

Basicly we create a DomNode Reference

```tsx
import MapView from 'esri/views/MapView'

@observer
export class InputComponent extends React.Component {
    // old school was: private mapNode = ko.observable<HTMLDivElement>()
    // and then use data-bind="node: mapNode" on the target div
    private mapNode = React.createRef<HTMLDivElement>()

    // This is a react livecycle function. It will be called automaticly as soon
    // as your component will show up in your apps dom-tree

    public componentDidMount() {
        const mapView = new MapView({
            // make sure to use .current, bc. mapNode is only a ref!!
            container: this.mapNode.current
        })
    }

    public render() {
        // this creates a reference to mapNode and stores the latest
        // node as HTMLDivElement
        return <div ref={this.mapNode} />
    }
}
```

## Working with Arrays

MobX has some automatic features which will drive you crazy.

On is that an `@observable` array where you add prototype-less objects, these objects will be transformed to `@observable` objects as well. This is in some cases cool, because every field of these objects are getting tracked, but it gives you some sideffects which you dont expect.

A sample:

```ts
class User {
    firstname: string
    lastname: string
}

@observable users = new Array<any>()
@observable objUsers = new Array<User>()

let user = {
    firstname: 'firsty',
    lastname: 'lasty'
}

let objUser = new User()
objUser.firstname = 'obj firsty'
objUser.lastname = 'obj lasty'

users.push(user)
objUsers.push(objUser)

console.log(users.indexOf(user))
// you would expect 0, but in reality its -1
// you will never find out if your user is in your users array, because
// mobx created a new object in the 'push' function

console.log(objUsers.indexOf(objUser))
// here you will actually get the index 0!!

// but all fields of the user are observable, thats the trade-off
autorun(() => {
    console.log(user.firstname)
})

autorun(() => {
    console.log(objUser.firstname)
})

user.firstname = 'firsty 2'
// logs 'firsty 2' from autorun

objUser.firstname = 'first 4'
// autorun is not triggered, bc firstname in user class is not marked with @observable!

```

So objects in Arrays are treated differently when created without prototype / Class.

If you want to deactivate the "auto-observing" of pushed objects, use `@observable.shallow`:

```ts

@observable.shallow users = new Array<any>()

let user = {
    firstname: 'firsty',
    lastname: 'lasty'
}


users.push(user)

console.log(users.indexOf(user))
// now this logs 0

autorun(() => {
    console.log(user.firstname)
})

user.firstname = 'firsty 2'
// doesnt trigger autorun, bc. firstname is not observable
```

## Rendering a List

You will notice that inside of a tsx-code part, ifs and foreachs are not possible.

To render a list simply use the map function on an array:

```tsx

class User {
    @observable
    public firstname: string

    @observable
    public lastname: string
}

export class Comp extends React.Component {

    @observable
    public list = new Array<User>([...])

    public render() {
        return <div>
            {this.list.map(user => <div>
                firstname: {user.firstname}
                lastname: {user.lastname}
            </div>)}
        </div>
    }
}

```

If new Users come into your `list`, the user list will update automaticly

## Conditional Rendering

# Working with Stores

A Component usually has its own observables for normal ui-stuff. But in each Application there will be data which should be available everywhere in your app. Usually we passed some thing like `DataStore` or `AppState` through the component tree, resulting in having to pass these objects to each component to access application-wide data.

MobX makes this easier. First of all create a State (there already is an AppState in this template, handling config and nls, since these things you need at every location)

```ts
export class AppState {
    @observable
    public selectedBasemap: string

    @observablue
    public loggedInUser: string
}
```

at index.tsx, the state is injected with a provider:

```tsx
const appState = new AppState(lang, config)

ReactDOM.render(
    // appState is now everywhere available in the tree under Provider
    <Provider appState={appState}>
        <App />
    </Provider>,
    document.getElementById('root')
)
```

In the App Component, you want to access the appState:

```tsx
interface AppProps {
    // mark appState as optional. bc it will be assigned automaticly.
    appState?: AppState
}

// with @inject you can retrieve the appState. It will be assigned to the appstate
// defined in AppProps
@inject('appState')
@observer
export class App extends React.Component<AppProps> {
    public render() {
        const { appState } = this.props

        return <div>The logged in User is: {appState.loggedInUser}</div>
    }
}
```

Of course if any other Component, for example the Loginhandler will change the `observable` loggedInUser value, your App will update immediatly!

# nls-ing and config

Nls was straightforward, and so it is now. To nls a thing, simply inject `appState` into your component, and go:

`nls` in appState is an observable. If the active Language changes (also an observable on AppState) all your nlses will change.

```tsx
interface AppProps {
    appState?: AppState
}

@inject('appState')
@observer
export class App extends React.Component<AppProps> {
    public render() {
        const { nls } = this.props.appState

        return (
            <div>
                {nls.hi},{nls['direct-key-access-for-crazy-nls-keys']}
            </div>
        )
    }
}
```

## React-bootstrap

[React bootstrap](https://react-bootstrap.netlify.com/) replaces the Bootstrap javascript. Each component has been built from scratch as true React components. It has no dependency on either bootstrap.js or jQuery.

### Importing

You should import individual components like: react-bootstrap/Button rather than the entire library. Doing so pulls in only the specific components that you use, which can significantly reduce the amount of code you end up sending to the client.

```
import Button from 'react-bootstrap/Button';

// or less ideally
import { Button } from 'react-bootstrap';
```

### Example

Use any of the available button style types to quickly create a styled button. Just modify the variant prop.

```
import { Badge, Button, Card } from 'react-bootstrap';

<h1>
Example heading <Badge variant="secondary">New</Badge>
</h1>

<Button variant="outline-primary">Primary</Button>
<Button variant="warning" size="lg">
    Large button
</Button>

<Card>
  <Card.Header>Featured</Card.Header>
  <Card.Body>
    <Card.Title>Special title treatment</Card.Title>
    <Card.Text>
      With supporting text below as a natural lead-in to additional content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>;

```

## Extensions for setting up the development environment in Visual Studio Code

### Simple React Snippets

Write the snippets and then press TAB and boilerplate code is generated.
Most popular snippets are the following:

```
imrc --> Import React / Component
cc   --> Class Component
```

### Prettier code formatter

After installing the extension, go to your visual studio code settings and adjust accordingly the next line:

Be carefull when you are working on projects with other team-members. formating documents on save will eventually produce large git-diffs when some teammembers have not installed this extension.

```
"editor.formatOnSave": true
```

## Debugging React app

There are two possibilities to debug your react app. Either you go the old common way and debug using Chrome's DevTools or you choose debugging in VS Code. Both is fine, really.

### Debug using Chrome DevTools

[React Developer Tools (eg. plugin for chrome)](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en): Adds React debugging tools to the Chrome Developer Tools.

By installing React Devtools, you’ll get two main features:

-   a view of the component tree
-   the current state and props of each component you select

[MobX Developer Tools (eg. plugin for chrome)](https://chrome.google.com/webstore/detail/mobx-developer-tools/pfgnfdagidkfgccljigdamigbcnndkod)


### Debug using VS Code
To start debugging in VS Code, you first need to set up some things. No worries, you only have to do this once and not for every app you develop ;-)

#### Preparing you Dev Environment
1. Download and install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) Extension
2. Allow remote debugging in Chrome
    -> Right-Click the chrome shortcut --> Append `--remote-debugging-port=9222` to target -> Save
3. Restart Chrome
4. Done!

#### Start debugging
Whenerver you feel the urge to debug, all you have to do is:

1. `npm start` (I bet you did that anyways)
2. `Open your app in chrome` (Of course you already did this too)
3. In VS Code hit `F5`
4. Enjoy

Problem solving:

_VS Code fails to attach to chrome:_
- Did you install the [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) Extension?
- Did you add `--remote-debugging-port=9222` to target in Chromes shortcut?
- Is the app you try to debug open in chrome?
- Make sure you open the app via `https://<your computer name>.esri-de.com:8080`

_My Webpack Dev Server runs on a different port:_
- Thats a bummer. The debugger is configured to attach to :8080. You could change that port in `.vscode/launch.json` to something else but... Do you really need to run more than on webpack instance at a time?
If you really need to change the port however, please do check that in or you might break someone else's tools.

_Breakpoints don't work (Unverified)_
- Is your app in the root of the workspace?
- Is webpack configured to output source maps? (webpack.config.js -> devtools -> sourcemaps)

#### Create a "git alias" for the git log messages

`git lg` - print out all the condensed and nice-formatted commit messages.

To define it, you have to add at your ~./gitconfig:
```
[alias]
        lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --branches

```

