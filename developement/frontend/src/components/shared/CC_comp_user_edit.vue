<template>
    <div>
        
    </div>
</template>

<script>
export default {
    props: {
        user: {default: null}
    },
    created() {
        if(this.user) {
            Object.assign(this.editUser, this.user)
        }
    },
    data() {
        return {
            editUser: {
                has_orca: 0,
                name_first: '',
                name_last: '',
                role: null,
                user_name: '',
                active: 1
            }
        }
    }
}
</script>