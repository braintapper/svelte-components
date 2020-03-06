var createLoaderInstance;

import {
  readable,
  writable
} from 'svelte/store';

import ScriptLoader from "./script_loader.js";

createLoaderInstance = function() {
  var cb, dbcb;
  cb = function() {
    return console.log("Code mirror modes initialized");
  };
  const { subscribe, set, update } = writable(null);
  dbcb = function() {
    return databaseLoaded.set(true);
  };
  return new ScriptLoader(subscribe, set, update, cb);
};

export const loader = createLoaderInstance();
