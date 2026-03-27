<script lang="ts">
  import { DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    NativeSelectOption,
    Root as NativeSelectRoot,
  } from "$lib/components/ui/native-select/index.js";
  import { getContext } from "svelte";
  import type { WhitespaceOption } from "../../services/structureService";
  import type { Context, StructureState } from "../../types/index";
  import Dialog from "../shared/Dialog.svelte";

  const structure_state = getContext<Context<StructureState>>("structure_state");

  interface AccentOption {
    key: string;
    label: string;
  }

  const column1: AccentOption[] = [
    { key: "05C3", label: "Sof pasuq" },
    { key: "0591", label: "Athnah" },
    { key: "0592", label: "Segolta" },
    { key: "0593", label: "Shaleshet" },
    { key: "0594", label: "Zaqef Qatan" },
    { key: "0595", label: "Zaqef Gadol" },
  ];

  const column2: AccentOption[] = [
    { key: "0596", label: "Tiphchah" },
    { key: "0597", label: "Rebia" },
    { key: "05AE", label: "Zarqa" },
    { key: "0599", label: "Pashta" },
    { key: "059A", label: "Yetiv" },
    { key: "059B", label: "Tebir" },
  ];

  const column3: AccentOption[] = [
    { key: "059C", label: "Geresh" },
    { key: "059E", label: "Gereshayim" },
    { key: "05A1", label: "Pazer" },
    { key: "059F", label: "Pazer Gadol" },
    { key: "05A0", label: "Telisha gedola" },
  ];

  function handle_option_change(key: string, value: WhitespaceOption) {
    structure_state.value.options = {
      ...structure_state.value.options,
      [key]: value,
    };
  }

  function get_option_value(key: string): WhitespaceOption {
    return (
      structure_state.value.options[key as keyof typeof structure_state.value.options] || "none"
    );
  }

  function handle_dialog_change(open: boolean) {
    structure_state.value.dialog_view_state = open ? "open" : "close";
  }
</script>

<Dialog text="Settings" testid="settings-button" on_change={handle_dialog_change}>
  <DialogHeader>
    <DialogTitle>Structure options</DialogTitle>
    <DialogDescription class="text-pretty">
      Choose how to format text after each disjunctive accent. Select "tab" or "new line" to add
      spacing after words with that accent.
    </DialogDescription>
  </DialogHeader>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
    <div class="flex flex-col gap-4">
      {#each column1 as item (item.key)}
        <div class="flex flex-col gap-1">
          <Label for={item.key}>{item.label}</Label>
          <NativeSelectRoot
            id={item.key}
            value={get_option_value(item.key)}
            onchange={(e: Event) =>
              handle_option_change(
                item.key,
                (e.currentTarget as HTMLSelectElement).value as WhitespaceOption,
              )}
          >
            <NativeSelectOption value="none">none</NativeSelectOption>
            <NativeSelectOption value="tab">tab</NativeSelectOption>
            <NativeSelectOption value="new_line">new line</NativeSelectOption>
          </NativeSelectRoot>
        </div>
      {/each}
    </div>

    <div class="flex flex-col gap-4">
      {#each column2 as item (item.key)}
        <div class="flex flex-col gap-1">
          <Label for={item.key}>{item.label}</Label>
          <NativeSelectRoot
            id={item.key}
            value={get_option_value(item.key)}
            onchange={(e: Event) =>
              handle_option_change(
                item.key,
                (e.currentTarget as HTMLSelectElement).value as WhitespaceOption,
              )}
          >
            <NativeSelectOption value="none">none</NativeSelectOption>
            <NativeSelectOption value="tab">tab</NativeSelectOption>
            <NativeSelectOption value="new_line">new line</NativeSelectOption>
          </NativeSelectRoot>
        </div>
      {/each}
    </div>

    <div class="flex flex-col gap-4">
      {#each column3 as item (item.key)}
        <div class="flex flex-col gap-1">
          <Label for={item.key}>{item.label}</Label>
          <NativeSelectRoot
            id={item.key}
            value={get_option_value(item.key)}
            onchange={(e: Event) =>
              handle_option_change(
                item.key,
                (e.currentTarget as HTMLSelectElement).value as WhitespaceOption,
              )}
          >
            <NativeSelectOption value="none">none</NativeSelectOption>
            <NativeSelectOption value="tab">tab</NativeSelectOption>
            <NativeSelectOption value="new_line">new line</NativeSelectOption>
          </NativeSelectRoot>
        </div>
      {/each}
    </div>
  </div>
</Dialog>
