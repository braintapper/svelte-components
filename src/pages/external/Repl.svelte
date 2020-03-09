<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Repl from "../../components/Repl/Repl.svelte"
  import { create, all } from 'mathjs'
  math = create(all, { number: 'number'})

  import nlp from "compromise"
  #import compromiseNumbers from "compromise-numbers"
  #import compromiseDates from "compromise-dates"

  #nlp.extend(compromiseNumbers)
  #nlp.extend(compromiseDates)

  nlp.extend (Doc, world)->
    world.addTags
      Operator:
        notA: "Noun"
        notA: "Adjective"
        notA: "Conjunction"
        notA: "Singular"
    world.addTags
      Separator:
        notA: "Noun"
        notA: "Adjective"
        notA: "Conjunction"



    world.addWords
      "(": "Bracket"
      "+": "Operator"
      "*": "Operator"
      "#-#": ["Operator"]
      "./.": ["Operator"]
      "x": "Operator"
      "plus": "Operator"
      "minus": "Operator"
      "less": "Operator"
      "subtract": "Operator"
      "times": "Operator"
      "multiply by": "Operator"
      "multiplied by": "Operator"
      "divide by": "Operator"
      "divided by": "Operator"
      "times": ["Operator","Plural"]
      "multiply by": "Operator"
      "multiplied by": "Operator"
      "US dollars": "Currency"
      "percentage": "Fraction"
      "days": "Date"
      "day": "Date"
      "night": "Date"
      "nights": "Date"
    world.postProcess (doc)->
      doc.match("/\//").tag("#Operator")
      doc.match("/\-/").tag("#Operator")


  expressions = [
    "4 / 2 * 5 - 1 -1"
    ":49 45:"
    "2 * 5 + 2 - 1 / 2  :49  45: 12:00"
    ":49"
    "6 - 4 + 1"
    "5 / 10"
    "10 percent off 100"
    "5 times 1"
    "35% off 400k"
    "$30 a night x 3 nights"
    "$30CAD in USD"
    "$30CAD in US Dollars"
    "$30CAD + $20USD"
    "line1 + 5%"

    "line1 as a percentage of #line2"
    "line1 as a % of #line2"
    "5 days from now"
    "yesterday"
    "days between today and 12/25"
    "2015-01-1 plus 10 days"
    "2015-01-1 + 10 days"
    "hours between now and 5am"

  ]
  nodes = (val)=>

    transformedVal = val.replace(/ \/ /g , " ./. ").replace(/ - /g," #-# ")
    # transformedVal = val
    options =
      terms:
        clean: true
        bestTag: true


    converted =  nlp(transformedVal).join().json(options)[0].terms
    return converted
  nodeTags = (val)=>

    transformedVal = val.replace(/ \/ /g , " ./. ").replace(/ - /g," #-# ")
    # transformedVal = val
    options =
      terms:
        clean: true
        bestTag: true


    converted =  nlp(transformedVal).join().json(options)[0].terms



    # return converted

    output = []
    converted.forEach (item)->
      output.append item.tags

    return output

  sanitizeMath = (val)->
    val.replace("times","*")





  parserFn = (val)->
    guesses = []
    tags = nodeTags(val)
    suffix = ""
    checks = ["Date","Unit","HashTag","Time","Operator","Currency"]


    if val.includes(":")
      guesses.append "Time"

    checks.forEach (item)->
      if tags.includes(item)
        guesses.append item


    if guesses.includes("HashTag")
      suffix = ", ##"
    if guesses.includes("Time")
      return "Time lib"
    else if guesses.includes("Date")
      return Date.create(val)# "Date lib#{suffix}"
    else if guesses.includes("Unit")
      return "Conversion #{suffix}"
    else if guesses.includes("Currency")
      return "Forex #{suffix}"
    else
      return math.evaluate(sanitizeMath(val))


</script>
<style>

</style>
<Section title="Repl">

  <Repl value={expressions.join("\n")} {parserFn}/>


</Section>
