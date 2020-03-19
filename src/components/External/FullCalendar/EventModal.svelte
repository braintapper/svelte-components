<script lang="coffeescript">

  import Modal from "../../Overlay/Modal/ModalGeneric.svelte"
  import ModalFooterSave from "../../Overlay/Modal/ModalFooterDelete.svelte"
  import DatePicker from "../../Date/DatePicker/DatePicker.svelte"
  import EffortPicker from "../../Form/TranslatedInput/DurationInput.svelte"
  import TimeInput from "../../Form/TranslatedInput/TimeInput.svelte"






  import uuid from 'uuid'

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()


  ###

  # todo

  ## validations

  * Do not allow overlap with existing events prior to save
  * Date string must be valid - datepickers responsibility maybe?
  * Duration must be valid - duration pickers responsibility maybe?


  ###

  export event = null


  calendarDate = Date.create(event.start)


  # fix missing attributes
  unless event.extendedProps?
    event["extendedProps"] =
      dateString: calendarDate.format("{yyyy}-{MM}-{dd}")
      durationString: "1h"
      durationMinutes: 60
      startTimeInputString: calendarDate.format("{HH}{mm}")
      startTimeString: calendarDate.format("{HH}:{mm}")
      endTimeInputString: calendarDate.clone().addMinutes(60).format("{HH}{mm}")
      endTimeString: calendarDate.clone().addMinutes(60).format("{HH}:{mm}")






  cancel = ()->
    dispatch "cancel"

  save = ()->
    dispatch "save", event

  destroy = ()->
    dispatch "destroy", event



  # todo: DRY this up

  dateInputChange = (e)->
    console.log "date input change #{event.extendedProps.dateString}"
    isvalid = Date.create(event.extendedProps.dateString).isValid()
    console.log isvalid
    if isvalid && (event.extendedProps.dateString.length == 10)
      datepickerChange { detail: Date.create(event.extendedProps.dateString)}

  datepickerChange = (e) ->
    calendarDate = e.detail
    console.log "datepicker change"
    event.extendedProps.dateString = e.detail.format("{yyyy}-{MM}-{dd}")


    console.log "datestring"
    console.log "#{event.extendedProps.dateString} #{event.extendedProps.startTimeString}"
    event.start = Date.create("#{event.extendedProps.dateString} #{event.extendedProps.startTimeString}")
    console.log "update start"
    console.log event
    event.end = event.start.clone().addMinutes(event.extendedProps.durationMinutes)
    event.extendedProps.endTimeInputString = event.end.format("{HH}{mm}")
    event.extendedProps.endTimeString = event.end.format("{HH}:{mm}")

  updateStart = (e)->
    event.extendedProps.startTimeInputString = e.detail.inputString
    event.extendedProps.startTimeString = e.detail.timeString
    console.log "datestring"
    console.log "#{event.extendedProps.dateString} #{event.extendedProps.startTimeString}"
    event.start = Date.create("#{event.extendedProps.dateString} #{event.extendedProps.startTimeString}")
    console.log "update start"
    console.log event
    event.end = event.start.clone().addMinutes(event.extendedProps.durationMinutes)
    event.extendedProps.endTimeInputString = event.end.format("{HH}{mm}")
    event.extendedProps.endTimeString = event.end.format("{HH}:{mm}")

  updateDuration = (e)->
    console.log "udpateDuration"
    console.log e
    event.extendedProps.durationString = e.detail.inputValue
    event.extendedProps.durationMinutes = e.detail.inMinutes
    event.end = event.start.clone().addMinutes(e.detail.inMinutes)
    event.extendedProps.endTimeInputString = event.end.format("{HH}{mm}")
    event.extendedProps.endTimeString = event.end.format("{HH}:{mm}")
    console.log event

  updateEnd = (e)->

    event.extendedProps.endTimeInputString = e.detail.inputString
    event.extendedProps.endTimeString = e.detail.timeString
    event.end = Date.create("#{event.extendedProps.dateString} #{event.extendedProps.endTimeString}")
    event.extendedProps.durationMinutes = event.end.minutesSince(event.start)
    event.extendedProps.durationString = "#{event.extendedProps.durationMinutes}m"

</script>
<Modal>
  <h1 slot="header">Event</h1>
  <div>
    <table>
      <tr>
        <td>Date:</td>
        <td>
          <input type="text" bind:value={event.extendedProps.dateString} on:keyup={dateInputChange}>
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
          <textarea bind:value={event.title}></textarea>
        </td>
      </tr>
      <tr>
        <td>Start Time*</td>
        <td>
          <div><TimeInput on:change={updateStart} bind:value={event.extendedProps.startTimeInputString}/></div>
        </td>
      </tr>

      <tr>
      <tr>
        <td>Duration</td>
        <td>
          <EffortPicker bind:value={event.extendedProps.durationString} on:change={updateDuration}/>

        </td>
      </tr>
      <tr>
        <td>End Time</td>
        <td>
          <div><TimeInput on:change={updateEnd} bind:value={event.extendedProps.endTimeInputString}/></div>
        </td>
      </tr>
    </table>
  </div>

  <div slot="footer">
    <ModalFooterSave on:save={save} on:cancel={cancel}/>
  </div>
</Modal>
