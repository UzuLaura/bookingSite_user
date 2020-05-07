<template>
    <div class="spinner">
        <div>
            <img src="../assets/loader.gif" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "Spinner"
    }
</script>

<style scoped>
    .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>