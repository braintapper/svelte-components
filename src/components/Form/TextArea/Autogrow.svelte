<script lang="coffeescript">

  export value = undefined
  export style = undefined
  export classes = undefined
  export id = undefined

  textarea = undefined


  change = (e)->
    textarea.style.height = "" # /* Reset the height*/
    textarea.style.height = (textarea.scrollHeight + 40) + "px"#


</script>

<style lang="sass">

  textarea
    height: auto

</style>


<textarea bind:this={textarea} bind:value on:change={change} on:keyup={change} {style} class={classes} {id}></textarea>
