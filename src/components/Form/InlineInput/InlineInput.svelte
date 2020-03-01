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
    width: 100%
    max-width: 100%
    padding: 6px
    border-radius: 6px
    margin: 0px
    &:hover
      background: #eeeeee

  div
    min-height: 24px
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
