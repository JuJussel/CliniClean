<template>
    <div v-if="insurance.isPublic">
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("publicInsuranceProvider") }}
            </div>
            <tag severity="contrast">
                {{ insurance.provider }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("publicInsuranceRecepient") }}
            </div>
            <tag severity="contrast">
                {{ insurance.recepient }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("validUntil") }}
            </div>
            <tag severity="contrast">
                {{ insurance.validDate }}
            </tag>
        </div>
    </div>
    <div v-else class="grid grid-cols-4">
        <div class="flex p-1 gap-2 h-10">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceSymbol") }}
            </div>
            <tag severity="contrast">
                {{ insurance.symbol }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceNumber") }}
            </div>
            <tag severity="contrast">
                {{ insurance.number }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceInsuredName") }}
            </div>
            <tag severity="contrast">
                {{ insurance.insuredName + " - " + insurance.relation.name }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceProviderNumber") }}
            </div>
            <tag severity="contrast">
                {{ insurance.providerNumber }}
            </tag>
        </div>
        <div class="flex p-1 gap-2 h-10">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceProviderName") }}
            </div>
            <tag severity="contrast">
                {{ insurance.providerName }}
            </tag>
        </div>
        <div class="flex p-1 gap-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("insuranceGetDate") }}
            </div>
            <tag severity="contrast">
                {{ parseDate(insurance.getDate) }}
            </tag>
        </div>

        <div class="flex p-1 gap-2 col-span-2">
            <div class="w-20 leading-8 text-right text-xs text-[var(--p-button-text-secondary-color)]">
                {{ $t("validUntil") }}
            </div>
            <tag severity="contrast">
                {{ parseDate(insurance.validDate[0]) + " - " + parseDate(insurance.validDate[1]) }}
            </tag>
        </div>

    </div>

</template>

<script setup>
import parseDate from "@/composables/dateComposable.js";

const props = defineProps(['insurance'])

</script>