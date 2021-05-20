import { GetterTree } from 'vuex';
import Result from '../../../model/result';
import Profile from '../../../model/profile';
import RootState from '../../state';
import ProfileState from './state';

const getters: GetterTree<ProfileState, RootState> = {
  getFileId: (state: ProfileState): string | null => state.fileId,
  getUploadResult: (state: ProfileState): Result | null => state.uploadResult,
};

export default getters;
