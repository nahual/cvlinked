import Profile from 'src/web/model/profile';
import Result from 'src/web/model/result';

export default interface ProfileState {
  profile: Profile | null,
  uploadResult: Result | null,
}
