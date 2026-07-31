<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";
  import SunMoonIcon from "@lucide/svelte/icons/sun-moon";

  /** identifies how the theme mode was set */
  type ThemeMode = "user" | "system";

  /** the current theme being displayed*/
  type Theme = "light" | "dark";

  function get_user_color_scheme(): Theme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function get_data_theme_attr(): Theme | undefined {
    const theme = document.documentElement.getAttribute("data-theme");
    switch (theme) {
      case "light":
      case "dark":
        return theme;
      default:
        return undefined;
    }
  }

  function get_data_theme_mode_attr(): ThemeMode {
    const mode = document.documentElement.getAttribute("data-theme-mode");
    switch (mode) {
      case "user":
      case "system":
        return mode;
      default:
        return "system";
    }
  }

  function set_data_theme(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function set_data_theme_mode(mode: ThemeMode) {
    document.documentElement.setAttribute("data-theme-mode", mode);
  }

  function set_display(display: "light" | "dark" | "system") {
    current_theme = display === "system" ? get_user_color_scheme() : display;
    set_data_theme(current_theme);
    mode = display === "system" ? "system" : "user";
    set_data_theme_mode(mode);
    document.cookie = `theme=${current_theme}; path=/`;
    document.cookie = `theme-mode=${mode}; path=/`;
  }

  const init_data_theme_mode = get_data_theme_mode_attr();
  let mode: ThemeMode = $state(init_data_theme_mode);
  let current_theme: Theme = $state(
    init_data_theme_mode === "system"
      ? get_user_color_scheme()
      : (get_data_theme_attr() ?? get_user_color_scheme()),
  );
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>
    {#if mode === "user"}
      <SunIcon class="scale-100 rotate-0 size-4 transition-all! dark:scale-0 dark:-rotate-90" />
      <MoonIcon
        class="absolute size-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
      />
    {:else}
      <SunMoonIcon class="size-4" />
    {/if}
    <span class="sr-only">Toggle theme</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => set_display("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => set_display("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => set_display("system")}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
