import React from 'react';
import ReactDOM from 'react-dom';

import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
// import SurveyCreateForm from '../common/form/surveyCreateForm';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';

import SurveyTemplateGrid from '../common/survey/surveyTemplateGrid';
// import SurveyTemplateList from '../common/survey/surveyTemplateList';

// import SurveyPopularList from '../common/survey/surveyPopularList';
// import SurveyPopularGrid from '../common/survey/surveyPopularGrid';

// import SurveyFeedbackList from '../common/survey/surveyFeedbackList';
// import SurveyFeedbackGrid from '../common/survey/surveyFeedbackGrid';

import SurveyCreateModal from '../common/modal/surveyCreateModal';

import '../css/wds-react.4_16_1.min.css';
import '../css/explore.css';
import '../css/all-template-tab.css';
import '../css/list-view-toggle.css';
import '../css/limited-list.css';
import '../css/base-tile.css';
import '../css/survey-template-tile.css';
import '../css/get-started-button-bar.css';
import '../css/create-survey.css';
import '../css/truncate.css';
import '../css/base-list-item.css';
// import { Button, Icon, Radio, Select, Modal } from 'antd';
import { Icon, Radio, Select } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import HeaderSurvey from '../common/header';
import TouchpointRow from '../common/survey/touchpointRow';
const { Option } = Select;


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
    surveys: Surveys,
    surveyProjects: any;
    surveyTouchpoint: string;
    surveyTouchpointId: string;
    itemStyle: string,
    seletedTemplate: string,
    visible: boolean
}


export default class Create extends  React.Component<IProps, IState> {
    constructor(props:IProps) {
        super(props);
         
        this.state = {
            surveys: {
                name: '',
                project_id: '',
                multi_lang: '',
                touchpoint_id: '',
                owner_user_id: '',
            },
            surveyProjects: [],
            surveyTouchpoint: 'Start from scratch',
            surveyTouchpointId: '99',
            itemStyle: 'grid',
            seletedTemplate: 'all',
            visible: false
        }
        this.onFieldValueChange = this.onFieldValueChange.bind(this);
    }

    onFieldValueChange(fieldName: string, value: any) { 
        // console.log(`onFieldValueChange fieldName ${fieldName} value `, value);
        const nextState = {
            ...this.state,
            surveys: {
                ...this.state.surveys,
                [fieldName]: value,
                // name: value,
                // touchpoint_id: templateId
            }
        };

        this.setState(nextState);
      // console.log('Create onFieldValueChange', this.state.surveys);
    }
    
