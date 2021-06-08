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
                <cui-input required :label="$lang.name"></cui-input>
                <cui-datepicker required :label="$lang.birthdate"></cui-datepicker>
                <cui-input required :label="$lang.gender"></cui-input>
                <cui-select :label="$lang.occupation"></cui-select>
          
            </div>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">2</div>
                <h2> {{ $lang.contactInfo }} </h2>
            </template>

            <cui-input :label="$lang.zipCode"></cui-input>
            <cui-input :label="$lang.address"></cui-input>
            <cui-input :label="$lang.telephone"></cui-input>
            <cui-input :label="$lang.mailAddress"></cui-input>

        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">3</div>
                <h2> {{ $lang.workOrSchool }} </h2>
            </template>
            <cui-input :label="$lang.workOrSchoolName"></cui-input>
            <cui-input :label="$lang.zipCode"></cui-input>
            <cui-input :label="$lang.address"></cui-input>
            <cui-input :label="$lang.telephone"></cui-input>

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