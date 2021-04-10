<template>
    <div 
        style="height: calc(100% - 20px)" 
        v-bind:class="{landscape: landscape}"
        class="content-card customHeight"
        >
        <vs-table style="height: 100%">
            <template #thead>
                <vs-tr>
                    <vs-th
                        sort
                        @click="karteList = $vs.sortData($event ,karteFiltered, 'date')"
                        >
                        日付
                    </vs-th>
                    <vs-th
                        sort
                        @click="karteList = $vs.sortData($event ,karteFiltered, 'type')"
                        >
                        診察内容
                    </vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr
                    v-for="(tr, index) in karteFiltered" :key="index"
                    class="cc-click-row"
                    @click="showKarte(tr)"
                    >
                    <vs-td><dateDisplay :date="tr.date"></dateDisplay></vs-td>
                    <vs-td> {{ parseType(tr.type) }} </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>


export default {
    props: {
        data: {
            type: Object
        },
        standalone: {
            default: false,
            type: Boolean
        },
        landscape: {
            default: false,
            type: Boolean
        }
    },
    created() {

        this.$get('shinsatutypes')
        .then(result => {
            result.data.forEach(i => i.id = parseInt(i.id, 10))
            this.shinsatuTypes = result.data
        })
        .catch(result => {
            this.$apiError(result)
        })
        this.karteList = this.data.karte

    },
    data() {
        return {
            karteList: [],
            selectedType: [],
            selectedDate: [],
            shinsatuTypes: []
        }
    },
    methods: {
        parseType(type) {
            if (this.shinsatuTypes.length > 0) {
                return this.shinsatuTypes[type - 1].name                
            }
            return ''
        },
        showKarteSA(karte) {
            this.$emit('selectKarte', karte.id)
        },
        showKarte(karte) {
            if (this.standalone) {
                this.$emit('selectKarte', karte.id)
            } else {
                let emitData = {
                    id: karte.id,
                    date: karte.date,
                    patientName: this.data.basic.patientName,
                    patientID: this.data.basic.patientID
                }
                this.$eventHub.$emit('showKarteView', emitData)
            }
        }
    },
    computed: {
        karteFiltered() {
            let returnArr = this.karteList
            if (this.selectedType.length > 0) {
                returnArr = returnArr.filter(i => this.selectedType.includes(i.type))                
            }
            if (this.selectedDate.length > 0) {
                returnArr = returnArr.filter(
                    i => this.$moment(i.date).isBetween(this.selectedDate[0], this.selectedDate[1], 'day', '[]')
                )
            }
            return returnArr
        }
    }
}
</script>

<style scoped>
.landscape {
    max-width: 1000px;
}
</style>