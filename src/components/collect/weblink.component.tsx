import React from 'react';
import QRCode from 'qrcode.react';
import * as toastr from 'toastr';
import Surveys from '../../models/surveys';
import Collector from '../../models/collector';
import BaseService from '../../service/base.service';
import { History } from 'history';
import { getJwtToken } from '../../helper/jwt.helper';
import MenuSurvey from '../../common/menu';
import { Icon, Dropdown, Menu, Radio, DatePicker, Spin, Tooltip, InputNumber } from "antd";
import moment from 'moment';

import '../../css/wds-react.4_16_1.min.css';
import '../../css/collectweb-collector_list-bundle-min.5e29c8fb.css';
import '../../css/smlib.globaltemplates-base_nonresponsive-bundle-min.125b4dd4.css';
import '../../css/smlib.ui-global-bundle-min.9feec1b6.css';
import '../../css/collectweb-collector_get-bundle-min.ea15b72a.css';
import '../../css/smlib.ui-global-pro-bundle-min.3a0c69ab.css';

import CollectorEditModal from '../../common/modal/collectorEditModal';
import { RadioChangeEvent } from 'antd/lib/radio';
import HeaderSurvey from '../../common/header';
import Project from '../../models/project';

import SurveyReNicknameModal from '../../common/modal/surveyRenicknameModal';

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
    visible: boolean,
    visibleRename: boolean,
    radioValue: number,
    cutoffDateTime: string,
    projectName: string,
    radioRedoOptionValue: number,
    redoDateValue: number,
}

