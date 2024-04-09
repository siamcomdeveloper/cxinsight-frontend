import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../../models/surveys';
import Collector from '../../models/collector';
import BaseService from '../../service/base.service';
import { History } from 'history';
import { getJwtToken } from '../../helper/jwt.helper';
import MenuSurvey from '../../common/menu';
// import { Select, Icon, Dropdown, Menu, Radio, DatePicker, Input } from "antd";
import { Icon, Dropdown, Menu, Radio, DatePicker, Spin, Tooltip } from "antd";
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
// import '../css/wds-charts.4_16_1.min.css';
// import '../css/survey-summary.css';
// import '../css/side-bar.css';
// import '../css/survey-info-stats.css';
// import '../css/status-card-survey-status.css';
// import '../css/status-card-response-count.css';
// import '../css/collector-list.css';

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
    visible: boolean,
    visibleRename: boolean,
    radioValue: number,
    cutoffDateTime: string,
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

      // console.log(this.props.match.params.id);
        BaseService.get<Collector>(this.props.match.params.xSite, '/collector/', this.props.match.params.id, jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log('componentDidMount collectors', rp.Data);
                    const collector = rp.Data.recordset[0];

                    this.setState({ 
                        collector: collector, 
                        collectorStatus: collector.status_name,
                        radioValue: parseInt(collector.cutoff),
                        cutoffDateTime: collector.cutoff_datetime
                    });

                  // console.log('componentDidMount', collector.survey_id);

                    BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', collector.survey_id, jwt).then(
                        (rp) => {
                            if (rp.Status) {
                              // console.log('componentDidMount survey', rp.Data.recordset);
                                this.setState({ survey: rp.Data.recordset[0], isLoading: false });
                            } else {
                                this.setState({ isLoading: false });
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                console.log("Messages: " + rp.Messages);
                                console.log("Exception: " + rp.Exception);
                            }
                        }

                    );

                    // BaseService.get<Surveys>(this.props.match.params.xSite, "/collector/statusName/", rp.Data.recordset[0].status, jwt).then(
                    //     (rp) => {
                    //         if (rp.Status) {
                    //             // console.log('statusName', rp.Data.recordset[0].name);
                    //             this.setState({ collectorStatus: rp.Data.recordset[0].name });
                    //         } else {
                    //             toastr.error(rp.Messages);
                    //             console.log("Messages: " + rp.Messages);
                    //             console.log("Exception: " + rp.Exception);
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect email manage componentDidMount BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/') catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    });// get projects
                    
                } else {
                    this.setState({ isLoading: false });
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
                }
            }

        );

    }

    // onSave = () => { 
    //   // console.log(`onSave`, this.state.survey.id);
    //   // console.log(`onSave`, this.state.collector);

    //     BaseService.create<Collector>(this.props.match.params.xSite, "/collectors/", this.state.collector).then(
    //         (rp) => {
    //             if (rp.Status) {
    //                 toastr.success('Collector created.'); 
    //                 // this.history.push('/collectors/'+this.state.survey.id);
    //                 window.location.reload();
    //             } else {
    //                 toastr.error(rp.Messages);
    //                 console.log("Messages: " + rp.Messages);
    //                 console.log("Exception: " + rp.Exception);
    //             }
    //         }
    //     );
    // }

    // public onCreate = (typeNum: any) => { 
    showModal = (typeId: any) => {
      // console.log(`showModal ${typeId}`, this.state.collector);
        // const current_survey_id = this.state.survey.id ? this.state.survey.id : '';

        const jwt = getJwtToken();
        BaseService.get<Surveys>(this.props.match.params.xSite, "/collector/typeName/", typeId, jwt).then(
            (rp) => {
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
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
                }
            }
        );

    }

    handleSelectChange = (typeId: any) => {
      // console.log(`handleSelectChange`, typeId);
        this.showModal(typeId);
    };

    downloadQR = () => { 
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
    }

    toClipboard = () => {
        /* Get the text field */
        const copyText = document.getElementById("weblink-url") as HTMLInputElement;
      
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      
        /* Copy the text inside the text field */
        document.execCommand("copy");
      
        /* Alert the copied text */
        // alert("Copied the text: " + copyText.value);
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
                if (rp.Status) {
                    toastr.success("Status updated");
                    // props.history.goBack();
                    this.setState({ collectorStatus: statusName });
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
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
                if (rp.Status) {
                    toastr.success('Cutoff date and time updated!');
                    // props.history.goBack();
                    // this.setState({ collectorStatus: statusName });
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
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
                if (rp.Status) {
                    toastr.success('Cutoff Updated!');
                    // props.history.goBack();
                    // this.setState({ collectorStatus: statusName });
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log("Messages: " + rp.Messages);
                    console.log("Exception: " + rp.Exception);
                }
            }
        );
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
                                <span>Nickname <Tooltip title={'ผู้ใช้งานระบบเท่านั้นถึงจะเห็นชื่อนี้'}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit nickname">{this.state.collector.nickname}</h1><span id="edit-name-icon" onClick={()=>this.showModal(this.state.collector.type)} className="smf-icon notranslate">W</span></span>
                                <br></br>
                                <br></br>
                                <span>Display name <Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อนี้ในแบบสอบถาม'}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> : <h1 id="edit-name" className="wds-type--page-title truncate " title="Click to edit display name">{this.state.collector.name}</h1><span id="edit-name-icon" onClick={()=>this.showModal(this.state.collector.type)} className="smf-icon notranslate">W</span></span>

                                <span id="collector-created-date">Link created: {this.state.collector.created_date}</span>
                                
                                <section className="weblink">

                                    <div id="edit-weblink">
                                        <div id="collector-status" className="clearfix">
                                            <div>
                                                Project / Branch : <b>{this.state.listProjects.map((project: any) => { if(project.id === this.state.collector.project_id) return project.name; })} <span id="edit-name-icon" onClick={()=>this.showModal(this.state.collector.type)} className="smf-icon notranslate">W</span></b>
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
                                        
                                        <div className="view-url" data-icon="Ç">
                                            <input className="notranslate" type="text" size={51} value={this.state.collector.link} id="weblink-url" readOnly={true} />
                                            {/* <div className="buttons">
                                                <button id="copy-link-btn" onClick={this.toClipboard}className="wds-button wds-button--sm" data-clipboard-target="#weblink-url">COPY</button>
                                            </div> */}
                                        </div>

                                        {/* <div id="collector-info" className="customize hidden-toggle" collector-id="255031776" old-slug="V6FZ8C3">
                                            <div className="buttons">
                                                <a href="# " className="hidden-toggle wds-button wds-button--upgrade wds-button--sm" href="/pricing/upgrade/?ut_source=wall_custom_link&amp;ut_source2=weblink">UPGRADE</a><a id="slug-save" className="wds-button wds-button--sm">SAVE</a><a id="slug-cancel" className="wds-button wds-button--ghost wds-button--ghost-filled wds-button--sm">CANCEL</a>
                                            </div>
                                            <span className="weblink-domain" data-icon="Ç">
                                                
                                                    <a id="domain-select" className="wds-button wds-button--icon-right wds-button--util wds-button--arrow-down notranslate" domaintype="iconcxm">
                                                        <b className="notranslate" id="weblink-domain-prefixes">https://</b><b className="notranslate" id="weblink-domain">www.iconcxm.com</b>
                                                    </a>
                                                
                                                <span className="notranslate">/r/</span>
                                            </span>
                                            <input id="weblink-slug" size="12" type="text" name="slug" value="V6FZ8C3" readonly="readonly" className="notranslate bg-upgrade" maxlength="100">
                                        </div>
                                         
                                        <p className="chars_remaining wds-type--product-ui wds-type-weight--regular">Up to <span className="sl_plural">100</span>
                                            letters and numbers, underscores, and hyphens. (<span id="characters_left"><span className="sl_plural">93</span> <span className="counter-name">characters</span></span> remaining).</p>
                                        */}
                                        
                                        <div className="share-button-container">
                                            <a  role="button" className="share-button-social-btns twitter-share-button " target="_blank" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.iconcxm.com%2Fr%2FT8SBGGV&amp;text=Please%20take%20the%20survey%20titled%20%22Survey%20Test%22.%20%20Your%20feedback%20is%20important!">
                                                <Icon type="twitter" />
                                            </a>
                                            <a  role="button" className="share-button-social-btns linkedin-share-button " target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Fwww.iconcxm.com%2Fr%2FT8SBGGV&amp;title=Can%20you%20spare%20a%20few%20moments%20to%20take%20my%20survey%3F&amp;summary=Please%20take%20the%20survey%20titled%20%22Survey%20Test%22.%20%20Your%20feedback%20is%20important!">
                                                <Icon type="linkedin" />
                                            </a>
                                            <a  role="button" className="share-button-social-btns fb-share-button" target="_blank" href="# ">
                                                <Icon type="facebook" />
                                            </a>
                                        </div>
                                        
                                    </div>
                                </section>

                                <section className="collector-options weblink" style={{ width: '100%' }}>
                                    <div className="accordion options">

                                        {/* <div className="key open">
                                            <header>
                                                <h3>
                                                    <a  href="# " target="#panel-make-anonymous" style={{cursor: 'default'}} className="keyOpener">
                                                        <b>ANONYMOUS RESPONSES:</b><span className="collapsed-text" style={{display: 'none'}}>Off</span>
                                                    </a>
                                                </h3>
                                            </header>

                                            <section id="panel-make-anonymous" style={{ height: 'auto'}}>
                                                <div className="anonymous-responses-setting-info"></div>
                                                <ul>
                                                    <li>
                                                        <label>
                                                            <input data-model-property="anonymous_type" name="make-anonymous" value="fully_anonymous" type="radio" className="sm-input" data-translate="On" />
                                                            <span className="default-anon-label sm-label">On, your respondents will be anonymous</span>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label>
                                                            <input data-model-property="anonymous_type" name="make-anonymous" value="not_anonymous" type="radio" className="sm-input" data-translate="Off" />
                                                            <span className="default-anon-label sm-label">Off, include respondents' IP addresses in your survey results</span>
                                                            <span className="sso-anon-label sm-label hide">Off, include respondents' SSO profile</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </section>

                                        </div> */}

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

                                                <Radio.Group onChange={this.onRadioChange} value={this.state.radioValue}>
                                                    <Radio style={radioStyle} value={1}>
                                                        {/* On, close this collector on a specified date and time */}
                                                        This collector will close at the following date and time
                                                    </Radio>
                                                    { this.state.radioValue === 1 ? 
                                                        
                                                        <div id="cutoff-date-module" className="clearfix">
                                                            <div>
                                                                <label className="sm-label sm-label--stretch"><b>DATE-TIME:</b></label>
                                                                {/* <label className="datepicker-icon"></label> */}
                                                                {/* defaultValue={moment('2015/01/01', "YYYY-MM-DD")} */}
                                                                {/* defaultValue={ moment(this.state.cutoffDateTime, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm') } */}
                                                                <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.cutoffDateTime ? moment(this.state.cutoffDateTime, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChange} onOk={this.onOk} />
                                                                <span className="timezone" style={{ position: 'static', marginLeft: '15px' }}>Time Zone: GMT+0700 (Bangkok Time)</span>
                                                                {/* <p className="error-msg cloak">Enter a date.</p> */}
                                                            </div>
                                                        </div>
                                                        
                                                        : null }
                                                    <Radio style={radioStyle} value={0}>
                                                        Accept responses until you manually close this collector
                                                    </Radio>
                                                </Radio.Group>
                                                    
                                            </section>
                                        </div>

                                    </div>
                                </section>
                
                                {/* <section className="collector-ads">
                                    <header className="wds-type--section-title">More ways to send</header>
                                    <ul>
                                        <li className="add-email-collector  ">
                                            <a href="# " className="newCollector metric" href="# " collector-type="email" data-icon="M" data-log-action="create_email_collector_icon">
                                                <h3 className="wds-type--card-title">Email</h3>
                                                <p>Ideal for tracking your survey respondents</p>
                                            </a>
                                        </li>
                                        <li className="add-audience-collector  ">
                                            <a href="# " className="newCollector metric" href="# " collector-type="audience" data-icon="g" data-log-action="create_audience_collector_icon">
                                                <h3 className="wds-type--card-title">Buy Targeted Responses</h3>
                                                <p>Find people who fit your criteria</p>
                                            </a>
                                        </li>
                                        <li className="add-facebook-collector  ">
                                            <a href="# " className="newCollector metric" href="# " collector-type="facebook" data-icon="Ñ" data-log-action="create_facebook_collector_icon">
                                                <h3 className="wds-type--card-title">Social Media</h3>
                                                <p>Post your survey on Facebook, LinkedIn, or Twitter</p>
                                            </a>
                                        </li>
                                        <li className="add-website-collector  ">
                                            <a href="# " className="newCollector metric" href="# " collector-type="popup" data-icon="N" data-log-action="create_popup_collector_icon">
                                                <span className="icon website"></span>
                                                <h3 className="wds-type--card-title">Website</h3>
                                                <p>Embed your survey on your website</p>
                                            </a>
                                        </li>
                                        
                                        <li className="add-manual-data  ">
                                            <a href="# " className="newCollector metric" href="# " collector-type="manual_data_entry" data-icon="p" data-log-action="create_manual_collector_icon">
                                                <h3 className="wds-type--card-title">Manual Data Entry</h3>
                                                <p>Manually enter responses</p>
                                            </a>
                                        </li>
                                    </ul>
                                </section> */}
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