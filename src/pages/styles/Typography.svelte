<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"


</script>

<style lang="sass">

  section
    min-width: 700px


  div[layout="row"]
    width: 100%

</style>

<Section title="Typography">

    <div layout="row">
      <div><h1>H1</h1></div>
      <div><div c="v">28</div></div>
      <div flex><h1>First Heading</h1></div>
    </div>
    <div layout="row">
      <div><h2>H2</h2></div>
      <div><div c="v">24</div></div>
      <div flex><h2>Second Heading</h2></div>
    </div>


    <div layout="row">
      <div><h3>H3</h3></div>
      <div><div c="v">20</div></div>
      <div flex><h3>Third Heading</h3></div>
    </div>


    <div layout="row">
      <div><h4>H4</h4></div>
      <div><div c="v">18</div></div>
      <div flex><h4>Fourth Heading<h4></div>
    </div>


    <div layout="row">
      <div><h5>H5</h5></div>
      <div><div c="v">14</div></div>
      <div flex><h5>Fifth Heading</h5></div>
    </div>


    <div layout="row">
      <div><h6>H6</h6></div>
      <div><div c="v">11</div></div>
      <div flex><h6>Section Header</h6></div>
    </div>

    <div layout="row">
      <div>Body</div>
      <div><div c="v">14</div></div>
      <div flex><p>Bacon ipsum dolor amet tail pastrami venison pork ham boudin sausage. Boudin swine fatback, bresaola tenderloin doner rump t-bone meatloaf alcatra. Doner pastrami alcatra, shank ham meatball fatback brisket. Chislic pastrami short loin, beef picanha sausage brisket. Prosciutto brisket sausage pastrami cow rump.</p></div>
    </div>
    <div layout="row">
      <div>Small</div>
      <div><div c="v">11</div></div>
      <div flex><small>This is a required field</small></div>
    </div>

</Section>
