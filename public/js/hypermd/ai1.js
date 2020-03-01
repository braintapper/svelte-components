/*!
 * HyperMD, copyright (c) by laobubu
 * Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
 *
 * Break the Wall between writing and preview, in a Markdown Editor.
 *
 * HyperMD makes Markdown editor on web WYSIWYG, based on CodeMirror
 *
 * Homepage: http://laobubu.net/HyperMD/
 * Issues: https://github.com/laobubu/HyperMD/issues
 */
//-----------------------------------------------//
// !! This file is for Plain Browser Env ONLY !! //
// !! Not Work With Bundlers                  !! //
//-----------------------------------------------//
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('codemirror'), require('codemirror/addon/fold/foldcode'), require('codemirror/addon/fold/foldgutter'), require('codemirror/addon/fold/markdown-fold'), require('codemirror/addon/edit/closebrackets'), require('codemirror/lib/codemirror.css'), require('codemirror/addon/fold/foldgutter.css'), require('./theme/hypermd-light.css'), require('codemirror/mode/markdown/markdown'), require('./mode/hypermd.css'), require('codemirror/mode/meta')) :
  typeof define === 'function' && define.amd ? define(['exports', 'codemirror', 'codemirror/addon/fold/foldcode', 'codemirror/addon/fold/foldgutter', 'codemirror/addon/fold/markdown-fold', 'codemirror/addon/edit/closebrackets', 'codemirror/lib/codemirror.css', 'codemirror/addon/fold/foldgutter.css', './theme/hypermd-light.css', 'codemirror/mode/markdown/markdown', './mode/hypermd.css', 'codemirror/mode/meta'], factory) :
  (factory((global.HyperMD = {}),global.CodeMirror));
}(this, (function (exports,CodeMirror) { 'use strict';

  /**
   * Provides some common PolyFill
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */
  if (typeof Object['assign'] != 'function') {
      // Must be writable: true, enumerable: false, configurable: true
      Object.defineProperty(Object, "assign", {
          value: function assign(target, varArgs) {
              var arguments$1 = arguments;

              if (target == null) { // TypeError if undefined or null
                  throw new TypeError('Cannot convert undefined or null to object');
              }
              var to = Object(target);
              for (var index = 1; index < arguments.length; index++) {
                  var nextSource = arguments$1[index];
                  if (nextSource != null) { // Skip over if undefined or null
                      for (var nextKey in nextSource) {
                          // Avoid bugs when hasOwnProperty is shadowed
                          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                              to[nextKey] = nextSource[nextKey];
                          }
                      }
                  }
              }
              return to;
          },
          writable: true,
          configurable: true
      });
  }

  /**
   * Provides some universal utils
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */
  /** Simple FlipFlop */
  var FlipFlop = function(on_cb, off_cb, state, subkey) {
      if ( state === void 0 ) state = false;
      if ( subkey === void 0 ) subkey = "enabled";

      this.on_cb = on_cb;
      this.off_cb = off_cb;
      this.state = state;
      this.subkey = subkey;
  };
  /** set a callback when state is changed and is **NOT** `null`, `false` etc. */
  FlipFlop.prototype.ON = function (callback) { this.on_cb = callback; return this; };
  /** set a callback when state is set to `null`, `false` etc. */
  FlipFlop.prototype.OFF = function (callback) { this.off_cb = callback; return this; };
  /**
   * Update FlipFlop status, and trig callback function if needed
   *
   * @param {T|object} state new status value. can be a object
   * @param {boolean} [toBool] convert retrived value to boolean. default: false
   */
  FlipFlop.prototype.set = function (state, toBool) {
      var newVal = (typeof state === 'object' && state) ? state[this.subkey] : state;
      if (toBool)
          { newVal = !!newVal; }
      if (newVal === this.state)
          { return; }
      if (this.state = newVal) {
          this.on_cb && this.on_cb(newVal);
      }
      else {
          this.off_cb && this.off_cb(newVal);
      }
  };
  FlipFlop.prototype.setBool = function (state) {
      return this.set(state, true);
  };
  /**
   * Bind to a object's property with `Object.defineProperty`
   * so that you may set state with `obj.enable = true`
   */
  FlipFlop.prototype.bind = function (obj, key, toBool) {
          var this$1 = this;

      Object.defineProperty(obj, key, {
          get: function () { return this$1.state; },
          set: function (v) { return this$1.set(v, toBool); },
          configurable: true,
          enumerable: true,
      });
      return this;
  };
  /** async run a function, and retry up to N times until it returns true */
  function tryToRun(fn, times, onFailed) {
      times = ~~times || 5;
      var delayTime = 250;
      function nextCycle() {
          if (!times--) {
              if (onFailed)
                  { onFailed(); }
              return;
          }
          try {
              if (fn())
                  { return; }
          }
          catch (e) { }
          setTimeout(nextCycle, delayTime);
          delayTime *= 2;
      }
      setTimeout(nextCycle, 0);
  }
  /**
   * make a debounced function
   *
   * @param {Function} fn
   * @param {number} delay in ms
   */
  function debounce(fn, delay) {
      var deferTask = null;
      var notClearBefore = 0;
      var run = function () { fn(); deferTask = 0; };
      var ans = function () {
          var nowTime = +new Date();
          if (deferTask) {
              if (nowTime < notClearBefore)
                  { return; }
              else
                  { clearTimeout(deferTask); }
          }
          deferTask = setTimeout(run, delay);
          notClearBefore = nowTime + 100; // allow 100ms error
      };
      ans.stop = function () {
          if (!deferTask)
              { return; }
          clearTimeout(deferTask);
          deferTask = 0;
      };
      return ans;
  }
  /**
   * addClass / removeClass etc.
   *
   * using CodeMirror's (although they're legacy API)
   */
  var addClass = CodeMirror.addClass;
  var rmClass = CodeMirror.rmClass;
  var contains = CodeMirror.contains;
  /**
   * a fallback for new Array(count).fill(data)
   */
  function repeat(item, count) {
      var ans = new Array(count);
      if (ans['fill'])
          { ans['fill'](item); }
      else
          { for (var i = 0; i < count; i++)
              { ans[i] = item; } }
      return ans;
  }
  function repeatStr(item, count) {
      var ans = "";
      while (count-- > 0)
          { ans += item; }
      return ans;
  }
  /**
   * Visit element nodes and their children
   */
  function visitElements(seeds, handler) {
      var queue = [seeds], tmp;
      while (tmp = queue.shift()) {
          for (var i = 0; i < tmp.length; i++) {
              var el = tmp[i];
              if (!el || el.nodeType != Node.ELEMENT_NODE)
                  { continue; }
              handler(el);
              if (el.children && el.children.length > 0)
                  { queue.push(el.children); }
          }
      }
  }
  /**
   * A lazy and simple Element size watcher. NOT WORK with animations
   */
  function watchSize(el, onChange, needPoll) {
      var ref = el.getBoundingClientRect();
      var width = ref.width;
      var height = ref.height;
      /** check size and trig onChange */
      var check = debounce(function () {
          var rect = el.getBoundingClientRect();
          var newWidth = rect.width;
          var newHeight = rect.height;
          if (width != newWidth || height != newHeight) {
              onChange(newWidth, newHeight, width, height);
              width = newWidth;
              height = newHeight;
              setTimeout(check, 200); // maybe changed again later?
          }
      }, 100);
      var nextTimer = null;
      function pollOnce() {
          if (nextTimer)
              { clearTimeout(nextTimer); }
          if (!stopped)
              { nextTimer = setTimeout(pollOnce, 200); }
          check();
      }
      var stopped = false;
      function stop() {
          stopped = true;
          check.stop();
          if (nextTimer) {
              clearTimeout(nextTimer);
              nextTimer = null;
          }
          for (var i = 0; i < eventBinded.length; i++) {
              eventBinded[i][0].removeEventListener(eventBinded[i][1], check, false);
          }
      }
      var eventBinded = [];
      function bindEvents(el) {
          var tagName = el.tagName;
          var computedStyle = getComputedStyle(el);
          var getStyle = function (name) { return (computedStyle.getPropertyValue(name) || ''); };
          if (getStyle("resize") != 'none')
              { needPoll = true; }
          // size changes if loaded
          if (/^(?:img|video)$/i.test(tagName)) {
              el.addEventListener('load', check, false);
              el.addEventListener('error', check, false);
          }
          else if (/^(?:details|summary)$/i.test(tagName)) {
              el.addEventListener('click', check, false);
          }
      }
      if (!needPoll)
          { visitElements([el], bindEvents); }
      // bindEvents will update `needPoll`
      if (needPoll)
          { nextTimer = setTimeout(pollOnce, 200); }
      return {
          check: check,
          stop: stop,
      };
  }
  function makeSymbol(name) {
      if (typeof Symbol === 'function')
          { return Symbol(name); }
      return "_\n" + name + "\n_" + Math.floor(Math.random() * 0xFFFF).toString(16);
  }

  /**
   * Ready-to-use functions that powers up your Markdown editor
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */
  // if (HyperMD_Mark in editor), the editor was a HyperMD mode at least once
  var HyperMD_Mark = '__hypermd__';
  /**
   * The default configuration that used by `HyperMD.fromTextArea`
   *
   * Addons may update this object freely!
   */
  var suggestedEditorConfig = {
      lineNumbers: true,
      lineWrapping: true,
      theme: "hypermd-light",
      mode: "text/x-hypermd",
      tabSize: 4,
      autoCloseBrackets: true,
      foldGutter: true,
      gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "HyperMD-goback" // (addon: click) 'back' button for footnotes
      ],
  };
  /**
   * Editor Options that disable HyperMD WYSIWYG visual effects.
   * These option will be applied when user invoke `switchToNormal`.
   *
   * Addons about visual effects, shall update this object!
   */
  var normalVisualConfig = {
      theme: "default",
  };
  /**
   * Initialize an editor from a <textarea>
   * Calling `CodeMirror.fromTextArea` with recommended HyperMD options
   *
   * @see CodeMirror.fromTextArea
   *
   * @param {HTMLTextAreaElement} textArea
   * @param {object} [config]
   * @returns {cm_t}
   */
  function fromTextArea(textArea, config) {
      var final_config = Object.assign({}, suggestedEditorConfig, config);
      var cm = CodeMirror.fromTextArea(textArea, final_config);
      cm[HyperMD_Mark] = true;
      return cm;
  }
  function switchToNormal(editor, options_or_theme) {
      // this CodeMirror editor has never been in HyperMD mode. `switchToNormal` is meanless
      if (!editor[HyperMD_Mark])
          { return; }
      if (typeof options_or_theme === 'string')
          { options_or_theme = { theme: options_or_theme }; }
      var opt = Object.assign({}, normalVisualConfig, options_or_theme);
      for (var key in opt) {
          editor.setOption(key, opt[key]);
      }
  }
  function switchToHyperMD(editor, options_or_theme) {
      if (typeof options_or_theme === 'string')
          { options_or_theme = { theme: options_or_theme }; }
      var opt = {};
      if (HyperMD_Mark in editor) {
          // has been HyperMD mode once. Only modify visual-related options
          for (var key in normalVisualConfig) {
              opt[key] = suggestedEditorConfig[key];
          }
          Object.assign(opt, options_or_theme);
      }
      else {
          // this CodeMirror editor is new to HyperMD
          Object.assign(opt, suggestedEditorConfig, options_or_theme);
          editor[HyperMD_Mark] = true;
      }
      for (var key$1 in opt) {
          editor.setOption(key$1, opt[key$1]);
      }
  }

  /**
    @internal DO NOT IMPORT THIS MODULE!
              If you want to use this module, import it from `core`:

                  import { cm_internal } from "../core"

    The following few functions are from CodeMirror's source code.

    MIT License

    Copyright (C) 2017 by Marijn Haverbeke <marijnh@gmail.com> and others

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    */
  /**
   * Find the view element corresponding to a given line. Return null when the line isn't visible.
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   * @param n lineNo
   */
  function findViewIndex(cm, n) {
      if (n >= cm.display.viewTo)
          { return null; }
      n -= cm.display.viewFrom;
      if (n < 0)
          { return null; }
      var view = cm.display.view;
      for (var i = 0; i < view.length; i++) {
          n -= view[i].size;
          if (n < 0)
              { return i; }
      }
  }
  /**
   * Find a line view that corresponds to the given line number.
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   */
  function findViewForLine(cm, lineN) {
      if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
          { return cm.display.view[findViewIndex(cm, lineN)]; }
      var ext = cm.display.externalMeasured;
      if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
          { return ext; }
  }
  /**
   * Find a line map (mapping character offsets to text nodes) and a
   * measurement cache for the given line number. (A line view might
   * contain multiple lines when collapsed ranges are present.)
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   */
  function mapFromLineView(lineView, line, lineN) {
      if (lineView.line == line)
          { return { map: lineView.measure.map, cache: lineView.measure.cache, before: false }; }
      for (var i = 0; i < lineView.rest.length; i++)
          { if (lineView.rest[i] == line)
              { return { map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: false }; } }
      for (var i$1 = 0; i$1 < lineView.rest.length; i$1++)
          { if (lineView.rest[i$1].lineNo() > lineN)
              { return { map: lineView.measure.maps[i$1], cache: lineView.measure.caches[i$1], before: true }; } }
  }

  var cm_internal = /*#__PURE__*/Object.freeze({
    findViewIndex: findViewIndex,
    findViewForLine: findViewForLine,
    mapFromLineView: mapFromLineView
  });

  /**
   * CodeMirror-related utils
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */
  /**
   * Useful tool to seek for tokens
   *
   *     var seeker = new TokenSeeker(cm)
   *     seeker.setPos(0, 0) // set to line 0, char 0
   *     var ans = seeker.findNext(/fomratting-em/)
   *
   */
  var TokenSeeker = function(cm) {
      this.cm = cm;
  };
  TokenSeeker.prototype.findNext = function (condition, varg, since) {
      var lineNo = this.lineNo;
      var tokens = this.lineTokens;
      var token = null;
      var i_token = this.i_token + 1;
      var maySpanLines = false;
      if (varg === true) {
          maySpanLines = true;
      }
      else if (typeof varg === 'number') {
          i_token = varg;
      }
      if (since) {
          if (since.line > lineNo) {
              i_token = tokens.length; // just ignore current line
          }
          else if (since.line < lineNo) ;
          else {
              for (; i_token < tokens.length; i_token++) {
                  if (tokens[i_token].start >= since.ch)
                      { break; }
              }
          }
      }
      for (; i_token < tokens.length; i_token++) {
          var token_tmp = tokens[i_token];
          if ((typeof condition === "function") ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
              token = token_tmp;
              break;
          }
      }
      if (!token && maySpanLines) {
          var cm = this.cm;
          var startLine = Math.max(since ? since.line : 0, lineNo + 1);
          cm.eachLine(startLine, cm.lastLine() + 1, function (line_i) {
              lineNo = line_i.lineNo();
              tokens = cm.getLineTokens(lineNo);
              i_token = 0;
              if (since && lineNo === since.line) {
                  for (; i_token < tokens.length; i_token++) {
                      if (tokens[i_token].start >= since.ch)
                          { break; }
                  }
              }
              for (; i_token < tokens.length; i_token++) {
                  var token_tmp = tokens[i_token];
                  if ((typeof condition === "function") ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                      token = token_tmp;
                      return true; // stop `eachLine`
                  }
              }
          });
      }
      return token ? { lineNo: lineNo, token: token, i_token: i_token } : null;
  };
  TokenSeeker.prototype.findPrev = function (condition, varg, since) {
      var lineNo = this.lineNo;
      var tokens = this.lineTokens;
      var token = null;
      var i_token = this.i_token - 1;
      var maySpanLines = false;
      if (varg === true) {
          maySpanLines = true;
      }
      else if (typeof varg === 'number') {
          i_token = varg;
      }
      if (since) {
          if (since.line < lineNo) {
              i_token = -1; // just ignore current line
          }
          else if (since.line > lineNo) ;
          else {
              for (; i_token < tokens.length; i_token++) {
                  if (tokens[i_token].start >= since.ch)
                      { break; }
              }
          }
      }
      if (i_token >= tokens.length)
          { i_token = tokens.length - 1; }
      for (; i_token >= 0; i_token--) {
          var token_tmp = tokens[i_token];
          if ((typeof condition === "function") ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
              token = token_tmp;
              break;
          }
      }
      if (!token && maySpanLines) {
          var cm = this.cm;
          var startLine = Math.min(since ? since.line : cm.lastLine(), lineNo - 1);
          var endLine = cm.firstLine();
          // cm.eachLine doesn't support reversed searching
          // use while... loop to iterate
          lineNo = startLine + 1;
          while (!token && endLine <= --lineNo) {
              var line_i = cm.getLineHandle(lineNo);
              tokens = cm.getLineTokens(lineNo);
              i_token = 0;
              if (since && lineNo === since.line) {
                  for (; i_token < tokens.length; i_token++) {
                      if (tokens[i_token].start >= since.ch)
                          { break; }
                  }
              }
              if (i_token >= tokens.length)
                  { i_token = tokens.length - 1; }
              for (; i_token >= 0; i_token--) {
                  var token_tmp = tokens[i_token];
                  if ((typeof condition === "function") ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                      token = token_tmp;
                      break; // FOUND token !
                  }
              }
          }
      }
      return token ? { lineNo: lineNo, token: token, i_token: i_token } : null;
  };
  /**
   * return a range in which every token has the same style, or meet same condition
   */
  TokenSeeker.prototype.expandRange = function (style, maySpanLines) {
      var cm = this.cm;
      var isStyled;
      if (typeof style === "function") {
          isStyled = style;
      }
      else {
          if (typeof style === "string")
              { style = new RegExp("(?:^|\\s)" + style + "(?:\\s|$)"); }
          isStyled = function (token) { return (token ? style.test(token.type || "") : false); };
      }
      var from = {
          lineNo: this.lineNo,
          i_token: this.i_token,
          token: this.lineTokens[this.i_token]
      };
      var to = Object.assign({}, from);
      // find left
      var foundUnstyled = false, tokens = this.lineTokens, i = this.i_token;
      while (!foundUnstyled) {
          if (i >= tokens.length)
              { i = tokens.length - 1; }
          for (; i >= 0; i--) {
              var token = tokens[i];
              if (!isStyled(token, tokens, i)) {
                  foundUnstyled = true;
                  break;
              }
              else {
                  from.i_token = i;
                  from.token = token;
              }
          }
          if (foundUnstyled || !(maySpanLines && from.lineNo > cm.firstLine()))
              { break; } // found, or no more lines
          tokens = cm.getLineTokens(--from.lineNo);
          i = tokens.length - 1;
      }
      // find right
      var foundUnstyled = false, tokens = this.lineTokens, i = this.i_token;
      while (!foundUnstyled) {
          if (i < 0)
              { i = 0; }
          for (; i < tokens.length; i++) {
              var token$1 = tokens[i];
              if (!isStyled(token$1, tokens, i)) {
                  foundUnstyled = true;
                  break;
              }
              else {
                  to.i_token = i;
                  to.token = token$1;
              }
          }
          if (foundUnstyled || !(maySpanLines && to.lineNo < cm.lastLine()))
              { break; } // found, or no more lines
          tokens = cm.getLineTokens(++to.lineNo);
          i = 0;
      }
      return { from: from, to: to };
  };
  TokenSeeker.prototype.setPos = function (line, ch, precise) {
      if (ch === void 0) {
          ch = line;
          line = this.line;
      }
      else if (typeof line === 'number')
          { line = this.cm.getLineHandle(line); }
      var sameLine = line === this.line;
      var i_token = 0;
      if (precise || !sameLine) {
          this.line = line;
          this.lineNo = line.lineNo();
          this.lineTokens = this.cm.getLineTokens(this.lineNo);
      }
      else {
          // try to speed-up seeking
          i_token = this.i_token;
          var token = this.lineTokens[i_token];
          if (token.start > ch)
              { i_token = 0; }
      }
      var tokens = this.lineTokens;
      for (; i_token < tokens.length; i_token++) {
          if (tokens[i_token].end > ch)
              { break; } // found
      }
      this.i_token = i_token;
  };
  /** get (current or idx-th) token */
  TokenSeeker.prototype.getToken = function (idx) {
      if (typeof idx !== 'number')
          { idx = this.i_token; }
      return this.lineTokens[idx];
  };
  /** get (current or idx-th) token type. always return a string */
  TokenSeeker.prototype.getTokenType = function (idx) {
      if (typeof idx !== 'number')
          { idx = this.i_token; }
      var t = this.lineTokens[idx];
      return t && t.type || "";
  };
  /**
   * CodeMirror's `getLineTokens` might merge adjacent chars with same styles,
   * but this one won't.
   *
   * This one will consume more memory.
   *
   * @param {CodeMirror.LineHandle} line
   * @returns {string[]} every char's style
   */
  function getEveryCharToken(line) {
      var ans = new Array(line.text.length);
      var ss = line.styles;
      var i = 0;
      if (ss) {
          // CodeMirror already parsed this line. Use cache
          for (var j = 1; j < ss.length; j += 2) {
              var i_to = ss[j], s = ss[j + 1];
              while (i < i_to)
                  { ans[i++] = s; }
          }
      }
      else {
          // Emmm... slow method
          var cm = line.parent.cm || line.parent.parent.cm || line.parent.parent.parent.cm;
          var ss$1 = cm.getLineTokens(line.lineNo());
          for (var j$1 = 0; j$1 < ss$1.length; j$1++) {
              var i_to$1 = ss$1[j$1].end, s$1 = ss$1[j$1].type;
              while (i < i_to$1)
                  { ans[i++] = s$1; }
          }
      }
      return ans;
  }
  /**
   * return a range in which every char has the given style (aka. token type).
   * assuming char at `pos` already has the style.
   *
   * the result will NOT span lines.
   *
   * @param style aka. token type
   * @see TokenSeeker if you want to span lines
   */
  function expandRange(cm, pos, style) {
      var line = pos.line;
      var from = { line: line, ch: 0 };
      var to = { line: line, ch: pos.ch };
      var styleFn = typeof style === "function" ? style : false;
      var styleRE = (!styleFn) && new RegExp("(?:^|\\s)" + style + "(?:\\s|$)");
      var tokens = cm.getLineTokens(line);
      var iSince;
      for (iSince = 0; iSince < tokens.length; iSince++) {
          if (tokens[iSince].end >= pos.ch)
              { break; }
      }
      if (iSince === tokens.length)
          { return null; }
      for (var i = iSince; i < tokens.length; i++) {
          var token = tokens[i];
          if (styleFn ? styleFn(token) : styleRE.test(token.type))
              { to.ch = token.end; }
          else
              { break; }
      }
      for (var i = iSince; i >= 0; i--) {
          var token = tokens[i];
          if (!(styleFn ? styleFn(token) : styleRE.test(token.type))) {
              from.ch = token.end;
              break;
          }
      }
      return { from: from, to: to };
  }
  /**
   * Get ordered range from `CodeMirror.Range`-like object or `[Position, Position]`
   *
   * In an ordered range, The first `Position` must NOT be after the second.
   */
  function orderedRange(range) {
      if ('anchor' in range)
          { range = [range.head, range.anchor]; }
      if (CodeMirror.cmpPos(range[0], range[1]) > 0)
          { return [range[1], range[0]]; }
      else
          { return [range[0], range[1]]; }
  }
  /**
   * Check if two range has intersection.
   *
   * @param range1 ordered range 1  (start <= end)
   * @param range2 ordered range 2  (start <= end)
   */
  function rangesIntersect(range1, range2) {
      var from1 = range1[0];
      var to1 = range1[1];
      var from2 = range2[0];
      var to2 = range2[1];
      return !(CodeMirror.cmpPos(to1, from2) < 0 || CodeMirror.cmpPos(from1, to2) > 0);
  }

  /**
   * Post-process CodeMirror-mode-parsed lines, find the ranges
   *
   * for example, a parsed line `[**Hello** World](xxx.txt)` will gives you:
   *
   * 1. link from `[` to `)`
   * 2. bold text from `**` to another `**`
   */
  var LineSpanExtractor = function(cm) {
      var this$1 = this;

      this.cm = cm;
      this.caches = new Array(); // cache for each lines
      cm.on("change", function (cm, change) {
          var line = change.from.line;
          if (this$1.caches.length > line)
              { this$1.caches.splice(line); }
      });
  };
  LineSpanExtractor.prototype.getTokenTypes = function (token, prevToken) {
      var prevState = prevToken ? prevToken.state : {};
      var state = token.state;
      var styles = ' ' + token.type + ' ';
      var ans = {
          // em
          em: (state.em ? 1 /* IS_THIS_TYPE */
              : prevState.em ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
          // strikethrough
          strikethrough: (state.strikethrough ? 1 /* IS_THIS_TYPE */
              : prevState.strikethrough ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
          // strong
          strong: (state.strong ? 1 /* IS_THIS_TYPE */
              : prevState.strong ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
          // code
          code: (state.code ? 1 /* IS_THIS_TYPE */
              : prevState.code ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
          // linkText
          linkText: (state.linkText ?
              (state.hmdLinkType === 3 /* NORMAL */ || state.hmdLinkType === 6 /* BARELINK2 */ ? 1 /* IS_THIS_TYPE */ : 0 /* NOTHING */) :
              (prevState.linkText ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */)),
          // linkHref
          linkHref: ((state.linkHref && !state.linkText) ?
              1 /* IS_THIS_TYPE */ :
              (!state.linkHref && !state.linkText && prevState.linkHref && !prevState.linkText) ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
          // task checkbox
          task: (styles.indexOf(' formatting-task ') !== -1)
              ? (1 /* IS_THIS_TYPE */ | 2 /* LEAVING_THIS_TYPE */)
              : (0 /* NOTHING */),
          // hashtag
          hashtag: (state.hmdHashtag ? 1 /* IS_THIS_TYPE */ :
              prevState.hmdHashtag ? 2 /* LEAVING_THIS_TYPE */ : 0 /* NOTHING */),
      };
      return ans;
  };
  /** get spans from a line and update the cache */
  LineSpanExtractor.prototype.extract = function (lineNo, precise) {
      if (!precise) { // maybe cache is valid?
          var cc = this.caches[lineNo];
          if (cc)
              { return cc; }
      }
      var tokens = this.cm.getLineTokens(lineNo);
      var lineText = this.cm.getLine(lineNo);
      var lineLength = lineText.length;
      var ans = [];
      var unclosed = {};
      for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];
          var types = this.getTokenTypes(token, tokens[i - 1]);
          for (var type in types) {
              var span = unclosed[type];
              if (types[type] & 1 /* IS_THIS_TYPE */) { // style is active
                  if (!span) { // create a new span if needed
                      span = {
                          type: type,
                          begin: token.start,
                          end: lineLength,
                          head: token,
                          head_i: i,
                          tail: tokens[tokens.length - 1],
                          tail_i: tokens.length - 1,
                          text: lineText.slice(token.start),
                      };
                      ans.push(span);
                      unclosed[type] = span;
                  }
              }
              if (types[type] & 2 /* LEAVING_THIS_TYPE */) { // a style is exiting
                  if (span) { // close an unclosed span
                      span.tail = token;
                      span.tail_i = i;
                      span.end = token.end;
                      span.text = span.text.slice(0, span.end - span.begin);
                      unclosed[type] = null;
                  }
              }
          }
      }
      this.caches[lineNo] = ans;
      return ans;
  };
  LineSpanExtractor.prototype.findSpansAt = function (pos) {
      var spans = this.extract(pos.line);
      var ch = pos.ch;
      var ans = [];
      for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (span.begin > ch)
              { break; }
          if (ch >= span.begin && span.end >= ch)
              { ans.push(span); }
      }
      return ans;
  };
  LineSpanExtractor.prototype.findSpanWithTypeAt = function (pos, type) {
      var spans = this.extract(pos.line);
      var ch = pos.ch;
      for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (span.begin > ch)
              { break; }
          if (ch >= span.begin && span.end >= ch && span.type === type)
              { return span; }
      }
      return null;
  };
  var extractor_symbol = makeSymbol("LineSpanExtractor");
  /**
   * Get a `LineSpanExtractor` to extract spans from CodeMirror parsed lines
   *
   * for example, a parsed line `[**Hello** World](xxx.txt)` will gives you:
   *
   * 1. link from `[` to `)`
   * 2. bold text from `**` to another `**`
   */
  function getLineSpanExtractor(cm) {
      if (extractor_symbol in cm)
          { return cm[extractor_symbol]; }
      var inst = cm[extractor_symbol] = new LineSpanExtractor(cm);
      return inst;
  }

  /**
   * Utils for HyperMD addons
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */
  var Addon = function(cm) { };
  /** make a Singleton getter */
  function Getter(name, ClassCtor, defaultOption) {
      return function (cm) {
          if (!cm.hmd)
              { cm.hmd = {}; }
          if (!cm.hmd[name]) {
              var inst = new ClassCtor(cm);
              cm.hmd[name] = inst;
              if (defaultOption) {
                  for (var k in defaultOption)
                      { inst[k] = defaultOption[k]; }
              }
              return inst;
          }
          return cm.hmd[name];
      };
  }

  var addon = /*#__PURE__*/Object.freeze({
    Addon: Addon,
    Getter: Getter
  });

  // CodeMirror, copyright (c) by laobubu
  /**
   * Markdown Extension Tokens
   *
   * - `$` Maybe a LaTeX
   * - `|` Maybe a Table Col Separator
   */
  var tokenBreakRE = /[^\\][$|]/;
  var listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/;
  var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i; // from CodeMirror/mode/gfm
  var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var url2RE = /^\.{0,2}\/[^\>\s]+/;
  var hashtagRE = /^(?:[-()/a-zA-Z0-9ァ-ヺー-ヾｦ-ﾟｰ０-９Ａ-Ｚａ-ｚぁ-ゖ゙-ゞー々ぁ-んァ-ヾ一-\u9FEF㐀-䶵﨎﨏﨑﨓﨔﨟﨡﨣﨤﨧-﨩]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+/;
  var SimpleTableRE = /^\s*[^\|].*?\|.*[^|]\s*$/;
  var SimpleTableLooseRE = /^\s*[^\|].*\|/; // unfinished | row
  var NormalTableRE = /^\s*\|[^\|]+\|.+\|\s*$/;
  var NormalTableLooseRE = /^\s*\|/; // | unfinished row
  var linkStyle = {};
  linkStyle[1 /* BARELINK */] = "hmd-barelink";
  linkStyle[6 /* BARELINK2 */] = "hmd-barelink2";
  linkStyle[2 /* FOOTREF */] = "hmd-barelink hmd-footref";
  linkStyle[4 /* FOOTNOTE */] = "hmd-footnote line-HyperMD-footnote";
  linkStyle[7 /* FOOTREF2 */] = "hmd-footref2";
  function resetTable(state) {
      state.hmdTable = 0 /* NONE */;
      state.hmdTableColumns = [];
      state.hmdTableID = null;
      state.hmdTableCol = state.hmdTableRow = 0;
  }
  var listInQuoteRE = /^\s+((\d+[).]|[-*+])\s+)?/;
  var defaultTokenTypeOverrides = {
      hr: "line-HyperMD-hr line-background-HyperMD-hr-bg hr",
      // HyperMD needs to know the level of header/indent. using tokenTypeOverrides is not enough
      // header: "line-HyperMD-header header",
      // quote: "line-HyperMD-quote quote",
      // Note: there are some list related process below
      list1: "list-1",
      list2: "list-2",
      list3: "list-3",
      code: "inline-code",
      hashtag: "hashtag meta",
  };
  CodeMirror.defineMode("hypermd", function (cmCfg, modeCfgUser) {
      var modeCfg = {
          front_matter: true,
          math: true,
          table: true,
          toc: true,
          orgModeMarkup: true,
          hashtag: false,
          fencedCodeBlockHighlighting: true,
          name: "markdown",
          highlightFormatting: true,
          taskLists: true,
          strikethrough: true,
          emoji: true,
          /** @see defaultTokenTypeOverrides */
          tokenTypeOverrides: defaultTokenTypeOverrides,
      };
      Object.assign(modeCfg, modeCfgUser);
      if (modeCfg.tokenTypeOverrides !== defaultTokenTypeOverrides) {
          modeCfg.tokenTypeOverrides = Object.assign({}, defaultTokenTypeOverrides, modeCfg.tokenTypeOverrides);
      }
      modeCfg["name"] = "markdown";
      /** functions from CodeMirror Markdown mode closure. Only for status checking */
      var rawClosure = {
          htmlBlock: null,
      };
      var rawMode = CodeMirror.getMode(cmCfg, modeCfg);
      var newMode = Object.assign({}, rawMode);
      newMode.startState = function () {
          var ans = rawMode.startState();
          resetTable(ans);
          ans.hmdOverride = null;
          ans.hmdInnerExitChecker = null;
          ans.hmdInnerMode = null;
          ans.hmdLinkType = 0 /* NONE */;
          ans.hmdNextMaybe = modeCfg.front_matter ? 1 /* FRONT_MATTER */ : 0 /* NONE */;
          ans.hmdNextState = null;
          ans.hmdNextStyle = null;
          ans.hmdNextPos = null;
          ans.hmdHashtag = 0 /* NONE */;
          return ans;
      };
      newMode.copyState = function (s) {
          var ans = rawMode.copyState(s);
          var keys = [
              "hmdLinkType", "hmdNextMaybe",
              "hmdTable", "hmdTableID", "hmdTableCol", "hmdTableRow",
              "hmdOverride",
              "hmdInnerMode", "hmdInnerStyle", "hmdInnerExitChecker",
              "hmdNextPos", "hmdNextState", "hmdNextStyle",
              "hmdHashtag" ];
          for (var i = 0, list = keys; i < list.length; i += 1)
              {
              var key = list[i];

              ans[key] = s[key];
          }
          ans.hmdTableColumns = s.hmdTableColumns.slice(0);
          if (s.hmdInnerMode)
              { ans.hmdInnerState = CodeMirror.copyState(s.hmdInnerMode, s.hmdInnerState); }
          return ans;
      };
      newMode.blankLine = function (state) {
          var ans;
          var innerMode = state.hmdInnerMode;
          if (innerMode) {
              if (innerMode.blankLine)
                  { ans = innerMode.blankLine(state.hmdInnerState); }
          }
          else {
              ans = rawMode.blankLine(state);
          }
          if (!ans)
              { ans = ""; }
          if (state.code === -1) {
              ans += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg";
          }
          resetTable(state);
          return ans.trim() || null;
      };
      newMode.indent = function (state, textAfter) {
          var mode = state.hmdInnerMode || rawMode;
          var f = mode.indent;
          if (typeof f === 'function')
              { return f.apply(mode, arguments); }
          return CodeMirror.Pass;
      };
      newMode.innerMode = function (state) {
          if (state.hmdInnerMode)
              { return { mode: state.hmdInnerMode, state: state.hmdInnerState }; }
          return rawMode.innerMode(state);
      };
      newMode.token = function (stream, state) {
          if (state.hmdOverride)
              { return state.hmdOverride(stream, state); }
          if (state.hmdNextMaybe === 1 /* FRONT_MATTER */) { // Only appears once for each Doc
              if (stream.string === '---') {
                  state.hmdNextMaybe = 2 /* FRONT_MATTER_END */;
                  return enterMode(stream, state, "yaml", {
                      style: "hmd-frontmatter",
                      fallbackMode: function () { return createDummyMode("---"); },
                      exitChecker: function (stream, state) {
                          if (stream.string === '---') {
                              // found the endline of front_matter
                              state.hmdNextMaybe = 0 /* NONE */;
                              return { endPos: 3 };
                          }
                          else {
                              return null;
                          }
                      }
                  });
              }
              else {
                  state.hmdNextMaybe = 0 /* NONE */;
              }
          }
          var wasInHTML = (state.f === rawClosure.htmlBlock);
          var wasInCodeFence = state.code === -1;
          var bol = stream.start === 0;
          var wasLinkText = state.linkText;
          var wasLinkHref = state.linkHref;
          var inMarkdown = !(wasInCodeFence || wasInHTML);
          var inMarkdownInline = inMarkdown && !(state.code || state.indentedCode || state.linkHref);
          var ans = "";
          var tmp;
          if (inMarkdown) {
              // now implement some extra features that require higher priority than CodeMirror's markdown
              //#region Math
              if (modeCfg.math && inMarkdownInline && (tmp = stream.match(/^\${1,2}/, false))) {
                  var endTag = tmp[0];
                  var mathLevel = endTag.length;
                  if (mathLevel === 2 || stream.string.slice(stream.pos).match(/[^\\]\$/)) {
                      // $$ may span lines, $ must be paired
                      var texMode = CodeMirror.getMode(cmCfg, {
                          name: "stex",
                      });
                      var noTexMode = texMode['name'] !== 'stex';
                      ans += enterMode(stream, state, texMode, {
                          style: "math",
                          skipFirstToken: noTexMode,
                          fallbackMode: function () { return createDummyMode(endTag); },
                          exitChecker: createSimpleInnerModeExitChecker(endTag, {
                              style: "formatting formatting-math formatting-math-end math-" + mathLevel
                          })
                      });
                      if (noTexMode)
                          { stream.pos += tmp[0].length; }
                      ans += " formatting formatting-math formatting-math-begin math-" + mathLevel;
                      return ans;
                  }
              }
              //#endregion
              //#region [OrgMode] markup
              if (bol && modeCfg.orgModeMarkup && (tmp = stream.match(/^\#\+(\w+\:?)\s*/))) {
                  // Support #+TITLE: This is the title of the document
                  if (!stream.eol()) {
                      state.hmdOverride = function (stream, state) {
                          stream.skipToEnd();
                          state.hmdOverride = null;
                          return "string hmd-orgmode-markup";
                      };
                  }
                  return "meta formatting-hmd-orgmode-markup hmd-orgmode-markup line-HyperMD-orgmode-markup";
              }
              //#endregion
              //#region [TOC] in a single line
              if (bol && modeCfg.toc && stream.match(/^\[TOCM?\]\s*$/i)) {
                  return "meta line-HyperMD-toc hmd-toc";
              }
              //#endregion
              //#region Extra markdown inline extenson
              if (inMarkdownInline) {
                  // transform unformatted URL into link
                  if (!state.hmdLinkType && (stream.match(urlRE) || stream.match(emailRE))) {
                      return "url";
                  }
              }
              //#endregion
          }
          // now enter markdown
          if (state.hmdNextState) {
              stream.pos = state.hmdNextPos;
              ans += " " + (state.hmdNextStyle || "");
              Object.assign(state, state.hmdNextState);
              state.hmdNextState = null;
              state.hmdNextStyle = null;
              state.hmdNextPos = null;
          }
          else {
              ans += " " + (rawMode.token(stream, state) || "");
          }
          // add extra styles
          if (state.hmdHashtag !== 0 /* NONE */) {
              ans += " " + modeCfg.tokenTypeOverrides.hashtag;
          }
          /** Try to capture some internal functions from CodeMirror Markdown mode closure! */
          if (!rawClosure.htmlBlock && state.htmlState)
              { rawClosure.htmlBlock = state.f; }
          var inHTML = (state.f === rawClosure.htmlBlock);
          var inCodeFence = state.code === -1;
          inMarkdown = inMarkdown && !(inHTML || inCodeFence);
          inMarkdownInline = inMarkdownInline && inMarkdown && !(state.code || state.indentedCode || state.linkHref);
          // If find a markdown extension token (which is not escaped),
          // break current parsed string into two parts and the first char of next part is the markdown extension token
          if (inMarkdownInline && (tmp = stream.current().match(tokenBreakRE))) {
              stream.pos = stream.start + tmp.index + 1; // rewind
          }
          var current = stream.current();
          if (inHTML != wasInHTML) {
              if (inHTML) {
                  ans += " hmd-html-begin";
                  rawClosure.htmlBlock = state.f;
              }
              else {
                  ans += " hmd-html-end";
              }
          }
          if (wasInCodeFence || inCodeFence) {
              if (!state.localMode || !wasInCodeFence)
                  { ans = ans.replace("inline-code", ""); }
              ans += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg";
              if (inCodeFence !== wasInCodeFence) {
                  if (!inCodeFence)
                      { ans += " line-HyperMD-codeblock-end line-background-HyperMD-codeblock-end-bg"; }
                  else if (!wasInCodeFence)
                      { ans += " line-HyperMD-codeblock-begin line-background-HyperMD-codeblock-begin-bg"; }
              }
          }
          if (inMarkdown) {
              var tableType = state.hmdTable;
              //#region [Table] Reset
              if (bol && tableType) {
                  var rowRE = (tableType == 1 /* SIMPLE */) ? SimpleTableLooseRE : NormalTableLooseRE;
                  if (rowRE.test(stream.string)) {
                      // still in table
                      state.hmdTableCol = 0;
                      state.hmdTableRow++;
                  }
                  else {
                      // end of a table
                      resetTable(state);
                  }
              }
              //#endregion
              //#region Header, indentedCode, quote
              if (bol && state.header) {
                  if (/^(?:---+|===+)\s*$/.test(stream.string) && state.prevLine && state.prevLine.header) {
                      ans += " line-HyperMD-header-line line-HyperMD-header-line-" + state.header;
                  }
                  else {
                      ans += " line-HyperMD-header line-HyperMD-header-" + state.header;
                  }
              }
              if (state.indentedCode) {
                  ans += " hmd-indented-code";
              }
              if (state.quote) {
                  // mess up as less as possible
                  if (stream.eol()) {
                      ans += " line-HyperMD-quote line-HyperMD-quote-" + state.quote;
                      if (!/^ {0,3}\>/.test(stream.string))
                          { ans += " line-HyperMD-quote-lazy"; } // ">" is omitted
                  }
                  if (bol && (tmp = current.match(/^\s+/))) {
                      stream.pos = tmp[0].length; // rewind
                      ans += " hmd-indent-in-quote";
                      return ans.trim();
                  }
                  // make indentation (and potential list bullet) monospaced
                  if (/^>\s+$/.test(current) && stream.peek() != ">") {
                      stream.pos = stream.start + 1; // rewind!
                      current = ">";
                      state.hmdOverride = function (stream, state) {
                          stream.match(listInQuoteRE);
                          state.hmdOverride = null;
                          return "hmd-indent-in-quote line-HyperMD-quote line-HyperMD-quote-" + state.quote;
                      };
                  }
              }
              //#endregion
              //#region List
              var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;
              var tokenIsIndent = bol && /^\s+$/.test(current) && (state.list !== false || stream.indentation() <= maxNonCodeIndentation);
              var tokenIsListBullet = state.list && /formatting-list/.test(ans);
              if (tokenIsListBullet || (tokenIsIndent && (state.list !== false || stream.match(listRE, false)))) {
                  var listLevel = state.listStack && state.listStack.length || 0;
                  if (tokenIsIndent) {
                      if (stream.match(listRE, false)) { // next token is 1. 2. or bullet
                          if (state.list === false)
                              { listLevel++; }
                      }
                      else {
                          while (listLevel > 0 && stream.pos < state.listStack[listLevel - 1]) {
                              listLevel--; // find the real indent level
                          }
                          if (!listLevel) { // not even a list
                              return ans.trim() || null;
                          }
                          ans += " line-HyperMD-list-line-nobullet line-HyperMD-list-line line-HyperMD-list-line-" + listLevel;
                      }
                      ans += " hmd-list-indent hmd-list-indent-" + listLevel;
                  }
                  else if (tokenIsListBullet) {
                      // no space before bullet!
                      ans += " line-HyperMD-list-line line-HyperMD-list-line-" + listLevel;
                  }
              }
              //#endregion
              //#region Link, BareLink, Footnote etc
              if (wasLinkText !== state.linkText) {
                  if (!wasLinkText) {
                      // entering a link
                      tmp = stream.match(/^([^\]]+)\](\(| ?\[|\:)?/, false);
                      if (!tmp) { // maybe met a line-break in link text?
                          state.hmdLinkType = 1 /* BARELINK */;
                      }
                      else if (!tmp[2]) { // barelink
                          if (tmp[1].charAt(0) === "^") {
                              state.hmdLinkType = 2 /* FOOTREF */;
                          }
                          else {
                              state.hmdLinkType = 1 /* BARELINK */;
                          }
                      }
                      else if (tmp[2] === ":") { // footnote
                          state.hmdLinkType = 4 /* FOOTNOTE */;
                      }
                      else if ((tmp[2] === "[" || tmp[2] === " [") && stream.string.charAt(stream.pos + tmp[0].length) === "]") { // [barelink2][]
                          state.hmdLinkType = 6 /* BARELINK2 */;
                      }
                      else {
                          state.hmdLinkType = 3 /* NORMAL */;
                      }
                  }
                  else {
                      // leaving a link
                      if (state.hmdLinkType in linkStyle)
                          { ans += " " + linkStyle[state.hmdLinkType]; }
                      if (state.hmdLinkType === 4 /* FOOTNOTE */) {
                          state.hmdLinkType = 5 /* MAYBE_FOOTNOTE_URL */;
                      }
                      else {
                          state.hmdLinkType = 0 /* NONE */;
                      }
                  }
              }
              if (wasLinkHref !== state.linkHref) {
                  if (!wasLinkHref) {
                      // [link][doc] the [doc] part
                      if (current === "[" && stream.peek() !== "]") {
                          state.hmdLinkType = 7 /* FOOTREF2 */;
                      }
                  }
                  else if (state.hmdLinkType) { // leaving a Href
                      ans += " " + linkStyle[state.hmdLinkType];
                      state.hmdLinkType = 0 /* NONE */;
                  }
              }
              if (state.hmdLinkType !== 0 /* NONE */) {
                  if (state.hmdLinkType in linkStyle)
                      { ans += " " + linkStyle[state.hmdLinkType]; }
                  if (state.hmdLinkType === 5 /* MAYBE_FOOTNOTE_URL */) {
                      if (!/^(?:\]\:)?\s*$/.test(current)) { // not spaces
                          if (urlRE.test(current) || url2RE.test(current))
                              { ans += " hmd-footnote-url"; }
                          else
                              { ans = ans.replace("string url", ""); }
                          state.hmdLinkType = 0 /* NONE */; // since then, can't be url anymore
                      }
                  }
              }
              //#endregion
              //#region start of an escaped char
              if (/formatting-escape/.test(ans) && current.length > 1) {
                  // CodeMirror merge backslash and escaped char into one token, which is not good
                  // Use hmdOverride to separate them
                  var escapedLength = current.length - 1;
                  var escapedCharStyle = ans.replace("formatting-escape", "escape") + " hmd-escape-char";
                  state.hmdOverride = function (stream, state) {
                      stream.pos += escapedLength;
                      state.hmdOverride = null;
                      return escapedCharStyle.trim();
                  };
                  ans += " hmd-escape-backslash";
                  stream.pos -= escapedLength;
                  return ans;
              }
              //#endregion
              //#region [Table] Creating Table and style Table Separators
              if (!ans.trim() && modeCfg.table) {
                  // string is unformatted
                  var isTableSep = false;
                  if (current.charAt(0) === "|") {
                      // is "|xxxxxx", separate "|" and "xxxxxx"
                      stream.pos = stream.start + 1; // rewind to end of "|"
                      current = "|";
                      isTableSep = true;
                  }
                  if (isTableSep) {
                      // if not inside a table, try to construct one
                      if (!tableType) {
                          // check 1: current line meet the table format
                          if (SimpleTableRE.test(stream.string))
                              { tableType = 1 /* SIMPLE */; }
                          else if (NormalTableRE.test(stream.string))
                              { tableType = 2 /* NORMAL */; }
                          // check 2: check every column's alignment style
                          var rowStyles;
                          if (tableType) {
                              var nextLine = stream.lookAhead(1);
                              if (tableType === 2 /* NORMAL */) {
                                  if (!NormalTableRE.test(nextLine)) {
                                      tableType = 0 /* NONE */;
                                  }
                                  else {
                                      // remove leading / tailing pipe char
                                      nextLine = nextLine.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
                                  }
                              }
                              else if (tableType === 1 /* SIMPLE */) {
                                  if (!SimpleTableRE.test(nextLine)) {
                                      tableType = 0 /* NONE */;
                                  }
                              }
                              if (tableType) {
                                  rowStyles = nextLine.split("|");
                                  for (var i = 0; i < rowStyles.length; i++) {
                                      var row = rowStyles[i];
                                      if (/^\s*--+\s*:\s*$/.test(row))
                                          { row = "right"; }
                                      else if (/^\s*:\s*--+\s*$/.test(row))
                                          { row = "left"; }
                                      else if (/^\s*:\s*--+\s*:\s*$/.test(row))
                                          { row = "center"; }
                                      else if (/^\s*--+\s*$/.test(row))
                                          { row = "default"; }
                                      else {
                                          // ouch, can't be a table
                                          tableType = 0 /* NONE */;
                                          break;
                                      }
                                      rowStyles[i] = row;
                                  }
                              }
                          }
                          // step 3: made it
                          if (tableType) {
                              // successfully made one
                              state.hmdTable = tableType;
                              state.hmdTableColumns = rowStyles;
                              state.hmdTableID = "T" + stream.lineOracle.line;
                              state.hmdTableRow = state.hmdTableCol = 0;
                          }
                      }
                      // then
                      if (tableType) {
                          var colUbound = state.hmdTableColumns.length - 1;
                          if (tableType === 2 /* NORMAL */ && ((state.hmdTableCol === 0 && /^\s*\|$/.test(stream.string.slice(0, stream.pos))) || stream.match(/^\s*$/, false))) {
                              ans += " hmd-table-sep hmd-table-sep-dummy";
                          }
                          else if (state.hmdTableCol < colUbound) {
                              var row$1 = state.hmdTableRow;
                              var col = state.hmdTableCol++;
                              if (col == 0) {
                                  ans += " line-HyperMD-table_" + (state.hmdTableID) + " line-HyperMD-table-" + tableType + " line-HyperMD-table-row line-HyperMD-table-row-" + row$1;
                              }
                              ans += " hmd-table-sep hmd-table-sep-" + col;
                          }
                      }
                  }
              }
              //#endregion
              if (tableType && state.hmdTableRow === 1) {
                  // fix a stupid problem:    :------: is not emoji
                  if (/emoji/.test(ans))
                      { ans = ""; }
              }
              //#region HTML Block
              //
              // See https://github.github.com/gfm/#html-blocks type3-5
              if (inMarkdownInline && current === '<') {
                  var endTag$1 = null;
                  if (stream.match(/^\![A-Z]+/))
                      { endTag$1 = ">"; }
                  else if (stream.match("?"))
                      { endTag$1 = "?>"; }
                  else if (stream.match("![CDATA["))
                      { endTag$1 = "]]>"; }
                  if (endTag$1 != null) {
                      return enterMode(stream, state, null, {
                          endTag: endTag$1,
                          style: (ans + " comment hmd-cdata-html").trim(),
                      });
                  }
              }
              //#endregion
              //#region Hashtag
              if (modeCfg.hashtag && inMarkdownInline) {
                  switch (state.hmdHashtag) {
                      case 0 /* NONE */:
                          if (current === '#' &&
                              !state.linkText && !state.image &&
                              (bol || /^\s*$/.test(stream.string.charAt(stream.start - 1)))) {
                              var escape_removed_str = stream.string.slice(stream.pos).replace(/\\./g, '');
                              if ((tmp = hashtagRE.exec(escape_removed_str))) {
                                  if (/^\d+$/.test(tmp[0]))
                                      { state.hmdHashtag = 0 /* NONE */; }
                                  else
                                      { state.hmdHashtag = 1 /* NORMAL */; }
                                  escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                  do {
                                      // found tailing #
                                      if (escape_removed_str[0] === '#' &&
                                          (escape_removed_str.length === 1 || !hashtagRE.test(escape_removed_str[1]))) {
                                          state.hmdHashtag = 2 /* WITH_SPACE */;
                                          break;
                                      }
                                      if (tmp = escape_removed_str.match(/^\s+/)) {
                                          escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                          if (tmp = escape_removed_str.match(hashtagRE)) {
                                              // found a space + valid tag text parts
                                              // continue this loop until tailing # is found
                                              escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                              continue;
                                          }
                                      }
                                      // can't establish a Hashtag WITH_SPACE. stop
                                      break;
                                  } while (true);
                              }
                              if (state.hmdHashtag) {
                                  ans += " formatting formatting-hashtag hashtag-begin " + modeCfg.tokenTypeOverrides.hashtag;
                              }
                          }
                          break;
                      case 1 /* NORMAL */:
                          var endHashTag = false;
                          if (!/formatting/.test(ans) && !/^\s*$/.test(current)) {
                              // if invalid hashtag char found, break current parsed text part
                              tmp = current.match(hashtagRE);
                              var backUpChars = current.length - (tmp ? tmp[0].length : 0);
                              if (backUpChars > 0) {
                                  stream.backUp(backUpChars);
                                  endHashTag = true;
                              }
                          }
                          if (!endHashTag)
                              { endHashTag = stream.eol(); } // end of line
                          if (!endHashTag)
                              { endHashTag = !hashtagRE.test(stream.peek()); } // or next char is invalid to hashtag name
                          // escaped char is always invisible to stream. no worry
                          if (endHashTag) {
                              ans += " hashtag-end";
                              state.hmdHashtag = 0 /* NONE */;
                          }
                          break;
                      case 2 /* WITH_SPACE */:
                          // escaped char is always invisible to stream. no worry
                          if (current === '#') {
                              // end the hashtag if meet unescaped #
                              ans = ans.replace(/\sformatting-header(?:-\d+)?/g, '');
                              ans += " formatting formatting-hashtag hashtag-end";
                              state.hmdHashtag = 0 /* NONE */;
                          }
                          break;
                  }
              }
              //#endregion
          }
          return ans.trim() || null;
      };
      function modeOverride(stream, state) {
          var exit = state.hmdInnerExitChecker(stream, state);
          var extraStyle = state.hmdInnerStyle;
          var ans = (!exit || !exit.skipInnerMode) && state.hmdInnerMode.token(stream, state.hmdInnerState) || "";
          if (extraStyle)
              { ans += " " + extraStyle; }
          if (exit) {
              if (exit.style)
                  { ans += " " + exit.style; }
              if (exit.endPos)
                  { stream.pos = exit.endPos; }
              state.hmdInnerExitChecker = null;
              state.hmdInnerMode = null;
              state.hmdInnerState = null;
              state.hmdOverride = null;
          }
          return ans.trim() || null;
      }
      function createDummyMode(endTag) {
          return {
              token: function(stream) {
                  var endTagSince = stream.string.indexOf(endTag, stream.start);
                  if (endTagSince === -1)
                      { stream.skipToEnd(); } // endTag not in this line
                  else if (endTagSince === 0)
                      { stream.pos += endTag.length; } // current token is endTag
                  else {
                      stream.pos = endTagSince;
                      if (stream.string.charAt(endTagSince - 1) === "\\")
                          { stream.pos++; }
                  }
                  return null;
              }
          };
      }
      function createSimpleInnerModeExitChecker(endTag, retInfo) {
          if (!retInfo)
              { retInfo = {}; }
          return function (stream, state) {
              if (stream.string.substr(stream.start, endTag.length) === endTag) {
                  retInfo.endPos = stream.start + endTag.length;
                  return retInfo;
              }
              return null;
          };
      }
      /**
       * switch to another mode
       *
       * After entering a mode, you can then set `hmdInnerExitStyle` and `hmdInnerState` of `state`
       *
       * @returns if `skipFirstToken` not set, returns `innerMode.token(stream, innerState)`, meanwhile, stream advances
       */
      function enterMode(stream, state, mode, opt) {
          if (typeof mode === "string")
              { mode = CodeMirror.getMode(cmCfg, mode); }
          if (!mode || mode["name"] === "null") {
              if ('endTag' in opt)
                  { mode = createDummyMode(opt.endTag); }
              else
                  { mode = (typeof opt.fallbackMode === 'function') && opt.fallbackMode(); }
              if (!mode)
                  { throw new Error("no mode"); }
          }
          state.hmdInnerExitChecker = ('endTag' in opt) ? createSimpleInnerModeExitChecker(opt.endTag) : opt.exitChecker;
          state.hmdInnerStyle = opt.style;
          state.hmdInnerMode = mode;
          state.hmdOverride = modeOverride;
          state.hmdInnerState = CodeMirror.startState(mode);
          var ans = opt.style || "";
          if (!opt.skipFirstToken) {
              ans += " " + mode.token(stream, state.hmdInnerState);
          }
          return ans.trim();
      }
      return newMode;
  }, "hypermd");
  CodeMirror.defineMIME("text/x-hypermd", "hypermd");

  var hypermd = /*#__PURE__*/Object.freeze({

  });

  // HyperMD, copyright (c) by laobubu
  /**
   * send data to url
   *
   * @param method default: "POST"
   */
  function ajaxUpload(url, form, callback, method) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();
      for (var name in form)
          { formData.append(name, form[name]); }
      xhr.onreadystatechange = function () {
          if (4 == this.readyState) {
              var ret = xhr.responseText;
              try {
                  ret = JSON.parse(xhr.responseText);
              }
              catch (err) { }
              if (/^20\d/.test(xhr.status + "")) {
                  callback(ret, null);
              }
              else {
                  callback(null, ret);
              }
          }
      };
      xhr.open(method || 'POST', url, true);
      // xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.send(formData);
  }
  var defaultOption = {
      byDrop: false,
      byPaste: false,
      fileHandler: null,
  };
  var suggestedOption = {
      byPaste: true,
      byDrop: true,
  };
  suggestedEditorConfig.hmdInsertFile = suggestedOption;
  CodeMirror.defineOption("hmdInsertFile", defaultOption, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          var enabled = !!newVal;
          newVal = { byDrop: enabled, byPaste: enabled };
      }
      else if (typeof newVal === 'function') {
          newVal = { byDrop: true, byPaste: true, fileHandler: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon(cm);
      for (var k in defaultOption) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var InsertFile = function(cm) {
      var this$1 = this;

      // options will be initialized to defaultOption when constructor is finished
      this.cm = cm;
      this.pasteHandle = function (cm, ev) {
          if (!this$1.doInsert(ev.clipboardData || window['clipboardData'], true))
              { return; }
          ev.preventDefault();
      };
      this.dropHandle = function (cm, ev) {
          var self = this$1, cm = this$1.cm, result = false;
          cm.operation(function () {
              var pos = cm.coordsChar({ left: ev.clientX, top: ev.clientY }, "window");
              cm.setCursor(pos);
              result = self.doInsert(ev.dataTransfer, false);
          });
          if (!result)
              { return; }
          ev.preventDefault();
      };
      new FlipFlop(
      /* ON  */ function () { return this$1.cm.on("paste", this$1.pasteHandle); },
      /* OFF */ function () { return this$1.cm.off("paste", this$1.pasteHandle); }).bind(this, "byPaste", true);
      new FlipFlop(
      /* ON  */ function () { return this$1.cm.on("drop", this$1.dropHandle); },
      /* OFF */ function () { return this$1.cm.off("drop", this$1.dropHandle); }).bind(this, "byDrop", true);
  };
  /**
   * upload files to the current cursor.
   *
   * @param {DataTransfer} data
   * @returns {boolean} data is accepted or not
   */
  InsertFile.prototype.doInsert = function (data, isClipboard) {
      var cm = this.cm;
      if (isClipboard && data.types && data.types.some(function (type) { return type.slice(0, 5) === 'text/'; }))
          { return false; }
      if (!data || !data.files || 0 === data.files.length)
          { return false; }
      var files = data.files;
      var fileHandler = this.fileHandler;
      var handled = false;
      if (typeof fileHandler !== 'function')
          { return false; }
      cm.operation(function () {
          // create a placeholder
          cm.replaceSelection(".");
          var posTo = cm.getCursor();
          var posFrom = { line: posTo.line, ch: posTo.ch - 1 };
          var placeholderContainer = document.createElement("span");
          var marker = cm.markText(posFrom, posTo, {
              replacedWith: placeholderContainer,
              clearOnEnter: false,
              handleMouseEvents: false,
          });
          var action = {
              marker: marker, cm: cm,
              finish: function (text, cursor) { return cm.operation(function () {
                  var range = marker.find();
                  var posFrom = range.from, posTo = range.to;
                  cm.replaceRange(text, posFrom, posTo);
                  marker.clear();
                  if (typeof cursor === 'number')
                      { cm.setCursor({
                          line: posFrom.line,
                          ch: posFrom.ch + cursor,
                      }); }
              }); },
              setPlaceholder: function (el) {
                  if (placeholderContainer.childNodes.length > 0)
                      { placeholderContainer.removeChild(placeholderContainer.firstChild); }
                  placeholderContainer.appendChild(el);
                  marker.changed();
              },
              resize: function() {
                  marker.changed();
              }
          };
          handled = fileHandler(files, action);
          if (!handled)
              { marker.clear(); }
      });
      return handled;
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one InsertFile instance */
  var getAddon = Getter("InsertFile", InsertFile, defaultOption /** if has options */);

  var insertFile = /*#__PURE__*/Object.freeze({
    ajaxUpload: ajaxUpload,
    defaultOption: defaultOption,
    suggestedOption: suggestedOption,
    InsertFile: InsertFile,
    getAddon: getAddon
  });

  // HyperMD, copyright (c) by laobubu
  /**
   * Normalize a (potentially-with-title) URL string
   *
   * @param content eg. `http://laobubu.net/page "The Page"` or just a URL
   */
  function splitLink(content) {
      // remove title part (if exists)
      content = content.trim();
      var url = content, title = "";
      var mat = content.match(/^(\S+)\s+("(?:[^"\\]+|\\.)+"|[^"\s].*)/);
      if (mat) {
          url = mat[1];
          title = mat[2];
          if (title.charAt(0) === '"')
              { title = title.substr(1, title.length - 2).replace(/\\"/g, '"'); }
      }
      return { url: url, title: title };
  }
  /********************************************************************************** */
  //#region CodeMirror Extension
  // add methods to all CodeMirror editors
  // every codemirror editor will have these member methods:
  var Extensions = {
      /**
       * Try to find a footnote and return its lineNo, content.
       *
       * NOTE: You will need `hmdSplitLink` and `hmdResolveURL` if you want to get a URL
       *
       * @param footNoteName without square brackets, case-insensive
       * @param line since which line
       */
      hmdReadLink: function(footNoteName, line) {
          return getAddon$1(this).read(footNoteName, line);
      },
      /**
       * Check if URL is relative URL, and add baseURI if needed; or if it's a email address, add "mailto:"
       *
       * @see ReadLink.resolve
       */
      hmdResolveURL: function(url, baseURI) {
          return getAddon$1(this).resolve(url, baseURI);
      },
      hmdSplitLink: splitLink,
  };
  for (var name in Extensions) {
      CodeMirror.defineExtension(name, Extensions[name]);
  }
  var defaultOption$1 = {
      baseURI: "",
  };
  var suggestedOption$1 = {
      baseURI: "",
  };
  suggestedEditorConfig.hmdReadLink = suggestedOption$1;
  CodeMirror.defineOption("hmdReadLink", defaultOption$1, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "string") {
          newVal = { baseURI: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$1(cm);
      for (var k in defaultOption$1) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$1[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var ReadLink = function(cm) {
      var this$1 = this;

      this.cm = cm;
      this.cache = {};
      cm.on("changes", debounce(function () { return this$1.rescan(); }, 500));
      this.rescan();
  };
  /**
   * get link footnote content like
   *
   * ```markdown
   *  [icon]: http://laobubu.net/icon.png
   * ```
   *
   * @param footNoteName case-insensive name, without "[" or "]"
   * @param line     current line. if not set, the first definition will be returned
   */
  ReadLink.prototype.read = function (footNoteName, line) {
      var defs = this.cache[footNoteName.trim().toLowerCase()] || [];
      var def;
      if (typeof line !== "number")
          { line = 1e9; }
      for (var i = 0; i < defs.length; i++) {
          def = defs[i];
          if (def.line > line)
              { break; }
      }
      return def;
  };
  /**
   * Scan content and rebuild the cache
   */
  ReadLink.prototype.rescan = function () {
      var cm = this.cm;
      var cache = (this.cache = {});
      cm.eachLine(function (line) {
          var txt = line.text, mat = /^(?:>\s+)*>?\s{0,3}\[([^\]]+)\]:\s*(.+)$/.exec(txt);
          if (mat) {
              var key = mat[1].trim().toLowerCase(), content = mat[2];
              if (!cache[key])
                  { cache[key] = []; }
              cache[key].push({
                  line: line.lineNo(),
                  content: content,
              });
          }
      });
  };
  /**
   * Check if URL is relative URL, and add baseURI if needed
   *
   * @example
   *
   * resolve("<email address>") // => "mailto:xxxxxxx"
   * resolve("../world.png") // => (depends on your editor configuration)
   * resolve("../world.png", "http://laobubu.net/xxx/foo/") // => "http://laobubu.net/xxx/world.png"
   * resolve("../world.png", "http://laobubu.net/xxx/foo") // => "http://laobubu.net/xxx/world.png"
   * resolve("/world.png", "http://laobubu.net/xxx/foo/") // => "http://laobubu.net/world.png"
   */
  ReadLink.prototype.resolve = function (uri, baseURI) {
      var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var hostExtract = /^(?:[\w-]+\:\/*|\/\/)[^\/]+/;
      var levelupRE = /\/[^\/]+(?:\/+\.?)*$/;
      if (!uri)
          { return uri; }
      if (emailRE.test(uri))
          { return "mailto:" + uri; }
      var tmp;
      var host = "";
      baseURI = baseURI || this.baseURI;
      // not configured, or is already URI with scheme
      if (!baseURI || hostExtract.test(uri))
          { return uri; }
      // try to extract scheme+host like http://laobubu.net without tailing slash
      if (tmp = baseURI.match(hostExtract)) {
          host = tmp[0];
          baseURI = baseURI.slice(host.length);
      }
      while (tmp = uri.match(/^(\.{1,2})([\/\\]+)/)) {
          uri = uri.slice(tmp[0].length);
          if (tmp[1] == "..")
              { baseURI = baseURI.replace(levelupRE, ""); }
      }
      if (uri.charAt(0) === '/' && host) {
          uri = host + uri;
      }
      else {
          if (!/\/$/.test(baseURI))
              { baseURI += "/"; }
          uri = host + baseURI + uri;
      }
      return uri;
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one ReadLink instance */
  var getAddon$1 = Getter("ReadLink", ReadLink, defaultOption$1 /** if has options */);

  var readLink = /*#__PURE__*/Object.freeze({
    splitLink: splitLink,
    Extensions: Extensions,
    defaultOption: defaultOption$1,
    suggestedOption: suggestedOption$1,
    ReadLink: ReadLink,
    getAddon: getAddon$1
  });

  // HyperMD, copyright (c) by laobubu
  var markdownToHTML = (typeof marked === 'function') ? marked : function (text) {
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/  /g, ' &nbsp;');
      return "<pre>" + text + "</pre>";
  };
  /** if `marked` exists, use it; else, return safe html */
  function defaultConvertor(footnote, text) {
      if (!text)
          { return null; }
      return markdownToHTML(text);
  }
  var defaultOption$2 = {
      enabled: false,
      xOffset: 10,
      convertor: defaultConvertor,
  };
  var suggestedOption$2 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdHover = suggestedOption$2;
  CodeMirror.defineOption("hmdHover", defaultOption$2, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { enabled: !!newVal };
      }
      else if (typeof newVal === "function") {
          newVal = { enabled: true, convertor: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$2(cm);
      for (var k in defaultOption$2) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$2[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var Hover = function(cm) {
      var this$1 = this;

      // options will be initialized to defaultOption when constructor is finished
      this.cm = cm;
      new FlipFlop(
      /* ON  */ function () { lineDiv.addEventListener("mouseenter", evhandler, true); },
      /* OFF */ function () { lineDiv.removeEventListener("mouseenter", evhandler, true); this$1.hideInfo(); }).bind(this, "enabled", true);
      var lineDiv = cm.display.lineDiv;
      this.lineDiv = lineDiv;
      var tooltip = document.createElement("div"), tooltipContent = document.createElement("div"), tooltipIndicator = document.createElement("div");
      tooltip.setAttribute("style", "position:absolute;z-index:99");
      tooltip.setAttribute("class", "HyperMD-hover");
      tooltip.setAttribute("cm-ignore-events", "true");
      tooltipContent.setAttribute("class", "HyperMD-hover-content");
      tooltip.appendChild(tooltipContent);
      tooltipIndicator.setAttribute("class", "HyperMD-hover-indicator");
      tooltip.appendChild(tooltipIndicator);
      this.tooltipDiv = tooltip;
      this.tooltipContentDiv = tooltipContent;
      this.tooltipIndicator = tooltipIndicator;
      var evhandler = this.mouseenter.bind(this);
  };
  Hover.prototype.mouseenter = function (ev) {
      var cm = this.cm, target = ev.target;
      var className = target.className;
      if (target == this.tooltipDiv || (target.compareDocumentPosition && (target.compareDocumentPosition(this.tooltipDiv) & 8) == 8)) {
          return;
      }
      var mat;
      if (target.nodeName !== "SPAN" || !(mat = className.match(/(?:^|\s)cm-(hmd-barelink2?|hmd-footref2)(?:\s|$)/))) {
          this.hideInfo();
          return;
      }
      var pos = cm.coordsChar({ left: ev.clientX, top: ev.clientY }, "window");
      var footnoteName = null;
      var footnote = null;
      var hover_type = mat[1]; // hmd-barelink|hmd-link-url-s
      var range = expandRange(cm, pos, hover_type);
      if (range) {
          footnoteName = cm.getRange(range.from, range.to);
          footnoteName = footnoteName.slice(1, -1);
          if (footnoteName)
              { footnote = cm.hmdReadLink(footnoteName, pos.line) || null; }
      }
      var convertor = this.convertor || defaultConvertor;
      var html = convertor(footnoteName, footnote && footnote.content || null);
      if (!html) {
          this.hideInfo();
          return;
      }
      this.showInfo(html, target);
  };
  Hover.prototype.showInfo = function (html, relatedTo) {
      var b1 = relatedTo.getBoundingClientRect();
      var b2 = this.lineDiv.getBoundingClientRect();
      var tdiv = this.tooltipDiv;
      var xOffset = this.xOffset;
      this.tooltipContentDiv.innerHTML = html;
      tdiv.style.left = (b1.left - b2.left - xOffset) + 'px';
      this.lineDiv.appendChild(tdiv);
      var b3 = tdiv.getBoundingClientRect();
      if (b3.right > b2.right) {
          xOffset = b3.right - b2.right;
          tdiv.style.left = (b1.left - b2.left - xOffset) + 'px';
      }
      tdiv.style.top = (b1.top - b2.top - b3.height) + 'px';
      this.tooltipIndicator.style.marginLeft = xOffset + 'px';
  };
  Hover.prototype.hideInfo = function () {
      if (this.tooltipDiv.parentElement == this.lineDiv) {
          this.lineDiv.removeChild(this.tooltipDiv);
      }
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one Hover instance */
  var getAddon$2 = Getter("Hover", Hover, defaultOption$2 /** if has options */);

  var hover = /*#__PURE__*/Object.freeze({
    defaultConvertor: defaultConvertor,
    defaultOption: defaultOption$2,
    suggestedOption: suggestedOption$2,
    Hover: Hover,
    getAddon: getAddon$2
  });

  // HyperMD, copyright (c) by laobubu
  //#endregion
  /********************************************************************************** */
  //#region defaultClickHandler
  var defaultClickHandler = function (info, cm) {
      var text = info.text;
      var type = info.type;
      var url = info.url;
      var pos = info.pos;
      if (type === 'url' || type === 'link') {
          var footnoteRef = text.match(/\[[^\[\]]+\](?:\[\])?$/); // bare link, footref or [foot][] . assume no escaping char inside
          if (footnoteRef && info.altKey) {
              // extract footnote part (with square brackets), then jump to the footnote
              text = footnoteRef[0];
              if (text.slice(-2) === '[]')
                  { text = text.slice(0, -2); } // remove [] of [foot][]
              type = "footref";
          }
          else if ((info.ctrlKey || info.altKey) && url) {
              // just open URL
              window.open(url, "_blank");
          }
      }
      if (type === 'todo') {
          var ref = expandRange(cm, pos, "formatting-task");
          var from = ref.from;
          var to = ref.to;
          var text$1 = cm.getRange(from, to);
          text$1 = (text$1 === '[ ]') ? '[x]' : '[ ]';
          cm.replaceRange(text$1, from, to);
      }
      if (type === 'footref' && (info.ctrlKey || info.altKey)) {
          // Jump to FootNote
          var footnote_name = text.slice(1, -1);
          var footnote = cm.hmdReadLink(footnote_name, pos.line);
          if (footnote) {
              makeBackButton(cm, footnote.line, pos);
              cm.setCursor({ line: footnote.line, ch: 0 });
          }
      }
  };
  /**
   * Display a "go back" button. Requires "HyperMD-goback" gutter set.
   *
   * maybe not useful?
   *
   * @param line where to place the button
   * @param anchor when user click the back button, jumps to here
   */
  var makeBackButton = (function () {
      var bookmark = null;
      function updateBookmark(cm, pos) {
          if (bookmark) {
              cm.clearGutter("HyperMD-goback");
              bookmark.clear();
          }
          bookmark = cm.setBookmark(pos);
      }
      /**
       * Make a button, bind event handlers, but not insert the button
       */
      function makeButton(cm) {
          var hasBackButton = cm.options.gutters.indexOf("HyperMD-goback") != -1;
          if (!hasBackButton)
              { return null; }
          var backButton = document.createElement("div");
          backButton.className = "HyperMD-goback-button";
          backButton.addEventListener("click", function () {
              cm.setCursor(bookmark.find());
              cm.clearGutter("HyperMD-goback");
              bookmark.clear();
              bookmark = null;
          });
          var _tmp1 = cm.display.gutters.children;
          _tmp1 = _tmp1[_tmp1.length - 1];
          _tmp1 = _tmp1.offsetLeft + _tmp1.offsetWidth;
          backButton.style.width = _tmp1 + "px";
          backButton.style.marginLeft = -_tmp1 + "px";
          return backButton;
      }
      return function (cm, line, anchor) {
          var backButton = makeButton(cm);
          if (!backButton)
              { return; }
          backButton.innerHTML = (anchor.line + 1) + "";
          updateBookmark(cm, anchor);
          cm.setGutterMarker(line, "HyperMD-goback", backButton);
      };
  })();
  var defaultOption$3 = {
      enabled: false,
      handler: null,
  };
  var suggestedOption$3 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdClick = suggestedOption$3;
  CodeMirror.defineOption("hmdClick", defaultOption$3, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { enabled: !!newVal };
      }
      else if (typeof newVal === "function") {
          newVal = { enabled: true, handler: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$3(cm);
      for (var k in defaultOption$3) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$3[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var Click = function(cm) {
      var this$1 = this;

      this.cm = cm;
      /** remove modifier className to editor DOM */
      this._mouseMove_keyDetect = function (ev) {
          var el = this$1.el;
          var className = el.className, newClassName = className;
          var altClass = "HyperMD-with-alt";
          var ctrlClass = "HyperMD-with-ctrl";
          if (!ev.altKey && className.indexOf(altClass) >= 0) {
              newClassName = className.replace(altClass, "");
          }
          if (!ev.ctrlKey && className.indexOf(ctrlClass) >= 0) {
              newClassName = className.replace(ctrlClass, "");
          }
          if (!ev.altKey && !ev.ctrlKey) {
              this$1._KeyDetectorActive = false;
              el.removeEventListener('mousemove', this$1._mouseMove_keyDetect, false);
          }
          if (className != newClassName)
              { el.className = newClassName.trim(); }
      };
      /** add modifier className to editor DOM */
      this._keyDown = function (ev) {
          var kc = ev.keyCode || ev.which;
          var className = "";
          if (kc == 17)
              { className = "HyperMD-with-ctrl"; }
          if (kc == 18)
              { className = "HyperMD-with-alt"; }
          var el = this$1.el;
          if (className && el.className.indexOf(className) == -1) {
              el.className += " " + className;
          }
          if (!this$1._KeyDetectorActive) {
              this$1._KeyDetectorActive = true;
              this$1.el.addEventListener('mousemove', this$1._mouseMove_keyDetect, false);
          }
      };
      /**
       * Unbind _mouseUp, then call ClickHandler if mouse not bounce
       */
      this._mouseUp = function (ev) {
          var cinfo = this$1._cinfo;
          this$1.lineDiv.removeEventListener("mouseup", this$1._mouseUp, false);
          if (Math.abs(ev.clientX - cinfo.clientX) > 5 || Math.abs(ev.clientY - cinfo.clientY) > 5)
              { return; }
          if (typeof this$1.handler === 'function' && this$1.handler(cinfo, this$1.cm) === false)
              { return; }
          defaultClickHandler(cinfo, this$1.cm);
      };
      /**
       * Try to construct ClickInfo and bind _mouseUp
       */
      this._mouseDown = function (ev) {
          var button = ev.button;
          var clientX = ev.clientX;
          var clientY = ev.clientY;
          var ctrlKey = ev.ctrlKey;
          var altKey = ev.altKey;
          var shiftKey = ev.shiftKey;
          var cm = this$1.cm;
          if (ev.target.tagName === "PRE")
              { return; }
          var pos = cm.coordsChar({ left: clientX, top: clientY }, "window");
          var range;
          var token = cm.getTokenAt(pos);
          var state = token.state;
          var styles = " " + token.type + " ";
          var mat;
          var type = null;
          var text, url;
          if (mat = styles.match(/\s(image|link|url)\s/)) {
              // Could be a image, link, bare-link, footref, footnote, plain url, plain url w/o angle brackets
              type = mat[1];
              var isBareLink = /\shmd-barelink\s/.test(styles);
              if (state.linkText) {
                  // click on content of a link text.
                  range = expandRange(cm, pos, function (token) { return token.state.linkText || /(?:\s|^)link(?:\s|$)/.test(token.type); });
                  type = "link";
              }
              else {
                  range = expandRange(cm, pos, type);
              }
              if (/^(?:image|link)$/.test(type) && !isBareLink) {
                  // CodeMirror breaks [text] and (url)
                  // Let HyperMD mode handle it!
                  var tmp_range = expandRange(cm, { line: pos.line, ch: range.to.ch + 1 }, "url");
                  if (tmp_range)
                      { range.to = tmp_range.to; }
              }
              text = cm.getRange(range.from, range.to).trim();
              // now extract the URL. boring job
              var tmp;
              if (text.slice(-1) === ')' &&
                  (tmp = text.lastIndexOf('](')) !== -1 // xxxx](url) image / link without ref
              ) {
                  // remove title part (if exists)
                  url = splitLink(text.slice(tmp + 2, -1)).url;
              }
              else if ((mat = text.match(/[^\\]\]\s?\[([^\]]+)\]$/)) || // .][ref] image / link with ref
                  (mat = text.match(/^\[(.+)\]\s?\[\]$/)) || // [ref][]
                  (mat = text.match(/^\[(.+)\](?:\:\s*)?$/)) // [barelink] or [^ref] or [footnote]:
              ) {
                  if (isBareLink && mat[1].charAt(0) === '^')
                      { type = 'footref'; }
                  var t2 = cm.hmdReadLink(mat[1], pos.line);
                  if (!t2)
                      { url = null; }
                  else {
                      // remove title part (if exists)
                      url = splitLink(t2.content).url;
                  }
              }
              else if ((mat = text.match(/^\<(.+)\>$/)) || // <http://laobubu.net>
                  (mat = text.match(/^\((.+)\)$/)) || // (http://laobubu.net)
                  (mat = [null, text]) // http://laobubu.netlast possibility: plain url w/o < >
              ) {
                  url = mat[1];
              }
              url = cm.hmdResolveURL(url);
          }
          else if (styles.match(/\sformatting-task\s/)) {
              // TO-DO checkbox
              type = "todo";
              range = expandRange(cm, pos, "formatting-task");
              range.to.ch = cm.getLine(pos.line).length;
              text = cm.getRange(range.from, range.to);
              url = null;
          }
          else if (styles.match(/\shashtag/)) {
              type = "hashtag";
              range = expandRange(cm, pos, "hashtag");
              text = cm.getRange(range.from, range.to);
              url = null;
          }
          if (type !== null) {
              this$1._cinfo = {
                  type: type, text: text, url: url, pos: pos,
                  button: button, clientX: clientX, clientY: clientY,
                  ctrlKey: ctrlKey, altKey: altKey, shiftKey: shiftKey,
              };
              this$1.lineDiv.addEventListener('mouseup', this$1._mouseUp, false);
          }
      };
      this.lineDiv = cm.display.lineDiv;
      var el = this.el = cm.getWrapperElement();
      new FlipFlop(
      /* ON  */ function () {
          this$1.lineDiv.addEventListener("mousedown", this$1._mouseDown, false);
          el.addEventListener("keydown", this$1._keyDown, false);
      },
      /* OFF */ function () {
          this$1.lineDiv.removeEventListener("mousedown", this$1._mouseDown, false);
          el.removeEventListener("keydown", this$1._keyDown, false);
      }).bind(this, "enabled", true);
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one Click instance */
  var getAddon$3 = Getter("Click", Click, defaultOption$3 /** if has options */);

  var click = /*#__PURE__*/Object.freeze({
    defaultClickHandler: defaultClickHandler,
    defaultOption: defaultOption$3,
    suggestedOption: suggestedOption$3,
    Click: Click,
    getAddon: getAddon$3
  });

  // HyperMD, copyright (c) by laobubu
  var defaultOption$4 = {
      enabled: false,
      convertor: null,
  };
  var suggestedOption$4 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdPaste = suggestedOption$4;
  CodeMirror.defineOption("hmdPaste", defaultOption$4, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { enabled: !!newVal };
      }
      else if (typeof newVal === "function") {
          newVal = { enabled: true, convertor: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$4(cm);
      for (var k in defaultOption$4) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$4[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var Paste = function(cm) {
      var this$1 = this;

      this.cm = cm;
      this.pasteHandler = function (cm, ev) {
          var cd = ev.clipboardData || window['clipboardData'];
          var convertor = this$1.convertor;
          if (!convertor || !cd || cd.types.indexOf('text/html') == -1)
              { return; }
          var result = convertor(cd.getData('text/html'));
          if (!result)
              { return; }
          cm.operation(cm.replaceSelection.bind(cm, result));
          ev.preventDefault();
      };
      new FlipFlop(
      /* ON  */ function () { cm.on('paste', this$1.pasteHandler); },
      /* OFF */ function () { cm.off('paste', this$1.pasteHandler); }).bind(this, "enabled", true);
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one Paste instance */
  var getAddon$4 = Getter("Paste", Paste, defaultOption$4 /** if has options */);

  var paste = /*#__PURE__*/Object.freeze({
    defaultOption: defaultOption$4,
    suggestedOption: suggestedOption$4,
    Paste: Paste,
    getAddon: getAddon$4
  });

  // HyperMD, copyright (c) by laobubu
  var DEBUG = false;
  var FlagArray = typeof Uint8Array === 'undefined' ? Array : Uint8Array;
  var RequestRangeResult;
  (function (RequestRangeResult) {
      // Use string values because in TypeScript, string enum members do not get a reverse mapping generated at all.
      // Otherwise the generated code looks ugly
      RequestRangeResult["OK"] = "ok";
      RequestRangeResult["CURSOR_INSIDE"] = "ci";
      RequestRangeResult["HAS_MARKERS"] = "hm";
  })(RequestRangeResult || (RequestRangeResult = {}));
  //#endregion
  /********************************************************************************** */
  //#region FolderFunc Registry
  var folderRegistry = {};
  /**
   * Add a Folder to the System Folder Registry
   *
   * @param name eg. "math"  "html"  "image"  "link"
   * @param folder
   * @param suggested enable this folder in suggestedEditorConfig
   * @param force if a folder with same name is already exists, overwrite it. (dangerous)
   */
  function registerFolder(name, folder, suggested, force) {
      var registry = folderRegistry;
      if (name in registry && !force)
          { throw new Error(("Folder " + name + " already registered")); }
      defaultOption$5[name] = false;
      suggestedOption$5[name] = !!suggested;
      registry[name] = folder;
  }
  //#endregion
  /********************************************************************************** */
  //#region Utils
  /** break a TextMarker, move cursor to where marker is */
  function breakMark(cm, marker, chOffset) {
      cm.operation(function () {
          var pos = marker.find().from;
          pos = { line: pos.line, ch: pos.ch + ~~chOffset };
          cm.setCursor(pos);
          cm.focus();
          marker.clear();
      });
  }
  var defaultOption$5 = {
  /* will be populated by registerFolder() */
  };
  var suggestedOption$5 = {
  /* will be populated by registerFolder() */
  };
  suggestedEditorConfig.hmdFold = suggestedOption$5;
  normalVisualConfig.hmdFold = false;
  CodeMirror.defineOption("hmdFold", defaultOption$5, function (cm, newVal) {
      ///// convert newVal's type to `Record<string, boolean>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = newVal ? suggestedOption$5 : defaultOption$5;
      }
      if ('customFolders' in newVal) {
          console.error('[HyperMD][Fold] `customFolders` is removed. To use custom folders, `registerFolder` first.');
          delete newVal['customFolders'];
      }
      ///// apply config
      var inst = getAddon$5(cm);
      for (var type in folderRegistry) {
          inst.setStatus(type, newVal[type]);
      }
      // then, folding task will be queued by setStatus()
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var Fold = /*@__PURE__*/(function (TokenSeeker$$1) {
      function Fold(cm) {
          var this$1 = this;

          TokenSeeker$$1.call(this, cm);
          this.cm = cm;
          /**
           * stores Folder status for current editor
           * @private To enable/disable folders, use `setStatus()`
           */
          this._enabled = {};
          /** Folder's output goes here */
          this.folded = {};
          /// END OF APIS THAT EXPOSED TO FolderFunc
          ///////////////////////////////////////////////////////////////////////////////////////////
          /**
           * Fold everything! (This is a debounced, and `this`-binded version)
           */
          this.startFold = debounce(this.startFoldImmediately.bind(this), 100);
          /** stores every affected lineNo */
          this._quickFoldHint = [];
          cm.on("changes", function (cm, changes) {
              var changedMarkers = [];
              for (var i$1 = 0, list$1 = changes; i$1 < list$1.length; i$1 += 1) {
                  var change = list$1[i$1];

                  var markers = cm.findMarks(change.from, change.to);
                  for (var i = 0, list = markers; i < list.length; i += 1) {
                      var marker = list[i];

                      if (marker._hmd_fold_type)
                          { changedMarkers.push(marker); }
                  }
              }
              for (var i$2 = 0, list$2 = changedMarkers; i$2 < list$2.length; i$2 += 1) {
                  var m = list$2[i$2];

                  m.clear(); // TODO: add "changed" handler for FolderFunc
              }
              this$1.startFold();
          });
          cm.on("cursorActivity", function (cm) {
              if (DEBUG)
                  { console.time('CA'); }
              var lineStuff = {};
              function addPosition(pos) {
                  var lineNo = pos.line;
                  if (!(lineNo in lineStuff)) {
                      var lh = cm.getLineHandle(pos.line);
                      var ms = lh.markedSpans || [];
                      var markers = [];
                      for (var i = 0; i < ms.length; i++) {
                          var marker = ms[i].marker;
                          if ('_hmd_crange' in marker) {
                              var from = marker._hmd_crange[0].line < lineNo ? 0 : marker._hmd_crange[0].ch;
                              var to = marker._hmd_crange[1].line > lineNo ? lh.text.length : marker._hmd_crange[1].ch;
                              markers.push([marker, from, to]);
                          }
                      }
                      lineStuff[lineNo] = {
                          lineNo: lineNo, ch: [pos.ch],
                          markers: markers,
                      };
                  }
                  else {
                      lineStuff[lineNo].ch.push(pos.ch);
                  }
              }
              cm.listSelections().forEach(function (selection) {
                  addPosition(selection.anchor);
                  addPosition(selection.head);
              });
              for (var tmp_id in lineStuff) {
                  var lineData = lineStuff[tmp_id];
                  if (!lineData.markers.length)
                      { continue; }
                  for (var i = 0; i < lineData.ch.length; i++) {
                      var ch = lineData.ch[i];
                      for (var j = 0; j < lineData.markers.length; j++) {
                          var ref = lineData.markers[j];
                          var marker = ref[0];
                          var from = ref[1];
                          var to = ref[2];
                          if (from <= ch && ch <= to) {
                              marker.clear();
                              lineData.markers.splice(j, 1);
                              j--;
                          }
                      }
                  }
              }
              if (DEBUG)
                  { console.timeEnd('CA'); }
              this$1.startQuickFold();
          });
      }

      if ( TokenSeeker$$1 ) Fold.__proto__ = TokenSeeker$$1;
      Fold.prototype = Object.create( TokenSeeker$$1 && TokenSeeker$$1.prototype );
      Fold.prototype.constructor = Fold;
      /** enable/disable one kind of folder, in current editor */
      Fold.prototype.setStatus = function (type, enabled) {
          if (!(type in folderRegistry))
              { return; }
          if (!this._enabled[type] !== !enabled) {
              this._enabled[type] = !!enabled;
              if (enabled)
                  { this.startFold(); }
              else
                  { this.clear(type); }
          }
      };
      ///////////////////////////////////////////////////////////////////////////////////////////
      /// BEGIN OF APIS THAT EXPOSED TO FolderFunc
      /// @see FoldStream
      /**
       * Check if a range is foldable and update _quickFoldHint
       *
       * NOTE: this function is always called after `_quickFoldHint` reset by `startFoldImmediately`
       */
      Fold.prototype.requestRange = function (from, to, cfrom, cto) {
          if (!cto)
              { cto = to; }
          if (!cfrom)
              { cfrom = from; }
          var cm = this.cm;
          var markers = cm.findMarks(from, to);
          if (markers.length !== 0)
              { return RequestRangeResult.HAS_MARKERS; }
          this._quickFoldHint.push(from.line);
          // store "crange" for the coming marker
          this._lastCRange = [cfrom, cto];
          var selections = cm.listSelections();
          for (var i = 0; i < selections.length; i++) {
              var oselection = orderedRange(selections[i]);
              // note that "crange" can be bigger or smaller than marked-text range.
              if (rangesIntersect(this._lastCRange, oselection) || rangesIntersect([from, to], oselection)) {
                  return RequestRangeResult.CURSOR_INSIDE;
              }
          }
          this._quickFoldHint.push(cfrom.line);
          return RequestRangeResult.OK;
      };
      /**
       * Fold everything!
       *
       * @param toLine last line to fold. Inclusive
       */
      Fold.prototype.startFoldImmediately = function (fromLine, toLine) {
          var this$1 = this;

          var cm = this.cm;
          fromLine = fromLine || cm.firstLine();
          toLine = (toLine || cm.lastLine()) + 1;
          this._quickFoldHint = [];
          this.setPos(fromLine, 0, true);
          if (DEBUG) {
              console.log("start fold! ", fromLine, toLine);
          }
          cm.operation(function () { return cm.eachLine(fromLine, toLine, function (line) {
              var lineNo = line.lineNo();
              if (lineNo < this$1.lineNo)
                  { return; } // skip current line...
              else if (lineNo > this$1.lineNo)
                  { this$1.setPos(lineNo, 0); } // hmmm... maybe last one is empty line
              // all the not-foldable chars are marked
              var charMarked = new FlagArray(line.text.length);
              {
                  // populate charMarked array.
                  // @see CodeMirror's findMarksAt
                  var lineMarkers = line.markedSpans;
                  if (lineMarkers) {
                      for (var i = 0; i < lineMarkers.length; ++i) {
                          var span = lineMarkers[i];
                          var spanFrom = span.from == null ? 0 : span.from;
                          var spanTo = span.to == null ? charMarked.length : span.to;
                          for (var j = spanFrom; j < spanTo; j++)
                              { charMarked[j] = 1; }
                      }
                  }
              }
              var tokens = this$1.lineTokens;
              while (this$1.i_token < tokens.length) {
                  var token = tokens[this$1.i_token];
                  var type;
                  var marker = null;
                  var tokenFoldable = true;
                  {
                      for (var i$1 = token.start; i$1 < token.end; i$1++) {
                          if (charMarked[i$1]) {
                              tokenFoldable = false;
                              break;
                          }
                      }
                  }
                  if (tokenFoldable) {
                      // try all enabled folders in registry
                      for (type in folderRegistry) {
                          if (!this$1._enabled[type])
                              { continue; }
                          if (marker = folderRegistry[type](this$1, token))
                              { break; }
                      }
                  }
                  if (!marker) {
                      // this token not folded. check next
                      this$1.i_token++;
                  }
                  else {
                      var ref = marker.find();
                      var from = ref.from;
                      var to = ref.to;
                      (this$1.folded[type] || (this$1.folded[type] = [])).push(marker);
                      marker._hmd_fold_type = type;
                      marker._hmd_crange = this$1._lastCRange;
                      marker.on('clear', function (from, to) {
                          var markers = this$1.folded[type];
                          var idx;
                          if (markers && (idx = markers.indexOf(marker)) !== -1)
                              { markers.splice(idx, 1); }
                          this$1._quickFoldHint.push(from.line);
                      });
                      if (DEBUG) {
                          console.log("[FOLD] New marker ", type, from, to, marker);
                      }
                      // now let's update the pointer position
                      if (from.line > lineNo || from.ch > token.start) {
                          // there are some not-marked chars after current token, before the new marker
                          // first, advance the pointer
                          this$1.i_token++;
                          // then mark the hidden chars as "marked"
                          var fromCh = from.line === lineNo ? from.ch : charMarked.length;
                          var toCh = to.line === lineNo ? to.ch : charMarked.length;
                          for (var i$2 = fromCh; i$2 < toCh; i$2++)
                              { charMarked[i$2] = 1; }
                      }
                      else {
                          // classical situation
                          // new marker starts since current token
                          if (to.line !== lineNo) {
                              this$1.setPos(to.line, to.ch);
                              return; // nothing left in this line
                          }
                          else {
                              this$1.setPos(to.ch); // i_token will be updated by this.setPos()
                          }
                      }
                  }
              }
          }); });
      };
      /**
       * Start a quick fold: only process recent `requestRange`-failed ranges
       */
      Fold.prototype.startQuickFold = function () {
          var hint = this._quickFoldHint;
          if (hint.length === 0)
              { return; }
          var from = hint[0], to = from;
          for (var i = 0, list = hint; i < list.length; i += 1) {
              var lineNo = list[i];

              if (from > lineNo)
                  { from = lineNo; }
              if (to < lineNo)
                  { to = lineNo; }
          }
          this.startFold.stop();
          this.startFoldImmediately(from, to);
      };
      /**
       * Clear one type of folded TextMarkers
       *
       * @param type builtin folder type ("image", "link" etc) or custom fold type
       */
      Fold.prototype.clear = function (type) {
          this.startFold.stop();
          var folded = this.folded[type];
          if (!folded || !folded.length)
              { return; }
          var marker;
          while (marker = folded.pop())
              { marker.clear(); }
      };
      /**
       * Clear all folding result
       */
      Fold.prototype.clearAll = function () {
          this.startFold.stop();
          for (var type in this.folded) {
              var folded = this.folded[type];
              var marker;
              while (marker = folded.pop())
                  { marker.clear(); }
          }
      };

      return Fold;
  }(TokenSeeker));
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one Fold instance */
  var getAddon$5 = Getter("Fold", Fold);

  var fold = /*#__PURE__*/Object.freeze({
    get RequestRangeResult () { return RequestRangeResult; },
    folderRegistry: folderRegistry,
    registerFolder: registerFolder,
    breakMark: breakMark,
    defaultOption: defaultOption$5,
    suggestedOption: suggestedOption$5,
    Fold: Fold,
    getAddon: getAddon$5
  });

  // HyperMD, copyright (c) by laobubu
  var DEBUG$1 = false;
  var ImageFolder = function (stream, token) {
      var cm = stream.cm;
      var imgRE = /\bimage-marker\b/;
      var urlRE = /\bformatting-link-string\b/; // matches the parentheses
      if (imgRE.test(token.type) && token.string === "!") {
          var lineNo = stream.lineNo;
          // find the begin and end of url part
          var url_begin = stream.findNext(urlRE);
          var url_end = stream.findNext(urlRE, url_begin.i_token + 1);
          var from = { line: lineNo, ch: token.start };
          var to = { line: lineNo, ch: url_end.token.end };
          var rngReq = stream.requestRange(from, to, from, from);
          if (rngReq === RequestRangeResult.OK) {
              var url;
              var title;
              { // extract the URL
                  var rawurl = cm.getRange(// get the URL or footnote name in the parentheses
                  { line: lineNo, ch: url_begin.token.start + 1 }, { line: lineNo, ch: url_end.token.start });
                  if (url_end.token.string === "]") {
                      var tmp = cm.hmdReadLink(rawurl, lineNo);
                      if (!tmp)
                          { return null; } // Yup! bad URL?!
                      rawurl = tmp.content;
                  }
                  url = splitLink(rawurl).url;
                  url = cm.hmdResolveURL(url);
              }
              { // extract the title
                  title = cm.getRange({ line: lineNo, ch: from.ch + 2 }, { line: lineNo, ch: url_begin.token.start - 1 });
              }
              var img = document.createElement("img");
              var marker = cm.markText(from, to, {
                  clearOnEnter: true,
                  collapsed: true,
                  replacedWith: img,
              });
              img.addEventListener('load', function () {
                  img.classList.remove("hmd-image-loading");
                  marker.changed();
              }, false);
              img.addEventListener('error', function () {
                  img.classList.remove("hmd-image-loading");
                  img.classList.add("hmd-image-error");
                  marker.changed();
              }, false);
              img.addEventListener('click', function () { return breakMark(cm, marker); }, false);
              img.className = "hmd-image hmd-image-loading";
              img.src = url;
              img.title = title;
              return marker;
          }
          else {
              if (DEBUG$1) {
                  console.log("[image]FAILED TO REQUEST RANGE: ", rngReq);
              }
          }
      }
      return null;
  };
  registerFolder("image", ImageFolder, true);

  var foldImage = /*#__PURE__*/Object.freeze({
    ImageFolder: ImageFolder
  });

  // HyperMD, copyright (c) by laobubu
  var LinkFolder = function (stream, token) {
      var cm = stream.cm;
      // a valid beginning must be ...
      if (!(token.string === '[' && // the leading [
          token.state.linkText && // (double check) is link text
          !token.state.linkTitle && // (double check) not image's title
          !/\bimage\b/.test(token.type) // and is not a image mark
      ))
          { return null; }
      var spanExtractor = getLineSpanExtractor(cm);
      // first, find the link text span
      var linkTextSpan = spanExtractor.findSpanWithTypeAt({ line: stream.lineNo, ch: token.start }, "linkText");
      if (!linkTextSpan)
          { return null; }
      // then find the link href span
      var linkHrefSpan = spanExtractor.findSpanWithTypeAt({ line: stream.lineNo, ch: linkTextSpan.end + 1 }, "linkHref");
      if (!linkHrefSpan)
          { return null; }
      // now compose the ranges
      var href_from = { line: stream.lineNo, ch: linkHrefSpan.begin };
      var href_to = { line: stream.lineNo, ch: linkHrefSpan.end };
      var link_from = { line: stream.lineNo, ch: linkTextSpan.begin };
      // and check if the range is OK
      var rngReq = stream.requestRange(href_from, href_to, link_from, href_from);
      if (rngReq !== RequestRangeResult.OK)
          { return null; }
      // everything is OK! make the widget
      var text = cm.getRange(href_from, href_to);
      var ref = splitLink(text.substr(1, text.length - 2));
      var url = ref.url;
      var title = ref.title;
      var img = document.createElement("span");
      img.setAttribute("class", "hmd-link-icon");
      img.setAttribute("title", url + "\n" + title);
      img.setAttribute("data-url", url);
      var marker = cm.markText(href_from, href_to, {
          collapsed: true,
          replacedWith: img,
      });
      img.addEventListener('click', function () { return breakMark(cm, marker); }, false);
      return marker;
  };
  registerFolder("link", LinkFolder, true);

  var foldLink = /*#__PURE__*/Object.freeze({
    LinkFolder: LinkFolder
  });

  // HyperMD, copyright (c) by laobubu
  var rendererRegistry = {};
  /**
   * Add a CodeRenderer to the System CodeRenderer Registry
   *
   * @param lang
   * @param folder
   * @param suggested enable this folder in suggestedEditorConfig
   * @param force if a folder with same name is already exists, overwrite it. (dangerous)
   */
  function registerRenderer(info, force) {
      if (!info || !info.name || !info.renderer)
          { return; }
      var name = info.name;
      var pattern = info.pattern;
      var registry = rendererRegistry;
      if (name in registry) {
          if (!force) {
              throw new Error(("CodeRenderer " + name + " already exists"));
          }
      }
      if (typeof pattern === 'string') {
          var t = pattern.toLowerCase();
          pattern = function (lang) { return (lang.toLowerCase() === t); };
      }
      else if (pattern instanceof RegExp) {
          pattern = function (lang) { return info.pattern.test(lang); };
      }
      var newInfo = {
          name: name,
          suggested: !!info.suggested,
          pattern: pattern,
          renderer: info.renderer,
      };
      registry[name] = newInfo;
      defaultOption$6[name] = false;
      suggestedOption$6[name] = newInfo.suggested;
  }
  //#endregion
  //#region FolderFunc for Addon/Fold -----------------------------------------------------
  /** the FolderFunc for Addon/Fold */
  var CodeFolder = function (stream, token) {
      if (token.start !== 0 ||
          !token.type ||
          token.type.indexOf('HyperMD-codeblock-begin') === -1 ||
          !/[-\w]+\s*$/.test(token.string)) {
          return null;
      }
      return getAddon$6(stream.cm).fold(stream, token);
  };
  registerFolder("code", CodeFolder, true);
  var defaultOption$6 = {
  /* will be populated by registerRenderer() */
  };
  var suggestedOption$6 = {
  /* will be populated by registerRenderer() */
  };
  suggestedEditorConfig.hmdFoldCode = suggestedOption$6;
  CodeMirror.defineOption("hmdFoldCode", defaultOption$6, function (cm, newVal) {
      ///// convert newVal's type to `Record<string, boolean>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = newVal ? suggestedOption$6 : defaultOption$6;
      }
      ///// apply config
      var inst = getAddon$6(cm);
      for (var type in rendererRegistry) {
          inst.setStatus(type, newVal[type]);
      }
      // then, folding task will be queued by setStatus()
  });
  var FoldCode = function(cm) {
      this.cm = cm;
      /**
       * stores renderer status for current editor
       * @private To enable/disable renderer, use `setStatus()`
       */
      this._enabled = {};
      /** renderers' output goes here */
      this.folded = {};
  };
  /** enable/disable one kind of renderer, in current editor */
  FoldCode.prototype.setStatus = function (type, enabled) {
      if (!(type in rendererRegistry))
          { return; }
      if (!this._enabled[type] !== !enabled) {
          this._enabled[type] = !!enabled;
          if (enabled)
              { getAddon$5(this.cm).startFold(); }
          else
              { this.clear(type); }
      }
  };
  /** Clear one type of rendered TextMarkers */
  FoldCode.prototype.clear = function (type) {
      var folded = this.folded[type];
      if (!folded || !folded.length)
          { return; }
      var info;
      while (info = folded.pop())
          { info.marker.clear(); }
  };
  FoldCode.prototype.fold = function (stream, token) {
          var this$1 = this;

      if (token.start !== 0 || !token.type || token.type.indexOf('HyperMD-codeblock-begin') === -1)
          { return null; }
      var tmp = /([-\w]+)\s*$/.exec(token.string);
      var lang = tmp && tmp[1].toLowerCase();
      if (!lang)
          { return null; }
      var renderer;
      var type;
      var cm = this.cm, registry = rendererRegistry, _enabled = this._enabled;
      for (var type_i in registry) {
          var r = registry[type_i];
          if (!_enabled[type_i])
              { continue; }
          if (!r.pattern(lang))
              { continue; }
          type = type_i;
          renderer = r.renderer;
          break;
      }
      if (!type)
          { return null; }
      var from = { line: stream.lineNo, ch: 0 };
      var to = null;
      // find the end of code block
      var lastLineCM = cm.lastLine();
      var endLine = stream.lineNo + 1;
      do {
          var s = cm.getTokenAt({ line: endLine, ch: 1 });
          if (s && s.type && s.type.indexOf('HyperMD-codeblock-end') !== -1) {
              //FOUND END!
              to = { line: endLine, ch: s.end };
              break;
          }
      } while (++endLine < lastLineCM);
      if (!to)
          { return null; }
      // request the range
      var rngReq = stream.requestRange(from, to);
      if (rngReq !== RequestRangeResult.OK)
          { return null; }
      // now we can call renderer
      var code = cm.getRange({ line: from.line + 1, ch: 0 }, { line: to.line, ch: 0 });
      var info = {
          editor: cm,
          lang: lang,
          marker: null,
          lineWidget: null,
          el: null,
          break: undefined_function,
          changed: undefined_function,
      };
      var el = info.el = renderer(code, info);
      if (!el) {
          info.marker.clear();
          return null;
      }
      //-----------------------------
      var $wrapper = document.createElement('div');
      $wrapper.className = contentClass + type;
      $wrapper.style.minHeight = '1em';
      $wrapper.appendChild(el);
      var lineWidget = info.lineWidget = cm.addLineWidget(to.line, $wrapper, {
          above: false,
          coverGutter: false,
          noHScroll: false,
          showIfHidden: false,
      });
      //-----------------------------
      var $stub = document.createElement('span');
      $stub.className = stubClass + type;
      $stub.textContent = '<CODE>';
      var marker = info.marker = cm.markText(from, to, {
          replacedWith: $stub,
      });
      //-----------------------------
      var highlightON = function () { return $stub.className = stubClassHighlight + type; };
      var highlightOFF = function () { return $stub.className = stubClass + type; };
      $wrapper.addEventListener("mouseenter", highlightON, false);
      $wrapper.addEventListener("mouseleave", highlightOFF, false);
      info.changed = function () {
          lineWidget.changed();
      };
      info.break = function () {
          breakMark(cm, marker);
      };
      $stub.addEventListener('click', info.break, false);
      marker.on("clear", function () {
          var markers = this$1.folded[type];
          var idx;
          if (markers && (idx = markers.indexOf(info)) !== -1)
              { markers.splice(idx, 1); }
          if (typeof info.onRemove === 'function')
              { info.onRemove(info); }
          lineWidget.clear();
      });
      if (!(type in this.folded))
          { this.folded[type] = [info]; }
      else
          { this.folded[type].push(info); }
      return marker;
  };
  //#endregion
  var contentClass = "hmd-fold-code-content hmd-fold-code-"; // + renderer_type
  var stubClass = "hmd-fold-code-stub hmd-fold-code-"; // + renderer_type
  var stubClassHighlight = "hmd-fold-code-stub highlight hmd-fold-code-"; // + renderer_type
  var undefined_function = function () { };
  /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldCode instance */
  var getAddon$6 = Getter("FoldCode", FoldCode, defaultOption$6 /** if has options */);

  var foldCode = /*#__PURE__*/Object.freeze({
    rendererRegistry: rendererRegistry,
    registerRenderer: registerRenderer,
    CodeFolder: CodeFolder,
    defaultOption: defaultOption$6,
    suggestedOption: suggestedOption$6,
    FoldCode: FoldCode,
    getAddon: getAddon$6
  });

  // HyperMD, copyright (c) by laobubu
  var DEBUG$3 = false;
  /********************************************************************************** */
  //#region Exports
  /**
   * Detect if a token is a beginning of Math, and fold it!
   *
   * @see FolderFunc in ./fold.ts
   */
  var MathFolder = function (stream, token) {
      var mathBeginRE = /formatting-math-begin\b/;
      if (!mathBeginRE.test(token.type))
          { return null; }
      var cm = stream.cm;
      var line = stream.lineNo;
      var maySpanLines = /math-2\b/.test(token.type); // $$ may span lines!
      var tokenLength = maySpanLines ? 2 : 1; // "$$" or "$"
      // CodeMirror GFM mode split "$$" into two tokens, so do a extra check.
      if (tokenLength == 2 && token.string.length == 1) {
          if (DEBUG$3)
              { console.log("[FoldMath] $$ is splitted into 2 tokens"); }
          var nextToken = stream.lineTokens[stream.i_token + 1];
          if (!nextToken || !mathBeginRE.test(nextToken.type))
              { return null; }
      }
      // Find the position of the "$" tail and compose a range
      var end_info = stream.findNext(/formatting-math-end\b/, maySpanLines);
      var from = { line: line, ch: token.start };
      var to;
      var noEndingToken = false;
      if (end_info) {
          to = { line: end_info.lineNo, ch: end_info.token.start + tokenLength };
      }
      else if (maySpanLines) {
          // end not found, but this is a multi-line math block.
          // fold to the end of doc
          var lastLineNo = cm.lastLine();
          to = { line: lastLineNo, ch: cm.getLine(lastLineNo).length };
          noEndingToken = true;
      }
      else {
          // Hmm... corrupted math ?
          return null;
      }
      // Range is ready. request the range
      var expr_from = { line: from.line, ch: from.ch + tokenLength };
      var expr_to = { line: to.line, ch: to.ch - (noEndingToken ? 0 : tokenLength) };
      var expr = cm.getRange(expr_from, expr_to).trim();
      var foldMathAddon = getAddon$7(cm);
      var reqAns = stream.requestRange(from, to);
      if (reqAns !== RequestRangeResult.OK) {
          if (reqAns === RequestRangeResult.CURSOR_INSIDE)
              { foldMathAddon.editingExpr = expr; } // try to trig preview event
          return null;
      }
      // Now let's make a math widget!
      var isDisplayMode = tokenLength > 1 && from.ch == 0 && (noEndingToken || to.ch >= cm.getLine(to.line).length);
      var marker = insertMathMark(cm, from, to, expr, tokenLength, isDisplayMode);
      foldMathAddon.editingExpr = null; // try to hide preview
      return marker;
  };
  /**
   * Insert a TextMarker, and try to render it with configured MathRenderer.
   */
  function insertMathMark(cm, p1, p2, expression, tokenLength, isDisplayMode) {
      var span = document.createElement("span");
      span.setAttribute("class", "hmd-fold-math math-" + (isDisplayMode ? 2 : 1));
      span.setAttribute("title", expression);
      var mathPlaceholder = document.createElement("span");
      mathPlaceholder.setAttribute("class", "hmd-fold-math-placeholder");
      mathPlaceholder.textContent = expression;
      span.appendChild(mathPlaceholder);
      if (DEBUG$3) {
          console.log("insert", p1, p2, expression);
      }
      var marker = cm.markText(p1, p2, {
          replacedWith: span,
      });
      span.addEventListener("click", function () { return breakMark(cm, marker, tokenLength); }, false);
      var foldMathAddon = getAddon$7(cm);
      var mathRenderer = foldMathAddon.createRenderer(span, isDisplayMode ? "display" : "");
      mathRenderer.onChanged = function () {
          if (mathPlaceholder) {
              span.removeChild(mathPlaceholder);
              mathPlaceholder = null;
          }
          marker.changed();
      };
      marker.on("clear", function () { mathRenderer.clear(); });
      marker["mathRenderer"] = mathRenderer;
      tryToRun(function () {
          if (DEBUG$3)
              { console.log("[MATH] Trying to render ", expression); }
          if (!mathRenderer.isReady())
              { return false; }
          mathRenderer.startRender(expression);
          return true;
      }, 5, function () {
          marker.clear();
          if (DEBUG$3) {
              console.log("[MATH] engine always not ready. faild to render ", expression, p1);
          }
      });
      return marker;
  }
  //#endregion
  registerFolder("math", MathFolder, true);
  /********************************************************************************** */
  //#region Default Renderer
  var DumbRenderer = function(container, mode) {
      var this$1 = this;

      this.container = container;
      var img = document.createElement("img");
      img.setAttribute("class", "hmd-math-dumb");
      img.addEventListener("load", function () { if (this$1.onChanged)
          { this$1.onChanged(this$1.last_expr); } }, false);
      this.img = img;
      container.appendChild(img);
  };
  DumbRenderer.prototype.startRender = function (expr) {
      this.last_expr = expr;
      this.img.src = "https://latex.codecogs.com/gif.latex?" + encodeURIComponent(expr);
  };
  DumbRenderer.prototype.clear = function () {
      this.container.removeChild(this.img);
  };
  /** indicate that if the Renderer is ready to execute */
  DumbRenderer.prototype.isReady = function () {
      return true; // I'm always ready!
  };
  var defaultOption$7 = {
      renderer: DumbRenderer,
      onPreview: null,
      onPreviewEnd: null,
  };
  var suggestedOption$7 = {};
  suggestedEditorConfig.hmdFoldMath = suggestedOption$7;
  CodeMirror.defineOption("hmdFoldMath", defaultOption$7, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal) {
          newVal = {};
      }
      else if (typeof newVal === "function") {
          newVal = { renderer: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$7(cm);
      for (var k in defaultOption$7) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$7[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var FoldMath = function(cm) {
      var this$1 = this;

      this.cm = cm;
      new FlipFlop(
      /** CHANGED */ function (expr) { this$1.onPreview && this$1.onPreview(expr); },
      /** HIDE*/ function () { this$1.onPreviewEnd && this$1.onPreviewEnd(); }, null).bind(this, "editingExpr");
  };
  FoldMath.prototype.createRenderer = function (container, mode) {
      var RendererClass = this.renderer || DumbRenderer;
      return new RendererClass(container, mode);
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldMath instance */
  var getAddon$7 = Getter("FoldMath", FoldMath, defaultOption$7 /** if has options */);

  var foldMath = /*#__PURE__*/Object.freeze({
    MathFolder: MathFolder,
    insertMathMark: insertMathMark,
    DumbRenderer: DumbRenderer,
    defaultOption: defaultOption$7,
    suggestedOption: suggestedOption$7,
    FoldMath: FoldMath,
    getAddon: getAddon$7
  });

  // HyperMD, copyright (c) by laobubu
  var defaultDict = { /* initialized later */};
  var defaultChecker = function (text) { return text in defaultDict; };
  var defaultRenderer = function (text) {
      var el = document.createElement("span");
      el.textContent = defaultDict[text];
      el.title = text;
      return el;
  };
  /********************************************************************************** */
  //#region Folder
  /**
   * Detect if a token is emoji and fold it
   *
   * @see FolderFunc in ./fold.ts
   */
  var EmojiFolder = function (stream, token) {
      if (!token.type || !/ formatting-emoji/.test(token.type))
          { return null; }
      var cm = stream.cm;
      var from = { line: stream.lineNo, ch: token.start };
      var to = { line: stream.lineNo, ch: token.end };
      var name = token.string; // with ":"
      var addon$$1 = getAddon$8(cm);
      if (!addon$$1.isEmoji(name))
          { return null; }
      var reqAns = stream.requestRange(from, to);
      if (reqAns !== RequestRangeResult.OK)
          { return null; }
      // now we are ready to fold and render!
      var marker = addon$$1.foldEmoji(name, from, to);
      return marker;
  };
  //#endregion
  registerFolder("emoji", EmojiFolder, true);
  var defaultOption$8 = {
      myEmoji: {},
      emojiRenderer: defaultRenderer,
      emojiChecker: defaultChecker,
  };
  var suggestedOption$8 = {};
  suggestedEditorConfig.hmdFoldEmoji = suggestedOption$8;
  CodeMirror.defineOption("hmdFoldEmoji", defaultOption$8, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal) {
          newVal = {};
      }
      ///// apply config and write new values into cm
      var inst = getAddon$8(cm);
      for (var k in defaultOption$8) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$8[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var FoldEmoji = function(cm) {
      this.cm = cm;
      // options will be initialized to defaultOption when constructor is finished
  };
  FoldEmoji.prototype.isEmoji = function (text) {
      return text in this.myEmoji || this.emojiChecker(text);
  };
  FoldEmoji.prototype.foldEmoji = function (text, from, to) {
      var cm = this.cm;
      var el = ((text in this.myEmoji) && this.myEmoji[text](text)) || this.emojiRenderer(text);
      if (!el || !el.tagName)
          { return null; }
      if (el.className.indexOf('hmd-emoji') === -1)
          { el.className += " hmd-emoji"; }
      var marker = cm.markText(from, to, {
          replacedWith: el,
      });
      el.addEventListener("click", breakMark.bind(this, cm, marker, 1), false);
      if (el.tagName.toLowerCase() === 'img') {
          el.addEventListener('load', function () { return marker.changed(); }, false);
          el.addEventListener('dragstart', function (ev) { return ev.preventDefault(); }, false);
      }
      return marker;
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldEmoji instance */
  var getAddon$8 = Getter("FoldEmoji", FoldEmoji, defaultOption$8 /** if has options */);
  /********************************************************************************** */
  //#region initialize compact emoji dict
  (function (dest) {
      /** source https://gist.github.com/rxaviers/7360908 */
      var parts = [
          "smile:😄;laughing:😆;blush:😊;smiley:😃;relaxed:☺️;smirk:😏;heart_eyes:😍;kissing_heart:😘;kissing_closed_eyes:😚;flushed:😳;relieved:😌;satisfied:😆;grin:😁;wink:😉;stuck_out_tongue_winking_eye:😜;stuck_out_tongue_closed_eyes:😝;grinning:😀;kissing:😗;kissing_smiling_eyes:😙;stuck_out_tongue:😛;sleeping:😴;worried:😟;frowning:😦;anguished:😧;open_mouth:😮;grimacing:😬;confused:😕;hushed:😯;expressionless:😑;unamused:😒;sweat_smile:😅;sweat:😓;disappointed_relieved:😥;weary:😩;pensive:😔;disappointed:😞;confounded:😖;fearful:😨;cold_sweat:😰;persevere:😣;cry:😢;sob:😭;joy:😂;astonished:😲;scream:😱;tired_face:😫;angry:😠;rage:😡;triumph:😤;sleepy:😪;yum:😋;mask:😷;sunglasses:😎;dizzy_face:😵;imp:👿;smiling_imp:😈;neutral_face:😐;no_mouth:😶;innocent:😇;alien:👽;yellow_heart:💛;blue_heart:💙;purple_heart:💜;heart:❤️;green_heart:💚;broken_heart:💔;heartbeat:💓;heartpulse:💗;two_hearts:💕;revolving_hearts:💞;cupid:💘;sparkling_heart:💖;sparkles:✨;star:⭐️;star2:🌟;dizzy:💫;boom:💥;collision:💥;anger:💢;exclamation:❗️;question:❓;grey_exclamation:❕;grey_question:❔;zzz:💤;dash:💨;sweat_drops:💦;notes:🎶;musical_note:🎵;fire:🔥;hankey:💩;poop:💩;shit:💩;",
          "+1:👍;thumbsup:👍;-1:👎;thumbsdown:👎;ok_hand:👌;punch:👊;facepunch:👊;fist:✊;v:✌️;wave:👋;hand:✋;raised_hand:✋;open_hands:👐;point_up:☝️;point_down:👇;point_left:👈;point_right:👉;raised_hands:🙌;pray:🙏;point_up_2:👆;clap:👏;muscle:💪;metal:🤘;fu:🖕;walking:🚶;runner:🏃;running:🏃;couple:👫;family:👪;two_men_holding_hands:👬;two_women_holding_hands:👭;dancer:💃;dancers:👯;ok_woman:🙆;no_good:🙅;information_desk_person:💁;raising_hand:🙋;bride_with_veil:👰;person_with_pouting_face:🙎;person_frowning:🙍;bow:🙇;couplekiss::couplekiss:;couple_with_heart:💑;massage:💆;haircut:💇;nail_care:💅;boy:👦;girl:👧;woman:👩;man:👨;baby:👶;older_woman:👵;older_man:👴;person_with_blond_hair:👱;man_with_gua_pi_mao:👲;man_with_turban:👳;construction_worker:👷;cop:👮;angel:👼;princess:👸;smiley_cat:😺;smile_cat:😸;heart_eyes_cat:😻;kissing_cat:😽;smirk_cat:😼;scream_cat:🙀;crying_cat_face:😿;joy_cat:😹;pouting_cat:😾;japanese_ogre:👹;japanese_goblin:👺;see_no_evil:🙈;hear_no_evil:🙉;speak_no_evil:🙊;guardsman:💂;skull:💀;feet:🐾;lips:👄;kiss:💋;droplet:💧;ear:👂;eyes:👀;nose:👃;tongue:👅;love_letter:💌;bust_in_silhouette:👤;busts_in_silhouette:👥;speech_balloon:💬;",
          "thought_balloon:💭;sunny:☀️;umbrella:☔️;cloud:☁️;snowflake:❄️;snowman:⛄️;zap:⚡️;cyclone:🌀;foggy:🌁;ocean:🌊;cat:🐱;dog:🐶;mouse:🐭;hamster:🐹;rabbit:🐰;wolf:🐺;frog:🐸;tiger:🐯;koala:🐨;bear:🐻;pig:🐷;pig_nose:🐽;cow:🐮;boar:🐗;monkey_face:🐵;monkey:🐒;horse:🐴;racehorse:🐎;camel:🐫;sheep:🐑;elephant:🐘;panda_face:🐼;snake:🐍;bird:🐦;baby_chick:🐤;hatched_chick:🐥;hatching_chick:🐣;chicken:🐔;penguin:🐧;turtle:🐢;bug:🐛;honeybee:🐝;ant:🐜;beetle:🐞;snail:🐌;octopus:🐙;tropical_fish:🐠;fish:🐟;whale:🐳;whale2:🐋;dolphin:🐬;cow2:🐄;ram:🐏;rat:🐀;water_buffalo:🐃;tiger2:🐅;rabbit2:🐇;dragon:🐉;goat:🐐;rooster:🐓;dog2:🐕;pig2:🐖;mouse2:🐁;ox:🐂;dragon_face:🐲;blowfish:🐡;crocodile:🐊;dromedary_camel:🐪;leopard:🐆;cat2:🐈;poodle:🐩;paw_prints:🐾;bouquet:💐;cherry_blossom:🌸;tulip:🌷;four_leaf_clover:🍀;rose:🌹;sunflower:🌻;hibiscus:🌺;maple_leaf:🍁;leaves:🍃;fallen_leaf:🍂;herb:🌿;mushroom:🍄;cactus:🌵;palm_tree:🌴;evergreen_tree:🌲;deciduous_tree:🌳;chestnut:🌰;seedling:🌱;blossom:🌼;ear_of_rice:🌾;shell:🐚;globe_with_meridians:🌐;sun_with_face:🌞;full_moon_with_face:🌝;new_moon_with_face:🌚;new_moon:🌑;waxing_crescent_moon:🌒;first_quarter_moon:🌓;waxing_gibbous_moon:🌔;full_moon:🌕;waning_gibbous_moon:🌖;last_quarter_moon:🌗;waning_crescent_moon:🌘;last_quarter_moon_with_face:🌜;",
          "first_quarter_moon_with_face:🌛;moon:🌔;earth_africa:🌍;earth_americas:🌎;earth_asia:🌏;volcano:🌋;milky_way:🌌;partly_sunny:⛅️;bamboo:🎍;gift_heart:💝;dolls:🎎;school_satchel:🎒;mortar_board:🎓;flags:🎏;fireworks:🎆;sparkler:🎇;wind_chime:🎐;rice_scene:🎑;jack_o_lantern:🎃;ghost:👻;santa:🎅;christmas_tree:🎄;gift:🎁;bell:🔔;no_bell:🔕;tanabata_tree:🎋;tada:🎉;confetti_ball:🎊;balloon:🎈;crystal_ball:🔮;cd:💿;dvd:📀;floppy_disk:💾;camera:📷;video_camera:📹;movie_camera:🎥;computer:💻;tv:📺;iphone:📱;phone:☎️;telephone:☎️;telephone_receiver:📞;pager:📟;fax:📠;minidisc:💽;vhs:📼;sound:🔉;speaker:🔈;mute:🔇;loudspeaker:📢;mega:📣;hourglass:⌛️;hourglass_flowing_sand:⏳;alarm_clock:⏰;watch:⌚️;radio:📻;satellite:📡;loop:➿;mag:🔍;mag_right:🔎;unlock:🔓;lock:🔒;lock_with_ink_pen:🔏;closed_lock_with_key:🔐;key:🔑;bulb:💡;flashlight:🔦;high_brightness:🔆;low_brightness:🔅;electric_plug:🔌;battery:🔋;calling:📲;email:✉️;mailbox:📫;postbox:📮;bath:🛀;bathtub:🛁;shower:🚿;toilet:🚽;wrench:🔧;nut_and_bolt:🔩;hammer:🔨;seat:💺;moneybag:💰;yen:💴;dollar:💵;pound:💷;euro:💶;",
          "credit_card:💳;money_with_wings:💸;e-mail:📧;inbox_tray:📥;outbox_tray:📤;envelope:✉️;incoming_envelope:📨;postal_horn:📯;mailbox_closed:📪;mailbox_with_mail:📬;mailbox_with_no_mail:📭;door:🚪;smoking:🚬;bomb:💣;gun:🔫;hocho:🔪;pill:💊;syringe:💉;page_facing_up:📄;page_with_curl:📃;bookmark_tabs:📑;bar_chart:📊;chart_with_upwards_trend:📈;chart_with_downwards_trend:📉;scroll:📜;clipboard:📋;calendar:📆;date:📅;card_index:📇;file_folder:📁;open_file_folder:📂;scissors:✂️;pushpin:📌;paperclip:📎;black_nib:✒️;pencil2:✏️;straight_ruler:📏;triangular_ruler:📐;closed_book:📕;green_book:📗;blue_book:📘;orange_book:📙;notebook:📓;notebook_with_decorative_cover:📔;ledger:📒;books:📚;bookmark:🔖;name_badge:📛;microscope:🔬;telescope:🔭;newspaper:📰;football:🏈;basketball:🏀;soccer:⚽️;baseball:⚾️;tennis:🎾;8ball:🎱;",
          "rugby_football:🏉;bowling:🎳;golf:⛳️;mountain_bicyclist:🚵;bicyclist:🚴;horse_racing:🏇;snowboarder:🏂;swimmer:🏊;surfer:🏄;ski:🎿;spades:♠️;hearts:♥️;clubs:♣️;diamonds:♦️;gem:💎;ring:💍;trophy:🏆;musical_score:🎼;musical_keyboard:🎹;violin:🎻;space_invader:👾;video_game:🎮;black_joker:🃏;flower_playing_cards:🎴;game_die:🎲;dart:🎯;mahjong:🀄️;clapper:🎬;memo:📝;pencil:📝;book:📖;art:🎨;microphone:🎤;headphones:🎧;trumpet:🎺;saxophone:🎷;guitar:🎸;shoe:👞;sandal:👡;high_heel:👠;lipstick:💄;boot:👢;shirt:👕;tshirt:👕;necktie:👔;womans_clothes:👚;dress:👗;running_shirt_with_sash:🎽;jeans:👖;kimono:👘;bikini:👙;ribbon:🎀;tophat:🎩;crown:👑;womans_hat:👒;mans_shoe:👞;closed_umbrella:🌂;briefcase:💼;handbag:👜;pouch:👝;purse:👛;eyeglasses:👓;fishing_pole_and_fish:🎣;coffee:☕️;tea:🍵;sake:🍶;baby_bottle:🍼;beer:🍺;beers:🍻;cocktail:🍸;tropical_drink:🍹;wine_glass:🍷;fork_and_knife:🍴;pizza:🍕;hamburger:🍔;fries:🍟;poultry_leg:🍗;meat_on_bone:🍖;spaghetti:🍝;curry:🍛;fried_shrimp:🍤;bento:🍱;sushi:🍣;fish_cake:🍥;rice_ball:🍙;rice_cracker:🍘;rice:🍚;",
          "ramen:🍜;stew:🍲;oden:🍢;dango:🍡;egg:🥚;bread:🍞;doughnut:🍩;custard:🍮;icecream:🍦;ice_cream:🍨;shaved_ice:🍧;birthday:🎂;cake:🍰;cookie:🍪;chocolate_bar:🍫;candy:🍬;lollipop:🍭;honey_pot:🍯;apple:🍎;green_apple:🍏;tangerine:🍊;lemon:🍋;cherries:🍒;grapes:🍇;watermelon:🍉;strawberry:🍓;peach:🍑;melon:🍈;banana:🍌;pear:🍐;pineapple:🍍;sweet_potato:🍠;eggplant:🍆;tomato:🍅;corn:🌽;house:🏠;house_with_garden:🏡;school:🏫;office:🏢;post_office:🏣;hospital:🏥;bank:🏦;convenience_store:🏪;love_hotel:🏩;hotel:🏨;wedding:💒;church:⛪️;department_store:🏬;european_post_office:🏤;city_sunrise:🌇;city_sunset:🌆;japanese_castle:🏯;european_castle:🏰;tent:⛺️;factory:🏭;tokyo_tower:🗼;japan:🗾;mount_fuji:🗻;sunrise_over_mountains:🌄;sunrise:🌅;stars:🌠;statue_of_liberty:🗽;bridge_at_night:🌉;carousel_horse:🎠;rainbow:🌈;ferris_wheel:🎡;fountain:⛲️;roller_coaster:🎢;ship:🚢;speedboat:🚤;boat:⛵️;sailboat:⛵️;rowboat:🚣;anchor:⚓️;rocket:🚀;airplane:✈️;helicopter:🚁;steam_locomotive:🚂;tram:🚊;mountain_railway:🚞;bike:🚲;aerial_tramway:🚡;suspension_railway:🚟;",
          "mountain_cableway:🚠;tractor:🚜;blue_car:🚙;oncoming_automobile:🚘;car:🚗;red_car:🚗;taxi:🚕;oncoming_taxi:🚖;articulated_lorry:🚛;bus:🚌;oncoming_bus:🚍;rotating_light:🚨;police_car:🚓;oncoming_police_car:🚔;fire_engine:🚒;ambulance:🚑;minibus:🚐;truck:🚚;train:🚋;station:🚉;train2:🚆;bullettrain_front:🚅;bullettrain_side:🚄;light_rail:🚈;monorail:🚝;railway_car:🚃;trolleybus:🚎;ticket:🎫;fuelpump:⛽️;vertical_traffic_light:🚦;traffic_light:🚥;warning:⚠️;construction:🚧;beginner:🔰;atm:🏧;slot_machine:🎰;busstop:🚏;barber:💈;hotsprings:♨️;checkered_flag:🏁;crossed_flags:🎌;izakaya_lantern:🏮;moyai:🗿;circus_tent:🎪;performing_arts:🎭;round_pushpin:📍;triangular_flag_on_post:🚩;jp:🇯🇵;kr:🇰🇷;cn:🇨🇳;us:🇺🇸;fr:🇫🇷;es:🇪🇸;it:🇮🇹;ru:🇷🇺;gb:🇬🇧;uk:🇬🇧;de:🇩🇪;one:1️⃣;two:2️⃣;three:3️⃣;four:4️⃣;five:5️⃣;six:6️⃣;seven:7️⃣;eight:8️⃣;nine:9️⃣;keycap_ten:🔟;",
          "1234:🔢;zero:0️⃣;hash:#️⃣;symbols:🔣;arrow_backward:◀️;arrow_down:⬇️;arrow_forward:▶️;arrow_left:⬅️;capital_abcd:🔠;abcd:🔡;abc:🔤;arrow_lower_left:↙️;arrow_lower_right:↘️;arrow_right:➡️;arrow_up:⬆️;arrow_upper_left:↖️;arrow_upper_right:↗️;arrow_double_down:⏬;arrow_double_up:⏫;arrow_down_small:🔽;arrow_heading_down:⤵️;arrow_heading_up:⤴️;leftwards_arrow_with_hook:↩️;arrow_right_hook:↪️;left_right_arrow:↔️;arrow_up_down:↕️;arrow_up_small:🔼;arrows_clockwise:🔃;arrows_counterclockwise:🔄;rewind:⏪;fast_forward:⏩;information_source:ℹ️;ok:🆗;twisted_rightwards_arrows:🔀;repeat:🔁;repeat_one:🔂;new:🆕;top:🔝;up:🆙;cool:🆒;free:🆓;ng:🆖;cinema:🎦;koko:🈁;signal_strength:📶;u5272:🈹;u5408:🈴;u55b6:🈺;u6307:🈯️;u6708:🈷️;u6709:🈶;u6e80:🈵;u7121:🈚️;u7533:🈸;u7a7a:🈳;u7981:🈲;sa:🈂️;restroom:🚻;mens:🚹;womens:🚺;baby_symbol:🚼;no_smoking:🚭;",
          "parking:🅿️;wheelchair:♿️;metro:🚇;baggage_claim:🛄;accept:🉑;wc:🚾;potable_water:🚰;put_litter_in_its_place:🚮;secret:㊙️;congratulations:㊗️;m:Ⓜ️;passport_control:🛂;left_luggage:🛅;customs:🛃;ideograph_advantage:🉐;cl:🆑;sos:🆘;id:🆔;no_entry_sign:🚫;underage:🔞;no_mobile_phones:📵;do_not_litter:🚯;non-potable_water:🚱;no_bicycles:🚳;no_pedestrians:🚷;children_crossing:🚸;no_entry:⛔️;eight_spoked_asterisk:✳️;eight_pointed_black_star:✴️;heart_decoration:💟;vs:🆚;vibration_mode:📳;mobile_phone_off:📴;chart:💹;currency_exchange:💱;aries:♈️;taurus:♉️;gemini:♊️;cancer:♋️;leo:♌️;virgo:♍️;libra:♎️;scorpius:♏️;",
          "sagittarius:♐️;capricorn:♑️;aquarius:♒️;pisces:♓️;ophiuchus:⛎;six_pointed_star:🔯;negative_squared_cross_mark:❎;a:🅰️;b:🅱️;ab:🆎;o2:🅾️;diamond_shape_with_a_dot_inside:💠;recycle:♻️;end:🔚;on:🔛;soon:🔜;clock1:🕐;clock130:🕜;clock10:🕙;clock1030:🕥;clock11:🕚;clock1130:🕦;clock12:🕛;clock1230:🕧;clock2:🕑;clock230:🕝;clock3:🕒;clock330:🕞;clock4:🕓;clock430:🕟;clock5:🕔;clock530:🕠;clock6:🕕;clock630:🕡;clock7:🕖;clock730:🕢;clock8:🕗;clock830:🕣;clock9:🕘;clock930:🕤;heavy_dollar_sign:💲;copyright:©️;registered:®️;tm:™️;x:❌;heavy_exclamation_mark:❗️;bangbang:‼️;interrobang:⁉️;o:⭕️;heavy_multiplication_x:✖️;",
          "heavy_plus_sign:➕;heavy_minus_sign:➖;heavy_division_sign:➗;white_flower:💮;100:💯;heavy_check_mark:✔️;ballot_box_with_check:☑️;radio_button:🔘;link:🔗;curly_loop:➰;wavy_dash:〰️;part_alternation_mark:〽️;trident:🔱;black_square::black_square:;white_square::white_square:;white_check_mark:✅;black_square_button:🔲;white_square_button:🔳;black_circle:⚫️;white_circle:⚪️;red_circle:🔴;large_blue_circle:🔵;large_blue_diamond:🔷;large_orange_diamond:🔶;small_blue_diamond:🔹;small_orange_diamond:🔸;small_red_triangle:🔺;small_red_triangle_down:🔻" ];
      var matRE = /([-\w]+:)([^;]+);/g;
      var t;
      for (var i = 0; i < parts.length; i++) {
          matRE.lastIndex = 0;
          while (t = matRE.exec(parts[i])) {
              dest[':' + t[1]] = t[2];
          }
      }
  })(defaultDict);
  //#endregion

  var foldEmoji = /*#__PURE__*/Object.freeze({
    defaultDict: defaultDict,
    defaultChecker: defaultChecker,
    defaultRenderer: defaultRenderer,
    EmojiFolder: EmojiFolder,
    defaultOption: defaultOption$8,
    suggestedOption: suggestedOption$8,
    FoldEmoji: FoldEmoji,
    getAddon: getAddon$8
  });

  // HyperMD, copyright (c) by laobubu
  var defaultChecker$1 = function (html) {
      // TODO: read https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
      if (/^<(?:br)/i.test(html))
          { return false; } // check first element...
      if (/<(?:script|style|link|meta)/i.test(html))
          { return false; } // don't allow some tags
      if (/\son\w+\s*=/i.test(html))
          { return false; } // don't allow `onclick=` etc.
      if (/src\s*=\s*["']?javascript:/i.test(html))
          { return false; } // don't allow `src="javascript:` etc.
      return true;
  };
  /**
   * Create HTMLElement from HTML string and do special process with HyperMD.ReadLink
   */
  var defaultRenderer$1 = function (html, pos, cm) {
      var tagBegin = /^<(\w+)\s*/.exec(html);
      if (!tagBegin)
          { return null; }
      var tagName = tagBegin[1];
      var ans = document.createElement(tagName);
      var propRE = /([\w\:\-]+)(?:\s*=\s*((['"]).*?\3|\S+))?\s*/g;
      var propLastIndex = propRE.lastIndex = tagBegin[0].length;
      var tmp;
      while (tmp = propRE.exec(html)) {
          if (tmp.index > propLastIndex)
              { break; } // emmm
          var propName = tmp[1];
          var propValue = tmp[2]; // could be wrapped by " or '
          if (propValue && /^['"]/.test(propValue))
              { propValue = propValue.slice(1, -1); }
          ans.setAttribute(propName, propValue);
          propLastIndex = propRE.lastIndex;
      }
      if ('innerHTML' in ans) {
          // node may contain innerHTML
          var startCh = html.indexOf('>', propLastIndex) + 1;
          var endCh = html.length;
          if (tmp = new RegExp(("</" + tagName + "\\s*>\\s*$"), "i").exec(html)) {
              endCh = tmp.index;
          }
          var innerHTML = html.slice(startCh, endCh);
          if (innerHTML)
              { ans.innerHTML = innerHTML; }
          // resolve relative URLs and change default behavoirs
          visitElements([ans], function (el) {
              var tagName = el.tagName.toLowerCase();
              if (tagName === 'a') {
                  // for links, if target not set, add target="_blank"
                  if (!el.getAttribute("target"))
                      { el.setAttribute("target", "_blank"); }
              }
              // Then, resovle relative URLs
              var urlAttrs = ({
                  a: ["href"],
                  img: ["src"],
                  iframe: ["src"],
              })[tagName];
              if (urlAttrs) {
                  for (var i = 0; i < urlAttrs.length; i++) {
                      var attr = urlAttrs[i];
                      var attrValue = el.getAttribute(attr);
                      if (attrValue)
                          { el.setAttribute(attr, cm.hmdResolveURL(attrValue)); }
                  }
              }
          });
      }
      return ans;
  };
  /********************************************************************************** */
  var stubClass$1 = "hmd-fold-html-stub";
  var stubClassOmittable = "hmd-fold-html-stub omittable";
  var stubClassHighlight$1 = "hmd-fold-html-stub highlight";
  /********************************************************************************** */
  //#region Folder
  /**
   * Detect if a token is a beginning of HTML, and fold it!
   *
   * @see FolderFunc in ./fold.ts
   */
  var HTMLFolder = function (stream, token) {
      if (!token.type || !/ hmd-html-begin/.test(token.type))
          { return null; }
      var endInfo = stream.findNext(/ hmd-html-\w+/, true); // find next html start/end token
      if (!endInfo || !/ hmd-html-end/.test(endInfo.token.type) || / hmd-html-unclosed/.test(endInfo.token.type))
          { return null; }
      var cm = stream.cm;
      var from = { line: stream.lineNo, ch: token.start };
      var to = { line: endInfo.lineNo, ch: endInfo.token.end };
      var inlineMode = from.ch != 0 || to.ch < cm.getLine(to.line).length;
      // if (!inlineMode) {
      //   // if not inline mode, be greddy and eat following blank lines (except last line of editor)!
      //   let lastLine: number = cm.lastLine() - 1
      //   let allowCount: number = 1
      //   while (allowCount > 0 && to.line < lastLine) {
      //     let nextLine: string = cm.getLine(to.line + 1)
      //     if (!/^\s*$/.test(nextLine)) break
      //     to.line++
      //     to.ch = nextLine.length
      //     allowCount--
      //   }
      // }
      var addon$$1 = getAddon$9(cm);
      var html = cm.getRange(from, to);
      if (!addon$$1.checker(html, from, cm))
          { return null; } // security check
      // security check pass!
      var reqAns = stream.requestRange(from, to);
      if (reqAns !== RequestRangeResult.OK)
          { return null; }
      // now we are ready to fold and render!
      var marker = addon$$1.renderAndInsert(html, from, to, inlineMode);
      return marker;
  };
  //#endregion
  registerFolder("html", HTMLFolder, false);
  var defaultOption$9 = {
      checker: defaultChecker$1,
      renderer: defaultRenderer$1,
      stubText: "<HTML>",
      isolatedTagName: /^(?:div|pre|form|table|iframe|ul|ol|input|textarea|p|summary|a)$/i,
  };
  var suggestedOption$9 = {};
  suggestedEditorConfig.hmdFoldHTML = suggestedOption$9;
  CodeMirror.defineOption("hmdFoldHTML", defaultOption$9, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal) {
          newVal = {};
      }
      else if (typeof newVal == 'function') {
          newVal = { checker: newVal };
      }
      else if (typeof newVal != 'object') {
          console.warn('[HyperMD][FoldHTML] incorrect option value type');
          newVal = {};
      }
      ///// apply config and write new values into cm
      var inst = getAddon$9(cm);
      for (var k in defaultOption$9) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$9[k];
      }
      ///// Type Check
      if (inst.isolatedTagName && !(inst.isolatedTagName instanceof RegExp)) {
          console.error("[HyperMD][FoldHTML] option isolatedTagName only accepts RegExp");
          inst.isolatedTagName = defaultOption$9.isolatedTagName;
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var FoldHTML = function(cm) {
      this.cm = cm;
      // options will be initialized to defaultOption when constructor is finished
  };
  /**
   * Render HTML, insert into editor and return the marker
   */
  FoldHTML.prototype.renderAndInsert = function (html, from, to, inlineMode) {
      var cm = this.cm;
      var stub = this.makeStub();
      var el = this.renderer(html, from, cm);
      var breakFn = function () { return breakMark(cm, marker); };
      if (!el)
          { return null; }
      stub.addEventListener("click", breakFn, false);
      if (!el.tagName.match(this.isolatedTagName || /^$/))
          { el.addEventListener("click", breakFn, false); }
      var replacedWith;
      var marker;
      if (inlineMode) {
          /** put HTML inline */
          var span = document.createElement("span");
          span.setAttribute("class", "hmd-fold-html");
          span.setAttribute("style", "display: inline-block");
          span.appendChild(stub);
          span.appendChild(el);
          replacedWith = span;
          /** If element size changed, we notify CodeMirror */
          var watcher = watchSize(el, function (w, h) {
              var computedStyle = getComputedStyle(el);
              var getStyle = function (name) { return computedStyle.getPropertyValue(name); };
              var floating = w < 10 || h < 10 ||
                  !/^relative|static$/i.test(getStyle('position')) ||
                  !/^none$/i.test(getStyle('float'));
              if (!floating)
                  { stub.className = stubClassOmittable; }
              else
                  { stub.className = stubClass$1; }
              marker.changed();
          });
          watcher.check(); // trig the checker once
          // Marker is not created yet. Bind events later
          setTimeout(function () {
              marker.on("clear", function () {
                  watcher.stop();
              });
          }, 0);
      }
      else {
          /** use lineWidget to insert element */
          replacedWith = stub;
          var lineWidget = cm.addLineWidget(to.line, el, {
              above: false,
              coverGutter: false,
              noHScroll: false,
              showIfHidden: false,
          });
          var highlightON = function () { return stub.className = stubClassHighlight$1; };
          var highlightOFF = function () { return stub.className = stubClass$1; };
          el.addEventListener("mouseenter", highlightON, false);
          el.addEventListener("mouseleave", highlightOFF, false);
          var watcher = watchSize(el, function () { return lineWidget.changed(); });
          watcher.check();
          // Marker is not created yet. Bind events later
          setTimeout(function () {
              marker.on("clear", function () {
                  watcher.stop();
                  lineWidget.clear();
                  el.removeEventListener("mouseenter", highlightON, false);
                  el.removeEventListener("mouseleave", highlightOFF, false);
              });
          }, 0);
      }
      marker = cm.markText(from, to, {
          replacedWith: replacedWith,
      });
      return marker;
  };
  FoldHTML.prototype.makeStub = function () {
      var ans = document.createElement('span');
      ans.setAttribute("class", stubClass$1);
      ans.textContent = this.stubText || '<HTML>';
      return ans;
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldHTML instance */
  var getAddon$9 = Getter("FoldHTML", FoldHTML, defaultOption$9 /** if has options */);

  var foldHtml = /*#__PURE__*/Object.freeze({
    defaultChecker: defaultChecker$1,
    defaultRenderer: defaultRenderer$1,
    HTMLFolder: HTMLFolder,
    defaultOption: defaultOption$9,
    suggestedOption: suggestedOption$9,
    FoldHTML: FoldHTML,
    getAddon: getAddon$9
  });

  // HyperMD, copyright (c) by laobubu
  var defaultOption$10 = {
      enabled: false,
  };
  var suggestedOption$10 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdTableAlign = suggestedOption$10;
  normalVisualConfig.hmdTableAlign = false;
  CodeMirror.defineOption("hmdTableAlign", defaultOption$10, function (cm, newVal) {
      var enabled = !!newVal;
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!enabled || typeof newVal === "boolean") {
          newVal = { enabled: enabled };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$10(cm);
      for (var k in defaultOption$10) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$10[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var TableAlign = function(cm) {
      var this$1 = this;

      // options will be initialized to defaultOption (if exists)
      // add your code here
      this.cm = cm;
      this.styleEl = document.createElement("style");
      /**
       * Remeasure visible columns, update CSS style to make columns aligned
       *
       * (This is a debounced function)
       */
      this.updateStyle = debounce(function () {
          if (!this$1.enabled)
              { return; }
          var cm = this$1.cm;
          var measures = this$1.measure();
          var css = this$1.makeCSS(measures);
          if (css === this$1._lastCSS)
              { return; }
          this$1.styleEl.textContent = this$1._lastCSS = css;
          cm.refresh();
      }, 100);
      /** CodeMirror renderLine event handler */
      this._procLine = function (cm, line, el) {
          if (!el.querySelector('.cm-hmd-table-sep'))
              { return; }
          var lineSpan = el.firstElementChild;
          var lineSpanChildren = Array.prototype.slice.call(lineSpan.childNodes, 0);
          var eolState = cm.getStateAfter(line.lineNo());
          var columnStyles = eolState.hmdTableColumns;
          var tableID = eolState.hmdTableID;
          var columnIdx = eolState.hmdTable === 2 /* NORMAL */ ? -1 : 0;
          var columnSpan = this$1.makeColumn(columnIdx, columnStyles[columnIdx] || "dummy", tableID);
          var columnContentSpan = columnSpan.firstElementChild;
          for (var i = 0, list = lineSpanChildren; i < list.length; i += 1) {
              var el$1 = list[i];

              var elClass = el$1.nodeType === Node.ELEMENT_NODE && el$1.className || "";
              if (/cm-hmd-table-sep/.test(elClass)) {
                  // found a "|", and a column is finished
                  columnIdx++;
                  columnSpan.appendChild(columnContentSpan);
                  lineSpan.appendChild(columnSpan);
                  lineSpan.appendChild(el$1);
                  columnSpan = this$1.makeColumn(columnIdx, columnStyles[columnIdx] || "dummy", tableID);
                  columnContentSpan = columnSpan.firstElementChild;
              }
              else {
                  columnContentSpan.appendChild(el$1);
              }
          }
          columnSpan.appendChild(columnContentSpan);
          lineSpan.appendChild(columnSpan);
      };
      new FlipFlop(
      /* ON  */ function () {
          cm.on("renderLine", this$1._procLine);
          cm.on("update", this$1.updateStyle);
          cm.refresh();
          document.head.appendChild(this$1.styleEl);
      },
      /* OFF */ function () {
          cm.off("renderLine", this$1._procLine);
          cm.off("update", this$1.updateStyle);
          document.head.removeChild(this$1.styleEl);
      }).bind(this, "enabled", true);
  };
  /**
   * create a <span> container as column,
   * note that put content into column.firstElementChild
   */
  TableAlign.prototype.makeColumn = function (index, style, tableID) {
      var span = document.createElement("span");
      span.className = "hmd-table-column hmd-table-column-" + index + " hmd-table-column-" + style;
      span.setAttribute("data-column", "" + index);
      span.setAttribute("data-table-id", tableID);
      var span2 = document.createElement("span");
      span2.className = "hmd-table-column-content";
      span2.setAttribute("data-column", "" + index);
      span.appendChild(span2);
      return span;
  };
  /** Measure all visible tables and columns */
  TableAlign.prototype.measure = function () {
      var cm = this.cm;
      var lineDiv = cm.display.lineDiv; // contains every <pre> line
      var contentSpans = lineDiv.querySelectorAll(".hmd-table-column-content");
      /** every table's every column's width in px */
      var ans = {};
      for (var i = 0; i < contentSpans.length; i++) {
          var contentSpan = contentSpans[i];
          var column = contentSpan.parentElement;
          var tableID = column.getAttribute("data-table-id");
          var columnIdx = ~~column.getAttribute("data-column");
          var width = contentSpan.offsetWidth + 1; // +1 because browsers turn 311.3 into 312
          if (!(tableID in ans))
              { ans[tableID] = []; }
          var columnWidths = ans[tableID];
          while (columnWidths.length <= columnIdx)
              { columnWidths.push(0); }
          if (columnWidths[columnIdx] < width)
              { columnWidths[columnIdx] = width; }
      }
      return ans;
  };
  /** Generate CSS */
  TableAlign.prototype.makeCSS = function (measures) {
      var rules = [];
      for (var tableID in measures) {
          var columnWidths = measures[tableID];
          var rulePrefix = "pre.HyperMD-table-row.HyperMD-table_" + tableID + " .hmd-table-column-";
          for (var columnIdx = 0; columnIdx < columnWidths.length; columnIdx++) {
              var width = columnWidths[columnIdx];
              rules.push(("" + rulePrefix + columnIdx + " { min-width: " + (width + .5) + "px }"));
          }
      }
      return rules.join("\n");
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one TableAlign instance */
  var getAddon$10 = Getter("TableAlign", TableAlign, defaultOption$10);

  var tableAlign = /*#__PURE__*/Object.freeze({
    defaultOption: defaultOption$10,
    suggestedOption: suggestedOption$10,
    TableAlign: TableAlign,
    getAddon: getAddon$10
  });

  // HyperMD, copyright (c) by laobubu
  var defaultOption$11 = {
      source: null,
  };
  var suggestedOption$11 = {
      source: (typeof requirejs === 'function') ? "~codemirror/" : "https://cdn.jsdelivr.net/npm/codemirror/",
  };
  suggestedEditorConfig.hmdModeLoader = suggestedOption$11;
  CodeMirror.defineOption("hmdModeLoader", defaultOption$11, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { source: newVal && suggestedOption$11.source || null };
      }
      else if (typeof newVal === "string" || typeof newVal === "function") {
          newVal = { source: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$11(cm);
      for (var k in defaultOption$11) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$11[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var ModeLoader = function(cm) {
      var this$1 = this;

      // options will be initialized to defaultOption when constructor is finished
      // add your code here
      this.cm = cm;
      this._loadingModes = {};
      /**
       * CodeMirror "renderLine" event handler
       */
      this.rlHandler = function (cm, line) {
          var lineNo = line.lineNo();
          var text = line.text || "", mat = text.match(/^```\s*(\S+)/);
          if (mat) { // seems found one code fence
              var lang = mat[1];
              var modeInfo = CodeMirror.findModeByName(lang);
              var modeName = modeInfo && modeInfo.mode;
              if (modeName && !(modeName in CodeMirror.modes)) {
                  // a not-loaded mode is found!
                  // now we shall load mode `modeName`
                  this$1.startLoadMode(modeName, lineNo);
              }
          }
      };
      new FlipFlop() // use FlipFlop to detect if a option is changed
          .bind(this, "source")
          .ON(function () { cm.on("renderLine", this$1.rlHandler); })
          .OFF(function () { cm.off("renderLine", this$1.rlHandler); });
  };
  /** trig a "change" event on one line */
  ModeLoader.prototype.touchLine = function (lineNo) {
      var line = this.cm.getLineHandle(lineNo);
      var lineLen = line.text.length;
      this.cm.replaceRange(line.text.charAt(lineLen - 1), { line: lineNo, ch: lineLen - 1 }, { line: lineNo, ch: lineLen });
  };
  /**
   * load a mode, then refresh editor
   *
   * @param  mode
   * @param  line >=0 : add into waiting queue<0 : load and retry up to `-line` times
   */
  ModeLoader.prototype.startLoadMode = function (mode, line) {
      var linesWaiting = this._loadingModes;
      var self = this;
      if (line >= 0 && mode in linesWaiting) {
          linesWaiting[mode].push(line);
          return;
      }
      // start load a mode
      if (line >= 0)
          { linesWaiting[mode] = [line]; }
      var successCb = function () {
          console.log("[HyperMD] mode-loader loaded " + mode);
          var lines = linesWaiting[mode];
          self.cm.operation(function () {
              for (var i = 0; i < lines.length; i++) {
                  self.touchLine(lines[i]);
              }
          });
          delete linesWaiting[mode];
      };
      var errorCb = function () {
          console.warn("[HyperMD] mode-loader failed to load mode " + mode + " from ", url);
          if (line === -1) {
              // no more chance
              return;
          }
          console.log("[HyperMD] mode-loader will retry loading " + mode);
          setTimeout(function () {
              self.startLoadMode(mode, line >= 0 ? -3 : (line + 1));
          }, 1000);
      };
      if (typeof this.source === "function") {
          this.source(mode, successCb, errorCb);
          return;
      }
      var url = this.source + "mode/" + mode + "/" + mode + ".js";
      if (typeof requirejs === 'function' && url.charAt(0) === "~") {
          // require.js
          requirejs([
              url.slice(1, -3) ], successCb);
      }
      else {
          // trandition loadScript
          var script = document.createElement('script');
          script.onload = successCb;
          script.onerror = errorCb;
          script.src = url;
          document.head.appendChild(script);
      }
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one ModeLoader instance */
  var getAddon$11 = Getter("ModeLoader", ModeLoader, defaultOption$11 /** if has options */);

  var modeLoader = /*#__PURE__*/Object.freeze({
    defaultOption: defaultOption$11,
    suggestedOption: suggestedOption$11,
    ModeLoader: ModeLoader,
    getAddon: getAddon$11
  });

  // HyperMD, copyright (c) by laobubu
  var DEBUG$4 = false;
  //#region Internal Function...
  /** check if has the class and remove it */
  function rmClass$1(el, className) {
      var c = ' ' + el.className + ' ', cnp = ' ' + className + ' ';
      if (c.indexOf(cnp) === -1)
          { return false; }
      el.className = c.replace(cnp, '').trim();
      return true;
  }
  /** check if NOT has the class and add it */
  function addClass$1(el, className) {
      var c = ' ' + el.className + ' ', cnp = ' ' + className + ' ';
      if (c.indexOf(cnp) !== -1)
          { return false; }
      el.className = (el.className + ' ' + className);
      return true;
  }
  var defaultOption$12 = {
      enabled: false,
      line: true,
      tokenTypes: "em|strong|strikethrough|code|linkText|task".split("|"),
  };
  var suggestedOption$12 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdHideToken = suggestedOption$12;
  normalVisualConfig.hmdHideToken = false;
  CodeMirror.defineOption("hmdHideToken", defaultOption$12, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { enabled: !!newVal };
      }
      else if (typeof newVal === "string") {
          newVal = { enabled: true, tokenTypes: newVal.split("|") };
      }
      else if (newVal instanceof Array) {
          newVal = { enabled: true, tokenTypes: newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$12(cm);
      for (var k in defaultOption$12) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$12[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var hideClassName = "hmd-hidden-token";
  var lineInactiveClassName = "hmd-inactive-line";
  var HideToken = function(cm) {
      var this$1 = this;

      this.cm = cm;
      this.renderLineHandler = function (cm, line, el) {
          // TODO: if we procLine now, we can only get the outdated lineView, lineViewMeasure and lineViewMap. Calling procLine will be wasteful!
          var changed = this$1.procLine(line, el);
          //if (DEBUG) console.log("renderLine return " + changed)
      };
      this.cursorActivityHandler = function (doc) {
          this$1.update();
      };
      this.update = debounce(function () { return this$1.updateImmediately(); }, 100);
      /** Current user's selections, in each line */
      this._rangesInLine = {};
      new FlipFlop(
      /* ON  */ function () {
          cm.on("cursorActivity", this$1.cursorActivityHandler);
          cm.on("renderLine", this$1.renderLineHandler);
          cm.on("update", this$1.update);
          this$1.update();
          cm.refresh();
      },
      /* OFF */ function () {
          cm.off("cursorActivity", this$1.cursorActivityHandler);
          cm.off("renderLine", this$1.renderLineHandler);
          cm.off("update", this$1.update);
          this$1.update.stop();
          cm.refresh();
      }).bind(this, "enabled", true);
  };
  /**
   * hide/show <span>s in one line, based on `this._rangesInLine`
   * @returns line changed or not
   */
  HideToken.prototype.procLine = function (line, pre) {
      var cm = this.cm;
      var lineNo = typeof line === 'number' ? line : line.lineNo();
      if (typeof line === 'number')
          { line = cm.getLineHandle(line); }
      var rangesInLine = this._rangesInLine[lineNo] || [];
      var lv = findViewForLine(cm, lineNo);
      if (!lv || lv.hidden || !lv.measure)
          { return false; }
      if (!pre)
          { pre = lv.text; }
      if (!pre)
          { return false; }
      //if (DEBUG) if (!pre.isSameNode(lv.text)) console.warn("procLine got different node... " + lineNo)
      var mapInfo = mapFromLineView(lv, line, lineNo);
      var map = mapInfo.map;
      var nodeCount = map.length / 3;
      var changed = false;
      // change line status
      if (rangesInLine.length === 0) { // inactiveLine
          if (addClass$1(pre, lineInactiveClassName))
              { changed = true; }
      }
      else { // activeLine
          // sn - fix display of tokens on display if not in focus
          //console.log("procline check");
          //console.log("has focus: " + cm.hasFocus())
          if (cm.hasFocus()) {
              if (rmClass$1(pre, lineInactiveClassName))
                  { changed = true; }
          }
          else {
              addClass$1(pre, lineInactiveClassName);
          }
      }
      // show or hide tokens
      /**
       * @returns if there are Span Nodes changed
       */
      function changeVisibilityForSpan(span, shallHideTokens, iNodeHint) {
          var changed = false;
          //console.log("showhide");
          iNodeHint = iNodeHint || 0;
          // iterate the map
          for (var i = iNodeHint; i < nodeCount; i++) {
              var begin = map[i * 3], end = map[i * 3 + 1];
              var domNode = map[i * 3 + 2];
              if (begin === span.head.start) {
                  // find the leading token!
                  if (/formatting-/.test(span.head.type) && domNode.nodeType === Node.TEXT_NODE) {
                      //if (DEBUG) console.log("DOMNODE", shallHideTokens, domNode, begin, span)
                      // good. this token can be changed
                      var domParent = domNode.parentElement;
                      if (shallHideTokens ? addClass$1(domParent, hideClassName) : rmClass$1(domParent, hideClassName)) {
                          //if (DEBUG) console.log("HEAD DOM CHANGED")
                          changed = true;
                      }
                  }
                  //FIXME: if leading formatting token is separated into two, the latter will not be hidden/shown!
                  // search for the tailing token
                  if (span.tail && /formatting-/.test(span.tail.type)) {
                      for (var j = i + 1; j < nodeCount; j++) {
                          var begin$1 = map[j * 3], end$1 = map[j * 3 + 1];
                          var domNode$1 = map[j * 3 + 2];
                          if (begin$1 == span.tail.start) {
                              //if (DEBUG) console.log("TAIL DOM CHANGED", domNode)
                              if (domNode$1.nodeType === Node.TEXT_NODE) {
                                  // good. this token can be changed
                                  var domParent$1 = domNode$1.parentElement;
                                  if (shallHideTokens ? addClass$1(domParent$1, hideClassName) : rmClass$1(domParent$1, hideClassName)) {
                                      changed = true;
                                  }
                              }
                          }
                          if (begin$1 >= span.tail.end)
                              { break; }
                      }
                  }
              }
              // whoops, next time we can start searching since here
              // return the hint value
              if (begin >= span.begin)
                  { break; }
          }
          return changed;
      }
      var spans = getLineSpanExtractor(cm).extract(lineNo);
      var iNodeHint = 0;
      for (var iSpan = 0; iSpan < spans.length; iSpan++) {
          var span = spans[iSpan];
          if (this.tokenTypes.indexOf(span.type) === -1)
              { continue; } // not-interested span type
          /* TODO: Use AST, instead of crafted Position */
          var spanRange = [{ line: lineNo, ch: span.begin }, { line: lineNo, ch: span.end }];
          /* TODO: If use AST, compute `spanBeginCharInCurrentLine` in another way */
          var spanBeginCharInCurrentLine = span.begin;
          while (iNodeHint < nodeCount && map[iNodeHint * 3 + 1] < spanBeginCharInCurrentLine)
              { iNodeHint++; }
          var shallHideTokens = true;
          for (var iLineRange = 0; iLineRange < rangesInLine.length; iLineRange++) {
              var userRange = rangesInLine[iLineRange];
              if (rangesIntersect(spanRange, userRange)) {
                  shallHideTokens = false;
                  break;
              }
          }
          if (changeVisibilityForSpan(span, shallHideTokens, iNodeHint))
              { changed = true; }
      }
      // finally clean the cache (if needed) and report the result
      if (changed) {
          // clean CodeMirror measure cache
          delete lv.measure.heights;
          lv.measure.cache = {};
      }
      return changed;
  };
  HideToken.prototype.updateImmediately = function () {
          var this$1 = this;

      this.update.stop();
      var cm = this.cm;
      var selections = cm.listSelections();
      var caretAtLines = {};
      var activedLines = {};
      var lastActivedLines = this._rangesInLine;
      // update this._activedLines and caretAtLines
      for (var i = 0, list = selections; i < list.length; i += 1) {
          var selection = list[i];

              var oRange = orderedRange(selection);
          var line0 = oRange[0].line, line1 = oRange[1].line;
          caretAtLines[line0] = caretAtLines[line1] = true;
          for (var line = line0; line <= line1; line++) {
              if (!activedLines[line])
                  { activedLines[line] = [oRange]; }
              else
                  { activedLines[line].push(oRange); }
          }
      }
      this._rangesInLine = activedLines;
      if (DEBUG$4)
          { console.log("======= OP START " + Object.keys(activedLines)); }
      cm.operation(function () {
          // adding "inactive" class
          for (var line in lastActivedLines) {
              // sn
              this$1.procLine(~~line);
              /*
              if (cm.hasFocus() && (activedLines[line])) {
                //continue // line is still active. do nothing
                this.procLine(~~line) // or, try adding "inactive" class to the <pre>s
              } else {
                this.procLine(~~line)
              }
              */
          }
          var caretLineChanged = false;
          // process active lines
          for (var line$1 in activedLines) {
              var lineChanged = this$1.procLine(~~line$1);
              if (lineChanged && caretAtLines[line$1])
                  { caretLineChanged = true; }
          }
          // refresh cursor position if needed
          if (caretLineChanged) {
              if (DEBUG$4)
                  { console.log("caretLineChanged "); }
              cm.refresh();
              // legacy unstable way to update display and caret position:
              // updateCursorDisplay(cm, true)
              // if (cm.hmd.TableAlign && cm.hmd.TableAlign.enabled) cm.hmd.TableAlign.updateStyle()
          }
      });
      if (DEBUG$4)
          { console.log("======= OP END "); }
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one HideToken instance */
  var getAddon$12 = Getter("HideToken", HideToken, defaultOption$12 /** if has options */);

  var hideToken = /*#__PURE__*/Object.freeze({
    defaultOption: defaultOption$12,
    suggestedOption: suggestedOption$12,
    HideToken: HideToken,
    getAddon: getAddon$12
  });

  // HyperMD, copyright (c) by laobubu
  /********************************************************************************** */
  // Some parameter LGTM
  var silenceDuration = 100, distance = 5;
  var defaultOption$13 = {
      enabled: false,
  };
  var suggestedOption$13 = {
      enabled: true,
  };
  suggestedEditorConfig.hmdCursorDebounce = suggestedOption$13;
  CodeMirror.defineOption("hmdCursorDebounce", defaultOption$13, function (cm, newVal) {
      ///// convert newVal's type to `Partial<Options>`, if it is not.
      if (!newVal || typeof newVal === "boolean") {
          newVal = { enabled: !!newVal };
      }
      ///// apply config and write new values into cm
      var inst = getAddon$13(cm);
      for (var k in defaultOption$13) {
          inst[k] = (k in newVal) ? newVal[k] : defaultOption$13[k];
      }
  });
  //#endregion
  /********************************************************************************** */
  //#region Addon Class
  var CursorDebounce = function(cm) {
      var this$1 = this;

      this.cm = cm;
      this.mouseDownHandler = function (cm, ev) {
          this$1.lastX = ev.clientX;
          this$1.lastY = ev.clientY;
          var supressor = this$1.mouseMoveSuppress;
          document.addEventListener("mousemove", supressor, true);
          if (this$1.lastTimeout)
              { clearTimeout(this$1.lastTimeout); }
          this$1.lastTimeout = setTimeout(function () {
              document.removeEventListener("mousemove", supressor, true);
              this$1.lastTimeout = null;
          }, silenceDuration);
      };
      this.mouseMoveSuppress = function (ev) {
          if ((Math.abs(ev.clientX - this$1.lastX) <= distance) && (Math.abs(ev.clientY - this$1.lastY) <= distance))
              { ev.stopPropagation(); }
      };
      new FlipFlop(
      /* ON  */ function () { cm.on('mousedown', this$1.mouseDownHandler); },
      /* OFF */ function () { cm.off('mousedown', this$1.mouseDownHandler); }).bind(this, "enabled", true);
  };
  //#endregion
  /** ADDON GETTER (Singleton Pattern): a editor can have only one CursorDebounce instance */
  var getAddon$13 = Getter("CursorDebounce", CursorDebounce, defaultOption$13 /** if has options */);

  var cursorDebounce = /*#__PURE__*/Object.freeze({
    defaultOption: defaultOption$13,
    suggestedOption: suggestedOption$13,
    CursorDebounce: CursorDebounce,
    getAddon: getAddon$13
  });

  // HyperMD, copyright (c) by laobubu
  /**
    Some codes in this files are from CodeMirror's source code.

    CodeMirror, copyright (c) by Marijn Haverbeke and others
    MIT license: http://codemirror.net/LICENSE

    @see codemirror\addon\edit\continuelist.js
   */
  // loq = List Or Quote
  var LoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/, emptyLoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/, unorderedListRE = /[*+-]\s/;
  var ListRE = /^(\s*)([*+-]\s|(\d+)([.)]))(\s*)/;
  var isRealTableSep = function (token) { return /hmd-table-sep/.test(token.type) && !/hmd-table-sep-dummy/.test(token.type); };
  /**
   * continue list / quote / insert table row
   * start a table
   */
  function newlineAndContinue(cm) {
      if (cm.getOption("disableInput"))
          { return CodeMirror.Pass; }
      var selections = cm.listSelections();
      var replacements = [];
      for (var i$1 = 0, list = selections; i$1 < list.length; i$1 += 1) {
          var range = list[i$1];

        var pos = range.head;
          var rangeEmpty = range.empty();
          var eolState = cm.getStateAfter(pos.line);
          var line = cm.getLine(pos.line);
          var handled = false;
          if (!handled) {
              var inList = eolState.list !== false;
              var inQuote = eolState.quote;
              var match = LoQRE.exec(line);
              var cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch));
              if (rangeEmpty && (inList || inQuote) && match && !cursorBeforeBullet) {
                  handled = true;
                  if (emptyLoQRE.test(line)) {
                      if (!/>\s*$/.test(line))
                          { cm.replaceRange("", { line: pos.line, ch: 0 }, { line: pos.line, ch: pos.ch + 1 }); }
                      replacements.push("\n");
                  }
                  else {
                      var indent = match[1], after = match[5];
                      var numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0);
                      var bullet = numbered ? (parseInt(match[3], 10) + 1) + match[4] : match[2].replace("x", " ");
                      replacements.push("\n" + indent + bullet + after);
                      if (numbered)
                          { incrementRemainingMarkdownListNumbers(cm, pos); }
                  }
              }
          }
          if (!handled) {
              var table = rangeEmpty ? eolState.hmdTable : 0 /* NONE */;
              if (table != 0 /* NONE */) {
                  if (/^[\s\|]+$/.test(line) && (pos.line === cm.lastLine() || (cm.getStateAfter(pos.line + 1).hmdTable !== table))) {
                      // if this is last row and is empty
                      // remove this row and insert a new line
                      cm.setCursor({ line: pos.line, ch: 0 });
                      cm.replaceRange("\n", { line: pos.line, ch: 0 }, { line: pos.line, ch: line.length });
                  }
                  else {
                      // insert a row below
                      var columns = eolState.hmdTableColumns;
                      var newline = repeatStr("  |  ", columns.length - 1);
                      var leading = "\n";
                      if (table === 2 /* NORMAL */) {
                          leading += "| ";
                          newline += " |";
                      }
                      // There are always nut users!
                      if (eolState.hmdTableRow == 0) {
                          cm.setCursor({ line: pos.line + 1, ch: cm.getLine(pos.line + 1).length });
                      }
                      else {
                          cm.setCursor({ line: pos.line, ch: line.length });
                      }
                      cm.replaceSelection(leading);
                      cm.replaceSelection(newline, "start");
                  }
                  handled = true;
                  return;
              }
              else if (rangeEmpty && pos.ch >= line.length && !eolState.code && !eolState.hmdInnerMode && /^\|.+\|.+\|$/.test(line)) {
                  // current line is   | this | format |
                  // let's make a table
                  var lineTokens = cm.getLineTokens(pos.line);
                  var ans = "|", ans2 = "|";
                  for (var i = 1; i < lineTokens.length; i++) { // first token must be "|"
                      var token = lineTokens[i];
                      if (token.string === "|" && (!token.type || !token.type.trim().length)) {
                          ans += " ------- |";
                          ans2 += "   |";
                      }
                  }
                  // multi-cursor is meanless for this
                  // replacements.push("\n" + ans + "\n" + ans2 + "\n")
                  cm.setCursor({ line: pos.line, ch: line.length });
                  cm.replaceSelection("\n" + ans + "\n| ");
                  cm.replaceSelection(ans2.slice(1) + "\n", "start");
                  handled = true;
                  return;
              }
          }
          if (!handled) {
              if (rangeEmpty && line.slice(pos.ch - 2, pos.ch) == "$$" && /math-end/.test(cm.getTokenTypeAt(pos))) {
                  // ignore indentations of MathBlock Tex lines
                  replacements.push("\n");
                  handled = true;
              }
          }
          if (!handled) {
              cm.execCommand("newlineAndIndent");
              return;
          }
      }
      cm.replaceSelections(replacements);
  }
  /** insert "\n" , or if in list, insert "\n" + indentation */
  function newline(cm) {
      if (cm.getOption("disableInput"))
          { return CodeMirror.Pass; }
      var selections = cm.listSelections();
      var replacements = repeat("\n", selections.length);
      for (var i = 0; i < selections.length; i++) {
          var range = selections[i];
          var pos = range.head;
          var eolState = cm.getStateAfter(pos.line);
          if (eolState.list !== false) {
              replacements[i] += repeatStr(" ", eolState.listStack.slice(-1)[0]);
          }
      }
      cm.replaceSelections(replacements);
  }
  function killIndent(cm, lineNo, spaces) {
      if (!spaces || spaces < 0)
          { return; }
      var oldSpaces = /^ */.exec(cm.getLine(lineNo))[0].length;
      if (oldSpaces < spaces)
          { spaces = oldSpaces; }
      if (spaces > 0)
          { cm.replaceRange("", { line: lineNo, ch: 0 }, { line: lineNo, ch: spaces }); }
  }
  /** unindent or move cursor into prev table cell */
  function shiftTab(cm) {
      var assign;

      var selections = cm.listSelections();
      var tokenSeeker = new TokenSeeker(cm);
      for (var i = 0; i < selections.length; i++) {
          var range = selections[i];
          var left = range.head;
          var right = range.anchor;
          var rangeEmpty = range.empty();
          if (!rangeEmpty && CodeMirror.cmpPos(left, right) > 0)
              { (assign = [left, right], right = assign[0], left = assign[1]); }
          else if (right === left) {
              right = range.anchor = { ch: left.ch, line: left.line };
          }
          var eolState = cm.getStateAfter(left.line);
          if (eolState.hmdTable) {
              tokenSeeker.setPos(left.line, left.ch);
              var isNormalTable = eolState.hmdTable === 2 /* NORMAL */; // leading and ending | is not omitted
              var line = left.line;
              var lineText = cm.getLine(line);
              var chStart = 0, chEnd = 0;
              var rightPipe = tokenSeeker.findPrev(isRealTableSep);
              if (rightPipe) { // prev cell is in this line
                  var leftPipe = tokenSeeker.findPrev(isRealTableSep, rightPipe.i_token - 1);
                  chStart = leftPipe ? leftPipe.token.end : 0;
                  chEnd = rightPipe.token.start;
                  if (chStart == 0 && isNormalTable)
                      { chStart += lineText.match(/^\s*\|/)[0].length; }
              }
              else { // jump to prev line, last cell
                  if (eolState.hmdTableRow == 0)
                      { return; } // no more row before
                  if (eolState.hmdTableRow == 2)
                      { line--; } // skip row #1 (| ----- | ----- |)
                  line--;
                  lineText = cm.getLine(line);
                  tokenSeeker.setPos(line, lineText.length);
                  var leftPipe = tokenSeeker.findPrev(isRealTableSep);
                  chStart = leftPipe.token.end;
                  chEnd = lineText.length;
                  if (isNormalTable)
                      { chEnd -= lineText.match(/\|\s*$/)[0].length; }
              }
              if (lineText.charAt(chStart) === " ")
                  { chStart += 1; }
              if (chStart > 0 && lineText.substr(chStart - 1, 2) === ' |')
                  { chStart--; }
              if (lineText.charAt(chEnd - 1) === " ")
                  { chEnd -= 1; }
              cm.setSelection({ line: line, ch: chStart }, { line: line, ch: chEnd });
              return;
          }
          else if (eolState.listStack.length > 0) {
              var lineNo = left.line;
              while (!ListRE.test(cm.getLine(lineNo))) { // beginning line has no bullet? go up
                  lineNo--;
                  var isList = cm.getStateAfter(lineNo).listStack.length > 0;
                  if (!isList) {
                      lineNo++;
                      break;
                  }
              }
              var lastLine = cm.lastLine();
              var tmp = (void 0);
              for (; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++) {
                  var listStack = cm.getStateAfter(lineNo).listStack;
                  var listLevel = listStack.length;
                  var spaces = 0;
                  if (listLevel == 1) {
                      // maybe user wants to trimLeft?
                      spaces = tmp[1].length;
                  }
                  else {
                      // make bullets right-aligned
                      spaces = (listStack[listLevel - 1] - (listStack[listLevel - 2] || 0));
                  }
                  killIndent(cm, lineNo, spaces);
                  // if current list item is multi-line...
                  while (++lineNo <= lastLine) {
                      if ( /*corrupted */cm.getStateAfter(lineNo).listStack.length !== listLevel) {
                          lineNo = Infinity;
                          break;
                      }
                      if ( /*has bullet*/ListRE.test(cm.getLine(lineNo))) {
                          lineNo--;
                          break;
                      }
                      killIndent(cm, lineNo, spaces);
                  }
              }
              return;
          }
      }
      cm.execCommand("indentLess");
  }
  /**
   * 1. for tables, move cursor into next table cell, and maybe insert a cell
   * 2.
   */
  function tab(cm) {
      var assign;

      var selections = cm.listSelections();
      var beforeCur = [];
      var afterCur = [];
      var selected = [];
      var addIndentTo = {}; // {lineNo: stringIndent}
      var tokenSeeker = new TokenSeeker(cm);
      /** indicate previous 4 variable changed or not */
      var flag0 = false, flag1 = false, flag2 = false, flag3 = true;
      function setBeforeCur(text) { beforeCur[i] = text; if (text)
          { flag1 = true; } }
      function setAfterCur(text) { afterCur[i] = text; if (text)
          { flag2 = true; } }
      function setSelected(text) { selected[i] = text; if (text)
          { flag3 = true; } }
      for (var i = 0; i < selections.length; i++) {
          beforeCur[i] = afterCur[i] = selected[i] = "";
          var range = selections[i];
          var left = range.head;
          var right = range.anchor;
          var rangeEmpty = range.empty();
          if (!rangeEmpty && CodeMirror.cmpPos(left, right) > 0)
              { (assign = [left, right], right = assign[0], left = assign[1]); }
          else if (right === left) {
              right = range.anchor = { ch: left.ch, line: left.line };
          }
          var eolState = cm.getStateAfter(left.line);
          var line = cm.getLine(left.line);
          if (eolState.hmdTable) {
              // yeah, we are inside a table
              flag0 = true; // cursor will move
              var isNormalTable = eolState.hmdTable === 2 /* NORMAL */;
              var columns = eolState.hmdTableColumns;
              tokenSeeker.setPos(left.line, left.ch);
              var nextCellLeft = tokenSeeker.findNext(isRealTableSep, tokenSeeker.i_token);
              if (!nextCellLeft) { // already last cell
                  var lineSpan = eolState.hmdTableRow === 0 ? 2 : 1; // skip |---|---| line
                  if ((left.line + lineSpan) > cm.lastLine() || cm.getStateAfter(left.line + lineSpan).hmdTable != eolState.hmdTable) {
                      // insert a row after this line
                      left.ch = right.ch = line.length;
                      var newline = repeatStr("  |  ", columns.length - 1);
                      // There are always nut users!
                      if (eolState.hmdTableRow === 0) {
                          right.line = left.line += 1;
                          right.ch = left.ch = cm.getLine(left.line).length;
                      }
                      if (isNormalTable) {
                          setBeforeCur("\n| ");
                          setAfterCur(newline + " |");
                      }
                      else {
                          setBeforeCur("\n");
                          setAfterCur(newline.trimRight());
                      }
                      setSelected("");
                  }
                  else {
                      // move cursor to next line, first cell
                      right.line = left.line += lineSpan;
                      tokenSeeker.setPos(left.line, 0);
                      var line$1 = tokenSeeker.line.text;
                      var dummySep = isNormalTable && tokenSeeker.findNext(/hmd-table-sep-dummy/, 0);
                      var nextCellRight = tokenSeeker.findNext(/hmd-table-sep/, dummySep ? dummySep.i_token + 1 : 1);
                      left.ch = dummySep ? dummySep.token.end : 0;
                      right.ch = nextCellRight ? nextCellRight.token.start : line$1.length;
                      if (right.ch > left.ch && line$1.charAt(left.ch) === " ")
                          { left.ch++; }
                      if (right.ch > left.ch && line$1.charAt(right.ch - 1) === " ")
                          { right.ch--; }
                      setSelected(right.ch > left.ch ? cm.getRange(left, right) : "");
                  }
              }
              else {
                  var nextCellRight$1 = tokenSeeker.findNext(/hmd-table-sep/, nextCellLeft.i_token + 1);
                  left.ch = nextCellLeft.token.end;
                  right.ch = nextCellRight$1 ? nextCellRight$1.token.start : line.length;
                  if (right.ch > left.ch && line.charAt(left.ch) === " ")
                      { left.ch++; }
                  if (right.ch > left.ch && line.charAt(right.ch - 1) === " ")
                      { right.ch--; }
                  setSelected(right.ch > left.ch ? cm.getRange(left, right) : "");
              }
              // console.log("selected cell", left.ch, right.ch, selected[i])
          }
          else if (eolState.listStack.length > 0) {
              // add indent to current line
              var lineNo = left.line;
              var tmp = (void 0); // ["  * ", "  ", "* "]
              while (!(tmp = ListRE.exec(cm.getLine(lineNo)))) { // beginning line has no bullet? go up
                  lineNo--;
                  var isList = cm.getStateAfter(lineNo).listStack.length > 0;
                  if (!isList) {
                      lineNo++;
                      break;
                  }
              }
              var firstLine = cm.firstLine();
              var lastLine = cm.lastLine();
              for (; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++) {
                  var eolState$1 = cm.getStateAfter(lineNo);
                  var listStack = eolState$1.listStack;
                  var listStackOfPrevLine = cm.getStateAfter(lineNo - 1).listStack;
                  var listLevel = listStack.length;
                  var spaces = "";
                  // avoid uncontinuous list levels
                  if (lineNo > firstLine && listLevel <= listStackOfPrevLine.length) {
                      if (listLevel == listStackOfPrevLine.length) {
                          // tmp[1] is existed leading spaces
                          // listStackOfPrevLine[listLevel-1] is desired indentation
                          spaces = repeatStr(" ", listStackOfPrevLine[listLevel - 1] - tmp[1].length);
                      }
                      else {
                          // make bullets right-aligned
                          // tmp[0].length is end pos of current bullet
                          spaces = repeatStr(" ", listStackOfPrevLine[listLevel] - tmp[0].length);
                      }
                  }
                  addIndentTo[lineNo] = spaces;
                  // if current list item is multi-line...
                  while (++lineNo <= lastLine) {
                      if ( /*corrupted */cm.getStateAfter(lineNo).listStack.length !== listLevel) {
                          lineNo = Infinity;
                          break;
                      }
                      if ( /*has bullet*/ListRE.test(cm.getLine(lineNo))) {
                          lineNo--;
                          break;
                      }
                      addIndentTo[lineNo] = spaces;
                  }
              }
              if (!rangeEmpty) {
                  flag3 = false;
                  break; // f**k
              }
          }
          else {
              // emulate Tab
              if (rangeEmpty) {
                  setBeforeCur("    ");
              }
              else {
                  setSelected(cm.getRange(left, right));
                  for (var lineNo$1 = left.line; lineNo$1 <= right.line; lineNo$1++) {
                      if (!(lineNo$1 in addIndentTo))
                          { addIndentTo[lineNo$1] = "    "; }
                  }
              }
          }
      }
      // if (!(flag0 || flag1 || flag2 || flag3)) return cm.execCommand("defaultTab")
      // console.log(flag0, flag1, flag2, flag3)
      for (var lineNo$2 in addIndentTo) {
          if (addIndentTo[lineNo$2])
              { cm.replaceRange(addIndentTo[lineNo$2], { line: ~~lineNo$2, ch: 0 }); }
      }
      if (flag0)
          { cm.setSelections(selections); }
      if (flag1)
          { cm.replaceSelections(beforeCur); }
      if (flag2)
          { cm.replaceSelections(afterCur, "start"); }
      if (flag3)
          { cm.replaceSelections(selected, "around"); }
  }
  /**
   * add / delete bracket pair to every selections,
   * or just add left bracket to cursor if nothing selected.
   *
   * This provides a `createStyleToggler`-like feature,
   * but don't rely on HyperMD mode
   *
   * @example
   *     When brackets are "(" and ")" :
   *     (Hello) => Hello   (Selected "(Hello)" or just "Hello")
   *     Hello   => (Hello)
   *
   * @param rightBracket if null, will use leftBracket
   */
  function wrapTexts(cm, leftBracket, rightBracket) {
      var assign;

      if (cm.getOption("disableInput"))
          { return CodeMirror.Pass; }
      var selections = cm.listSelections();
      var replacements = new Array(selections.length);
      var insertBeforeCursor = new Array(selections.length);
      var flag0 = false; // replacements changed
      var flag1 = false; // insertBeforeCursor changed
      var flag2 = false; // selections changed
      if (!rightBracket)
          { rightBracket = leftBracket; }
      var lb_len = leftBracket.length;
      var rb_len = rightBracket.length;
      for (var i = 0; i < selections.length; i++) {
          replacements[i] = insertBeforeCursor[i] = "";
          var range = selections[i];
          var left = range.head;
          var right = range.anchor;
          var line = cm.getLine(left.line);
          if (range.empty()) {
              if (left.ch >= lb_len && line.substr(left.ch - lb_len, lb_len) === leftBracket) {
                  // wipe out the left bracket
                  flag2 = true;
                  left.ch -= lb_len;
              }
              else {
                  // insert left bracket
                  flag1 = true;
                  insertBeforeCursor[i] = leftBracket;
              }
              continue;
          }
          flag0 = true;
          var headAfterAnchor = CodeMirror.cmpPos(left, right) > 0;
          if (headAfterAnchor)
              { (assign = [left, right], right = assign[0], left = assign[1]); }
          var text = cm.getRange(left, right);
          if (left.ch >= lb_len && left.line === right.line) {
              if (line.substr(left.ch - lb_len, lb_len) === leftBracket && line.substr(right.ch, rb_len) === rightBracket) {
                  flag2 = true;
                  right.ch += rb_len;
                  left.ch -= lb_len;
                  text = leftBracket + text + rightBracket;
              }
          }
          if (text.slice(0, lb_len) === leftBracket && text.slice(-rb_len) === rightBracket) {
              replacements[i] = text.slice(lb_len, -rb_len);
          }
          else {
              replacements[i] = leftBracket + text + rightBracket;
          }
      }
      if (flag2)
          { cm.setSelections(selections); }
      if (flag1)
          { cm.replaceSelections(insertBeforeCursor); }
      if (flag0)
          { cm.replaceSelections(replacements, "around"); }
  }
  function createStyleToggler(isStyled, isFormattingToken, getFormattingText) {
      return function (cm) {
          var assign;

          if (cm.getOption("disableInput"))
              { return CodeMirror.Pass; }
          var ts = new TokenSeeker(cm);
          var selections = cm.listSelections();
          var replacements = new Array(selections.length);
          for (var i = 0; i < selections.length; i++) {
              var range = selections[i];
              var left = range.head;
              var right = range.anchor;
              var eolState = cm.getStateAfter(left.line);
              var rangeEmpty = range.empty();
              if (CodeMirror.cmpPos(left, right) > 0)
                  { (assign = [left, right], right = assign[0], left = assign[1]); }
              var rangeText = replacements[i] = rangeEmpty ? "" : cm.getRange(left, right);
              if (rangeEmpty || isStyled(cm.getTokenAt(left).state)) { // nothing selected
                  var line = left.line;
                  ts.setPos(line, left.ch, true);
                  var token = ts.lineTokens[ts.i_token];
                  var state = token ? token.state : eolState;
                  if (!token || /^\s*$/.test(token.string)) {
                      token = ts.lineTokens[--ts.i_token]; // maybe eol, or current token is space
                  }
                  var ref = ts.expandRange(function (token) { return token && (isStyled(token.state) || isFormattingToken(token)); });
                  var from = ref.from;
                  var to = ref.to;
                  if (to.i_token === from.i_token) { // current token "word" is not formatted
                      var f = getFormattingText();
                      if (token && !/^\s*$/.test(token.string)) { // not empty line, not spaces
                          var pos1 = { line: line, ch: token.start }, pos2 = { line: line, ch: token.end };
                          token = from.token;
                          cm.replaceRange(f + token.string + f, pos1, pos2);
                          pos2.ch += f.length;
                          cm.setCursor(pos2);
                          return;
                      }
                      else {
                          replacements[i] = f;
                      }
                  }
                  else { // **wor|d**    **|**   **word|  **|
                      if (isFormattingToken(to.token)) {
                          cm.replaceRange("", { line: line, ch: to.token.start }, { line: line, ch: to.token.end });
                      }
                      if (from.i_token !== to.i_token && isFormattingToken(from.token)) {
                          cm.replaceRange("", { line: line, ch: from.token.start }, { line: line, ch: from.token.end });
                      }
                  }
                  continue;
              }
              var token$1 = cm.getTokenAt(left);
              var state$1 = token$1 ? token$1.state : eolState;
              var formatter = getFormattingText(state$1);
              replacements[i] = formatter + rangeText + formatter;
          }
          cm.replaceSelections(replacements);
      };
  }
  // Auto-updating Markdown list numbers when a new item is added to the
  // middle of a list
  function incrementRemainingMarkdownListNumbers(cm, pos) {
      var listRE = LoQRE;
      var startLine = pos.line, lookAhead = 0, skipCount = 0;
      var startItem = listRE.exec(cm.getLine(startLine)), startIndent = startItem[1];
      do {
          lookAhead += 1;
          var nextLineNumber = startLine + lookAhead;
          var nextLine = cm.getLine(nextLineNumber), nextItem = listRE.exec(nextLine);
          if (nextItem) {
              var nextIndent = nextItem[1];
              var newNumber = (parseInt(startItem[3], 10) + lookAhead - skipCount);
              var nextNumber = (parseInt(nextItem[3], 10)), itemNumber = nextNumber;
              if (startIndent === nextIndent && !isNaN(nextNumber)) {
                  if (newNumber === nextNumber)
                      { itemNumber = nextNumber + 1; }
                  if (newNumber > nextNumber)
                      { itemNumber = newNumber + 1; }
                  cm.replaceRange(nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]), {
                      line: nextLineNumber, ch: 0
                  }, {
                      line: nextLineNumber, ch: nextLine.length
                  });
              }
              else {
                  if (startIndent.length > nextIndent.length)
                      { return; }
                  // This doesn't run if the next line immediatley indents, as it is
                  // not clear of the users intention (new indented item or same level)
                  if ((startIndent.length < nextIndent.length) && (lookAhead === 1))
                      { return; }
                  skipCount += 1;
              }
          }
      } while (nextItem);
  }
  Object.assign(CodeMirror.commands, {
      hmdNewlineAndContinue: newlineAndContinue,
      hmdNewline: newline,
      hmdShiftTab: shiftTab,
      hmdTab: tab,
  });
  var defaultKeyMap = CodeMirror.keyMap["default"];
  var modPrefix = defaultKeyMap === CodeMirror.keyMap["macDefault"] ? "Cmd" : "Ctrl";
  var keyMap = {
      "Shift-Tab": "hmdShiftTab",
      "Tab": "hmdTab",
      "Enter": "hmdNewlineAndContinue",
      "Shift-Enter": "hmdNewline"
  };
  keyMap[(modPrefix + "-B")] = createStyleToggler(function (state) { return state.strong; }, function (token) { return / formatting-strong /.test(token.type); }, function (state) { return repeatStr(state && state.strong || "*", 2); } // ** or __
      );
  keyMap[(modPrefix + "-I")] = createStyleToggler(function (state) { return state.em; }, function (token) { return / formatting-em /.test(token.type); }, function (state) { return (state && state.em || "*"); });
  keyMap[(modPrefix + "-D")] = createStyleToggler(function (state) { return state.strikethrough; }, function (token) { return / formatting-strikethrough /.test(token.type); }, function (state) { return "~~"; });
  keyMap.fallthrough = "default";
  keyMap = CodeMirror.normalizeKeyMap(keyMap);
  CodeMirror.keyMap["hypermd"] = keyMap;
  suggestedEditorConfig.keyMap = "hypermd";

  var hypermd$1 = /*#__PURE__*/Object.freeze({
    newlineAndContinue: newlineAndContinue,
    newline: newline,
    shiftTab: shiftTab,
    tab: tab,
    wrapTexts: wrapTexts,
    createStyleToggler: createStyleToggler,
    get keyMap () { return keyMap; }
  });

  // Import&Export all HyperMD components except PowerPacks

  exports.cmpPos = CodeMirror.cmpPos;
  exports.Mode = hypermd;
  exports.InsertFile = insertFile;
  exports.ReadLink = readLink;
  exports.Hover = hover;
  exports.Click = click;
  exports.Paste = paste;
  exports.Fold = fold;
  exports.FoldImage = foldImage;
  exports.FoldLink = foldLink;
  exports.FoldCode = foldCode;
  exports.FoldMath = foldMath;
  exports.FoldEmoji = foldEmoji;
  exports.FoldHTML = foldHtml;
  exports.TableAlign = tableAlign;
  exports.ModeLoader = modeLoader;
  exports.HideToken = hideToken;
  exports.CursorDebounce = cursorDebounce;
  exports.KeyMap = hypermd$1;
  exports.Addon = addon;
  exports.FlipFlop = FlipFlop;
  exports.tryToRun = tryToRun;
  exports.debounce = debounce;
  exports.addClass = addClass;
  exports.rmClass = rmClass;
  exports.contains = contains;
  exports.repeat = repeat;
  exports.repeatStr = repeatStr;
  exports.visitElements = visitElements;
  exports.watchSize = watchSize;
  exports.makeSymbol = makeSymbol;
  exports.suggestedEditorConfig = suggestedEditorConfig;
  exports.normalVisualConfig = normalVisualConfig;
  exports.fromTextArea = fromTextArea;
  exports.switchToNormal = switchToNormal;
  exports.switchToHyperMD = switchToHyperMD;
  exports.cm_internal = cm_internal;
  exports.TokenSeeker = TokenSeeker;
  exports.getEveryCharToken = getEveryCharToken;
  exports.expandRange = expandRange;
  exports.orderedRange = orderedRange;
  exports.rangesIntersect = rangesIntersect;
  exports.getLineSpanExtractor = getLineSpanExtractor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
