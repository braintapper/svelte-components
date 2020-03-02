<script>
  import { onDestroy } from 'svelte';

  //window.scrollTo(0,0)
  document.body.style = "overflow:hidden"

  onDestroy( () => {
    document.body.style = ""
  })
  let modal;

  var handle_keydown, previously_focused;

  handle_keydown = function(e) {
    var index, nodes, ref, tabbable;
    if (e.key === 'Escape') {
      close();
      return;
    }
    /*
    if (e.key === 'Tab') {
      nodes = modal.querySelectorAll('*');
      tabbable = Array.from(nodes).filter(n((function(_this) {
        return function() {
          return n.tabIndex >= 0;
        };
      })(this)));
      index = tabbable.indexOf(document.activeElement);
      if (index === -1 && e.shiftKey) {
        index = 0;
      }
      index += tabbable.length + ((ref = e.shiftKey) != null ? ref : -{
        1: 1
      });
      index %= tabbable.length;
      tabbable[index].focus();
      return e.preventDefault();
    } */
  };

  previously_focused = typeof document !== 'undefined' && document.activeElement;

  if (previously_focused) {
    onDestroy(function() {
      return previously_focused.focus();
    });
  }


</script>


<style>
  modal-background {
      position: fixed;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1000;
  }

  modal {
      display: block;
      position: fixed;
      left: 50%;
      top: 50%;
      width: calc(100vw - 4em);
      max-width: 32em;
      max-height: calc(100vh - 4em);
      overflow: show;
      transform: translate(-50%, -50%);
      padding: 1em;
      border-radius: 0.2em;
      background: white;
      z-index: 1001;
  }

  modal-header, modal-footer, modal-body {
      width: 100%;
      max-width: 100%;
      display: block;
  }

  modal-body {
      display: block;
      padding: 12px 0px 18px 0px;
  }

</style>


<svelte:window on:keydown={handle_keydown}/>
<modal-background></modal-background>
<modal role="dialog" aria-modal="true" bind:this={modal}>
    <modal-header>
        <slot name="header"></slot>
    </modal-header>
    <modal-body>
        <slot></slot>
    </modal-body>
    <modal-footer>
        <slot name="footer"></slot>
    </modal-footer>
</modal>
