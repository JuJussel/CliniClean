<template>
    <div>
        <AutoComplete v-model="selectedCountry" optionLabel="name" :suggestions="filteredCountries" @complete="search">
            <template #option="slotProps">
                <div class="flex items-center">
                    <img :alt="slotProps.option.name"
                        src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                        :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" style="width: 18px" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </AutoComplete>
    </div>
    <div>
        Info
    </div>
</template>

<script setup>

</script>