<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    NativeSelectOption,
    Root as NativeSelectRoot,
  } from "$lib/components/ui/native-select/index.js";
  import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { autocompletion, type CompletionContext } from "@codemirror/autocomplete";
  import { javascript } from "@codemirror/lang-javascript";
  import { EditorView } from "@codemirror/view";
  import CodeMirror from "svelte-codemirror-editor";
  import { get_schema_completions } from "./utils/schemaCompletion";

  interface FeatureForm {
    feature_type: "word" | "syllable" | "cluster";
    hebrew_text: string;
    is_regex: boolean;
    regex_flags: string;
    pass_through: boolean;
    is_callback: boolean;
    transliteration_text: string;
    callback_code: string;
  }

  interface Props {
    initial_form?: FeatureForm;
    consonants: readonly string[];
    editing_index: number | null;
    vowels: readonly string[];
    on_save: (form: FeatureForm) => void;
    on_cancel: () => void;
  }

  let { initial_form, consonants, editing_index, vowels, on_save, on_cancel }: Props = $props();

  let form = $state<FeatureForm>(
    initial_form ?? {
      feature_type: "word",
      hebrew_text: "",
      is_regex: false,
      regex_flags: "g",
      pass_through: true,
      is_callback: false,
      transliteration_text: "",
      callback_code: "(item, hebrew, schema) => {\n  \n}",
    },
  );

  function schema_completions(context: CompletionContext) {
    // eslint-disable-next-line no-useless-escape -- the escapes are needed
    const word = context.matchBefore(/schema[\["\.]?.*/);
    if (!word) return null;
    const options = get_schema_completions(consonants, vowels);
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
      ".cm-gutterElement": {
        backgroundColor: "var(--muted)",
        color: "var(--muted-foreground)",
      },
      ".cm-tooltip": {
        backgroundColor: "var(--popover)",
        color: "var(--popover-foreground)",
        border: "1px solid var(--border)",
      },
      ".cm-tooltip-autocomplete ul": {
        backgroundColor: "var(--popover)",
      },
      ".cm-tooltip-autocomplete ul li": {
        color: "var(--popover-foreground)",
      },
      ".cm-tooltip-autocomplete ul li[aria-selected]": {
        backgroundColor: "var(--accent)",
        color: "var(--accent-foreground)",
      },
      ".cm-completionLabel": {
        color: "var(--popover-foreground)",
      },
      ".cm-completionDetail": {
        color: "var(--muted-foreground)",
      },
    }),
  ];
</script>

<Dialog.Root
  open={true}
  onOpenChange={(open) => {
    if (!open) {
      on_cancel();
    }
  }}
>
  <Dialog.Content
    class="max-h-[90vh] max-w-fit"
    data-testid="additional-feature-editor"
    data-formstate={initial_form ? "edit" : "add"}
    data-editingindex={editing_index ?? ""}
  >
    <Dialog.Header class="max-w-full border-b-2 pb-2">
      <Dialog.Title>
        {initial_form ? "Edit Feature" : "Add Feature"}
      </Dialog.Title>
      <Dialog.Description>Configure an additional transliteration feature.</Dialog.Description>
    </Dialog.Header>

    <ScrollArea class="h-72 xl:h-92">
      <div class="flex flex-col gap-4 py-4 px-1">
        <div class="flex flex-col gap-2">
          <Label for="feature-type">Feature Type</Label>
          <NativeSelectRoot
            id="feature-type"
            data-testid="feature-type-select"
            value={form.feature_type}
            onchange={(e: Event) => {
              form.feature_type = (e.currentTarget as HTMLSelectElement).value as
                | "word"
                | "syllable"
                | "cluster";
            }}
          >
            <NativeSelectOption value="word">Word</NativeSelectOption>
            <NativeSelectOption value="syllable">Syllable</NativeSelectOption>
            <NativeSelectOption value="cluster">Cluster</NativeSelectOption>
          </NativeSelectRoot>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="hebrew-match">Hebrew Match</Label>
          <div class="flex gap-2 items-center">
            <Input
              id="hebrew-match"
              data-testid="hebrew-match-input"
              class="flex-1"
              value={form.hebrew_text}
              oninput={(e: Event) => {
                form.hebrew_text = (e.currentTarget as HTMLInputElement).value;
              }}
              placeholder="Enter Hebrew text or regex pattern"
            />
            <div class="flex items-center gap-2">
              <Checkbox
                id="is-regex"
                checked={form.is_regex}
                onchange={(e: Event) => {
                  form.is_regex = (e.currentTarget as HTMLInputElement).checked;
                }}
              />
              <Label for="is-regex" class="text-sm">Regex</Label>
            </div>
          </div>
          {#if form.is_regex}
            <div class="flex gap-2 items-center">
              <Label for="regex-flags" class="text-sm">Flags:</Label>
              <Input
                id="regex-flags"
                data-testid="regex-flags-input"
                class="w-20"
                value={form.regex_flags}
                oninput={(e: Event) => {
                  form.regex_flags = (e.currentTarget as HTMLInputElement).value;
                }}
                placeholder="g"
              />
            </div>
          {/if}
        </div>

        <div class="flex items-center gap-2">
          <Switch
            id="pass-through"
            data-testid="pass-through-switch"
            checked={form.pass_through}
            onCheckedChange={(checked: boolean) => {
              form.pass_through = checked;
            }}
          />
          <Label for="pass-through">Pass Through</Label>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Transliteration</Label>
          <RadioGroup
            value={form.is_callback ? "callback" : "string"}
            onValueChange={(value: string) => {
              form.is_callback = value === "callback";
            }}
          >
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <RadioGroupItem value="string" id="trans-string" />
                <Label for="trans-string">String</Label>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem value="callback" id="trans-callback" />
                <Label for="trans-callback">Callback</Label>
              </div>
            </div>
          </RadioGroup>

          {#if form.is_callback}
            <div class="flex flex-col gap-2">
              <Label for="callback-code">Callback Function</Label>
              <div class="border rounded-md text-sm overflow-x-auto" data-testid="callback-editor">
                <CodeMirror
                  bind:value={form.callback_code}
                  {extensions}
                  styles={{
                    "&": { height: "200px", overflowX: "auto" },
                  }}
                />
              </div>
              <p class="text-xs text-muted-foreground">
                Use <code>schema["KEY"]</code> or <code>schema.KEY</code> to access schema values.
                Available: {consonants.length + vowels.length} keys.
              </p>
            </div>
          {:else}
            <Textarea
              id="transliteration-text"
              data-testid="transliteration-text-input"
              value={form.transliteration_text}
              oninput={(e: Event) => {
                form.transliteration_text = (e.currentTarget as HTMLTextAreaElement).value;
              }}
              placeholder="Enter transliteration text"
              rows={2}
            />
          {/if}
        </div>
      </div>
    </ScrollArea>

    <Dialog.Footer class="flex justify-end gap-2 border-t-2 pt-2">
      <Button data-testid="cancel-button" variant="outline" onclick={on_cancel}>Cancel</Button>
      <Button
        data-testid="save-button"
        onclick={() => {
          on_save(form);
        }}
      >
        Save
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
