var ScriptLoader;

ScriptLoader = (function() {
  class ScriptLoader {
    load(name, url, scb) {
      var asset;
      if (!document.getElementById(url)) {
        console.log(`${name}: attempting ${url}`);
        asset = document.createElement("script");
        asset.setAttribute("type", "text/javascript");
        asset.setAttribute("src", url);
        asset.setAttribute("id", url);
        asset.onload = function(args) {
          console.info(`${name}: loaded ${url}`);
          that.loaded.append(url);
          return nextInQueue();
        };
        return document.body.appendChild(asset);
      }
    }

    enqueue(name, queue, scb) {
      var debouncedNextInQueue, nextInQueue, that;
      console.log("enqueue");
      that = this;
      nextInQueue = function() {
        var asset, url;
        console.log(`${name}: next in queue`);
        // console.log queue
        if (queue.length > 0) {
          url = queue.shift();
          if (that.loaded.find(url) == null) {
            if (!document.getElementById(url)) {
              console.log(`${name}: attempting ${url}`);
              asset = document.createElement("script");
              asset.setAttribute("type", "text/javascript");
              asset.setAttribute("src", url);
              asset.setAttribute("id", `${url}`);
              asset.onload = function(args) {
                console.info(`${name}: loaded ${url}`);
                that.loaded.append(`${url}`);
                return nextInQueue();
              };
              return document.body.appendChild(asset);
            } else {
              console.log(`${name}: ${url} already in DOM, might be loading from other queue, debouncing for 250ms`);
              return debouncedNextInQueue();
            }
          } else {
            console.log(`${name}: ${url} previously loaded`);
            return nextInQueue();
          }
        } else {
          console.log("Queue completed");
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

  ScriptLoader.prototype.loaded = [];

  return ScriptLoader;

}).call(this);

module.exports = ScriptLoader;
