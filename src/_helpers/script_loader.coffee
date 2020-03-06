
class ScriptLoader


  # todo: DRY this out

  queue: []



  callback: null

  loaded: []

  isLoading: false

  enqueue: (queue, cb)->
    that = @
    @queue.append queue

    @callback = cb

    unless @isLoading

      @isLoading = true
      @load()


  constructor:  (@subscribe, @set, @update, constructor_callback)->


    that = @

    # @queue = queue || []




    @load = ()->
      cb = ()->
        if that.queue.length > 0
          that.load()
        else
          that.isLoading = false

          that.callback()

          # todo: need to clear callback as they are run
      itemToLoad = that.queue.shift()

      # console.log "item to load: #{ itemToLoad}, #{that.queue.length} items remaining"

      that.loadItem itemToLoad, cb

    @loadItem = (url, cb) ->

      unless document.getElementById(url)
        console.log "queuing #{url}"
        s = document.createElement("script")
        s.setAttribute("type", "text/javascript")
        s.setAttribute("src", url)
        s.setAttribute("id", url)
        s.onload = (args)->
          console.info "loaded #{url}"
          that.loaded.append url
          if cb?
            cb()
        document.body.appendChild(s)
      else
        console.warn "skipped #{url}, already loaded"
        cb()





module.exports = ScriptLoader
