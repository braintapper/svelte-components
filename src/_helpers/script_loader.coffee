# requires umbrellajs
class ScriptLoader



  loaded: []

  load: (name, url, scb)->
    unless document.getElementById(url)
      console.log "#{name}: attempting #{url}"
      asset = document.createElement("script")
      asset.setAttribute("type", "text/javascript")
      asset.setAttribute("src", url)
      asset.setAttribute("id", url)
      asset.onload = (args)->
        console.info "#{name}: loaded #{url}"
        that.loaded.append url
        scb()
      document.body.appendChild(asset)

  enqueue: (name, queue, scb)->

    console.log "enqueue"
    that = @


    nextInQueue = ()->
      console.log "#{name}: next in queue"
      # console.log queue
      if queue.length > 0
        url = queue.shift()
        unless that.loaded.find(url)?
          mode = "js"
          found = false
          if url.endsWith(".css")
            found = u("[href=\"#{url}\"]").length > 0
            mode = "css"
          else
            # js
            found = u("[src=\"#{url}\"]").length > 0

          unless found
            console.log "#{name}: attempting #{url}"
            asset = null

            if mode == "css"
              asset = document.createElement("link")
              asset.setAttribute("rel", "stylesheet")
              asset.setAttribute("href", url)
              asset.setAttribute("id", url)
            else
              asset = document.createElement("script")
              asset.setAttribute("type", "text/javascript")
              asset.setAttribute("src", url)
              asset.setAttribute("id", "#{url}")

            asset.onload = (args)->
              console.info "#{name}: loaded #{url}"
              that.loaded.append "#{url}"
              nextInQueue()

            if mode == "css"
              document.head.appendChild(asset)
            else #js
              document.body.appendChild(asset)

          else
            console.log "#{name}: #{url} already in DOM, might be loading from other queue, debouncing for 250ms"
            debouncedNextInQueue()
        else
          console.log "#{name}: #{url} previously loaded"
          nextInQueue()
      else
        console.log "Queue completed"
        scb()

    debouncedNextInQueue = nextInQueue.debounce(250)
    nextInQueue()

  constructor:  (@subscribe, @set, @update, constructor_callback)->
    window.loader = @





module.exports = ScriptLoader
