import React from 'react';
import { Card, Row, Col } from 'antd';
import ResetPasswordForm from "../common/form/resetPasswordForm";
import { History } from 'history';
import logo from '../logo.svg';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            token:string
        },
        path: string,
        url: string,
    }
}

export default class ResetPassword extends React.Component<IProps>{

    constructor(props:IProps) {
        super(props);
    }

    handleHistoryPush = (url: any) => {
        this.props.history.push(url);
    };

    render() {
        return (
            <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col>
                    <div className="site-card-border-less-wrapper">
                        <Card bordered={true} style={{ width: 350 }}>
                            <div style={{ textAlign: 'center' }}>
                                <img style={{ width: '150px' }} src={logo} alt="SURVEY"/>
                            </div>
                            <ResetPasswordForm history={this.props.history} match={this.props.match} token={this.props.match.params.token} handleHistoryPush={this.handleHistoryPush}></ResetPasswordForm>
                        </Card>
                    </div>
                </Col>
            </Row>
        );
    }
}