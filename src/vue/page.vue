<template>
    <div :class="css.page.root">
        <h4 v-if
        ="showHeader" :class="css.pageTitle"><survey-string :locString="page.locTitle"/></h4>
        <div v-if="showHeader" :class="css.pageDescription"><survey-string :locString="page.locDescription"/></div>
        <div v-for="(row, index) in rows" v-if="row.visible" :key="page.id + '_' + index" :class="css.row">
            <survey-row :row="row" :survey="survey" :css="css"></survey-row>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { SurveyModel } from "../survey";
import { PageModel } from "../page";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";

@Component
export class Page extends Vue {
  @Prop survey: SurveyModel;
  @Prop page: PageModel;
  @Prop css: Object;

  isCurrentPageChanged: boolean = false;

  mounted() {
    if (this.survey) {
      this.survey.afterRenderPage(this.$el);

      this.survey.onCurrentPageChanged.add((sender, options) => {
        this.isCurrentPageChanged = true;
      });
    }
  }
  updated() {
    var self = this;
    self.survey.afterRenderPage(this.$el);
    this.$nextTick(function() {
      if (this.isCurrentPageChanged) {
        this.isCurrentPageChanged = false;
        self.survey.scrollToTopOnPageChange();
      }
    });
  }
  get showHeader() {
    return this.survey.showPageTitles;
  }
  get num() {
    return this.page.num > 0 ? this.page.num + ". " : "";
  }
  get rows() {
    return this.page.rows;
  }
}
Vue.component("survey-page", Page);
export default Page;
</script>
