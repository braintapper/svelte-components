<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte'
  import TranslatedInput from './TranslatedInput.svelte'

  dispatch = createEventDispatcher()

  # todo: integrate this into a core lib?
  import HumanEffort from "../../../helpers/human_effort.js"

  `export let value = 0`
  `export let presets = ['8h','4h','2h']`

  effortInput = HumanEffort.humanizeHours(value || 0)

  change = (e)->
    event = {
      inputValue: value
      inHours: HumanEffort.parseHours(value || "")
      inMinutes: HumanEffort.parseHours (value || ""), true
    }
    console.log event
    dispatch "change", event
  debouncedChange = change.debounce(500)

  translateFn = (val)->
    return "#{HumanEffort.parseHours(value || "").format(2)}h"

  validateFn = (val)->
    if val.length == 0
      return false
    else
      return true

  stateFn = (val)->
    if val.length == 0
      return "empty"
    else
      return "ok"



</script>


<style lang="sass">



</style>
<TranslatedInput bind:value={value} maxlength="7" {translateFn} {validateFn} {stateFn} on:change={debouncedChange}/>
