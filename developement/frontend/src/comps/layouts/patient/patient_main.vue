<template>
    <div>
        <SelectButton
            class="!flex flex-wrap bg-[var(--p-togglebutton-background)] mb-2"
            v-model="activeView"
            :options="availableViews"
            optionLabel="name"
            optionValue="name"
            aria-labelledby="basic"
        >
            <template #option="slotProps">
                <i :class="slotProps.option.icon" />
                {{ $t(slotProps.option.name) }}
            </template>
        </SelectButton>

    </div>
</template>

<script setup>
const patientStore = usePatientStore();

const activeView = ref('dashboard')
const views = [
    { name: "dashboard", icon: "fas fa-gauge-high", acl: 'none'},
    { name: "basic", icon: "fas fa-id-card-clip", acl: 'none'},
    { name: "risk", icon: "fas fa-pizza-slice", acl: 'none'},
    { name: "issues", icon: "fas fa-info", acl: 'none'},
    { name: "prevVac", icon: "fas fa-viruses", acl: 'none'},
    { name: "vitals", icon: "fas fa-chart-line", acl: 'none'},
    { name: "exam", icon: "fas fa-microscope", acl: 'none'},
    { name: "perscription", icon: "fas fa-pills", acl: 'none'},
    { name: "procedures", icon: "fas fa-list", acl: 'none'},
    { name: "diseases", icon: "fas fa-disease", acl: 'none'},
    { name: "encounter", icon: "fas fa-file-alt", acl: 'none'},
    { name: "files", icon: "fas fa-folder", acl: 'none'}
]

const availableViews = computed(() => {
    // needs ACLs enabled here - don't remember how this was implemented
    return views
})

</script>
