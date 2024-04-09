import * as React from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Card, Row, Col, Checkbox, Button, AutoComplete, Spin} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import * as toastr from 'toastr';
import jwt from 'jsonwebtoken';
import { getJwtToken } from '../../helper/jwt.helper';
import { History } from 'history';
const { Option } = Select;

interface IProps extends FormComponentProps{
    handleHistoryPush: (url: any) => void;
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
    isLoading: boolean
}

class RegisterForm extends React.Component<IProps, IState, any> {

    constructor(props: IProps & FormComponentProps) {
        super(props);

        this.state = {
            confirmDirty: false,
            isLoading: false,
        } 
    }

    componentDidMount() { 
      // console.log('RegisterForm componentDidMount');
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              // console.log('Received values of form: ', values);

                this.setState({ isLoading: true });

                BaseService.post(this.props.match.params.xSite, "/auth/register/", values).then(
                    (rp) => {
                        try{
                            // console.log('rp', rp);
                            if (rp.Status) {
                                this.setState({ isLoading: false });
                                toastr.success(rp.Messages);
                                setTimeout(function(this: any){ this.props.handleHistoryPush(`/${this.props.match.params.xSite}/login`); }.bind(this), 500);
                            } else {
                                this.setState({ isLoading: false });
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

    handleConfirmBlur = (e: any) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule: any, value: any, callback: any) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    
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
                    <Form.Item label="E-mail">
                        {getFieldDecorator('email', {
                            rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                            ],
                        })(<Input maxLength={320} />)}
                    </Form.Item>

                    <Form.Item label="Password" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            { 
                                min: 6, message: 'Password must be minimum 6 characters.' 
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>

                    <Form.Item label="Confirm Password" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>

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

                    {/* <Form.Item {...tailFormItemLayout} style={{ float: 'left' }}>
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                        })(
                            <Checkbox>
                            I have read the <a href="">agreement</a>
                            </Checkbox>,
                        )}
                    </Form.Item> */}

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" style={{ display: 'block' }}>
                            Register
                        </Button>
                        Or <a href={`/cxm/platform/${this.props.match.params.xSite}/login/`}>Login now!</a>
                    </Form.Item>

                </Form>
            </div>
        );
    }
  }
  
const registerForm = Form.create<IProps>()(RegisterForm);
export default registerForm;
