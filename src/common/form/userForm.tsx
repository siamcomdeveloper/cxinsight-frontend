import * as React from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Card, Row, Col, Checkbox, Button, AutoComplete, Spin, Radio, Switch} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import * as toastr from 'toastr';
import jwt from 'jsonwebtoken';
import { getJwtToken } from '../../helper/jwt.helper';
import CheckboxGroup from "antd/lib/checkbox/Group";
import RadioGroup from "antd/lib/radio/group";
import { RadioChangeEvent } from "antd/lib/radio";
import { History } from 'history';
const { Option } = Select;

interface IProps extends FormComponentProps{
    handleHistoryPush: (url: any) => void;
    userData: any;
    surveys: any;
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
    confirmDirty: boolean,
    isLoading: boolean,
    selectedRoleOptions: any,
    // actionProjectOptions: any,
    // selectedProjectOptions: any,
    actionSurveyOptions: any,
    // selectedSurveyOptions: any,
}

class UserForm extends React.Component<IProps, IState, any> {

    constructor(props: IProps & FormComponentProps) {
        super(props);

        this.state = {
            confirmDirty: false,
            isLoading: false,
            selectedRoleOptions: '',
            // actionProjectOptions: [],
            // selectedProjectOptions: [],
            actionSurveyOptions: [],
            // selectedSurveyOptions: [],
        } 
    }

