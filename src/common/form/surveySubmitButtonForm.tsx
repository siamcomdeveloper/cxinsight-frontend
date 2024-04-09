/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button, Spin } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import RichTextEditor from "../RichTextEditor";
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
import { History } from 'history';

const formItemLayout = {
    labelCol: { span: 24 },
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
  isLoading: boolean,
  survey: Surveys;
  fontColor: any;
  displayColorPicker: any;
  color: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      // console.log(this.props.survey);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        fontColor: [],
        displayColorPicker: false,
        color: {
          r: '241',
          g: '112',
          b: '19',
          a: '1',
        },
      }
    }

    componentDidMount() { 

      // console.log('CreateForm componentDidMount');

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
                              previous_text: this.props.survey.previous_text,
                              next_text: this.props.survey.next_text,
                              done_text: this.props.survey.done_text,
                            }, () => { /*console.log('after')*/ });

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
  
          let fields = [] as any;
              
          fields = ['previous_text', 'next_text', 'done_text', 'button_color_theme'];

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [this.state.survey.previous_text, this.state.survey.next_text, this.state.survey.done_text, this.state.survey.button_color_theme, this.state.survey.previous_text_EN, this.state.survey.next_text_EN, this.state.survey.done_text_EN]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveySubmitButtonForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      } 
                  }catch(error){ 
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveySubmitButtonForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
      this.onFieldValueChange(id, richTextEditor.html.trim()); 
        this.props.form.setFieldsValue({
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        });
  };

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

    handleClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color: any) => {
        // console.log('handleChange color', color);
        // console.log('handleChange color.hex', color.hex);
        this.setState({ 
          color: color.rgb,
          survey: { 
            ...this.state.survey,
            [`button_color_theme`]: color.hex 
          }
        })
    };

    render() {
      const { getFieldDecorator } = this.props.form;

      const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
            backgroundColor: this.state.survey.button_color_theme
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          // popover: {
          //   position: 'absolute',
          //   zIndex: 2,
          // },
          // cover: {
          //   position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px',
          // },
        },
      });
      
      if (this.state.isLoading) {
        return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      
      return (
        <div className="design-question-modal">
          <Form.Item>
            <label className="sm-label" style={{ marginBottom: '0' }}>Button Color Theme:</label>
            <div style={{ display: 'inline-block', marginLeft: '20px', lineHeight: 0, bottom: '-3px', position: 'absolute' }}>
              <div style={ styles.swatch } onClick={ this.handleClick }>
                <div style={ styles.color } />
              </div>

              { this.state.displayColorPicker ? 
              // <div style={ styles.popover }>
              <div style={{ position: 'absolute', zIndex: 2 }}>
                <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }} onClick={ this.handleClose }></div>
                <SketchPicker color={ this.state.survey.button_color_theme } onChange={ this.handleChange } />
              </div> 
            : null }
            </div>
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
