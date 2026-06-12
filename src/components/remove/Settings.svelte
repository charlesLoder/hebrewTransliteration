<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
  import IconInfoCircle from "@tabler/icons-svelte/icons/info-circle";
  import type { RemoveOptions } from "hebrew-transliteration";
  import { getContext } from "svelte";
  import type { Context, RemoveState } from "../../types/index";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { javascript } from "@codemirror/lang-javascript";
  import { EditorView } from "@codemirror/view";
  import CodeMirror from "svelte-codemirror-editor";
  import { format_doc_url } from "../../utils/documentation";
  import Dialog from "../shared/Dialog.svelte";

  const remove_state = getContext<Context<RemoveState>>("remove_state");

  const punctuation = [
    { key: "MAQAF", label: "Maqaf" },
    { key: "PASEQ", label: "Paseq" },
    { key: "SOF_PASUQ", label: "Sof Pasuq" },
    { key: "NUN_HAFUKHA", label: "Nun Hafukha" },
    { key: "PUNC_GERESH", label: "Punc Geresh" },
    { key: "PUNC_GERSHAYIM", label: "Punc Gershayim" },
    { key: "MASORA_CIRCLE", label: "Masora Circle" },
    { key: "LOWER_DOT", label: "Lower Dot" },
    { key: "UPPER_DOT", label: "Upper Dot" },
    { key: "DAGESH", label: "Dagesh" },
    { key: "METEG", label: "Meteg" },
    { key: "RAFE", label: "Rafe" },
    { key: "SHIN_DOT", label: "Shin Dot" },
    { key: "SIN_DOT", label: "Sin Dot" },
  ] as const;

  const taamim = [
    { key: "ETNAHTA", label: "Etnahta" },
    { key: "SEGOLTA", label: "Segolta" },
    { key: "SHALSHELET", label: "Shalshelet" },
    { key: "ZAQEF_QATAN", label: "ZaQef Qatan" },
    { key: "ZAQEF_GADOL", label: "ZaQef Gadol" },
    { key: "TIPEHA", label: "Tipeha" },
    { key: "REVIA", label: "Revia" },
    { key: "ZARQA", label: "Zarqa" },
    { key: "PASHTA", label: "Pashta" },
    { key: "YETIV", label: "Yetiv" },
    { key: "TEVIR", label: "Tevir" },
    { key: "GERESH", label: "Geresh" },
    { key: "GERESH_MUQDAM", label: "Geresh Muqdam" },
    { key: "GERSHAYIM", label: "Gershayim" },
    { key: "QARNEY_PARA", label: "Qarney Para" },
    { key: "TELISHA_GEDOLA", label: "Telisha Gedola" },
    { key: "PAZER", label: "Pazer" },
    { key: "ATNAH_HAFUKH", label: "Atnaḥ Hafukh" },
    { key: "MUNAH", label: "Munah" },
    { key: "MAHAPAKH", label: "Mahapakh" },
    { key: "MERKHA", label: "Merkha" },
    { key: "MERKHA_KEFULA", label: "Merkha Kefula" },
    { key: "DARGA", label: "Darga" },
    { key: "QADMA", label: "Qadma" },
    { key: "TELISHA_QETANA", label: "Telisha Qetana" },
    { key: "YERAH_BEN_YOMO", label: "Yeraḥ Ben Yomo" },
    { key: "OLE", label: "Ole" },
    { key: "ILUY", label: "Iluy" },
    { key: "DEHI", label: "Dehi" },
    { key: "ZINOR", label: "Zinor" },
  ] as const;

  const vowels = [
    { key: "SHEVA", label: "Sheva" },
    { key: "HATAF_SEGOL", label: "Hataf Segol" },
    { key: "HATAF_PATAH", label: "Hataf Patah" },
    { key: "HATAF_QAMATS", label: "Hataf Qamats" },
    { key: "HIRIQ", label: "Hiriq" },
    { key: "TSERE", label: "Tsere" },
    { key: "SEGOL", label: "Segol" },
    { key: "PATAH", label: "Patah" },
    { key: "QAMATS", label: "Qamats" },
    { key: "HOLAM", label: "Holam" },
    { key: "QUBUTS", label: "Qubuts" },
    { key: "QAMATS_QATAN", label: "Qamats Qatan" },
  ] as const;

  let active_tab = $state("punctuation");

  function handle_option_change(key: string, checked: boolean | "indeterminate") {
    remove_state.value.options = {
      ...remove_state.value.options,
      [key]: checked === true,
    };
  }

  function is_option_checked(key: string): boolean {
    return (remove_state.value.options as Record<string, unknown>)[key] === true;
  }

  function handle_dialog_change(open: boolean) {
    remove_state.value.dialog_view_state = open ? "open" : "close";
  }

  function get_doc_url(key: string): string {
    return format_doc_url("/api/interfaces/removeoptions", key);
  }

  let on_complete_enabled = $state(false);
  let on_complete_code = $state("");

  function load_on_complete() {
    const oc = remove_state.value.options.ON_COMPLETE;
    if (typeof oc === "function") {
      on_complete_enabled = true;
      on_complete_code = oc.toString();
    } else {
      on_complete_enabled = false;
      on_complete_code = "";
    }
  }

  function handle_on_complete_toggle(enabled: boolean) {
    on_complete_enabled = enabled;
    if (!enabled) {
      remove_state.value.options = { ...remove_state.value.options, ON_COMPLETE: undefined };
    } else {
      const defaultFn = `(result, context) => {\n  return result;\n}`;
      on_complete_code = defaultFn;
      try {
        const fn = eval(defaultFn);
        remove_state.value.options = { ...remove_state.value.options, ON_COMPLETE: fn };
      } catch {
        // ignore parse errors while editing
      }
    }
  }

  $effect(() => {
    load_on_complete();
  });

  $effect(() => {
    const code = on_complete_code;
    if (on_complete_enabled && code) {
      const opt_fn = remove_state.value.options.ON_COMPLETE;
      if (typeof opt_fn === "function" && opt_fn.toString() === code) return;
      try {
        remove_state.value.options = { ...remove_state.value.options, ON_COMPLETE: eval(code) };
      } catch {
        // ignore parse errors while editing
      }
    }
  });

  const on_complete_extensions = [
    javascript(),
    EditorView.theme({
      ".cm-gutters": {
        backgroundColor: "var(--muted)",
        color: "var(--muted-foreground)",
        border: "none",
      },
      ".cm-gutterElement": { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" },
    }),
  ];

  function toggle_all(category: "punctuation" | "taamim" | "vowels") {
    const items =
      category === "punctuation" ? punctuation : category === "taamim" ? taamim : vowels;

    const allChecked = items.every((item) => is_option_checked(item.key as keyof RemoveOptions));

    const new_options = { ...remove_state.value.options };
    for (const item of items) {
      (new_options as Record<string, unknown>)[item.key] = !allChecked;
    }
    remove_state.value.options = new_options;
  }
</script>

<Dialog text="Settings" testid="settings-button" on_change={handle_dialog_change}>
  <DialogHeader>
    <DialogTitle>Remove Options</DialogTitle>
    <DialogDescription class="text-pretty">
      Select which Hebrew diacritics to remove from the text.
    </DialogDescription>
  </DialogHeader>

  <Tabs bind:value={active_tab} class="gap-4">
    <TabsList class="w-full h-auto grid grid-cols-3 md:flex">
      <TabsTrigger value="punctuation">Punctuation</TabsTrigger>
      <TabsTrigger value="taamim">Taamim</TabsTrigger>
      <TabsTrigger value="vowels">Vowels</TabsTrigger>
    </TabsList>

    <TabsContent value="punctuation" class="flex flex-col gap-6">
      <div class="flex justify-end">
        <Button variant="outline" size="sm" onclick={() => toggle_all("punctuation")}>
          Toggle All
        </Button>
      </div>
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-1">
          {#each punctuation as item (item.key)}
            <div class="flex items-center gap-2">
              <Checkbox
                id={item.key}
                checked={is_option_checked(item.key)}
                onCheckedChange={(checked) => handle_option_change(item.key, checked)}
              />
              <Label for={item.key} class="cursor-pointer flex items-center gap-1">
                {item.label}
                <a href={get_doc_url(item.key)} target="_blank" class="text-muted-foreground">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="taamim" class="flex flex-col gap-6">
      <div class="flex justify-end">
        <Button variant="outline" size="sm" onclick={() => toggle_all("taamim")}>Toggle All</Button>
      </div>
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-1">
          {#each taamim as item (item.key)}
            <div class="flex items-center gap-2">
              <Checkbox
                id={item.key}
                checked={is_option_checked(item.key)}
                onCheckedChange={(checked) => handle_option_change(item.key, checked)}
              />
              <Label for={item.key} class="cursor-pointer flex items-center gap-1">
                {item.label}
                <a href={get_doc_url(item.key)} target="_blank" class="text-muted-foreground">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="vowels" class="flex flex-col gap-6">
      <div class="flex justify-end">
        <Button variant="outline" size="sm" onclick={() => toggle_all("vowels")}>Toggle All</Button>
      </div>
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-1">
          {#each vowels as item (item.key)}
            <div class="flex items-center gap-2">
              <Checkbox
                id={item.key}
                checked={is_option_checked(item.key)}
                onCheckedChange={(checked) => handle_option_change(item.key, checked)}
              />
              <Label for={item.key} class="cursor-pointer flex items-center gap-1">
                {item.label}
                <a href={get_doc_url(item.key)} target="_blank" class="text-muted-foreground">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>
  </Tabs>

  <div class="flex flex-col gap-4 mt-6 p-1">
    <Label class="gap-1 font-semibold"
      >ON_COMPLETE Callback<a href={get_doc_url("on_complete")} target="_blank" class="text-pretty">
        <IconInfoCircle size={14} />
      </a></Label
    >
    <p class="text-xs text-muted-foreground">
      A callback invoked when removal is complete. Receives
      <code>(result, context)</code> where context contains <code>original</code> and
      <code>options</code>.
    </p>
    <div class="flex items-center gap-2">
      <Switch
        id="enable-on-complete"
        checked={on_complete_enabled}
        onCheckedChange={handle_on_complete_toggle}
      />
      <Label for="enable-on-complete">Enable ON_COMPLETE</Label>
    </div>
    {#if on_complete_enabled}
      <div class="border rounded-md text-sm overflow-x-auto" data-testid="on-complete-editor">
        <CodeMirror
          bind:value={on_complete_code}
          extensions={on_complete_extensions}
          styles={{ "&": { height: "200px", overflowX: "auto" } }}
        />
      </div>
    {/if}
  </div>
</Dialog>
