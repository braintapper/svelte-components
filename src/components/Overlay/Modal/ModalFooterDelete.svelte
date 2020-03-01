<script>

  import { createEventDispatcher, onDestroy } from 'svelte';

  var cancel, destroy, dispatch;

  dispatch = createEventDispatcher();

  destroy = function() {
    return dispatch('confirm-delete');
  };

  cancel = function() {
    return dispatch('cancel');
  };
</script>



<div layout="row">
    <div flex="flex">&nbsp;</div>
    <div flex="initial" a="r"><button on:click="{cancel}">Cancel</button></div>
    <div flex="initial"><button on:click="{destroy}" bg="darkest-red" fg="white" ml="12">Delete</button></div>
</div>
