<script lang="coffeescript">

  `export let value = ''`

  import uuid from 'uuid'
  import { createEventDispatcher } from 'svelte'

  elementId = uuid()

  dispatch = createEventDispatcher()

  editorRef = null


  import Editor from 'cl-editor/dist'



  inlineEdit = null
  inlineEditor = null




  change = (html)->
    `value = html`
    dispatch "change", html

  debouncedChange = change.debounce(500)



  clEditor = (element)->
    html = element.innerHTML
    element.innerHTML = ''
    inlineEditor = new Editor
      target: element
      data:
        height: 'auto'
        html: value

    inlineEditor.on 'change', (html) ->
      debouncedChange html



</script>

<div id={elementId} use:clEditor>{@html value}</div>
