<script>
import { tick, createEventDispatcher } from 'svelte';

let dispatch = createEventDispatcher();
// Props
export let value = '';
export let style = undefined;
export let type = 'text';
export let placeholder = '';
export let labelClasses = '';
export let inputClasses = '';
let editing = false;
let inputEl;
let label;
// Computed
$: isText = type === 'text';
$: isNumber = type === 'number';
$: if (isNumber) {
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
};
const handleInput = (e) => {
  value = isNumber ? +e.target.value : e.target.value;
};
const handleKeyup = (e) => {
  dispatch("keyup", value);
  if (e.keyCode === 13) inputEl.blur();
};
const handleBlur = (_) => {
  toggle();
  dispatch("update",value);
};
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
