<script>
  let className = undefined;
  export { className as class };
  export let danger = false;
  export let disabled = false;
  export let hasDivider = false;
  export let href = '';
  export let primaryFocus = false;
  export let requireTitle = true;
  export let style = undefined;
  export let text = 'Provide text';

  import { getContext, afterUpdate } from 'svelte';
  import { cx } from '../lib';

  const id = Math.random();
  const { focusedId, add, update, change } = getContext('OverflowMenu');

  let buttonRef = undefined;

  add({ id, text, primaryFocus });

  afterUpdate(() => {
    if (primaryFocus) {
      buttonRef.focus();
    }
  });

  $: primaryFocus = $focusedId === id;
  $: buttonProps = {
    tabindex: '-1',
    title: requireTitle ? text : undefined,
    disabled: href ? undefined : disabled,
    href: href ? href : undefined
  };
</script>
<style lang="sass">


  li[role=menuitem]
    margin: 0px
    display: -webkit-box
    display: -ms-flexbox
    display: flex
    background-color: transparent
    -webkit-box-align: center
    -ms-flex-align: center
    align-items: center
    width: 100%
    height: 2.5rem
    padding: 0
    -webkit-transition: background-color 110ms cubic-bezier(0, 0, 0.38, 0.9)
    transition: background-color 110ms cubic-bezier(0, 0, 0.38, 0.9)


    button, a
      margin: 0px
      font-size: 0.875rem
      font-weight: 400
      line-height: 1.125rem
      letter-spacing: 0.16px
      outline: 2px solid transparent
      outline-offset: -2px
      font-weight: 400
      width: 100%
      height: 100%
      border: none
      display: -webkit-inline-box
      display: -ms-inline-flexbox
      display: inline-flex
      -webkit-box-align: center
      -ms-flex-align: center
      align-items: center
      background-color: transparent
      text-align: left
      padding: 0 1rem
      cursor: pointer
      color: #393939
      -webkit-transition: outline 110ms cubic-bezier(0, 0, 0.38, 0.9), background-color 110ms cubic-bezier(0, 0, 0.38, 0.9), color 110ms cubic-bezier(0, 0, 0.38, 0.9)
      transition: outline 110ms cubic-bezier(0, 0, 0.38, 0.9), background-color 110ms cubic-bezier(0, 0, 0.38, 0.9), color 110ms cubic-bezier(0, 0, 0.38, 0.9)
      &:hover
        background-color: #e5e5e5
      &:hover, &:focus
        color: #161616


      &::-moz-focus-inner
        border: none

      svg
        fill: #525252

      &:hover svg
        fill: #161616

</style>
<li
  role="menuitem"

  {style}>
  {#if href}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      bind:this={buttonRef}
      {...buttonProps}
      on:click
      on:click={() => {
        update(id);
      }}
      on:keydown
      on:keydown={({ key }) => {
        if (key === 'ArrowDown') {
          change(1);
        } else if (key === 'ArrowUp') {
          change(-1);
        }
      }}>
      <slot>
        <div>{text}</div>
      </slot>
    </a>
  {:else}
    <button
      bind:this={buttonRef}
      {...buttonProps}
      on:click
      on:click={() => {
        update(id);
      }}
      on:keydown
      on:keydown={({ key }) => {
        if (key === 'ArrowDown') {
          change(1);
        } else if (key === 'ArrowUp') {
          change(-1);
        }
      }}>
      <slot>
        <div>{text}</div>
      </slot>
    </button>
  {/if}
</li>
