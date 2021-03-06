<template>
    <div style="height: 100%; display: flex; flex-direction: column">
        <div style="width: 500px" class="content-card">
            <vs-table style="flex-grow: 1" ref="loadCont1">
                <template #notFound>
                    <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                    <div>
                        <b style="color: gray">データなし</b>
                    </div>
                </template>
                <template #header>
                    <div class="cc-table-header-content">
                        <h2>診察待ちの患者</h2>
                    </div>
                </template>
                <template #thead>
                    <vs-tr>
                        <vs-th>名前</vs-th>
                        <vs-th>診察内容</vs-th>
                        <vs-th></vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr v-for="(tr, i) in shinsatuList" :key="i">
                        <vs-td>{{ tr.name }}</vs-td>
                        <vs-td>{{ shinsatuTypes.find(e => e.id == tr.type).name }}</vs-td>
                        <vs-td>
                            <span style="display: flex">
                                <vs-button shadow @click="showKarte(tr)" v-if="tr.locked === 1">カルテへ</vs-button>
                                <vs-button shadow @click="startShinsatu(tr)" v-else-if="tr.status === 45">カルテへ</vs-button>
                                <vs-button shadow @click="showKarte(tr)" v-else-if="tr.orca_id">カルテへ</vs-button>
                                <vs-button shadow @click="startShinsatu(tr)" v-else>診察開始</vs-button>
                                <vs-button shadow @click="openPatient(tr)">患者詳細</vs-button>
                            </span>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div style="width: 500px" class="content-card">
            <vs-table style="flex-grow: 1" ref="loadCont2">
                <template #notFound>
                    <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                    <div>
                        <b style="color: gray">データなし</b>
                    </div>
                </template>
                <template #header>
                    <div class="cc-table-header-content">
                        <h2>診察待ちの患者</h2>
                    </div>
                </template>
                <template #thead>
                    <vs-tr>
                        <vs-th>名前</vs-th>
                        <vs-th>診察内容</vs-th>
                        <vs-th></vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr v-for="(tr, i) in shindanList" :key="i">
                        <vs-td>{{ tr.name }}</vs-td>
                        <vs-td>{{ shinsatuTypes.find(e => e.id == tr.type).name }}</vs-td>
                        <vs-td>
                            <span style="display: flex">
                                <vs-button shadow @click="showShindan(tr)">健康診断へ</vs-button>
                                <vs-button shadow @click="openPatient(tr)">患者詳細</vs-button>
                            </span>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>

        </div>

    </div>
    
</template>

<script>
export default {
    data() {
        return {
            shinsatuTypes: [],
            doctors: [],
            shinsatuList: [],
            shindanList: []
        }
    },
    mounted() {
        if(!this.$store.getters.shinsatuTypes) {
            this.$get('shinsatutypes')
            .then(result => {
                this.$store.commit('SET_LIST_SHINSATUTYPES', result.data)
                this.shinsatuTypes = this.$store.getters.shinsatuTypes
            })
            .catch(result => {
                this.$apiError(result)
            })
        } else {
            this.shinsatuTypes = this.$store.getters.shinsatuTypes
        }
        this.$get('doctors')
        .then(result => {
            this.doctors = result.data
        })
        .catch(result => {
            this.$apiError(result)
        })
        this.updateData()
    },
    methods: {
        updateData() {
            const isLoading1 = this.$vs.loading({
                target: this.$refs.loadCont1,
                color: 'dark'
            })
            const isLoading2 = this.$vs.loading({
                target: this.$refs.loadCont2,
                color: 'dark'
            })
            this.$get('encounters')
            .then(result => {
                this.shinsatuList = result.data.filter(item => item.status === 3 || item.status === 45)
                this.shindanList = result.data.filter(item => item.status === 4)
                isLoading1.close()
                isLoading2.close()
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        showKarte(r) {
            r.doctor == 0 ? r.doctor = this.$store.getters.userInfo.id : r.doctor = r.doctor
            this.$emit('showKarte', r)
        },
        startShinsatu(r) {
            if (r.doctor === 0) {
                console.log(this.$store.getters.userInfo.id);
                r.doctor = this.$store.getters.userInfo.id
            }

            this.$post('records', r)
            .then(result => {
                this.showKarte(r)
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        showShindan(r) {
            this.$emit('showShindan', r)
        },
        openPatient(r) {
            this.$emit('openPatient', r)
        }
    },
    sockets: {
        broadcast(data) {
            if (data.action === 'updateReception' || data.action === 'closeShindan') {
                this.updateData()
            }
        }
    }
}
</script>