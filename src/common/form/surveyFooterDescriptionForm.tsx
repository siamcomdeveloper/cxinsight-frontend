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
  footerDescriptionEN: any;
  currentFooterDescription: any;
  currentFooterDescriptionEN: any;
  fontColor: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        footerDescription: [],
        footerDescriptionEN: [],
        currentFooterDescription: [],
        currentFooterDescriptionEN: [],
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
                      const footerDescriptionEN = this.props.survey.footer_description_EN ? this.props.survey.footer_description_EN.includes('~') ? this.props.survey.footer_description_EN.split('~') : [this.props.survey.footer_description_EN] : [''];
                      // console.log('footerDescription', footerDescription);
                      // console.log('footerDescriptionEN', footerDescriptionEN);

                      //check if current page is more then set page footer description number on design page
                      // console.log('this.props.pageNo > footerDescription.length', this.props.pageNo > footerDescription.length);
                      if(this.props.pageNo > footerDescription.length){

                          //prepare a new array for footer description
                          const footerDescriptionArr = new Array(this.props.pageNo); 
                          const footerDescriptionArrEN = new Array(this.props.pageNo); 
                          for (let i = 0; i < this.props.pageNo; i++) { 
                            footerDescriptionArr[i] = ''; 
                            footerDescriptionArrEN[i] = ''; 
                          }
                          // console.log('after prepare footerDescriptionArr', footerDescriptionArr);
                          // console.log('after prepare footerDescriptionArrEN', footerDescriptionArrEN);

                          //transfers all set page footer description to new array
                          for (let i = 0; i < footerDescription.length; i++) { 
                            footerDescriptionArr[i] = footerDescription[i]; 
                            footerDescriptionArrEN[i] = footerDescriptionEN[i]; 
                          }
                          // console.log('after transfers footerDescriptionArr', footerDescriptionArr);
                          // console.log('after transfers footerDescriptionArrEN', footerDescriptionArrEN);

                          this.setState({
                              footerDescription: footerDescriptionArr,
                              footerDescriptionEN: footerDescriptionArrEN,
                              currentFooterDescription: footerDescriptionArr[this.props.pageNo-1],
                              currentFooterDescriptionEN: footerDescriptionArrEN[this.props.pageNo-1],
                              fontColor: colors
                          }, () => {
                              // console.log('if after this.state.footerDescription', this.state.footerDescription);
                              // console.log('if after this.state.footerDescriptionEN', this.state.footerDescriptionEN);

                              // const currentFooterDescription = this.state.footerDescription[this.props.pageNo-1];
                              // const currentFooterDescriptionEN = this.state.footerDescriptionEN[this.props.pageNo-1];
                              // console.log('currentFooterDescription', currentFooterDescription);
                              // console.log('currentFooterDescriptionEN', currentFooterDescriptionEN);

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
                              footerDescriptionEN: footerDescriptionEN,
                              currentFooterDescription: footerDescription[this.props.pageNo-1],
                              currentFooterDescriptionEN: footerDescriptionEN[this.props.pageNo-1],
                              fontColor: colors
                          }, () => {
                              // console.log('else after this.state.footerDescription', this.state.footerDescription);
                              // console.log('else after this.state.footerDescriptionEN', this.state.footerDescriptionEN);

                              // const currentFooterDescription = this.state.footerDescription[this.props.pageNo-1];
                              // const currentFooterDescriptionEN = this.state.footerDescriptionEN[this.props.pageNo-1];
                              // console.log('currentFooterDescription', currentFooterDescription);
                              // console.log('currentFooterDescriptionEN', currentFooterDescriptionEN);

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
          const footerDescriptionArrEN = this.state.footerDescriptionEN;
          // console.log('footerDescriptionArr', footerDescriptionArr);
          // console.log('footerDescriptionArrEN', footerDescriptionArrEN);

          // console.log('pageNo', this.props.pageNo);
          // console.log('pageNo-1', this.props.pageNo-1);

          const footerDescriptionModified = this.state.survey.footer_description ? !this.state.survey.footer_description.includes('~') : true;
          const footerDescriptionModifiedEN = this.state.survey.footer_description_EN ? !this.state.survey.footer_description_EN.includes('~') : true;

          // console.log(`footerDescriptionModified`, footerDescriptionModified);
          // console.log(`footerDescriptionModifiedEN`, footerDescriptionModifiedEN);

          if(footerDescriptionModified) footerDescriptionArr[this.props.pageNo-1] = this.state.survey.footer_description;
          if(footerDescriptionModifiedEN) footerDescriptionArrEN[this.props.pageNo-1] = this.state.survey.footer_description_EN;
          
          // console.log('after footerDescriptionArr', footerDescriptionArr);
          // console.log('after footerDescriptionArrEN', footerDescriptionArrEN);

          let modifiedFooterDescription = footerDescriptionArr.join('~');
          let modifiedFooterDescriptionEN = footerDescriptionArrEN.join('~');
          // console.log('modifiedFooterDescription', modifiedFooterDescription);
          // console.log('modifiedFooterDescriptionEN', modifiedFooterDescriptionEN);
  
          let fields = [] as any;
              
          fields = ['footer_description'];

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [modifiedFooterDescription, modifiedFooterDescriptionEN]), jwt).then(
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
