<script lang="coffeescript">

  # requires scriptloader in store

  import uuid from 'uuid'
  import { onMount, afterUpdate, onDestroy } from 'svelte'

  import {loader} from "../../../helpers/stores.js"



  `export let cmScriptPath = "./js/codemirror"`
  `export let hmdScriptPath = "./js/hypermd"`
  `export let value = "test"`

  codeMirrorPath = (path)-> return "#{cmScriptPath}/#{path}.js"
  modePath = (name)-> return codeMirrorPath("mode/#{name}/#{name}")
  addonPath = (path)-> return codeMirrorPath("addon/#{path}")

  hmdPath = (path)-> return "#{hmdScriptPath}/#{path}.js"

  loadMode = (modeName, cb) ->
    that = @
    switch modeName
      when "dart"
        loader.queue append [modePath("clike")]
      when "django"
        loader.queue append [modePath("htmlmixed")]
      when "dockerfile", "factor","nsis","rust"
        loader.queue append [addonPath("mode/simple")]
      when "haml","slim"
        loader.queue append [modePath("htmlmixed"), modePath("ruby")]
      when "handlebars"
        loader.queue append [addonPath("mode/simple"), addonPath("mode/multiplex")]
      when "haskell-literate"
        loader.queue append [modePath("haskell")]
      when "htmlembedded"
        loader.queue append [modePath("htmlmixed"), addonPath("mode/multiplex")]
      when "htmlmixed", "sass"
        loader.queue append [modePath("css")]
      when "php"
        loader.queue append [modePath("htmlmixed"), modePath("clike")]
      when "pug"
        loader.queue append [modePath("css"), modePath("htmlmixed")]
      when "rst"
        loader.queue append [modePath("python")]
      when "soy","tornado"
        loader.queue append [modePath("htmlmixed")]
      when "twig"
        loader.queue append [addonPath("mode/multiplex")]

  prereqs = [
    codeMirrorPath("codemirror")
    codeMirrorPath("mode/meta")
    codeMirrorPath("addon/fold/foldcode")
    codeMirrorPath("addon/fold/foldgutter")
    codeMirrorPath("addon/fold/markdown-fold")
    codeMirrorPath("addon/mode/overlay")
    './css/vendor/codemirror/codemirror.css'
    './css/vendor/codemirror/foldgutter.css'
    './css/vendor/codemirror/global-codemirror.css'
    './css/vendor/hypermd/hypermd-editor.css'
    modePath("markdown")
    modePath("xml")
    modePath("stex")
    modePath("yaml")
    modePath("javascript")
    hmdPath("ai1")
    hmdPath("marked")
    hmdPath("powerpack/hover-with-marked")
    hmdPath("turndown")
    hmdPath("turndown-plugin-gfm")
    hmdPath("powerpack/paste-with-turndown")
    hmdPath("emojione")
    hmdPath("powerpack/fold-emoji-with-emojione")
  ]
    #"./js/mathjax/MathJax.js"
    #hmdPath("powerpack/fold-math-with-mathjax")






  # note codemirror has some idiosyncratic behaviour on add and removes
  # when sorted




  thisUuid = "codemirror-#{uuid()}"







  inlineEdit = null
  codeEditor = null


  saveCb = (r)->
    #console.log "[#{r.id}] saved -- #{r.data.contents}"
    #console.log r.data

  # cm is a codemirror reference
  # because of the dom shifting, it needs to be passed to ensure the correct value

  update = (cm)->



  debouncedUpdate = update.debounce(500)

  forceRefresh = false




  codeEditor = null
  showEditor = ()->
    elementId = "#{uuid()}-editor"
    domElement = document.getElementById(thisUuid)


    if codeEditor?
      codeEditor.toTextArea()


    codeEditor = HyperMD.fromTextArea domElement,
      mode:
        name: "hypermd"
        hashtag: true
      readOnly: false
      lineNumbers: false
      fixedGutter: false
      autofocus: false
      viewportMargin: Infinity
      hmdFold:
        image: true
        link: true
        math: true
        html: true
        emoji: true
      hmdModeLoader: loadMode
      hmdHideToken: {enabled: true, line: true }

    # this is required because of CodeMirror idiosyncracy
    codeEditor.setOption("value", "asdfasdfa")



    codeEditor.on 'focus', (cm)->
      cm.refresh()


    codeEditor.on 'blur', (cm)->
      cm.refresh()
      update(cm)

    codeEditor.on 'change', (cm)->
      debouncedUpdate(cm)



  isMounted = false

  queueCb = ()->
    console.log "hmd queue completed"
    showEditor()

  onMount ()->
    isMounted = true

    loader.enqueue "hypermd", prereqs, queueCb




  # handle property change from parent


  lastItemId = null
  currentItemId = null




  onDestroy ()->
    if codeEditor?
      # this is required because it will not auto destroy and attach itself to another item in the list
      # what a fucking piece of bullshit
      codeEditor.toTextArea()




</script>
<style>
 .CodeMirror {
   height: auto;
 }
</style>



<textarea id={thisUuid} bind:value={value}/>
