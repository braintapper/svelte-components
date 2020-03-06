<script lang="coffeescript">
  import { createEventDispatcher } from 'svelte'

  import TranslatedInput from './TranslatedInput.svelte'

  `export let seconds = false`
  `export let value = 0`

  dispatch = createEventDispatcher()

  change = (e)->
    event =
      inputString: value
      timeString: Date.create(parseTime(value)).format("{HH}:{mm}") # 24h clock
      dateValue: Date.create(parseTime(value))
    dispatch "change", event




  debouncedChange = change.debounce(500)
  normalize = ->

    if arguments.length == 1
      date = arguments[0]
      if typeof date == 'string'
        date = parseTime(date)
      if seconds
        Date.create().set({hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds()})
      else
        Date.create().set( { hours: date.getHours(), minutes: date.getMinutes() })
    else if arguments.length == 3
      Date.create().set({hours: arguments[0], minutes: arguments[1], seconds:  arguments[2]})

    else if arguments.length == 2
      Date.create().set({hours: arguments[0], minutes: arguments[1]})

    else
      Date.create().beginningOfDay()

  ###*
  # Convert a string representing a given time into a Date object.
  #
  # The Date object will have attributes others than hours, minutes and
  # seconds set to current local time values. The function will return
  # false if given string can't be converted.
  #
  # If there is an 'a' in the string we set am to true, if there is a 'p'
  # we set pm to true, if both are present only am is setted to true.
  #
  # All non-digit characters are removed from the string before trying to
  # parse the time.
  #
  # ''       can't be converted and the function returns false.
  # '1'      is converted to     01:00:00 am
  # '11'     is converted to     11:00:00 am
  # '111'    is converted to     01:11:00 am
  # '1111'   is converted to     11:11:00 am
  # '11111'  is converted to     01:11:11 am
  # '111111' is converted to     11:11:11 am
  #
  # Only the first six (or less) characters are considered.
  #
  # Special case:
  #
  # When hours is greater than 24 and the last digit is less or equal than 6, and minutes
  # and seconds are less or equal than 60, we append a trailing zero and
  # start parsing process again. Examples:
  #
  # '95' is treated as '950' and converted to 09:50:00 am
  # '46' is treated as '460' and converted to 05:00:00 am
  # '57' can't be converted and the function returns false.
  #
  # For a detailed list of supported formats check the unit tests at
  # http://github.com/wvega/timepicker/tree/master/tests/
  ###

  parseTime = do ->
    patterns = [
      [
        /^(\d+)$/
        '$1'
      ]
      [
        /^:(\d)$/
        '$10'
      ]
      [
        /^:(\d+)/
        '$1'
      ]
      [
        /^(\d):([7-9])$/
        '0$10$2'
      ]
      [
        /^(\d):(\d\d)$/
        '$1$2'
      ]
      [
        /^(\d):(\d{1,})$/
        '0$1$20'
      ]
      [
        /^(\d\d):([7-9])$/
        '$10$2'
      ]
      [
        /^(\d\d):(\d)$/
        '$1$20'
      ]
      [
        /^(\d\d):(\d*)$/
        '$1$2'
      ]
      [
        /^(\d{3,}):(\d)$/
        '$10$2'
      ]
      [
        /^(\d{3,}):(\d{2,})/
        '$1$2'
      ]
      [
        /^(\d):(\d):(\d)$/
        '0$10$20$3'
      ]
      [
        /^(\d{1,2}):(\d):(\d\d)/
        '$10$2$3'
      ]
    ]
    length = patterns.length
    (str) ->
      time = normalize(Date.create())
      am = false
      pm = false
      h = false
      m = false
      s = false
      if typeof str == 'undefined' or !str.toLowerCase
        return null
      str = str.toLowerCase()
      am = /a/.test(str)
      pm = if am then false else /p/.test(str)
      str = str.replace(/[^0-9:]/g, '').replace(/:+/g, ':')
      k = 0
      while k < length
        if patterns[k][0].test(str)
          str = str.replace(patterns[k][0], patterns[k][1])
          break
        k = k + 1
      str = str.replace(/:/g, '')
      if str.length == 1
        h = str
      else if str.length == 2
        h = str
      else if str.length == 3 or str.length == 5
        h = str.substr(0, 1)
        m = str.substr(1, 2)
        s = str.substr(3, 2)
      else if str.length == 4 or str.length > 5
        h = str.substr(0, 2)
        m = str.substr(2, 2)
        s = str.substr(4, 2)
      if str.length > 0 and str.length < 5
        if str.length < 3
          m = 0
        s = 0
      if h == false or m == false or s == false
        return false
      h = parseInt(h, 10)
      m = parseInt(m, 10)
      s = parseInt(s, 10)
      if am and h == 12
        h = 0
      else if pm and h < 12
        h = h + 12
      if h > 24
        if str.length >= 6
          parseTime str.substr(0, 5)
        else
          parseTime str + '0' + (if am then 'a' else '') + (if pm then 'p' else '')
      else
        time.setHours h, m, s
        time



  translateFn = (val)->
    return Date.create(parseTime(value)).format("{HH}:{mm}")

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

<TranslatedInput bind:value={value} maxlength="7" {translateFn} {validateFn} {stateFn} on:change={debouncedChange}/>
