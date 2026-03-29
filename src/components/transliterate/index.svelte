<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { setContext } from "svelte";
  import { toast } from "svelte-sonner";
  import { track_transliteration } from "../../lib/analytics";
  import { deserialize_schema, serialize_schema } from "../../lib/schemaSerialization";
  import { load_settings, save_settings } from "../../lib/storage";
  import { STORAGE_KEYS } from "../../lib/storageKeys";
  import { performTransliteration as perform_transliteration } from "../../services/transliterationService";
  import type {
    AppStatus,
    Context,
    DialogViewState,
    SchemaName,
    TransliterationState,
  } from "../../types/index";
  import { get_default_SBL_schema } from "../../utils/schemaDefaults";
  import Card from "../shared/Card.svelte";
  import ErrorBoundary from "../shared/ErrorBoundary.svelte";
  import Input from "../shared/Input.svelte";
  import Output from "../shared/Output.svelte";
  import NiqqudModal from "./NiqqudModal.svelte";
  import Settings from "./SettingsDialog.svelte";

  interface StoredSchemaData {
    values: TransliterationState["schema"];
    selected_schema_name: SchemaName | null;
    modified_schema_base: SchemaName | null;
  }

  const cantillation_regex = /[\u0591-\u05AE\u05BD\u05C3-\u05C5]/;
  const vowel_regex = /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/;

  const default_schema = get_default_SBL_schema();
  const stored_data = load_settings<StoredSchemaData>(STORAGE_KEYS.transliterate, {
    values: default_schema,
    selected_schema_name: null,
    modified_schema_base: null,
  });

  let transliteration_state: TransliterationState = $state({
    dialog_view_state: "close" as DialogViewState,
    input: "",
    input_placeholder: "עִבְרִית",
    output: "",
    schema: deserialize_schema(stored_data.values ?? default_schema),
    selected_schema_name: stored_data.selected_schema_name ?? "SBL Academic",
    modified_schema_base: stored_data.modified_schema_base,
  });

  $effect(() => {
    const data: StoredSchemaData = {
      values: serialize_schema(transliteration_state.schema),
      selected_schema_name: transliteration_state.selected_schema_name,
      modified_schema_base: transliteration_state.modified_schema_base,
    };
    save_settings(STORAGE_KEYS.transliterate, data);
  });

  // Provide context to child components
  setContext<Context<TransliterationState>>("transliteration_state", {
    get value() {
      return transliteration_state;
    },
    set value(v) {
      transliteration_state = v;
    },
  });

  let app_state: AppStatus = $state("idle");

  let output_placeholder = $state("");

  type ModalState = "closed" | "open" | "error";
  let niqqud_modal_state: ModalState = $state("closed");
  let pending_input = $state("");

  async function send_error_to_api(text: string, error: string) {
    try {
      await fetch("/api/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          error,
          path: window.location.pathname,
          options: JSON.stringify(transliteration_state.schema),
          browser: navigator.userAgent,
        }),
      });
    } catch {
      // Silently fail - we don't want to cause another error
    }
  }

  function do_transliteration(text: string) {
    const result = perform_transliteration({
      text,
      schemaOptions: transliteration_state.schema,
    });

    if (result.success) {
      transliteration_state.output = result.output;
      app_state = "idle";
    } else {
      transliteration_state.output = "";
      app_state = "error";
      const errorMsg = result.error || "Unknown error";
      toast.error(`Transliteration failed: ${errorMsg}`);
      send_error_to_api(text, errorMsg);
    }
  }

  function handle_transliterate() {
    const input = transliteration_state.input.trim();

    if (!input) return;

    app_state = "processing";

    if (!cantillation_regex.test(input)) {
      toast("Include cantillation marks to ensure accuracy");
    }

    if (!vowel_regex.test(input)) {
      pending_input = input;
      niqqud_modal_state = "open";
      return;
    }

    do_transliteration(input);
    track_transliteration({
      schema: transliteration_state.selected_schema_name ?? "custom",
      has_niqqud: true,
    });
  }

  function handle_transliterate_as_is() {
    niqqud_modal_state = "closed";
    app_state = "processing";
    do_transliteration(pending_input);
    track_transliteration({
      schema: transliteration_state.selected_schema_name ?? "custom",
      has_niqqud: false,
    });
  }

  function handle_niqqud_modal_open_change(open: boolean) {
    niqqud_modal_state = open ? "open" : "closed";
    if (!open) {
      app_state = "idle";
    }
  }

  $effect(() => {
    // This effect will re-run whenever input_placeholder, schema, or dialog_view_state changes
    const { dialog_view_state, input_placeholder, schema } = transliteration_state;

    if (dialog_view_state === "close") {
      const result = perform_transliteration({
        text: input_placeholder,
        schemaOptions: schema,
      });

      output_placeholder = result.success ? result.output : "";
    }
  });

  async function handle_copy_output() {
    if (transliteration_state.output && app_state !== "error") {
      try {
        await navigator.clipboard.writeText(transliteration_state.output);
        toast.success("Copied to clipboard");
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy to clipboard");
      }
    }
  }
</script>

<ErrorBoundary>
  <Card aria_busy={app_state === "processing" || app_state === "loading"}>
    <Input
      processing_state={app_state}
      aria-label="Hebrew text input"
      dir="rtl"
      style="font-family: 'SBL Hebrew', 'Segoe UI', Tahoma, sans-serif"
      placeholder={transliteration_state.input_placeholder}
      bind:value={transliteration_state.input}
    />
    <div class="flex justify-center">
      <Button
        data-testid="transliterate-button"
        onclick={handle_transliterate}
        class="cursor-pointer disabled:cursor-not-allowed"
        disabled={app_state === "processing" ||
          app_state === "loading" ||
          !transliteration_state.input.trim()}
        aria-describedby={app_state === "processing" ? "processing-status" : undefined}
      >
        {app_state === "processing" || app_state === "loading" ? "Processing..." : "Transliterate"}
      </Button>
    </div>
    <Output
      aria-label="Output text"
      style="font-family: 'Charis SIL', serif"
      class="italic"
      placeholder={output_placeholder}
      value={transliteration_state.output}
      on_copy={handle_copy_output}
    />
    <div class="flex justify-end">
      <Settings />
    </div>
    <div id="processing-status" class="sr-only" aria-live="polite">
      {app_state === "processing"
        ? "Processing Hebrew text"
        : app_state === "error"
          ? "Error occurred during transliteration"
          : ""}
    </div>
  </Card>

  <NiqqudModal
    open={niqqud_modal_state === "open"}
    on_transliterate_as_is={handle_transliterate_as_is}
    on_open_change={handle_niqqud_modal_open_change}
  />
</ErrorBoundary>
