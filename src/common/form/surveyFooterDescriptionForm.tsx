/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button, Spin } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import TextArea from "antd/lib/input/TextArea";
import RichTextEditor from '../RichTextEditor';
import ReactDOM from "react-dom";
import { History } from 'history';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
  survey: Surveys;
  pageNo: number;
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
  isLoading: boolean;
  survey: Surveys;
  footerDescription: any;
  currentFooterDescription: any;
  fontColor: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        footerDescription: [],
        currentFooterDescription: [],
        fontColor: []
      }
    }

    componentDidMount() { 

      const jwt = getJwtToken();
        
      BaseService.getJSON(this.props.match.params.xSite, "/color", '', jwt).then(
          (rp) => {
              try{
                  if (rp.Status) {
                      // const colors = rp.Data.result.recordset;
                      const colors = rp.Data.result.recordset.map((colorData: any) => {return colorData.hex_code;});
                      // console.log('SurveyFooterDescriptionForm componentDidMount pageNo', this.props.pageNo);

                      const footerDescription = this.props.survey.footer_description ? this.props.survey.footer_description.includes('~') ? this.props.survey.footer_description.split('~') : [this.props.survey.footer_description] : [''];
                      // console.log('footerDescription', footerDescription);

                      //check if current page is more then set page footer description number on design page
                      // console.log('this.props.pageNo > footerDescription.length', this.props.pageNo > footerDescription.length);
                      if(this.props.pageNo > footerDescription.length){

                          //prepare a new array for footer description
                          const footerDescriptionArr = new Array(this.props.pageNo); 
                          for (let i = 0; i < this.props.pageNo; i++) { 
                            footerDescriptionArr[i] = ''; 
                          }
                          // console.log('after prepare footerDescriptionArr', footerDescriptionArr);

                          //transfers all set page footer description to new array
                          for (let i = 0; i < footerDescription.length; i++) { 
                            footerDescriptionArr[i] = footerDescription[i]; 
                          }
                          // console.log('after transfers footerDescriptionArr', footerDescriptionArr);

                          this.setState({
                              footerDescription: footerDescriptionArr,
                              currentFooterDescription: footerDescriptionArr[this.props.pageNo-1],
                              fontColor: colors
                          }, () => {
                              // console.log('if after this.state.footerDescription', this.state.footerDescription);

                              // const currentFooterDescription = this.state.footerDescription[this.props.pageNo-1];
                              // console.log('currentFooterDescription', currentFooterDescription);

                              this.setState({ isLoading: false }, () => {
                                  this.props.form.setFieldsValue({
                                      footer_description: this.state.currentFooterDescription,
                                  }, () => { /*onsole.log('after')*/ });
                              });
                          });
                      }
                      else{
                          this.setState({
                              footerDescription: footerDescription,
                              currentFooterDescription: footerDescription[this.props.pageNo-1],
                              fontColor: colors
                          }, () => {
                              // console.log('else after this.state.footerDescription', this.state.footerDescription);

                              // const currentFooterDescription = this.state.footerDescription[this.props.pageNo-1];
                              // console.log('currentFooterDescription', currentFooterDescription);

                              this.setState({ isLoading: false }, () => {
                                  this.props.form.setFieldsValue({
                                      footer_description: this.state.currentFooterDescription,
                                  }, () => { /*onsole.log('after')*/ });
                              });
                              
                          });
                      }

                  } else {
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyFooterDescriptionForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }catch(error){ 
                toastr.error('Something went wrong!, please refresh the page or try again later.');
                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyFooterDescriptionForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            }
        });
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
          // console.log('this.state.footerDescription', this.state.footerDescription);

          const footerDescriptionArr = this.state.footerDescription;
          // console.log('footerDescriptionArr', footerDescriptionArr);

          // console.log('pageNo', this.props.pageNo);
          // console.log('pageNo-1', this.props.pageNo-1);

          const footerDescriptionModified = this.state.survey.footer_description ? !this.state.survey.footer_description.includes('~') : true;
          // console.log(`footerDescriptionModified`, footerDescriptionModified);

          if(footerDescriptionModified) footerDescriptionArr[this.props.pageNo-1] = this.state.survey.footer_description;
          // console.log('after footerDescriptionArr', footerDescriptionArr);

          let modifiedFooterDescription = footerDescriptionArr.join('~');
          // console.log('modifiedFooterDescription', modifiedFooterDescription);
  
          let fields = [] as any;
              
          if(this.state.survey.multi_lang) fields = ['footer_description'];
          else fields = ['footer_description'];

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [modifiedFooterDescription]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyFooterDescriptionForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){ 
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyFooterDescriptionForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                  }
              }
          );

        }
      });
    };
  
    onTextAreaChange = (e: any) => {
      this.onFieldValueChange(e.target.id, e.target.value)
    };

    onRichChange = (id: any, richTextEditor: any) => {
        this.onFieldValueChange(id, richTextEditor.html.trim()); 
        this.props.form.setFieldsValue({
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        });
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

      this.setState(nextState, () => { /*console.log('after onFieldValueChange', this.state.survey);*/ });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      if (this.state.isLoading) {
        return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      return (
        <div>
          <Form.Item {...formItemLayout} >
              <RichTextEditor
                xSite={this.props.match.params.xSite}
                id={`footer_description`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.currentFooterDescription} 
                onChange={this.onRichChange}
                placeholder={'Please input the survey footer description...'}
              /> 
              {getFieldDecorator('footer_description', {
                rules: [
                  {
                    // required: true,
                    message: 'Please input the survey footer description',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Footer Description" />)}
              // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Footer Description" rows={5}/>)}
              })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)}
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
