<template>
    <div class="cc-patient-new-main">
        <cui-card class="cc-patient-new-header">
            <template #header>
                <h2> {{ $lang.patientNew }} </h2>
                <cui-button plain :label="$lang.cancel" />
                <cui-button primary :label="$lang.register" />
            </template>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">1</div>
                <h2> {{ $lang.basic }} </h2>
            </template>
            <div class="cc-patient-new-form">
                <cui-input v-model="patient.name" required :label="$lang.name"></cui-input>
                <cui-datepicker v-model="patient.birthdate" required :label="$lang.birthdate"></cui-datepicker>
                <div style="display: flex; align-items: flex-end">
                    <cui-radio :caption="$lang.gender" :label="$lang.male" :value="1"  v-model="patient.gender"/>
                    <cui-radio style="margin-left: 10px" :label="$lang.female" :value="2"  v-model="patient.gender"/>
                </div>
                <cui-select v-model="patient.occupation" :label="$lang.occupation" :data="$store.getters.occupations"></cui-select>
          
            </div>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">2</div>
                <h2> {{ $lang.contactInfo }} </h2>
            </template>

            <cui-input v-model="patient.address.zip" :label="$lang.zipCode" pattern="[0-9]*"></cui-input>
            <cui-input v-model="patient.address.addr" :label="$lang.address"></cui-input>
            <cui-input v-model="patient.phone" :label="$lang.telephone"></cui-input>
            <cui-input v-model="patient.mail" :label="$lang.mailAddress"></cui-input>

        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">3</div>
                <h2> {{ $lang.workOrSchool }} </h2>
            </template>
            <cui-input v-model="patient.company.name" :label="$lang.workOrSchoolName"></cui-input>
            <cui-input v-model="patient.company.zip" :label="$lang.zipCode"></cui-input>
            <cui-input v-model="patient.company.addr" :label="$lang.address"></cui-input>
            <cui-input v-model="patient.company.tel" :label="$lang.telephone"></cui-input>

        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">4</div>
                <h2> {{ $lang.insurance }} </h2>
                <cui-button :label="$lang.add" />
            </template>
        </cui-card>

    </div>
</template>

<script>


export default {
    created() {
        this.populateData()
    },
    data() {
        return {
            loading: false,
            patient: {
                id: 0,
                name: 'TestPatient2',
                nameKana: 'TestPatient2',
                birthdate: '1990-01-01',
                gender: 1,
                householderName: '本人',
                relation: 1,
                occupation: '学生',
                phone: '08000326702',
                mail: 'test@mail.com',
                address: {
                    zip: '1232232',
                    addr: '東京千代田区'
                },
                company: {
                    name: 'Cordeos',
                    zip: '1234323',
                    addr: '東京千代田区',
                    tel: '032345677'
                },
                insurance: []
            }
        }
    },
    methods: {
        populateData() {
            this.loading = true;
            this.$dataService().get.lists.occupations();
        }
    }
}
</script>

<style scoped>
    .cc-patient-new-main {
        height: 100%;
        display: grid;
        grid-template-rows: 85px 400px;
        grid-template-columns: 15% 15% 15% 55%;
        grid-template-areas: 'header header header header';
    }
    .cc-patient-new-header {
        grid-area: header;
    }
    .circle-number {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 20px;
        font-weight: bold;
        margin-right:5px;
        padding: 2px;
        background: var(--cui-font-color);
        color: white
    }
</style>