<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { Snippet } from "svelte";

  interface Props {
    text: string;
    testid?: string;
    on_change?: (open: boolean) => void;
    children: Snippet;
  }

  let { text, testid, on_change, children }: Props = $props();
</script>

<Dialog.Root onOpenChange={on_change}>
  <form>
    <Dialog.Trigger
      type="button"
      data-testid={testid}
      class={buttonVariants({ variant: "default" })}
    >
      {text}
    </Dialog.Trigger>
    <Dialog.Content class="max-h-11/12 w-[95%] max-w-250 bg-card">
      {@render children()}
    </Dialog.Content>
  </form>
</Dialog.Root>
