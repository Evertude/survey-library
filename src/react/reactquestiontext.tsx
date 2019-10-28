import * as React from "react";
import { Helpers } from "../helpers";
import { Base } from "../base";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionTextModel } from "../question_text";
import { ReactQuestionFactory } from "./reactquestionfactory";
import * as TextMask from "text-mask-core";

export class SurveyQuestionText extends SurveyQuestionElementBase {
  textMaskInputElement: any;
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  protected get question(): QuestionTextModel {
    return this.questionBase as QuestionTextModel;
  }
  handleOnChange(event: any) {
    this.textMaskInputElement.update();
    this.setState({ value: this.getValue(event.target.value) });
  }
  handleOnBlur(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.getValue(this.question.value) });
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    var el: any = this.refs["input"];
    if (!!el) {
      el.removeAttribute("data-input-rendered");
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this.afterRender();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.afterRender();
  }
  private afterRender() {
    if (this.question) {
      var el: any = this.refs["input"];
      if (
        el &&
        this.question.survey &&
        el.getAttribute("data-input-rendered") !== "r"
      ) {
        el.setAttribute("data-input-rendered", "r");
        //
        //if(this.question.inputType === "date") {
          this.textMaskInputElement = TextMask.createTextMaskInputElement({
            inputElement: el,
            showMask: true,
            mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
            //keepCharPositions: true,
            //placeholderChar: '\u2000'
          });
          this.textMaskInputElement.update(this.question.value);
        //}
      }
    }
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var value =
      !!this.state && this.state.value !== undefined
        ? this.state.value
        : this.getValue(this.question.value);
    return (
      <input
        ref="input"
        id={this.question.inputId}
        disabled={this.isDisplayMode}
        className={cssClasses.root}
        type={this.question.inputType}
        value={value}
        maxLength={this.question.getMaxLength()}
        size={this.question.size}
        placeholder={this.question.placeHolder}
        onBlur={this.handleOnBlur}
        onChange={this.handleOnChange}
        aria-required={this.question.isRequired}
        aria-label={this.question.locTitle.renderedHtml}
      />
    );
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}

ReactQuestionFactory.Instance.registerQuestion("text", props => {
  return React.createElement(SurveyQuestionText, props);
});
