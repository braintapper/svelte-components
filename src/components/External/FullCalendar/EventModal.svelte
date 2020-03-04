<script lang="coffeescript">

  import Modal from "../../common/ModalGeneric.svelte"
  import ModalFooterSave from "../../common/ModalFooterSave.svelte"
  import DatePicker from "../DatePicker/DatePicker.svelte"
  import EffortPicker from "./DurationPicker.svelte"
  import TimeInput from "./TimeInput.svelte"

  import uuid from 'uuid'

  import { createEventDispatcher } from 'svelte'





  `export let calendarDate = Date.create()`




  dispatch = createEventDispatcher()

  cancel = ()->
    dispatch "cancel"
  save = ()->
    dispatch "save", newEvent


  newEvent =
    id: uuid()
    title: ""
    start: calendarDate
    end: calendarDate.clone().addMinutes(60)
    allDay: false
    editable: true
    startEditable: true
    durationEditable: true
    overlap: false
    constraint: null
    extendedProps:
      dateString: calendarDate.format("{yyyy}-{MM}-{dd}")
      durationString: "1h"
      durationMinutes: 60
      startTimeInputString: calendarDate.format("{HH}{mm}")
      startTimeString: calendarDate.format("{HH}:{mm}")
      endTimeInputString: calendarDate.clone().addMinutes(60).format("{HH}{mm}")
      endTimeString: calendarDate.clone().addMinutes(60).format("{HH}:{mm}")



  datepickerChange = (e) ->
    `calendarDate = e.detail`
    newEvent.extendedProps.dateString = e.detail.format("{yyyy}-{MM}-{dd}")




  updateStart = (e)->
    newEvent.extendedProps.startTimeInputString = e.detail.inputString
    newEvent.extendedProps.startTimeString = e.detail.timeString
    newEvent.start = Date.create("#{newEvent.dateString} #{newEvent.startTimeString}")


  updateDuration = (e)->
    newEvent.extendedProps.durationString = e.detail.inputValue
    newEvent.extendedProps.durationMinutes = e.detail.inMinutes
    newEvent.end = newEvent.start.clone().addMinutes(newEvent.durationMinutes)
    newEvent.extendedProps.endTimeInputString = newEvent.end.format("{HH}{mm}")
    newEvent.extendedProps.endTimeString = newEvent.end.format("{HH}:{mm}")

  updateEnd = (e)->

    newEvent.extendedProps.endTimeInputString = e.detail.inputString
    newEvent.extendedProps.endTimeString = e.detail.timeString
    newEvent.end = Date.create("#{newEvent.dateString} #{newEvent.endTimeString}")
    newEvent.extendedProps.durationMinutes = newEvent.end.minutesSince(newEvent.start)
    newEvent.extendedProps.durationString = "#{newEvent.durationMinutes}m"



</script>
<Modal>
  <h1 slot="header">Add Event</h1>
  <div>


    <table>
      <tr>
        <td>Date:</td>
        <td>
          <input type="text" bind:value={newEvent.extendedProps.dateString}>
          <DatePicker flipped={true} direction="top" on:change={datepickerChange} {calendarDate}>pick</DatePicker>
        </td>
      </tr>
      <tr>
        <td colspan="2">

        </td>
      </tr>
      <tr>
        <td>Memo</td>
        <td>
          <textarea bind:value={newEvent.title}></textarea>
        </td>
      </tr>
      <tr>
        <td>Start Time*</td>
        <td>
          <div><TimeInput on:change={updateStart} bind:value={newEvent.extendedProps.startTimeInputString}/></div>
        </td>
      </tr>

      <tr>
      <tr>
        <td>Duration</td>
        <td>
          <EffortPicker bind:value={newEvent.extendedProps.durationString} on:change={updateDuration}/>

        </td>
      </tr>
      <tr>
        <td>End Time</td>
        <td>
          <div><TimeInput on:change={updateEnd} bind:value={newEvent.extendedProps.endTimeInputString}/></div>




        </td>
      </tr>



    </table>


  </div>

  <div slot="footer">
  <ModalFooterSave on:save={save} on:cancel={cancel}/>
  </div>
</Modal>
