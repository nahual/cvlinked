import { GetterTree } from 'vuex';
import Profile from '../../../model/profile';
import RootState from '../../state';
import ProfileState from './state';

const getters: GetterTree<ProfileState, RootState> = {
  getProfile: (state: ProfileState): Profile | null => state.profile,
};

export default getters;
