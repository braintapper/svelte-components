<script>
  // todo: inject menu width ul[role=menu] or maybe use a class , narrow, medium, wide


  let className = undefined;
  export { className as class };
  export let direction = 'bottom';
  export let flipped = false;

  export let id = Math.random();

  export let event = null;
  export let menuItems = [];
  export let open = false;
  export let style = undefined;
  export let tabindex = '0';

  import { createEventDispatcher,  afterUpdate } from 'svelte';
  import { slide } from 'svelte/transition';
  import { writable } from 'svelte/store';


  const dispatch = createEventDispatcher();

  let items = writable([]);
  let currentId = writable(undefined);
  let focusedId = writable(undefined);
  let currentIndex = writable(-1);

  let clicks = 0

  let menuRef = undefined;

  console.log("window.innerHeight", window.innerHeight)
  console.log("window.innerWidth", window.innerWidth)

  afterUpdate(() => {
    // position menu

    if (menuRef != undefined) {
      if ($currentIndex < 0) {
        menuRef.focus();
      }

      if (flipped) {
        //menuRef.style.left = 'auto';
        menuRef.style.right = event.jsEvent.x + 'px';
      }
      else
      {
        menuRef.style.left = event.jsEvent.x + 'px';
      }

      if (direction === 'top') {
        menuRef.style.top = event.jsEvent.y + 'px';//height + 'px';
      } else {
        menuRef.style.top = event.jsEvent.y + 'px'
      }
    }
  });

  let menuClick = (i) => {
    console.log("menuClick")
    let response = {
      action: i,
      event: event.event
    };
    console.log(event);
    dispatch("close",response)
  }


  $: ariaLabel = $$props['aria-label'] || 'menu';
  $: if ($items[$currentIndex]) {
    focusedId.set($items[$currentIndex].id);
  }


</script>
<style lang="sass">


  menu
    margin: 0px
    padding: 0px

    border: none
    background: none
    appearance: none

    cursor: pointer
    width: auto

    position: absolute

    display: block

    cursor: pointer
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3)
    z-index: 10000



    ul[role=menu]

      //display: none

      display: block
      align-items: flex-start


      background-color: #ffffff
      width: 12rem
      list-style: none


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




<svelte:body
  on:click={({ target }) => {

    if (menuRef && menuRef.contains(target)) {
      // clicked on a menu item
      //console.log("menu item clicked");
      // dispatch('close', { index, text })
    } else {
      // don't blur on first click event
      if (clicks > 0) {
        dispatch("close","blur");
      }
    }
    clicks++
  }} />


<menu bind:this={menuRef} on:blur={blur}>
  <ul
    role="menu"
    tabindex="-1"
    aria-label={ariaLabel}
    data-floating-menu-direction={direction}
    transition:slide="{{duration: 75}}"
    >
    {#each menuItems as item}
      <li role="menuitem">
        <button on:click={menuClick(item.event)} layout="row">
          <div flex>{item.label}</div>
        </button>
      </li>
    {/each}
  </ul>
</menu>
