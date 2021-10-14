<template>
    <div>
        <h2 style="display: flex; justify-content: space-between">
            <div>
                <i :class="procedureIcon" />
                <span style="margin-left: 10px"> {{ order.procedure.name }} </span>
            </div>
            <cui-button :label="$lang.finish" primary />
        </h2>
        <div>Requester: Name</div>
        <h4 style="margin: 10px">Comment</h4>
        <cui-tag style="max-width: 250px; height: auto">Hellolkcre vieropvrnvvnr oforjfrn rejrenre revjren relrjenferljfnr fournfroufrnfweorjfrjnf oerjf oer foejfn erofn erpojf nerpof</cui-tag>
        <h4 style="margin: 10px">Comment add</h4>
        <cui-textarea style="width: 250px" rows="3" cols="30"/>
    </div>
</template>

<script>
export default {
    props: {
        order: {
            default: null
        }
    },
    computed: {
        procedureIcon() {
            let code = this.order?.procedure.cat.code || null;
            return this.$store.getters.config.procedureCategories.find(item => item.code === code)?.icon || null;
        }
    }
}
</script>