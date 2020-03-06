<script>

  import { createEventDispatcher, onDestroy } from 'svelte';

  var cancel, dispatch;

  dispatch = createEventDispatcher();



  cancel = function() {
    return dispatch('cancel');
  };

</script>
<div layout="row">
    <div flex="flex">&nbsp;</div>
    <div flex="initial" a="r"><button type="button" on:click="{cancel}">Cancel</button></div>
</div>
