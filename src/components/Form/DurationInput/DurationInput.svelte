<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()

  # todo: integrate this into a core lib?
  import HumanEffort from "../../../helpers/human_effort.js"

  `export let value = 0`
  `export let presets = ['8h','4h','2h']`

  effortInput = HumanEffort.humanizeHours(value || 0)

  update = (e)->
    dispatch "change", {
      inputValue: value
      inHours: HumanEffort.parseHours(value || "")
      inMinutes: HumanEffort.parseHours (value || ""), true
    }

  debouncedUpdate = update.debounce(500)

</script>


<style lang="sass">

  [container]
    position: relative
    width: 100%
    [picker-container]
      position: relative

    [button-group]
      padding-left: 8px
      button
        margin: 0px
        border-radius: 0px
        border-right: none
        border-left: 1px solid #ddd
        &:first-child
          border-top-left-radius: 4px
          border-bottom-left-radius: 4px
          border-top-right-radius: 0px
          border-bottom-right-radius: 0px

        &:last-child
          border-top-left-radius: 0px
          border-bottom-left-radius: 0px
          border-top-right-radius: 4px
          border-bottom-right-radius: 4px
          border-right: 1px solid #ddd

</style>


<div container layout="row">
  <div flex>
    <div picker-container>
    <input type="effortpicker" bind:value={value} on:keyup={debouncedUpdate} maxlength="10" class="effort-picker"/>
    <label type="translated-input">{HumanEffort.parseHours(value || "").format(2)}h</label>
    </div>
  </div>
</div>
