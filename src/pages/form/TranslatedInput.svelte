<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import TranslatedInput from "../../components/Form/TranslatedInput/TranslatedInput.svelte"
  import TimeInput from "../../components/Form/TranslatedInput/TimeInput.svelte"
  import DurationInput from "../../components/Form/TranslatedInput/DurationInput.svelte"


  inputValue = ""
  timeValue = ""
  durationValue = ""


</script>

<style lang="sass">


</style>

<Section title="Translated Inputs">

  <h3>Translated Inputs</h3>
  <p>Takes a raw input and translates the value for saving. The current translation appears on the right.</p>
  <p>One way of looking at this is that the translation means "This is what I think you mean, and this is what I will be saving."
  <p>This input is useful for keyboard focused apps for entering time and dates without a picker or mask.</p>
  <p>In this sense, translated inputs can be a friendlier way of collecting data without forcing users to stick to a format.</p>
  <p>Example use cases:</p>
  <ul>
    <li>Postal codes - force uppercase and strip spaces</li>
    <li>Phone numbers</li>
    <li>Date translation</li>
  </ul>

  <field>
  <TranslatedInput bind:value={inputValue}/>
  <aside>Translates input to all caps</aside>
  </field>

  <h3>Time Input</h3>
  <field>
    <TimeInput bind:value={timeValue}/>
    <aside>Examples: 0800, 1700, 5p, 6a, 09:30</aside>
  </field>

  <h3>Duration Input</h3>


  <field>
    <DurationInput bind:value={durationValue}/>
    <aside>Examples: 2h, 15m, 120m, 1d</aside>
  </field>

</Section>
