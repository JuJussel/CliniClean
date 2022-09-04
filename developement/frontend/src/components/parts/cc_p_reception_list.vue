<template>
    <div>
        <cui-table
            :data="visibleEncounters"
            :loading="layoutData.loading"
            square
        >
            <template #emptyImage>
                <img src="../../assets/img/empty2.jpg" style="width: 300px" />
            </template>
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $lang.receptionList }}</h2>
                </div>
                <div style="display: flex; align-items: center">
                    <cui-checkbox
                        v-model="layoutData.view.reservation"
                        :label="$lang.reservation"
                    />
                    <cui-checkbox
                        v-model="layoutData.view.active"
                        style="margin-left: 20px"
                        :label="$lang.activeReception"
                    />
                    <cui-checkbox
                        v-model="layoutData.view.done"
                        style="margin-left: 20px; margin-right: 40px"
                        :label="$lang.paymentDone"
                    />
                    <cui-tooltip>
                        <a>{{ $lang.doctor }} {{ doctorsFree }} </a>
                        <template #tooltip>
                            <cui-table
                                :data="layoutData.doctors"
                                style="margin: -10px"
                            >
                                <template #thead>
                                    <cui-th> {{ $lang.name }} </cui-th>
                                    <cui-th> {{ $lang.status }} </cui-th>
                                </template>
                                <template v-slot:row="{ row }">
                                    <td>{{ row.nameFull }}</td>
                                    <td>
                                        <cui-tag
                                            :danger="row.status === 2"
                                            :primary="row.status === 1"
                                        >
                                            {{
                                                layoutData.docStati[row.status]
                                            }}
                                        </cui-tag>
                                    </td>
                                </template>
                            </cui-table>
                        </template>
                    </cui-tooltip>
                </div>
            </template>
            <template #thead>
                <cui-th sort="name">{{ $lang.name }}</cui-th>
                <cui-th sort="examType">{{ $lang.encounterType }}</cui-th>
                <cui-th sort="status">{{ $lang.status }}</cui-th>
                <cui-th sort="waitTime">{{ $lang.waitTime }}</cui-th>
                <cui-th sort="recTime">{{ $lang.receptionTime }}</cui-th>
                <cui-th></cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>
                    <i
                        class="fas fa-exclamation-circle"
                        style="color: var(--cui-danger"
                    ></i>
                    <span>{{ row.patient?.name }}</span>
                </td>
                <td>{{ parseExamType(row.type) }}</td>
                <td>
                    <cui-button
                        v-if="$aclService(2) && row.status === 10"
                        :label="examStatiOptions(row)[0].name"
                        primary
                        @click="
                            layoutData.modal.payment = row;
                            layoutData.view.modal.payment = true;
                        "
                    />
                    <cui-tag v-else-if="row.status === 0">
                        {{ $lang.paymentDone }}
                    </cui-tag>
                    <cui-select
                        v-else
                        :data="examStatiOptions(row)"
                        displayValueProp="name"
                        returnValueProp="status"
                        v-model="row.status"
                        :disabled="
                            examStatiOptions(row)[0].disabled || !$aclService(2)
                        "
                        :color="examStatiOptions(row)[0].color"
                        noNote
                        @select="changeStatus(row)"
                    />
                </td>
                <td>
                    <span v-if="row.status !== 1">{{
                        parseWaitTime(row.lastChange).time
                    }}</span>
                </td>
                <td>{{ $dayjs(row.date).format("HH時mm分") }}</td>
                <td>
                    <cui-button
                        v-if="$aclService(2) && row.status === 3"
                        icon="fas fa-clipboard-user"
                        @click="showKarte(row.patient._id)"
                        :loading="$store.getters.activePatient === 'loading'"
                    />
                </td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    created() {
        this.getEncounters();
        this.getEncounterTypes();
        this.getDoctors();
        this.$options.sockets.onmessage = data => {
            data = JSON.parse(data.data);
            if (data.event === "updateEncounter") this.getEncounters();
            if (data.event === "updatePatient") this.getEncounters();
        };
    },
    data() {
        return {
            layoutData: {
                encounters: [],
                loading: false,
                view: {
                    reservation: true,
                    active: true,
                    done: false
                },
                selectedEncounter: null,
                docStati: [null, this.$lang.free, this.$lang.inEncounter],
                doctors: []
            }
        };
    },
    methods: {
        async showKarte(patientId) {
            const patientData = await this.$dataService().get.patient.details(
                patientId
            );
            this.$store.commit("SET_ACTIVE_ENCOUNTER", {patient: patientData.patientData, active: true});
            this.$store.commit("SET_ACTIVE_TAB", "medical");
        },
        async getDoctors() {
            this.layoutData.doctors = await this.$dataService().get.doctors.all();
        },
        async getEncounterTypes() {
            return await this.$dataService().get.lists.encounterTypes();
        },
        async getEncounters() {
            this.layoutData.loading = true;
            this.layoutData.encounters = await this.$dataService().get.encounters.today();
            this.layoutData.loading = false;
        },
        parseExamType(type) {
            const types = this.$store.getters.encounterTypes;
            let string = "";
            string = types?.find(item => item.id == type).name;
            return string;
        },
        examStatiOptions(row) {
            const currentStatus = row.status;
            const encounterStati = this.$store.getters.staticLists
                .encounterStati;
            let status = encounterStati.find(
                item => item[0].status === currentStatus
            );
            return status;
        },
        parseWaitTime(change) {
            let time = this.$dayjs(change).fromNow(true);
            let diff = this.$dayjs().diff(this.$dayjs(change), "minutes");
            return {
                time: time,
                diff: diff
            };
        },
        async changeStatus(row) {
            if (row.status === 3 && row.type === 6) row.status = 4;
            if (row.status === 2) {
                this.layoutData.view.modal.reservationAccept = row;
            } else {
                this.layoutData.loading = true;
                await this.$dataService().put.encounters(row);
                this.getEncounters();
            }
        }
    },
    computed: {
        doctorsFree() {
            let free = this.layoutData.doctors.filter(doc => doc.status === 1)
                .length;
            return free + "/" + this.layoutData.doctors.length;
        },
        visibleEncounters() {
            let enc = [];
            if (this.layoutData.view.reservation) {
                let add = this.layoutData.encounters.filter(
                    e => e.status === 1
                );
                enc.push(...add);
            }
            if (this.layoutData.view.active) {
                let add = this.layoutData.encounters.filter(e => {
                    if (e.status > 1 && e.status < 11) {
                        return true;
                    }
                    if (e.status > 34) {
                        return true;
                    }
                    return false;
                });
                enc.push(...add);
            }
            if (this.layoutData.view.done) {
                let add = this.layoutData.encounters.filter(
                    e => e.status === 0
                );
                enc.push(...add);
            }
            return enc;
        }
    }
};
</script>