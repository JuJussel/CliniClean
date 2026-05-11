<script setup>
// Dummy data for the collapsible items
const dummyEncounters = [
    {
        label: "May 11, 2026 - Routine Checkup",
        icon: "i-heroicons-calendar",
        content:
            "Patient reported slight dizziness. BP: 120/80. Prescribed hydration and rest.",
    },
    {
        label: "April 20, 2026 - Vaccination",
        icon: "i-heroicons-beaker",
        content:
            "Administered seasonal influenza vaccine. No immediate adverse reactions.",
    },
    {
        label: "March 05, 2026 - Lab Results",
        icon: "i-heroicons-document-text",
        content:
            "Blood work indicates normal levels across all primary markers.",
    },
];

const enconterData = reactive({
    soap: {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to the Editor 👋' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'rich text' },
        { type: 'text', text: ' editor with support for ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'strike' }], text: 'strikethrough' },
        { type: 'text', text: ', and ' },
        { type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
        { type: 'text', text: '.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Features' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Headings (H1–H6)' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet and ordered lists' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Blockquotes and code blocks' }] }]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Steps' }]
    },
    {
      type: 'orderedList',
      attrs: { start: 1 },
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Install Nuxt UI' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Add the Editor component' }] }]
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Start writing!' }] }]
        }
      ]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Great things are built one block at a time.' }]
        }
      ]
    },
    {
      type: 'codeBlock',
      attrs: { language: 'ts' },
      content: [{ type: 'text', text: "const greeting = 'Hello, Nuxt UI!'\nconsole.log(greeting)" }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Learn more at ' },
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://ui.nuxt.com', target: '_blank' } }],
          text: 'ui.nuxt.com'
        },
        { type: 'text', text: '.' }
      ]
    }
  ]
},
    procedures: [],
    images: [],
});

</script>


<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <UCard :ui="{ body: 'p-0 sm:p-0' }">
                    <template #header>
                        <h3 class="text-base font-semibold">Clinical Notes</h3>
                    </template>

                    <PatientEncounterSoap :content="enconterData.soap"/>  
                </UCard>
            </div>

            <div class="space-y-4">
                <UCard>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <UButton
                            icon="i-heroicons-plus"
                            size="sm"
                            color="primary"
                            >Add Entry</UButton
                        >
                        <UButton
                            icon="i-heroicons-printer"
                            size="sm"
                            color="gray"
                            >Print</UButton
                        >
                        <UButton
                            icon="i-heroicons-archive-box"
                            size="sm"
                            color="gray"
                            >Archive</UButton
                        >
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h3 class="text-base font-semibold">Past Encounters</h3>
                    </template>

                    <UAccordion :items="dummyEncounters">
                        <template #item="{ item }">
                            <div
                                class="p-4 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-b-lg"
                            >
                                {{ item.content }}
                                <div class="mt-2">
                                    <UButton
                                        size="2xs"
                                        variant="ghost"
                                        color="primary"
                                        >View Details</UButton
                                    >
                                </div>
                            </div>
                        </template>
                    </UAccordion>
                </UCard>
            </div>
        </div>
    </div>
</template>

