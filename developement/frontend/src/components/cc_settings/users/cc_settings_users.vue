<template>
    <div class="main">
        <cui-card no-padding>
            <cui-table
                    :data="users"
                    singleSelect
                    ref="userTable"
                    style="height: 100%"
                    @select="selectUser"
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
                        <td> {{ findGroup(row.userGroup) }} </td>
                    </template>
                </cui-table>
        </cui-card>
        <cui-card v-if="selectedUser">
            <template #header>
                <h2>
                    {{ selectedUser.nameFull }}
                </h2>
                <cui-button label="Delete" danger></cui-button>
                <cui-button v-if="!selectedUser.isDirectory" label="Save" primary @click="validate()"></cui-button>
                <cui-button v-if="selectedUser.hasOrca" label="Remove Orca Access" primary @click="editOrca()"></cui-button>
                <cui-button v-else label="Add Orca Access" primary @click="editOrca()"></cui-button>
            </template>
            <div v-if="!selectedUser.isDirectory">
                <div v-for="(error, index) in errorMessages" :key="index" class="errorText">
                    {{ error }}
                </div>
                <cui-input label="Username" v-model="selectedUser.username"></cui-input>
                <cui-input label="Lastname" v-model="selectedUser.nameLast"></cui-input>
                <cui-input label="Firstname" v-model="selectedUser.nameFirst"></cui-input>
                <cui-checkbox label="Active" v-model="selectedUser.active"></cui-checkbox>
                <cui-select
                    label="Group"
                    v-model="selectedUser.userGroup"
                    :data="groups"
                    displayValueProp="name"
                    returnValueProp="id"
                />
                <cui-checkbox disabled label="Orca Access" v-model="selectedUser.hasOrca"></cui-checkbox>
            </div>
            <div v-else>
                This user is synced from backend.
            </div>
            <cui-checkbox label="Reset Password" v-model="resetPassword"></cui-checkbox>
            <cui-input label="Password" v-model="password.pass" v-if="resetPassword"></cui-input>
            <cui-input label="Password Confirm" v-model="password.conf" v-if="resetPassword"></cui-input>

        </cui-card>
    </div>
</template>

<script>
export default {
    emits: [
        'loading',
        'done'
    ],
    created() {
        this.getUsers()
    },
    data() {
        return {
            users: [],
            groups: this.$store.getters.userGroups,
            selectedUser: null,
            resetPassword: false,
            password: {
                pass: "",
                conf: ""
            },
            adminPassword: null,
            errorMessages: []
        }
    },
    methods: {
        async getUsers() {
            this.users = await this.$dataService().get.users.all();
        },
        selectUser(user) {
            this.selectedUser = JSON.parse(JSON.stringify(user.row));
        },
        findGroup(id) {
            return this.groups.find(i => i.id == id).name || null;
        },
        validate() {
            this.errorMessages = [];
            if(this.selectedUser.username === "") this.errorMessages.push('Username cannot be empty');
            if(this.selectedUser.nameLast === "") this.errorMessages.push('Lastname cannot be empty');
            if(this.resetPassword && this.password.pass === "") this.errorMessages.push('Password cannot be empty');
            if(this.resetPassword && this.password.conf === "") this.errorMessages.push('Password Confirm cannot be empty');
            if(this.resetPassword && this.password.conf !== this.password.pass) this.errorMessages.push('Passwords do not match');
            if (this.errorMessages.length < 1) {
                this.submit();
            }
        },
        async submit() {
            this.$emit('loading');
            if(this.resetPassword) this.selectedUser.password = this.password.pass;
            try {
                await this.$dataService().put.user.updateUser(this.selectedUser);
            } catch (error) {
                console.log(error);
            } finally {
                this.$emit('done');
            }
            
        }
    }
}
</script>

<style scoped>
    .main {
        display: grid;
        grid-template-columns: 50% 50%;
        height: 100%;
    }
    .errorText {
        color: var(--cui-danger)
    }
</style>