import { MutationTree } from 'vuex';
import Profile from '../../../model/profile';
import ProfileState from './state';

export enum ProfileMutations {
  SET_PROFILE = 'SET_PROFILE',
}

export const mutations: MutationTree<ProfileState> = {
  [ProfileMutations.SET_PROFILE](state: ProfileState, profile: Profile) {
    state.profile = profile;
  },
};
