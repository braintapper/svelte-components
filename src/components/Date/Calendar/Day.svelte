<script lang="coffeescript">
  import { createEventDispatcher } from 'svelte'
  `export let calendarDate = Date.create()`
  `export let events = []`
  `export let showColumnHeadings = false`
  `export let showRowHeadings = false`
  dispatch = createEventDispatcher()

  interval = 15

  blocks = []

  quarters = (minutes)->
    return Math.ceil(minutes / 15)

  starting15 = (currentTime)->
    currentTime = currentTime || Date.create()
    partialDate = currentTime.format("{yyyy}-{MM}-{dd}T{HH}:")

    currentMinutes = parseInt(currentTime.format("{mm}"))

    # todo: this could be more elegant
    if (currentMinutes >= 0) and (currentMinutes < 15)
      minutes = 0
    else if (currentMinutes >= 15) and (currentMinutes < 30)
      minutes = 15
    else if (currentMinutes >= 30) and (currentMinutes < 45)
      minutes = 30
    else
      minutes = 45
    return Date.create("#{partialDate}#{minutes.pad(2)}:00")

  nearest15 = (currentTime)->
    partialDate = currentTime.format("{yyyy}-{MM}-{dd}T{HH}:")

    currentMinutes = parseInt(currentTime.format("{mm}"))

    # todo: this could be more elegant
    if (currentMinutes > 7) and (currentMinutes <= 22)
      minutes = 15
    else if (currentMinutes > 22) and (currentMinutes <= 37)
      minutes = 30
    else if (currentMinutes > 37) and (currentMinutes <=52)
      minutes = 45
    else
      minutes = 0

    return Date.create("#{partialDate}#{minutes.pad(2)}:00")








  eventsForBlock = (block)->
    format = "{yyyy}{MM}{dd}{HH}{mm}"
    blockString = Date.create(block).format(format)
    found = dayEvents.filter (event)->
      return starting15(event.start).format(format) == blockString
    return found


  overlapsForBlock = (block)->
    format = "{yyyy}{MM}{dd}{HH}{mm}"
    blockString = Date.create(block).format(format)
    found = events.filter (event)->
      return starting15(event.start).format(format) == blockString
    return found


  # use this to set the width

  ###

  Logic

  * Check for any collisions for event''s blocks
  * Get the position of the blocks

  * Full width = 100% - 10px - the 10px leaves room for the add button

  Calcs below based on Full Width, not the whole container
  * If no collisions
    * width = 100%
    * otherwise width / max collisions


  ###


  overlapsForEvent = (event)->
    # overlap IF
    # eventStartDate  is between compareEvent start date and End date
    # event EndDate is between compareEvent start date and end date




  # preprocess the events
  dayEvents = []

  events.forEach (event, index)->
    matchFormat = "{yyyy}{MM}{dd}"
    unless event.start?
      event.start = Date.create()
    if calendarDate.format(matchFormat) == event.start.format(matchFormat)

      # precalcs

      event["startBlock"] = starting15(event.start)

      event["blockHeight"] = quarters(event.durationMinutes)

      event["overlapIndex"] = 20

      event["overlapCount"] = 0  # total overlaps with this block
      event["startx"] = 0
      event["endx"] = 0
      event["starty"] = 0
      event["endy"] = 0

      event["style"] = "top: -1px; left: #{event.overlapIndex}px; height: #{quarters(event.durationMinutes) * 23 + 1}px"
      # todo:

      dayEvents.append event




  createRange = ()->
    runningTime = calendarDate.clone().beginningOfDay()

    blocks.push runningTime.clone()

    while runningTime.isBetween(calendarDate.clone().beginningOfDay(), calendarDate.clone().endOfDay().addMinutes(-15))
      runningTime.addMinutes(15)
      blocks.push runningTime.clone()

  createRange()

  addEvent = (datetime)->
    dispatch "addEvent", datetime

  editEvent = (event)->
    console.log "editEvent"
    console.log event

</script>
<style lang="sass">
  table
    width: 100%
    border-spacing: 0
    border-collapse: collapse
  td
    position: relative
    padding: 0px
    border: 1px solid black
  button
    padding: 0px
    margin: 0px
    height: 20px
    width: 100%
    width: 30px
    &[add]
      z-index: 100
      height: 100%
      width: 100%
    &[event]
      position: absolute
      z-index: 110
  pre
    position: absolute
    top: 0px
    left: 0px

</style>
<template>

  <table>
    {#if showColumnHeadings}
    <thead>
      <tr>
        {#if showRowHeadings}
        <th> &nbsp; </th>
        {/if}
        <th> {calendarDate.format("{d}")} </th>
      </tr>
    </thead>
    {/if}
    <tbody>
      {#each blocks as block, index}
      <tr>
        {#if showRowHeadings}
        {#if block.format("{mm}") == "00"}
        <td rowspan=4>{block.format("{HH}:{mm}")}</td>
        {/if}
        {/if}
        <td>
          <button add on:click={addEvent(block)}>&nbsp;</button>
          {#each eventsForBlock(block) as event}
            <button style="{event.style}" event on:click={editEvent(event)}>*</button>
          {/each}
        </td>
      </tr>
      {/each}
    </tbody>
    </table>
</template>
