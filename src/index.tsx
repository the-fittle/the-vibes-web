export { v4 as createId } from 'uuid'
export * from './components'
export * from './views'
export * from './util'

import { render } from 'solid-js/web'
import { App } from './views/app'

import 'virtual:uno.css'
import '@/../public/styles/index.css'

render( () => <App />, document.body )


























