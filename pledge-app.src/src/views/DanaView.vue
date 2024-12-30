<script setup lang="ts">
//@ts-ignore
import PledgeForm from '../components/PledgeForm.vue'
import { usePledgeSubmissionStore } from '../stores/pledgeSubmission';

const store = usePledgeSubmissionStore();
store.loadDanaPledgeFrom().then();


</script>

<template>
    <pledge-form :form-definition="store.danaPledgeForm" />
    {{ store.danaPledgeForm }}
</template>
