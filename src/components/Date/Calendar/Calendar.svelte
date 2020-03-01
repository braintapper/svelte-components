<script lang="coffeescript">

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()


  import EventModal from "./EventModal.svelte"
  eventModal = false

  saveCb = ()->
    cancel()

  cancel = ()->
    eventModal = false
  addEvent = ()->
    eventModal = true


  save = (e)->
    console.log "month"
    console.log e.detail
    dispatch "saveEvent", e.detail
    cancel()




  `export let view`

  console.log "Calendar.svelte"
  console.log view


  calendarView = view

  setView = (period)->
    calendarView = period
    dispatch "viewChange", period


  setWeek = (e)->
    console.log "setWeek"
    console.log e.detail
    calendarView = "week"
    calendarDate = e.detail

  setDay = (e)->
    console.log "setDay"
    calendarView = "day"
    console.log "calendar view #{calendarView}"
    console.log e.detail
    calendarDate = e.detail

  setMonth = (e)->
    console.log "setMonth"
    console.log e.detail
    calendarView = "month"
    calendarDate = e.detail

  `$: view = calendarView`
</script>

<style lang="sass">

</style>


<h2>{calendarDate}</h2>
<h2>{view}</h2>
<nav>
  <button on:click={setView("month")}>Month</button>
  <button on:click={setView("week")}>Week</button>
  <button on:click={setView("day")}>Day</button>
  <button on:click={setView("list")}>List</button>
  <button on:click={setView("settings")}>Settings</button>
</nav>

<div>

  <button on:click={addEvent}>Add Event</button>

</div>

{#if view=="month"}
<Month on:setWeek={setWeek} on:setDay={setDay} on:setMonth={setMonth} {calendarDate}/>
{/if}
{#if view=="week"}
<Week {calendarDate} on:setDay={setDay} on:setWeek={setWeek}  />
{/if}
{#if view=="day"}
<Day {calendarDate} on:setDay={setDay} showColumnHeadings={true} showRowHeadings={true}/>
{/if}

{#if view=="list"}
<h1>list</h1>
{/if}
{#if view=="settings"}
<h1>settings</h1>
{/if}
{#if eventModal}
<EventModal on:cancel={cancel} on:save={save}/>
{/if}
