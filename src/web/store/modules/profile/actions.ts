import Vue from 'vue';
import { ActionTree } from 'vuex';
import Profile from '../../../model/profile';
import host from '../../host';
import RootState from '../../state';
import { ProfileMutations } from './mutations';
import ProfileState from './state';

export enum ProfileActions {
  PROFILE_FROM = 'PROFILE_FROM'
}

export const actions: ActionTree<ProfileState, RootState> = {
  async [ProfileActions.PROFILE_FROM]({ commit }, username: string) {
    try {
      const res = await Vue.axios
        .get<Profile>(`http://${host}/api/linkedin/${username}`);
      return commit(ProfileMutations.SET_PROFILE, res.data);
    } catch (err) {
      if (err.response) {
        return console.log(`Error: ${err.data}`);
      }
      return null;
    }
  },
};
