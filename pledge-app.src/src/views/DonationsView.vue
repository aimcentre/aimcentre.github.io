<script setup lang="ts">
import { usePledgeSubmissionStore } from '../stores/pledgeSubmission';
//@ts-ignore
import PledgeForm from '../components/PledgeForm.vue'

const store = usePledgeSubmissionStore();
store.loadDonationsPledgeFrom().then();

</script>

<template>
    <pledge-form :form-definition="store.donationPledgeForm" />
    {{ JSON.stringify(store.donationPledgeForm, null, 4) }}
</template>
