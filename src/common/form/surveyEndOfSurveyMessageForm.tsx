/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button, Spin, Upload, Radio, Icon } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";
import TextArea from "antd/lib/input/TextArea";
import RichTextEditor from '../RichTextEditor';

import { RadioChangeEvent } from 'antd/lib/radio';
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
  loadingImage: boolean;
  loadingBanner: boolean;
  imageUrl: string;
  bannerUrl: string;
  end_of_survey_image_src: any;
  end_of_survey_banner_src: any;
  end_of_survey_image_width: any;
  radioSrcValue: any;
  radioLogoAlignment: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        fontColor: [],
        loadingImage: false,
        loadingBanner: false,
        imageUrl: '',
        bannerUrl: '',
        end_of_survey_image_src: this.props.survey.end_of_survey_image_src,
        end_of_survey_banner_src: this.props.survey.end_of_survey_banner_src,
        end_of_survey_image_width: this.props.survey.end_of_survey_image_width,
        radioSrcValue: this.props.survey.end_of_survey_enable_src_type,
        radioLogoAlignment: this.props.survey.end_of_survey_logo_alignment === null ? 0 : this.props.survey.end_of_survey_logo_alignment
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
                          this.setState({ isLoading: false }, () => {
                              this.props.form.setFieldsValue({
                                  end_of_survey_message: this.state.survey.end_of_survey_message,
                                  end_of_survey_image_src: this.state.survey.end_of_surveyimage_src,
                                  end_of_survey_banner_src: this.state.survey.end_of_surveybanner_src,
                                  end_of_survey_image_width: this.state.survey.end_of_survey_image_width,
                              }, () => { /*console.log('after')*/ });
        
                              if(this.state.survey.multi_lang) {
                                  this.props.form.setFieldsValue({
                                      end_of_survey_message_EN: this.state.survey.end_of_survey_message_EN,
                                  }, () => { /*console.log('after')*/ });
                              }

                          });
                      });

                    } else {
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyEndOfSurveyMessageForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                  }
              }catch(error){ 
                  toastr.error('Something went wrong!, please refresh the page or try again later.');
                  BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyEndOfSurveyMessageForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
              }
          }
      );

    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    // }

    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    
    beforeUpload = (file: any) => {
      // console.log('file', file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            // message.error('You can only upload JPG/PNG file!');
            toastr.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   message.error('Image must smaller than 2MB!');
        // }
        // return isJpgOrPng && isLt2M;
    }

    handleLogoChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingImage: true });
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (imageUrl: any) =>
                this.setState({
                    imageUrl: imageUrl,
                    loadingImage: false,
                }, () => { /*console.log('imageUrl', imageUrl)*/ }),
            );
            // message.success(`${info.file.name} file uploaded successfully`);
            toastr.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // message.error(`${info.file.name} file upload failed.`);
            toastr.error(`${info.file.name} file upload failed.`);
        }

    };

    handleBannerChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingBanner: true });
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (bannerUrl: any) =>
                this.setState({
                    bannerUrl: bannerUrl,
                    loadingBanner: false,
                }, () => { /*console.log('bannerUrl', bannerUrl)*/ }),
            );
            // message.success(`${info.file.name} file uploaded successfully`);
            toastr.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // message.error(`${info.file.name} file upload failed.`);
            toastr.error(`${info.file.name} file upload failed.`);
        }

    };
    
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
              
          

          if(this.state.survey.multi_lang){
            fields = ['end_of_survey_enable_src_type', 'end_of_survey_logo_alignment', 'end_of_survey_image_src', 'end_of_survey_banner_src', 'end_of_survey_image_width', 'end_of_survey_message', 'end_of_survey_message_EN'];
          }
          else{
            fields = ['end_of_survey_enable_src_type', 'end_of_survey_logo_alignment', 'end_of_survey_image_src', 'end_of_survey_banner_src', 'end_of_survey_image_width', 'end_of_survey_message'];
          }

          const jwt = getJwtToken();

          // const imgSrc = this.state.radioSrcValue === 1 ? this.state.end_of_survey_image_src : this.state.end_of_survey_banner_src;
          const imgSrcImageVal = this.state.radioSrcValue === 1 ? 1 : 2;
          // const imgColumn = this.state.radioSrcValue === 1 ? 'end_of_survey_image_src': 'end_of_survey_banner_src';

          // console.log('imgSrc', imgSrc);
          // console.log('imgVal', imgVal);
          // console.log('imgColumn', imgColumn);
          // console.log('this.state.radioLogoAlignment', this.state.radioLogoAlignment);
          
          BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [imgSrcImageVal, this.state.radioLogoAlignment, this.state.end_of_survey_image_src, this.state.end_of_survey_banner_src, this.state.survey.end_of_survey_image_width, this.state.survey.end_of_survey_message, this.state.survey.end_of_survey_message_EN]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyEndOfSurveyMessageForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyEndOfSurveyMessageForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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

      this.setState(nextState);
    // console.log('Create onFieldValueChange', this.state.survey);
    }

    onRadioSrcTypeChange = (e: RadioChangeEvent) => {
        // console.log('onRadioSrcTypeChange', e.target.value);
        this.setState({
            radioSrcValue: parseInt(e.target.value),
        });

        // const jwt = getJwtToken();
        // BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['send'], [parseInt(e.target.value)]), jwt).then(
        //     (rp) => {
        //         try{
        //             if (rp.Status) {
        //                 toastr.success('Send Updated!');
        //                 // props.history.goBack();
        //                 // this.setState({ collectorStatus: statusName });
        //             } else {
        //                 toastr.error(rp.Messages);
        //                 console.log("Messages: " + rp.Messages);
        //                 console.log("Exception: " + rp.Exception);
        //             }
        //         }catch(error){ console.log("Exception: " + error); }
        //     }
        // );
    };

    onRadioLogoAlignmentChange = (e: RadioChangeEvent) => {
        // console.log('onRadioLogoAlignmentChange', e.target.value);
        this.setState({
            radioLogoAlignment: parseInt(e.target.value),
        });
    };

    customRequestLogo = (componentsData: any) => {
        // console.log('customRequestLogo componentsData', componentsData);
        let formData = new FormData();
        formData.append('file', componentsData.file);
        formData.append('domain', 'POST');
        formData.append('filename', componentsData.file.name );

        fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getJwtToken() as string}`,
                'x-site' : this.props.match.params.xSite as string
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => { 
          // console.log('data', data); 
          // console.log('data.url', data.url); 

            this.setState({
              end_of_survey_image_src: data.url,
            }, () => { 
              // console.log('this.state.image_src', this.state.image_src) 
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyEndOfSurveyMessageForm customRequestLogo fetch ${process.env.REACT_APP_BASE_URL}/upload catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading logo image")
        })      
    }

    customRequestBanner = (componentsData: any) => {
        // console.log('customRequestBanner componentsData', componentsData);
        let formData = new FormData();
        formData.append('file', componentsData.file);
        formData.append('domain', 'POST');
        formData.append('filename', componentsData.file.name );

        fetch(`${process.env.REACT_APP_BASE_URL}/upload/logo-banner`, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getJwtToken() as string}`,
                'x-site' : this.props.match.params.xSite as string
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => { 
          // console.log('data', data); 
          // console.log('data.url', data.url); 

            this.setState({
              end_of_survey_banner_src: data.url,
            }, () => { 
              // console.log('this.state.banner_src', this.state.banner_src) 
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyEndOfSurveyMessageForm customRequestBanner fetch ${process.env.REACT_APP_BASE_URL}/upload/logo-banner catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading banner image")
        })      
    }
    
    render() {

      const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
      };

      const uploadButton = (
        <div>
          <Icon type={this.state.loadingImage ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      const { getFieldDecorator } = this.props.form;

      if (this.state.isLoading) {
        return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      return (
        <div style={{ backgroundColor: '#edeeee' }}>

          <Radio.Group style={{ display: 'block', borderBottom: '1px solid lightgray' }} onChange={this.onRadioSrcTypeChange} value={this.state.radioSrcValue}>
              <Radio style={radioStyle} value={1}>
                  Logo
              </Radio>
              { this.state.radioSrcValue === 1 ? 
                  <div>
                    <span style={{ display: 'inline', color: 'black', paddingLeft: '25px' }}>Alignment : </span>
                    <Radio.Group style={{ paddingBottom: 0 }} onChange={this.onRadioLogoAlignmentChange} value={this.state.radioLogoAlignment}>
                      <Radio value={0}>Left </Radio>
                      <Radio value={1}>Center</Radio>
                      <Radio value={2}>Right</Radio>
                    </Radio.Group>

                    <Form.Item label="Image width :" className="end-of-survey-image-width-form" >
                      {getFieldDecorator('end_of_survey_image_width', {
                        initialValue: this.state.survey.end_of_survey_image_width ? parseInt(this.state.survey.end_of_survey_image_width) : 200,
                        rules: [
                          {
                            required: true,
                            message: 'Please input the width of image as a number',
                          },
                        ],
                      })(<Input type="number" className="wds-input wds-input--md wds-input--stretched" onChange={this.onTextAreaChange} placeholder="width"/>)}
                      <span> px </span>
                      {/* })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Footer Description" rows={5}/>)}
                      })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)} */}
                    </Form.Item>
                    

                    <Upload 
                      // {...props}
                      customRequest={this.customRequestLogo}
                      name="logo"
                      listType="picture-card"
                      className="logo-uploader"
                      showUploadList={false}
                      // action="http://localhost:3000/upload"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleLogoChange}
                    >
                      {this.state.survey.end_of_survey_image_src || this.state.imageUrl ? <img src={this.state.imageUrl ? this.state.imageUrl : this.state.survey.end_of_survey_image_src } alt="logo" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                  </div>
                  
                  : null }
                  
              <Radio style={radioStyle} value={2}>
                  Banner
              </Radio>
              { this.state.radioSrcValue === 2 ? 
                  
                  <Upload 
                    // {...props}
                    customRequest={this.customRequestBanner}
                    name="banner"
                    listType="picture-card"
                    className="banner-uploader"
                    showUploadList={false}
                    // action="http://localhost:3000/upload"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleBannerChange}
                  >
                    {this.state.survey.end_of_survey_banner_src || this.state.bannerUrl ? <img src={this.state.bannerUrl ? this.state.bannerUrl : this.state.survey.end_of_survey_banner_src } alt="banner" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                  
                : null }
          </Radio.Group>

          { this.state.survey.multi_lang ? 
          <div className="languages-setting-form-container">
            <Form.Item label="TH" {...formItemLayout} style={{ marginTop: '15px' }}>
              <RichTextEditor 
                xSite={this.props.match.params.xSite}
                id={`end_of_survey_message`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.survey.end_of_survey_message} 
                onChange={this.onRichChange}
                placeholder={'Please input the end of survey message...'}
              /> 
              {getFieldDecorator('end_of_survey_message', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the end of survey message',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Footer Description" />)}
              // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Footer Description" rows={5}/>)}
              })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)}
            </Form.Item>

            <Form.Item label="EN" {...formItemLayout} >
              <RichTextEditor 
                xSite={this.props.match.params.xSite}
                id={`end_of_survey_message_EN`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.survey.end_of_survey_message_EN} 
                onChange={this.onRichChange}
                placeholder={'Please input the end of survey message...'}
              /> 
              {getFieldDecorator('end_of_survey_message_EN', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the end of survey message',
                  },
                ],
              // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Footer Description" />)}
              // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Footer Description" rows={5}/>)}
              })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" style={{ display: 'none' }}/>)}
            </Form.Item>
          </div>
          :
          <Form.Item {...formItemLayout} style={{ marginTop: '15px' }}>
            <RichTextEditor 
                xSite={this.props.match.params.xSite}
                id={`end_of_survey_message`}
                theme={`snow`}
                fontColor={this.state.fontColor}
                defaultValue={this.state.survey.end_of_survey_message} 
                onChange={this.onRichChange}
                placeholder={'Please input the end of survey message...'}
            /> 
            {getFieldDecorator('end_of_survey_message', {
              rules: [
                {
                  required: true,
                  message: 'Please input the end of survey message',
                },
              ],
            // })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey Footer Description" />)}
            // })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey Footer Description" rows={5}/>)}
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
