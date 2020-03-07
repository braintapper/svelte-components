<script lang="coffeescript">
  # requires scriptloader in store

  import uuid from 'uuid'
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte'
  import ComboBox from "../../Form/Select/ComboBox.svelte"

  import {loader} from "../../../helpers/stores.js"




  `export let code = ""`

  textareaRef = null
  codeMirrorInstance = null
  thisUuid = "#{uuid()}"
  console.log "thisUuid #{thisUuid}"
  mode = null


  modes = [
    { id: null, label: "No Syntax"}
  ]


  # codemirror ---------------------------------

  `export let scriptPath = "./js/codemirror"`

  codeMirrorPath = (path)-> return "#{scriptPath}/#{path}.js"
  modePath = (name)-> return codeMirrorPath("mode/#{name}/#{name}")
  addonPath = (path)-> return codeMirrorPath("addon/#{path}")

  prereqs = [
    codeMirrorPath("codemirror")
    codeMirrorPath("mode/meta")
    './css/vendor/codemirror/codemirror.css'
    './css/vendor/codemirror/foldgutter.css'
    './css/vendor/codemirror/global-codemirror.css'
    codeMirrorPath("addon/fold/foldcode")
    codeMirrorPath("addon/fold/foldgutter")
    codeMirrorPath("addon/fold/markdown-fold")
    codeMirrorPath("addon/mode/overlay")
    modePath("markdown")
    modePath("xml")
    modePath("stex")
    modePath("yaml")
    modePath("javascript")
  ]

  queueCb = ()->
    console.log "cm queue completed"

    showEditor()



  codeMirrorConfig =
    lineNumbers: true
    readOnly: false
    height: Infinity
    indentWithTabs: false
    tabSize: 2
    indentUnit: 2
    fixedGutter: true
    coverGutterNextToScrollbar: true




  editorRef = null




  showEditor = ()->
    console.log "create editor"
    textareaRef = document.getElementById(thisUuid)

    if codeMirrorInstance?
      console.log "need to destroy previous instance"
      codeMirrorInstance.toTextArea()

    codeMirrorInstance = CodeMirror.fromTextArea textareaRef, codeMirrorConfig


    console.log CodeMirror.modeInfo
    cmmodes = CodeMirror.modeInfo.map (mode)->
      return { id: mode.name.toLowerCase(), label: mode.name }


    modes = modes.append cmmodes

    console.log modes




    # this is required because of CodeMirror idiosyncracy
    # codeMirrorInstance.setOption("value", code)

    codeMirrorInstance.on 'focus', (cm)->
      console.log "focus"

    codeMirrorInstance.on 'blur', (cm)->

      change(cm)

    codeMirrorInstance.on 'change', (cm)->
      debouncedUpdate(cm)

    codeMirrorInstance.on 'redraw', (cm)->
      console.error "redraw"

    codeMirrorInstance.on 'update', (cm)->
      console.error "update"

    codeMirrorInstance.on 'veiwportChange', (cm)->
      console.error "veiwportChange"

  onMount ()->
    console.log "mount"
    #textarea = document.createElement("textarea")
    #textarea.value = "text/javascript"
    #textarea.setAttribute("id", thisUuid)
    #editorRef.appendChild(textarea)
    console.log "created element"
    console.log "enqueue"
    loader.enqueue "codemirror", prereqs, queueCb
    console.log "..."



  loadMode = (modeName, cb) ->
    that = @
    switch modeName
      when "dart"
        loader.enqueue [modePath("clike")]
      when "django"
        loader.enqueue [modePath("htmlmixed")]
      when "dockerfile", "factor","nsis","rust"
        loader.enqueue [addonPath("mode/simple")]
      when "haml","slim"
        loader.enqueue [modePath("htmlmixed"), modePath("ruby")]
      when "handlebars"
        loader.enqueue [addonPath("mode/simple"), addonPath("mode/multiplex")]
      when "haskell-literate"
        loader.enqueue [modePath("haskell")]
      when "htmlembedded"
        loader.enqueue [modePath("htmlmixed"), addonPath("mode/multiplex")]
      when "htmlmixed", "sass"
        loader.enqueue [modePath("css")]
      when "php"
        loader.enqueue [modePath("htmlmixed"), modePath("clike")]
      when "pug"
        loader.enqueue [modePath("css"), modePath("htmlmixed")]
      when "rst"
        loader.enqueue [modePath("python")]
      when "soy","tornado"
        loader.enqueue [modePath("htmlmixed")]
      when "twig"
        loader.enqueue [addonPath("mode/multiplex")]

    # loader.load(cb)




  # codemirror ---------------------------------












  # $: comboBoxItems = modes.modes.map( function (mode) { return { id: mode.name, text: mode.name } } )




  setMode = ()->

    found = modes.modes.find (mode)->
      return (mode.name == item.data.mode)
    console.log "found?"
    console.log found
    if found?
      modes.load found.mode, ()->
        codeMirrorInstance.setOption('mode', found.mode)
    else
      codeMirrorInstance.setOption("mode", null)

  change = (cm)->
    cm.save()
    # setMode()
    #if cm?
    #  unless item.data.contents == cm.getValue()
    #    item.data.contents = cm.getValue()
    #    collection.save {id: item.id, data: { mode: item.data.mode, contents: cm.getValue()}}, saveCb
    #else # mode only
    #  if codeMirrorInstance?
    #    collection.save {id: item.id, data: { mode: item.data.mode, contents: codeMirrorInstance.getValue()}}, saveCb

  debouncedUpdate = change.debounce(500)







  onDestroy ()->
    console.log "destroy"

    if codeMirrorInstance?
      codeMirrorInstance.toTextArea()

      codeMirrorInstance = null
      console.log codeMirrorInstance
      console.log "attemptn to remove textarea #{thisUuid}"
      element = document.getElementById(thisUuid)
      if element?
        console.log element
        element.parentNode.removeChild(element)
      else
        console.log "textarea already destroyed"

      textareaRef = null
    else
      console.log "no instance to dstry"


  checkMode = (mode)->
    if mode?
      console.log "modecheck #{mode}"
      change()




  # combobox



  comboBoxUpdated = (e)->
    console.log "comboBoxUpdate"
    item.data.mode = e.detail.text
    console.log item.data.mode
    change()



</script>
<svelte:head>

</svelte:head>
<style lang="sass">
  div
    width: 100%
  [mode]
    margin-top: 24px
    margin-right: 64px
    margin-left: 64px
  label
    padding-left: 12px
    font-size: 12px
    margin-bottom: 12px
  textarea
    display: none
</style>

  <field>
    <label>Syntax Highlighting Mode</label>
    <ComboBox bind:items={modes} bind:value={mode} />
  </field>
  <field>
    <textarea bind:value={code} id={thisUuid}/>
  </field>
