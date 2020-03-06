var StylesheetLoader;

StylesheetLoader = (function() {
  class StylesheetLoader {
    enqueue(queue, cb) {
      var that;
      that = this;
      this.queue.append(queue);
      this.callbacks.append(cb);
      if (!this.isLoading) {
        // console.log "start queue"
        this.isLoading = true;
        return this.load();
      } else {

      }
    }

    // console.log "added items to already running queue"
    // console.log that.queue
    // console.log that.callbacks
    constructor(subscribe, set, update, constructor_callback) {
      var that;
      this.subscribe = subscribe;
      this.set = set;
      this.update = update;
      that = this;
      // @queue = queue || []
      this.callback = function() {
        var cb;
        // console.log "@clalback"
        if (this.callbacks.length > 0) {
          cb = this.callbacks.shift();
          cb();
          return that.callback();
        } else {

        }
      };
      // console.log "finished callbacks"
      this.load = function() {
        var cb, itemToLoad;
        cb = function() {
          if (that.queue.length > 0) {
            return that.load();
          } else {
            that.isLoading = false;
            // console.error "callbacks:"
            // console.log JSON.stringify(that.callbacks)
            return that.callback();
          }
        };
        // todo: need to clear callback as they are run
        itemToLoad = that.queue.shift();
        // # console.log "item to load: #{ itemToLoad}, #{that.queue.length} items remaining"
        return that.loadItem(itemToLoad, cb);
      };
      this.loadItem = function(url, cb) {
        var s;
        // console.log "queuing #{url}"
        if (!document.getElementById(url)) {
          s = document.createElement("link");
          s.setAttribute("rel", "stylesheet");
          s.setAttribute("href", url);
          s.setAttribute("id", url);
          s.onload = function(args) {
            // console.info "loaded #{url}"
            that.loaded.append(url);
            if (cb != null) {
              return cb();
            }
          };
          return document.head.appendChild(s);
        } else {
          // console.warn "skipped #{url}, already loaded"
          return cb();
        }
      };
    }

  };

  // todo: DRY this out
  StylesheetLoader.prototype.queue = [];

  StylesheetLoader.prototype.callbacks = [];

  StylesheetLoader.prototype.loaded = [];

  StylesheetLoader.prototype.isLoading = false;

  return StylesheetLoader;

}).call(this);

module.exports = StylesheetLoader;
