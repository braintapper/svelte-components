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
  let tooltipRef = undefined;

  function openMenu() {

    open = true;
  }

  function closeMenu() {
    open = false;
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      open = false;
    }
  }


  afterUpdate(() => {


    if (open) {
      const { width, height } = buttonRef.getBoundingClientRect();

      buttonWidth = width;

      let offsetX = 0;
      let offsetY = 0;


      if (flipped) {
        tooltipRef.style.left = 'auto';
        tooltipRef.style.right = 0;
      }

      if (direction === 'top') {
        tooltipRef.style.top = 'auto';
        tooltipRef.style.bottom = height + 'px';
      }

      //tooltipRef.style.left = offsetX + 'px';
      //tooltipRef.style.marginTop = offsetY + 'px';
    }


  });
  $: ariaLabel = $$props['aria-label'] || 'menu';


</script>
<style lang="sass">




  [role=tooltip]
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
    border-radius: 6px
    margin: 12px
    padding: 12px
    text-align: left
    font-size: 12px
    line-height: 18px

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


  [tooltipcontainer]
    position: relative
</style>


<div tooltipcontainer {style}>
  <div
  bind:this={buttonRef}
  on:mouseover={openMenu}
  on:mouseout={closeMenu}
  on:click={closeMenu}
  on:blur={closeMenu}
  on:keydown={onKeydown}>
  <slot name="trigger">{@html trigger}</slot>
  </div>
  {#if open}
    <div
      bind:this={tooltipRef}
      {id}
      role="tooltip"
      aria-label={ariaLabel}
      data-floating-menu-direction={direction}
      transition:slide="{{duration: 75}}"
      >
      <span caret />
      <slot />
    </div>
  {/if}
</div>
