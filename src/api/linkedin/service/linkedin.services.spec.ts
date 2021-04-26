import chai from 'chai';
import LinkedInService from './linkedin.service';
import { Container } from '@decorators/di';
const expect = chai.expect;

describe('LinkedInService', () => {

  describe('getProfile', () => {
    it('Should retrieve a profile', done => {
      const service: LinkedInService = Container.get<LinkedInService>(LinkedInService);
      const profile: any = service.getProfile('christiangelone');
      profile.then(p => {
        expect(p).not.equal({});
        done();
      })
    }, 60000);
  });

});