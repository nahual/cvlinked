import { Inject, Injectable } from "@decorators/di";
import ApiService from "../../../lib/service";
import { Education, Experience, LinkedInProfileScraper, Profile, Skill, VolunteerExperience } from '../../../lib/linkedin-profile-scraper';

import { Levels, Logger, StdLogger } from "../../../lib/loggers";

import fs from 'fs';
import path from 'path'
import converter from 'json-2-csv';
import moment from 'moment';

interface ProcessResult {
  link: string | null;
  name: string | null;
  is_working: boolean | null;
  last_job: string | null;
  last_job_role: string | null;
  last_job_start_date: string | null;
  english: boolean | null;
  nahual: boolean | null;
  nahual_start_date: string | null;
  mail: string | null;
}

@Injectable()
export default class LinkedInService extends ApiService {
  
  private scraper: LinkedInProfileScraper;
  private ready: boolean = false;
  private key: string = 'AQEDATWEp_8ESGzlAAABeWyGs_oAAAF5kJM3-k0ANGL1dWAJ9n8a_7uoNWIDYyor-4VCMGf6FaUcOIGfFf-Y2cJDk7fjdswhQzn3MEmvD49celaGcg94ODkoBJ4YHSPxceebD46LCr_b77qL0zPlhuWJ';

  constructor(
    @Inject(StdLogger) private logger: Logger
  ){
    super(logger, 'LinkedInService');
    this.scraper = new LinkedInProfileScraper({
      sessionCookieValue: this.key,
      keepAlive: true
    });
  }

  private wasResultFound(result: {
    userProfile: Profile;
    experiences: Experience[];
    education: Education[];
    volunteerExperiences: VolunteerExperience[];
    skills: Skill[];
  }){
    return result.userProfile.fullName !== null &&
      result.userProfile.title !== null &&
      result.userProfile.location !== null &&
      result.userProfile.photo !== null &&
      result.userProfile.description !== null &&
      result.userProfile.url !== null
  }

  private hasEnglish(education: Education[], skills: Skill[]): boolean{
    let english = false;
    education.forEach(e => {
      const has = e.degreeName && new RegExp('^.*(ingles|Ingles|english|English).*$').test(e.degreeName)
      if(has) english = has
    })
    skills.forEach(s => {
      const has = s.skillName && new RegExp('^.*(ingles|Ingles|english|English).*$').test(s.skillName)
      if(has) english = has
    })
    return english
  }

  private hasNahual(education: Education[]): {has: boolean, startDate: string | null} {
    let nahual: {has: boolean, startDate: string | null} = {has: false, startDate: null};
    for (let i = 0; i < education.length; i++) {
      const e = education[i];
      const hasNahualInDegreeName   = e.degreeName && new RegExp('^.*(nahual|Nahual).*$').test(e.degreeName)
      const hasNahualInSchoolName   = e.schoolName && new RegExp('^.*(nahual|Nahual).*$').test(e.schoolName)
      const hasNahualInFieldOfStudy = e.fieldOfStudy && new RegExp('^.*(nahual|Nahual).*$').test(e.fieldOfStudy)
      if (hasNahualInDegreeName || hasNahualInSchoolName || hasNahualInFieldOfStudy) {
        nahual.has = true
        nahual.startDate = e.startDate
        return nahual;
      }
    }
    return nahual
  }

  private generateProcessResult(profile: {link: string}, result: {
    userProfile: Profile;
    experiences: Experience[];
    education: Education[];
    volunteerExperiences: VolunteerExperience[];
    skills: Skill[];
  }): ProcessResult {

    let is_working: boolean | null = false;
    if(result.experiences.length > 0){
      try {
        is_working = moment().diff(moment(result.experiences[0].endDate), 'days') === 0
      } catch (error) {
        is_working = null
      }
    }

    const last_job = result.experiences.length > 0 ? result.experiences[0].company : null;
    const last_job_role = result.experiences.length > 0 ? result.experiences[0].title : null;
    const last_job_start_date = result.experiences.length > 0 ? result.experiences[0].startDate : null;

    const english = this.hasEnglish(result.education, result.skills)
    const nahual = this.hasNahual(result.education)

    return {
      link: profile.link,
      name: result.userProfile ? result.userProfile.fullName : null,
      is_working,
      last_job,
      last_job_role,
      last_job_start_date,
      english,
      nahual: nahual.has,
      nahual_start_date: nahual.startDate,
      mail: null
    }
  }

  private toCsv(fileName: string, processed: ProcessResult[]): Promise<{fileName: string, content: string}> {
    return new Promise((res, rej) => {
      converter.json2csv(processed, (err, csv) => {
        if(err) return rej(err)
        res({
          fileName: `${fileName}.csv`,
          content: csv ? csv : "",
        })
      })
    })
  }

  async processBatch(profiles: Array<{link: string}>): Promise<ProcessResult[]> {
    const processed: ProcessResult[] = []
    for(const p of profiles){
      try {
        const result = await this.scraper.run(p.link)
        const process = this.generateProcessResult(p, result)
        processed.push(process)
      } catch (error) {
        processed.push({
          link: p.link,
          name: null,
          is_working: null,
          last_job: null,
          last_job_role: null,
          last_job_start_date: null,
          english: null,
          nahual: null,
          nahual_start_date: null,
          mail: null
        })
        console.log(`process failed for { link: ${p.link} }: ${error.message}`)
        this.logger.log(Levels.ERROR, `process failed for { link: ${p.link} }`);
        throw error;
      }
    }
    return processed
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  batchify(profiles: Array<{link: string}>, chunkSize: number): Array<Array<{link: string}>>{
    const batches: Array<Array<{link: string}>> = [];
    for (let i=0; i<profiles.length; i+=chunkSize) {
      const temparray = profiles.slice(i,i+chunkSize);
      batches.push(temparray);
    }
    return batches;
  }

  processProfiles(id: string, profiles: Array<{link: string}>): Promise<{fileName: string, content: string}> {
    return (async () => {
      const batches = this.batchify(profiles, 15)
      let processed: ProcessResult[] = []
      
      while(batches.length > 0)  {
        const batch: Array<{link: string}> = batches.shift() || []
        await this.scraper.setup()
        try {
          const processedBatch = await this.processBatch(batch)
          processed = processed.concat(processedBatch);
        } catch (error) {
          batches.push(batch);
        }
        
        await this.scraper.close();
      }
      
      try {
        const csv = await this.toCsv(id, processed)
        console.log(`FINISHED`)
        return csv
      } catch (error) {
        console.log(`Error while writing file: ${error.message} `)
        this.logger.log(Levels.ERROR, `Error while writing file: ${error.message} `);
        return Promise.reject<{fileName: string, content: string}>(error);
      }
    })()
  }
};
