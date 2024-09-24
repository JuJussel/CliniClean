<template>
    <Fieldset :legend="$t('basic')">
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("name") }}
            </div>
            <tag v-if="patientDataBasic.name !== ''" severity="contrast">
                {{ patientDataBasic.name }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("nameKana") }}
            </div>
            <tag v-if="patientDataBasic.nameKana !== ''" severity="contrast">
                {{ patientDataBasic.nameKana }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("birthdate") }}
            </div>
            <tag v-if="patientDataBasic.birthdate !== ''" severity="contrast">
                {{ parseDate(patientDataBasic.birthdate) }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("gender") }}
            </div>
            <tag v-if="patientDataBasic.gender !== ''" severity="contrast">
                {{
                    patientDataBasic.gender == 1 ? t("male") : t("female")
                }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("occupation") }}
            </div>
            <tag v-if="patientDataBasic.occupation !== ''" severity="contrast">
                {{ patientDataBasic.occupation }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
    </Fieldset>
    <Fieldset :legend="$t('contactInfo')">
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("zipCode") }}
            </div>
            <tag v-if="patientDataBasic.address.zip !== ''" severity="contrast">
                {{ patientDataBasic.address.zip }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("address") }}
            </div>
            <tag v-if="patientDataBasic.address.addr !== ''" severity="contrast">
                {{ patientDataBasic.address.addr }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("telephone") }}
            </div>
            <tag v-if="patientDataBasic.phone !== ''" severity="contrast">
                {{ patientDataBasic.phone }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("mailAddress") }}
            </div>
            <tag v-if="patientDataBasic.mail !== ''" severity="contrast">
                {{ patientDataBasic.mail }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("householder") }}
            </div>
            <tag v-if="patientDataBasic.householderName !== ''" severity="contrast">
                {{ patientDataBasic.householderName + " - " + patientDataBasic.relation.name }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
    </Fieldset>
    <Fieldset :legend="$t('workOrSchool')">
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("workOrSchoolName") }}
            </div>
            <tag v-if="patientDataBasic.company.name !== ''" severity="contrast">
                {{ patientDataBasic.company.name }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("zipCode") }}
            </div>
            <tag v-if="patientDataBasic.company.zip !== ''" severity="contrast">
                {{ patientDataBasic.company.zip }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("address") }}
            </div>
            <tag v-if="patientDataBasic.company.addr !== ''" severity="contrast">
                {{ patientDataBasic.company.addr }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("telephone") }}
            </div>
            <tag v-if="patientDataBasic.company.phone !== ''" severity="contrast">
                {{ patientDataBasic.company.phone }}</tag>
            <tag v-else severity="secondary"> {{ $t("unknown") }} </tag>
        </div>
    </Fieldset>

</template>

<script setup>
const props = defineProps(["patientDataBasic"]);
const { t } = useI18n();
import parseDate from "@/composables/dateComposable.js";

const listDataBasic = [
    {
        title: t("name"),
        value: props.patientDataBasic.name,
    },
    {
        title: t("nameKana"),
        value: props.patientDataBasic.nameKana,
    },
    {
        title: t("birthdate"),
        value: parseDate(props.patientDataBasic.birthdate),
    },
    {
        title: t("gender"),
        value: props.patientDataBasic.gender == 1 ? t("male") : t("female"),
    },
    { title: t("address"), value: props.patientDataBasic.address.zip },
    { title: "", value: props.patientDataBasic.address.addr },
    { title: t("occupation"), value: props.patientDataBasic.occupation },
    { title: t("telephone"), value: props.patientDataBasic.phone },
    { title: t("mailAddress"), value: props.patientDataBasic.mail },
    {
        title: t("householder"),
        value:
            props.patientDataBasic.householderName +
            " - " +
            props.patientDataBasic.relation.name,
    },

    {
        title: t("workOrSchoolName"),
        value: props.patientDataBasic.company.name,
    },
    {
        title: t("zipCode"),
        value: props.patientDataBasic.company.zip,
    },
    {
        title: t("address"),
        value: props.patientDataBasic.company.addr,
    },
    {
        title: t("telephone"),
        value: props.patientDataBasic.company.phone,
    },
];
</script>
