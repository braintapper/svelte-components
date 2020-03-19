<script lang="coffeescript">

  import Modal from "../../Overlay/Modal/ModalGeneric.svelte"
  import ModalFooterSave from "../../Overlay/Modal/ModalFooterDelete.svelte"





  import uuid from 'uuid'

  import { createEventDispatcher } from 'svelte'

  export event = null

  dispatch = createEventDispatcher()




  destroy = ()->
    return dispatch('confirm-delete', event)


  cancel = ()->
    return dispatch('cancel')


</script>
<Modal>
  <h1 slot="header" fg="darkest-red">Delete this event?</h1>
  <p>
  This event will be permanently deleted.
  </p>

  <div slot="footer">

  <div layout="row">
      <div flex="flex">&nbsp;</div>
      <div flex="initial" a="r"><button on:click="{cancel}" type="button" normal>Cancel</button></div>
      <div flex="initial"><button on:click="{destroy}" type="button" normal critical margin-left-s>Delete</button></div>
  </div>

  </div>
</Modal>
