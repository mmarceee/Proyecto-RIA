<script setup>

    defineProps({
        message:{
            type: String,
            default: 'Cargando...'
        },

    })

</script>

<template>
    <div class="loading-state">
        <p class="loading-state__message">{{ message }}</p>
    </div>
</template>


<style scoped></style>