    onSave = () => { 
      // console.log('onSave', this.state.surveys);
        const jwt = getJwtToken();
        BaseService.create<Surveys>(this.props.match.params.xSite, "/surveys/", this.state.surveys, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        // console.log(rp.Data);
                        // console.log(rp.Data.result.surveyInsertedId);
                        toastr.success(rp.Messages); 
                        setTimeout(function(this: any){ this.props.history.push(`/${this.props.match.params.xSite}/design/${rp.Data.result.surveyInsertedId}`); }.bind(this), 500);
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create onSave BaseService.create<Surveys>> /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create onSave BaseService.create<Surveys>> /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    async componentDidMount() {
      // console.log('Create componentDidMount');
        
        try{
            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            if( [1,2].includes(userData.ro) ) authorized = true;
            else if( [3,4].includes(userData.ro) ) authorized = false;
            
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

          // console.log('userData.id', userData.id);

            this.setState({
                surveys: {
                    ...this.state.surveys,
                    owner_user_id: userData.id,
                }
            }, () => {
              // console.log('surveys', this.state.surveys);
            });
            // const touchpointObj = {
            //     id: 1,
            //     display_name: 'Sales',
            //     descriptions: ' Understand the customers experience towards your product & services',
            //     image: 'https://dl.dropboxusercontent.com/s/c29ap3a99kaqabf/crm.png?dl=0',
            //     image_description: 'Customer Satisfaction Survey Template'
            // }

            BaseService.get(this.props.match.params.xSite ,"/projects", '', jwtToken).then(
                async (rp) => {
                    try{
                        if (rp.Status) {

                            // console.log('rp.Data.result.recordset', rp.Data.result.recordset);
                            const projects = rp.Data.result.recordset;
                            // console.log('projects', projects);
                            if(!projects.length) return;

                            this.setState({
                                surveyProjects: projects,
                            });
                            
                            BaseService.get(this.props.match.params.xSite ,"/touchpoints", '', jwtToken).then(
                                async (rp) => {
                                    try{
                                        if (rp.Status) {
                                            // console.log('rp', rp);
                                            // console.log('rp.Data', rp.Data);
                                            // console.log('rp.Data.result.recordset', rp.Data.result.recordset);
                                            const touchpoints = rp.Data.result.recordset;
                                            // console.log('touchpoints', touchpoints);
                                            if(!touchpoints.length) return;
                                            
                                            let nodeTouchpointOption = new Array<any>(touchpoints.length);
                                            for(let i = 0; i < nodeTouchpointOption.length; i++) { nodeTouchpointOption[i] = ''; }
                                            
                                            const nodeTouchpointOptionElement = nodeTouchpointOption.map((obj, i) => this.getTouchpointRow(touchpoints[i]));
                                            let allTouchpointElement = await Promise.all(nodeTouchpointOptionElement);

                                            // console.log('allTouchpointElement', allTouchpointElement);
                                            
                                            ReactDOM.render(<div key={`allTouchpointElement`}>{allTouchpointElement}</div>, document.getElementById('survey-templates'));
                                            // ReactDOM.render(<TouchpointRow touchpoint={touchpointObj} showModal={this.showModal}/>, document.getElementById('survey-templates'));
                                            // ReactDOM.render(<SurveyTemplateGrid showModal={this.showModal}/>, document.getElementById('survey-templates'));
                                        } else {
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create componentDidMount BaseService.get /touchpoints else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                        }
                                    }catch(error){ 
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create componentDidMount BaseService.get /touchpoints catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }
                            );
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create componentDidMount BaseService.get /projects else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}`}, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create componentDidMount BaseService.get /projects catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
        }
        catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'create componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getTouchpointRow = (touchpoint: any) => {
        return (<TouchpointRow key={`TouchpointRow-${touchpoint.id}`} touchpoint={touchpoint} showModal={this.showModal}/>);
    }

    // handleStyleChange = (e: RadioChangeEvent) => {

    //     this.setState({
    //         visible: false
    //     });

    //   // console.log(`Create handleStyleChange ${ e.target.value }`, this.state.seletedTemplate);

    //     //All
    //     if(e.target.value === 'grid' && this.state.seletedTemplate === 'all'){
    //         ReactDOM.render(<SurveyTemplateGrid showModal={this.showModal}/>, document.getElementById('survey-templates'));
    //     }
    //     else if(e.target.value === 'list' && this.state.seletedTemplate === 'all'){
    //         ReactDOM.render(<SurveyTemplateList showModal={this.showModal}/>, document.getElementById('survey-templates'));
    //     }

    //     //Popular
    //     if(e.target.value === 'grid' && this.state.seletedTemplate === 'popular'){
    //         ReactDOM.render(<SurveyPopularGrid />, document.getElementById('survey-templates'));
    //     }
    //     else if(e.target.value === 'list' && this.state.seletedTemplate === 'popular'){
    //         ReactDOM.render(<SurveyPopularList />, document.getElementById('survey-templates'));
    //     }

    //     //Feedback
    //     if(e.target.value === 'grid' && this.state.seletedTemplate === 'feedback'){
    //         ReactDOM.render(<SurveyFeedbackGrid />, document.getElementById('survey-templates'));
    //     }
    //     else if(e.target.value === 'list' && this.state.seletedTemplate === 'feedback'){
    //         ReactDOM.render(<SurveyFeedbackList />, document.getElementById('survey-templates'));
    //     }

    //     this.setState(
    //         { itemStyle: e.target.value }
    //     );
    // };

    // handleSelectChange = (status: any) => {

    //     this.setState({
    //         visible: false
    //     });

    //   // console.log(`Create handleSelectChange ${this.state.itemStyle}`, status);

    //     //All
    //     if(this.state.itemStyle === 'grid' && status === 'all'){
    //         ReactDOM.render(<SurveyTemplateGrid showModal={this.showModal}/>, document.getElementById('survey-templates'));
    //     }
    //     else if(this.state.itemStyle === 'list' && status === 'all'){
    //         ReactDOM.render(<SurveyTemplateList showModal={this.showModal} />, document.getElementById('survey-templates'));
    //     }

    //     //Popular
    //     if(this.state.itemStyle === 'grid' && status === 'popular'){
    //         ReactDOM.render(<SurveyPopularGrid />, document.getElementById('survey-templates'));
    //     }
    //     else if(this.state.itemStyle === 'list' && status === 'popular'){
    //         ReactDOM.render(<SurveyPopularList />, document.getElementById('survey-templates'));
    //     }

    //     //Feedback
    //     if(this.state.itemStyle === 'grid' && status === 'feedback'){
    //         ReactDOM.render(<SurveyFeedbackGrid />, document.getElementById('survey-templates'));
    //     }
    //     else if(this.state.itemStyle === 'list' && status === 'feedback'){
    //         ReactDOM.render(<SurveyFeedbackList />, document.getElementById('survey-templates'));
    //     }

    //     this.setState({seletedTemplate: status});
    // };

    // handleInputChange = (event: { target: { value: any; }; }) => {
    // };
      
    // handleStyleChanges = () => {
    //   // console.log('switchToGrid');
    //     ReactDOM.render(<SurveyTemplateGrid />, document.getElementById('survey-templates'));
    // };

    // switchToList = () => {
    //   // console.log('switchToList');
    //     ReactDOM.render(<SurveyTemplateList />, document.getElementById('survey-templates'));
    // };

    handleOk = (e: any) => {
      // console.log('Create handleOk', e);
        this.props.history.push(`/${this.props.match.params.xSite}`);
        // this.setState({
        //   visible: false,
        // });
    };

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('Create handleCancel', this.state.visible);
    };

    showModal = (visibleStatus: any, touchpoint: any) => {
      // console.log(`showModal visible ${visibleStatus} touchpoint.id ${touchpoint.id} touchpoint.display_name ${touchpoint.display_name}`);
        this.setState({
            visible: visibleStatus,
            surveys: {
                ...this.state.surveys,
                touchpoint_id: touchpoint.id,
            },
            surveyTouchpoint: touchpoint.display_name,
        });
    };

    render() {
        return (
            <div>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <SurveyCreateModal 
                // surveys={this.state.surveys}
                history={this.props.history} 
                visible={this.state.visible} 
                surveyProjects={this.state.surveyProjects}
                surveyTouchpoint={this.state.surveyTouchpoint}
                surveyTouchpointId={this.state.surveyTouchpointId}
                onFieldValueChange={this.onFieldValueChange}
                onSave={this.onSave}
                />

                {/* <SurveyCreateModal /> */}
                {/* // history={this.props.history} 
                // visible={this.state.visible} 
                // handleOk={this.handleOk} 
                // handleCancel={this.handleCancel} */}
                
                {/* <div id="survey-create-modal"></div> */}

                {/* <Modal className="create-survey-modal"
                title="Name Your survey"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >

                {this.state.surveyTemplate}

                <SurveyCreateForm 
                    surveys={this.state.surveys}
                    surveyTemplate={this.state.surveyTemplate}
                    surveyTemplateId={this.state.surveyTemplateId}
                    onChange={this.onFieldValueChange}
                    onSave={this.onSave}
                />
                
                </Modal> */}

                <div className="sm-create-survey" data-testid="CreateSurvey__Content">
                    <div className="wds-grid wds-grid--no-bleeds wds-grid--fluid wds-h-100 wds-m-0">
                        <div className="wds-grid__row wds-flex wds-flex--column wds-h-100 wds-m-0">

                            <div className="wds-type--center wds-flex wds-flex--y wds-p-t-6 sm-get-started-button-bar">
                                <div className="wds-type--center wds-type--section-title sm-get-started-button-bar__heading" style={{width: '100%'}}>Create a new survey</div>
                                <div className="wds-type--center sm-get-started-button-bar__buttons wds-p-t-2">
                                    <button type="button" onClick={() =>  this.showModal(true, {id: 99, display_name: 'Start From Scratch'})} className="wds-type--center wds-button--solid wds-button--md wds-button--icon-left wds-m-t-2 wds-m-b-1 sm-get-started-button-bar__button">
                                        <div className="wds-icon-svg sm-get-started-button-bar__btn-icon" style={{ width: 'auto', height: 'auto' }}>
                                            <Icon type="form" />
                                        </div> Start From Scratch
                                    </button>
                                    <button type="button" className="wds-type--center wds-button--solid wds-button--md wds-button--icon-left wds-m-t-2 wds-m-b-1 sm-get-started-button-bar__button sm-get-started-button-bar__button--selected" >
                                        <div className="wds-icon-svg sm-get-started-button-bar__btn-icon" style={{ width: 'auto', height: 'auto' }}>
                                            <Icon type="file-add" />
                                        </div> Survey Templates
                                    </button>
                                </div>
                            </div>
                            
                            <div className="wds-flex wds-h-100 wds-flex--y sm-explore__main-container">
                                <div className="wds-flex wds-flex--x wds-flex--between wds-p-b-5 wds-p-6 sm-explore__templates-heading">
                                    <div className="wds-type--section-title">Explore templates</div>
                                    {/* <div id="48ef8ee8-db65-474a-9600-f0c0994994d4" className="wds-input-group">
                                        <div className="wds-input-group__addon">
                                            <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="Search"><g><path d="m15.7 14.6392-4.09-4.0892a6.4833 6.4833 0 1 0 -1.06 1.0605l4.0892 4.0895a.75.75 0 0 0 1.0608-1.0608zm-14.1194-8.0938a4.9646 4.9646 0 1 1 4.9648 4.9646 4.9706 4.9706 0 0 1 -4.9648-4.9646z"></path></g></svg>
                                        </div>
                                        <input id="search" placeholder="Search templates" data-testid="SearchInput__Input" className="wds-input wds-input--sm sm-search-input" value="">
                                    </div> */}
                                </div>

                                <div className="wds-flex wds-flex--x wds-flex__item--grow">
                                    <div className="wds-w-100 sm-explore__gallery">
                                        
                                        <div className="sm-all-templates-tab__container">
                                            
                                            {/* <div className="sm-all-templates-tab__actions sm-all-templates-tab__actions--no-tabs" style={{ paddingTop: '34px' }}> */}
                                            <div className="wds-flex wds-flex--x wds-w-100 sm-all-templates-tab__actions--inner">
                                                {/* <Select defaultValue="View All Templates" onChange={this.handleSelectChange} style={{ width: '200px' }}>
                                                    <Option value="all">View All Templates</Option>
                                                    <Option value="popular">Most Popular</Option>
                                                    <Option value="feedback">Customer Feedback</Option>
                                                </Select> */}
                                                {/* <div className="wds-select wds-select--md" role="button" aria-haspopup="listbox" aria-expanded="false">
                                                    <select data-testid="AllTemplatesTab__CategoryMenu" id="categoryMenu"><option value="">View all templates</option><option value="182">Most Popular</option><option value="1">General Business</option><option value="241">Benchmarkable</option><option value="134">Community</option><option value="123">Customer Feedback</option><option value="124">Demographics</option><option value="125">Education</option><option value="126">Events</option><option value="127">Healthcare</option><option value="11">Human Resources</option><option value="133">Just for Fun</option><option value="13">Nonprofit </option><option value="130">Political</option><option value="132">Market Research</option><option value="255">Quizzes</option></select>
                                                    <span className="wds-select__affordance">
                                                    <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="CaretDown"><g><path d="m1.7438 4.55c-.605 0-.75.35-.3222.7778l5.8006 5.8006a1.1032 1.1032 0 0 0 1.5556 0l5.8006-5.8006c.4278-.4278.2828-.7778-.3222-.7778z"></path></g></svg>
                                                    </span>
                                                </div> */}
                                                {/* <div className="sm-list-view-toggle">
                                                    <div className="wds-button-group">
                                                        
                                                        <Radio.Group value={this.state.itemStyle} onChange={this.handleStyleChange}>
                                                            <Radio.Button value="grid"><Icon type="appstore" /></Radio.Button>
                                                            <Radio.Button value="list"><Icon type="menu" /></Radio.Button>
                                                        </Radio.Group>
                                                    
                                                        <span className="wds-has-tooltip" role="button" >
                                                            <span className="wds-tooltip--top wds-tooltip" role="tooltip">
                                                                <span className="wds-tooltip__body">Grid view</span>
                                                            </span>
                                                            <span className="wds-tooltip__trigger">
                                                                <Button className="wds-button wds-button--secondary wds-button--solid wds-button--md wds-button--icon-only sm-list-view-toggle__grid-button" type="primary" onClick={this.switchToGrid}>
                                                                    <Icon type="appstore" />
                                                                </Button>
                                                            </span>
                                                        </span>

                                                        <span className="wds-has-tooltip" role="button" >
                                                            <span className="wds-tooltip--top wds-tooltip" role="tooltip">
                                                                <span className="wds-tooltip__body">List view</span>
                                                            </span>
                                                            <span className="wds-tooltip__trigger">
                                                                <Button className="wds-button wds-button--alt wds-button--solid wds-button--md wds-button--icon-only sm-list-view-toggle__list-button" type="primary" onClick={this.switchToList}>
                                                                    <Icon type="menu" />
                                                                </Button>
                                                            </span>
                                                        </span>

                                                    </div>
                                                </div> */}
                                            </div>
                                            {/* </div> */}

                                            {/* <div className="sm-all-templates-tab__category-heading--inner" style={{ marginTop: 30 }}><span className="wds-type--section-title">Touchpoints</span></div> */}

                                            <div className="wds-flex wds-flex--x sm-all-templates-tab__row wds-w-100 wds-p-b-5">
                                                <div data-testid="LimitedList__Container" className="wds-w-100">
                                                    
                                                    <div className="wds-w-100 wds-flex wds-flex--y">
                                                        <div className="sm-limited-list__items--row">
                                                            
                                                            <div id="survey-templates"></div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>{/* sm-all-templates-tab__container */}

                                    </div>{/* explore__gallery */}{/* wds-flex__item--grow */}
                                </div>{/* sm-explore__main-container */}

                            </div>{/* wds-flex--column */}
                        </div>{/* sm-create-survey */}

                    </div>
                </div>
                    
                
            </div>
            
        );
    }     
     
}