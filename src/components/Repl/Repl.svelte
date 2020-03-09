<svelte:head>

</svelte:head>
<script lang="coffeescript">

  import uuid from 'uuid'
  import { onMount, afterUpdate, onDestroy } from 'svelte'


  import {loader} from "../../helpers/stores.js"




  `export let code = "yada"`

  textareaRef = null
  codeMirrorInstance = null
  thisUuid = "#{uuid()}"
  console.log "thisUuid #{thisUuid}"
  mode = null


  # codemirror ---------------------------------

  `export let scriptPath = "./js/codemirror"`

  codeMirrorPath = (path)-> return "#{scriptPath}/#{path}.js"
  modePath = (name)-> return codeMirrorPath("mode/#{name}/#{name}")
  addonPath = (path)-> return codeMirrorPath("addon/#{path}")

  prereqs = [


    codeMirrorPath("codemirror")
    './css/vendor/codemirror/codemirror.css'
    './css/vendor/codemirror/foldgutter.css'
    './css/vendor/codemirror/global-codemirror.css'
    './css/solver.css'
  ]


  parser =
    parse: (val)->
      console.log "parse #{val}"
      return val.toUpperCase()

  codeMirrorConfig =
    lineNumbers: true
    lineWrapping: true
    theme: "solver"


  b =
    mode: mode
    readOnly: false
    height: Infinity
    indentWithTabs: false
    tabSize: 2
    indentUnit: 2


  editorRef = null


  wrapper = null

  showEditor = ()->
    console.error "create solver"
    textareaRef = document.getElementById(thisUuid)

    if codeMirrorInstance?
      console.log "need to destroy previous instance"
      codeMirrorInstance.toTextArea()

    codeMirrorInstance = CodeMirror.fromTextArea textareaRef, codeMirrorConfig


    # this is required because of CodeMirror idiosyncracy
    # codeMirrorInstance.setOption("value", code)

    codeMirrorInstance.on 'focus', (cm)->
      console.log "focus"

    codeMirrorInstance.on 'blur', (cm)->

      change(cm)

    codeMirrorInstance.on 'change', (cm)->
      debouncedUpdate(cm)

    codeMirrorInstance.on 'update', (cm)->
      console.log "update"
      u(".CodeMirror-rightbar").html ""
      codeElement = u(".CodeMirror-code", cm.getWrapperElement())
      console.log "codeElement"
      console.log codeElement
      for i in [0 ... cm.lineCount()]
        val = ''
        try
          val = parser.parse cm.getLine i
          console.log("VAL: " + val)
          val ?= ''
        catch e
          console.error e.message

        # This is a quick and dirty way to do it, but not optimized AT ALL :)

        matchingHeight = u(u(".CodeMirror-line", cmwrapper).nodes[i]).size().height
        lineHeight = 17
        u(".CodeMirror-rightbar", cm.getWrapperElement()).append u("<pre>").html(val.toString()).attr("style","height: #{matchingHeight}px; max-height: #{matchingHeight}px; -webkit-line-clamp: #{Math.floor(matchingHeight/lineHeight)}")






    console.log "wrappa"
    window.cmwrapper = cmwrapper = codeMirrorInstance.getWrapperElement()



    rightbar_wrapper = u(".CodeMirror-lines",cmwrapper).append(u("<div>").addClass("CodeMirror-rightbar"))
    rightbar_text = u(".CodeMirror-rightbar",cmwrapper).append(u("<div>").addClass("CodeMirror-rightbar-text"))


    console.log "rightbar_wrapper"
    console.log rightbar_wrapper

    rightbar = u("<div>").addClass("CodeMirror-rightbar-text").append(rightbar_wrapper)
    console.log "rightbar"
    console.log rightbar
    codeMirrorInstance.refresh()

  queueCb = ()->
    console.log "solver queue completed"
    console.log window.loader.loaded
    showEditor()

  onMount ()->
    console.log "mount"
    #textarea = document.createElement("textarea")
    #textarea.value = "text/javascript"
    #textarea.setAttribute("id", thisUuid)
    #editorRef.appendChild(textarea)
    console.log "created element"

    loader.enqueue "solver", prereqs, queueCb





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
<div bind:this={editorRef}>

  <field>
    <textarea bind:value={code} id={thisUuid}/>
  </field>
</div>
