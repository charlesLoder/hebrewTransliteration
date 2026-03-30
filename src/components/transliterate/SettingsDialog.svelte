<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
  import { DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    NativeSelectOption,
    Root as NativeSelectRoot,
  } from "$lib/components/ui/native-select/index.js";
  import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
  import IconInfoCircle from "@tabler/icons-svelte/icons/info-circle";
  import type { SBL } from "hebrew-transliteration";
  import { getContext } from "svelte";
  import { toast } from "svelte-sonner";
  import { track_schema_change } from "../../lib/analytics";
  import {
    get_default_schema_fallback,
    load_schema,
    load_schema_manifest,
    type SchemaLoaderState,
  } from "../../lib/schemaLoader";
  import type { Context, TransliterationState, VisibilityState } from "../../types/index";
  import { format_doc_url, format_label } from "../../utils/documentation";
  import { get_default_SBL_schema } from "../../utils/schemaDefaults";
  import Dialog from "../shared/Dialog.svelte";
  import FeatureEditor from "./FeatureEditor.svelte";

  const transliteration_state = getContext<Context<TransliterationState>>("transliteration_state");

  type DageshChazaqOption = "none" | "double" | "custom";

  type StressMarkerLocation = NonNullable<SBL["STRESS_MARKER"]>["location"];

  type StressMarkerExclude = NonNullable<NonNullable<SBL["STRESS_MARKER"]>["exclude"]>;

  type AdditionalFeatures = SBL["ADDITIONAL_FEATURES"];

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

  let active_tab = $state("schemas");
  let custom_upload_visibility: VisibilityState = $state("hidden");
  let custom_schema_filename = $state("");

  function is_modified(): boolean {
    return !!transliteration_state.value.modified_schema_base;
  }

  function get_display_schema_name(): string {
    if (is_modified()) {
      return `${transliteration_state.value.selected_schema_name} (user modified)`;
    }
    return transliteration_state.value.selected_schema_name;
  }

  let active_dagesh_chazaq_option: DageshChazaqOption = $state(get_dagesh_chazaq_option());
  let dagesh_chazaq_custom_option_value = $state(get_dagesh_chazaq_custom_option_value());
  let stress_marker_selected = $state(get_stress_marker_selected());
  let stress_marker_location = $state(get_stress_marker_location());
  let stress_marker_mark = $state(get_stress_marker_mark());
  let stress_marker_exclude = $state(get_stress_marker_exclude());

  let additional_features = $state<AdditionalFeatures>([]);
  let editing_index = $state<number | null>(null);
  let feature_editor_visibility: VisibilityState = $state("hidden");

  function load_additional_features() {
    additional_features = transliteration_state.value.schema.ADDITIONAL_FEATURES || [];
  }

  const pages = [
    { title: "Schemas", id: "schemas" },
    { title: "Syllabification", id: "syllabification" },
    { title: "Consonants", id: "consonants" },
    { title: "Vowels", id: "vowels" },
    { title: "Others", id: "others" },
    { title: "Additional Features", id: "additional_features" },
  ];

  let schema_map = $state<Record<string, Partial<SBL>>>({});
  let loader_state = $state<SchemaLoaderState>("idle");
  let loader_error = $state<string | null>(null);
  let schema_manifest = $state<{ label: string; file: string }[]>([]);

  async function load_schemas() {
    loader_state = "loading";
    loader_error = null;
    try {
      const manifest = await load_schema_manifest();
      schema_manifest = manifest.schemas;
      const schema_labels = schema_manifest.map((s) => s.label);
      const schemas = await Promise.all(schema_labels.map(load_schema));
      schema_map = Object.fromEntries(schema_labels.map((label, i) => [label, schemas[i]]));
      loader_state = "success";
    } catch (err) {
      loader_error = err instanceof Error ? err.message : "Failed to load schemas";
      loader_state = "error";
      schema_map = { "SBL Academic": get_default_schema_fallback() };
      toast.warning("Using fallback schema. Some features may be unavailable.");
    }
  }

  load_schemas();

  const schema_options = $derived([...schema_manifest.map((s) => s.label), "Custom"]);

  const consonants = [
    "ALEF",
    "BET",
    "BET_DAGESH",
    "GIMEL",
    "GIMEL_DAGESH",
    "DALET",
    "DALET_DAGESH",
    "HE",
    "VAV",
    "ZAYIN",
    "HET",
    "TET",
    "YOD",
    "KAF",
    "KAF_DAGESH",
    "FINAL_KAF",
    "LAMED",
    "MEM",
    "FINAL_MEM",
    "NUN",
    "FINAL_NUN",
    "SAMEKH",
    "AYIN",
    "PE",
    "PE_DAGESH",
    "FINAL_PE",
    "TSADI",
    "FINAL_TSADI",
    "QOF",
    "RESH",
    "SHIN",
    "SIN",
    "TAV",
    "TAV_DAGESH",
  ] as const;

  const vowels = [
    "VOCAL_SHEVA",
    "PATAH",
    "HATAF_PATAH",
    "PATAH_HE",
    "FURTIVE_PATAH",
    "QAMATS",
    "HATAF_QAMATS",
    "QAMATS_HE",
    "QAMATS_QATAN",
    "HIRIQ",
    "HIRIQ_YOD",
    "TSERE",
    "TSERE_YOD",
    "TSERE_HE",
    "SEGOL",
    "HATAF_SEGOL",
    "SEGOL_HE",
    "SEGOL_YOD",
    "HOLAM",
    "HOLAM_HASER",
    "HOLAM_VAV",
    "QUBUTS",
    "SHUREQ",
  ] as const;

  const orthographies = [
    "MS_SUFX",
    "DIVINE_NAME",
    "DIVINE_NAME_ELOHIM",
    "SYLLABLE_SEPARATOR",
    "DAGESH",
    "MAQAF",
    "PASEQ",
    "SOF_PASUQ",
  ] as const;

  const syllabification = [
    "allowNoNiqqud",
    "article",
    "holemHaser",
    "longVowels",
    "qametsQatan",
    "shevaAfterMeteg",
    "shevaWithMeteg",
    "sqnmlvy",
    "strict",
    "wawShureq",
  ] as const;

  function handle_update_schema(key: keyof SBL, value: SBL[keyof SBL] | undefined) {
    mark_as_custom_if_needed();
    transliteration_state.value.schema = {
      ...transliteration_state.value.schema,
      [key]: value,
    };
    track_schema_change({
      change_type: "manual_edit",
      schema: transliteration_state.value.selected_schema_name ?? undefined,
    });
  }

  function get_transliteration_value(key: keyof SBL): string {
    const val =
      transliteration_state.value.schema[key as keyof typeof transliteration_state.value.schema];
    if (val === undefined || val === null) {
      return "undefined";
    }

    if (typeof val === "boolean") {
      return val ? "true" : "false";
    }

    return String(val);
  }

  function get_dagesh_chazaq_option(): DageshChazaqOption {
    if (transliteration_state.value.schema.DAGESH_CHAZAQ === true) {
      return "double";
    } else if (
      transliteration_state.value.schema.DAGESH_CHAZAQ === false ||
      transliteration_state.value.schema.DAGESH_CHAZAQ === undefined
    ) {
      return "none";
    } else {
      return "custom";
    }
  }

  function get_dagesh_chazaq_custom_option_value(): string {
    const option = get_dagesh_chazaq_option();
    if (option === "custom") {
      const val = transliteration_state.value.schema.DAGESH_CHAZAQ;
      return typeof val === "string" ? val : "";
    }
    return "";
  }

  function get_stress_marker_selected(): boolean {
    return !!transliteration_state.value.schema.STRESS_MARKER;
  }

  function get_stress_marker_location(): StressMarkerLocation {
    return transliteration_state.value.schema.STRESS_MARKER?.location ?? "before-syllable";
  }

  function get_stress_marker_mark(): string {
    return transliteration_state.value.schema.STRESS_MARKER?.mark ?? "ˈ";
  }

  function get_stress_marker_exclude(): StressMarkerExclude {
    return transliteration_state.value.schema.STRESS_MARKER?.exclude ?? "never";
  }

  function handle_schema_change(
    key: keyof SBL,
    value: (typeof transliteration_state.value.schema)[keyof typeof transliteration_state.value.schema],
  ) {
    let convertedValue: SBL[keyof SBL] | undefined;
    if (value === "undefined") {
      convertedValue = undefined;
    } else if (value === "true") {
      convertedValue = true;
    } else if (value === "false") {
      convertedValue = false;
    } else {
      convertedValue = value as SBL[keyof SBL];
    }
    handle_update_schema(key, convertedValue);
  }

  function handle_dagesh_chazaq_option_change(value: string) {
    function is_valid_option(val: string): val is DageshChazaqOption {
      return ["none", "double", "custom"].includes(val);
    }

    if (!is_valid_option(value)) {
      console.warn(`Invalid Dagesh Chazaq option: ${value}`);
      return;
    }

    active_dagesh_chazaq_option = value;
    if (value === "custom") {
      handle_schema_change("DAGESH_CHAZAQ", dagesh_chazaq_custom_option_value);
    } else {
      handle_schema_change("DAGESH_CHAZAQ", value === "double");
    }
  }

  function handle_dagesh_chazaq_custom_option_change(value: string) {
    dagesh_chazaq_custom_option_value = value;
    if (active_dagesh_chazaq_option === "custom") {
      handle_schema_change("DAGESH_CHAZAQ", value);
    }
  }

  function handle_stress_marker_toggle(value: boolean) {
    stress_marker_selected = value;
    if (!stress_marker_selected) {
      handle_schema_change("STRESS_MARKER", undefined);
    } else {
      update_stress_marker_schema();
    }
  }

  function handle_stress_marker_location_change(value: string) {
    function is_valid_location(val: string): val is StressMarkerLocation {
      return ["before-syllable", "after-syllable", "before-vowel", "after-vowel"].includes(val);
    }

    if (!is_valid_location(value)) {
      console.warn(`Invalid stress marker location: ${value}`);
      return;
    }

    stress_marker_location = value;
    update_stress_marker_schema();
  }

  function handle_stress_marker_mark_change(value: string) {
    stress_marker_mark = value;
    update_stress_marker_schema();
  }

  function handle_stress_marker_exclude_change(value: string) {
    function is_valid_exclude(val: string): val is StressMarkerExclude {
      return ["never", "final", "single"].includes(val);
    }

    if (!is_valid_exclude(value)) {
      console.warn(`Invalid stress marker exclude: ${value}`);
      return;
    }

    stress_marker_exclude = value;
    update_stress_marker_schema();
  }

  function update_stress_marker_schema() {
    const schema_value = {
      location: stress_marker_location as StressMarkerLocation,
      mark: stress_marker_mark,
      exclude: stress_marker_exclude as StressMarkerExclude,
    };
    handle_schema_change("STRESS_MARKER", schema_value);
  }

  function handle_schema_name_change(value: string) {
    transliteration_state.value.selected_schema_name = value;

    if (value === "Custom") {
      custom_upload_visibility = "visible";
      return;
    }

    custom_upload_visibility = "hidden";

    if (value === "SBL Academic") {
      const default_schema = get_default_SBL_schema();
      transliteration_state.value.schema = {
        ...default_schema,
      };
      transliteration_state.value.modified_schema_base = "";
      return;
    }

    const new_schema = schema_map[value];
    if (new_schema) {
      transliteration_state.value.schema = {
        ...new_schema,
      };
      transliteration_state.value.modified_schema_base = "";
    }

    track_schema_change({ change_type: "preset_change", schema: value });
  }

  function reset_to_base() {
    const get_base_schema = (): Partial<SBL> | undefined => {
      if (transliteration_state.value.modified_schema_base === "SBL Academic") {
        return get_default_SBL_schema();
      }
      if (transliteration_state.value.modified_schema_base) {
        return schema_map[transliteration_state.value.modified_schema_base];
      }
      if (transliteration_state.value.selected_schema_name !== "SBL Academic") {
        return get_default_SBL_schema();
      }
      return undefined;
    };

    const base_schema = get_base_schema();
    if (base_schema) {
      transliteration_state.value.schema = {
        ...base_schema,
      };
      transliteration_state.value.modified_schema_base = "";
    }

    track_schema_change({
      change_type: "reset",
      schema: transliteration_state.value.selected_schema_name,
    });
  }

  function mark_as_custom_if_needed() {
    if (!transliteration_state.value.modified_schema_base) {
      transliteration_state.value.modified_schema_base =
        transliteration_state.value.selected_schema_name;
    }
  }

  function serialize_value(key: string, value: unknown): unknown {
    if (value instanceof RegExp) {
      return `new RegExp(${JSON.stringify(value.source)}, ${JSON.stringify(value.flags)})`;
    }
    if (typeof value === "function") {
      return `(${value.toString()})`;
    }
    return value;
  }

  function export_schema() {
    const schemaContent = `export const schema = ${JSON.stringify(transliteration_state.value.schema, serialize_value, 2)};`;
    const blob = new Blob([schemaContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hebrew-schema.js";
    a.click();
    URL.revokeObjectURL(url);
  }

  function format_syllabification_label(key: string): string {
    switch (key) {
      case "allowNoNiqqud":
        return "Allow No Niqqud";
      case "article":
        return "Article";
      case "holemHaser":
        return "Holem Haser";
      case "longVowels":
        return "Long Vowels";
      case "qametsQatan":
        return "Qamets Qatan";
      case "shevaAfterMeteg":
        return "Sheva After Meteg";
      case "shevaWithMeteg":
        return "Sheva With Meteg";
      case "sqnmlvy":
        return "SQNMLVY";
      case "strict":
        return "Strict";
      case "wawShureq":
        return "Waw Shureq";
      default:
        return format_label(key);
    }
  }

  function handle_custom_schema_upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    custom_schema_filename = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const match = content.match(/export\s+const\s+schema\s*=\s*(\{[\s\S]*\});?/);
        if (!match) {
          console.error("Invalid schema file format");
          return;
        }
        const schemaObj = eval(`(${match[1]})`) as SBL;
        const reconstructed_schema = reconstruct_special_values(schemaObj) as SBL;
        transliteration_state.value.schema = {
          ...reconstructed_schema,
        };
        transliteration_state.value.modified_schema_base = "";
      } catch (err) {
        console.error("Failed to parse schema file:", err);
      }
    };
    reader.readAsText(file);
  }

  function reconstruct_special_values(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map(reconstruct_special_values);
    }
    if (obj && typeof obj === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
          if (/^new RegExp\(/.test(value)) {
            try {
              result[key] = eval(value);
            } catch {
              result[key] = value;
            }
          } else if (/^\(.*\) =>/.test(value) || /^function\(/.test(value)) {
            try {
              result[key] = eval(value);
            } catch {
              result[key] = value;
            }
          } else {
            result[key] = value;
          }
        } else {
          result[key] = reconstruct_special_values(value);
        }
      }
      return result;
    }
    return obj;
  }

  function clear_custom_schema() {
    custom_schema_filename = "";
    custom_upload_visibility = "hidden";
    transliteration_state.value.selected_schema_name = "SBL Academic";
    const default_schema = get_default_SBL_schema();
    transliteration_state.value.schema = {
      ...default_schema,
    };
    transliteration_state.value.modified_schema_base = "";
  }

  function handle_add_feature() {
    editing_index = null;
    feature_editor_visibility = "visible";
    track_schema_change({
      change_type: "feature_add",
      schema: transliteration_state.value.selected_schema_name ?? undefined,
    });
  }

  function handle_delete_feature(index: number) {
    mark_as_custom_if_needed();
    const newFeatures = [...(additional_features || [])];
    newFeatures.splice(index, 1);
    handle_update_schema("ADDITIONAL_FEATURES", newFeatures);
    load_additional_features();
    track_schema_change({
      change_type: "feature_delete",
      schema: transliteration_state.value.selected_schema_name ?? undefined,
    });
  }

  function handle_save_feature(form: FeatureForm) {
    mark_as_custom_if_needed();

    const hebrew = form.is_regex
      ? new RegExp(form.hebrew_text, form.regex_flags)
      : form.hebrew_text;

    const transliteration = form.is_callback
      ? eval(`(${form.callback_code})`)
      : form.transliteration_text;

    const feature = {
      FEATURE: form.feature_type,
      HEBREW: hebrew,
      PASS_THROUGH: form.pass_through,
      TRANSLITERATION: transliteration,
    } as NonNullable<AdditionalFeatures>[number];

    const newFeatures = [...(additional_features || [])];
    if (editing_index !== null) {
      newFeatures[editing_index] = feature;
    } else {
      newFeatures.push(feature);
    }

    handle_update_schema("ADDITIONAL_FEATURES", newFeatures);
    feature_editor_visibility = "hidden";
    load_additional_features();
    track_schema_change({
      change_type: editing_index !== null ? "feature_edit" : "feature_add",
      schema: transliteration_state.value.selected_schema_name ?? undefined,
    });
  }

  function get_feature_hebrew_display(feature: NonNullable<AdditionalFeatures>[number]): string {
    if (feature.HEBREW instanceof RegExp) {
      return `/${feature.HEBREW.source}/${feature.HEBREW.flags}`;
    }
    return String(feature.HEBREW);
  }

  function get_feature_transliteration_display(
    feature: NonNullable<AdditionalFeatures>[number],
  ): string {
    if (typeof feature.TRANSLITERATION === "string") {
      return feature.TRANSLITERATION;
    }
    return "(callback function)";
  }

  function create_form_for_feature(feature: NonNullable<AdditionalFeatures>[number]): {
    feature_type: "word" | "syllable" | "cluster";
    hebrew_text: string;
    is_regex: boolean;
    regex_flags: string;
    pass_through: boolean;
    is_callback: boolean;
    transliteration_text: string;
    callback_code: string;
  } {
    const hebrew =
      feature.HEBREW instanceof RegExp ? feature.HEBREW.source : String(feature.HEBREW);
    const is_regex = feature.HEBREW instanceof RegExp;
    const regex_flags = is_regex ? (feature.HEBREW as RegExp).flags : "g";
    const is_callback = typeof feature.TRANSLITERATION === "function";

    return {
      feature_type: feature.FEATURE,
      hebrew_text: hebrew,
      is_regex,
      regex_flags,
      pass_through: feature.PASS_THROUGH ?? true,
      is_callback,
      transliteration_text: is_callback ? "" : String(feature.TRANSLITERATION),
      callback_code: is_callback
        ? feature.TRANSLITERATION.toString()
        : "(item, hebrew, schema) => {\n  \n}",
    };
  }

  function handle_dialog_change(open: boolean) {
    transliteration_state.value.dialog_view_state = open ? "open" : "close";
  }

  function get_doc_url(key: string): string {
    return format_doc_url("/api/classes/schema", key);
  }

  $effect(() => {
    load_additional_features();
  });
