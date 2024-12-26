<script setup lang="ts">
import { defineProps } from 'vue';


const props = defineProps<{
    max: number;
    current: number;
}>();

const fillPercent = Math.round(props.current / props.max * 100);
const emptyPercent = 100 - fillPercent;

</script>

<template>
    <div class="progress">
        <div class="progress-bar bg-success" role="progressbar" :aria-valuenow="current" :aria-valuemin="0" :aria-valuemax="max" :style="'width:'+fillPercent+'%'" /> 
        <div class="progress-bar bg-danger" role="progressbar" :aria-valuenow="current" :aria-valuemin="0" :aria-valuemax="max" :style="'width:'+emptyPercent+'%'" /> 
    </div>
</template>

<style scoped>
 .progress {
    width: 400px;
    display: flex;
    height: 3px;
    margin: 0 0 5px 0;
}
</style>