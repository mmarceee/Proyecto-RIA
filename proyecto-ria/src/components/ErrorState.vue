<script setup>

    defineProps({
        message:{
            type: String,
            default: 'Ocurrió un error'
        },

    })

</script>

<template>
    <div class="error-state">
        <p class="error-state__message">{{ message }}</p>
    </div>
</template>


<style scoped></style>