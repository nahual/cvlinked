import { Inject, Injectable } from "@decorators/di";
import ApiService from "../../../lib/service";
import { Education, Experience, LinkedInProfileScraper, Profile, Skill, VolunteerExperience } from 'linkedin-profile-scraper';

import { Levels, Logger, StdLogger } from "../../../lib/loggers";

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
