<template>
    <div class="grid gap-2 grid-rows-2 grid-cols-2">
        <Card :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }" class="row-span-2">
            <template #content>
                <Schedule />
            </template>
        </Card>
        <Card>

            <template #content>
                <Patient />
            </template>
        </Card>
        <Card>

            <template #title>Simple Card</template>

            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                    repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                    quam perferendis esse, cupiditate neque
                    quas!
                </p>
            </template>
        </Card>

    </div>
</template>

<script setup>

import Schedule from './reception_schedule'
import Patient from './reception_patient.vue'

const { t } = useI18n({})
const uiStore = useUiStore()
const patientStore = usePatientStore()




</script>