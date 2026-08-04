<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";
  import SunMoonIcon from "@lucide/svelte/icons/sun-moon";

  type Theme = "light" | "dark" | "system";

  function set_display(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.cookie = `theme=${theme}; path=/`;
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>
    <SunMoonIcon class="size-4 hidden [html[data-theme='system']_&]:block" />
    <SunIcon class="size-4 hidden [html[data-theme='light']_&]:block" />
    <MoonIcon class="size-4 hidden [html[data-theme='dark']_&]:block" />
    <span class="sr-only">Toggle theme</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => set_display("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => set_display("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => set_display("system")}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
