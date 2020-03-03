<script lang="coffeescript">
  import Section from "../_page_components/Section.svelte"
</script>
<Section title="Variables">
  <div type="content">

    <h1>Overview</h1>
    <p>CSS variables are global and defined and declared in <code>_sass/global/css_variables.sass</code>.</p>
    <p>CSS variables can be accessed in a Svelte component using <code>var(--variable-name)</code>.</p>
    <h6>Example (SASS)</h6>
    <pre>
p
  color: var(--black)

    </pre>


    <h1>Base Colors</h1>
    <p>The <a href="#/styles">base colors</a> are defined in <code>_sass/global/generated/colors.sass</code></p>
    <p>Core colors should be customized in the sass file, as the variables are used to generate shortcut attributes for HTML elements.</p>
    <pre>
--lightest-gray
--lighter-gray
--light-gray
--gray
--dark-gray
--darker-gray
--darkest-gray
--lightest-purple
--lighter-purple
--light-purple
--purple
--dark-purple
--darker-purple
--darkest-purple
--lightest-blue
--lighter-blue
--light-blue
--blue
--dark-blue
--darker-blue
--darkest-blue
--lightest-green
--lighter-green
--light-green
--green
--dark-green
--darker-green
--darkest-green
--lightest-yellow
--lighter-yellow
--light-yellow
--yellow
--dark-yellow
--darker-yellow
--darkest-yellow
--lightest-orange
--lighter-orange
--light-orange
--orange
--dark-orange
--darker-orange
--darkest-orange
--lightest-red
--lighter-red
--light-red
--red
--dark-red
--darker-red
--darkest-red
--black
--white
    </pre>

    <h1>State Colors</h1>

    <pre>

--critical: var(--dark-red)
--critical-hover: var(--red)
--critical-active: var(--darkest-red)
--critical-disabled: var(--light-red)

--primary: var(--blue)
--primary-hover: var(--dark-blue)
--primary-active: var(--darkest-blue)
--primary-disabled: var(--light-blue)


// icon colors
--icon-color-normal: var(--black)
--icon-color-normal-hover: var(--blue)
--icon-color-normal-active: var(--darker-blue)
--icon-color-normal-disabled: var(--gray)

--icon-color-primary: var(--blue)
--icon-color-primary-hover: var(--light-blue)
--icon-color-primary-active: var(--darker-blue)
--icon-color-primary-disabled: var(--lighter-blue)

--icon-color-critical: var(--red)
--icon-color-critical-hover: var(--light-red)
--icon-color-critical-active: var(--darker-red)
--icon-color-critical-disabled: var(--lighter-red)

--menu-background: $white
--menu-hover: $white
--menu-active: $white
--menu-disabled: $white

    </pre>
    <h1>Other Colors</h1>

    <pre>


--code: var(--primary)
--box-shadow: var(--light-gray)

    </pre>

    <h1>Fonts</h1>

    <pre>
# Font Families

--font-family-primary: $font-family-primary
--font-family-primary-bold: $font-family-primary-bold

--font-family-secondary: $font-family-secondary
--font-family-secondary-bold: $font-family-secondary-bold

--font-family-monospace: $font-family-monospace
--font-family-monospace-bold: $font-family-monospace-bold

# Font Weights

--font-normal: normal
--font-bold: bold

# Font sizes

--font-xxl: 28px
--font-xl: 24px
--font-l: 20px
--font-m: 18px
--font-s: 14px
--font-xs: 11px

# Text spacing for top and bottom margins of text elements

--text-spacing-xxl: 28px
--text-spacing-xl: 24px
--text-spacing-l: 20px
--text-spacing-m: 18px
--text-spacing-s: 14px
--text-spacing-xs: 11px
    </pre>

    <h1>Spacing</h1>

    <pre>

--spacing-xxl: 72px
--spacing-xl: 54px
--spacing-l: 48px
--spacing-m: 36px
--spacing-s: 24px
--spacing-xs: 18px
--spacing-xxs: 14px

--fine-spacing-xxl: 14px
--fine-spacing-xl: 12px
--fine-spacing-l: 10px
--fine-spacing-m: 8px
--fine-spacing-s: 6px
--fine-spacing-xs: 4px
--fine-spacing-xxs: 2px
    </pre>

    <h1>Border Radius</h1>

    <pre>
--corner-sharp: 0px
--corner-s: 2px
--corner-m: 4px
--corner-l: 6px
--corner-circle: 100%
    </pre>

    <h1>Responsive</h1>
    <pre>
--breakpoint-min: $breakpoint-min
--breakpoint-xs: $breakpoint-xs
--breakpoint-sm: $breakpoint-sm
--breakpoint-md: $breakpoint-md
--breakpoint-lg: $breakpoint-lg
--breakpoint-xs-1: $breakpoint-xs-1
--breakpoint-sm-1: $breakpoint-sm-1
--breakpoint-md-1: $breakpoint-md-1
--breakpoint-lg-1: $breakpoint-lg-1

--responsive-xs-min: $responsive-xs-min
--responsive-xs-max: $responsive-xs-max
--responsive-sm-min: $responsive-sm-min
--responsive-sm-max: $responsive-sm-max
--responsive-md-min: $responsive-md-min
--responsive-md-max: $responsive-md-max
--responsive-lg-min: $responsive-lg-min
--responsive-lg-max: $responsive-lg-max
--responsive-xl-min: $responsive-xl-min

    </pre>

  </div>
</Section>
