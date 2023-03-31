<template>
        <div>
        <cui-select
            :data="item.vaccines"
            v-model="varData.commonName"
            displayValueProp="commonName"
            :label="$lang.commonName"
            @update:modelValue="updateValue; varData.tradeName = ''"
            :disabled="item.order?.done || item.order?.locked"
        />
        <div style="display: flex; align-items: center">
            <cui-select
                :data="varData.commonName?.variants || []"
                v-model="varData.tradeName"
                displayValueProp="name"
                :label="$lang.tradeName"
                @update:modelValue="updateValue"
                :disabled="item.order?.done || item.order?.locked"
            />
            <cui-button icon="fas fa-circle-info" plain @click="openLink">
            </cui-button>
        </div>
    </div>
    <div style="display: flex">
        <cui-select
            :data="shotLocations"
            v-model="varData.location"
            style="width: 100px"
            :label="$lang.shotLocation"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
        <cui-input
            style="width: 100px; margin-left: 30px"
            v-model="varData.amount"
            :append="$lang.vial"
            :label="$lang.shotAmount"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
        <cui-input
            style="width: 100px; margin-left: 30px"
            v-model="varData.lot"
            :label="$lang.shotLot"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
    </div>
</template>

<script>

import { useListStore } from '@/stores/list';
import { mapStores } from 'pinia';

export default {
    props: {
        item: {
            default: null,
        },
    },
    created() {
        this.setData();
    },
    emits: ["update"],
    methods: {
        updateValue() {
            this.$emit("update", this.varData);
        },
        setData() {
            if (this.item.varData) {
                this.varData = this.item.varData;
            }
        },
        openLink() {
            window.open(this.varData.tradeName.url, '_blank');
        }
    },
    data() {
        return {
            varData: {
                location: null,
                amount: "",
                lot: "",
                commonName: "",
                tradeName: ""
            },
        };
    },
    computed: {
        ...mapStores(useListStore),
        shotLocations() {
            return this.listStore.listData.shotLocations || []
        }
    }
};
</script>