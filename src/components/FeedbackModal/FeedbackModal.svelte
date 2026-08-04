<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    NativeSelectOption,
    Root as NativeSelectRoot,
  } from "$lib/components/ui/native-select/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import IconMessageCircle from "@tabler/icons-svelte/icons/message-circle";

  type FormState = "idle" | "submitting" | "success" | "error";

  let open = $state(false);
  let email = $state("");
  let issue = $state("");
  let response = $state("");
  let form_state: FormState = $state("idle");

  function reset_form() {
    email = "";
    issue = "";
    response = "";
    form_state = "idle";
  }

  function handle_close() {
    open = false;
    reset_form();
  }

  async function handle_submit(e: Event) {
    e.preventDefault();
    form_state = "submitting";

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, issue, response }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      form_state = "success";
    } catch {
      form_state = "error";
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    type="button"
    class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
  >
    <IconMessageCircle class="size-4" />
    Feedback
  </Dialog.Trigger>
  <Dialog.Content class="max-h-11/12 w-[95%] max-w-250">
    <Dialog.Header>
      <Dialog.Title>
        {#if form_state === "success"}
          Thank You!
        {:else if form_state === "error"}
          Error
        {:else}
          Feedback
        {/if}
      </Dialog.Title>
      <Dialog.Description>
        {#if form_state === "success"}
          Your feedback has been submitted successfully.
        {:else if form_state === "error"}
          Failed to submit feedback. Please try again.
        {:else}
          Let us know if you found an issue or have suggestions for improvement.
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    {#if form_state === "success"}
      <div class="flex flex-col gap-4 py-4">
        <p class="text-sm text-muted-foreground">
          We appreciate you taking the time to help improve this site.
        </p>
        <Dialog.Footer class="sm:flex-row gap-2">
          <Button variant="outline" onclick={() => handle_close()}>Close</Button>
          <Button onclick={reset_form}>Submit More Feedback</Button>
        </Dialog.Footer>
      </div>
    {:else if form_state === "error"}
      <div class="flex flex-col gap-4 py-4">
        <p class="text-sm text-muted-foreground">
          Please try again or contact support if the problem persists.
        </p>
        <Dialog.Footer class="sm:flex-row gap-2">
          <Button variant="outline" onclick={() => handle_close()}>Close</Button>
          <Button onclick={reset_form}>Try Again</Button>
        </Dialog.Footer>
      </div>
    {:else}
      <form onsubmit={handle_submit} class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="only if you would like a response"
            bind:value={email}
          />
        </div>
        <div class="grid gap-2">
          <Label for="issue">Issue type <span class="text-destructive">*</span></Label>
          <NativeSelectRoot bind:value={issue} required>
            <option value="" disabled selected>Select an issue type</option>
            <NativeSelectOption value="incorrect">Incorrect output</NativeSelectOption>
            <NativeSelectOption value="error">Received an error</NativeSelectOption>
            <NativeSelectOption value="generic">Generic feedback</NativeSelectOption>
            <NativeSelectOption value="other">Other</NativeSelectOption>
          </NativeSelectRoot>
        </div>
        <div class="grid gap-2">
          <Label for="response">Feedback <span class="text-destructive">*</span></Label>
          <Textarea
            id="response"
            name="response"
            placeholder="Share your feedback..."
            bind:value={response}
            required
          />
        </div>
        <Dialog.Footer>
          <Button type="submit" disabled={form_state === "submitting"}>
            {form_state === "submitting" ? "Submitting..." : "Submit"}
          </Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
