
class CodeMirrorModes


  # todo: DRY this out


  constructor: (@subscribe, @set, @update, constructor_callback)->
    @modes = CodeMirror.modeInfo.sortBy('name')


    @loadQueue = []
    @loadedPaths = []

    that = @


    @exists = (path)->
      return @loadedPaths.find (item)->
        return item.mode == modeName

    @loadlib = (url, cb) ->
      unless document.getElementById(url)
        s = document.createElement("script")
        s.setAttribute("type", "text/javascript")
        s.setAttribute("src", url)
        s.setAttribute("id", url)
        s.onload = (args)->
          console.log "loaded #{url}"
          if cb?
            cb()
        document.body.appendChild(s)
      else
        cb()

    @enqueue = (items)->
      that = @
      items.forEach (item)->
        unless that.exists(item)
          #console.log "#{item} added to queue."
          that.loadQueue.append item
        #else
        #  console.log "#{item} already in queue. Skipped."

    @nextInQueue = (cb)->
      that = @
      if @loadQueue.length == 0
        #console.log "Queue is empty, nothing to load"
        cb()
      else
        currentItem = @loadQueue.shift()
        if @loadQueue.length == 0
          #console.log "#{currentItem} is last item in queue."
          queueCb = cb
        else
          queueCb = ()->
            that.nextInQueue cb
        that.loadlib currentItem, queueCb


    @modePath = (name)->
      return "./codemirror/mode/#{name}/#{name}.js"

    @addonPath = (path)->
      "./codemirror/addon/#{path}.js"


    @load = (modeName, cb) ->
      that = @
      switch modeName
        when "dart"
          @enqueue [@modePath("clike")]
        when "django"
          @enqueue [@modePath("htmlmixed")]
        when "dockerfile", "factor","nsis","rust"
          @enqueue [@addonPath("mode/simple")]
        when "haml","slim"
          @enqueue [@modePath("htmlmixed"), @modePath("ruby")]
        when "handlebars"
          @enqueue [@addonPath("mode/simple"), @addonPath("mode/multiplex")]
        when "haskell-literate"
          @enqueue [@modePath("haskell")]
        when "htmlembedded"
          @enqueue [@modePath("htmlmixed"), @addonPath("mode/multiplex")]
        when "htmlmixed", "sass"
          @enqueue [@modePath("css")]
        when "php"
          @enqueue [@modePath("htmlmixed"), @modePath("clike")]
        when "pug"
          @enqueue [@modePath("css"), @modePath("htmlmixed")]
        when "rst"
          @enqueue [@modePath("python")]
        when "soy","tornado"
          @enqueue [@modePath("htmlmixed")]
        when "twig"
          @enqueue [@addonPath("mode/multiplex")]
      @enqueue [@modePath(modeName)]
      @nextInQueue cb


    @hmdLoad = (mode, scb, ecb)->
      # console.log "hmd mode = #{mode}"
      that.load mode,scb
      #console.log scb
      #console.log ecb




module.exports = CodeMirrorModes
