<template>
    <div class="register is-light">
        <section class="container section">
            <div class="notification is-success" v-bind:class="[notification.hidden, notification.color]">
                <button class="delete" v-on:click="close"></button>
                {{ notification.message }}
            </div>
            <form action="" v-on:submit.prevent="register">
                <div class="field is-horizontal">
                    <div class="field-body">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control is-expanded">
                                <input class="input" v-model="user.name" type="text" placeholder="Name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Surname</label>
                            <div class="control">
                                <input class="input" v-model="user.surname" type="text" placeholder="Surname">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" v-model="user.email" type="email" placeholder="Email">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" v-model="user.password" type="password" placeholder="Password">
                    </div>
                </div>
                <button type="submit" class="button primary-color is-pulled-right" v-bind:class="loading">Register</button>
            </form>
        </section>
    </div>
</template>

<script>
    import firebase from "firebase"

    export default {
        name: "Register",
        data () {
            return {
                notification: {
                    hidden: 'is-hidden',
                    color: '',
                    message: ''
                },
                loading: '',
                user: {
                    name: '',
                    surname: '',
                    email: '',
                    password: ''
                }
            }
        },
        methods: {
            register () {
                this.notification.hidden = 'is-hidden'
                this.loading = 'is-loading'
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.user.email, this.user.password)
                    .then(data => {
                        data.user
                            .updateProfile({
                                displayName: this.user.name + ' ' + this.user.surname
                            })
                    })
                    .then (() => {
                        this.loading = ''
                        this.notification.color = 'is-success'
                        this.notification.message = 'Registered successfully!'
                        this.notification.hidden = ''
                        this.$router.replace({ name: "Home" })
                    })
                    .catch(error => {
                        this.loading = ''
                        this.notification.color = 'is-danger'
                        this.notification.message = error
                        this.notification.hidden = ''
                    })
            },
            close () {
                this.notification.hidden = 'is-hidden'
            }
        },
        beforeMount () {
            if (localStorage.getItem('user') !== null) {
                this.$router.replace({name: 'Home'})
            }
        }
    }
</script>

<style scoped>
    .primary-color {
        background: #2e58a6;
        color: white;
    }
</style>