<script lang="coffeescript">

  `export let item`

  import uuid from 'uuid'
  import { onMount } from 'svelte'

  element = uuid()


  import Editor from 'cl-editor/dist'

  import {databaseLoaded,  collection} from "../../../helpers/stores.js"

  inlineEdit = null
  inlineEditor = null
  html = item.data.contents

  saveCb = (r)->
    console.log "saved!"
    console.log r

  update = (html)->
    collection.save {id: item.id, data: { contents: html}}, saveCb

  debouncedUpdate = update.debounce(500)

  createEditor = ()->
    inlineEdit = document.getElementById(element)


    html = inlineEdit.innerHTML
    inlineEdit.innerHTML = ''
    inlineEditor = new Editor
      target: inlineEdit
      data:
        height: 'auto'
        html: html

    inlineEditor.on 'change', (html) ->
      debouncedUpdate html

  onMount createEditor


</script>

<div id={element}>{@html html}</div>
