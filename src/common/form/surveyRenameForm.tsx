/* eslint-disable import/first */
import * as React from "react";
import { Form, Input, Button, Spin } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import RichTextEditor from "../RichTextEditor";
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
  isLoading: boolean;
  survey: Surveys;
  fontColor: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        fontColor: []
      }
      // this.onRichChange = this.onRichChange.bind(this);
      this.onFieldValueChange = this.onFieldValueChange.bind(this);
    }

    componentDidMount() { 

      // console.log('CreateForm componentDidMount props', this.props);

      const jwt = getJwtToken();
        
      BaseService.getJSON(this.props.match.params.xSite, "/color", '', jwt).then(
          (rp) => {
              try{
                  if (rp.Status) {
                      // const colors = rp.Data.result.recordset;
                      const colors = rp.Data.result.recordset.map((colorData: any) => {return colorData.hex_code;});
                      // console.log('colors', colors);
                      
                      this.setState({
                          fontColor: colors
                      }, () => {
                          this.setState({ isLoading: false }, () =>{ 

                            this.props.form.setFieldsValue({
                              name: this.props.survey.name,
                              name_html: this.props.survey.name_html ? this.props.survey.name_html : `<p>${this.props.survey.name}</p>`,
                            }, () => { /*console.log('after')*/} );

                          });
                      });
                      
                    } else {
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                  }
              }catch(error){
                  toastr.error('Something went wrong!, please refresh the page or try again later.'); 
                  BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
              }
          }
      );

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
  
          let fields = [] as any;
            
          if(this.state.survey.multi_lang) fields = ['name', 'name_html'];
          else fields = ['name', 'name_html'];

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [this.state.survey.name, this.state.survey.name_html]), jwt).then(
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

    onRichChange = (id: any, richTextEditor: any) => {

        // console.log(`onRichChange id`, id);
        // console.log(`onRichChange id_html`, id+'_html');
        // console.log(`onRichChange richTextEditor`, richTextEditor);
        // console.log(`onRichChange richTextEditor.text`, richTextEditor.text);
        // console.log(`onRichChange richTextEditor.text.trim()`, richTextEditor.text.trim());
        this.onFieldValueChange(id, richTextEditor.text.trim()); 
        this.props.form.setFieldsValue({
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.text.trim(),
            [`${id}_html`]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        }, () => {
          this.onFieldValueChange(`${id}_html`, richTextEditor.html.trim()); 
        });

        // this.props.form.setFieldsValue({
            
        // });
    };

    // onFieldValueChange = (fieldName: string, value: any) => {
    //     this.setState({...this.state, [fieldName]: value}, () => {
    //       console.log(`this.state.survey`, this.state);
    //     });
    // }
  
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
      
      if (this.state.isLoading) {
        return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      return (
        <div>
          
          <div>
            <Form.Item {...formItemLayout} >
              <RichTextEditor
                xSite={this.props.match.params.xSite}
                id={`name`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.props.survey.name_html ? this.props.survey.name_html : `<p>${this.props.survey.name}</p>`} 
                onChange={this.onRichChange}
                placeholder={'Please input the survey name'}
              />
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the survey name',
                  },
                ],
              })(<Input style={{ display: 'none' }} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey name"*/ />)}
            </Form.Item>

            <Form.Item {...formItemLayout} style={{ display: 'none' }}>
              {getFieldDecorator('name_html', {
                rules: [
                  {
                    message: 'Please input the survey name',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey name" />)}
              })(<Input style={{ display: 'none' }} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey name"*/ />)}
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
