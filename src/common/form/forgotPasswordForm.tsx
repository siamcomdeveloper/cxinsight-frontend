import * as React from "react";
import { Form, Input, Button, Checkbox, Icon, Spin } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import * as toastr from 'toastr';
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
    isLoading: boolean
}

class ForgotPasswordForm extends React.Component<IProps, IState, any> {

    constructor(props: IProps & FormComponentProps) {
        super(props);

        this.state = {
            isLoading: false
        } 
    }

    componentDidMount() { 
      // console.log('ForgotPasswordForm componentDidMount');
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
              // console.log('Received values of form: ', values);

                BaseService.post(this.props.match.params.xSite, "/auth/reset/", values).then(
                    (rp) => {
                        try{
                          // console.log('rp', rp);
                            if (rp.Status) {
                                this.setState({ isLoading: false });
                              // console.log('rp.Data', rp.Data);
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div id="overlay" className={ this.state.isLoading ? '' : 'hidden'}>
                    <Spin size="large" tip="Loading..."></Spin>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">

                    <Form.Item style={{ marginBottom: 10, textAlign: 'center' }}>
                        <span style={{ fontSize: 18 }}>Account Recovery</span>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 10 }}>
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
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
  }
  
const forgotPasswordForm = Form.create<IProps>()(ForgotPasswordForm);
export default forgotPasswordForm;
