import { MutationTree } from 'vuex';
import Result from '../../../model/result';
import Profile from '../../../model/profile';
import ProfileState from './state';

export enum MutationEvents {
  SET_FILEID = 'SET_FILEID',
  UPLOAD_RESULT = 'UPLOAD_RESULT'
}

export const mutations: MutationTree<ProfileState> = {
  [MutationEvents.SET_FILEID](state: ProfileState, fileId: string) {
    state.fileId = fileId;
  },

  [MutationEvents.UPLOAD_RESULT](state: ProfileState, result: Result) {
    state.uploadResult = result;
  },
};
