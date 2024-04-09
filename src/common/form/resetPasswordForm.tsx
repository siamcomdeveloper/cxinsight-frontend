import * as React from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Card, Row, Col, Checkbox, Button, AutoComplete, Spin} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import * as toastr from 'toastr';
import jwt from 'jsonwebtoken';
import { getJwtToken } from '../../helper/jwt.helper';
import { History } from 'history';

interface IProps extends FormComponentProps{
    token: any,
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
    isLoading: boolean,
    userId: any,
    userEmail: any
}

class ResetPasswordForm extends React.Component<IProps, IState, any> {

    constructor(props: IProps & FormComponentProps) {
        super(props);

        this.state = {
            confirmDirty: false,
            isLoading: false,
            userId: '',
            userEmail: ''
        } 
    }

    componentDidMount() { 
        const token = this.props.token;
      // console.log('RegisterForm componentDidMount token', token);

        const userData = jwt.decode(token) as any;
        if(!token || !userData) this.props.handleHistoryPush(`/${this.props.match.params.xSite}/login`);

        this.setState({
            userId: userData.id,
            userEmail: userData.email,
        }, () => {
          // console.log('after setState userId', this.state.userId);
          // console.log('after setState userEmail', this.state.userEmail);
        });
        
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });

              // console.log('Received password of form: ', values.password);
                const userData = { 
                    id: this.state.userId,
                    email: this.state.userEmail,
                    password: values.password,
                }

              // console.log('userData', userData);

                BaseService.post(this.props.match.params.xSite, "/auth/update/", userData).then(
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

        return (
            <div>
                <div id="overlay" className={ this.state.isLoading ? '' : 'hidden'}>
                    <Spin size="large" tip="Loading..."></Spin>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">

                    <Form.Item label="Choose new password" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                            {
                                required: true,
                                message: 'Please enter a password.',
                            },
                            { 
                                min: 6, message: 'At least 6 characters.' 
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                            ],
                        })(<Input.Password />)}
                    </Form.Item>

                    <Form.Item label="Retype password" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password.',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Reset Password
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        );
    }
  }
  
const resetPasswordForm = Form.create<IProps>()(ResetPasswordForm);
export default resetPasswordForm;
