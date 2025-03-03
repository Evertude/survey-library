import * as React from "react";
import {
  SurveyQuestionElementBase,
  ReactSurveyElement
} from "./reactquestionelement";
import { QuestionDropdownModel } from "../question_dropdown";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { ItemValue } from "../itemvalue";
import { Base } from "../base";

export class SurveyQuestionDropdown extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionDropdownModel {
    return this.questionBase as QuestionDropdownModel;
  }
  handleOnChange(event: any) {
    this.question.renderedValue = event.target.value;
    this.setState({ value: this.getStateValue() });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var comment = this.question.isOtherSelected
      ? this.renderOther(cssClasses)
      : null;
    var select = this.renderSelect(cssClasses);
    return (
      <div className={cssClasses.root}>
        {select}
        {comment}
      </div>
    );
  }
  protected renderSelect(cssClasses: any): JSX.Element {
    if (this.isDisplayMode) {
      var isOtherSelected = this.question.isOtherSelected;
      return (
        // @ts-ignore
        <div id={this.question.inputId} className={cssClasses.control} disabled>
          {isOtherSelected
            ? this.question.otherText
            : this.question.displayValue}
        </div>
      );
    }
    var options = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      var option = <SurveyQuestionOptionItem key={key} item={item} />;
      options.push(option);
    }
    var captionOption = this.question.showOptionsCaption ? (
      <option value="">{this.question.optionsCaption}</option>
    ) : null;

    var value =
      !!this.state && this.state.value !== undefined
        ? this.state.value
        : this.getStateValue();

    return (
      <div className={cssClasses.selectWrapper}>
        <select
          id={this.question.inputId}
          className={cssClasses.control}
          value={value}
          onChange={this.handleOnChange}
          onInput={this.handleOnChange}
          aria-label={this.question.locTitle.renderedHtml}
        >
          {captionOption}
          {options}
        </select>
      </div>
    );
  }
  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className="form-group">
        <SurveyQuestionCommentItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
  private getStateValue(): any {
    return !this.question.isEmpty() ? this.question.renderedValue : "";
  }
}

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.item;
  }
  private get item(): ItemValue {
    return this.props.item;
  }
  render(): JSX.Element {
    if (!this.item) return;
    return (
      <option value={this.item.value} disabled={!this.item.isEnabled}>
        {this.item.text}
      </option>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", props => {
  return React.createElement(SurveyQuestionDropdown, props);
});
