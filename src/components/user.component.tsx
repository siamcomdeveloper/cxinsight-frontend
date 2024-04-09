import React from 'react';
import * as toastr from 'toastr';
import { Card, Row, Col, Divider } from 'antd';
import UserForm from "../common/form/userForm";
import { History } from 'history';
import BaseService from '../service/base.service';
import jwt from 'jsonwebtoken';
import { refreshJwtToken, getJwtToken } from '../helper/jwt.helper';
import ReactDOM from 'react-dom';
import Surveys from '../models/surveys';
import logo from '../logo.svg';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            userId:string
        },
        path: string,
        url: string,
    }
}

interface IState {
    userData: any,
    surveys: any,
    // projects: any,
}

export default class User extends React.Component<IProps, IState>{

    constructor(props:IProps) {
        super(props);
        this.state = {
            userData: {},
            surveys: {},
            // projects: {},
        }
    }

    handleHistoryPush = (url: any) => {
        this.props.history.push(url);
    };

    public async componentDidMount() {

        try{
            // console.log('User componentDidMount userId', this.props.match.params.userId);

            document.body.id = 'user';

            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            if( [1].includes(userData.ro) ) authorized = true;
            
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

            BaseService.get(this.props.match.params.xSite, "/user/", this.props.match.params.userId, jwtToken).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log('get user rp', rp);
                            // console.log('get user rp.Data', rp.Data);
                        // console.log('get user rp.Data.result', rp.Data.result);

                            this.setState({
                                userData: rp.Data.result,
                            });

                            BaseService.getAll<Surveys>(this.props.match.params.xSite, "/surveys", jwtToken).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                            // console.log('get surveys rp', rp);
                                            // console.log('get surveys rp.Data', rp.Data);
                                        // console.log('get surveys rp.Data.recordset', rp.Data.recordset);
                    
                                            this.setState({
                                                surveys: rp.Data.recordset,
                                            }, () => {
                                                ReactDOM.render(<UserForm userData={this.state.userData} surveys={this.state.surveys} handleHistoryPush={this.handleHistoryPush} history={this.props.history} match={this.props.match}></UserForm>, document.getElementById("userForm")); 
                                            });
                                            

                                            // BaseService.get(this.props.match.params.xSite ,"/projects", '', jwtToken).then(
                                            //     (rp) => {
                                            //         try{
                                            //             if (rp.Status) {
                                            //                 // console.log('get projects rp', rp);
                                            //                 // console.log('get projects rp.Data', rp.Data);
                                            //                 // console.log('get projects rp.Data.result', rp.Data.result);
                                            //               // console.log('get projects rp.Data.result.recordset', rp.Data.result.recordset);
                                    
                                            //                 this.setState({
                                            //                     projects: rp.Data.result.recordset,
                                            //                 }, () => {
                                            //                     ReactDOM.render(<UserForm userData={this.state.userData} surveys={this.state.surveys} projects={this.state.projects} handleHistoryPush={this.handleHistoryPush}></UserForm>, document.getElementById("userForm"));
                                            //                 });
                                    
                                            //             } else {
                                            //                 toastr.error(rp.Messages);
                                            //                 console.log("Messages: " + rp.Messages);
                                            //                 console.log("Exception: " + rp.Exception);
                                            //             }
                                            //         } catch(error){
                                            //             toastr.error(rp.Messages + ' - something went wrong!');
                                            //           // console.log("Exception: " + error);
                                            //         }
                                            //     }
                                            // );
                    
                                        } else {
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `user BaseService.getAll<Surveys> /surveys else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                        }
                                    } catch(error){
                                        // toastr.error(rp.Messages + ' - something went wrong!');
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `user BaseService.getAll<Surveys> /surveys catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }
                            );

                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `user BaseService.get /user/${this.props.match.params.userId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    } catch(error){
                        // toastr.error(rp.Messages + ' - something went wrong!');
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `user BaseService.get /user/${this.props.match.params.userId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
        } catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `user componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {
        return (
            <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col>
                    <div className="site-card-border-less-wrapper">
                        <Card bordered={true} style={{ width: 350, marginTop: 50, marginBottom: 50}}>
                            <div style={{ textAlign: 'center' }}>
                                {/* <img style={{ width: '150px' }} src="https://dl.dropboxusercontent.com/s/nmt9tk5mox7a5nj/ICON%20ANALYTICS_New.png?dl=0" alt="ICONSURVEY"/> */}
                                <img style={{ width: '150px' }} src={logo} alt="ICONSURVEY"/>
                            </div>
                            <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >Update User Profile</Divider>
                            <div id="userForm"></div>
                        </Card>
                    </div>
                </Col>
            </Row>
        );
    }
}