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
import { History } from 'history';
// import { Editor } from "@tinymce/tinymce-react";
// // import Editor from '../Editor';

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
  headerDescription: any;
  headerDescriptionEN: any;
  currentHeaderDescription: any;
  currentHeaderDescriptionEN: any;
  fontColor: any;
  // firstTime: any;
  // hideToolbar: any;
  // value: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        headerDescription: [],
        headerDescriptionEN: [],
        currentHeaderDescription: '',
        currentHeaderDescriptionEN: '',
        fontColor: [],
        // firstTime: true,
        // hideToolbar: true,
        // value: '<h1>react-quill and quill with react 16.2</h1><p>Type or copy & paste text here</p>'
      }

      // this.handleOnChange = this.handleOnChange.bind(this);
      // this.handleBlur = this.handleBlur.bind(this);
      // this.handleFocus = this.handleFocus.bind(this);
    }

    // handleEditorChange = (content: any, editor: any) => {
    //   console.log('Content was updated:', content);
    // }

    componentDidMount() { 
        // console.log('SurveyHeaderDescriptionForm componentDidMount pageNo', this.props.pageNo);

        const jwt = getJwtToken();
        
        BaseService.getJSON(this.props.match.params.xSite, "/color", '', jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // const colors = rp.Data.result.recordset;
                        const colors = rp.Data.result.recordset.map((colorData: any) => {return colorData.hex_code;});
                        // console.log('colors', colors);

                        const headerDescription = this.props.survey.header_description ? this.props.survey.header_description.includes('~') ? this.props.survey.header_description.split('~') : [this.props.survey.header_description] : [''];
                        const headerDescriptionEN = this.props.survey.header_description_EN ? this.props.survey.header_description_EN.includes('~') ? this.props.survey.header_description_EN.split('~') : [this.props.survey.header_description_EN] : [''];
                        // console.log('headerDescription', headerDescription);
                        // console.log('headerDescriptionEN', headerDescriptionEN);

                        //check if current page No. is more than header description number on design page
                        // console.log('this.props.pageNo > headerDescription.length', this.props.pageNo > headerDescription.length);
                        if(this.props.pageNo > headerDescription.length){

                            //prepare a new array for header description
                            const headerDescriptionArr = new Array(this.props.pageNo); 
                            const headerDescriptionArrEN = new Array(this.props.pageNo); 

                            for (let i = 0; i < this.props.pageNo; i++) { 
                              headerDescriptionArr[i] = ''; 
                              headerDescriptionArrEN[i] = '';
                            }
                            // console.log('after prepare headerDescriptionArr', headerDescriptionArr);
                            // console.log('after prepare headerDescriptionArrEN', headerDescriptionArrEN);

                            //transfers all set page header description to new array
                            for (let i = 0; i < headerDescription.length; i++) { 
                              headerDescriptionArr[i] = headerDescription[i]; 
                              headerDescriptionArrEN[i] = headerDescriptionEN[i];
                            }
                            // console.log('after transfers headerDescriptionArr', headerDescriptionArr);
                            // console.log('after transfers headerDescriptionArrEN', headerDescriptionArrEN);

                            this.setState({
                                headerDescription: headerDescriptionArr,
                                headerDescriptionEN: headerDescriptionArrEN,
                                currentHeaderDescription: headerDescriptionArr[this.props.pageNo-1],
                                currentHeaderDescriptionEN: headerDescriptionEN[this.props.pageNo-1],
                                fontColor: colors
                            }, () => {
                                // console.log('if after this.state.headerDescription', this.state.headerDescription);
                                // console.log('if after this.state.headerDescriptionEN', this.state.headerDescriptionEN);

                                // const currentHeaderDescription = this.state.headerDescription[this.props.pageNo-1];
                                // const currentHeaderDescriptionEN = this.state.headerDescriptionEN[this.props.pageNo-1];
                                // console.log('currentHeaderDescription', currentHeaderDescription);
                                // console.log('currentHeaderDescriptionEN', currentHeaderDescriptionEN);

                                // this.setState({
                                //     currentHeaderDescription: currentHeaderDescription,
                                //     currentHeaderDescriptionEN: currentHeaderDescriptionEN,
                                // }, () => {
                                    // console.log('this.state.currentHeaderDescription', this.state.currentHeaderDescription);
                                    // console.log('this.state.currentHeaderDescriptionEN', this.state.currentHeaderDescriptionEN);
                                    this.setState({ isLoading: false }, () => {
                                        this.props.form.setFieldsValue({
                                            header_description: this.state.currentHeaderDescription,
                                        });
                                        if(this.state.survey.multi_lang) {
                                            this.props.form.setFieldsValue({
                                                header_description_EN: this.state.currentHeaderDescriptionEN,
                                            });
                                        }
                                    });
                                });

                            // });
                        } else{
                            this.setState({
                                headerDescription: headerDescription,
                                headerDescriptionEN: headerDescriptionEN,
                                currentHeaderDescription: headerDescription[this.props.pageNo-1],
                                currentHeaderDescriptionEN: headerDescriptionEN[this.props.pageNo-1],
                                fontColor: colors
                            }, () => {
                                // console.log('else after this.state.headerDescription', this.state.headerDescription);
                                // console.log('else after this.state.headerDescriptionEN', this.state.headerDescriptionEN);

                                // const currentHeaderDescription = headerDescription[this.props.pageNo-1];
                                // const currentHeaderDescriptionEN = headerDescriptionEN[this.props.pageNo-1];
                                // console.log('currentHeaderDescription', currentHeaderDescription);
                                // console.log('currentHeaderDescriptionEN', currentHeaderDescriptionEN);
                                
                                // this.setState({
                                //     currentHeaderDescription: currentHeaderDescription,
                                //     currentHeaderDescriptionEN: currentHeaderDescriptionEN,
                                // }, () => {
                                    // console.log('this.state.currentHeaderDescription', this.state.currentHeaderDescription);
                                    // console.log('this.state.currentHeaderDescriptionEN', this.state.currentHeaderDescriptionEN);
                                    this.setState({ isLoading: false }, () => {
                                        this.props.form.setFieldsValue({
                                            header_description: this.state.currentHeaderDescription,
                                        });
                                        if(this.state.survey.multi_lang) {
                                            this.props.form.setFieldsValue({
                                                header_description_EN: this.state.currentHeaderDescriptionEN,
                                            });
                                        }
                                    });

                                });
                            // });
                        }
                        
                    } else {
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyHeaderDescriptionForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyHeaderDescriptionForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
        try{
          if (!err) {
            // console.log('check', this.state.survey);
            const headerDescriptionArr = this.state.headerDescription;
            const headerDescriptionArrEN = this.state.headerDescriptionEN;
            // console.log('headerDescriptionArr', headerDescriptionArr);
            // console.log('headerDescriptionArrEN', headerDescriptionArrEN);

            // console.log('pageNo', this.props.pageNo);
            // console.log('pageNo-1', this.props.pageNo-1);

            // console.log('this.state.survey.header_description', this.state.survey.header_description);
            // console.log('this.state.survey.header_description_EN', this.state.survey.header_description_EN);

            // console.log(`this.state.survey.header_description.includes('~')`, this.state.survey.header_description ? this.state.survey.header_description.includes('~') : false);
            // console.log(`this.state.survey.header_description_EN.includes('~')`, this.state.survey.header_description_EN ? this.state.survey.header_description_EN.includes('~') : false);
            
            const headerDescriptionModified = this.state.survey.header_description ? !this.state.survey.header_description.includes('~') : true;
            const headerDescriptionModifiedEN = this.state.survey.header_description_EN ? !this.state.survey.header_description_EN.includes('~') : true;

            // console.log(`headerDescriptionModified`, headerDescriptionModified);
            // console.log(`headerDescriptionModifiedEN`, headerDescriptionModifiedEN);

            if(headerDescriptionModified) headerDescriptionArr[this.props.pageNo-1] = this.state.survey.header_description;
            if(headerDescriptionModifiedEN) headerDescriptionArrEN[this.props.pageNo-1] = this.state.survey.header_description_EN;

            // console.log('after headerDescriptionArr', headerDescriptionArr);
            // console.log('after headerDescriptionArrEN', headerDescriptionArrEN);

            let modifiedHeaderDescription = headerDescriptionArr.join('~');
            let modifiedHeaderDescriptionEN = headerDescriptionArrEN.join('~');
            // console.log('modifiedHeaderDescription', modifiedHeaderDescription);
            // console.log('modifiedHeaderDescriptionEN', modifiedHeaderDescriptionEN);

            let fields = [] as any;
                
            if(this.state.survey.multi_lang) fields = ['header_description', 'header_description_EN'];
            else fields = ['header_description'];

            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [modifiedHeaderDescription, modifiedHeaderDescriptionEN]), jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log(rp);
                            toastr.success(rp.Messages);
                            setTimeout(function(){ window.location.reload(); }, 500);
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyHeaderDescriptionForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyHeaderDescriptionForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );

          }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyHeaderDescriptionForm check catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

      });
    };
  
    onTextAreaChange = (e: any) => {
      this.onFieldValueChange(e.target.id, e.target.value)
    };
    
    // onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    //   this.onFieldValueChange(e.target.id, e.target.value)
    // }

    onRichChange = (id: any, richTextEditor: any) => {
      // console.log('onRichChangeid', id);
      // console.log('onRichChange', richTextEditor);
      // console.log('onRichChange', richTextEditor.text);
      // console.log('onRichChange', richTextEditor.html);
      // console.log('onRichChange', richTextEditor.html);
      // console.log('onRichChange', richTextEditor.length);
      
      // setTimeout(function(this: any){ 
        // this.onFieldValueChange('header_description', richTextEditor.text); 
        this.onFieldValueChange(id, richTextEditor.html); 
        this.props.form.setFieldsValue({
            // header_description: richTextEditor.text
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.html
        });
        // this.setState({ firstTime: false });
      // }.bind(this), 1);
      // this.onFieldValueChange('header_description', e.target.value);
      // this.onFieldValueChange('header_description', e)
    };

    // onCheckFirstTime = () => {
    //   console.log('onCheckFirstTime', this.state.firstTime);
    //   if(this.state.firstTime) {
    //       this.setState({
    //         firstTime: false
    //     }, () => {
    //       return true;
    //     });
    //   }
    //   else{
    //     return false;
    //   }
    // };

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

    // handleOnChange = (value: any) => {
    //   this.setState({ value });
    // }
    
    // handleBlur = () => {
    //   console.log('blur')
    //   this.setState({hideToolbar: true})
    // }
    
    // handleFocus = () => {
    //   console.log('focus')
    //   this.setState({hideToolbar: false})
    // }

    render() {
      const { getFieldDecorator } = this.props.form;
      // console.log('render');
      if (this.state.isLoading) {
        return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      return (
        <div>
          { this.state.survey.multi_lang ? 
          <div className="languages-setting-form-container">
            {/* <Editor
              placeholder={'Write something...'}
              value={this.state.value}
              hideToolbar={this.state.hideToolbar}
              onChange={this.handleOnChange}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
            /> */}
            
            <Form.Item label="TH" {...formItemLayout} >
              {/* <Editor
                apiKey="ha75ta6ghg451m3lwxk7qda75xkmiibqt04pjk6rbnxdlczt"
                initialValue="<p>This is the initial content of the editor</p>"
                init={{
                  height: 200,
                  menubar: true,
                  // plugins: [
                  //   'advlist autolink lists link image charmap print preview anchor',
                  //   'searchreplace visualblocks code fullscreen',
                  //   'insertdatetime media table paste code help wordcount'
                  // ],
                  plugins: [],
                  // font_formats:
                  //   "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                  // content_style:
                  //   "@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');",
                  toolbar:
                    '| bold italic underline | forecolor backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    removeformat '
                  // toolbar:
                  //   'undo redo | fontformats fontsizes formatselect | bold italic underline | forecolor backcolor | \
                  //   alignleft aligncenter alignright alignjustify | \
                  //   removeformat'
                  // toolbar:
                  //   'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat'
                }}
                onEditorChange={this.handleEditorChange}
              /> */}
              <RichTextEditor
                xSite={this.props.match.params.xSite}
                id={`header_description`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.currentHeaderDescription} 
                onChange={this.onRichChange}
                placeholder={'Please input the survey header description...'}
                // hideToolbar={this.state.hideToolbar}
                // onBlur={this.handleBlur}
                // onFocus={this.handleFocus}
              /> 
              {getFieldDecorator('header_description', {
                rules: [
                  {
                    // required: true,
                    message: 'Please input the survey header description',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Header Description" />)}
            })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/*onChange={this.onTextAreaChange} placeholder="Survey Header Description" rows={5}*//>)}
            </Form.Item>

            <Form.Item label="EN" {...formItemLayout} >
              <RichTextEditor
                xSite={this.props.match.params.xSite}
                id={`header_description_EN`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.currentHeaderDescriptionEN} 
                onChange={this.onRichChange}
                placeholder={'Please input the survey header description...'}
                // hideToolbar={this.state.hideToolbar}
                // onBlur={this.handleBlur}
                // onFocus={this.handleFocus}
              /> 
              {getFieldDecorator('header_description_EN', {
                rules: [
                  {
                    // required: true,
                    message: 'Please input the survey header description',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Header Description" />)}
            // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Header Description" rows={5}/>)}
            })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)}
            </Form.Item>
          </div>
          :
          <Form.Item {...formItemLayout} >
              <RichTextEditor
                xSite={this.props.match.params.xSite}
                id={`header_description`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.currentHeaderDescription}
                onChange={this.onRichChange}
                placeholder={'Please input the survey header description...'}
                // hideToolbar={this.state.hideToolbar}
                // onBlur={this.handleBlur}
                // onFocus={this.handleFocus}
              /> 
              {getFieldDecorator('header_description', {
                rules: [
                  {
                    // required: true,
                    message: 'Please input the survey header description',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Header Description" />)}
            // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Header Description" rows={5}/>)}
            })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)}
          </Form.Item>
          }

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
