<script setup>

    defineProps({
        mensaje:{
            type: String,
            default: 'Ocurrió un error'
        },

    })

</script>

<template>
    <div class="error-state">
        <p class="error-state__mensaje">{{ mensaje }}</p>
    </div>
</template>


<style scoped></style>