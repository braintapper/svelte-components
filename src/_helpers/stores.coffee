import { readable, writable } from 'svelte/store'
import ScriptLoader from "./script_loader.js"




createLoaderInstance = ()->
  cb = ()->
    console.log "Code mirror modes initialized"
  `const { subscribe, set, update } = writable(null)`

  return new ScriptLoader(subscribe, set, update, cb)


`export const loader = createLoaderInstance()`
