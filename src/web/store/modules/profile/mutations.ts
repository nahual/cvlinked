import { MutationTree } from 'vuex';
import Result from '../../../model/result';
import Profile from '../../../model/profile';
import ProfileState from './state';

export enum MutationEvents {
  SET_PROFILE = 'SET_PROFILE',
  UPLOAD_RESULT = 'UPLOAD_RESULT'
}

export const mutations: MutationTree<ProfileState> = {
  [MutationEvents.SET_PROFILE](state: ProfileState, profile: Profile) {
    state.profile = profile;
  },

  [MutationEvents.UPLOAD_RESULT](state: ProfileState, result: Result) {
    state.uploadResult = result;
  },
};
