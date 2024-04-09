/* eslint-disable import/first */
import * as React from "react";
// import Surveys from '../../models/surveys';
import { Form, Input, Button, Select, Radio, Tooltip, Icon } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { FormComponentProps } from "antd/lib/form";

interface Props extends FormComponentProps{
  // surveys: Surveys;
  surveyProjects: any,
  surveyTouchpoint: string;
  surveyTouchpointId: string;
  onFieldValueChange: (fieldName: any, value: any) => void;
  onSave: () => void;
}
interface IState{
  surveyLang: any;
  // surveyTouchpoint: string;
  // surveyTouchpointId: string;
}

class CreateForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);
      this.state = {
        surveyLang: "0"
      }
     
    }

    async componentDidMount() { 

      try{
      
      }
      catch(error){
        toastr.error('Something went wrong!, please refresh the page or try again later.');
      // console.log('error', error);
      }

    }

    getPageOptionRow = (project: any) => {
        // return (<option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}. </option>);
        return (<Select.Option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}</Select.Option>);
    }

  
    check = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
            console.info('success');
            this.props.onSave();
        }
      });
    };
  
    

    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      this.props.onFieldValueChange(e.target.id, e.target.value);
    }
    
    // onSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    //     const element = event.target as HTMLSelectElement;
    //   // console.log('element', element);
    // }
    onSelectChange = (projectId: any)=> {
      // console.log('e', e);
      // console.log('e.target', e.target);
      // console.log('e.target.id', e.target.id);
      // console.log('e.target.value', e.target);
      this.props.onFieldValueChange('project_id', projectId);
    }

   
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <Form.Item style={{ paddingBottom: 0 }} >
            <label className="label-create">Display name: </label>
          
            
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }} >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the survey display name',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey display name" />)}
          </Form.Item>

          <Form.Item  style={{ paddingBottom: 0 }} >
            
            <label className="label-create">Nickname: </label>
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }}>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: 'Please input the survey nickname',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey nickname" />)}
          </Form.Item>

          <Form.Item  >
            {/* <Input className="wds-input wds-input--md wds-input--stretched" disabled={true} value={this.props.collectorType} /> */}
            <label style={{ fontWeight: 500, fontSize: 16 }}>Template :</label><label style={{ fontSize: 16 }}> {this.props.surveyTouchpoint}</label>
          </Form.Item>

          <footer className="wds-modal__foot">
            <div className="wds-modal__actions-right">
              <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.check}>
                CREATE SURVEY
              </Button>
            </div>
          </footer>
        </div>
      );
    }
  }
  
const SurveyCreateForm = Form.create<Props>()(CreateForm);
export default SurveyCreateForm;
