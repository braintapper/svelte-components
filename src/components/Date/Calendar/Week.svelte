<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()
  `export let calendarDate = Date.create()`
  `export let events = []`
  import Day from "./Day.svelte"


  weeks = []

  eventsForDay = (day)->

    if events.length ==  0
      return []
    else
      return events.filter (event)->
        return Date.create(event.start).format("{MM}{dd}") == Date.create(day).format("{MM}{dd}")



  currentMonth = null
  currentCalendarHeader = null


  calendarWeekDays = []

  generate = ()->
    calendarWeekDays = []
    if calendarDate?
      currentCalendarHeader = calendarDate.format("{Month} {yyyy}")
      currentMonth = calendarDate.format("{M}")
      calendarStart = calendarDate.clone().beginningOfWeek()
      calendarEnd = calendarDate.clone().endOfWeek()
      runningDate = calendarStart.clone()

      count = 0
      while runningDate.isBetween(calendarStart, calendarEnd)
        calendarWeekDays.push runningDate.clone()
        runningDate.addDays(1)
    else
      console.log "no current date"


  blocks = []
  createRange = ()->
    runningTime = Date.create().clone().beginningOfDay()

    blocks.push runningTime.clone()

    while runningTime.isBetween(Date.create().clone().beginningOfDay(), Date.create().clone().endOfDay().addHours(-1))
      runningTime.addHours(1)
      blocks.push runningTime.clone()

  createRange()




  current = ()->
    calendarDate = Date.create().clone()
    console.log calendarDate

    generate()
    setWeek(calendarDate)

  next = ()->
    calendarDate.addWeeks(1)
    generate()
    setWeek(calendarDate)
    console.log "calendarDate #{calendarDate}"


  previous = ()->
    calendarDate.addWeeks(-1)
    generate()
    setWeek(calendarDate)
    console.log "calendarDate #{calendarDate}"



  setWeek = (day)->
    dispatch("setWeek", day)

  setDay = (day)->
    dispatch("setDay", day)

  current()

  addEvent = (e)->
    # e.detail = datetime
    dispatch "addEvent", e.detail


</script>

<style lang="sass">
  table
    border: 1px solid gray
    padding: 14px
    border-spacing: 0
    border-collapse: collapse
  tr[monthname]
    td
      font-weight: bold
      text-align: center
      padding: 6px 0px 18px 0px
      font-size: 18px
  tr[weekdays]
    td
      text-align: center

  tbody
    td
      text-align: center
      height: 32px
      width: 32px
      font-weight: bold

  [month=previous]
    color: #dddddd
  [month=next]
    color: #dddddd

  tfoot
    button
      padding: 0px
      background: none
      border: none
      &:hover
        color: blue

  td
    vertical-align: top

  .hours

  .hour
    height: 92px
    border: 1px solid black
  th[events]
    background: tan
  th[events="0"]
    background: none

  button
    background: none
</style>




<h1>Week</h1>




<table calendar>
  <thead>
    <tr monthname>
      <th colspan="8">{currentCalendarHeader}</th>
    </tr>
    <tr weekdays>
      <th>&nbsp;</th>
      <th>S</th>
      <th>M</th>
      <th>T</th>
      <th>W</th>
      <th>T</th>
      <th>F</th>
      <th>S</th>
    </tr>
      <tr>
        <th></th>
        {#each calendarWeekDays as day, dayindex}
          {#if (parseInt(day.format("{M}")) < parseInt(currentMonth)) }
              <th month="previous" events={eventsForDay(day).length}><button on:click={setDay(day)}>{day.format("{d}")}</button></th>
          {/if}
          {#if (parseInt(day.format("{M}")) > parseInt(currentMonth)) }
              <th month="next" events={eventsForDay(day).length}><button on:click={setDay(day)}>{day.format("{d}")}</button></th>
          {/if}
          {#if (parseInt(day.format("{M}")) == parseInt(currentMonth)) }
              <th month="current" events={eventsForDay(day).length}><button on:click={setDay(day)}>{day.format("{d}")}</button></th>
          {/if}

        {/each}
      </tr>
  </thead>
  <tbody>


      <tr>
        <td valign="top">
          <table>
            {#each blocks as block, index}

              <tr class="hour">


                <td>{block.format("{HH}")}</td>

              </tr>

            {/each}
          </table>
        </td>
        {#each calendarWeekDays as day, dayindex}
          {#if (parseInt(day.format("{M}")) < parseInt(currentMonth)) }
              <td month="previous"><Day calendarDate={day} {events} on:addEvent={addEvent}/></td>
          {/if}
          {#if (parseInt(day.format("{M}")) > parseInt(currentMonth)) }
              <td month="next"><Day calendarDate={day} {events} on:addEvent={addEvent}/></td>
          {/if}
          {#if (parseInt(day.format("{M}")) == parseInt(currentMonth)) }
              <td month="current"><Day calendarDate={day} {events} on:addEvent={addEvent}/></td>
          {/if}

        {/each}
      </tr>

  </tbody>
  <tfoot>
    <tr>

      <td colspan="2"><button type="button" on:click={previous}>&lt;</button></td>
      <td></td>
      <td><button type="button" on:click={current}>&bull;</button></td>
      <td></td>
      <td colspan="2"><button type="button" on:click={next}>&gt;</button></td>

    </tr>
  </tfoot>

</table>
