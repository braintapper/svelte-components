<script lang="coffeescript">
  import { tick, createEventDispatcher } from 'svelte'

  dispatch = createEventDispatcher()
  # Props
  export value = ''
  export style = undefined
  export type = 'text'
  export placeholder = ''
  export labelClasses = ''
  export inputClasses = ''
  editing = false
  inputEl = undefined
  label = undefined
  # Computed
  `$: isText = type === 'text'`
  `$: isNumber = type === 'number'`
  `$: if (isNumber) {
        label = value === '' ? placeholder : value;
      } else if (isText) {
        label = value ? value : placeholder;
      }
  const toggle = async (_) => {
    editing = !editing;
    if (editing) {
      await tick();
      inputEl.focus();
    }
  }`
  handleInput = (e) ->
    if isNumber
      value = +e.target.value
    else
    value = e.target.value


  handleKeyup = (e) ->
    dispatch("keyup", value)
    if (e.keyCode == 13)
      inputEl.blur()

  handleBlur = (_) ->
    toggle()
    dispatch("update",value)

</script>
<style lang="sass">

  input, div
    font-family: var(--font-family-primary), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
    font-size: var(--font-s)
    border-radius: var(--corner-s)
    &:hover
      background: var(--lightest-gray)
  div
    padding: var(--fine-spacing-xs) var(--fine-spacing-m)
    min-height: var(--font-xl)
    border: 1px solid transparent

  .strikethrough
    text-decoration: line-through


</style>
{#if editing && (isText || isNumber)}
  <input
    class={inputClasses}
    bind:this={inputEl}
    {type}
    {value}
    {placeholder}
    on:input={handleInput}
    on:keyup={handleKeyup}
    on:blur={handleBlur}>
{:else}
  <div
    class={labelClasses}
    on:click={toggle} ellipsis {style}>
    <span ellipsis>{label}&nbsp;</span>
  </div>
{/if}
