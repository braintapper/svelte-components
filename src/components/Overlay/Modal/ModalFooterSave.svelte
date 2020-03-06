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
    <div flex="initial" a="r"><button  type="button" on:click="{cancel}">Cancel</button></div>
    <div flex="initial"><button on:click="{save}" type="button" normal primary ml="12">Save</button></div>


</div>
