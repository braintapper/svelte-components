
class StylesheetLoader


  # todo: DRY this out

  queue: []

  callbacks: []

  loaded: []

  isLoading: false

  enqueue: (queue, cb)->
    that = @
    
    @queue.append queue

    @callbacks.append cb

    unless @isLoading
      # console.log "start queue"
      @isLoading = true
      @load()

    else
      # console.log "added items to already running queue"
      # console.log that.queue
      # console.log that.callbacks
  constructor:  (@subscribe, @set, @update, constructor_callback)->


    that = @

    # @queue = queue || []


    @callback = ()->
      # console.log "@clalback"
      if @callbacks.length > 0
        cb = @callbacks.shift()
        cb()
        that.callback()
      else
        # console.log "finished callbacks"

    @load = ()->
      cb = ()->
        if that.queue.length > 0
          that.load()
        else
          that.isLoading = false
          # console.error "callbacks:"
          # console.log JSON.stringify(that.callbacks)
          that.callback()

          # todo: need to clear callback as they are run
      itemToLoad = that.queue.shift()

      # # console.log "item to load: #{ itemToLoad}, #{that.queue.length} items remaining"

      that.loadItem itemToLoad, cb

    @loadItem = (url, cb) ->
      # console.log "queuing #{url}"
      unless document.getElementById(url)
        s = document.createElement("link")
        s.setAttribute("rel", "stylesheet")
        s.setAttribute("href", url)
        s.setAttribute("id", url)
        s.onload = (args)->
          # console.info "loaded #{url}"
          that.loaded.append url
          if cb?
            cb()
        document.head.appendChild(s)
      else
        # console.warn "skipped #{url}, already loaded"
        cb()



module.exports = StylesheetLoader
