<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { type WithElementRef, type WithoutChildren } from "$lib/utils.js";
  import type { HTMLTextareaAttributes } from "svelte/elements";

  interface Props {
    processing_state?: "idle" | "loading" | "processing" | "error";
  }

  let {
    processing_state: processing_state = "idle",
    value = $bindable(),
    ...restProps
  }: Props & WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<Textarea
  data-testid="input-textarea"
  name="Input"
  spellcheck="false"
  class="min-h-30 md:text-lg"
  bind:value
  {...restProps}
  disabled={processing_state === "processing" || processing_state === "loading"}
/>
