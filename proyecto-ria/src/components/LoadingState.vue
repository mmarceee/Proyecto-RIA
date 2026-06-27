<script setup>

    defineProps({
        mensaje:{
            type: String,
            default: 'Cargando...'
        },

    })

</script>

<template>
    <div class="loading-state">
        <p class="loading-state__mensaje">{{ mensaje }}</p>
    </div>
</template>


<style scoped></style>