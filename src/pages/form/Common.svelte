<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  import Autogrow from "../../components/Form/TextArea/Autogrow.svelte"

</script>

<Section title="Common Elements">

  <h2>Text Inputs</h2>
  <div>
  <field>
    <label type="field">Field Label</label>
    <input type="text"/>
  </field>
  <field>
    <label type="field" disabled>Disabled Input</label>
    <input type="text" disabled value="disabled"/>
  </field>
  <field>
    <label type="field" required>Required Input</label>
    <input type="text" required/>
  </field>
  <field>
    <label type="field" invalid={true}>Invalid Input</label>
    <input type="text" invalid={true}/>
  </field>
  </div>
  <h2>Text Areas</h2>
  <div>

  <h3>Basic</h3>
  <textarea/>
  <h3 va="m">Auto Expanding <label type="tag" margin-left-xs>Component</label></h3>

  <Autogrow/>
  </div>
  <h2>Browser Native Input Controls</h2>

  <h3>Radio</h3>
  <field>
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Male</label><br>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Female</label><br>
  <input type="radio" id="other" name="gender" value="other">
  <label for="other">Other</label>
  </field>
  <h3>Checkboxes</h3>
  <field>
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label><br>
  </field>

  <h2>Select</h2>
  <p>
    <code>option</code> elements have limited styling controls as most, if not all browsers, use the OS native control for drop-downs.
  </p>
  <p>
    If more granular control of a <code>select</code> control's appearance are required, use the <code>Select.svelte</code> component instead.
  </p>
  <field>
    <select>
      <option>Option</option>
      <option>Option</option>
      <option>Option</option>
      <option>Option</option>
      <option>Option</option>
      <option>Option</option>
      <option>Option</option>
    </select>
  </field>


</Section>
