import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../../../models/surveys';
import Collector from '../../../models/collector';
import Email from '../../../models/email';
import BaseService from '../../../service/base.service';
import { History } from 'history';
import { getJwtToken } from '../../../helper/jwt.helper';
import MenuSurvey from '../../../common/menu';
import { Icon, Dropdown, Menu, Radio, DatePicker, Empty, Tabs, Progress, Table, Button, Spin, Popconfirm, Divider, Tooltip } from "antd";
import moment from 'moment';

import HeaderSurvey from '../../../common/header';

import '../../../css/wds-react.4_16_1.min.css';
// import '../../../css/collectweb-collector_list-bundle-min.5e29c8fb.css';
import '../../../css/smlib.globaltemplates-base_nonresponsive-bundle-min.125b4dd4.css';
import '../../../css/smlib.ui-global-bundle-min.9feec1b6.css';
import '../../../css/collectweb-collector_get-bundle-min.ea15b72a.css';
import '../../../css/smlib.ui-global-pro-bundle-min.3a0c69ab.css';
import '../../../css/collectweb-manage_message-bundle-min.13530d40.css';

import CollectorEditModal from '../../../common/modal/collectorEditModal';
import MessageEditModal from '../../../common/modal/emailMessageEditModal';

// import { Cipher } from 'crypto';
import { RadioChangeEvent } from 'antd/lib/radio';

import Highcharts, { Pointer } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { SorterResult, ColumnProps } from 'antd/lib/table';
import { PaginationProps } from 'antd/lib/pagination';

import FileReaderInput from 'react-file-reader-input';
// import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import * as XLSX from 'xlsx';
import ReactDOM from 'react-dom';
import parse from 'html-react-parser';
import Project from '../../../models/project';

// import { read, utils, writeFile } from 'xlsx';

// import ReactFileReader from 'react-file-reader';

import SurveyReNicknameModal from '../../../common/modal/surveyRenicknameModal';

const { read, write, utils } = XLSX;

const { SubMenu } = Menu;

// const options = {
//     title: {
//         text: 'My chart'
//     },
//     series: [{
//         type: 'line',
//         data: [1, 2, 3]
//     }]
// }
// Load the exporting module.
// import * as Exporting from 'highcharts/modules/exporting';
// Module with declaration:
// import AccessibilityModule from 'highcharts/modules/accessibility';
// Module with any type:
// import NewModule from 'highcharts/modules/new';

// import '../css/wds-charts.4_16_1.min.css';
// import '../css/survey-summary.css';
// import '../css/side-bar.css';
// import '../css/survey-info-stats.css';
// import '../css/status-card-survey-status.css';
// import '../css/status-card-response-count.css';
// import '../css/collector-list.css';
// const { Option } = Select;
const { TabPane } = Tabs;

// const menu = (id: any) => (
//     <Menu>
//         <Menu.Item key="edit">
//             <a href={'/cxm/platform/${this.props.match.params.xSite}/edit/' + id} style={{ textDecoration: 'none' }}><Icon type="edit" /> Edit collector</a>
//         </Menu.Item>
//         <Menu.Item key="close">
//             {/* <Link to={"/edit/" + id}><Icon type="edit" />  Edit</Link> */}
//             <a  href="# " onClick={()=>Close(Number(id))} style={{ textDecoration: 'none' }}><Icon type="close" /> Close collector</a>
//         </Menu.Item>
//         <Menu.Item key="delete">
//             {/* <Link to={"#"} onClick={()=>Del(Number(id))}><Icon type="delete" />  Delete</Link> */}
//             <a  href="# " onClick={()=>Del(Number(id))} style={{ textDecoration: 'none' }}><Icon type="delete" />  Delete collector</a>
//         </Menu.Item>
//         <Menu.Item key="rename">
//             <a  href="# " onClick={()=>Rename(Number(id))} style={{ textDecoration: 'none' }}><Icon type="edit" />  Rename collector</a>
//         </Menu.Item>
//     </Menu>
// );

// function Del(ID:number) {
//   // console.log("Del click", ID);
//     // BaseService.delete(this.props.match.params.xSite, "/surveys/", ID).then(
//     //     (rp) => {
//     //         if (rp.Status) {
//     //             toastr.success(rp.Messages);    
//     //             window.location.reload();
//     //         } else { 
//     //             toastr.error(rp.Messages);
//     //             console.log("Messages: " + rp.Messages);
//     //             console.log("Exception: " + rp.Exception);
//     //         }
//     //     }
//     // );
// }

// function Rename(ID:number) {
//   // console.log("Rename click", ID);
// }

// function Close(ID:number) {
//   // console.log("Close click", ID);
// }

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
interface IState {
    collector: Collector,
    listProjects: Array<Project>,
    survey: Surveys,
    isLoading: boolean,
    collectorType: string,
    collectorTypeId: string,
    collectorStatus: string,
    visibleCollectorModal: boolean,
    visibleMessageModal: boolean,
    radioCutoffValue: number,
    cutoffDateTime: string,
    
    radioSendValue: number,
    sendDateTime: string,

    data: [],
    totalData: number,
    pagination: {},
    loading: boolean,
    isLoadingSubmit: boolean,

    fileName: string,
    dataImport: [],
    totalDataImport: number,
    paginationImport: {},
    loadingImport: boolean,

    importDisabled: boolean,

    totalRecipients: any;
    invitedRecipients: any;
    noInvitedRecipients: any;
    invitedRecipientsPercent: any;
    noInvitedRecipientsPercent: any;

    totalResponses: any;
    completedResponses: any;
    partialResponses: any;
    noResponses: any;
    completedResponsesPercent: any;
    partialResponsesPercent: any;
    noResponsesPercent: any;

    loadingMessageHistory: any;
    loadingMessageFollowUp: any;
    totalMessageHistory: any;
    totalMessageFollowUp: any;

    backgroundColor: any;
    visible: boolean;
}

