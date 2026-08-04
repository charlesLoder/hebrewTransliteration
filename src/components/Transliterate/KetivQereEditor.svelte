<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { autocompletion, type CompletionContext } from "@codemirror/autocomplete";
  import { javascript } from "@codemirror/lang-javascript";
  import { EditorView } from "@codemirror/view";
  import CodeMirror from "svelte-codemirror-editor";
  import { get_schema_completions } from "./utils/schemaCompletion";

  interface Props {
    code: string;
    on_save: (code: string) => void;
    on_cancel: () => void;
  }

  let { code, on_save, on_cancel }: Props = $props();

  let editor_code = $state(code);

  function schema_completions(context: CompletionContext) {
    // eslint-disable-next-line no-useless-escape -- the escapes are needed
    const word = context.matchBefore(/schema[\["\.]?.*/);
    if (!word) return null;
    const options = get_schema_completions([], []);
    return {
      from: word.from,
      options,
      // eslint-disable-next-line no-useless-escape -- the escapes are needed
      validFor: /^schema[\["\.]?[\w]*$/,
    };
  }

  const extensions = [
    javascript(),
    autocompletion({ override: [schema_completions] }),
    EditorView.theme({
      ".cm-gutters": {
        backgroundColor: "var(--muted)",
        color: "var(--muted-foreground)",
        border: "none",
      },
      ".cm-gutterElement": { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" },
      ".cm-tooltip": {
        backgroundColor: "var(--popover)",
        color: "var(--popover-foreground)",
        border: "1px solid var(--border)",
      },
      ".cm-tooltip-autocomplete ul": { backgroundColor: "var(--popover)" },
      ".cm-tooltip-autocomplete ul li": { color: "var(--popover-foreground)" },
      ".cm-tooltip-autocomplete ul li[aria-selected]": {
        backgroundColor: "var(--accent)",
        color: "var(--accent-foreground)",
      },
      ".cm-completionLabel": { color: "var(--popover-foreground)" },
      ".cm-completionDetail": { color: "var(--muted-foreground)" },
    }),
  ];
</script>

<Dialog.Root
  open={true}
  onOpenChange={(open) => {
    if (!open) on_cancel();
  }}
>
  <Dialog.Content class="max-h-[90vh] max-w-fit">
    <Dialog.Header class="max-w-full border-b-2 pb-2">
      <Dialog.Title>Edit Ketiv/Qere Output Callback</Dialog.Title>
      <Dialog.Description>
        Edit the callback function for this ketiv/qere pair. Receives <code>(text, input)</code>.
      </Dialog.Description>
    </Dialog.Header>

    <div class="flex flex-col gap-4 py-4 px-1">
      <div class="flex flex-col gap-2">
        <Label for="kq-callback-code">Callback Function</Label>
        <div class="border rounded-md text-sm overflow-x-auto" data-testid="kq-callback-editor">
          <CodeMirror
            bind:value={editor_code}
            {extensions}
            styles={{ "&": { height: "200px", overflowX: "auto" } }}
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Use <code>schema["KEY"]</code> to access schema transliteration values.
        </p>
      </div>
    </div>

    <Dialog.Footer class="flex justify-end gap-2 border-t-2 pt-2">
      <Button variant="outline" onclick={on_cancel}>Cancel</Button>
      <Button data-testid="kq-save-button" onclick={() => on_save(editor_code)}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
