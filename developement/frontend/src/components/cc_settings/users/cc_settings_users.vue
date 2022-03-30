<template>
    <div class="main">
        <cui-table
                :data="users"
                singleSelect
                ref="userTable"
                style="height: 100%"
            >
                <template #header>
                    <h2>Users</h2>
                </template>
                <template #thead>
                    <cui-th>Name</cui-th>
                    <cui-th>Username</cui-th>
                    <cui-th> Type </cui-th>
                    <cui-th> Group </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.nameFull }} </td>
                    <td> {{ row.username }} </td>
                    <td> 
                        {{ row.isDirectory ? "Directory" : "Local" }} 
                    </td>
                    <td> {{ groups[row.userGroup] }} </td>
                </template>
            </cui-table>

    </div>
</template>

<script>
export default {
    created() {
        this.getUsers()
    },
    data() {
        return {
            users: [],
            groups: {
                "1": "Reception",
                "2": "Nurse",
                "3": "Doctor",
                "99": "Admin"
            }
        }
    },
    methods: {
        async getUsers() {
            this.users = await this.$dataService().get.users.all();
        }
    }
}
</script>

<style scoped>
    .main {
        display: grid;
        grid-template-columns: 50% 50%;
    }
</style>