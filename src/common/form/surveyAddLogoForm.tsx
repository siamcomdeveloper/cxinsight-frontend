/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button, Upload, Icon, message, Radio } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../models/surveys";

import { RadioChangeEvent } from 'antd/lib/radio';
import { History } from 'history';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
    survey: Surveys;
    handleSaveQuestion: () => void;
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
    loadingImage: boolean;
    loadingBanner: boolean;
    imageUrl: string;
    bannerUrl: string;
    image_src: any;
    banner_src: any;
    radioSrcValue: any;
    radioLogoAlignment: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
        super(props);

        this.state = {
          survey: this.props.survey,
          loadingImage: false,
          loadingBanner: false,
          imageUrl: '',
          bannerUrl: '',
          image_src: this.props.survey.image_src,
          banner_src: this.props.survey.banner_src,
          radioSrcValue: this.props.survey.enable_src_type,
          radioLogoAlignment: this.props.survey.logo_alignment === null ? 0 : this.props.survey.logo_alignment
        }
    }

    componentDidMount() { 

      // console.log('CreateForm componentDidMount');

        this.props.form.setFieldsValue({
          image_src: this.props.survey.image_src,
        }, () => { /*console.log('after image_src')*/ } ); 

        this.props.form.setFieldsValue({
          banner_src: this.props.survey.banner_src,
        }, () => { /*console.log('after banner_src')*/ } );

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
                // console.log('check', this.selectUpdate(this.state.survey, ['name'], [this.state.survey.name]));
        
                const jwt = getJwtToken();

                const imgSrc = this.state.radioSrcValue === 1 ? this.state.image_src : this.state.banner_src;
                const imgVal = this.state.radioSrcValue === 1 ? 1 : 2;
                const imgColumn = this.state.radioSrcValue === 1 ? 'image_src': 'banner_src';

                // console.log('imgSrc', imgSrc);
                // console.log('imgVal', imgVal);
                // console.log('imgColumn', imgColumn);
                // console.log('this.state.radioLogoAlignment', this.state.radioLogoAlignment);
                BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, [imgColumn, 'enable_src_type', 'logo_alignment', 'image_width'], [imgSrc, imgVal, this.state.radioLogoAlignment, this.state.survey.image_width]), jwt).then(
                    (rp) => {
                        if (rp.Status) {
                            // console.log(rp);
                            toastr.success(rp.Messages);
                            this.props.handleSaveQuestion();
                            // setInterval(function(){ window.location.reload(); }, 500);
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `summaryAddLogoForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
                
                // if(this.state.radioSrcValue === 1){
                //   BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['image_src', 'enable_src_type', 'logo_alignment'], [this.state.image_src, 1, this.state.radioLogoAlignment]), jwt).then(
                //       (rp) => {
                //           if (rp.Status) {
                //               // console.log(rp);
                //               toastr.success(rp.Messages);
                //               this.props.handleSaveQuestion();
                //               // setInterval(function(){ window.location.reload(); }, 500);
                //           } else {
                //               toastr.error(rp.Messages);
                //               console.log("Messages: " + rp.Messages);
                //               console.log("Exception: " + rp.Exception);
                //           }
                //       }
                //   );
                // }
                // else{
                //   BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['banner_src', 'enable_src_type', 'logo_alignment'], [this.state.banner_src, 2, this.state.radioLogoAlignment]), jwt).then(
                //       (rp) => {
                //           if (rp.Status) {
                //               // console.log(rp);
                //               toastr.success(rp.Messages);
                //               this.props.handleSaveQuestion();
                //               // setInterval(function(){ window.location.reload(); }, 500);
                //           } else {
                //               toastr.error(rp.Messages);
                //               console.log("Messages: " + rp.Messages);
                //               console.log("Exception: " + rp.Exception);
                //           }
                //       }
                //   );
                // }

            }
        });
    };
  
    onTextAreaChange = (e: any) => {
      this.onFieldValueChange(e.target.id, e.target.value)
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
                image_src: data.url,
            }, () => { 
              // console.log('this.state.image_src', this.state.image_src) 
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `summaryAddLogoForm customRequestLogo fetch ${process.env.REACT_APP_BASE_URL}/upload/logo-banner catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                banner_src: data.url,
            }, () => { 
              // console.log('this.state.banner_src', this.state.banner_src) 
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `surveyAddLogoForm customRequestBanner fetch ${process.env.REACT_APP_BASE_URL}/upload/logo-banner catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading banner image")
        })      
    }

    render() {
        const { getFieldDecorator } = this.props.form;

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

        return (
            <div>
              {/* <Form.Item {...formItemLayout} >
                {getFieldDecorator('image_src', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input the logo url',
                    },
                  ],
                })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Logo URL" />)}
              </Form.Item> */}

              <Radio.Group onChange={this.onRadioSrcTypeChange} value={this.state.radioSrcValue}>
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

                        <Form.Item label="Image width :" className="survey-image-width-form" >
                          {getFieldDecorator('image_width', {
                            initialValue: this.state.survey.image_width ? parseInt(this.state.survey.image_width) : 200,
                            rules: [
                              {
                                required: true,
                                message: 'Please input the width of image as a number',
                              },
                            ],
                          })(<Input type="number" className="wds-input wds-input--md wds-input--stretched" onChange={this.onTextAreaChange} placeholder="width"/>)}
                          <span> px </span>
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
                          {this.state.survey.image_src || this.state.imageUrl ? <img src={this.state.imageUrl ? this.state.imageUrl : this.state.survey.image_src } alt="logo" style={{ width: '100%' }} /> : uploadButton}
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
                        {this.state.survey.banner_src || this.state.bannerUrl ? <img src={this.state.bannerUrl ? this.state.bannerUrl : this.state.survey.banner_src } alt="banner" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                      
                    : null }
              </Radio.Group>

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
