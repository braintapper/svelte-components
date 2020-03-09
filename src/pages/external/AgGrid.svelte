<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import AgGrid from "../../components/External/AgGrid/AgGrid.svelte"

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


  index_column = {
    headerName: "#"
    valueGetter: "node.rowIndex + 1"
    sortable: false
    width: 60
    type: "numericColumn"
    pinned: "left"
    editable: false
    onCellDoubleClicked: null
  }

  typeColumn =
    headerName: "Type"
    sortable: false
    width: 80
    editable: false
    cellRenderer: (cell)->
      guesses = []

      val = cell.data.expression
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
        return "Date"
      else if guesses.includes("Unit")
        return "Conversion #{suffix}"
      else if guesses.includes("Currency")
        return "Forex #{suffix}"
      else
        return "Math"


  gridOptions =
    columnDefs: [
      index_column
      {headerName: "Expression", field: "expression"}
      typeColumn
      # {headerName: "Cleansed", field: "cleansed"}
      # {headerName: "Output  ", field: "output"}
    ]
    defaultColDef:
      sortable: true
      resizable: true
      editable: true
    columnTypes:
      "dateColumn": { width: 140, cellStyle: { "text-align": "center" } }
      "centerColumn": { cellStyle: { "text-align": "center" } }
    onSortChanged: ()->
    onCellClicked: (cell)->
    onCellEditingStarted: (event)->
    onCellEditingStopped: (event)->
    onCellValueChanged: (event)->
      # patch object
      changedObject =
        id: event.data.id
      console.log event
      if event.newValue != event.oldValue
        changedObject[event.colDef.field] = event.newValue
        scb = (response)->
            console.log "successfully update response"
            console.log response

        # that.update changedObject, scb, null, null


  rows = [

    { expression: "4 / 2 * 5 - 1 -1" }
    { expression: ":49 45:" }
    { expression: "2 * 5 + 2 - 1 / 2  :49  45: 12:00" }
    { expression: ":49" }
    { expression: "6 - 4 + 1" }
    { expression: "5 / 10" }
    { expression: "10 percent off 100" }
    { expression: "5 times 1" }
    { expression: "35% off 400k" }
    { expression: "$30 a night x 3 nights" }
    { expression: "$30CAD in USD" }
    { expression: "$30CAD in US Dollars" }
    { expression: "$30CAD + $20USD" }
    { expression: "line1 + 5%" }
    { expression: "line1 as a percentage of #line2" }
    { expression: "line1 as a % of #line2" }
    { expression: "5 days from now" }
    { expression: "yesterday" }
    { expression: "days between today and 12/25" }
    { expression: "2015-01-1 plus 10 days" }
    { expression: "2015-01-1 + 10 days" }
    { expression: "hours between now and 5am"     }




  ]
</script>
<style>

</style>
<Section title="AgGrid">

  <AgGrid bind:rows={rows} bind:gridOptions={gridOptions}/>


</Section>
