<template>
    <div class="grid grid-cols-2 grid-rows-2 gap-3 max-h-[36vh]">
        <Fieldset :legend="$t('basic')" class="row-span-2">
            <ul>
                <li class="flex p-1" v-for="(item, index) in listDataBasic" :key="index">
                    <div class="w-28 leading-8">{{ item.title }}</div>
                    <tag severity="secondary">{{ item.value }}</tag>
                </li>
            </ul>
        </Fieldset>
        <Fieldset :legend="$t('outPatient') + $t('history')">
            <DataTable :value="pastEncounters" tableStyle="min-width: 20rem" scrollable scrollHeight="flex"
                class="max-h-[13vh]">
                <Column field="date" :header="$t('date')">
                    <template #body="slotProps">
                        <span> {{ parseDate(slotProps.data.date) }} </span>
                    </template>
                </Column>
                <Column field="type" :header="$t('encounterType')">
                    <template #body="slotProps">
                        <span>
                            {{
                                listStore.listData.encounterTypes.find(
                                    (item) => item.id === slotProps.data.type
                                ).name
                            }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </Fieldset>
        <Fieldset :legend="$t('reservation')">
            <DataTable :value="reservations" v-if="reservations.length > 0" tableStyle="min-width: 20rem" scrollable
                scrollHeight="flex" class="max-h-[13vh]">
                <Column field="date" :header="$t('date')">
                    <template #body="slotProps">
                        <span> {{ parseDate(slotProps.data.date) }} </span>
                    </template>
                </Column>
                <Column field="type" :header="$t('encounterType')">
                    <template #body="slotProps">
                        <span>
                            {{
                                listStore.listData.encounterTypes.find(
                                    (item) => item.id === slotProps.data.type
                                ).name
                            }}
                        </span>
                    </template>
                </Column>
            </DataTable>
            <div v-else>
                {{ $t("reservation") }}
                {{ $t("hasNot") }}
            </div>
        </Fieldset>
    </div>
</template>

<script setup>
import parseDate from "@/composables/dateComposable.js";

const listStore = useListStore();
const { t } = useI18n();

const props = defineProps(["patientData", "encounterHistory"]);
const listDataBasic = [
    { title: t("birthdate"), value: parseDate(props.patientData.birthdate) },
    {
        title: t("gender"),
        value: props.patientData.gender == 1 ? t("male") : t("female"),
    },
    { title: t("address"), value: props.patientData.address.zip },
    { title: "", value: props.patientData.address.addr },
    { title: t("occupation"), value: props.patientData.occupation },
    { title: t("workOrSchoolName"), value: props.patientData.company.name },
    { title: t("telephone"), value: props.patientData.phone },
    { title: t("mailAddress"), value: props.patientData.mail },
];

const pastEncounters = computed(() => {
    const today = new Date().toISOString();
    return props.encounterHistory.filter((item) => item.date < today);
});

const reservations = computed(() => {
    const today = new Date().toISOString();
    return props.encounterHistory.filter((item) => item.date > today);
});
</script>
