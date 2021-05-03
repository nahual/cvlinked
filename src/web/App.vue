<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col cols="12">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-file-input
              v-model="file"
              label="CSV"
              color="blue accent-4"
              prepend-icon="mdi-paperclip"
              counter
              outlined
              dense
              :show-size="1000"
              :rules="fileRules"
              required
            ></v-file-input>
            <v-progress-linear
              v-model="progress"
              color="blue darken-2"
              height="20"
              reactive
            >
              <strong>{{ progress }} %</strong>
            </v-progress-linear>
            <v-btn
              :disabled="!valid"
              color="blue darken-2"
              class="ma-2 white--text"
              @click="upload"
            >
              <v-icon left dark> mdi-cloud-upload </v-icon>
              Upload
            </v-btn>
            <v-chip
              v-show="getUploadResult !== null"
              class="ma-2"
              v-bind:class="chipColor()"
              text-color="white">
              {{ getUploadResult }}
            </v-chip>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
.app {
  text-align: center;
  background: $main-color;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Result from "./model/result";
import { ActionsEvents } from "./store/modules/profile/actions";

@Component
export default class App extends Vue {
  private valid: boolean = true;

  private file: File | null = null;
  private fileRules: Array<Function> = [
    (f: File) => !!f || "File is required",
    (f: File) =>
      (f && /\.csv$/.test(f.name)) || "File must have .csv extension",
    (f: File) => (f && f.size <= 1024 * 1024) || "File must be 1MB or less",
  ];
  private progress: number = 0;

  mounted() {}

  upload(): void {
    const valid = (this.$refs.form as Vue & {
      validate: () => boolean;
    }).validate();
    if (valid) {
      this.$store.dispatch(ActionsEvents.UPLOAD, {
        file: this.file,
        onUploadProgress: (event: any) => {
          this.progress = Math.round((event.loaded * 100) / event.total);
        },
      });
    }
  }

  chipColor(){
    return {
      green: this.getUploadResult === Result.SUCEDEED,
      'yellow darken-1': this.getUploadResult === Result.IN_PROGRESS,
      red: this.getUploadResult === Result.FAILED
    }
  }

  get getUploadResult(): Result {
    return this.$store.getters.getUploadResult;
  }
}
</script>