<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()


  `export let autofocus = false`
  `export let closeButtonLabelText = 'Clear search input'`
  `export let id = uuid()`
  `export let placeholder = 'Search...'`

  `export let value = ''`

  inputRef = undefined

  clear = ()->
    `value = ''`
    inputRef.focus()
  `$: showClear = (value != '')`
</script>
<style lang="sass">
  div

    input
      // accommodate icons
      padding: var(--fine-spacing-s) var(--padding-input-embedded-icon)




</style>

<div>
  <div type="button" icon input-left>
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
  </div>
  <input
    type="text"
    bind:this={inputRef}
    role="searchbox"
    on:change
    on:keyup
    on:input
    on:input={({ target }) => {
      value = target.value;
    }}
    {autofocus}
    {id}
    {value}
    {placeholder} />
  <button icon type="button" input-right aria-label={closeButtonLabelText}  show={showClear}  on:click={clear}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
  </button>
</div>