</script>

<Dialog text="Settings" testid="settings-button" on_change={handle_dialog_change}>
  <DialogHeader>
    <DialogTitle>Settings</DialogTitle>
    <DialogDescription class="text-pretty">
      Choose a premade schema or customize one (see <a
        href={get_doc_url("")}
        target="_blank"
        class="underline">api docs.</a
      >).
    </DialogDescription>
  </DialogHeader>

  <Tabs bind:value={active_tab} class="gap-4">
    <TabsList data-testid="settings-tabs" class="w-full h-auto grid grid-cols-2 md:flex">
      {#each pages as page (page.id)}
        <TabsTrigger value={page.id}>{page.title}</TabsTrigger>
      {/each}
    </TabsList>

    <TabsContent value="schemas" class="flex flex-col gap-6">
      <div class="flex flex-col gap-4 h-72 xl:h-92">
        {#if loader_state === "loading"}
          <p class="text-muted-foreground">Loading schemas...</p>
        {:else if loader_state === "error"}
          <p class="text-destructive text-sm">
            Warning: Using fallback schema. {loader_error}
          </p>
        {/if}
        <div class="shema-select flex flex-col gap-2">
          <Label for="schema-select" class="text-muted-foreground text-sm text-pretty"
            >Choose a premade schema and optionally customize it</Label
          >
          <NativeSelectRoot
            id="schema-select"
            data-testid="schema-select"
            value={transliteration_state.value.selected_schema_name}
            onchange={(e: Event) =>
              handle_schema_name_change((e.currentTarget as HTMLSelectElement).value)}
          >
            {#each schema_options as schema (schema)}
              <NativeSelectOption value={schema}
                >{schema === transliteration_state.value.selected_schema_name
                  ? get_display_schema_name()
                  : schema}</NativeSelectOption
              >
            {/each}
          </NativeSelectRoot>
          <div class="flex gap-2">
            <Button
              data-testid="reset-button"
              disabled={!is_modified()}
              variant="link"
              class="p-0 disabled:cursor-not-allowed"
              onclick={reset_to_base}
            >
              Reset to default
            </Button>
          </div>
        </div>
        <div class="schema-custom-upload flex flex-col gap-2">
          <Label
            for="custom-schema-upload"
            class={`${custom_upload_visibility === "hidden" ? "text-muted-foreground" : ""} text-sm`}
            >Upload Custom Schema (.js)</Label
          >
          {#if custom_schema_filename}
            <div class="flex items-center gap-2">
              <span class="text-sm">{custom_schema_filename}</span>
              <Button
                variant="destructive"
                title={`Clear ${custom_schema_filename}`}
                size="sm"
                onclick={clear_custom_schema}
              >
                Clear
              </Button>
            </div>
          {:else}
            <Input
              id="custom-schema-upload"
              type="file"
              accept=".js"
              disabled={custom_upload_visibility === "hidden"}
              onchange={handle_custom_schema_upload}
            />
          {/if}
        </div>
        <div class="schema-export mbs-auto">
          <Button data-testid="export-button" variant="secondary" onclick={export_schema}>
            Export Settings
          </Button>
        </div>
      </div>
    </TabsContent>

    <TabsContent value="syllabification" class="flex flex-col gap-6">
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-1">
          {#each syllabification as key (key)}
            <div class="flex flex-col gap-2">
              <Label for="select-{key}" class="gap-1"
                >{format_syllabification_label(key)}
                <a href={get_doc_url(key)} target="_blank" class="text-pretty">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
              <NativeSelectRoot
                name="select-{key}"
                value={get_transliteration_value(key)}
                onchange={(e: Event) =>
                  handle_schema_change(key, (e.currentTarget as HTMLSelectElement).value)}
              >
                <NativeSelectOption value="undefined"></NativeSelectOption>
                {#if key === "holemHaser"}
                  <NativeSelectOption value="update">update</NativeSelectOption>
                  <NativeSelectOption value="preserve">preserve</NativeSelectOption>
                  <NativeSelectOption value="remove">remove</NativeSelectOption>
                {:else}
                  <NativeSelectOption value="true">true</NativeSelectOption>
                  <NativeSelectOption value="false">false</NativeSelectOption>
                {/if}
              </NativeSelectRoot>
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="consonants" class="flex flex-col gap-6">
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 p-1">
          {#each consonants as key (key)}
            <div class="flex flex-col gap-2">
              <Label for="input-{key}" class="gap-1"
                >{format_label(key)}
                <a href={get_doc_url(key)} target="_blank" class="text-pretty">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
              <Input
                id="input-{key}"
                aria-label={key}
                value={get_transliteration_value(key) === "undefined"
                  ? ""
                  : get_transliteration_value(key)}
                placeholder={transliteration_state.value.schema[key] || ""}
                onchange={(e: Event) =>
                  handle_schema_change(key, (e.currentTarget as HTMLInputElement).value)}
              />
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="vowels" class="flex flex-col gap-6">
      <ScrollArea class="h-72 xl:h-92">
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 p-1">
          {#each vowels as key (key)}
            <div class="flex flex-col gap-2">
              <Label for="input-{key}" class="gap-1"
                >{format_label(key)}
                <a href={get_doc_url(key)} target="_blank" class="text-pretty">
                  <IconInfoCircle size={14} />
                </a>
              </Label>
              <Input
                id="input-{key}"
                aria-label={key}
                value={get_transliteration_value(key) === "undefined"
                  ? ""
                  : get_transliteration_value(key)}
                placeholder={transliteration_state.value.schema[key] || ""}
                onchange={(e: Event) =>
                  handle_schema_change(key, (e.currentTarget as HTMLInputElement).value)}
              />
            </div>
          {/each}
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="others" class="flex flex-col gap-6">
      <ScrollArea class="h-72 xl:h-92">
        <div class="flex flex-col gap-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-1">
            {#each orthographies as key (key)}
              <div class="flex flex-col justify-between gap-2">
                <Label for="input-{key}" class="gap-1"
                  >{format_label(key)}
                  <a href={get_doc_url(key)} target="_blank" class="text-pretty">
                    <IconInfoCircle size={14} />
                  </a>
                </Label>
                <Input
                  id="input-{key}"
                  aria-label={key}
                  value={get_transliteration_value(key) === "undefined"
                    ? ""
                    : get_transliteration_value(key)}
                  placeholder={transliteration_state.value.schema[key] || ""}
                  onchange={(e: Event) =>
                    handle_schema_change(key, (e.currentTarget as HTMLInputElement).value)}
                />
              </div>
            {/each}
          </div>
          <div class="flex flex-wrap gap-4">
            <!-- Dagesh Chazaq -->
            <div>
              <Label class="mbe-4 gap-1"
                >Dagesh Chazaq<a
                  href={get_doc_url("dagesh_chazaq")}
                  target="_blank"
                  class="text-pretty"
                >
                  <IconInfoCircle size={14} />
                </a></Label
              >
              <RadioGroup
                value={active_dagesh_chazaq_option}
                onValueChange={handle_dagesh_chazaq_option_change}
              >
                <div class="flex space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label for="none">None</Label>
                </div>
                <div class="flex space-x-2">
                  <RadioGroupItem value="double" id="double" />
                  <Label for="double">Double</Label>
                </div>
                <div class="flex space-x-2 items-center">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label for="custom">Custom</Label>
                  <Input
                    class="max-w-12"
                    value={dagesh_chazaq_custom_option_value}
                    oninput={(e: Event) =>
                      handle_dagesh_chazaq_custom_option_change(
                        (e.currentTarget as HTMLInputElement).value,
                      )}
                    disabled={active_dagesh_chazaq_option !== "custom"}
                  />
                </div>
              </RadioGroup>
            </div>
            <!-- /Dagesh Chazaq -->
            <!-- STRESS_MARKER -->
            <div>
              <Label class="mbe-4 gap-1"
                >Stress Marker<a
                  href={get_doc_url("stress_marker")}
                  target="_blank"
                  class="text-pretty"
                >
                  <IconInfoCircle size={14} />
                </a></Label
              >
              <div class="flex items-center space-x-2 mbe-2">
                <Switch
                  id="enable-stress-marker"
                  checked={stress_marker_selected}
                  onCheckedChange={handle_stress_marker_toggle}
                />
                <Label for="enable-stress-marker">Enable Stress Marker</Label>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex flex-row gap-2">
                  <!-- Location -->
                  <div>
                    <Label for="stress-marker-location" class="mb-1">Location</Label>
                    <NativeSelectRoot
                      disabled={!stress_marker_selected}
                      value={stress_marker_location}
                      onchange={(e: Event) =>
                        handle_stress_marker_location_change(
                          (e.currentTarget as HTMLSelectElement).value,
                        )}
                    >
                      <NativeSelectOption value="before-syllable"
                        >before-syllable</NativeSelectOption
                      >
                      <NativeSelectOption value="after-syllable">after-syllable</NativeSelectOption>
                      <NativeSelectOption value="before-vowel">before-vowel</NativeSelectOption>
                      <NativeSelectOption value="after-vowel">after-vowel</NativeSelectOption>
                    </NativeSelectRoot>
                  </div>
                  <!-- /Location -->
                  <!-- Mark -->
                  <div>
                    <Label for="stress-marker-mark" class="mb-1">Mark</Label>
                    <Input
                      id="stress-marker-mark"
                      disabled={!stress_marker_selected}
                      class="max-w-12"
                      value={stress_marker_mark}
                      oninput={(e: Event) =>
                        handle_stress_marker_mark_change(
                          (e.currentTarget as HTMLInputElement).value,
                        )}
                    />
                  </div>
                  <!-- /Mark -->
                </div>
                <!-- Exclude -->
                <div>
                  <Label for="stress-marker-exclude" class="mb-1">Exclude</Label>
                  <NativeSelectRoot
                    disabled={!stress_marker_selected}
                    value={stress_marker_exclude}
                    onchange={(e: Event) =>
                      handle_stress_marker_exclude_change(
                        (e.currentTarget as HTMLSelectElement).value,
                      )}
                  >
                    <NativeSelectOption value="never">never</NativeSelectOption>
                    <NativeSelectOption value="final">final</NativeSelectOption>
                    <NativeSelectOption value="single">single</NativeSelectOption>
                  </NativeSelectRoot>
                </div>
                <!-- /Exclude -->
              </div>
            </div>
            <!-- /STRESS_MARKER -->
          </div>
        </div>
      </ScrollArea>
    </TabsContent>

    <TabsContent value="additional_features" class="flex flex-col gap-6">
      <div class="flex justify-end items-center gap-4">
        <div>
          <Label class="gap-1"
            >Learn more<a
              href={get_doc_url("additional_features")}
              target="_blank"
              class="text-pretty"
            >
              <IconInfoCircle size={14} />
            </a></Label
          >
        </div>
        <Button data-testid="add-feature-button" onclick={handle_add_feature}>+ Add Feature</Button>
      </div>

      <ScrollArea class="h-68 xl:h-88">
        <div class="flex flex-col gap-4">
          {#each additional_features || [] as feature, index (index)}
            <Card data-testid="additional-feature-{index}">
              <CardHeader>
                <CardTitle class="capitalize text-sm">
                  {feature.FEATURE}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label class="text-muted-foreground text-xs">Hebrew Match</Label>
                    <code
                      data-testid="additional-feature-hebrew-{index}"
                      class="text-xs block mt-1 p-1 bg-muted rounded"
                      >{get_feature_hebrew_display(feature)}</code
                    >
                  </div>
                  <div>
                    <Label class="text-muted-foreground text-xs">Transliteration</Label>
                    <code
                      data-testid="additional-feature-transliteration-{index}"
                      class="text-xs block mt-1 p-1 bg-muted rounded truncate"
                      >{get_feature_transliteration_display(feature)}</code
                    >
                  </div>
                </div>
                <div class="mt-2 text-xs text-muted-foreground">
                  Pass through: {(feature.PASS_THROUGH ?? true) ? "Yes" : "No"}
                </div>
              </CardContent>
              <CardFooter class="gap-2">
                <Button
                  data-testid="edit-feature-button"
                  variant="outline"
                  size="sm"
                  onclick={() => {
                    editing_index = index;
                    feature_editor_visibility = "visible";
                  }}
                >
                  Edit
                </Button>
                <Button
                  data-testid="delete-feature-button"
                  variant="destructive"
                  size="sm"
                  onclick={() => handle_delete_feature(index)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          {:else}
            <p class="text-muted-foreground text-center py-8">
              No additional features defined. Click "Add Feature" to create one.
            </p>
          {/each}
        </div>
      </ScrollArea>

      {#if feature_editor_visibility === "visible"}
        <FeatureEditor
          initial_form={editing_index !== null
            ? create_form_for_feature(additional_features![editing_index])
            : undefined}
          {editing_index}
          {consonants}
          {vowels}
          on_save={(form) => handle_save_feature(form)}
          on_cancel={() => {
            feature_editor_visibility = "hidden";
            editing_index = null;
          }}
        />
      {/if}
    </TabsContent>
  </Tabs>
</Dialog>
