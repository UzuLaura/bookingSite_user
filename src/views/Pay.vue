<template>
    <div class="pay">
        <div class="section container">
            <div class="notification" v-bind:class="[notification.hidden, notification.color]">
                <button class="delete" v-on:click="notification.hidden = 'is-hidden'"></button>
                {{ notification.message }}
            </div>
            <button class="button is-light has-text-info" v-on:click="$router.replace({name: 'Preview'})">&lt; Back</button>
            <form v-on:submit.prevent="completePayment">
                <h2 class="title has-background-warning padding">Total Price: {{ this.bookingInfo.totalPrice }}$</h2>
                <div class="columns">
                    <div class="column is-2">
                        <div class="field">
                            <label class="label">Type Of Card</label>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select v-model="cardInfo.type">
                                        <option>MasterCard</option>
                                        <option>Maestro</option>
                                        <option>Visa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="field">
                            <label class="label">Credit Card Number</label>
                            <div class="control">
                                <input class="input" v-model="cardInfo.number" type="text" placeholder="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-8">
                        <label class="label">Expiration Date</label>
                        <div class="columns">
                            <div class="column is-6">
                                <div class="field">
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <select v-model="cardInfo.month">
                                                <option>Month</option>
                                                <option>01</option>
                                                <option>02</option>
                                                <option>03</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="column">
                                <div class="field">
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <select v-model="cardInfo.year">
                                                <option>Year</option>
                                                <option>2020</option>
                                                <option>2021</option>
                                                <option>2022</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="field">
                            <label class="label">CVC Code</label>
                            <div class="control">
                                <input class="input" v-model="cardInfo.cvc" type="text" placeholder="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Cardholder Name</label>
                    <div class="control">
                        <input class="input" v-model="bookingInfo.userName" type="text" placeholder="">
                    </div>
                </div>
                <p class="subtitle is-6">* By submitting you agree with TERMS and CONDITIONS</p>
                <button type="submit" class="button is-success is-fullwidth">Confirm Payment</button>
            </form>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase/app';
    import 'firebase/firestore';

    export default {
        name: "Pay",
        data () {
            return {
                redirect: false,
                unavailableDays: [],
                notification: {
                    hidden: 'is-hidden',
                    color: '',
                    message: ''
                },
                cardInfo: {
                    type: '',
                    number: '',
                    month: '',
                    year: '',
                    cvc: '',
                },
                bookingInfo: {
                    user: localStorage.getItem('user'),
                    userName: '',
                    totalPrice: 0,
                    totalDays: 0,
                    propertyId: '',
                    bookedDays: ''
                }
            }
        },
        watch: {
            redirect: function () {
                if (this.redirect === true) {
                    this.$router.replace({name: 'Home'})
                }
            }
        },
        methods: {
            validation () {
                if (!this.bookingInfo.userName ||
                    !this.cardInfo.type ||
                    !this.cardInfo.number ||
                    this.cardInfo.month === 'Month' ||
                    this.cardInfo.year === 'Year' ||
                    !this.cardInfo.cvc) {
                    this.notification.color = 'is-danger'
                    this.notification.message = 'All fields are required!'
                    this.notification.hidden = ''
                    return false
                }
                if (!Number.isInteger(Number(this.cardInfo.number)) ||
                    !Number.isInteger(Number(this.cardInfo.cvc))) {
                    this.notification.color = 'is-danger'
                    this.notification.message = 'Check if all fields are correct!'
                    this.notification.hidden = ''
                    return false
                }
                return true
            },
            completePayment () {
                this.validation()
                if (this.validation() === true) {
                    this.unavailableDays.push(this.bookingInfo.bookedDays)
                    firebase
                        .firestore()
                        .collection('bookings')
                        .add({
                            userId: this.bookingInfo.user,
                            userName: this.bookingInfo.userName,
                            totalPrice: this.bookingInfo.totalPrice,
                            totalDays: this.bookingInfo.totalDays,
                            propertyId: this.bookingInfo.propertyId,
                            bookedDays: this.bookingInfo.bookedDays
                        })
                        .then(() => {
                            firebase
                                .firestore()
                                .collection('properties')
                                .doc(this.bookingInfo.propertyId)
                                .update({
                                    unavailableDays: JSON.stringify(this.unavailableDays)
                                })
                        })
                        .then(() => {
                            this.notification.color = 'is-success'
                            this.notification.message = 'Payment Successful!'
                            this.notification.hidden = ''
                        })
                        .then(() => {
                            alert('Payment Successful!')
                            localStorage.removeItem('bookingInfo')
                            this.redirect = true
                            this.bookingInfo = {
                                totalPrice: 0
                            }
                        })
                        .catch(error => {
                            this.notification.color = 'is-danger'
                            this.notification.message = error
                            this.notification.hidden = ''
                        })
                }
            }
        },
        beforeMount () {
            if (!localStorage.getItem('bookingInfo') || JSON.parse(localStorage.getItem('bookingInfo')).totalPrice === 0) {
                this.$router.replace({name: 'Home'})
            }
            if (localStorage.getItem('user') === null) {
                this.$router.replace({name: 'Login'})
            } else {
                const info = JSON.parse(localStorage.getItem('bookingInfo'))
                this.bookingInfo.totalPrice = info.totalPrice
                this.bookingInfo.totalDays = info.totalDays
                this.bookingInfo.propertyId = info.property
                this.bookingInfo.bookedDays = info.bookedDays
                firebase
                    .firestore()
                    .collection('properties')
                    .doc(this.bookingInfo.propertyId)
                    .get()
                    .then(data => {
                        if (data.data().unavailableDays) {
                            this.unavailableDays = JSON.parse(data.data().unavailableDays)
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .padding {
        padding: 10px;
    }
</style>