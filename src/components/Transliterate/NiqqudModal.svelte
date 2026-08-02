<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  interface Props {
    open: boolean;
    on_transliterate_as_is: () => void;
    on_open_change: (open: boolean) => void;
  }

  let { open, on_transliterate_as_is, on_open_change }: Props = $props();
</script>

<Dialog.Root {open} onOpenChange={on_open_change}>
  <Dialog.Content class="max-h-11/12 w-[95%] max-w-250">
    <Dialog.Header>
      <Dialog.Title>No vowels detected</Dialog.Title>
      <Dialog.Description>
        The text you entered does not contain Hebrew vowel marks (niqqud). You can add niqqud using
        <a
          href="https://nakdan.dicta.org.il/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          Nakdan
        </a>
        , an external service. Results may not be accurate.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={on_transliterate_as_is}>Transliterate as-is</Button>
      <Button>
        <a
          href="https://nakdan.dicta.org.il/"
          target="_blank"
          onclick={() => {
            on_open_change(false);
          }}
        >
          Open Nakdan
        </a>
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
