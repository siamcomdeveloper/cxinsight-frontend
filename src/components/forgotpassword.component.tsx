import React from 'react';
import { Card, Row, Col } from 'antd';
import ForgotPasswordForm from "../common/form/forgotPasswordForm";
import { History } from 'history';
import logo from '../logo.svg';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            id:string
        },
        path: string,
        url: string,
    }
}

export default class ForgotPassword extends React.Component<IProps>{

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
                                {/* <img style={{ width: '150px' }} src="https://dl.dropboxusercontent.com/s/nmt9tk5mox7a5nj/ICON%20ANALYTICS_New.png?dl=0" alt="ICONSURVEY"/> */}
                                <img style={{ width: '150px' }} src={logo} alt="ICONSURVEY"/>
                            </div>
                            <ForgotPasswordForm history={this.props.history} match={this.props.match} handleHistoryPush={this.handleHistoryPush}></ForgotPasswordForm>
                        </Card>
                    </div>
                </Col>
            </Row>
        );
    }
}