<template>
    <div class="preview">
        <Spinner v-bind:class="loading"/>
        <section class="section container">
            <button class="button is-light has-text-info" v-on:click="$router.go(-1)">&lt; Back</button>
            <h2 class="title is-2 has-text-centered has-background-dark has-text-light padding">{{ property.name }}</h2>
            <hr>
            <div class="columns">
                <div class="column is-6">
                    <img :src="property.image" :alt="property.name">
                </div>
                <div class="column is-6">
                    <span class="tag is-large is-success">Price: {{ property.price }}$</span>
                    <div class="buttons is-pulled-right">
                        <span class="tag is-light is-large">Location: {{ property.city }}</span>
                    </div>
                    <hr>
                    <p>{{ property.description }}</p>
                </div>
            </div>
            <h3 class="subtitle is-3 has-text-centered has-background-dark has-text-light padding">Pick date for your visit</h3>
            <div class="columns">
                <div class="column is-6">
                    <date-picker
                            mode="range"
                            :disabled-dates='property.unavailableDays'
                            v-model='date'
                            color="green"
                            :firstDayOfWeek="2"
                            is-inline
                            is-expanded
                    />
                </div>
                <div class="column">
                    <h4 class="subtitle is-5">Your Booking Information</h4>
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr>
                                <th>From:</th>
                                <td>{{ this.startDate }}</td>
                            </tr>
                            <tr>
                                <th>Till:</th>
                                <td>{{ this.endDate }}</td>
                            </tr>
                            <tr>
                                <th>Total Days:</th>
                                <td>{{ this.totalDays }}</td>
                            </tr>
                            <tr class="has-background-grey-lighter">
                                <th>Total Price:</th>
                                <td>{{ this.totalPrice }}$</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="button is-fullwidth is-success" v-on:click="proceedPayment">Pay</button>
                </div>
            </div>
            <div class="carousel-img level" v-bind:style="{ background: 'url(' + property.extraImages[imageIndex] + ')' }">
                <span class="button carousel-btn is-light is-outlined level-left" v-on:click="carouselBack">&lt;</span>
                <span class="button carousel-btn is-light is-outlined level-left" v-on:click="carouselForward">&gt;</span>
            </div>
        </section>
    </div>
</template>

<script>
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import Spinner from '../components/Spinner'

    export default {
        name: "Preview",
        components: {Spinner},
        data () {
            return {
                loading: '',
                date: {
                    start: '',
                    end: ''
                },
                convertedDate: {
                    start: '',
                    end: ''
                },
                totalDays: 0,
                totalPrice: 0,
                notification: {
                    hidden: 'is-hidden',
                    color: '',
                    fixed: ''
                },
                property: {
                    ownerID: '',
                    id: '',
                    name: '',
                    description: '',
                    image: '',
                    extraImages: [],
                    price: '',
                    city: '',
                    unavailableDays: [{start: null,  end: new Date()}]
                },
                bookingInfo: [],
                imageIndex: 0,
            }
        },
        computed: {
            startDate: function () {
                const startDate = new Date(this.date.start).toLocaleDateString('lt')
                return startDate
            },
            endDate: function () {
                const endDate = new Date(this.date.end).toLocaleDateString('lt')
                return endDate
            }
        },
        methods: {
            calculatePrice () {
                const oneDay = 24 * 60 * 60 * 1000;
                const firstDate = new Date(this.date.start);
                const secondDate = new Date(this.date.end);
                this.totalDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                if (this.totalDays === 0) {
                    if (this.date.start) {
                        this.totalDays = 1
                    }
                    this.totalPrice = this.property.price
                } else {
                    this.totalPrice = this.property.price * this.totalDays
                }
            },
            convertBookingInfoDays () {
                this.convertedDate.start = new Date(this.date.start)
                this.convertedDate.start.setHours(this.convertedDate.start.getHours() + 3)
                this.convertedDate.end = new Date(this.date.end)
                this.convertedDate.end.setHours(this.convertedDate.end.getHours() + 3)
            },
            proceedPayment () {
                this.bookingInfo = {
                    totalPrice: this.totalPrice,
                    totalDays: this.totalDays,
                    property: this.property.id,
                    bookedDays: this.convertedDate
                }
                if (this.date.start) {
                    localStorage.setItem('bookingInfo', JSON.stringify(this.bookingInfo))
                    this.$router.replace({ name: "Pay" })
                } else {
                    alert('Pick date for you visit to proceed to payment!')
                }
            },
            carouselForward () {
                if (this.imageIndex < this.property.extraImages.length - 1) {
                    this.imageIndex++
                } else {
                    this.imageIndex = 0
                }
            },
            carouselBack () {
                if (this.imageIndex > 0) {
                    this.imageIndex--
                } else {
                    this.imageIndex = this.property.extraImages.length - 1
                }
            }
        },
        watch: {
            date: function () {
                this.calculatePrice()
                this.convertBookingInfoDays ()
            }
        },
        beforeMount () {
            if (localStorage.getItem('user') === null) {
                this.$router.replace({name: 'Login'})
            } else {
                firebase
                    .firestore()
                    .collection('properties')
                    .doc(this.$route.params.id)
                    .get()
                    .then(property => {
                        this.property.id = property.id
                        this.property.name = property.data().name
                        this.property.description = property.data().description
                        this.property.image = property.data().image
                        this.property.extraImages = JSON.parse(property.data().extraImg)
                        this.property.price = property.data().price
                        this.property.city = property.data().city
                        if (property.data().unavailableDays) {
                            if (JSON.parse(property.data().unavailableDays).length >= 1) {
                                JSON.parse(property.data().unavailableDays).forEach(day => {
                                    this.property.unavailableDays.push(day)
                                })
                            } else {
                                this.property.unavailableDays.push(JSON.parse(property.data().unavailableDays))
                            }
                        }
                        this.property.extraImages.push(this.property.image)
                    })
                    .then(() => {
                        this.loading = 'is-hidden'
                    })
                    .then(() => {
                        setInterval(() => this.carouselForward(), 3000)
                    })
            }
        },
    }
</script>

<style scoped>
    .carousel-img {
        height: 600px;
        background-position: center !important;
        -webkit-background-size: cover !important;
        background-size: cover !important;
    }
    .carousel-btn {
        margin: 10px;
    }
    table th {
        width: 20%;
    }
    .padding {
        padding: 10px 0;
    }
    @media (max-width: 600px) {
        .carousel-img {
            height: 300px;
        }
    }
</style>