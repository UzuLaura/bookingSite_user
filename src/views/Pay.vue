<template>
    <div class="pay">
        <div class="section container">
            <button class="button is-light has-text-info" v-on:click="$router.replace({name: 'Preview'})">&lt; Back</button>
            <form v-on:submit.prevent="completePayment">
                <h2 class="title has-background-warning padding">Total Price: {{ this.bookingInfo.totalPrice }}$</h2>
                <!--CARD TYPE AND NUMBER-->
                <div class="columns">
                    <div class="column is-2">
                        <div class="field">
                            <label class="label">Type Of Card</label>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select>
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
                                <input class="input" type="text" placeholder="">
                            </div>
                        </div>
                    </div>
                </div>
                <!--CARD EXPIRE DATE-->
                <div class="field">
                    <label class="label">Label</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Text input">
                    </div>
                </div>
                <!--CARDHOLDER-->
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
        methods: {
            updateAvailableDays () {
                firebase
                    .firestore
                    .collection('properties')
                    .doc(this.bookingInfo.propertyId)
                    .update({
                        unavailableDays: JSON.stringify(this.bookingInfo.bookedDays)
                    })
                    .then(() => {
                        console.log('hello')
                    })
            },
            completePayment () {
                console.log(this.bookingInfo)
                firebase
                    .firestore
                    .collection('bookings')
                    .add({
                        userId: this.bookingInfo.user,
                        userName: this.bookingInfo.userName,
                        totalPrice: this.bookingInfo.totalPrice,
                        totalDays: JSON.stringify(this.bookingInfo.totalDays),
                        propertyId: this.bookingInfo.propertyId,
                        bookedDays: this.bookingInfo.bookedDays
                    })
                    .then(
                        this.updateAvailableDays()
                    )
                    .catch(error => {
                        alert(error)
                    })
            }
        },
        beforeMount () {
            if (localStorage.getItem('user') === null) {
                this.$router.replace({name: 'Login'})
            } else {
                const info = JSON.parse(localStorage.getItem('bookingInfo'))
                this.bookingInfo.totalPrice = info.totalPrice
                this.bookingInfo.totalDays = info.totalDays
                this.bookingInfo.propertyId = info.property
                this.bookingInfo.bookedDays = info.bookedDays
            }
        }
    }
</script>

<style scoped>
    .padding {
        padding: 10px;
    }
</style>