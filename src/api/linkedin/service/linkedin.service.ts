import { Inject, Injectable } from "@decorators/di";
import ApiService from "../../../lib/service";
import { LinkedInProfileScraper } from 'linkedin-profile-scraper';

import { Logger, StdLogger } from "../../../lib/loggers";

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

  getProfile(username: string): Promise<any> {
    return (async () => {
      if(!this.ready){
        await this.scraper.setup()
        this.ready = true
      }
      const result = await this.scraper.run(`https://www.linkedin.com/in/${username}/`)
      return result;
    })()
  }
};
