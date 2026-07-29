<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import type { Snippet } from "svelte";
  import IconAlertTriangle from "@tabler/icons-svelte/icons/alert-triangle";

  interface Props {
    children: Snippet;
    fallback?: Snippet;
  }

  let { children, fallback }: Props = $props();

  let has_error = $state(false);
  let error_message = $state("");

  async function sendErrorToApi(error: string) {
    try {
      await fetch("/api/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "",
          error,
          path: window.location.pathname,
          options: "",
          browser: navigator.userAgent,
        }),
      });
    } catch {
      // Silently fail - we don't want to cause another error
    }
  }

  function handle_error(event: Event) {
    const error_event = event as ErrorEvent;
    has_error = true;
    error_message = error_event.error?.message || "An unexpected error occurred";
    event.preventDefault();
    sendErrorToApi(error_message);
  }

  function handle_retry() {
    has_error = false;
    error_message = "";
  }
</script>

<svelte:window onerror={handle_error} />

{#if has_error}
  {#if fallback}
    {@render fallback()}
  {:else}
    <div class="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <IconAlertTriangle class="size-12 text-destructive" />
      <h3 class="text-lg font-semibold">Something went wrong</h3>
      <p class="text-sm text-muted-foreground max-w-md">
        {error_message}
      </p>
      <Button onclick={handle_retry} variant="outline">Try Again</Button>
    </div>
  {/if}
{:else}
  {@render children()}
{/if}
