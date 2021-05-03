import { Inject, Injectable } from "@decorators/di";
import ApiService from "../../../lib/service";
import { Education, Experience, LinkedInProfileScraper, Profile, Skill, VolunteerExperience } from 'linkedin-profile-scraper';

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
  mail: string | null;
}

@Injectable()
export default class LinkedInService extends ApiService {
  
  private scraper: LinkedInProfileScraper;
  private ready: boolean = false;
  private key: string = 'AQEDATWEp_8Dt4hSAAABeQwH8ogAAAF5MBR2iE4AeS7tJIBqzeamoSbJz-N1WJdvH3rC_NXSXSvlIQ97_vAQNgzaXVO7k5NEAArw3Y2dDaKsW1jKWYZBSeKkuHV_T3GePfoKbmSH7klwsSKyR0WJaLfY';

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

  private hasNahual(education: Education[]){
    let nahual = false;
    education.forEach(e => {
      const has = e.degreeName && new RegExp('^.*(nahual|Nahual).*$').test(e.degreeName)
      if(has) nahual = has
    })
    return nahual
  }

  private generateProcessResult(profile: {link: string, date: string}, result: {
    userProfile: Profile;
    experiences: Experience[];
    education: Education[];
    volunteerExperiences: VolunteerExperience[];
    skills: Skill[];
  }): ProcessResult {
    if(!this.wasResultFound(result)){
      return {
        link: profile.link,
        name: null,
        is_working: null,
        last_job: null,
        last_job_role: null,
        last_job_start_date: null,
        english: null,
        nahual: null,
        mail: null,
      }
    }

    let is_working = false;
    if(result.experiences.length > 0){
      is_working = moment().diff(moment(result.experiences[0].endDate), 'days') === 0
    }

    const last_job = result.experiences.length > 0 ? result.experiences[0].company : null;
    const last_job_role = result.experiences.length > 0 ? result.experiences[0].title : null;
    const last_job_start_date = result.experiences.length > 0 ? result.experiences[0].startDate : null;

    const english = this.hasEnglish(result.education, result.skills)
    const nahual = this.hasNahual(result.education)

    return {
      link: profile.link,
      name: result.userProfile.fullName,
      is_working,
      last_job,
      last_job_role,
      last_job_start_date,
      english,
      nahual,
      mail: null
    }
  }

  private writeCsvFile(fileName: string, processed: ProcessResult[]): Promise<void> {
    return new Promise((res, rej) => {
      converter.json2csv(processed, (err, csv) => {
        if(err) return rej(err)
        fs.writeFile(path.resolve(__dirname, `../../../../processed/${fileName}.csv`), csv, err => {
          if(err) return rej(err)
          return res()
        })
      })
    })
  }

  processProfiles(id: string, profiles: Array<{link: string, date: string}>): Promise<any> {
    return (async () => {
      if(!this.ready){
        await this.scraper.setup()
        this.ready = true
      }

      const processed: ProcessResult[] = []
      for(const p of profiles){
        try {
            const result = await this.scraper.run(p.link)
            const process = this.generateProcessResult(p, result)
            processed.push(process)
        } catch (error) {
          console.log(`process failed for { link: ${p.link}, date: ${p.date} }: ${error.message}`)
          this.logger.log(Levels.ERROR, `process failed for { link: ${p.link}, date: ${p.date} }`);
        }
      }
      try {
        await this.writeCsvFile(id, processed)
      } catch (error) {
        console.log(`Error while writing file: ${error.message} `)
        this.logger.log(Levels.ERROR, `Error while writing file: ${error.message} `);
      }
    })()
  }
};
