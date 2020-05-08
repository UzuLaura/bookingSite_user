<template>
  <div class="home">
    <Spinner v-bind:class="loading"/>
    <div class="container section">
        <div class="columns">
            <div class="column is-2">
                <div class="field-label is-normal">
                    <label class="label">Search by Name</label>
                </div>
            </div>
            <div class="column is-7">
                <div class="control has-icons-left">
                    <input class="input" v-model="search" type="text" placeholder="Search">
                    <span class="icon is-left">
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
            <div class="column is-3">
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Filter by City</label>
                    </div>
                    <div class="select margin-bottom">
                        <select v-model="filter">
                            <option>Vilnius</option>
                            <option>Kaunas</option>
                            <option>Klaipėda</option>
                            <option>All</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns is-multiline">
            <div class="column is-12" v-bind:class="noResults"><h4 class="title has-text-centered">No Search Results Found</h4></div>
            <div class="card column is-4 hover" v-on:click="viewProperty(property.id)" v-for="property in properties" :key="property.title">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img :src="property.image" alt="Placeholder image">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4 is-marginless">{{ property.name }}</p>
                            <span class="tag is-light is-medium">{{ property.city }}</span>
                        </div>
                    </div>
                    <div class="content">
                        {{ cutText(property.description) }}
                        <hr>
                        <div class="level is-mobile">
                            <span class="tag is-success is-large level-left">Price: {{ property.price }}$</span>
                            <button class="button is-dark level-right" v-on:click="viewProperty(property.id)">View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import Spinner from '../components/Spinner'

    export default {
        name: "Home",
        components: {Spinner},
        data () {
            return {
                properties: [],
                user: localStorage.getItem('user'),
                search: '',
                filter: '',
                loading: '',
                noResults: 'is-hidden'
            }
        },
        methods: {
            viewProperty (id) {
                this.$router.push('/preview/id/' + id)
            },
            cutText (string) {
                if (string.length > 200) {
                    string = string.substring(0, 200) + '...'
                    return string
                } else {
                    return string
                }
            }
        },
        watch: {
            properties: function () {
                if (this.properties.length < 1) {
                    this.noResults = ''
                } else {
                    this.noResults = 'is-hidden'
                }
            },
            search: function () {
                firebase
                    .firestore()
                    .collection('properties')
                    .orderBy("createdAt")
                    .get()
                    .then(data => {
                        this.properties = []
                        data.forEach(property => {
                            if (property.data().name.toLowerCase().includes(this.search.toLowerCase())) {
                                this.properties.push({
                                    id: property.id,
                                    name: property.data().name,
                                    image: property.data().image,
                                    price: property.data().price,
                                    description: property.data().description,
                                    city: property.data().city,
                                    owner: property.data().ownerName,
                                    createdAt: property.data().createdAt
                                })
                            }
                        })
                    })
            },
            filter: function () {
                this.loading = ''
                this.properties = []
                if (this.filter === 'All') {
                    firebase
                        .firestore()
                        .collection('properties')
                        .orderBy("createdAt")
                        .get()
                        .then(data => {
                            data.forEach(property => {
                                this.properties.push({
                                    id: property.id,
                                    name: property.data().name,
                                    image: property.data().image,
                                    price: property.data().price,
                                    description: property.data().description,
                                    city: property.data().city,
                                    owner: property.data().ownerName,
                                    createdAt: property.data().createdAt
                                })
                            })
                        })
                        .then(() => {
                            this.loading = 'is-hidden'
                        })
                } else {
                    firebase
                        .firestore()
                        .collection('properties')
                        .where('city', '==', this.filter)
                        .orderBy("createdAt")
                        .get()
                        .then(data => {
                            data.forEach(property => {
                                this.properties.push({
                                    id: property.id,
                                    name: property.data().name,
                                    image: property.data().image,
                                    price: property.data().price,
                                    description: property.data().description,
                                    city: property.data().city,
                                    owner: property.data().ownerName,
                                    createdAt: property.data().createdAt
                                })
                            })
                        })
                        .then(() => {
                                this.loading = 'is-hidden'
                        })
                }
            }
        },
        beforeMount () {
            if (localStorage.getItem('user') === null) {
                this.$router.replace({name: 'Login'})
            } else {
                firebase
                    .firestore()
                    .collection('properties')
                    .orderBy("createdAt")
                    .get()
                    .then(data => {
                        data.forEach(property => {
                            this.properties.push({
                                id: property.id,
                                name: property.data().name,
                                image: property.data().image,
                                price: property.data().price,
                                description: property.data().description,
                                city: property.data().city,
                                owner: property.data().ownerName,
                                createdAt: property.data().createdAt
                            })
                        })
                    })
                    .then(() => {
                        this.loading = 'is-hidden'
                    })
            }
        }
    }
</script>

<style scoped>
  .hover:hover {
    opacity: 0.9;
    cursor: pointer;
  }
    .margin-bottom {
        margin-bottom: 20px;
    }
</style>