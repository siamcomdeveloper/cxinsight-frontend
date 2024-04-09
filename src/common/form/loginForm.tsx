import * as React from "react";
import { Form, Input, Button, Checkbox, Icon } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import * as toastr from 'toastr';
import jwt from 'jsonwebtoken';
import { getJwtToken } from '../../helper/jwt.helper';
import { History } from 'history';

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
    numLogin: number;
}

class LoginForm extends React.Component<IProps, IState, any> {

    constructor(props: IProps & FormComponentProps) {
        super(props);

        this.state = {
            numLogin: 0,
        } 
    }

    isTokenExpired(exp: any) {
        if (Date.now() <= exp * 1000) {
          // console.log(true, 'token is not expired')
            return false;
        } else { 
          // console.log(false, 'token is expired') 
            return true;
        }
    }

    componentDidMount() {
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);

                BaseService.post(this.props.match.params.xSite, "/auth/login/", values).then(
                    (rp) => {
                        try{
                            // console.log('rp', rp);
                            if (rp.Status) {
                                // console.log('rp.Data.userToken', rp.Data.userToken);
                                localStorage.setItem('cxmuser', rp.Data.userToken);
                                toastr.success(rp.Messages);
                                setTimeout(function(this: any){ this.props.handleHistoryPush(`/${this.props.match.params.xSite}/dashboard`); }.bind(this), 500);
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
            else{

                this.setState({
                    numLogin: this.state.numLogin + 1 
                }, () => { 
                  // console.log('after setState numLogin', this.state.numLogin);
                    if(this.state.numLogin > 5) { 
                    // console.log('go to reset password page');
                      this.props.handleHistoryPush('/login');
                    }
                });

            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
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
                    })(
                        <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="E-mail"
                        />,
                    )}
                </Form.Item>
                
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                })(<Checkbox>Remember me</Checkbox>)}
                    <a className="login-form-forgot" href={`/cxm/platform/${this.props.match.params.xSite}/forgotpassword`} style={{ float: 'right' }}>
                        Forgot password
                    </a>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                        Log in
                    </Button>
                    Or <a href={`/cxm/platform/${this.props.match.params.xSite}/register/`}>Register now!</a>
                </Form.Item>
            </Form>
        );
    }
  }
  
const loginForm = Form.create<IProps>()(LoginForm);
export default loginForm;
