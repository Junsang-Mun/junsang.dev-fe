<script>
    import { onMount } from "svelte";
    import SimpleMDE from "simplemde";
    import "simplemde/dist/simplemde.min.css";

    export let value = "";
    let editor;

    onMount(() => {
        editor = new SimpleMDE({
            element: document.getElementById("editor"),
            initialValue: value,
            spellChecker: false,
        });

        editor.codemirror.on("change", () => {
            value = editor.value();
        });
    });
</script>

<textarea id="editor"></textarea>
