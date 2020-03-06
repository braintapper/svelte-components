<script>
  // todo: inject menu width ul[role=menu] or maybe use a class , narrow, medium, wide

  import Calendar from "./Calendar.svelte"

  export let calendarDate = Date.create()
  export let direction = 'bottom';
  export let flipped = false;

  export let id = Math.random();

  export let open = false;
  export let style = undefined;

  let className = undefined;
  export { className as class };

  import { createEventDispatcher, afterUpdate } from 'svelte';
  const dispatch = createEventDispatcher();

  import { slide } from 'svelte/transition';


  let buttonRef = undefined;
  let buttonWidth = undefined;
  let tooltipRef = undefined;

  function openMenu() {

    open = true;
  }

  function closeMenu() {
    open = false;
  }

  function toggleMenu() {
    open = !open
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



      if (flipped) {
        tooltipRef.style.left = 'auto';
        tooltipRef.style.right = 0;
      }

      if (direction === 'top') {
        tooltipRef.style.top = 'auto';
        tooltipRef.style.bottom = height + 'px';
      }


    }


  });


  $: ariaLabel = $$props['aria-label'] || 'menu';

  let setDay = (e) => {
    dispatch("change", e.detail);
    open = false
  }
  let bodyClick = (e)=> {
    // don't do anything if not open
    if (open) {
      e.preventDefault();
      e.stopPropagation();
      // window.evv = e for debugging
      var found = false;
      var foundId = null
      // see if this component's id is found in the lineage of the clicked event's target
      e.path.forEach((item, index)=>{
        if (index < (e.path.length - 2)) {
          if (item.hasAttributes()) {
            var pathid = item.attributes.getNamedItem("id");
            if (pathid != null) {
              if (pathid.value == id) {
                found = true;
              }
            }
          }
        }
      })
      if (found) {
        // leave open
      } else {
        // close
        open = false
      }
    }
  }
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
    width: auto
    list-style: none
    top: 32px
    left: 0
    border-radius: 6px


    text-align: left
    font-size: 12px
    line-height: 18px




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
    border: 1px solid black
    position: relative
</style>

<svelte:body on:click={bodyClick}/>
<div tooltipcontainer {style} {id}>
  <button
  bind:this={buttonRef}
  on:click={openMenu}
  {id}
  on:keydown={onKeydown}>
  <slot></slot> - {open}
  </button>
  {#if open}
    <div
      bind:this={tooltipRef}
      role="tooltip"
      aria-label={ariaLabel}
      data-floating-menu-direction={direction}
      transition:slide="{{duration: 75}}"
      id="-{id}"
      >
      <Calendar {calendarDate} on:setDay={setDay}/>
    </div>
  {/if}
</div>
