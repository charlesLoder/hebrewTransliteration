<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { version } from "hebrew-transliteration/package.json";
  import type { Snippet } from "svelte";
  import FeedbackModal from "./FeedbackModal.svelte";

  interface Props {
    aria_busy: boolean;
    children: Snippet;
  }

  let { aria_busy, children }: Props = $props();

  const this_year = new Date().getFullYear();
</script>

<Card.Root class="p-2 md:p-6" aria-busy={aria_busy}>
  {@render children()}
  <Separator />
  <Card.Footer class="flex-col gap-2 content-center md:flex-row md:justify-between md:items-start">
    <div class="flex flex-col content-center gap-2">
      <p class="text-xs text-center">
        &copy;&nbsp;{this_year} Charles&nbsp;Loder
      </p>
      <a href="https://www.buymeacoffee.com/charlesLoder" target="_blank" rel="noopener noreferrer">
        <img width="150" height="43" src="/bmc-button.svg" alt="Buy me a coffee!" />
      </a>
    </div>
    <div class="flex flex-col items-center md:items-end gap-2">
      <p class="text-xs">
        <a
          href="https://www.npmjs.com/package/hebrew-transliteration"
          target="_blank"
          rel="noopener noreferrer">hebrew-transliteration: v{version}</a
        >
      </p>
      <FeedbackModal />
    </div>
  </Card.Footer>
</Card.Root>