export default class CollectorLink extends React.Component<IProps, IState> {

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
            visible: false,
            visibleRename: false,
            radioValue: 1,
            cutoffDateTime: '',
            projectName: '',
            radioRedoOptionValue: 0,
            redoDateValue: 1,
        }
        // this.onFieldValueChange = this.onFieldValueChange.bind(this);

    }

    componentDidMount() { 

        try{
            const jwt = getJwtToken();
            if(!jwt){
                this.props.history.push(`/${this.props.match.params.xSite}/login`);
            }

          // console.log(this.props.match.params.id);
            BaseService.get<Collector>(this.props.match.params.xSite, '/collector/', this.props.match.params.id, jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                          // console.log('componentDidMount collectors', rp.Data);

                            if(rp.Data.recordset.length){

                                const collector = rp.Data.recordset[0];

                                this.setState({ 
                                    collector: collector,
                                    collectorStatus: collector.status_name,
                                    radioValue: parseInt(collector.cutoff),
                                    cutoffDateTime: collector.cutoff_datetime,
                                    radioRedoOptionValue: collector.collect_option ? parseInt(collector.collect_option) : 0,
                                    redoDateValue: collector.no_send_in_day ? collector.no_send_in_day : 1,
                                });

                              // console.log('componentDidMount', collector.survey_id);

                                BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', collector.survey_id, jwt).then(
                                    (rp) => {
                                        try{
                                            if (rp.Status) {
                                              // console.log('componentDidMount survey', rp.Data);
                                                this.setState({ survey: rp.Data.recordset[0], isLoading: false });
                                            } else {
                                                this.setState({ isLoading: false });
                                                // toastr.error(rp.Messages);
                                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink componentDidMount BaseService.get<Surveys> /surveys/${rp.Data.recordset[0].survey_id} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            }
                                        }catch(error){ 
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink componentDidMount BaseService.get<Surveys> /surveys/${rp.Data.recordset[0].survey_id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                        }
                                    }

                                );

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
                            }
                            else{
                                this.props.history.push(`/${this.props.match.params.xSite}`);
                            }
                            
                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink componentDidMount BaseService.get<Collector> /collector/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink componentDidMount BaseService.get<Collector> /collector/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }

            );
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    showModal = (typeId: any) => {
      // console.log(`showModal ${typeId}`, this.state.collector);
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
                            visible: true,
                            collectorType: typeName,
                        });

                      // console.log('Create showModal', this.state);

                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink showModal BaseService.get<Surveys> /collector/typeName/${typeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink showModal BaseService.get<Surveys> /collector/typeName/${typeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    handleSelectChange = (typeId: any) => {
      // console.log(`handleSelectChange`, typeId);
        this.showModal(typeId);
    };

    downloadQR = () => { 
        try{
            const canvas = document.getElementById("qrcode") as HTMLCanvasElement;
            if(canvas){
                const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                let downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = "qrlink.png";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink downloadQR catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    toClipboard = () => {
        try{
            /* Get the text field */
            const copyText = document.getElementById("weblink-url") as HTMLInputElement;
        
            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
        
            /* Copy the text inside the text field */
            document.execCommand("copy");
        
            /* Alert the copied text */
            // alert("Copied the text: " + copyText.value);
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink toClipboard catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }


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
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink updateStatus BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink updateStatus BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
        //DELETE
        // if(status === 1){
        //     BaseService.delete(this.props.match.params.xSite, "/collector/", this.state.collector.id, jwt).then(
        //         (rp) => {
        //             if (rp.Status) {
        //               // console.log(rp);
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

    onChange = (value: any, dateString: any) => {
      // console.log('Selected Time: ', value);
      // console.log('Formatted Selected Time: ', dateString);
    }
      
    onOk = (value: any) => {
      // console.log('onOk: ', value);
        const datetime = moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      // console.log('onOk: ', datetime);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['cutoff_date'], [datetime]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Cutoff date and time updated!');
                        // props.history.goBack();
                        // this.setState({ collectorStatus: statusName });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink onOk BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink onOk BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }
      
    onRadioChange = (e: RadioChangeEvent) => {
      // console.log('radio checked', e.target.value);
        this.setState({
            radioValue: parseInt(e.target.value),
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
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink onRadioChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `weblink onRadioChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    onRadioRedoOptionChange = (e: RadioChangeEvent) => {
        // console.log('radio checked', e.target.value);
        this.setState({
            radioRedoOptionValue: parseInt(e.target.value),
        });

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['collect_option', 'no_send_in_day'], [parseInt(e.target.value), this.state.redoDateValue]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success('Colector Option Updated!');
                        // props.history.goBack();
                        // this.setState({ collectorStatus: statusName });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    };

    onRedoDateChange = (value: any) => {
        if(value){
            // console.log('onRedoDateChange', value);
            this.setState({
                redoDateValue: value,
            });
            if(this.state.radioRedoOptionValue === 2){
                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['no_send_in_day'], [value]), jwt).then(
                    (rp) => {
                        try{
                            if (rp.Status) {
                                toastr.success('Colector Option Updated!');
                                // props.history.goBack();
                                // this.setState({ collectorStatus: statusName });
                            } else {
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            }
                        }catch(error){ 
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    }
                );
            }else{
                this.setState({
                    radioRedoOptionValue: 2,
                });
                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['collect_option', 'no_send_in_day'], [2, value]), jwt).then(
                    (rp) => {
                        try{
                            if (rp.Status) {
                                toastr.success('Colector Option Updated!');
                                // props.history.goBack();
                                // this.setState({ collectorStatus: statusName });
                            } else {
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            }
                        }catch(error){ 
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage onRadioRedoOptionChange BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    }
                );
            }
        }
    };

    Rename = () => {
        // console.log('Rename');
        this.setState({
            visibleRename: true
        });
    }

    render() {

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

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

                <CollectorEditModal 
                history={this.props.history} match={this.props.match}
                collector={this.state.collector}
                listProjects={this.state.listProjects}
                visible={this.state.visible} 
                collectorType={this.state.collectorType}
                // collectorTypeId={this.state.collectorTypeId}
                // onFieldValueChange={this.onFieldValueChange}
                // onSave={this.onSave}
                />

                <div className="bd logged-in-bd">
                    <div className="container clearfix">
                        <div className="collectors clearfix">
                            <nav className="back-nav">
                                <a href={`/cxm/platform/${this.props.match.params.xSite}/collect/list/${this.state.collector.survey_id}`}>« Back to All Collectors</a>
                            </nav>

                            <main>
                                <span>Nickname <Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit nickname">{this.state.collector.nickname}</h1> <span><Icon type="edit" onClick={()=>this.showModal(this.state.collector.type)}/></span></span>
                                <br></br>
                                <br></br>
                                <span>Display name <Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit display name">{this.state.collector.name}</h1> <span><Icon type="edit" onClick={()=>this.showModal(this.state.collector.type)}/></span></span>

                                <span id="collector-created-date">Link created: {this.state.collector.created_date}</span>
                                
                                <section className="weblink">

                                    <div id="edit-weblink">
                                        <div id="collector-status" className="clearfix">
                                            <div>
                                                Project / Branch : <b>{this.state.listProjects.map((project: any) => { if(project.id === this.state.collector.project_id) return project.name; })} <span><Icon type="edit" onClick={()=>this.showModal(this.state.collector.type)}/></span></b>
                                            </div>
                                            <Dropdown overlay={this.menu(this.state.collector.id, this.state.collector.type)} trigger={['click']}>
                                                  
                                                <b>
                                                    <span style={{ cursor: 'Pointer' }} className={ this.state.collector.status === 3 ? "closed" : ""}>
                                                        Collector Status : <span style={{ color: 'dodgerblue' }}>{this.state.collectorStatus}</span> <Icon type="edit"/>
                                                    </span>
                                                </b>
                                            </Dropdown>
                                        
                                        </div>
                                        
                                        <div className="view-url">
                                            <Icon type="link" style={{ fontSize: '24px' }}/> &nbsp;
                                            <input className="notranslate" type="text" size={51} value={this.state.collector.link} id="weblink-url" readOnly={true} />
                                            <div className="buttons">
                                                {/* <a id="url-customize" className="btn-small btn ">CUSTOMIZE</a> */}
                                                <button id="copy-link-btn" onClick={this.toClipboard}className="wds-button wds-button--sm" data-clipboard-target="#weblink-url">COPY</button>
                                            </div>
                                        </div>

                                        <div id="qrcode-container">
                                            <QRCode 
                                            value={this.state.collector.link} 
                                            size={160} 
                                            id="qrcode"
                                            includeMargin={true}
                                            style={{ display: 'none' }} />

                                            <button id="download-qr" onClick={this.downloadQR} className="wds-button wds-button--sm wds-button--util wds-button--icon-left">DOWNLOAD QR CODE</button>
                                            <div id="qrcode"></div>
                                            <a href="# " className="q " data-help="qrcode-popout">
                                                {/* <span className="notranslate">?</span> */}
                                            </a>
                                        </div>
                                        
                                    </div>
                                </section>

                            </main>

                        </div>
                    </div>{/* container clearfix */}
                </div>{/* bd logged-in-bd */}

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visibleRename}
                />

            </div>
        );
    }
}