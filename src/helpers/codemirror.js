var createCodeMirrorInstance;

import {
  readable,
  writable
} from 'svelte/store';

import CodeMirrorModes from "./codemirror_modes.js";

createCodeMirrorInstance = function() {
  var cb, dbcb;
  cb = function() {
    return console.log("Code mirror modes initialized");
  };
  const { subscribe, set, update } = writable(null);
  dbcb = function() {
    return databaseLoaded.set(true);
  };
  return new CodeMirrorModes(subscribe, set, update, cb);
};

export const modes = createCodeMirrorInstance();
