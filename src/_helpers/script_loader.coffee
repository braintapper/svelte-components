
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
        nextInQueue()
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
          unless document.getElementById(url)
            console.log "#{name}: attempting #{url}"
            asset = document.createElement("script")
            asset.setAttribute("type", "text/javascript")
            asset.setAttribute("src", url)
            asset.setAttribute("id", "#{url}")
            asset.onload = (args)->
              console.info "#{name}: loaded #{url}"
              that.loaded.append "#{url}"
              nextInQueue()
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
