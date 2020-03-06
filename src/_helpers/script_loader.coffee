
class ScriptLoader


  # todo: DRY this out

  queue: []

  callbacks: []

  loaded: []

  isLoading: false

  enqueue: (queue, cb)->
    that = @
    notRun = queue.exclude (item)->
      present = that.loaded.includes(item)
      if present
        console.log "#{item} is already loaded, not queued"
      return present
    @queue.append notRun

    @callbacks.append cb

    unless @isLoading
      console.log "start queue"
      @isLoading = true
      @load()

    else
      console.log "added items to runing queue"


  constructor:  (@subscribe, @set, @update, constructor_callback)->


    that = @

    # @queue = queue || []




    @load = ()->
      cb = ()->
        if that.queue.length > 0
          that.load()
        else
          that.isLoading = false
          that.callbacks.forEach (callback)->
            callback()


      itemToLoad = that.queue.shift()

      # console.log "item to load: #{ itemToLoad}, #{that.queue.length} items remaining"

      that.loadItem itemToLoad, cb

    @loadItem = (url, cb) ->
      unless document.getElementById(url)
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
        # console.warn "skipped #{url}, already loaded"
        cb()





module.exports = ScriptLoader
