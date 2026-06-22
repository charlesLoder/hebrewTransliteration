<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { RemoveOptions } from "hebrew-transliteration";
  import { setContext } from "svelte";
  import { toast } from "svelte-sonner";
  import { track_removal } from "../../lib/analytics";
  import { deserialize_object, serialize_object } from "../../lib/schemaSerialization";
  import { load_settings, save_settings } from "../../lib/storage";
  import { STORAGE_KEYS } from "../../lib/storageKeys";
  import { performRemoval } from "../../services/removalService";
  import type { AppStatus, Context, RemoveState } from "../../types/index";
  import { default_remove_options } from "../../utils/defaults";
  import Card from "../shared/Card.svelte";
  import Input from "../shared/Input.svelte";
  import Output from "../shared/Output.svelte";
  import Settings from "./Settings.svelte";

  const saved_options = deserialize_object(
    load_settings(STORAGE_KEYS.remove, default_remove_options),
  ) as RemoveOptions;

  let remove_state: RemoveState = $state({
    dialog_view_state: "close",
    input: "",
    input_placeholder: "שָׂרַ֣י אִשְׁתְּךָ֔",
    output: "",
    options: saved_options,
  });

  $effect(() => {
    save_settings(STORAGE_KEYS.remove, serialize_object(remove_state.options));
  });

  setContext<Context<RemoveState>>("remove_state", {
    get value() {
      return remove_state;
    },
    set value(v) {
      remove_state = v;
    },
  });

  let app_state: AppStatus = $state("idle");

  let output_placeholder = $state("");

  function handle_remove() {
    app_state = "processing";

    const result = performRemoval({
      text: remove_state.input,
      options: remove_state.options,
    });

    if (result.success) {
      remove_state.output = result.output;
      app_state = "idle";
      const opts = remove_state.options;
      const vowels = [
        "SHEVA",
        "HATAF_SEGOL",
        "HATAF_PATAH",
        "HATAF_QAMATS",
        "HIRIQ",
        "TSERE",
        "SEGOL",
        "PATAH",
        "QAMATS",
        "HOLAM",
        "QUBUTS",
        "QAMATS_QATAN",
      ];
      const punctuation = [
        "MAQAF",
        "PASEQ",
        "SOF_PASUQ",
        "NUN_HAFUKHA",
        "PUNC_GERESH",
        "PUNC_GERSHAYIM",
        "MASORA_CIRCLE",
        "LOWER_DOT",
        "UPPER_DOT",
        "DAGESH",
        "METEG",
        "RAFE",
        "SHIN_DOT",
        "SIN_DOT",
      ];
      const taamim = [
        "ETNAHTA",
        "SEGOLTA",
        "SHALSHELET",
        "ZAQEF_QATAN",
        "ZAQEF_GADOL",
        "TIPEHA",
        "REVIA",
        "ZARQA",
        "PASHTA",
        "YETIV",
        "TEVIR",
        "GERESH",
        "GERESH_MUQDAM",
        "GERSHAYIM",
        "QARNEY_PARA",
        "TELISHA_GEDOLA",
        "PAZER",
        "ATNAH_HAFUKH",
        "MUNAH",
        "MAHAPAKH",
        "MERKHA",
        "MERKHA_KEFULA",
        "DARGA",
        "QADMA",
        "TELISHA_QETANA",
        "YERAH_BEN_YOMO",
        "OLE",
        "ILUY",
        "DEHI",
        "ZINOR",
      ];
      track_removal({
        removed_vowels: vowels.some((k) => opts[k as keyof typeof opts]),
        removed_cantillation: taamim.some((k) => opts[k as keyof typeof opts]),
        removed_punctuation: punctuation.some((k) => opts[k as keyof typeof opts]),
      });
    } else {
      remove_state.output = "";
      app_state = "error";
      toast.error(`Removal failed: ${result.error || "Unknown error"}`);
    }
  }

  function handle_placeholder_remove() {
    app_state = "processing";

    const result = performRemoval({
      text: remove_state.input_placeholder,
      options: remove_state.options,
    });

    if (result.success) {
      output_placeholder = result.output;
      app_state = "idle";
    } else {
      output_placeholder = "";
      app_state = "error";
      toast.error(`Removal failed: ${result.error || "Unknown error"}`);
    }
  }

  async function handle_copy_output() {
    if (remove_state.output && app_state !== "error") {
      try {
        await navigator.clipboard.writeText(remove_state.output);
        toast.success("Copied to clipboard");
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy to clipboard");
      }
    }
  }

  $effect(() => {
    if (remove_state.dialog_view_state === "close") {
      handle_placeholder_remove();
    }
  });
</script>

<Card aria_busy={app_state === "processing" || app_state === "loading"}>
  <Input
    processing_state={app_state}
    aria-label="Hebrew text input"
    dir="rtl"
    style="font-family: 'SBL Hebrew', 'Segoe UI', Tahoma, sans-serif"
    placeholder={remove_state.input_placeholder}
    bind:value={remove_state.input}
  />
  <div class="flex justify-center">
    <Button
      data-testid="remove-button"
      onclick={handle_remove}
      class="cursor-pointer disabled:cursor-not-allowed"
      disabled={app_state === "processing" || app_state === "loading" || !remove_state.input.trim()}
      aria-describedby={app_state === "processing" ? "processing-status" : undefined}
    >
      {app_state === "processing" || app_state === "loading" ? "Processing..." : "Remove"}
    </Button>
  </div>
  <Output
    aria-label="Output text"
    dir="rtl"
    style="font-family: 'SBL Hebrew', 'Segoe UI', Tahoma, sans-serif"
    class="not-italic"
    placeholder={output_placeholder}
    value={remove_state.output}
    on_copy={handle_copy_output}
  />
  <div class="flex justify-end">
    <Settings />
  </div>
  <div id="processing-status" class="sr-only" aria-live="polite">
    {app_state === "processing"
      ? "Processing Hebrew text"
      : app_state === "error"
        ? "Error occurred during removal"
        : ""}
  </div>
</Card>
