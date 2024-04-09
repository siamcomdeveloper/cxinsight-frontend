import React from 'react';
// import Posts from '../../models/posts';  
import Surveys from '../../models/surveys';  
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';   
import { Menu, Dropdown, Icon, Row, Col, Popconfirm, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import SurveyReNicknameModal from '../../common/modal/surveyRenicknameModal';
import { History } from 'history';

interface IProps {
    surveys: Surveys;  
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
interface IState {
    visible: boolean
}

class surveyRow extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: false
        };
        // console.log('collectorEditModal constructor', props);
    }

    menu = () => (
        <Menu>
            <Menu.Item key="0">
                <a href={`/cxm/platform/${this.props.match.params.xSite}/summary/${this.props.surveys.id}`} style={{ textDecoration: 'none' }}><Icon type="edit" /> View</a>
            </Menu.Item>
            <Menu.Item key="1">
                <a  href="# " onClick={()=>this.Rename()} style={{ textDecoration: 'none' }}><Icon type="edit" /> Re-nickname</a>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                        title={`Are you sure copy this ${this.props.surveys.name} survey?`}
                        onConfirm={this.Copy.bind(this)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a  href="# " style={{ textDecoration: 'none' }}><Icon type="copy" />  Copy</a>
                </Popconfirm>
            </Menu.Item>
            <Menu.Item key="3">
                <Popconfirm
                        title={`Are you sure delete this ${this.props.surveys.name} survey?`}
                        onConfirm={this.Del.bind(this)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a  href="# " style={{ textDecoration: 'none' }}><Icon type="delete" />  Delete</a>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );
    
    cancel() {
        // console.log(e);
        // message.error('Cancel');
    }
    
    Rename = () => {
        // console.log('Rename');
        this.setState({
            visible: true
        });
    }

    Del() {
        // console.log("Del click", this.props.surveys.id);
        const jwt = getJwtToken();
        BaseService.delete(this.props.match.params.xSite, "/surveys/", this.props.surveys.id, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);    
                        setTimeout(function(){ window.location.reload(); }, 500);
                    } else { 
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRow Del BaseService.delete /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRow Del BaseService.delete /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    Copy() {
        // console.log("Click Copy", this.props.surveys);
        // console.log("Click Copy this.props.surveys.id", this.props.surveys.id);
        const jwt = getJwtToken();
        BaseService.create<Surveys>(this.props.match.params.xSite, "/surveys/copy", this.props.surveys, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        // console.log(rp.Data);
                        // console.log(rp.Data.result.surveyInsertedId);
                        toastr.success(rp.Messages); 
                        setTimeout(function(){ window.location.reload(); }, 500);
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRow Copy BaseService.create<Surveys>> /surveys/copy else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRow Copy BaseService.create<Surveys>> /surveys/copy catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    alertResponses(status: any) {
        switch (status) {
            case 2: //2 = Good
            return <div><span className="si-token-large" style={{ color: 'green' }}>{ this.props.surveys.good_responses }</span>Good Responses</div>
            case 3: //3 = Bad
            return <div><span className="si-token-large" style={{ color: 'red' }}>{ this.props.surveys.bad_responses }</span>Bad Responses</div>
            default: //0 = Nothing and 1 = Normal
            return <div><span className="si-token-large" style={{ color: 'gray' }}>No</span>Bad Responses</div>
        }
    }

    collectorType(type: any) {
        // console.log('collectorType', type);
        switch (type) {
            case 1: //1 = Web link
            return <Icon type="link" />
            case 2: //2 = SMS
            return <Icon type="mobile" />
            case 3: //3 = mail
            return <Icon type="mail" />
            case 4: //4 = facebook
            return <Icon type="facebook" />
            default:
            return <Icon type="link" />
        }
    }

    surveyStatus(status: any) {
        // console.log('surveyStatus', status);
        switch (status) {
            case 1: //1 = NOT CONFIGURED
            return <span className="si-status survey-status-draft">DRAFT</span>
            case 2: //1 = OPEN
            return <span className="si-status survey-status-open">OPEN</span>
            case 3: //2 = CLOSED
            default:
            return <span className="si-status" style={{ backgroundColor: 'gray'}}>CLOSED</span>
        }
    }

    surveyOpenStatistic = (
        <Row gutter={[16, 16]} style={{ height: '100%', margin: '0'}}>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata" style={{ padding: '8px'}}>
                <li><div><span className="si-token-large" style={{ fontSize: '14px' }}>{ this.props.surveys.template_name }</span>Template</div></li>
                {/* <li style={{ paddingBottom: '5px' }}><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.multi_lang ? "Multiple Languages" : "Single Language" }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Survey</span></div></li> */}
                {/* <li><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.touchpoint_name ? this.props.surveys.touchpoint_name : 'Other' }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Touchpoint</span></div></li> */}
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.total_responses ? this.props.surveys.total_responses : 0 }</span>Responses<span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}></span>
                     {/* <Tooltip title={'คือ จำนวนผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Responses (Completed) ของแบบสอบถามทั้งหมดจะเท่ากับ 50'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.completion_rate ? this.props.surveys.completion_rate : 0 }%</span><span>Completion rate </span>
                    {/* <Tooltip title={'คือ จำนวน % ผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Completion rate ของแบบสอบถามทั้งหมดจะเท่ากับ 50%'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.time_spent ? this.props.surveys.time_spent : 0 } mins</span>Average time spent<span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}></span>
                    {/* <Tooltip title={'คือ เวลาที่ผู้ทำแบบสอบถามใช้ในการทำแบบสอบถามจบในแต่ละครั้ง (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED ทั้งหมด) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน โดยใช้เวลาคนละใช้เวลา 1 นาที เพราะฉะนั้น Average time spent ของแบบสอบถามนี้จะเท่ากับ 1 นาที'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
        </Row>
    )

    // surveyOpenStatistic = (
    //     <Row gutter={[16, 16]} style={{ height: '100%', margin: '0'}}>
    //         <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
    //             {/* <li><div><span className="si-token-large">{ this.props.surveys.total_responses }</span>Responses</div></li> */}
    //             <li style={{ paddingBottom: '5px' }}><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.project_name }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Project</span></div></li>
    //             <li><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.touchpoint_name }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Touchpoint</span></div></li>
    //         </Col>
    //         <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
    //             <li><div><span className="si-token-large">{ this.props.surveys.completion_rate }%</span>Completion rate</div></li>
    //         </Col>
    //         <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
    //             <li><div><span className="si-token-large">{ this.props.surveys.time_spent } mins</span>Typical time spent</div></li>
    //         </Col>
    //         <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
    //             <li>
    //                 { this.alertResponses(this.props.surveys.alert_status) }
    //             </li>
    //         </Col>
    //     </Row>
    // )

    surveyClosedStatistic = (
        <Row gutter={[16, 16]} style={{ height: '100%', margin: '0'}}>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata" style={{ padding: '0 8px'}}>
                <li><div><span className="si-token-large" style={{ fontSize: '14px' }}>{ this.props.surveys.template_name }</span>Template</div></li>
                {/* <li style={{ paddingBottom: '5px' }}><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.multi_lang ? "Multiple Languages" : "Single Language" }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Survey</span></div></li> */}
                {/* <li><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.touchpoint_name ? this.props.surveys.touchpoint_name : 'Other' }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Touchpoint</span></div></li> */}
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.total_responses ? this.props.surveys.total_responses : 0 }</span>Responses<span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}></span>
                    {/* <Tooltip title={'คือ จำนวนผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Responses (Completed) ของแบบสอบถามทั้งหมดจะเท่ากับ 50'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.completion_rate ? this.props.surveys.completion_rate : 0 }%</span><span>Completion rate </span>
                    {/* <Tooltip title={'คือ จำนวน % ผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Completion rate ของแบบสอบถามทั้งหมดจะเท่ากับ 50%'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div>
                    <span className="si-token-large">{ this.props.surveys.time_spent ? this.props.surveys.time_spent : 0 } mins</span>Average time spent<span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}></span>
                    {/* <Tooltip title={'คือ เวลาที่ผู้ทำแบบสอบถามใช้ในการทำแบบสอบถามจบในแต่ละครั้ง (คำนวณจากช่องทางจัดเก็บชนิด OPEN และ CLOSED ทั้งหมด) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน โดยใช้เวลาคนละใช้เวลา 1 นาที เพราะฉะนั้น Average time spent ของแบบสอบถามนี้จะเท่ากับ 1 นาที'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </div></li>
            </Col>
        </Row>
    )

    surveyDraftStatistic = (
        <Row gutter={[16, 16]} style={{ height: '100%', margin: '0'}}>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div><span className="si-token-large" style={{ fontSize: '14px' }}>{ this.props.surveys.template_name }</span>Template</div></li>
                {/* <li style={{ paddingBottom: '5px' }}><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.multi_lang ? "Multiple Languages" : "Single Language" }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Survey</span></div></li> */}
                {/* <li><div><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{ this.props.surveys.touchpoint_name ? this.props.surveys.touchpoint_name : 'Other' }</span><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>Touchpoint</span></div></li> */}
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div><span className="si-token-large">{ this.props.surveys.num_question }</span>Questions</div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div><span className="si-token-large">{ this.props.surveys.time_spent } mins</span>Estimated time to complete</div></li>
            </Col>
            <Col span={12} xs={12} md={6} lg={6} className="si-metadata">
                <li><div><span className="si-token-large">{ this.props.surveys.num_collector }</span>Collectors</div></li>
            </Col>
        </Row>
    )

    surveyItemStatistic(status: any) {
        // console.log('surveyItemStatistic');
        switch (status) {
            case 1: //1 = NOT CONFIGURED
            return this.surveyDraftStatistic
            case 2: //1 = OPEN
            return this.surveyOpenStatistic
            case 3: //2 = CLOSED
            default:
            return this.surveyClosedStatistic
        }
    }

    render() {

        return (

            <div>
                <div className="status-holder">
                    <div className="si-badges">
                        {this.surveyStatus(this.props.surveys.status)}
                    </div>
                    <div className="survey-item">

                        <Row style={{ width: '100%'}}>
                            <Col span={24} xs={24} md={5} lg={5} className="si-main-heading">
                                <div className="si-survey-title">
                                    <a href={`/cxm/platform/${this.props.match.params.xSite}/summary/${this.props.surveys.id}` }>{ this.props.surveys.nickname } </a>
                                    {/* <Tooltip title={`Display name : ${this.props.surveys.name}`}><Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                                </div>
                                <div className="si-subtitle">
                                    <ul className="si-subtitle-items-list">
                                        <li>Created: { this.props.surveys.created_date }</li>
                                        <br/>
                                        <li>Modified: { this.props.surveys.modified_date ? this.props.surveys.modified_date : '-' }</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={24} xs={24} md={16} lg={16} className="survey-item-statistic" style={{ height: '100%', textAlign: 'center'}}>
                                
                                    
                                {this.surveyItemStatistic(this.props.surveys.status)}
                                    
                                
                            </Col>
                            <Col span={24} xs={24} md={3} lg={3} className="survey-item-options show-on-hover si-actions" style={{ textAlign: 'center', borderLeft: '1px solid lightgray', height: '100%' }}>
                                <div className="variant-sm hidden-sm-down vertical-center">
                                    <li className="action-token">
                                        <div className="variant-lg hidden-sm-down">
                                            <Dropdown overlay={this.menu()} trigger={['click']}>
                                                <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none' }} >
                                                    <div className="action-icon-holder more-options null"><span className="action-icon smf-icon">...</span></div><div className="label">Options</div>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </li>
                                </div>
                                <div className="variant-sm hidden-md-up">
                                    <li className="action-token"><div className="variant-sm hidden-md-up"><a href={`/cxm/platform/${this.props.match.params.xSite}/design/${this.props.surveys.id}`}><Icon type="edit" /> Edit</a></div></li>
                                    <li className="action-token"><div className="variant-sm hidden-md-up"><a  href="# " onClick={()=>this.Del()}><Icon type="delete" />  Delete</a></div></li>
                                </div>
                            </Col>
                        </Row>
                        
                    </div>
                </div>

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.props.surveys}
                    visible={this.state.visible}
                />

            </div>
        );
    }
};
export default surveyRow;