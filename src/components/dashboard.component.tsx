import * as React from 'react';
import * as toastr from 'toastr';
import AllSurveys from '../common/allSurveys';
// import Posts from '../models/posts';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { Progress, Row, Col, Statistic, Card, Icon, Layout, Tooltip } from 'antd';
import HeaderSurvey from '../common/header';
import { History } from 'history';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
// import '../App.css'; 
const { Content } = Layout;

// import { Input } from "antd";
// import TableRow from '../common/form/TableRow';
// const { Search } = Input;

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
// interface IState {
//     listSurveys: Array<Surveys>
// }

interface IState {
    statisticData: {
        num_draft: number;
        num_open: number;
        total_responses: number;
        completion_rate: number;
        time_spent: string;
    }
}

class Dashboard extends React.Component<IProps, IState> {
// class Dashboard extends React.Component {

    constructor(props: IProps) {
        super(props);
        this.state = { 
            statisticData: {
                num_draft: 0,
                num_open: 0,
                total_responses: 0,
                completion_rate: 0,
                time_spent: ''
            }
         };
    }

    public appendZero(num: any) {num = parseInt(num);return num < 10 ? '0' + num : num;}

    public formatSeconds(sec: any) {
        return this.appendZero(sec / 3600) + 'h:' + this.appendZero((sec % 3600) / 60) + 'm:' + this.appendZero((sec % 3600) % 60) + 's';
    }

