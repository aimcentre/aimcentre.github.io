import type { PledgeFormDefinition } from '@/models'
import { defineStore } from 'pinia'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {JWT} from 'google-auth-library';
import creds from '../google-service-account-credentials.json'; 
import { default as config } from '../appsettings';

import {default as  formDefinition} from '../sampleData'

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

      const credApi = "https://script.google.com/macros/s/AKfycbwgVw-1Q1ugg6wLCbE-y0DbMWNm-P99LFrXDWVilsXf_mKOnwJBo9qLzUcxzpmEUE_Z/exec";
      const response = await fetch(credApi, {
        redirect: "follow",
        method: 'POST',
        body: JSON.stringify({user:"pledge-form-app@pledge-form-app.iam.gserviceaccount.com"}),
        headers: {'Content-Type': 'text/plain; charset=UTF-8'} 
      });
      
      let key = "";
      if(response.ok) {
        key = await response.text();
        key = key.replace(/\\n/gi, '\n');

        const SCOPES = [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ];

        const jwt = new JWT({
          email: creds.client_email,
          key: key,
          scopes: SCOPES,
        });


        const doc = new GoogleSpreadsheet(config.spreadsheetId, jwt);
        await doc.loadInfo();
        console.log(doc.title);
      }
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

