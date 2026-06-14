---
trigger: always_on
---

Do not create you own ui components.
Bust the components provided by NuxtUi. Use the nuxt mcp servers if needed.
only add custom components when needed and not available in NuxtUi.
Make sure the style matches the style of NuxtUi.

Do not include hardcoded language strings. Make sure all displayed strings are fetched form the translation file using $t.
