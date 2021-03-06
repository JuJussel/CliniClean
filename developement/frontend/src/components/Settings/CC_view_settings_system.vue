<template>
    <div style="height: 100%">
        <div class="content-card">
            <div class="cc-card-header">
                <h2> システム  </h2>
            </div>
            <h3 style="margin-left: 20px">読み取り専用です。設定を変えるには「\backend\private\Config\config.ini」を編集してください。</h3>
            <div style="padding: 20px; display: flex; flex-direction: column; flex-wrap: wrap; height: calc(100% - 100px)">
                <div v-for="(item, key) in items" :key="key" style="width: 300px">
                    <h2>{{ key }}</h2>
                    <p v-for="(value, valueKey) in item" :key="valueKey">
                        <vs-input
                            readonly
                            :label="valueKey"
                            v-model="value.value"
                            v-if="value.type === 'string' && valueKey.includes('pass')"
                            type="password"
                        />
                        <vs-input
                            readonly
                            :label="valueKey"
                            v-model="value.value"
                            v-else-if="value.type === 'string'"
                        />
                        <vs-input
                            readonly
                            :label="valueKey"
                            v-model="value.value"
                            type="number"
                            v-else-if="value.type === 'integer'"
                        />
                        <vs-checkbox
                            readonly
                            v-model="value.value"
                            v-else-if="value.type === 'boolean'"
                            style="margin: 20px"
                        > {{ valueKey }}
                        </vs-checkbox>

                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            items: []
        }
    },
    created() {
        this.$get('settings/0', 'orca')
        .then(result => {
            this.items = result.data
        })
        .catch(result => {
            this.$apiError(result)
        })
    }

}
</script>
