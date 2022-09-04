<template>
    <div class="main-cont">
        <cui-table
            :data="patientData"
            :loading="$store.getters.activePatient === 'loading'"
            outline
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $store.getters.activePatient.name }}</h2>
                    <slot name="buttons">
                        <cui-button
                            :disabled="
                                $store.getters.activePatient === 'loading'
                            "
                            :label="$lang.reception"
                            @click="
                                $store.commit('SET_LAYOUT_DATA', {
                                    receptionModalRegister: true
                                })
                            "
                        ></cui-button>
                        <cui-button
                            :disabled="
                                $store.getters.activePatient === 'loading'
                            "
                            :label="$lang.reservation"
                            @click="
                                $store.commit('SET_LAYOUT_DATA', {
                                    receptionModalReservation: true
                                })
                            "
                        ></cui-button>
                        <cui-button
                            :disabled="
                                $store.getters.activePatient === 'loading'
                            "
                            :label="$lang.edit"
                            @click="
                                $store.commit('SET_LAYOUT_DATA', {
                                    receptionModalPatientEdit: true
                                })
                            "
                        ></cui-button>

                        <cui-button :label="$lang.details"></cui-button>
                    </slot>
                </div>
            </template>
            <template v-slot:row="row">
                <td>{{ row.label }}</td>
                <td>{{ row.value }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="encounters"
            :loading="$store.getters.activePatient === 'loading'"
            outline
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $lang.outPatient }} {{ $lang.history }}</h2>
                    <cui-button
                        @click="showKarte"
                        :label="$lang.karte"
                    ></cui-button>
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ $parseDate(row.date) }}</td>
                <td>{{ parseEncounterType(row.type) }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="insuranceData"
            outline
            :loading="$store.getters.activePatient === 'loading'"
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $lang.insurance }}</h2>
                    <cui-button
                        :disabled="$store.getters.activePatient === 'loading'"
                        :label="$lang.register"
                        @click="
                            $store.commit('SET_LAYOUT_DATA', {
                                receptionModalInsuranceEdit: true
                            })
                        "
                    ></cui-button>
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.insuranceCombinationNumber }} </cui-th>
                <cui-th> {{ $lang.insurance }} </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 1 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 2 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 3 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 4 </cui-th>
                <cui-th> {{ $lang.validUntil }} </cui-th>
            </template>
            <template v-slot:row="row">
                <td>{{ row.Insurance_Combination_Number }}</td>
                <td>{{ row.InsuranceProvider_WholeName }}</td>
                <td>{{ buildPublicIns(0, row) }}</td>
                <td>{{ buildPublicIns(1, row) }}</td>
                <td>{{ buildPublicIns(2, row) }}</td>
                <td>{{ buildPublicIns(3, row) }}</td>
                <td>{{ $parseDate(row.Certificate_ExpiredDate) }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="encounterReservations"
            :loading="$store.getters.activePatient === 'loading'"
            outline
        >
            <template #header>
                <h2>{{ $lang.reservation }}</h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ $parseDate(row.date) }}</td>
                <td>{{ parseEncounterType(row.type) }}</td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        outline: {
            default: false,
            type: Boolean
        },
        square: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            encounters: [],
            encounterReservations: []
        };
    },
    methods: {
        async showKarte() {
            const patientData = await this.$dataService().get.patient.details(
                this.$store.getters.activePatient.id
            );
            this.$store.commit("SET_ACTIVE_ENCOUNTER", {
                patient: patientData.patientData
            });
            this.$store.commit("SET_ACTIVE_TAB", "medical");
        },
        parseEncounterType(type) {
            return this.$store.getters.encounterTypes.find(
                item => item.id === type
            ).name;
        },
        buildPublicIns(index, row) {
            if (index > 0) {
                if (
                    row.PublicInsurance_Information
                        ?.PublicInsurance_Information_child?.[index]
                ) {
                    return row.PublicInsurance_Information
                        .PublicInsurance_Information_child[index]
                        .PublicInsurance_Name;
                }
            } else {
                if (
                    row.PublicInsurance_Information
                        ?.PublicInsurance_Information_child
                        ?.PublicInsurance_Name
                ) {
                    return row.PublicInsurance_Information
                        .PublicInsurance_Information_child.PublicInsurance_Name;
                }
            }
            return "";
        }
    },
    computed: {
        patientData() {
            let patientData = this.$store.getters.activePatient;
            if (patientData === "loading" || !patientData) return [];
            let tableData = [
                { label: this.$lang.patientId, value: patientData?.id },
                {
                    label: this.$lang.birthdate,
                    value: this.$dayjs(patientData?.birthdate).format(
                        "YYYY年MM月DD日"
                    )
                },
                {
                    label: this.$lang.gender,
                    value:
                        patientData?.gender == 1
                            ? this.$lang.male
                            : this.$lang.female
                },
                {
                    label: this.$lang.address,
                    value:
                        patientData?.address?.zip +
                        " " +
                        patientData?.address?.addr
                },
                {
                    label: this.$lang.occupation,
                    value: patientData?.occupation
                },
                {
                    label: this.$lang.workOrSchoolName,
                    value: patientData?.company?.name
                },
                { label: this.$lang.telephone, value: patientData?.phone },
                {
                    label: this.$lang.mailAddress,
                    value: patientData?.mail
                }
            ];
            return tableData;
        },
        insuranceData() {
            let insData = this.$store.getters.activePatient || null;
            if (insData === "loading" || !insData) return [];
            return insData.insurance[0][0]
                ? insData?.insurance[0]
                : insData?.insurance;
        }
    },
    watch: {
        async patientData() {
            let patientData = this.$store.getters.activePatient;
            if (patientData === "loading" || !patientData) return [];
            let today = new Date().toISOString();
            let encounters = await this.$dataService().get.patient.encounters(
                patientData.id
            );
            this.encounters = encounters.filter(item => item.date < today);
            this.encounterReservations = encounters.filter(
                item => item.date > today
            );
        }
    }
};
</script>

<style scoped>
.main-cont {
    display: grid;
    grid-template-rows: 60% auto;
    grid-template-columns: calc(50% - 20px) auto;
    grid-gap: 20px;
}
</style>