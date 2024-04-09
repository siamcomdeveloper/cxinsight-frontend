/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import { History } from 'history';

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
        survey: this.props.survey,
      }
      // this.onRichChange = this.onRichChange.bind(this);
      this.onFieldValueChange = this.onFieldValueChange.bind(this);
    }

    componentDidMount() { 
      // console.log('CreateForm componentDidMount props', this.props);
    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    // }
    
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
          // console.log('check', this.selectUpdate(this.state.survey, ['name'], [this.state.survey.name]));

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['nickname'], [this.state.survey.nickname]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm check BaseService.update /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){ 
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm check BaseService.update /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                  }
              }
          );

        }
      });
    };
  
    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      this.onFieldValueChange(e.target.id, e.target.value)
    }
  
    onFieldValueChange = (fieldName: string, value: any) => { 
      // console.log(`onFieldValueChange fieldName`, fieldName);
      // console.log(`onFieldValueChange value`, value);
      // this.setState({[fieldName]: value});
      const nextState = {
          ...this.state,
          survey: {
              ...this.state.survey,
              [fieldName]: value,
          }
      };
      this.setState(nextState, () => {
        // console.log(`this.state.survey`, this.state.survey);
      });
      // this.setState({
      //     // survey: {
      //     //   ...this.state.survey,
      //       [fieldName]: value
      //     // }
      // }, () => {
      //     console.log(`this.state.survey`, this.state);
      // });
      // const nextState = {
      //     ...this.state,
      //     survey: {
      //         ...this.state.survey,
      //         name: value,
      //     }
      // };
    // console.log('Create onFieldValueChange', this.state.survey);
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      
      return (
        <div>
          <div>
            <Form.Item>
              {getFieldDecorator('nickname', {
                initialValue: this.props.survey.nickname,
                rules: [
                  {
                    required: true,
                    message: 'Please input the survey nickname',
                  },
                ],
              })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey nickname" />)}
            </Form.Item>
          </div>

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
