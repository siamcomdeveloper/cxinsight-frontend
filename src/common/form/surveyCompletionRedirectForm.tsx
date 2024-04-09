/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import TextArea from "antd/lib/input/TextArea";
import { History } from 'history';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
  survey: Surveys;
  history: History;
    match:{ 
        isExact: boolean
        params: {
            xSite: string
        },
        path: string,
        url: string,
    }
}
interface IState{
  survey: Surveys;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        survey: this.props.survey
      }
    }

    componentDidMount() { 

    // console.log('CreateForm componentDidMount');

      this.props.form.setFieldsValue({
        completion_redirect: this.props.survey.completion_redirect,
      }, () => console.log('after'));

    }
    
    selectUpdate = (obj: any, selectKeys: any, params: any) => {
        const clone = Object.assign({}, obj);

        // console.log(selectKeys);

        for (const key in obj) {
            let matched = false;

            selectKeys.forEach((selectKey: any, index: any) => {
                // console.log('index', index);
                if(selectKey === key){
                    matched = true;
                    clone[selectKey] = params[index];
                }
            });
            if(!matched) {
                delete clone[key];
                // console.log('delete!');
            }
        }

        return clone;
    }
  
    check = () => {
      this.props.form.validateFields(err => {
        if (!err) {
        // console.log('check', this.state.survey);
  
          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['completion_redirect'], [this.state.survey.completion_redirect]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyCompletionRedirectForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyCompletionRedirectForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                  }
              }
          );

        }
      });
    };
  
    onTextAreaChange = (e: any) => {
      this.onFieldValueChange(e.target.id, e.target.value)
    };

    // onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    //   this.onFieldValueChange(e.target.id, e.target.value)
    // }

    onFieldValueChange = (fieldName: string, value: any) => { 
      const nextState = {
          ...this.state,
          survey: {
              ...this.state.survey,
              [fieldName]: value,
          }
      };

      this.setState(nextState);
    // console.log('Create onFieldValueChange', this.state.survey);
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <div>
          <Form.Item {...formItemLayout} >
            {getFieldDecorator('completion_redirect', {
              rules: [
                {
                  // required: true,
                  // message: 'Please input the survey completion redirect url',
                },
              ],
            // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Footer Description" />)}
            })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey completion redirect url" rows={1}/>)}
          </Form.Item>

          <footer className="wds-modal__foot">
            <div className="wds-modal__actions-right">
              <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.check}>
                APPLY
              </Button>
            </div>
          </footer>
        </div>
      );
    }
  }
  
const messageEditForm = Form.create<Props>()(EditForm);
export default messageEditForm;
