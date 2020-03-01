<script>
  // todo: inject menu width ul[role=menu] or maybe use a class , narrow, medium, wide


  let className = undefined;
  export { className as class };
  export let direction = 'bottom';
  export let flipped = false;
  export let icon = undefined;
  export let iconClass = undefined;
  export let iconDescription = 'Open and close list of options';
  export let id = Math.random();

  export let open = false;
  export let style = undefined;
  export let tabindex = '0';

  import { createEventDispatcher, setContext, afterUpdate } from 'svelte';
  import { slide } from 'svelte/transition';
  import { writable } from 'svelte/store';


  const dispatch = createEventDispatcher();

  let items = writable([]);
  let currentId = writable(undefined);
  let focusedId = writable(undefined);
  let currentIndex = writable(-1);

  let buttonRef = undefined;
  let buttonWidth = undefined;
  let menuRef = undefined;

  setContext('OverflowMenu', {
    focusedId,
    add: ({ id, text, primaryFocus }) => {
      items.update(_ => {
        if (primaryFocus) {
          currentIndex.set(_.length);
        }

        return [..._, { id, text, primaryFocus, index: _.length }];
      });
    },
    update: id => {
      currentId.set(id);
    },
    change: direction => {
      // TODO: skip disabled
      let index = $currentIndex + direction;

      if (index < 0) {
        index = $items.length - 1;
      } else if (index >= $items.length) {
        index = 0;
      }

      currentIndex.set(index);
    }
  });

  afterUpdate(() => {
    if ($currentId) {
      const { index, text } = $items.filter(_ => _.id === $currentId)[0];
      dispatch('close', { index, text });
      open = false;
    }

    if (open) {
      const { width, height } = buttonRef.getBoundingClientRect();

      buttonWidth = width;

      if ($currentIndex < 0) {
        menuRef.focus();
      }

      if (flipped) {
        menuRef.style.left = 'auto';
        menuRef.style.right = 0;
      }

      if (direction === 'top') {
        menuRef.style.top = 'auto';
        menuRef.style.bottom = height + 'px';
      }
    }

    if (!open) {
      //buttonRef.focus(); -- this causes unwanted scrolling after item selected
      items.set([]);
      currentId.set(undefined);
    }
  });

  $: ariaLabel = $$props['aria-label'] || 'menu';
  $: if ($items[$currentIndex]) {
    focusedId.set($items[$currentIndex].id);
  }


</script>
<style lang="sass">


  button
    margin: 0px
    padding: 0px
    display: inline-block
    border: none
    background: none
    appearance: none

    cursor: pointer
    width: 100%

    position: relative
    width: 24px
    height: 24px
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer





    ul[role=menu]
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3)
      //display: none

      flex-direction: column
      align-items: flex-start
      position: absolute
      z-index: 10000
      background-color: #ffffff
      width: 12rem
      list-style: none
      top: 32px
      left: 0

      &::after
        content: ''
        position: absolute
        display: block
        background-color: #f4f4f4


      &[data-floating-menu-direction='bottom']::after
        top: -0.1875rem
        left: 0
        width: 2rem
        height: 0.1875rem

      &[data-floating-menu-direction='top']::after
        bottom: -0.5rem
        left: 0
        width: 2rem
        height: 0.5rem

      &[data-floating-menu-direction='left']::after
        right: -0.375rem
        top: 0
        height: 2rem
        width: 0.375rem

      &[data-floating-menu-direction='right']::after
        top: 0
        left: -0.375rem
        height: 2rem
        width: 0.375rem



</style>




<svelte:body
  on:click={({ target }) => {
    if (buttonRef && buttonRef.contains(target)) {
      return;
    }
    if (menuRef && !menuRef.contains(target)) {
      open = false;
    }
  }} />

<button
  bind:this={buttonRef}
  aria-haspopup
  aria-expanded={open}
  aria-label={ariaLabel}
  on:click
  on:click={({ target }) => {
    if (!(menuRef && menuRef.contains(target))) {
      open = !open;
    }
  }}
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:keydown
  on:keydown={event => {
    if (open) {
      if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
      } else if (event.key === 'Escape') {
        event.stopPropagation();
        open = false;
      }
    }
  }}
  {id}
  {tabindex}
  {style}>
  <slot name="menu">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
  </slot>
  {#if open}
    <ul
      bind:this={menuRef}
      role="menu"
      tabindex="-1"
      aria-label={ariaLabel}
      data-floating-menu-direction={direction}
      transition:slide="{{duration: 75}}"
      >
      <slot />
    </ul>
  {/if}
</button>
