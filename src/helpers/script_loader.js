var ScriptLoader;

ScriptLoader = (function() {
  class ScriptLoader {
    enqueue(queue, cb) {
      var notRun, that;
      that = this;
      notRun = queue.exclude(function(item) {
        var present;
        present = that.loaded.includes(item);
        if (present) {
          console.log(`${item} is already loaded, not queued`);
        }
        return present;
      });
      this.queue.append(notRun);
      this.callbacks.append(cb);
      if (!this.isLoading) {
        console.log("start queue");
        this.isLoading = true;
        return this.load();
      } else {
        return console.log("added items to runing queue");
      }
    }

    constructor(subscribe, set, update, constructor_callback) {
      var that;
      this.subscribe = subscribe;
      this.set = set;
      this.update = update;
      that = this;
      // @queue = queue || []
      this.load = function() {
        var cb, itemToLoad;
        cb = function() {
          if (that.queue.length > 0) {
            return that.load();
          } else {
            that.isLoading = false;
            return that.callbacks.forEach(function(callback) {
              return callback();
            });
          }
        };
        itemToLoad = that.queue.shift();
        // console.log "item to load: #{ itemToLoad}, #{that.queue.length} items remaining"
        return that.loadItem(itemToLoad, cb);
      };
      this.loadItem = function(url, cb) {
        var s;
        if (!document.getElementById(url)) {
          s = document.createElement("script");
          s.setAttribute("type", "text/javascript");
          s.setAttribute("src", url);
          s.setAttribute("id", url);
          s.onload = function(args) {
            console.info(`loaded ${url}`);
            that.loaded.append(url);
            if (cb != null) {
              return cb();
            }
          };
          return document.body.appendChild(s);
        } else {
          // console.warn "skipped #{url}, already loaded"
          return cb();
        }
      };
    }

  };

  // todo: DRY this out
  ScriptLoader.prototype.queue = [];

  ScriptLoader.prototype.callbacks = [];

  ScriptLoader.prototype.loaded = [];

  ScriptLoader.prototype.isLoading = false;

  return ScriptLoader;

}).call(this);

module.exports = ScriptLoader;
