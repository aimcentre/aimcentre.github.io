<script setup lang="ts">
import { watch } from 'vue';
import type {PledgeFormDefinition} from '../models'
//@ts-ignore
import ProgressBar from './ProgressBar.vue';

const props = defineProps<{
  formDefinition: PledgeFormDefinition | null
}>();

</script>

<template>
    <div v-if="props.formDefinition">
        <h1>{{ props.formDefinition.title }}</h1>
        <div v-if="props.formDefinition.description?.length>0" v-html="props.formDefinition.description"></div>
        <div v-for="(item, index) in props.formDefinition?.items" :key="index">
            <div v-if="!item.unitsRequired || item.unitsRequired == 0">
                <h2>{{ item.title }}</h2>
                <div v-if="item.description && item.description.length>0" v-html="item.description"></div>
            </div>
            <div v-else  class="row">
                <div v-if="item.unitsRequired > (item.unitsReceived ? item.unitsReceived : 0)" class="">
                    <div class="field-row">
                        <label :for="'field'+index" class="form-label">{{ item.title }}</label>
                        <div :id="'fieldHelp'+index">
                            {{ item.description }} <span v-if="item.unitPrice && item.unitPrice > 0">One sponsorship = ${{ item.unitPrice }}.</span>
                        </div>
                        <div class="">
                            <progress-bar :current="(item.unitsReceived ? item.unitsReceived : 0)" :max="item.unitsRequired" />

                            <span class="contribution-prompt">Your Contribution: </span>
                            <input 
                                type="number" 
                                min="0" 
                                :max="item.unitsRequired-(item.unitsReceived ? item.unitsReceived : 0)" 
                                class=" col-1" 
                                :id="'fieldHelp'+index" 
                                :aria-describedby="'fieldHelp'+index"
                                v-model="item.unitsPledged"
                                value="0" /> 
                        </div>
                    </div>
                    <!-- {{JSON.stringify(item)}} -->
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.form-label {
    font-weight: bold;
    margin-bottom: 0px;
}
.field-row {
    margin: 10px 0;
}

</style>