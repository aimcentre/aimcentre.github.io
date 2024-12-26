<script setup lang="ts">
import type {PledgeFormDefinition} from '../models'

const props = defineProps<{
  formDefinition: PledgeFormDefinition
}>();

</script>

<template>
    <h1>{{ props.formDefinition.title }}</h1>
    <div v-if="props.formDefinition.description?.length>0" v-html="props.formDefinition.description" />

    <div v-for="(item, index) in props.formDefinition.items" :key="index">
        <div v-if="!item.hasOwnProperty('unitsRequired') || !item.unitsRequired || item.unitsRequired == 0">
            <h2>{{ item.title }}</h2>
            <div v-if="item.description && item.description.length>0" v-html="item.description"></div>
        </div>
        <div v-else>
            {{JSON.stringify(item)}}
        </div>
    </div>

</template>