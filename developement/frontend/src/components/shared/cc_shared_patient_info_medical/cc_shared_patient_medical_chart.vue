<template>
    <div>
        <chart :chartData="localData.charts[0].data" />
    </div>
</template>

<script>

import chart from '../cc_shared_chart/cc_shared_chart_main.vue'

export default {
    components: {
        chart,
    },
    data() {
        return {
            localData: {
                patientData: {
                    encounters: null,
                    vitals: null,
                    diseases: null,
                    exams: null,
                    medications: null,
                    operations: null,
                    shots: null,
                    prevVacs: null,
                    treatments: null
                },
                charts: [
                    {
                        name: 'timeline', 
                        type: 'gantt', 
                        selected: {
                            encounters: true,
                            vitals: true,
                            diseases: true,
                            exams: true,
                            medications: true,
                            operations: true,
                            shots: true,
                            prevVacs: true,
                            treatments: true
                        }, 
                        data: {
                            id: 'events',
                            type: 'custom',
                            dimensions: [
                                'type',
                                'startDate',
                                'endDate',
                                'id'
                            ],
                            encode: {
                                x: [1,2],
                                y: 0,
                                tooltip: [0,1,3]
                            },
                            data: []
                        }},
                    {name: 'vitals', type: 'line'}
                ]
            },
            workingViewData: null,
        }
    },
    created() {
        this.workingViewData = JSON.parse(JSON.stringify(this.$store.getters.viewData));
        this.transformPatientData();
    },
    methods: {
        commitworkingViewData() {
            this.$store.commit('SET_VIEW_DATA', this.workingViewData)
        },
		transformPatientData() {
			let patientData = JSON.parse(JSON.stringify(this.$store.getters.activePatientHistory));
			// Encounters
			patientData.encounters.forEach(enc => {
                if (this.localData.charts[0].selected.encounters) {
                    let arr = [
                        enc.type,
                        enc.date,
                        enc.lastChange,
                        enc.id
                    ];
                    this.localData.charts[0].data.data.push(arr);
                }
			})
		}
    },
    computed: {
	}

}
</script>