    public async componentDidMount() {

        try{
            const jwt = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            // console.log('jwt', jwt);
            // jwt = await Promise.resolve(refreshJwtToken(this.props.match.params.xSite, jwt));
            if(!jwt) this.props.history.push(`/${this.props.match.params.xSite}/login`);
            
            BaseService.getSurveytatistics<Surveys>(this.props.match.params.xSite, "/surveys_statistic", jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log(rp);
                            // console.log(rp.Data);
                            // console.log(rp.Data[0]);
                            // console.log(rp.Data[0][0][0]);
                            // console.log(rp.Data[0][1][0]);
                            // console.log(rp.Data[0][2][0]);
                            if(!rp.Data.recordset) return;
                            
                            // console.log(rp);
                            // console.log(rp.Data);
                            // console.log(rp.Data.recordsets);
                            // console.log(rp.Data.recordsets.length);
                            // this.setState({ listSurveys: rp.Data.recordset, totalSurveys: rp.Data.recordset.length });
                            const draft = rp.Data.recordsets[0][0] ? rp.Data.recordsets[0][0].draftsv : 0;
                            const open = rp.Data.recordsets[1][0] ? rp.Data.recordsets[1][0].opensv : 0;
                            const total = rp.Data.recordsets[2][0] ? rp.Data.recordsets[2][0].total_responses : 0;
                            // const rate = rp.Data.recordsets[2][0] ? parseInt(rp.Data.recordsets[2][0].completion_rate) : 0;
                            const spent = rp.Data.recordsets[2][0] ? this.formatSeconds(rp.Data.recordsets[2][0].time_spent) : this.formatSeconds(0);
                            const totalClicked = rp.Data.recordsets[3][0] ? parseInt(rp.Data.recordsets[3][0].total_clicked) : 0;
                            const totalCompleted = rp.Data.recordsets[4][0] ? parseInt(rp.Data.recordsets[4][0].total_completed) : 0;
                            
                            let rate = (totalCompleted / totalClicked) * 100;
                            rate = rate >= 0 ? rate : 0;

                            this.setState({ 
                                statisticData: {
                                    num_draft: draft,
                                    num_open: open,
                                    total_responses: total,
                                    completion_rate: parseInt(rate.toFixed()),
                                    time_spent: spent
                                }
                            });
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'dashboard componentDidMount BaseService.getSurveytatistics<Surveys> /surveys_statistic else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'dashboard componentDidMount BaseService.getSurveytatistics<Surveys> /surveys_statistic catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
            
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'dashboard componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    } 

    public render(): React.ReactNode {
        // const { Countdown } = Statistic;
        // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

        return (
            <div>

            <HeaderSurvey menuKey={'dashboard'} history={this.props.history} match={this.props.match}/>

            <Content className="dw-container" style={{ marginTop: '50px'/*background: 'white'*/ }}>

                <Row gutter={[16, 16]}>
                    <Col span={6} xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Card className="dashboard-statistic-card" style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '15px' }}>
                            <Statistic 
                                className="dashboard-statistic" 
                                // title="Open" 
                                // title={<div>Open <Tooltip title={'คือ จำนวนแบบสอบถามชนิด Open ทั้งหมด ที่อยู่ในการดูแลของผู้ใช้งาน'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                                title={<div>Open</div>}
                                value={this.state.statisticData.num_open} style={{ display: 'inline-block', borderRight: '1px solid lightgray', paddingRight: '35px'}}
                            />
                            <Statistic 
                                className="dashboard-statistic" 
                                // title="Draft" 
                                // title={<div>Draft <Tooltip title={'คือ จำนวนแบบสอบถามชนิด Draft ทั้งหมด ที่อยู่ในการดูแลของผู้ใช้งาน'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                                title={<div>Draft</div>}
                                value={this.state.statisticData.num_draft} style={{ display: 'inline-block', paddingLeft: '35px'}}
                            />
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Card style={{ paddingBottom: '15px' }}>
                            <Statistic
                                // title="Total completed responses"
                                // title={<div>Total completed responses <Tooltip title={'คือ จำนวนผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากแบบสอบถามชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Total completed responses ของแบบสอบถามทั้งหมดจะเท่ากับ 50'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                                title={<div>Total completed responses</div>}
                                value={this.state.statisticData.total_responses ? this.state.statisticData.total_responses : 0}
                                valueStyle={{ color: '#3f8600' }}
                                style={{ marginLeft: '15px'}}
                                prefix={this.state.statisticData.total_responses ? <Icon type="arrow-up" /> : ''}
                                // suffix="%"
                                className="dashboard-statistic"
                            />
                            {/* <Statistic className="dashboard-statistic" title="Total responses" value={99} precision={0} /> */}
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Card className="dashboard-average-card" style={{ textAlign: 'center' }}>
                            {/* <div className="ant-statistic-title" style={{ textAlign: 'left', marginBottom: '10px' }}>Average completion rate <Tooltip title={'คือ จำนวน % ของผู้ทำแบบสอบถามที่ทำแบบสอบถามจบ (คำนวณจากแบบสอบถามชนิด OPEN และ CLOSED) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน เพราะฉะนั้น Total completed responses ของแบบสอบถามทั้งหมดจะเท่ากับ 50%'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip></div> */}
                            <div className="ant-statistic-title" style={{ textAlign: 'left', marginBottom: '10px' }}>Average completion rate</div>
                            <Progress
                                type="circle"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={this.state.statisticData.completion_rate} width={80}
                            />
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Card className="dashboard-statistic-card average-time-spent-statistic-card">
                            <Statistic
                                // title="Average time spent" 
                                // title={<div>Average time spent <Tooltip title={'คือ เวลาที่ผู้ทำแบบสอบถามใช้ในการทำแบบสอบถามจบในแต่ละครั้ง (คำนวณจากแบบสอบถามชนิด OPEN และ CLOSED ทั้งหมดที่ผู้ใช้งานเป็นผู้ดูแล) ยกตัวอย่างเช่น ผู้ทำแบบสอบถามที่คลิกลิงค์เข้ามายังหน้าทำแบบสอบถาม 100 คน แต่ทำแบบสอบถามจบเพียง 50 คน โดยใช้เวลาคนละใช้เวลา 1 นาที เพราะฉะนั้น Average time spent ของแบบสอบถามทั้งหมดจะเท่ากับ 1 นาที'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip><br></br><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>(on each survey) </span></div>}
                                title={<div>Average time spent<br></br><span className="si-token-large" style={{ fontSize: '14px', fontWeight: 'normal' }}>(on each survey) </span></div>}
                                value={this.state.statisticData.time_spent} 
                                style={{ display: 'inline-block'}}
                            />
                            {/* <Countdown style={{ display: 'inline-block'}} title="Typical time spent" value={deadline} format="HHh:mm:ss" /><div style={{ display: 'inline-block'}}>Sec</div> */}
                        </Card>
                    </Col>
                </Row>

                <AllSurveys history={this.props.history} match={this.props.match}/>
            </Content>
            </div>
            
        );
    }
}
export default Dashboard;