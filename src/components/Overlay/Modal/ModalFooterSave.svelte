<script>

  import { createEventDispatcher, onDestroy } from 'svelte';

  var cancel, dispatch, save;

  dispatch = createEventDispatcher();

  save = function() {
    return dispatch('save');
  };

  cancel = function() {
    return dispatch('cancel');
  };

</script>
<div layout="row">
    <div flex="flex">&nbsp;</div>
    <div flex="initial" a="r"><button on:click="{cancel}">Cancel</button></div>
    <div flex="initial"><button on:click="{save}" bg="dark-blue" fg="white" ml="12">Save</button></div>
    

</div>
