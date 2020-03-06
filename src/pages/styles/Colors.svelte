<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  shades =
    "gray" : ["#dee2e6","#ced4da","#adb5bd","#868e96","#495057","#343a40","#212529"]
    "purple" : ["#e5dbff","#d0bfff","#b197fc","#9775fa","#845ef7","#7048e8","#5f3dc4"]
    "blue" : ["#dbe4ff","#bac8ff","#91a7ff","#5c7cfa","#4c6ef5","#3b5bdb","#364fc7"]
    "green" : ["#c3fae8","#63e6be","#20c997","#12b886","#0ca678","#099268","#087f5b"]
    "yellow" : ["#fff3bf","#ffec99","#ffe066","#ffd43b","#fcc419","#fab005","#f59f00"]
    "orange" : ["#ffe8cc","#ffc078","#ffa94d","#fd7e14","#f76707","#e8590c","#d9480f"]
    "red" : ["#ffe3e3","#ffa8a8","#ff8787","#fa5252","#f03e3e","#e03131","#c92a2a"]

  colors = Object.keys(shades)
  console.log colors
  prefixes = ["lightest","lighter","light", "", "dark", "darker", "darkest"]

  foreground = (prefix,color)->
    bg = "#ffffff"
    switch prefix
      when "lightest","lighter","light"
        bg = "#495057"
      when ""
        switch color
          when "yellow"
            bg = "#495057"
      when "dark"
        switch color
          when "yellow"
            bg = "#495057"
    bg

</script>

<style lang="sass">

  section
    min-width: 700px


  swatch-container
    flex: 0 1 auto
  swatch
    display: block

  swatch-container
    width: 88px
    height: 88px

  swatch
    border-radius: var(--corner-m)
    height: 80px
    width: 80px
    position: relative


    padding: 14px


    swatch-info
      position: absolute
      bottom: 14px
      h1, h2
        margin: 0px
      h1
        font-size: 14px
      h2
        font-size: 12px
        font-weight: normal

</style>


<Section title="Colors">
  <div layout="row">
    <swatch-container>
      <swatch bg="black">
          <swatch-info>
            <h1>Black</h1>
            <h2>{shades.gray[6]}</h2>
          </swatch-info>
      </swatch>
    </swatch-container>
  </div>
  {#each colors as color}
    <div layout="row">
      {#each shades[color] as colorCode, index}
          <swatch-container>
            <swatch style="background: var(--{prefixes[index].length == 0 ? "" : prefixes[index] + "-"}{color})">
                <swatch-info>
                <h1>{prefixes[index].titleize()}</h1>
                <h1>{color.titleize()}</h1>
                <h2>{colorCode}</h2>
                </swatch-info>
            </swatch>
          </swatch-container>
      {/each}
    </div>
  {/each}
</Section>
