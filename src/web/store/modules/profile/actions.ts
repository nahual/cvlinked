import Vue from 'vue';
import { ActionTree } from 'vuex';
import Identifier from '../../../model/identifier';
import Result from '../../../model/result';
import Profile from '../../../model/profile';
import host from '../../host';
import RootState from '../../state';
import { MutationEvents } from './mutations';
import ProfileState from './state';

export enum ActionsEvents {
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
  UPLOAD = 'UPLOAD'
}

export const actions: ActionTree<ProfileState, RootState> = {
  async [ActionsEvents.DOWNLOAD_FILE]({ commit }, filename: string) {
    try {
      await Vue.axios
        .get<Profile>(`${host}/api/linkedin/download?filename=${filename}`);
    } catch (err) {
      if (err.response) {
        return console.log(`Error: ${err.data}`);
      }
    }
    return null;
  },
  async [ActionsEvents.UPLOAD]({ commit }, { file, onUploadProgress }) {
    try {
      const buffer = await file?.arrayBuffer();
      const formData = new FormData();
      formData.append('csv', new Blob([buffer as BlobPart], { type: 'text/csv' }));
      commit(MutationEvents.UPLOAD_RESULT, Result.IN_PROGRESS);
      const res = await Vue.axios.post<Identifier>(`${host}/api/linkedin/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      });
      commit(MutationEvents.SET_FILEID, `${res.data.id}.csv`);
      commit(MutationEvents.UPLOAD_RESULT, Result.SUCEDEED);
    } catch (error) {
      commit(MutationEvents.UPLOAD_RESULT, Result.FAILED);
    }
  },
};