export default class CollectorMessage extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            collector: {
                name: '',
                survey_id: '',
                type: '',
                link: ''
            },
            listProjects: [],
            isLoading: true,
            collectorType: '',
            collectorTypeId: '0',
            collectorStatus: '',
            visibleCollectorModal: false,
            visibleMessageModal: false,
            radioCutoffValue: 0,
            cutoffDateTime: '',

            radioSendValue: 0,
            sendDateTime: '',

            data: [],
            totalData: 0,
            pagination: { pageSize: 20 },
            loading: false,
            isLoadingSubmit: false,

            fileName: 'No file Chosen',
            dataImport: [],
            totalDataImport: 0,
            paginationImport: { pageSize: 20 },
            loadingImport: false,

            importDisabled: true,

            totalRecipients: 0,
            invitedRecipients: 0,
            noInvitedRecipients: 0,
            invitedRecipientsPercent: 0,
            noInvitedRecipientsPercent: 0,

            totalResponses: 0,
            completedResponses: 0,
            partialResponses: 0,
            noResponses: 0,
            completedResponsesPercent: 0,
            partialResponsesPercent: 0,
            noResponsesPercent: 0,

            loadingMessageHistory: true,
            loadingMessageFollowUp: true,
            totalMessageHistory: 0,
            totalMessageFollowUp: 0,

            backgroundColor: '',
            visible: false,
        }
        // this.onFieldValueChange = this.onFieldValueChange.bind(this);

    }

    // private onFieldValueChange(fieldName: string, value: any) { 
    //     const nextState = {
    //         ...this.state,
    //         collector: {
    //             ...this.state.collector,
    //             [fieldName]: value,
    //         }
    //     };

    //     this.setState(nextState);
    //   // console.log('Create onFieldValueChange', this.state.survey);
    // }

    componentDidMount() { 

        const jwt = getJwtToken();
        if(!jwt){
            this.props.history.push(`/${this.props.match.params.xSite}/login`);
        }

        document.body.id = 'collector';

        // console.log(this.props.match.params.id);
        BaseService.get<Collector>(this.props.match.params.xSite, '/collector/', this.props.match.params.id, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log('componentDidMount collectors', rp.Data);
                        const collector = rp.Data.recordset[0];

                        this.setState({ 
                            collector: collector, 
                            collectorStatus: collector.status_name,
                            radioCutoffValue: parseInt(collector.cutoff),
                            cutoffDateTime: collector.cutoff_datetime,
                            radioSendValue: parseInt(collector.send),
                            sendDateTime: collector.send_datetime,
                            backgroundColor: collector.color_theme ? collector.color_theme : 'dodgerblue'
                        });

                      // console.log('componentDidMount', collector.survey_id);

                        BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', collector.survey_id, jwt).then(
                            (rp) => {
                                try{
                                    if (rp.Status) {
                                      // console.log('componentDidMount survey', rp.Data);
                                        this.setState({ survey: rp.Data.recordset[0], isLoading: false });
                                        // ReactDOM.render(<div><p>{this.state.collector.message}</p></div>, document.getElementById('message-content'));
                                    } else {
                                        this.setState({ isLoading: false });
                                        // toastr.error(rp.Messages);
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Surveys> /surveys/${rp.Data.recordset[0].survey_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                }catch(error){ 
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Surveys> /surveys/${rp.Data.recordset[0].survey_id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                }
                            }

                        );

                        // BaseService.get<Surveys>(this.props.match.params.xSite, "/collector/statusName/", rp.Data.recordset[0].status, jwt).then(
                        //     (rp) => {
                        //         try{
                        //             if (rp.Status) {
                        //                 // console.log('statusName', rp.Data.recordset[0].name);
                        //                 this.setState({ collectorStatus: rp.Data.recordset[0].name });
                        //             } else {
                        //                 toastr.error(rp.Messages);
                        //                 BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Surveys> /collector/statusName/${rp.Data.recordset[0].status} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        //             }
                        //         }catch(error){ 
                        //             BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Surveys> /collector/statusName/${rp.Data.recordset[0].status} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        //         }
                        //     }
                        // );

                        BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/', jwt).then(
                        (rp) => {
                            try{
                                if (rp.Status) {

                                    const listProjects = rp.Data.result.recordset;
                                    
                                    this.setState({ listProjects: listProjects });

                                } else {
                                    this.setState({ isLoading: false });
                                    // toastr.error(rp.Messages);
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidMount BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/') else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                }
                            }catch(error){ 
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidMount BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/') catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                            }
                        });// get projects

                        this.setState({ isLoading: false }, () => { this.fetch(); });
                        
                    } else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Collector> /collector/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidAmount BaseService.get<Collector> /collector/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }

        );

    }

    // messageContent = () => {
    //   // console.log(`messageContent`);
    //     try{
    //         ReactDOM.render(<div><p>{this.state.collector.message}</p></div>, document.getElementById('message-content'));
    //     }
    //     catch(e){
    //       // console.log(e);
    //     }
    // }

    handleTableChange = (pagination: PaginationProps, filters: Partial<Record<string | number | symbol, string[]>>, sorter: SorterResult<never>, extra: any) => {
      // console.log('params', pagination, filters, sorter, extra, extra.currentDataSource.length);
        // const paginationChange = { total: 1, ...this.state.pagination };

        // const pagination = { ...this.state.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        // pagination.total = 200;

        this.setState({
            // data: extra.currentDataSource,
            // pagination: paginationChange,
            totalData: extra.currentDataSource.length,
            visibleMessageModal: false,
            visibleCollectorModal: false
        });
    }
    
    // handleTableChange = (pagination: PaginationProps, filters: Partial<Record<string | number | symbol, string[]>>, sorter: SorterResult<never>) => {
    //     const pager = { current: pagination.current, ...this.state.pagination };
    //     // pager.current = pagination.current;

    //     // pagination={{ pageSize: 50 }}

    //     this.setState({
    //         pagination: pager,
    //     });
    //     this.fetch({
    //         results: 2,
    //         page: pagination.current,
    //         sortField: sorter.field,
    //         sortOrder: sorter.order,
    //         ...filters,
    //     });
    // };

    fetch = (params = {}) => {
      // console.log('fetch params:', params);
        this.setState({ loading: true });
        // reqwest({
        //   url: 'https://randomuser.me/api',
        //   method: 'get',
        //   data: {
        //     results: 10,
        //     ...params,
        //   },
        //   type: 'json',
        // }).then(data => {
        //     const pagination = { ...this.state.pagination };
        //     // Read total count from server
        //     // pagination.total = data.totalCount;
        //     pagination.total = 200;
        //     this.setState({
        //         loading: false,
        //         data: data.results,
        //         pagination,
        //     });
        // });
      // console.log('fetch', this.state.data);
        const jwt = getJwtToken();
        // BaseService.getJSON(this.props.match.params.xSite, "/email/list/", this.props.match.params.id, this.state.data).then(
        BaseService.getJSON(this.props.match.params.xSite, "/email/list/", this.props.match.params.id, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                      // console.log('getJSON', rp.Data.result.recordset);
                      // console.log('getJSON', rp.Data.result.recordset.length);
                        // this.setState({ collectorStatus: rp.Data.result.recordset[0].name });
                        const pagination = { total: rp.Data.result.recordset.length, ...this.state.pagination };
                        // const pagination = { total: rp.Data.result.recordset.length, pageSize: rp.Data.result.recordset.length, hideOnSinglePage: true };
                        // console.log('pagination', pagination);
                        // Read total count from server
                        // pagination.total = data.totalCount;
                        // pagination.total = 200;

                        let totalRecipients = 0;
                        let totalResponses = 0;
                        let invitedRecipients = 0;
                        let noInvitedRecipients = 0;

                        let completedResponses = 0;
                        let partialResponses = 0;
                        let noResponses = 0;
                            
                        rp.Data.result.recordset.map((data: any) => {
                          // console.log('data', data);
                          // console.log('sent', data.sent);
                          // console.log('response_status', data.response_status);

                            //total responses (sent and response)
                            if(data.sent && data.response_status > 1) totalResponses++;

                            //total responses (sent and response)
                            if(data.sent) invitedRecipients++;
                            else noInvitedRecipients++;

                            //each response (sent and completed, partial, no response)
                            if(data.sent && data.response_status === 3) completedResponses++;
                            else if(data.sent && data.response_status === 2) partialResponses++;
                            else if(data.sent && data.response_status === 1) noResponses++;

                            totalRecipients++;
                        });

                        // setup formatters
                        const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
                        const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
                        
                        const invitedRecipientsPercent = totalRecipients ? parseFloat(af.format((invitedRecipients / totalRecipients) * 100)) : 0 ;
                        const noInvitedRecipientsPercent = totalRecipients ? parseFloat(af.format((noInvitedRecipients / totalRecipients) * 100)) : 0 ;

                        const completedResponsesPercent = totalRecipients ? parseFloat(af.format((completedResponses / totalRecipients) * 100)) : 0 ;
                        const partialResponsesPercent = totalRecipients ? parseFloat(af.format((partialResponses / totalRecipients) * 100)) : 0 ;
                        const noResponsesPercent = totalRecipients ? parseFloat(af.format((noResponses / totalRecipients) * 100)) : 0 ;

                      // console.log('totalRecipients', totalRecipients);
                      // console.log('invitedRecipients', invitedRecipients);
                      // console.log('noInvitedRecipients', noInvitedRecipients);
                        
                      // console.log('totalResponses', totalResponses);
                      // console.log('completedResponses', completedResponses);
                      // console.log('partialResponses', partialResponses);
                      // console.log('noResponses', noResponses);

                      // console.log('invitedRecipientsPercent', invitedRecipientsPercent);
                      // console.log('noInvitedRecipientsPercent', noInvitedRecipientsPercent);

                      // console.log('completedResponsesPercent', completedResponsesPercent);
                      // console.log('partialResponsesPercent', partialResponsesPercent);
                      // console.log('noResponsesPercent', noResponsesPercent);

                        this.setState({
                            loading: false,
                            data: rp.Data.result.recordset,
                            pagination,
                            totalData: rp.Data.result.recordset.length,
                            totalRecipients: totalRecipients,
                            invitedRecipients: invitedRecipients,
                            noInvitedRecipients: noInvitedRecipients,
                            invitedRecipientsPercent: invitedRecipientsPercent,
                            noInvitedRecipientsPercent: noInvitedRecipientsPercent,

                            totalResponses: totalResponses,
                            completedResponses: completedResponses,
                            partialResponses: partialResponses,
                            noResponses: noResponses,
                            completedResponsesPercent: completedResponsesPercent,
                            partialResponsesPercent: partialResponsesPercent,
                            noResponsesPercent: noResponsesPercent,
                        }, () => {

                            BaseService.getJSON(this.props.match.params.xSite, "/email/messagehistory/list/", this.props.match.params.id, jwt).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                          // console.log('getJSON messagehistory', rp.Data.result.recordset);
                                          // console.log('getJSON messagehistory', rp.Data.result.recordset.length);
                                                
                                            if(!rp.Data.result.recordset.length) {
                                                ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-history-list'));
                                                this.setState({ loadingMessageHistory: false }); 
                                                return; 
                                            }
                                            
                                            let messageHistoryList = [] as any;
                    
                                            rp.Data.result.recordset.map((data: any, i: any) => {
                                              // console.log('data', data);
                                              // console.log('data.created_date', data.created_date);
                                              // console.log('data.message_log', data.message_log);
                                                messageHistoryList.push(
                                                    <li key={`messagehistory-${i}-${this.getDateTime()}`}>
                                                        <div className="date">{data.created_date}</div>
                                                        <div className="type">{data.message_log}</div>
                                                    </li>
                                                );
                                            });
                                            // messageHistoryList.push( <li key={`messagehistory-last-${this.getDateTime()}`}>&nbsp;</li> );
                                            ReactDOM.render(messageHistoryList, document.getElementById('message-history-list'));
                                            this.setState({ loadingMessageHistory: false, totalMessageHistory: rp.Data.result.recordset.length });
                    
                                        } else {
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/messagehistory/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-history-list'));
                                            this.setState({ loadingMessageHistory: false });
                                        }
                                    } catch(error){
                                        // ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-history-list'));
                                        this.setState({ loadingMessageHistory: false });
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/messagehistory/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }
                            );
                    
                            BaseService.getJSON(this.props.match.params.xSite, "/email/messagefollowup/list/", this.props.match.params.id, jwt).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                          // console.log('getJSON messagefollowup', rp.Data.result.recordset);
                                          // console.log('getJSON messagefollowup', rp.Data.result.recordset.length);
                                                
                                            if(!rp.Data.result.recordset.length) {
                                                ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                                this.setState({ loadingMessageFollowUp: false }); 
                                                return; 
                                            }
                                            
                                            let messageFollowUpList = [] as any;
                    
                                            rp.Data.result.recordset.map((data: any, i: any) => {
                                              // console.log('data', data);
                                              // console.log('data.created_date', data.created_date);
                                              // console.log('data.message_log', data.message_log);
                                                messageFollowUpList.push(
                                                    <li key={`messagefollowup-${i}-${this.getDateTime()}`}>
                                                        <div className="date">{data.created_date}</div>
                                                        <div className="type">{data.message_log}</div>
                                                    </li>
                                                );
                                            });
                                            // messageFollowUpList.push( <li key={`messagefollowup-last-${this.getDateTime()}`}>&nbsp;</li> );
                                            ReactDOM.render(messageFollowUpList, document.getElementById('message-followup-list'));
                                            this.setState({ loadingMessageFollowUp: false, totalMessageFollowUp: rp.Data.result.recordset.length });
                    
                                        } else {
                                            ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                            this.setState({ loadingMessageFollowUp: false });
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/messagefollowup/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                        }
                                    } catch(error){
                                        // ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                        this.setState({ loadingMessageFollowUp: false });
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/messagefollowup/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }
                            );
                            
                        });
                        // toastr.success('Loadding Completed!');
                        // this.setState({ loading: false });
                        // this.history.push('/collectors/'+this.state.survey.id);
                        // window.location.reload();
                    } else {
                        // toastr.error(rp.Messages);
                        this.setState({ loading: false });
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                } catch(error){
                    // toastr.error(rp.Messages + ' - something went wrong!');
                    this.setState({ loading: false });
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage fetch BaseService.getJSON /email/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };


    getDateTime(){
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //As January is 0.
        let yyyy = today.getFullYear();
        let HH = today.getHours();
        let MM = today.getMinutes();
        let SS = today.getSeconds();
        let MS = today.getMilliseconds();

        let strDateTime = dd.toString() + '-' + mm.toString() + '-' + yyyy.toString() + '_' + HH.toString() + '-' + MM.toString() + '-' + SS.toString() + '-' + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }
    
    onSave = () => { 
      // console.log(`onSave`, this.state.survey.id);
      // console.log(`onSave`, this.state.collector.id);

        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });
        // jsonObj.members.viewers[newUser] = newValue ;

        // this.state.dataImport.forEach((selectKey: any, index: any) => {
        //   // console.log(`dataImport ${index}`, this.state.dataImport[index]);
        //     this.setState({ email: this.state.dataImport[index] });
        //   // console.log(`email ${index}`, this.state.email.email_address);
        //   // console.log(this.selectUpdate(this.state.dataImport, ['email_address', 'first_name', 'last_name', 'collector_id'], [this.state.email.email_address, this.state.email.first_name, this.state.email.last_name, this.state.email.collector_id]));
            
        // });

        const jwt = getJwtToken();
        this.state.dataImport.map( (object: any, i: any) => {
            // object = { ...object, collector_id: collectorId, index: i+1 };
            // console.log(object);
            BaseService.create<Email>(this.props.match.params.xSite, "/email/", this.selectUpdate(object, ['email_address', 'first_name', 'last_name', 'collector_id', 'customer_id', 'custom_group'], [object.email_address, object.first_name, object.last_name, object.collector_id, object.customer_id, object.custom_group]), jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log(`create ${i}`, object);
                            // toastr.success('Collector created.'); 
                            // this.history.push('/collectors/'+this.state.survey.id);
                            // window.location.reload();
                            // toastr.success('Import Completed!', i);
                            
                            // object = { ...object, sent: 0, responded_name: 'No' };
                            
                            // this.setState({
                            //     loading: false,
                            //     data: ,
                            //     pagination,
                            //     totalData: rp.Data.recordset.length
                            // });

                            if(i === this.state.dataImport.length-1){
                                toastr.success('Import Completed!');
                                window.location.reload();
                            }
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSave BaseService.create<Email> /email/ catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSave BaseService.create<Email> /email/ catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );

            // console.log(this.selectUpdate(object, ['email_address', 'first_name', 'last_name', 'collector_id'], [object.email_address, object.first_name, object.last_name, object.collector_id]));
        });

        // console.log('Import Completed!');
        // toastr.success('Import Completed!'); 

        // BaseService.create<Email>("/email/", this.selectUpdate(this.state.dataImport, ['cutoff_date'], [datetime])).then(
        //     (rp) => {
        //         if (rp.Status) {
        //             toastr.success('Collector created.'); 
        //             // this.history.push('/collectors/'+this.state.survey.id);
        //             window.location.reload();
        //         } else {
        //             toastr.error(rp.Messages);
        //             console.log("Messages: " + rp.Messages);
        //             console.log("Exception: " + rp.Exception);
        //         }
        //     }
        // );
    }

    // public onCreate = (typeNum: any) => { 
    showCollectorModal = (typeId: any) => {
      // console.log(`showCollectorModal ${typeId}`, this.state.collector);
        // const current_survey_id = this.state.survey.id ? this.state.survey.id : '';

        const jwt = getJwtToken();
        BaseService.get<Surveys>(this.props.match.params.xSite, "/collector/typeName/", typeId, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // toastr.success('Survery created.'); 
                        // this.props.history.push(`/${this.props.match.params.xSite}`);
                        // console.log('templateName', rp.Data.recordset[0]);
                        const typeName = parseInt(typeId) !== 4 ? rp.Data.recordset[0].name + ' collector' : 'Post to ' + rp.Data.recordset[0].name;

                        this.setState({
                            visibleCollectorModal: true,
                            visibleMessageModal: false,
                            collectorType: typeName,
                        });

                      // console.log('Create showCollectorModal', this.state);

                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage showCollectorModal BaseService.get<Surveys> /collector/typeName/${typeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage showCollectorModal BaseService.get<Surveys> /collector/typeName/${typeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    showMessageModal = () => {
      // console.log(`showMessageModal`, this.state.collector);
        this.setState({
            visibleMessageModal: true,
            visibleCollectorModal: false
        });
    }

    handleSelectChange = (typeId: any) => {
      // console.log(`handleSelectChange`, typeId);
        this.showCollectorModal(typeId);
    };

    menu = (id: any, typeId: any) => (
        <Menu>
            <Menu.Item key="close">
                <a  href="# " onClick={()=>this.updateStatus(3, 'CLOSED')} style={{ textDecoration: 'none' }}><Icon type="close" /> CLOSE </a>
            </Menu.Item>
            <Menu.Item key="open">
                <a  href="# " onClick={()=>this.updateStatus(2, 'OPEN')} style={{ textDecoration: 'none' }}><Icon type="edit" /> OPEN </a>
            </Menu.Item>
            <Menu.Item key="not_configured">
                <a  href="# " onClick={()=>this.updateStatus(1, 'NOT CONFIGURED')} style={{ textDecoration: 'none' }}><Icon type="stop" />  NOT CONFIGURED </a>
            </Menu.Item>
            {/* <Menu.Item key="delete">
                <a  href="# " onClick={()=>this.updateStatus(0, 'DELETED')} style={{ textDecoration: 'none' }}><Icon type="delete" />  DELETE </a>
            </Menu.Item> */}
        </Menu>
    );

    menuSendReminder = () => (
        <Menu>
            {/* <Menu.Item key="close">
                <a  href="# " onClick={()=>this.updateStatus(4, 'CLOSED')} style={{ textDecoration: 'none' }}>Automate a reminder email</a>
            </Menu.Item> */}
            <SubMenu key="sub3" title="Send a one-off reminder email">
                <Menu.Item key="7"><a  href="# " onClick={()=>this.followUpSendEmails(1)} style={{ textDecoration: 'none' }}>No response</a></Menu.Item>
                <Menu.Item key="8"><a  href="# " onClick={()=>this.followUpSendEmails(2)} style={{ textDecoration: 'none' }}>Partial response</a></Menu.Item>
                <Menu.Item key="9"><a  href="# " onClick={()=>this.followUpSendEmails(3)} style={{ textDecoration: 'none' }}>Both</a></Menu.Item>
            </SubMenu>
            {/* <Menu.Item key="open">
                <a  href="# " onClick={()=>this.updateStatus(2, 'OPEN')} style={{ textDecoration: 'none' }}>Send a one-off reminder email</a>
            </Menu.Item> */}
        </Menu>
    );

    followUpSendEmails = (functionId: any) => {
    
      // console.log('followUpSendEmails functionId', functionId);

        const jwt = getJwtToken();
        BaseService.getJSON(this.props.match.params.xSite, "/email/followup/list/", this.props.match.params.id + `/${functionId}`, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                      // console.log('rp', rp);
                        const message = rp.Messages;

                        if(functionId === 4) { toastr.success(message); return; }
                        //refresh followup list
                        this.setState({ loadingMessageFollowUp: true });
                        ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));

                        BaseService.getJSON(this.props.match.params.xSite, "/email/messagefollowup/list/", this.props.match.params.id, jwt).then(
                            (rp) => {
                                try{
                                    if (rp.Status) {
                                      // console.log('getJSON messagefollowup', rp.Data.result.recordset);
                                      // console.log('getJSON messagefollowup', rp.Data.result.recordset.length);
                                            
                                        if(!rp.Data.result.recordset.length) {
                                            ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                            this.setState({ loadingMessageFollowUp: false }); 
                                            return; 
                                        }
                                        
                                        let messageFollowUpList = [] as any;
                
                                        rp.Data.result.recordset.map((data: any, i: any) => {
                                          // console.log('data', data);
                                          // console.log('data.created_date', data.created_date);
                                          // console.log('data.message_log', data.message_log);
                                            messageFollowUpList.push(
                                                <li key={`messagefollowup-${i}-${this.getDateTime()}`}>
                                                    <div className="date">{data.created_date}</div>
                                                    <div className="type">{data.message_log}</div>
                                                </li>
                                            );
                                        });
                                        // messageFollowUpList.push( <li key={`messagefollowup-last-${this.getDateTime()}`}>&nbsp;</li> );
                                        ReactDOM.render(messageFollowUpList, document.getElementById('message-followup-list'));
                                        this.setState({ loadingMessageFollowUp: false, totalMessageFollowUp: rp.Data.result.recordset.length });

                                        toastr.success(message);
                                    } else {
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage followUpSendEmails BaseService.getJSON /email/messagefollowup/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                        ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                        this.setState({ loadingMessageFollowUp: false });
                                    }
                                } catch(error){
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage followUpSendEmails BaseService.getJSON /email/messagefollowup/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    // ReactDOM.render(<Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/>, document.getElementById('message-followup-list'));
                                    this.setState({ loadingMessageFollowUp: false });
                                }
                            }
                        );
                        
                    } else {
                        // toastr.error(rp.Messages + ' - something went wrong!');
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage followUpSendEmails BaseService.getJSON /email/followup/list/${this.props.match.params.id}/${functionId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                } catch(error){
                    // toastr.error(rp.Messages + ' - something went wrong!');
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage followUpSendEmails BaseService.getJSON /email/followup/list/${this.props.match.params.id}/${functionId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }
      
    updateStatus = (status: any, statusName: any) => {
    
      // console.log('before delete params', this.state.collector);

        // selectUpdate(props.collector, ['status'], [props.collector.id, 3]);

      // console.log(this.selectUpdate(this.state.collector, ['status'], [status]));
        // setState(props.collector.template_id);
        // console.log('after delete params', props.collector);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['survey_id', 'status'], [this.state.survey.id, status]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success("Status updated");
                        // props.history.goBack();
                        this.setState({ collectorStatus: statusName });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage updateStatus BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage updateStatus BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
        //DELETE
        // if(status === 1){
        //     BaseService.delete(this.props.match.params.xSite, "/collector/", this.state.collector.id, jwt).then(
        //         (rp) => {
        //             if (rp.Status) {
        //                 toastr.success(rp.Messages);    
        //                 // window.location.reload();
        //                 this.props.history.push("/collect/list/"+this.state.collector.survey_id);
        //             } else { 
        //                 toastr.error(rp.Messages);
        //                 console.log("Messages: " + rp.Messages);
        //                 console.log("Exception: " + rp.Exception);
        //             }
        //         }
        //     );
        // }
    }

    selectUpdate = (obj: any, selectKeys: any, params: any) => {
        const clone = Object.assign({}, obj);
        // console.log(selectKeys);

        for (const key in obj) {
            let matched = false;

            selectKeys.forEach((selectKey: any, index: any) => {
                // console.log('index', index);
                if(selectKey === key){
                    matched = true;
                    clone[selectKey] = params[index];
                }
            });
            if(!matched) {
                delete clone[key];
                // console.log('delete!');
            }
        }

        return clone;
    }

    onChangeSend = (value: any, dateString: any) => {
      // console.log('onChangeSend Selected Time: ', value);
      // console.log('onChangeSend Formatted Selected Time: ', dateString);

      // console.log('onChangeSend: ', value);
        const datetime = moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
      // console.log('onChangeSend: ', datetime);

        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        // const datetimeForSchedule = moment(datetime, 'YYYY-MM-DD HH:mm:ss').format('YYYY MM DD HH mm ss');
        // console.log('datetimeForSchedule ', datetimeForSchedule);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['send_date'], [datetime]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Send date and time updated!');
                        
                        const datetime = moment(dateString, 'DD-MM-YYYY HH:mm').format();
                      // console.log('onChangeSend datetime', datetime);

                        this.setState({ 
                            sendDateTime : datetime,
                        }, () => {
                              // console.log('onChangeSend this.state.sendDateTime', this.state.sendDateTime);
                            }
                        );
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onChangeSend BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onChangeSend BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    onChangeCutoff = (value: any, dateString: any) => {
      // console.log('onChangeCutoff Selected Time: ', value);
      // console.log('onChangeCutoff Formatted Selected Time: ', dateString);

        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false
        });

      // console.log('onChangeCutoff: ', value);
        const datetime = moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
      // console.log('onChangeCutoff: ', datetime);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['cutoff_date'], [datetime]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Cutoff date and time updated!');
                        const datetime = moment(dateString, 'DD-MM-YYYY HH:mm').format();
                      // console.log('onChangeCutoff datetime', datetime);

                        this.setState({ 
                            cutoffDateTime : datetime,
                        }, () => {
                              // console.log('onChangeCutoff this.state.cutoffDateTime', this.state.cutoffDateTime);
                            }
                        );
                        
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onChangeCutoff BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onChangeCutoff BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }
      
    onCutoffOk = (value: any) => {
      // console.log('onCutoffOk: ', value);
        const datetime = moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      // console.log('onCutoffOk: ', datetime);

        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['cutoff_date'], [datetime]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Cutoff date and time updated!');

                        const cutoffDatetime = moment(datetime, 'YYYY-MM-DD HH:mm:ss').format();
                      // console.log('onCutoffOk cutoffDatetime', cutoffDatetime);

                        this.setState({ 
                            cutoffDateTime : cutoffDatetime,
                        }, () => {
                              // console.log('onCutoffOk this.state.cutoffDateTime', this.state.cutoffDateTime);
                            }
                        );
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onCutoffOk BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onCutoffOk BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    onSendOk = (value: any) => {
      // console.log('onSendOk: ', value);
        const datetime = moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      // console.log('onSendOk: ', datetime);

        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        // const datetimeForSchedule = moment(datetime, 'YYYY-MM-DD HH:mm:ss').format('YYYY MM DD HH mm ss');
        // console.log('datetimeForSchedule ', datetimeForSchedule);
        
        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['send_date'], [datetime]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // toastr.success('Send date and time updated!');

                        const sendDatetime = moment(datetime, 'YYYY-MM-DD HH:mm:ss').format();
                      // console.log('onSendOk sendDatetime', sendDatetime);

                        this.setState({ 
                            sendDateTime : sendDatetime,
                        }, () => {
                              // console.log('onSendOk this.state.sendDateTime', this.state.sendDateTime);
                            }
                        );

                        BaseService.getJSON(this.props.match.params.xSite, "/email/schedulesendemails/list/", this.props.match.params.id, jwt).then(
                            (rp) => {
                                try{
                                    if (rp.Status) {
                                      // console.log('rp', rp);
                                        toastr.success(rp.Messages);
                                    } else {
                                        // toastr.error(rp.Messages + ' - something went wrong!');
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSendOk BaseService.getJSON /email/schedulesendemails/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                } catch(error){
                                    // toastr.error(rp.Messages + ' - something went wrong!');
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSendOk BaseService.getJSON /email/schedulesendemails/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                }
                            }
                        );
                        
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSendOk BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onSendOk BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }
      
    onRadioSendChange = (e: RadioChangeEvent) => {
      // console.log('radio checked', e.target.value);
        this.setState({
            radioSendValue: parseInt(e.target.value),
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['send'], [parseInt(e.target.value)]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Send Updated!');
                        // props.history.goBack();
                        // this.setState({ collectorStatus: statusName });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioSendChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioSendChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    onRadioCutoffChange = (e: RadioChangeEvent) => {
      // console.log('radio checked', e.target.value);
        this.setState({
            radioCutoffValue: parseInt(e.target.value),
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['cutoff'], [parseInt(e.target.value)]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Cutoff Updated!');
                        // props.history.goBack();
                        // this.setState({ collectorStatus: statusName });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioCutoffChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioCutoffChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    callback = (key: any) => {
      // console.log(key);
    }
    
    handleFileChange = (e: any, results: any[]) => {

        try{
            this.setState({
                visibleMessageModal: false,
                visibleCollectorModal: false,
            });

            results.forEach((result: [any, any]) => {
                const [e, file] = result;
                // console.log(file);

                const fileData = e.target.result;
                const wb = XLSX.read(fileData, {type : 'binary'});
                // const oFile = XLSX.read(e.target.result, {type: 'binary', cellDates:true, cellStyles:true});
                // const excelData = XLSX.utils.sheet_to_json(wb.Sheets[0])

                const excelJSON: unknown[] = [];
                wb.SheetNames.forEach(function(sheetName){
                    const rowJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                    // console.log(rowJSON);
                    excelJSON.push(rowJSON);
                });
                
                const excelData: any = excelJSON;
            // console.log(excelData[0]);

                const collectorId = this.state.collector.id;
                const dataImport = excelData[0].map(function (object: any, i: any) {
                    object = { ...object, collector_id: collectorId, index: i+1 };
                    // console.log(object);
                    return object;
                });
                
            // console.log('dataImport', dataImport);
                const paginationImport = { total: excelData[0].length, ...this.state.paginationImport };
                // const paginationImport = { total: excelData[0].length, pageSize: excelData[0].length, hideOnSinglePage: true };
                this.setState({
                    fileName: file.name,
                    loadingImport: false,
                    dataImport: dataImport,
                    paginationImport,
                    totalDataImport: excelData[0].length,
                    importDisabled: false
                });

                toastr.success('Loading Completed!');
            });
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage handleFileChange catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    // componentWillReceiveProps() {
    //   // console.log('componentWillReceiveProps');
    //     // this.messageContent();
    // }
    
    handleInvite = (id: any) => {
      // console.log(`handleInvite id ${id} this.state.collector.type ${this.state.collector.type}`);
        
        this.setState({ 
            isLoadingSubmit: true,
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        const jwt = getJwtToken();
        const obj = { 
            survey_id: this.state.survey.id,
            collector_id: this.state.collector.id,
            type_id: this.state.collector.type,
            id: id
        }

        BaseService.post(this.props.match.params.xSite, "/email/send/invite/", obj, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        this.setState({ isLoadingSubmit: false });
                        toastr.success(rp.Messages);
                        
                        //refresh table data
                        const tableData = this.state.data as any;
                        tableData.map( (object: any, i: any) => { if(tableData[i].id === id) { tableData[i].sent = 1; return; } });
                        this.setState({ data: tableData }, () => { console.log('after setState data', this.state.data); });
                        // ReactDOM.render(<div><p>{this.state.collector.message}</p></div>, document.getElementById('message-content'));
                        // setTimeout(function(){ window.location.reload(); }, 500);
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage handleInvite BaseService.post /email/send/invite/ else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage handleInvite BaseService.post /email/send/invite/ catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    handleDelete = (id: any) => {
      // console.log(`handleDelete id ${id} this.state.collector.type ${this.state.collector.type}`);
        
        this.setState({
            visibleMessageModal: false,
            visibleCollectorModal: false,
        });

        const url = parseInt(this.state.collector.type) === 3 ? '/email/' : '/smse/';
        const jwt = getJwtToken();
        BaseService.delete(this.props.match.params.xSite, url, id, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success(rp.Messages);    
                        setTimeout(function(){ window.location.reload(); }, 500);
                    } else { 
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage handleDelete BaseService.delete ${url}${id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage handleDelete BaseService.delete ${url}${id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    Rename = () => {
        // console.log('Rename');
        this.setState({
            visible: true
        });
    }

    render() {
      // console.log('render');

        const optionsResponse = {
            title: {
                // text: '<span style="font-size: 32px">2</span><br/><span style="font-size: 12px">TOTAL</span><br/><span style="font-size: 12px">RESPONSES</span>',
                text: `${this.state.totalResponses}`,
                verticalAlign: 'middle',
                floating: true,
                y: 30
            },
            // width: '50px',
            // height: '50px',
            tooltip:{
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                // formatter: '{point.name}: <b>{point.percentage:.1f}%</b>'
                // pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            series: [{
                name: "responses",
                // colorByPoint: true,
                type: 'pie',
                data: [
                    // ["complete",50],["partial",50]
                    {name: 'completed', y: this.state.completedResponsesPercent, color: '#00be6f'},
                    {name: 'partial', y: this.state.partialResponsesPercent, color: 'orange' },
                    {name: 'no', y: this.state.noResponsesPercent, color: 'lightgray' },
                ],
                // size: '60%',
            //     width: '50px',
            // height: '50px',
                innerSize: '80%',
                // showInLegend:true,
                dataLabels: {
                    enabled: false
                }
            }]
        }
        
        const optionsInvitation = {
            title: {
                text: `${this.state.totalRecipients}`,
                verticalAlign: 'middle',
                floating: true,
                y: 30
            },
            tooltip:{
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            series: [{
                name: "recipients",
                type: 'pie',
                data: [
                    // ["complete",50],["partial",50]
                    {name: 'invited', y: this.state.invitedRecipientsPercent, color: '#1890ff'},
                    {name: 'not invite yet', y: this.state.noInvitedRecipientsPercent, color: 'lightgray' },
                ],
                innerSize: '80%',
                dataLabels: {
                    enabled: false
                }
            }]
        }

        const columns: ColumnProps<never>[] = [
            {
                title: 'EMAIL',
                dataIndex: 'email_address',
                // sorter: true,
                sorter: (a: { email_address: string }, b: { email_address: string }) => a.email_address.length - b.email_address.length,
                width: '45%',
            },
            {
                title: 'FIRST NAME',
                dataIndex: 'first_name',
                width: '15%',
                sorter: (a: { first_name: string }, b: { first_name: string }) => a.first_name.length - b.first_name.length,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'LAST NAME',
                dataIndex: 'last_name',
                sorter: (a: { last_name: string }, b: { last_name: string }) => a.last_name.length - b.last_name.length,
                // sorter: true,
                width: '15%',
            },
            {
                title: 'CUS ID',
                dataIndex: 'customer_id',
                sorter: (a: { customer_id: string }, b: { customer_id: string }) => a.customer_id.length - b.customer_id.length,
                // sorter: true,
                // width: '5%',
            },
            {
                title: 'CUSTOM GROUP',
                dataIndex: 'custom_group',
                sorter: (a: { custom_group: string }, b: { custom_group: string }) => a.custom_group.length - b.custom_group.length,
                // sorter: true,
                // width: '5%',
            },
            {
                title: 'SENT',
                dataIndex: 'sent',
                // width: '5%',
                render: (sent: any) => sent ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>,
                filters: [
                    { text: 'YES', value: '1' },
                    { text: 'NO', value: '0' }
                ],
                onFilter: (value: any, record: { sent: any }) => record.sent === parseInt(value),
            },
            {
              title: 'RESPONDED',
              dataIndex: 'responded_name',
              render: (responded_name: any) => responded_name === 'Completed' ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : responded_name === 'Partial' ? <Icon type="exclamation-circle" style={{ fontSize: '16px', color: 'orange' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>,
            //   width: '10%',
              filters: [
                { text: 'No', value: 'No' },
                { text: 'Completed', value: 'Completed' },
                { text: 'Partial', value: 'Partial' },
              ],
              onFilter: (value: any, record: { responded_name: any }) => record.responded_name.indexOf(value) === 0,
            },
            {
                title: 'ACTION',
                key: 'action',
                // width: '10%',
                render: (text, record: any) => (
                    <span style={{ textAlign: 'center' }}>
                        <Popconfirm title="Sure to send invite?" onConfirm={() => this.handleInvite(record.id)}>
                            {/* <Button>Invite</Button> */}
                            <Button type="primary" icon="mail" size={'small'} />
                            {/* <a>Invite</a> */}
                        </Popconfirm>
                        &nbsp;
                        {/* <Divider type="horizontal" /> */}
                        {/* <Divider type="vertical" /> */}
                        {/* <br></br> */}
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                            {/* <Button>Delete</Button> */}
                            <Button type="danger" icon="delete" size={'small'} />
                            {/* <a>Delete</a> */}
                        </Popconfirm>
                    </span>
                ),
            },
        ];
        
        const columnsImport: ColumnProps<never>[] = [
            {
                title: 'NO.',
                dataIndex: 'index',
                width: '10%',
            },
            {
                title: 'EMAIL',
                dataIndex: 'email_address',
                width: '30%',
            },
            {
                title: 'FIRST NAME',
                dataIndex: 'first_name',
                width: '20%',
            },
            {
                title: 'LAST NAME',
                dataIndex: 'last_name',
                width: '20%',
            },
            {
                title: 'CUS ID',
                dataIndex: 'customer_id',
                width: '10%',
            },
            {
                title: 'CUSTOM GROUP',
                dataIndex: 'custom_group',
                width: '20%',
            },
        ];

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        // const message = this.state.collector.message ? this.state.collector.message : '';
        
        // const messageContent = message.includes('\n') ? message.split('\n').map((item, i) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{message}</p>];

        // console.log(messageContent);

        const label = parseInt(this.state.collector.type) === 3 ? 'SUBJECT:' : 'SENDER NAME:';

        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (
            <div>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <div className="wds-pageheader" style={{ borderBottom: '1px solid #e8e8e8' }}>
                    <div className="wds-pageheader__text">
                        <h1 className="wds-pageheader__title wds-type--section-title">
                        {/* <span><span id="edit-name-icon" onClick={()=>this.Rename()} className="smf-icon notranslate">W</span> {this.state.survey.nickname}</span> */}
                        <span><Icon type="edit" onClick={()=>this.Rename()}/> {this.state.survey.nickname}</span>
                        </h1>
                    </div>
                </div>

                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'collect'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>

                <div id="overlay" className={ this.state.isLoadingSubmit ? '' : 'hidden'}>
                    <Spin size="large" tip="Loading..."></Spin>
                </div>
                
                <CollectorEditModal 
                history={this.props.history} match={this.props.match}
                collector={this.state.collector}
                listProjects={this.state.listProjects}
                visible={this.state.visibleCollectorModal} 
                collectorType={this.state.collectorType}
                // collectorTypeId={this.state.collectorTypeId}
                // onFieldValueChange={this.onFieldValueChange}
                // onSave={this.onSave}
                />

                <MessageEditModal 
                history={this.props.history} match={this.props.match}
                collector={this.state.collector}
                visible={this.state.visibleMessageModal} 
                />

                <div className="bd logged-in-bd">
                    <div className="container clearfix">
                        <div className="collectors clearfix">
                            <nav className="back-nav">
                                <a href={`/cxm/platform/${this.props.match.params.xSite}/collect/list/${this.state.collector.survey_id}`}>« Back to All Collectors</a>
                            </nav>

                            <main>
                                {/* <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit nickname">{this.state.collector.name}</h1><span id="edit-name-icon" onClick={()=>this.showCollectorModal(this.state.collector.type)} className="smf-icon notranslate">W</span> */}

                                <span>Nickname <Tooltip title={'ผู้ใช้งานระบบเท่านั้นถึงจะเห็นชื่อนี้'}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit nickname">{this.state.collector.nickname}</h1> <span><Icon type="edit" onClick={()=>this.showCollectorModal(this.state.collector.type)}/></span></span>
                                <br></br>
                                <br></br>
                                <span>Display name <Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อนี้ในแบบสอบถาม'}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit display name">{this.state.collector.name}</h1> <span><Icon type="edit" onClick={()=>this.showCollectorModal(this.state.collector.type)}/></span></span>

                                <span id="collector-created-date">Created: {this.state.collector.created_date}</span>
                                
                                <section className="weblink">
                                    <div id="edit-weblink" style={{ margin: '0', border: '0', padding: '0' }}>
                                        <div id="collector-status" className="clearfix">
                                            <div>
                                                Project / Branch : <b>{this.state.listProjects.map((project: any) => { if(project.id === this.state.collector.project_id) return project.name; })} <span><Icon type="edit" onClick={()=>this.showCollectorModal(this.state.collector.type)}/></span></b>
                                            </div>
                                            <Dropdown overlay={this.menu(this.state.collector.id, this.state.collector.type)} trigger={['click']}>
                                                {/* <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none' }} >
                                                    <div className="action-icon-holder more-options null" style={{ textAlign: 'center' }}><span className="action-icon smf-icon" style={{ cursor: 'pointer' }}>.</span></div>
                                                </a> */}
                                                <b>
                                                    {/* <a id="action-menu-link" className={ this.state.collector.status === 3 ? "closed" : ""} href="# ">
                                                        <span id="status-indicator">{this.state.collectorStatus}</span>
                                                    </a> */}
                                                    <span style={{ cursor: 'Pointer' }} className={ this.state.collector.status === 3 ? "closed" : ""}>
                                                        Collector Status : <span style={{ color: 'dodgerblue' }}>{this.state.collectorStatus}</span> <Icon type="edit"/>
                                                    </span>
                                                </b>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </section>


                                <Tabs defaultActiveKey="1" onChange={this.callback} className="tabs collector-tabs">
                                    <TabPane tab="Overview" key="1">
                                        <div className="panels">
                                            <div className="panel open">
                                                <section className="pie-charts">
                                                    
                                                    {/* <article className="invite-data total-invites wds-type--product-ui wds-type-weight--regular">
                                                        <div className="stats">
                                                            <header>
                                                                <h3 className="wds-type--section-title">Invitations</h3>
                                                            </header>
                                                            <ul className="tracking-stats in-chart">
                                                                <li className="">
                                                                    <b className="sl_plural">0</b> bounced (0%)
                                                                    <b className="sl_plural">0</b> Sent invite (0%)
                                                                    <b className="sl_plural">0</b> Responses (0%)
                                                                    <b className="sl_plural">0</b> Responses (0%)
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <figure style={{ marginTop: '20px' }}>
                                                            <div id="invite-pie-chart" data-highcharts-chart="2">
                                                                <div className="highcharts-container" id="highcharts-4" >
                                                                </div>
                                                            </div>
                                                            <figcaption>
                                                            <Progress 
                                                            type="circle"
                                                            strokeColor={{
                                                                '0%': '#108ee9',
                                                                '100%': '#87d068',
                                                            }}
                                                            percent={10} width={130}
                                                            format={percent => `${percent}`}
                                                            />
                                                            <output className="sl_plural wds-type--hero-2 ">3</output>
                                                            <div className="ant-statistic-title" style={{ marginTop: '25px' }}>TOTAL INVITATIONS</div>
                                                            </figcaption>
                                                        </figure>
                                                    </article> */}

                                                    <article className="invite-data total-invites wds-type--product-ui wds-type-weight--regular">
                                                        <div className="stats" style={{ width: '40%' }}>
                                                            <header>
                                                                {/* <h3 className="wds-type--section-title">Invitations</h3> */}
                                                                <h3 className="wds-type--section-title">Recipients</h3>
                                                            </header>
                                                            <ul className="in-chart">
                                                                <li className="invited with-tracking"><b>{this.state.invitedRecipients}</b> invited ({this.state.invitedRecipientsPercent}%)</li>
                                                                {/* <li className="partial with-tracking"><b>1</b> sending (10%)</li> */}
                                                                <li className="bounced with-tracking"><b>{this.state.noInvitedRecipients}</b> not invite yet ({this.state.noInvitedRecipientsPercent}%)</li>
                                                            </ul>
                                                        </div>
                                                        <figure style={{ width: '60%'}}>
                                                            {/* <div id="responses-pie-chart" data-highcharts-chart="3">
                                                                <div className="highcharts-container" id="highcharts-6" >
                                                                </div>
                                                            </div>
                                                            <figcaption> */}

                                                            <HighchartsReact
                                                                highcharts={Highcharts}
                                                                options={optionsInvitation}
                                                                containerProps={{ style: { height: "180px" } }}
                                                            />

                                                            {/* <div className="ant-statistic-title" style={{ marginTop: '0' }}>TOTAL INVITATIONS</div> */}
                                                            <div className="ant-statistic-title" style={{ marginTop: '0' }}>TOTAL RECIPIENTS</div>
                                                            {/* <Progress 
                                                            type="circle"
                                                            strokeColor={{
                                                                '0%': '#108ee9',
                                                                '100%': '#87d068',
                                                            }}
                                                            percent={60} width={120}
                                                            />
                                                            <div className="ant-statistic-title" style={{ marginTop: '10px' }}>TOTAL RESPONSES</div>
                                                                <output className="sl_plural wds-type--hero-2 ">2</output>
                                                            </figcaption> */}
                                                        </figure>
                                                    </article>

                                                    <article className="invite-data total-responses wds-type--product-ui wds-type-weight--regular">
                                                        <div className="stats" style={{ width: '40%' }}>
                                                            <header>
                                                                <h3 className="wds-type--section-title">Responses</h3>
                                                            </header>
                                                            <ul className="in-chart">
                                                                <li className="complete with-tracking"><b>{this.state.completedResponses}</b> completed ({this.state.completedResponsesPercent}%)</li>
                                                                <li className="partial with-tracking"><b>{this.state.partialResponses}</b> partial ({this.state.partialResponsesPercent}%)</li>
                                                                <li className="bounced with-tracking"><b>{this.state.noResponses}</b> no response ({this.state.noResponsesPercent}%)</li>
                                                            </ul>
                                                        </div>
                                                        <figure style={{ width: '60%'}}>
                                                            {/* <div id="responses-pie-chart" data-highcharts-chart="3">
                                                                <div className="highcharts-container" id="highcharts-6" >
                                                                </div>
                                                            </div>
                                                            <figcaption> */}

                                                            <HighchartsReact
                                                                highcharts={Highcharts}
                                                                options={optionsResponse}
                                                                containerProps={{ style: { height: "180px" } }}
                                                            />

                                                            <div className="ant-statistic-title" style={{ marginTop: '0' }}>TOTAL RESPONSES</div>
                                                            {/* <Progress 
                                                            type="circle"
                                                            strokeColor={{
                                                                '0%': '#108ee9',
                                                                '100%': '#87d068',
                                                            }}
                                                            percent={60} width={120}
                                                            />
                                                            <div className="ant-statistic-title" style={{ marginTop: '10px' }}>TOTAL RESPONSES</div>
                                                                <output className="sl_plural wds-type--hero-2 ">2</output>
                                                            </figcaption> */}
                                                        </figure>
                                                    </article>

                                                </section>
                                                
                                                <section className="automated-history wds-type--product-ui wds-type-weight--regular">
                                                    <header>
                                                        <div className="buttons">

                                                            <Dropdown overlay={this.menuSendReminder()} trigger={['click']}>
                                                                <button className="btn-send-reminder wds-button wds-button--icon-right wds-button--sm wds-button--util-light wds-button--arrow-down">
                                                                    SEND REMINDER
                                                                </button>
                                                            </Dropdown>
                                                        </div>
                                                        <h3 className="wds-type--section-title">Follow-up</h3>
                                                    </header>
                                                    <div id="automated-messages-grid" style={{ height: 230, overflowY: 'auto' }}>
                                                        <div className={ this.state.loadingMessageFollowUp ? '' : 'hidden' }> <Spin tip="Loading messages..."></Spin> </div>
                                                        <ul id="message-followup-list">
                                                        </ul>
                                                    </div>
                                                    <footer style={{ paddingTop: 15, borderTop: '1px solid lightgray', fontSize: 16 }}>
                                                        Total messages: {this.state.totalMessageFollowUp}
                                                    </footer>
                                                </section>

                                                <section className="message-history wds-type--product-ui wds-type-weight--regular">
                                                    <header>
                                                        <h3 className="wds-type--section-title">Message History (Invitation)</h3>
                                                    </header>
                                                    <div id="messages-grid" style={{ height: 230, overflowY: 'auto' }}>
                                                        <div className={ this.state.loadingMessageHistory ? '' : 'hidden' }> <Spin tip="Loading messages..."></Spin> </div>
                                                        <ul id="message-history-list">
                                                        </ul>
                                                    </div>
                                                    <footer style={{ paddingTop: 15, borderTop: '1px solid lightgray', fontSize: 16 }}>
                                                        Total messages: {this.state.totalMessageHistory}
                                                    </footer>
                                                </section>
                                                
                                            </div>
                                        </div>
                                    </TabPane>

                                    <TabPane tab="Recipients" key="2">
                                        {/* <Empty style={{ padding: '50px 0' }} description={<span> No messages </span>}/> */}
                                        {/* <div id="email-list-table"></div> */}
                                        <div className="accordion options">
                                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray' }}>
                                                <header>
                                                    <h3>
                                                        <a style={{cursor: 'default'}} className="keyOpener">
                                                            <b>ALL RECIPIENTS</b>
                                                        </a>
                                                    </h3>
                                                </header>

                                                <section id="panel-all-recipients" style={{ height: 'auto' }}>
                                                    
                                                    <div style={{ width: '100%' }}>
                                                        <Button type="primary" className='add-button' style={{ marginBottom: 15 }} onClick={()=>this.followUpSendEmails(4)}>
                                                            SEND ALL (Exclude Sent)
                                                        </Button>
                                                    </div>

                                                    <Table
                                                        style={{ marginTop: '40px' }}
                                                        columns={columns}
                                                        locale={{ emptyText: <Empty description={<span> No Recipients </span>}/> }}
                                                        // size="middle"
                                                        // rowKey={record => record.login.uuid}
                                                        rowKey="id"
                                                        dataSource={this.state.data}
                                                        pagination={this.state.pagination}
                                                        loading={this.state.loading}
                                                        onChange={this.handleTableChange}
                                                        footer={() => 'RECIPIENTS: '+ this.state.totalData}
                                                    />
                                                </section>
                                            </div>
                                        </div>
                                    </TabPane>

                                    <TabPane tab="Message" key="5">
                                        <div className="accordion options">
                                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray' }}>
                                                <header>
                                                    <h3>
                                                        <a  href="# " target="#panel-compose-message" style={{cursor: 'default'}} className="keyOpener">
                                                            <b>COMPOSE MESSAGE:
                                                                &nbsp;
                                                                <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                                                                    title={`หัวเรื่อง และข้อความ ที่ตั้งค่านี้จะถูกส่งไปยังอีเมลของผู้ทำแบบสอบถามที่อยู่ในลิสต์อีเมล`}>
                                                                    <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
                                                                </Tooltip>
                                                            </b>
                                                        </a>
                                                    </h3>
                                                </header>

                                                <section id="panel-compose-message" style={{height: 'auto', paddingBottom: '40px'   }}>
                                                    
                                                    <article id="compose-email" className="reading template" onClick={this.showMessageModal}>

                                                        <header style={{ background: 'none', marginTop: '10px' }}>
                                                            <h5>
                                                                <label className="sm-label">{label}
                                                                    &nbsp;
                                                                    <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                                                                        title={`ผู้ใช้งานระบบสามารถใส่ ตัวแปร สำหรับแสดงผลข้อมูลได้ดังนี้
                                                                        - ชื่อโครงการ : \${ProjectName}
                                                                        - ชื่อช่องทางจัดเก็บ : \${CollectorName}
                                                                        - ชื่อ (ผู้ทำแบบสอบถาม) : \${FirstName}
                                                                        - นามสกุล (ผู้ทำแบบสอบถาม) : \${LastName}
                                                                        * โดยระบบจะดึงข้อมูลจากช่องทางการจัดเก็บ (Collector)
                                                                        ตามที่ผู้ใช้งานระบบได้ตั้งค่าไว้แทน ตัวแปร ข้างต้น`}>
                                                                        <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
                                                                    </Tooltip> 
                                                                </label>
                                                            </h5>
                                                        </header>

                                                        <input value={this.state.collector.subject} id="subject-text" className="subject-text sm-input sm-input--stretch" type="text" style={{ opacity: '1' }} disabled/>
                                                        
                                                        <header className="message-header" style={{ background: 'none', marginTop: '25px' }}>
                                                            <h5 className="sm-label">MESSAGE:
                                                                &nbsp;
                                                                <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                                                                    title={`ผู้ใช้งานระบบสามารถใส่ ตัวแปร สำหรับแสดงผลข้อมูลได้ดังนี้
                                                                    - ชื่อโครงการ : \${ProjectName}
                                                                    - ชื่อช่องทางจัดเก็บ : \${CollectorName}
                                                                    - ชื่อ (ผู้ทำแบบสอบถาม) : \${FirstName}
                                                                    - นามสกุล (ผู้ทำแบบสอบถาม) : \${LastName}
                                                                    * โดยระบบจะดึงข้อมูลจากช่องทางการจัดเก็บ (Collector)
                                                                    ตามที่ผู้ใช้งานระบบได้ตั้งค่าไว้แทน ตัวแปร ข้างต้น`}>
                                                                    <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
                                                                </Tooltip> 
                                                            </h5>
                                                        </header>

                                                        <div id="email-preview" style={{ width: "100%" }}>

                                                            <div style={{ textAlign: "center" }}>
                                                                <table cellPadding="0" cellSpacing="0" style={{ border: "0", width:"100%", textAlign: "center" }}>
                                                                    <tbody>
                                                                        <tr style={{ backgroundColor: this.state.backgroundColor }}>
                                                                            <td colSpan={5} style={{ height: "40" }}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr style={{ backgroundColor: this.state.backgroundColor }}>
                                                                            <td>&nbsp;</td>
                                                                            <td>&nbsp;</td>
                                                                            <td style={{ textAlign: "center", fontSize: '29px', color: '#FFF', fontWeight: 'normal', letterSpacing: '1px', lineHeight: '1' }}>
                                                                                {this.state.survey.name}
                                                                            </td>
                                                                            <td>&nbsp;</td>
                                                                            <td>&nbsp;</td>
                                                                        </tr>

                                                                        <tr style={{ backgroundColor: this.state.backgroundColor }}>
                                                                            <td colSpan={5} style={{ height: "40" }}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td style={{ height: "10" }} colSpan={5}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td colSpan={5} style={{ padding: 0, textAlign: 'center'}}>
                                                                                { this.state.survey.image_src ?
                                                                                <img src={this.state.survey.image_src} style={{ maxWidth: '200px', maxHeight: '180px' }}/>
                                                                                : null}
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td style={{ height: "10" }} colSpan={5}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr>
                                                                            {/* <td>&nbsp;</td> */}
                                                                            <td colSpan={5} align="left" valign="top" style={{ color: '#666666', fontSize: '13px', padding: '10px 20px' }}>

                                                                                {/* <div id="message-content"></div> */}
                                                                                {/* <p>{this.state.collector.message}</p> */}
                                                                                {parse(this.state.collector.message ? this.state.collector.message : `<p></p>`)}

                                                                            </td>
                                                                            {/* <td>&nbsp;</td> */}
                                                                        </tr>

                                                                        <tr>
                                                                            <td colSpan={5} style={{ height: "30" }}>&nbsp;</td>
                                                                        </tr>
                                                                        
                                                                        <tr>
                                                                            <td colSpan={2}>&nbsp;</td>
                                                                            <td colSpan={1}>
                                                                                <a href="# ">
                                                                                    <table cellPadding="0" cellSpacing="0" style={{ width: '30%', margin: '0 auto', textAlign: "center" }}>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td style={{ textAlign:"center", verticalAlign:"center", background: this.state.backgroundColor, borderRadius: '4px', padding: '10px 18px' }}>
                                                                                                    {/* <a href="# " target="_blank" style={{ fontSize: '14px', color: '#FFFFFF', textDecoration: 'none', letterSpacing: '1px', textShadow: '-1px -1px 1px rgba(0, 0, 0, 0.8)' }}>Begin Survey</a> */}
                                                                                                    <div style={{ fontSize: '14px', color: '#FFFFFF', textDecoration: 'none', letterSpacing: '1px', textShadow: '-1px -1px 1px rgba(0, 0, 0, 0.8)' }}>Begin Survey</div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </a>
                                                                            </td>
                                                                            <td colSpan={2}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td colSpan={5} style={{ height: "30" }}>&nbsp;</td>
                                                                        </tr>

                                                                        <tr style={{ verticalAlign:"top", color: '#666666', fontSize: "10px"}}>
                                                                            <td>&nbsp;</td>
                                                                            <td style={{ textAlign:"center", verticalAlign:"top" }} colSpan={3}>
                                                                                <p>Please do not forward this email as its survey link is unique to you. <br/><a href="# " target="_blank" style={{ color: '#333333', textDecoration: 'underline'}}>Privacy</a></p>
                                                                            </td>
                                                                            <td>&nbsp;</td>
                                                                        </tr>

                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </div>
                                                    </article>

                                                    <div className="btn-menu-group" style={{ float: 'right' }}>
                                                        <div className="btn-menu cm-edit wds-button-group">
                                                            <div style={{ width: '100%' }}>
                                                                <Button type="primary" className='add-button' onClick={this.showMessageModal} >
                                                                    EDIT
                                                                </Button>
                                                            </div>
                                                            {/* <a  href="# " role="button" className="wds-button wds-button--ghost-filled wds-button--sm" id="cm-edit" onClick={()=>this.showMessageModal()}>EDIT</a> */}
                                                        </div>
                                                    </div>

                                                </section>
                                            </div>
                                        </div>
                                    </TabPane>

                                    <TabPane tab="Import" key="4">
                                        <div className="accordion options">
                                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray' }}>
                                                <header>
                                                    <h3>
                                                        <a  href="# " target="#panel-preview-import" style={{cursor: 'default'}} className="keyOpener">
                                                            <b>PREVIEW & IMPORT RECIPIENTS:</b>
                                                        </a>
                                                    </h3>
                                                </header>
                                                
                                                <section id="panel-preview-import" style={{ height: 'auto', paddingBottom: '40px' }}>
                                                    <p>Please upload the excel file (*.xlsx). <a href={`/cxm/platform/email-excel-template.xlsx`} target="_blank">Example Here!</a></p>

                                                    <div style={{ width: '40%' }}>
                                                        <FileReaderInput as="binary" onChange={this.handleFileChange}>
                                                            <button style={{ color: 'white', background: 'dodgerblue' }}>Choose file</button> <span>{this.state.fileName}</span>
                                                        </FileReaderInput>
                                                    </div>

                                                    <Table style={{ marginTop: '20px' }}
                                                        columns={columnsImport}
                                                        locale={{ emptyText: <Empty description={<span> Preview Here </span>}/> }}
                                                        // size="middle"
                                                        // rowKey={record => record.login.uuid}
                                                        rowKey="index"
                                                        dataSource={this.state.dataImport}
                                                        pagination={this.state.paginationImport}
                                                        loading={this.state.loadingImport}
                                                        footer={() => 'RECIPIENTS: '+ this.state.totalDataImport}
                                                    />

                                                    <div style={{ width: '100%', borderTop: '1px solid lightgray' }}>
                                                        <Button type="primary" className='add-button' onClick={this.onSave} disabled={this.state.importDisabled} >
                                                            ADD RECIPIENTS
                                                        </Button>
                                                    </div>

                                                </section>
                                            </div>
                                        </div>
                                    </TabPane>

                                    {/* <TabPane tab="Options" key="3">
                                        <div className="accordion options">

                                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray' }}>
                                                <header>
                                                    <h3>
                                                        <a  href="# " target="#panel-cutoff-date" style={{cursor: 'default'}} className="keyOpener">
                                                            <b>CUTOFF DATE AND TIME:</b>
                                                            <span className="collapsed-text" style={{display: 'none'}}>
                                                                On, Wednesday, March 04, 2020 2:45 PM GMT+07:00
                                                            </span>
                                                        </a>
                                                    </h3>
                                                </header>

                                                <section id="panel-cutoff-date" style={{height: 'auto'}}>
                                                    <p>Set a cutoff date and time when this collector will close and stop accepting responses.</p>

                                                    <Radio.Group onChange={this.onRadioCutoffChange} value={this.state.radioCutoffValue}>
                                                        <Radio style={radioStyle} value={1}>
                                                            This collector will close at the following date and time
                                                        </Radio>
                                                        { this.state.radioCutoffValue === 1 ? 
                                                            
                                                            <div id="cutoff-date-module" className="clearfix">
                                                                <div>
                                                                    <label className="sm-label sm-label--stretch"><b>DATE-TIME:</b></label>
                                                                    <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.cutoffDateTime ? moment(this.state.cutoffDateTime, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeCutoff} onOk={this.onCutoffOk} />
                                                                    <span className="timezone" style={{ position: 'static', marginLeft: '15px' }}>Time Zone: GMT+0700 (Bangkok Time)</span>
                                                                </div>
                                                            </div>
                                                            
                                                            : null }
                                                        <Radio style={radioStyle} value={0}>
                                                            Accept responses until you manually close this collector
                                                        </Radio>
                                                    </Radio.Group>
                                                        
                                                </section>
                                            </div>

                                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray', marginTop: '20px' }}>
                                                <header>
                                                    <h3>
                                                        <a  href="# " target="#panel-send-date" style={{cursor: 'default'}} className="keyOpener">
                                                            <b>SEND SURVEY DATE AND TIME:</b>
                                                        </a>
                                                    </h3>
                                                </header>

                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                    <p>Set a send survey date and time for this collector.</p>

                                                    <Radio.Group onChange={this.onRadioSendChange} value={this.state.radioSendValue}>
                                                        <Radio style={radioStyle} value={1}>
                                                            On, send this survey on a specified date and time
                                                        </Radio>
                                                        { this.state.radioSendValue === 1 ? 
                                                            
                                                            <div id="send-date-module" className="clearfix">
                                                                <div>
                                                                    <label className="sm-label sm-label--stretch"><b>DATE-TIME:</b></label>
                                                                    <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.sendDateTime ? moment(this.state.sendDateTime, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeSend} onOk={this.onSendOk} />
                                                                    <span className="timezone" style={{ position: 'static', marginLeft: '15px' }}>Time Zone: GMT+0700 (Bangkok Time)</span>
                                                                </div>
                                                            </div>
                                                            
                                                            : null }
                                                        <Radio style={radioStyle} value={0}>
                                                            Off, manually send
                                                        </Radio>
                                                    </Radio.Group>
                                                        
                                                </section>
                                            </div>

                                        </div>
                                    </TabPane> */}
                                    
                                </Tabs>
                            </main>

                        </div>
                    </div>{/* container clearfix */}
                </div>{/* bd logged-in-bd */}

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visible}
                />

            </div>
        );
    }
}