    componentDidMount() { 
        // console.log('UserForm componentDidMount userData', this.props.userData);
        
        try{
            const selectedRoleOptions = this.props.userData.role_id;

            // ]
            const actionSurveyOptions = this.props.surveys.map(function (survey: any, i: any) {
                // console.log('i', i);
                // console.log('survey', survey);
                return { label: survey.name, value: `${survey.id}` };
            });
          // console.log('actionSurveyOptions', actionSurveyOptions);

            
            this.setState({ 
                selectedRoleOptions: selectedRoleOptions,
                // actionProjectOptions: actionProjectOptions, 
                // selectedProjectOptions: selectedProjectOptions,
                actionSurveyOptions: actionSurveyOptions, 
                // selectedSurveyOptions: selectedSurveyOptions,
            });

            this.props.form.setFieldsValue({
                title: this.props.userData.title,
            }, () => console.log('setFieldsValue title'));
            
            this.props.form.setFieldsValue({
                first_name: this.props.userData.first_name,
            }, () => console.log('setFieldsValue first_name'));

            this.props.form.setFieldsValue({
                last_name: this.props.userData.last_name,
            }, () => console.log('setFieldsValue last_name'));

            this.props.form.setFieldsValue({
                company_name: this.props.userData.company_name,
            }, () => console.log('setFieldsValue company_name'));
            
            this.props.form.setFieldsValue({
                mobile_number: this.props.userData.mobile_number.substring(1),
            }, () => console.log('setFieldsValue mobile_number'));
            
            this.props.form.setFieldsValue({
                approved: this.props.userData.approved ? true : false,
            }, () => console.log('setFieldsValue approved'));

            // this.props.form.setFieldsValue({
            //     responsible_project: selectedProjectOptions,
            // }, () => console.log('setFieldsValue responsible_project'));
            
            // this.props.form.setFieldsValue({
            //     responsible_survey: selectedSurveyOptions,
            // }, () => console.log('setFieldsValue responsible_survey'));
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
          // console.log('error', error);
        }
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              // console.log('Received values of form: ', values);
                
                const userObj = {
                    title: values.title,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    company_name: values.company_name,
                    mobile_number: `0${values.mobile_number}`,
                    role_id: parseInt(values.role_id),
                    // responsible_survey_id: values.responsible_survey.map((surveyId: any) => { return surveyId; }).join('/') ,
                    approved: values.approved ? 1 : 0,
                }
              // console.log('userObj', userObj);

                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/user/", this.props.userData.id, userObj, jwt).then(
                    (rp) => {
                        try{
                            if (rp.Status) {
                                // console.log(rp);
                                toastr.success(rp.Messages);
                                setTimeout(function(this: any){ this.props.handleHistoryPush(`/${this.props.match.params.xSite}/admin`); }.bind(this), 500);
                            } else {
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                console.log("Messages: " + rp.Messages);
                                console.log("Exception: " + rp.Exception);
                            }
                        }catch(error){ 
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            console.log("Exception: " + error); 
                        }
                    }
                );

            }
        });
    };

    // onChangeRole = (e: RadioChangeEvent) => {
    //   // console.log('radio checked', e.target.value);
    //     this.setState({
    //         radioValue: parseInt(e.target.value),
    //     });
    // };

    onChangeRole = (e: RadioChangeEvent) => {
      // console.log('radio checked', e.target.value);
        // this.setState({
        //     [e.target.name]: e.target.value,
        // });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
    
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '1',
        })(
            <Select style={{ width: 70 }}>
            <Option value="1">+1</Option>
            </Select>,
        );

        return (
            <div>
                <div id="overlay" className={ this.state.isLoading ? '' : 'hidden'}>
                    <Spin size="large" tip="Loading..."></Spin>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    {/* <Form.Item label="E-mail">
                        {this.props.userData.email}
                    </Form.Item> */}
                    <h3 style={{ display: 'inline' }}>E-mail: </h3>{this.props.userData.email}

                    <Form.Item
                        label={
                            <span>
                            Titile&nbsp;
                            <Tooltip title="What is your title of name?">
                                <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                            </Tooltip>
                            </span>
                        }
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input your title!', whitespace: true }],
                        })(<Input maxLength={100} />)}
                    </Form.Item>

                    <Form.Item
                        label={
                            <span>
                            First name
                            </span>
                        }
                    >
                        {getFieldDecorator('first_name', {
                            rules: [{ required: true, message: 'Please input your first name?!', whitespace: true }],
                        })(<Input maxLength={35} />)}
                    </Form.Item>

                    <Form.Item
                        label={
                            <span>
                            Last name
                            </span>
                        }
                    >
                        {getFieldDecorator('last_name', {
                            rules: [{ required: true, message: 'Please input your last name?!', whitespace: true }],
                        })(<Input maxLength={35} />)}
                    </Form.Item>

                    <Form.Item
                        label={
                            <span>
                            Company name
                            </span>
                        }
                    >
                        {getFieldDecorator('company_name', {
                            rules: [{ required: true, message: 'Please input your company name!', whitespace: true }],
                        })(<Input maxLength={80} />)}
                    </Form.Item>

                    <Form.Item label="Phone Number">
                        {getFieldDecorator('mobile_number', {
                            rules: [{ required: true, message: 'Please input your phone number!' }],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} maxLength={10} />)}
                    </Form.Item>

                    <Form.Item label="User Role">
                        {getFieldDecorator('role_id', {
                                initialValue: this.state.selectedRoleOptions,
                                rules: [{ required: true }],
                        })(<RadioGroup onChange={this.onChangeRole}>
                                {/* <Radio value={3}>Subscriber &nbsp;
                                    <Tooltip title="View shared surveys & reports.">
                                        <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                    </Tooltip> 
                                </Radio> <br /> */}
                                <Radio value={2}>Creator &nbsp;
                                    <Tooltip title="Create, edit, delete surveys & view reports.">
                                        <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                    </Tooltip> 
                                </Radio> <br />
                                {/* <Radio value={4}>Superuser &nbsp;
                                    <Tooltip title="Only view all surveys & reports that are in the system.">
                                        <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                    </Tooltip> 
                                </Radio> <br /> */}
                                <Radio value={1}>Admin &nbsp;
                                    <Tooltip title="Create, edit, delete any surveys & view any reports from any users in the system.">
                                        <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                    </Tooltip> 
                                </Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    {/* <Form.Item label="Responsible Project(s)">
                        {getFieldDecorator('responsible_project', {
                            initialValue: this.state.selectedProjectOptions,
                            rules: [{ type: 'array', required: true, message: 'Required a project' }],
                            valuePropName: 'value',
                        })(
                            <CheckboxGroup options={this.state.actionProjectOptions}/>
                        )
                        }
                    </Form.Item> */}

                    {/* <Form.Item label="Currently Available Survey(s)">
                        {getFieldDecorator('responsible_survey', {
                            initialValue: this.state.selectedSurveyOptions,
                            rules: [{ type: 'array', required: false }],
                            valuePropName: 'value',
                        })(
                            <CheckboxGroup options={this.state.actionSurveyOptions}/>
                        )
                        }
                    </Form.Item> */}

                    {/* <Form.Item label="User Confirmation Email"> */}
                        <h3 style={{ display: 'inline' }}>Email Confirmation: </h3>{this.props.userData.confirmed ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>}
                    {/* </Form.Item> */}

                    <Form.Item label="Approved">
                        {getFieldDecorator('approved', { valuePropName: 'checked' })(<Switch />)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" style={{ display: 'block' }}>
                            Update
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        );
    }
  }
  
const registerForm = Form.create<IProps>()(UserForm);
export default registerForm;
