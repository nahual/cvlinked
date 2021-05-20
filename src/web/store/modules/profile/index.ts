import { Module } from 'vuex';
import RootState from '../../state';
import getters from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import ProfileState from './state';

const state: ProfileState = {
  fileId: null,
  uploadResult: null,
};

const ProfileModule: Module<ProfileState, RootState> = {
  state,
  getters,
  mutations,
  actions,
};

export default ProfileModule;
