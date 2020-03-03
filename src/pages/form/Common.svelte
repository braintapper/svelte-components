<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  import Autogrow from "../../components/Form/TextArea/Autogrow.svelte"

</script>

<Section title="Common">

  <h3>About</h3>
  <p>These are pure html/css</p>

  <h3>Text Inputs</h3>
  <div>
  <field>
    <label type="field">Basic Input</label>
    <input type="text"/>
  </field>
  <field>
    <label type="disabled">Basic Input</label>
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
  <h3>Textareas</h3>
  <div>
  <h4>Basic</h4>
  <textarea required/>
  <h4>Auto Expanding</h4>
  <Autogrow/>
  </div>
  <h3>Radio Buttons</h3>
  <div>
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Male</label><br>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Female</label><br>
  <input type="radio" id="other" name="gender" value="other">
  <label for="other">Other</label>
  </div>
  <h3>Checkboxes</h3>
  <div>
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label><br>
  </div>

</Section>
