import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import MenuSurvey from '../common/menu';
import { Spin, Radio, Tooltip, Icon } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
// import CollectorRow from "../common/collector/collectorRow";
import SummaryCollectorRow from "../common/collector/summaryCollectorRow";
import HeaderSurvey from '../common/header';
import SurveyReNicknameModal from '../common/modal/surveyRenicknameModal';

import '../css/wds-react.4_16_1.min.css';
// import '../css/wds-charts.4_16_1.min.css';
import '../css/survey-summary.css';
import '../css/side-bar.css';
import '../css/survey-info-stats.css';
import '../css/status-card-survey-status.css';
import '../css/status-card-response-count.css';
import '../css/collector-list.css';
import Collector from '../models/collector';
import { Empty } from 'antd';
import ReactDOM from 'react-dom';

import { isNull } from "util";

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
    survey: Surveys,
    listCollectors: Array<Collector>,
    isLoading: boolean,
    totalCollectors: number,
    lang: any,
    visible: boolean
}


export default class Summary extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            listCollectors: [],
            isLoading: true,
            totalCollectors: 0,
            lang: 0,
            visible: false
        }
        this.onFieldValueChange = this.onFieldValueChange.bind(this);

    }

    private onFieldValueChange(fieldName: string, value: any) { 
        const nextState = {
            ...this.state,
            survey: {
                ...this.state.survey,
                [fieldName]: value,
            }
        };

        this.setState(nextState);
    }

    public async componentDidMount() { 

        try{

          // console.log('summary componentDidMount');

            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);
            
            if( [1,4].includes(userData.ro) ) authorized = true;
            else if( [2,3].includes(userData.ro) ){
                if( userData.rs.includes('/') ) userData.rs.split('/').map((entity: any, i: any) => { if(parseInt(entity) === parseInt(this.props.match.params.id)) authorized = true; });
                else if(parseInt(userData.rs) === parseInt(this.props.match.params.id)) authorized = true;
            }
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

            document.body.id = 'summary';
            document.body.classList.toggle('translate', false);
            document.body.classList.toggle('step2', false);
            document.body.classList.toggle('basic', false);
            document.body.classList.toggle('modern-browser', false);
            document.body.classList.toggle('themeV3', false);
            document.body.classList.toggle('sticky', false);
            
            BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.id, jwtToken).then(
                (rp: any) => {
                    try{
                        if (rp.Status) {
                          // console.log('summary componentDidMount rp.Data', rp.Data);
                            this.setState({ survey: rp.Data.recordset[0], isLoading: false, lang: rp.Data.recordset[0].multi_lang ? 1 : 0 });
                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Summary componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp: any) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Summary componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp: any) => { console.log(`catch: ${error}`); });
                    }
                }

            );

            BaseService.get<Collector>(this.props.match.params.xSite, '/collector/list/', this.props.match.params.id, jwtToken).then(
                (rp: any) => {
                    try{
                        if (rp.Status) {
                            this.setState({ isLoading: false });
                          // console.log('summary componentDidMount collectors', rp.Data);
                          // console.log('summary componentDidMount collectors', rp.Data.recordset);
                            this.setState({ listCollectors: rp.Data.recordset, totalCollectors: rp.Data.recordset.length });
                            this.collectorList();
                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Summary componentDidMount BaseService.get<Collector> /collector/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp: any) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Summary componentDidMount BaseService.get<Collector> /collector/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp: any) => { console.log(`catch: ${error}`); });
                    }
                }

            );

            //remove ant-modal-root child to fix a modal showing when switch between pages
            const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
            // console.log('allAntModalRootElement', allAntModalRootElement);
            if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });
            
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'Summary componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp: any) => { console.log(`catch: ${error}`); });
        }

    }

    collectorList = () => {

      // console.log(`collectorList`);
        if(this.state.totalCollectors > 0){

            const collectorList: JSX.Element[] = [];
        
            collectorList.push(<div key={`collectorItem-`+this.getDateTime()}>{this.collectorItems()}</div>);
            // collectorList.push(<footer key='footer' style={{margin: '0'}} className="collectors-footer wds-type--product-ui wds-type-weight--regular"><b>COLLECTORS</b>: {this.state.totalCollectors} of {this.state.totalCollectors}</footer>);

            try{
                ReactDOM.render(<div key={`collectorList-`+this.getDateTime()}>{collectorList}</div>, document.getElementById('collector-items-list'));
            }
            catch(error){
                toastr.error('Something went wrong!, please refresh the page or try again later.');
                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'Summary collectorList catch', message: `catch: ${error}` }, getJwtToken()).then( (rp: any) => { console.log(`catch: ${error}`); });
            }
        }
        else{
            ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('collector-items-list'));
        }
    }

    collectorItems = () => {
      // console.log('collectorItems', this.state.listCollectors);
        try{
            const collectorItems: JSX.Element[] = [];

            this.state.listCollectors.map( (object, i) => {
              // console.log(i, object.active);
                collectorItems.push(<SummaryCollectorRow collector={object} key={i} history={this.props.history} match={this.props.match}/>);
            });

            return collectorItems;
        }
        catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'Summary collectorItems catch', message: `catch: ${error}` }, getJwtToken()).then( (rp: any) => { console.log(`catch: ${error}`); });
        }
    }

    surveyStatusColor(status: any) {
        switch (status) {
            case 1: //1 = Draft
            return <div className="sm-status-card-survey-status__indicator sm-status-card-survey-status__indicator--draft">•</div>
            case 2: //2 = Open
            return <div className="sm-status-card-survey-status__indicator sm-status-card-survey-status__indicator--open">•</div>
            default: //0 = Deleted and 3 = Closed
            return <div className="sm-status-card-survey-status__indicator sm-status-card-survey-status__indicator--closed">•</div>
        }
    }
    surveyStatus(status: any) {
        switch (status) {
            case 1: //1 = Draft
            return <div className="sm-status-card-survey-status__overall-status sm-status-card-survey-status__overall-status--draft">{ this.state.survey.status_name }</div>
            case 2: //2 = Open
            return <div className="sm-status-card-survey-status__overall-status sm-status-card-survey-status__overall-status--open">{ this.state.survey.status_name }</div>
            default: //0 = Deleted and 3 = Closed
            return <div className="sm-status-card-survey-status__overall-status sm-status-card-survey-status__overall-status--closed">{ this.state.survey.status_name }</div>
        }
    }
 
    getDateTime(){
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //As January is 0.
        let yyyy = today.getFullYear();
        let HH = today.getHours();
        let MM = today.getMinutes();
        let SS = today.getSeconds();
        let MS = today.getMilliseconds();

        let strDateTime = dd.toString() + mm.toString() + yyyy.toString() + HH.toString() + MM.toString() + SS.toString() + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }

    onSubsciberEdit(){
        //ReactDOM.render(<SummarySubscriberModal key={this.getDateTime()} visible={true} survey={this.state.survey} history={this.props.history} match={this.props.match}/>, document.getElementById('modal-render'));
    }

    onRadioLanguageChange = (e: RadioChangeEvent) => {
        // console.log('onRadioLanguageChange', e.target.value);
        this.setState({
            lang: parseInt(e.target.value),
        }, () => {

            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['multi_lang'], [this.state.lang]), jwt).then(
                (rp: any) => {
                    if (rp.Status) {
                        // console.log(rp: any);
                        toastr.success(rp.Messages);
                        // setInterval(function(){ window.location.reload(); }, 500);
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Summary onRadioLanguageChange BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp: any) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }
            );
        });
    };

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

    Rename = () => {
        // console.log('Rename');
        this.setState({
            visible: true
        });
    }

    render() {
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (
            <div>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <div className="wds-pageheader">
                    <div className="wds-pageheader__text">
                        <h1 className="wds-pageheader__title wds-type--section-title">
                            {/* <span><span id="edit-name-icon" onClick={()=>this.Rename()} className="smf-icon notranslate">W</span> {this.state.survey.nickname}</span> */}
                            <span><Icon type="edit" onClick={()=>this.Rename()} /> {this.state.survey.nickname}</span>
                        </h1>
                    </div>
                </div>

                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'summary'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>

                <div id="modal-render"></div>

                {/* Start sm-survey-summary body */}
                <div className="sm-survey-summary">
                    <div className="wds-grid sm-survey-summary__grid">

                        {/* Start wds-grid__row */}
                        <div className="wds-grid__row">
                            {/* Start wds-grid__col-12 */}
                            <div className="wds-grid__col wds-grid__col-lg-3 wds-grid__col-12">
                                
                                <div className="wds-type--section-title sm-survey-summary__card-title">
                                    Survey Design
                                </div>

                                <div className="wds-card sm-survey-summary__card sm-side-bar__card">
                                    <div className="wds-grid wds-grid--no-bleeds wds-grid--no-gutters">
                                        
                                        <div className="wds-grid__row sm-side-bar__card-item-summary">
                                            {/* Survey Name */}
                                            <div className="wds-w-100 sm-side-bar__survey-info-header">
                                                {/* <span className="wds-type--body-sm">Display name : <Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อนี้บนแบบสอบถาม'}><Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip></span> */}
                                                <span className="wds-type--body-sm">Display name : </span>
                                                <div className="wds-type--card-title sm-side-bar__survey-info-header--title">
                                                    {this.state.survey.name}
                                                </div>
                                                <span className="wds-type--body-sm">Created on {this.state.survey.created_date}</span>
                                            </div>
                                            {/* PAGES &  QUESTIONS*/}
                                            <div className="wds-flex wds-flex--inline wds-w-100 sm-survey-info-stats">
                                                <span className="sm-survey-info-stats__cell wds-w-50">
                                                    <div className="wds-type--section-title sm-survey-info-stats__cell--value wds-m-b-1 font-number-custom"><b>{this.state.survey.num_page}</b></div>
                                                    <span className="wds-type--body-sm sm-survey-info-stats__cell--label">PAGES</span>
                                                </span>
                                                <span className="sm-survey-info-stats__cell wds-w-50">
                                                    <div className="wds-type--section-title sm-survey-info-stats__cell--value wds-m-b-1 font-number-custom"><b>{this.state.survey.num_question}</b></div>
                                                    <span className="wds-type--body-sm sm-survey-info-stats__cell--label">QUESTIONS</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Template Name */}
                                        <div className="wds-grid__row sm-side-bar__card-item-text">
                                            {/* <span className="wds-type--body-sm" style={{ display: 'block', paddingBottom: '15px'}}>Project: <b>{this.state.survey.project_name}</b></span> */}
                                            <span className="wds-type--body-sm" style={{ display: 'block', paddingBottom: '15px'}}>Template: <b>{this.state.survey.template_name}</b></span>
                                            {/* <span className="wds-type--body-sm" style={{ display: 'block'}}>Template: <b>{this.state.survey.template_name}</b></span> */}

                                            {/* <span className="wds-type--body-sm" style={{ display: 'block', paddingBottom: '5px'}}>Survey Language:</span>
                                            <Radio.Group buttonStyle="solid" style={{ paddingBottom: 0 }} onChange={this.onRadioLanguageChange} value={this.state.lang}>
                                                <Radio.Button value={0}>Single Language</Radio.Button>
                                                <Radio.Button value={1}>Multiple Languages</Radio.Button>
                                            </Radio.Group> */}
                                        </div>

                                        <div className="wds-grid__row sm-side-bar__card-item-action">
                                            <ul className="wds-list wds-list--no-rules wds-list--interactive wds-list--dense wds-w-100 sm-side-bar__card-item-action--list">
                                                {/* EDIT DESIGN */}
                                                <li className="wds-list__row">
                                                    <a href={`/cxm/platform/${this.props.match.params.xSite}/design/${this.state.survey.id}`} className="wds-list__item" role="button">
                                                        <div className="wds-list__addon">
                                                            {/* <span className="wds-icon sm-side-bar__card-item-action--icon" aria-hidden="true">W</span> */}
                                                            <Icon type="edit"/>
                                                        </div>
                                                        <span className="wds-list__label">EDIT DESIGN</span>
                                                    </a>
                                                </li>
                                                {/* PREVIEW SURVEY */}
                                                <li className="wds-list__row">
                                                    <a href={`/cxm/platform/${this.props.match.params.xSite}/preview/${this.state.survey.id}`} target="_blank" className="wds-list__item" role="button">
                                                        <div className="wds-list__addon">
                                                            {/* <span className="wds-icon sm-side-bar__card-item-action--icon" aria-hidden="true">Ç</span> */}
                                                            <Icon type="eye"/>
                                                        </div>
                                                        <span className="wds-list__label">PREVIEW SURVEY</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                                {/* <div className="sm-ucs-module__content-container sm-ucs-module__wds-summary-override"></div> */}

                            </div>
                            {/* End wds-grid__col-12 */}

                            {/* Start wds-grid__col-12 */}
                            <div className="wds-grid__col wds-grid__col-lg-9 wds-grid__col-12">

                                <div className="wds-grid__row">
                                    <div className="wds-grid__col wds-grid__col-lg-8 wds-grid__col-md-6 wds-grid__col-9">
                                        <div className="wds-type--section-title sm-survey-summary__card-title">Responses and Status</div>
                                    </div>
                                    <div className="wds-grid__col wds-grid__col-lg-4 wds-grid__col-md-6">
                                        <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/browse/${this.state.survey.id}` } className="wds-button wds-button--primary wds-button--solid wds-button--md wds-float--right">ANALYZE RESULTS</a>
                                    </div>
                                </div>

                                <div className="wds-grid__row wds-m-b-3">

                                    <div className="wds-m-t-3 wds-grid__col wds-grid__col-lg-4 wds-grid__col-md-6 wds-grid__col-12">
                                        <div className="wds-card sm-status-card-survey-status__item">
                                            <div className="wds-card__body">
                                                <span className="wds-type--body-sm">TOTAL RESPONSES</span>
                                                <div className="wds-type--section-title">
                                                    <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/browse/${this.state.survey.id}` } className="sm-status-card-response-count font-number-custom">{this.state.survey.total_responses}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="wds-m-t-3 wds-grid__col wds-grid__col-lg-4 wds-grid__col-md-6 wds-grid__col-12">
                                        <div className="wds-card sm-status-card-survey-status__item">
                                            <div className="wds-card__body">
                                                <div className="sm-status-card-survey-status__item-label-container">
                                                    <span className="wds-type--body-sm sm-status-card-survey-status__item-label-text">OVERALL SURVEY STATUS</span>
                                                    { this.surveyStatusColor(this.state.survey.status) }
                                                </div>
                                                <div className="wds-type--section-title">
                                                    {/* <a href="# " className="sm-status-card-survey-status__overall-status sm-status-card-survey-status__overall-status--open" href="/collect/list">{ this.state.survey.status_name }</a> */}
                                                    { this.surveyStatus(this.state.survey.status) }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="wds-m-t-3 wds-grid__col wds-grid__col-lg-4 wds-grid__col-md-12">
                                        <div className="wds-card sm-status-card-survey-status__item">
                                            <div className="wds-card__body">
                                                <span className="wds-type--body-sm wds-m-r-2">NOTIFICATIONS</span>
                                                <span className="wds-has-popout">
                                                    <div className="wds-popout--top wds-popout wds-popout--sm"></div>
                                                </span>
                                                <div className="sm-status-card-response-alerts__status">
                                                    <div className="sm-status-card-response-alerts__status-text wds-m-t-3 wds-m-b-4">Only you</div>
                                                    <div className="sm-status-card-response-alerts__status-text wds-m-t-3 wds-m-b-4">{this.state.survey.subscriber === "" || isNull(this.state.survey.subscriber) ? `Only you` : `You and ${this.state.survey.subscriber ? this.state.survey.subscriber.includes(",") ? this.state.survey.subscriber.split(',').length : '1' : '1'} other`}</div>
                                                    <span className="wds-has-popout wds-has-popout--clickable">
                                                        <span className="wds-popout__trigger"><a href="# " onClick={ (e) => { e.preventDefault(); this.onSubsciberEdit()} }className="sm-status-card-response-alerts__status-link">Edit</a></span>
                                                        <div className="wds-popout--bottom wds-popout wds-popout--sm"></div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                </div>

                                {/* Collector Card */}
                                <div className="wds-grid__row">
                                    <div className="wds-grid__col wds-grid__col-lg-8 wds-grid__col-6">
                                        <div className="wds-type--section-title sm-survey-summary__card-title">Collectors</div>
                                    </div>
                                </div>

                                <div id="collector-items-list"></div>
                                
                                {/* <div className="wds-card sm-collector-card sm-survey-summary__card">
                                    <div className="wds-card__body">
                                        <div className="sm-collector-card__responses-container wds-float--right">
                                            <div className="sm-collector-card__responses-count">0</div>
                                            <div className="sm-collector-card__responses-label wds-m-t-1">
                                                <span className="wds-type--body-sm"><span>RESPONSES <br/> COLLECTED</span></span>
                                            </div>
                                        </div>
                                        <div className="wds-float--left sm-collector-card__info">
                                            <div className="wds-type--card-title wds-m-t-3 sm-collector-card__title">
                                                <a href={`/cxm/platform/${this.props.match.params.xSite}/collector/${this.state.survey.id}`} title="Web Link 2">Web Link 2</a>
                                            </div>
                                            <div className="sm-collector-card__date-created">
                                                <span className="wds-type--body-sm">Created: 2/11/2020</span>
                                            </div>
                                        </div>
                                        <div className="sm-collector-card__status">
                                            <span className="sm-collector-card__status-badge sm-collector-card__status-badge--secondary">CLOSED</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="wds-card sm-collector-card sm-survey-summary__card">
                                    <div className="wds-card__body">
                                        <div className="sm-collector-card__responses-container wds-float--right">
                                            <div className="sm-collector-card__responses-count">1</div>
                                                <div className="sm-collector-card__responses-label wds-m-t-1"><span className="wds-type--body-sm"><span>RESPONSES <br/> COLLECTED</span></span>
                                            </div>
                                        </div>
                                        <div className="wds-float--left sm-collector-card__info">
                                            <div className="wds-type--card-title wds-m-t-3 sm-collector-card__title">
                                                <a href={`/cxm/platform/${this.props.match.params.xSite}/collector/${this.state.survey.id}`} title="Email Invitation 1">Email Invitation 1</a>
                                            </div>
                                            <div className="sm-collector-card__date-created">
                                                <span className="wds-type--body-sm">Created: 2/5/2020</span>
                                            </div>
                                        </div>
                                        <div className="sm-collector-card__status">
                                            <span className="sm-collector-card__status-badge sm-collector-card__status-badge--primary">OPEN</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="wds-card sm-collector-card sm-survey-summary__card">
                                    <div className="wds-card__body">
                                        <div className="sm-collector-card__responses-container wds-float--right">
                                            <div className="sm-collector-card__responses-count">0</div>
                                            <div className="sm-collector-card__responses-label wds-m-t-1">
                                                <span className="wds-type--body-sm"><span>RESPONSES <br/> COLLECTED</span></span>
                                            </div>
                                        </div>
                                        <div className="wds-float--left sm-collector-card__info">
                                            <div className="wds-type--card-title wds-m-t-3 sm-collector-card__title">
                                                <a href={`/cxm/platform/${this.props.match.params.xSite}/collector/${this.state.survey.id}`} title="Web Link 1">Web Link 1</a>
                                            </div>
                                            <div className="sm-collector-card__date-created">
                                                <span className="wds-type--body-sm">Created: 2/11/2020</span>
                                            </div>
                                        </div>
                                        <div className="sm-collector-card__status">
                                            <span className="sm-collector-card__status-badge sm-collector-card__status-badge--primary">OPEN</span>
                                        </div>
                                    </div>
                                </div> */}
                                {/* End Collector Card */}

                                {/* <div className="wds-grid__row">
                                    <div className="wds-grid__col wds-grid__col-lg-8 wds-grid__col-6">
                                        <div className="wds-type--section-title sm-survey-summary__card-title">Responses Volume</div>
                                    </div>
                                </div>

                                <div className="wds-card sm-survey-summary__card">
                                    <div className="wds-card__body">
                                        <div className="wds-flex wds-flex--x-end wds-p-3">
                                            <span className="wds-type--dark-muted">2/5/2020 - 2/6/2020</span>
                                        </div>
                                        <div className="bar-chart">
                                            <div className="wds-chart">
                                                <div style={{height: '240px', width: '100%', position: 'relative'}}>
                                                    <div style={{overflow: 'visible', height: '0px', width: '0px'}}>
                                                    <div className="rv-xy-plot wds-plot wds-chart--bar wds-chart--vertical wds-chart--interactive" style={{width: '946px' height: '240px'}}><svg className="rv-xy-plot__inner" width="946" height="240"><g className="rv-xy-plot__series rv-xy-plot__series--bar " transform="translate(34,8)"><rect x="7.683999999999964" width="29.832000000000004" y="160" height="0" style={{opacity: '1', stroke: 'rgb(0, 191, 111)', fill: 'rgb(0, 191, 111)'}}></rect><rect x="52.883999999999965" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="98.08399999999997" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="143.284" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="188.48399999999998" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="233.68399999999997" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="278.884" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="324.084" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="369.284" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="414.484" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="459.68399999999997" width="29.832000000000004" y="31.999999999999993" height="128" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="504.88399999999996" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="550.084" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="595.284" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="640.484" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="685.6839999999999" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="730.8839999999999" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="776.084" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="821.284" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect><rect x="866.484" width="29.832000000000004" y="160" height="0" style="opacity: 1; stroke: rgb(0, 191, 111); fill: rgb(0, 191, 111);"></rect></g><g transform="translate(34,168)" className="rv-xy-plot__axis rv-xy-plot__axis--horizontal wds-chart__axis-line"><line x1="0" x2="904" y1="0" y2="0" className="rv-xy-plot__axis__line"></line></g><g transform="translate(34,168)" className="rv-xy-plot__axis rv-xy-plot__axis--horizontal "><g transform="translate(0, 0)" className="rv-xy-plot__axis__ticks"><g transform="translate(22.599999999999966, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 5:00 AM</text></g><g transform="translate(67.79999999999997, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 6:00 AM</text></g><g transform="translate(112.99999999999997, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 7:00 AM</text></g><g transform="translate(158.2, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 8:00 AM</text></g><g transform="translate(203.39999999999998, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 9:00 AM</text></g><g transform="translate(248.59999999999997, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 10:00 ...</text></g><g transform="translate(293.8, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 11:00 ...</text></g><g transform="translate(339, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 12:00 ...</text></g><g transform="translate(384.2, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 1:00 PM</text></g><g transform="translate(429.4, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 2:00 PM</text></g><g transform="translate(474.59999999999997, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 3:00 PM</text></g><g transform="translate(519.8, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 4:00 PM</text></g><g transform="translate(565, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 5:00 PM</text></g><g transform="translate(610.2, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 6:00 PM</text></g><g transform="translate(655.4000000000001, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 7:00 PM</text></g><g transform="translate(700.5999999999999, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 8:00 PM</text></g><g transform="translate(745.8, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 9:00 PM</text></g><g transform="translate(791, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 10:00 ...</text></g><g transform="translate(836.2, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Wed 11:00 ...</text></g><g transform="translate(881.4000000000001, 0)" className="rv-xy-plot__axis__tick"><line x1="0" x2="0" y1="0" y2="8" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0" transform="translate(0, 12) rotate(-45)" className="rv-xy-plot__axis__tick__text">Thu 12:00 ...</text></g></g></g><g transform="translate(0,8)" className="rv-xy-plot__axis rv-xy-plot__axis--vertical "><g transform="translate(34, 0)" className="rv-xy-plot__axis__ticks"><g transform="translate(0, 160)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">0</text></g><g transform="translate(0, 134.4)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">0.2</text></g><g transform="translate(0, 108.79999999999998)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">0.4</text></g><g transform="translate(0, 83.2)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">0.6</text></g><g transform="translate(0, 57.599999999999994)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">0.8</text></g><g transform="translate(0, 31.999999999999993)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">1</text></g><g transform="translate(0, 6.400000000000006)" className="rv-xy-plot__axis__tick"><line y1="0" y2="0" x1="0" x2="0" className="rv-xy-plot__axis__tick__line"></line><text text-anchor="end" dy="0.32em" transform="translate(-8, 0)" className="rv-xy-plot__axis__tick__text">1.2</text></g></g></g><g transform="translate(34,8)" className="rv-xy-plot__grid-lines wds-chart__grid-line"><line y1="160" y2="160" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="134.4" y2="134.4" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="108.79999999999998" y2="108.79999999999998" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="83.2" y2="83.2" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="57.599999999999994" y2="57.599999999999994" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="31.999999999999993" y2="31.999999999999993" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line><line y1="6.400000000000006" y2="6.400000000000006" x1="0" x2="904" className="rv-xy-plot__grid-lines__line"></line></g></svg>
                                                    </div>
                                                    </div>
                                                    <div className="resize-triggers">
                                                        <div className="expand-trigger">
                                                        <div style={{width: '947px', height: '241px'}}></div>
                                                        </div>
                                                        <div className="contract-trigger"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="wds-flex wds-flex--x-center">
                                            <a `'/cxm/platform/${this.props.match.params.xSite}/analyze/browse/'+t${props.surveyId} className}`="wds-button wds-m-t-4">ANALYZE RESULTS</a>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                            {/* End wds-grid__col-12 */}
                        </div>
                        {/* End wds-grid__row */}

                    </div>
                </div>
                {/* End sm-survey-summary body */}

                {/* <h1 style={{ margin: '40px 0px 50px 50px'}}>SUMMARY{this.state.survey.title}</h1> */}

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visible}
                />

            </div>
        );
    }
}