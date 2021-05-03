import { Inject, Injectable } from "@decorators/di";
import ApiService from "../../../lib/service";
import { Education, Experience, LinkedInProfileScraper, Profile, Skill, VolunteerExperience } from 'linkedin-profile-scraper';

import { Levels, Logger, StdLogger } from "../../../lib/loggers";

import moment from 'moment';

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

  private generateProcessResult(profile: {link: string, date: string}, result: {
    userProfile: Profile;
    experiences: Experience[];
    education: Education[];
    volunteerExperiences: VolunteerExperience[];
    skills: Skill[];
  }): any {
    if(!this.wasResultFound(result)){
      return {
        link: profile.link,
        name: null,
        is_working: null,
        actual_work: null,
        work_title: null,
        work_date: null,
        english: null,
        nahual: null,
        mail: null,
      }
    }

    const date = moment(new Date(profile.date));

    return {
      link: profile.link,
      name: result.userProfile.fullName,
      is_working: result.experiences.length > 0 && 
    }

  }

  processProfiles(id: string, profiles: Array<{link: string, date: string}>): Promise<any> {
    return (async () => {
      if(!this.ready){
        await this.scraper.setup()
        this.ready = true
      }

      for(const p of profiles){
        try {
            const result = await this.scraper.run(p.link)

            
        } catch (error) {
          this.logger.log(Levels.ERROR, `process failed for { link: ${p.link}, date: ${p.date} }`);
        }
      }
    })()
  }
};
