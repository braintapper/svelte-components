// requires umbrellajs

// dynamically add script or stylesheet but only once
var ScriptLoader;

ScriptLoader = (function() {
  class ScriptLoader {
    load(name, url, scb) {
      var asset, found, mode;
      mode = "js";
      if (url.endsWith(".css")) {
        found = u(`[href=\"${url}\"]`).length > 0;
        mode = "css";
      } else {
        // js
        found = u(`[src=\"${url}\"]`).length > 0;
      }
      if (!found) {
        // console.log "#{name}: attempting #{url}"
        asset = null;
        if (mode === "css") {
          asset = document.createElement("link");
          asset.setAttribute("rel", "stylesheet");
          asset.setAttribute("href", url);
        } else {
          asset = document.createElement("script");
          asset.setAttribute("type", "text/javascript");
          asset.setAttribute("src", url);
        }
        asset.onload = function(args) {
          console.info(`${name}: loaded ${url}`);
          that.loaded.append(`${url}`);
          return scb();
        };
        if (mode === "css") {
          return document.head.appendChild(asset); //js
        } else {
          return document.body.appendChild(asset);
        }
      }
    }

    enqueue(name, queue, scb) {
      var debouncedNextInQueue, nextInQueue, that;
      // console.log "enqueue"
      that = this;
      nextInQueue = function() {
        var asset, found, mode, url;
        // console.log "#{name}: next in queue"
        // # console.log queue
        if (queue.length > 0) {
          url = queue.shift();
          if (that.loaded.find(url) == null) {
            mode = "js";
            found = false;
            if (url.endsWith(".css")) {
              found = u(`[href=\"${url}\"]`).length > 0;
              mode = "css";
            } else {
              // js
              found = u(`[src=\"${url}\"]`).length > 0;
            }
            if (!found) {
              // console.log "#{name}: attempting #{url}"
              asset = null;
              if (mode === "css") {
                asset = document.createElement("link");
                asset.setAttribute("rel", "stylesheet");
                asset.setAttribute("href", url);
              } else {
                asset = document.createElement("script");
                asset.setAttribute("type", "text/javascript");
                asset.setAttribute("src", url);
              }
              asset.onload = function(args) {
                console.info(`${name}: loaded ${url}`);
                that.loaded.append(`${url}`);
                return nextInQueue();
              };
              if (mode === "css") {
                return document.head.appendChild(asset); //js
              } else {
                return document.body.appendChild(asset);
              }
            } else {
              // console.log "#{name}: #{url} already in DOM, might be loading from other queue, debouncing for 250ms"
              return debouncedNextInQueue();
            }
          } else {
            // console.log "#{name}: #{url} previously loaded"
            return nextInQueue();
          }
        } else {
          // console.log "Queue completed"
          return scb();
        }
      };
      debouncedNextInQueue = nextInQueue.debounce(250);
      return nextInQueue();
    }

    constructor(subscribe, set, update, constructor_callback) {
      this.subscribe = subscribe;
      this.set = set;
      this.update = update;
      window.loader = this;
    }

  };

  // todo: DRY this up
  ScriptLoader.prototype.loaded = [];

  return ScriptLoader;

}).call(this);

module.exports = ScriptLoader;
