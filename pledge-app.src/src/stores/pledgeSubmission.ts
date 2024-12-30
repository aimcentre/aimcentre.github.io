import type { PledgeFormDefinition } from '@/models'
import { defineStore } from 'pinia'

import {default as  formDefinition} from '../sampleData'
import { default as config } from '../appsettings';

export const usePledgeSubmissionStore = defineStore('pledgeSubmission', {
  state: () => {
    return { 
      danaPledgeForm: null! as PledgeFormDefinition,
      donationPledgeForm: null! as PledgeFormDefinition,
      name: '',
      email: '',
      phone: ''
    }
  },
  actions: {
    async loadForm (googleSheetId: string, tabName: string): Promise<PledgeFormDefinition> {
      return formDefinition;
    },

    async loadDanaPledgeFrom() {
      this.danaPledgeForm = await this.loadForm(config.spreadsheetId, config.danaFormTab)
    },

    async loadDonationsPledgeFrom() {
      this.donationPledgeForm = await this.loadForm(config.spreadsheetId, config.danaFormTab)
    },

    setDanaPledge(title: string, value: number): void {
      this.danaPledgeForm!.items.find(p => p.title == title)!.unitsPledged = value;
    },

    setDonationPledge(title: string, value: number): void {
      this.donationPledgeForm!.items.find(p => p.title == title)!.unitsPledged = value;
    },  
  },
})

