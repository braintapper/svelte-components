<script lang="coffeescript">

  import Quill from "quill"

  `
  export let toolbarOptions = [
  [{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "ordered" }],
  [{ align: [] }],
  ["clean"]
  ]
  `
  `export let placeholder = "Type something..."`

  quill = (element) ->
    return new Quill element,
      modules:
        toolbar: toolbarOptions
      placeholder: placeholder
      theme: "snow"

</script>
<svelte:head>
	<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"/>
</svelte:head>

<div use:quill />
