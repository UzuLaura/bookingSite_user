<template>
    <div class="hero">
        <section class="hero is-dark">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{ this.$route.name }}
                    </h1>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "Hero",
    }
</script>

<style scoped>
</style>