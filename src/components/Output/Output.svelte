<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { type WithElementRef, type WithoutChildren } from "$lib/utils.js";
  import type { HTMLTextareaAttributes } from "svelte/elements";

  interface Props {
    on_copy?: () => void;
  }

  let {
    on_copy: onCopy,
    value,
    class: class_name,
    ...restProps
  }: Props & WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();

  let copied = $state(false);

  function handleCopyClick() {
    onCopy?.();
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div class="grid *:[grid-area:1/1]">
  <Textarea
    data-testid="output-textarea"
    aria-live="polite"
    class="min-h-30 disabled:cursor-auto disabled:opacity-100 md:text-lg {class_name}"
    name="Output"
    disabled
    {value}
    {...restProps}
  />
  <Button
    data-testid="copy-button"
    onclick={handleCopyClick}
    aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-auto w-fit place-self-end -translate-2"
    disabled={!value}
  >
    {copied ? "✓" : "Copy"}
  </Button>
</div>

<style></style>
