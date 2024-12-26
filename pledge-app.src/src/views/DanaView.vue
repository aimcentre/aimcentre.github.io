<script setup lang="ts">
import {default as  formDefinition} from '../sampleData'
import PledgeForm from '../components/PledgeForm.vue'

</script>

<template>
    <h1>Dana Pledges</h1>
    <pledge-form :form-definition="formDefinition" />
    
</template>
