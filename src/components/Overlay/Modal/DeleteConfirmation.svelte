<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte';

  dispatch = createEventDispatcher()

  import Modal from "./ModalGeneric.svelte"
  import ModalFooterDelete from "./ModalFooterDelete.svelte"

  confirm = ()->
    dispatch "confirmDelete"
  cancel = ()->
    dispatch "cancel"

</script>


<Modal>
  <div slot="header">Delete this item?</div>
  <div slot="footer"><ModalFooterDelete on:cancel={cancel} on:confirm={confirm}/></div>
  <div>
    Are you sure you want to do this?
  </div>
</Modal>
