<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { setContext } from "svelte";
  import { toast } from "svelte-sonner";
  import { load_settings, save_settings } from "../../lib/storage";
  import { STORAGE_KEYS } from "../../lib/storageKeys";
  import { trackStructure } from "../../lib/analytics";
  import { performStructure } from "../../services/structureService";
  import type { AppStatus, Context, StructureState } from "../../types/index";
  import { default_structure_options } from "../../utils/defaults";
  import Card from "../shared/Card.svelte";
  import Input from "../shared/Input.svelte";
  import Output from "../shared/Output.svelte";
  import Settings from "./Settings.svelte";

  const saved_options = load_settings(STORAGE_KEYS.structure, default_structure_options);

  let structure_state: StructureState = $state({
    dialog_view_state: "close",
    input: "",
    input_placeholder: "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃",
    output: "",
    options: saved_options,
  });

  $effect(() => {
    save_settings(STORAGE_KEYS.structure, structure_state.options);
  });

  setContext<Context<StructureState>>("structure_state", {
    get value() {
      return structure_state;
    },
    set value(v) {
      structure_state = v;
    },
  });

  let app_state: AppStatus = $state("idle");

  let output_placeholder = $state("");

  function handle_structure() {
    app_state = "processing";

    const result = performStructure({
      text: structure_state.input,
      options: structure_state.options,
    });

    if (result.success) {
      structure_state.output = result.output;
      app_state = "idle";
      const hasCustomWhitespace = Object.values(structure_state.options).some((v) => v !== "none");
      trackStructure({ has_custom_whitespace: hasCustomWhitespace });
    } else {
      structure_state.output = "";
      app_state = "error";
      toast.error(`Structure failed: ${result.error || "Unknown error"}`);
    }
  }

  function handle_placeholder_structure() {
    app_state = "processing";

    const result = performStructure({
      text: structure_state.input_placeholder,
      options: structure_state.options,
    });

    if (result.success) {
      output_placeholder = result.output;
      app_state = "idle";
    } else {
      output_placeholder = "";
      app_state = "error";
      toast.error(`Structure failed: ${result.error || "Unknown error"}`);
    }
  }

  async function handle_copy_output() {
    if (structure_state.output && app_state !== "error") {
      try {
        await navigator.clipboard.writeText(structure_state.output);
        toast.success("Copied to clipboard");
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy to clipboard");
      }
    }
  }

  $effect(() => {
    if (structure_state.dialog_view_state === "close") {
      handle_placeholder_structure();
    }
  });
</script>

<Card aria_busy={app_state === "processing" || app_state === "loading"}>
  <Input
    processing_state={app_state}
    aria-label="Hebrew text input"
    dir="rtl"
    style="font-family: 'SBL Hebrew', 'Segoe UI', Tahoma, sans-serif"
    placeholder={structure_state.input_placeholder}
    bind:value={structure_state.input}
  />
  <div class="flex justify-center">
    <Button
      data-testid="structure-button"
      onclick={handle_structure}
      class="cursor-pointer disabled:cursor-not-allowed"
      disabled={app_state === "processing" ||
        app_state === "loading" ||
        !structure_state.input.trim()}
      aria-describedby={app_state === "processing" ? "processing-status" : undefined}
    >
      {app_state === "processing" || app_state === "loading" ? "Processing..." : "Structure"}
    </Button>
  </div>
  <Output
    aria-label="Output text"
    dir="rtl"
    style="font-family: 'SBL Hebrew', 'Segoe UI', Tahoma, sans-serif"
    class="not-italic whitespace-pre-wrap"
    placeholder={output_placeholder}
    value={structure_state.output}
    on_copy={handle_copy_output}
  />
  <div class="flex justify-end">
    <Settings />
  </div>
  <div id="processing-status" class="sr-only" aria-live="polite">
    {app_state === "processing"
      ? "Processing Hebrew text"
      : app_state === "error"
        ? "Error occurred during processing"
        : ""}
  </div>
</Card>
