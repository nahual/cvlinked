import { GetterTree } from 'vuex';
import Result from '../../../model/result';
import Profile from '../../../model/profile';
import RootState from '../../state';
import ProfileState from './state';

const getters: GetterTree<ProfileState, RootState> = {
  getProfile: (state: ProfileState): Profile | null => state.profile,
  getUploadResult: (state: ProfileState): Result | null => state.uploadResult,
};

export default getters;
