import React from 'react';
// import ReactDOM from 'react-dom';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import CheckboxGroup from "antd/lib/checkbox/Group";
import MenuSurvey from '../common/menu';
import moment from 'moment';
import { Empty, Icon, Spin, DatePicker, Input } from 'antd';

import HeaderSurvey from '../common/header';
// import CollectorRow from "../common/collector/collectorRow";
// import SummaryCollectorRow from "../common/collector/summaryCollectorRow";

import SurveyResponse from '../models/surveyResponse';
import Answer from '../models/answers';

import '../css/anweb-browse-bundle-min.08cbc40e.css';
import '../css/anweb-summary-webpack-bundle-min.3bdc0105.css';
import '../css/anweb-analyze-bundle-min.e5376b09.css';
import '../css/anweb-summary-bundle-min.7d57dd0a.css';
import '../css/anweb-analyze-bundle-min.8e090971.css';
import '../css/smlib.ui-global-bundle-min.471d0b30.css';
import Question from '../models/questions';
import ReactDOM from 'react-dom';
import RatingRowBrowse from '../common/analyze-browse/ratingRowBrowse';
import ChoiceRowBrowse from '../common/analyze-browse/choiceRowBrowse';
import CheckboxRowBrowse from '../common/analyze-browse/checkboxRowBrowse';
import ScoreRowBrowse from '../common/analyze-browse/scoreRowBrowse';
import TextRowBrowse from '../common/analyze-browse/textRowBrowse';

// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import Collector from '../models/collector';
import SurveyReNicknameModal from '../common/modal/surveyRenicknameModal';

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
    listAnswers: Array<Answer>,
    isLoading: boolean,
    isLoadingAnalyze: boolean,
    totalCollectors: number,
    sidebarTool: string,
    gotoRespondentMenu: boolean,
    respondents: any,
    total_responses: number,

    responseInfo: SurveyResponse;

    inputRespondentNo: number,
    respondentId: number,
    respondentNo: number,
    // respondentIndex: number,
    numQuestion: number,

    answer: any,
    skip: any,
    comment: any,

    filterTimePeriod: boolean,
    filterStartDate: string,
    filterEndDate: string,

    filterRespondentMetadata: boolean,
    filterCustomerId: string,
    filterLineId: string,
    filterIdCard4Digit: string,
    filterRoomNumber: string,
    filterMobileNumber: string,
    filterFirstName: string,
    filterLastName: string,
    filterEmail: string,
    filterCustomGroup: string,
    filterIPAddress: string,
    filterInstitutionName: string,
    filterProjectName: string,
    filterCompanyName: string,
    filterDepartment: string,
    filterPosition: string,

    exportData: any,
    
    exComplete: any,
    exCName: any,
    exCType: any,
    exTimeSpent: any,
    exStart: any,
    exLastModified: any,
    exIp: any,
    exEmail: any,
    exMobile: any,
    exNameTitle: any,
    exFName: any,
    exLName: any,
    exBirthDate: any,
    exLineId: any,
    exIdCard4Digit: any,
    exRoomNumber: any,
    exInstitutionName: any,
    exProjectName: any,
    exCusID: any,
    exCGroup: any,

    jwtToken: any,

    filterCollector: boolean,
    collectorCheckboxOptions: any,
    checkedCollectorList: any,
    defaultCollectorCheckedList: any,

    filterProject: boolean,
    projectCheckboxOptions: any,
    checkedProjectList: any,
    defaultProjectCheckedList: any,
    visible: boolean
}

export default class AnalyzeBrowse extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            listAnswers: [],
            isLoading: true,
            isLoadingAnalyze: true,
            totalCollectors: 0,
            sidebarTool: "filter",
            gotoRespondentMenu: false,
            respondents: [],
            total_responses: 0,

            responseInfo: {
                survey_id: '',
                collector_id: '',
            },

            inputRespondentNo: 1,
            respondentId: 1,
            respondentNo: 1,
            // respondentIndex: 0,
            numQuestion: 0,

            answer: [],
            comment: [],
            skip: [],

            filterTimePeriod: false,
            filterStartDate: '',
            filterEndDate: '',

            filterRespondentMetadata: false,
            filterCustomerId: '',
            filterLineId: '',
            filterIdCard4Digit: '',
            filterRoomNumber: '',
            filterMobileNumber: '',
            filterFirstName: '',
            filterLastName: '',
            filterEmail: '',
            filterCustomGroup: '',
            filterIPAddress: '',
            filterInstitutionName: '',
            filterProjectName: '',
            filterCompanyName: '',
            filterDepartment: '',
            filterPosition: '',
            exportData: [],

            exComplete: '',
            exCName: '',
            exCType: '',
            exTimeSpent: '',
            exStart: '',
            exLastModified: '',
            exIp: '',
            exEmail: '',
            exMobile: '',
            exNameTitle: '',
            exFName: '',
            exLName: '',
            exBirthDate: '',
            exLineId: '',
            exIdCard4Digit: '',
            exRoomNumber: '',
            exInstitutionName: '',
            exProjectName: '',
            exCusID: '',
            exCGroup: '',
            

            jwtToken: {},
            
            filterCollector: false,
            collectorCheckboxOptions: [],
            checkedCollectorList: [],
            defaultCollectorCheckedList: [],

            filterProject: false,
            projectCheckboxOptions: [],
            checkedProjectList: [],
            defaultProjectCheckedList: [],
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
          // console.log('Analyze Browse componentDidMount');

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
            
            const startTime = performance.now();

            document.body.id = 'analyze';
            document.body.classList.toggle('translate', true);
            document.body.classList.toggle('step2', true);
            document.body.classList.toggle('basic', true);
            document.body.classList.toggle('modern-browser', true);
            document.body.classList.toggle('themeV3', true);
            document.body.classList.toggle('sticky', true);
            // document.body.classList.toggle('translate step2 basic modern-browser themeV3 sticky', true);
        
            this.setState({ 
                jwtToken: jwtToken
            }, () => {

                BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.id, this.state.jwtToken).then(
                    async (rp) => {
                        try{
                            if (rp.Status) {
                              // console.log('edit', rp.Data.recordset);
        
                                if(rp.Data.recordset.length){
        
                                    // const surveyId = this.props.match.params.id;
                                    const numQuestion = parseInt(rp.Data.recordset[0].num_question)
        
                                    this.setState({ 
                                        survey: rp.Data.recordset[0], 
                                        isLoading: false, 
                                        numQuestion: numQuestion 
                                    }, () => {
                                        // console.log('numQuestion', this.state.numQuestion);
                                        //check if the survey has some collector to do a collecotr filter
                                        if(this.state.survey.survey_collector_nickname && this.state.survey.survey_collector_id){
                                            const surveyCollectorNameArr = this.state.survey.survey_collector_nickname.includes(",") ? this.state.survey.survey_collector_nickname.split(',') : [this.state.survey.survey_collector_nickname];
                                            const surveyCollectorIdArr = this.state.survey.survey_collector_id.includes(",") ? this.state.survey.survey_collector_id.split(',') : [this.state.survey.survey_collector_id];
                                            const collectorCheckboxOptions = surveyCollectorNameArr.map(function (collectorName: any, i: any) {
                                                // console.log('i', i);
                                                // console.log('collectorName', collectorName);
                                                return { label: collectorName, value: surveyCollectorIdArr[i] };
                                            });
                                            const collectorDefaultCheckedList = surveyCollectorNameArr.map(function (collectorName: any, i: any) {
                                                // console.log('i', i);
                                                // console.log('collectorName', collectorName);
                                                return surveyCollectorIdArr[i];
                                            });
                                            // const collectorCheckboxOptions = [ { label: "IDEO MIX", value: `${1}` }, { label: "IDEO MOBI", value: `${2}` }, { label: "IDEO O2", value: `${3}` } ];

                                            this.setState({ 
                                                collectorCheckboxOptions : collectorCheckboxOptions,
                                                defaultCollectorCheckedList : collectorDefaultCheckedList,
                                                checkedCollectorList: collectorDefaultCheckedList
                                            });
                                        }

                                        //get project id and name filter
                                        const surveyProjectNameArr = this.state.survey.survey_project_name ? this.state.survey.survey_project_name.includes(",") ? this.state.survey.survey_project_name.split(',') : [this.state.survey.survey_project_name] : [];
                                        // console.log('surveyProjectNameArr', surveyProjectNameArr);
                                        const surveyProjectIdArr = this.state.survey.survey_project_id ? this.state.survey.survey_project_id.includes(",") ? this.state.survey.survey_project_id.split(',') : [this.state.survey.survey_project_id] : [];
                                        // console.log('surveyProjectIdArr', surveyProjectIdArr);
                                        const collectorProjectIdArr = this.state.survey.collector_project_id ? this.state.survey.collector_project_id.includes(",") ? this.state.survey.collector_project_id.split(',') : [this.state.survey.collector_project_id] : [];
                                        // console.log('collectorProjectIdArr', collectorProjectIdArr);

                                        let projectCheckboxOptions = [] as any;
                                        surveyProjectIdArr.forEach((projectId: any, i: any) => {
                                            // console.log(`projectId ${i}`, projectId);
                                            collectorProjectIdArr.forEach((collectorProjectId: any, j: any) => {
                                                // console.log(`collectorProjectId ${j}`, collectorProjectId);
                                                if(projectId === collectorProjectId && projectCheckboxOptions.filter((projectOption: any) => projectOption.label === surveyProjectNameArr[i]).length === 0){
                                                    // console.log(`in if projectId === collectorProjectId`);
                                                    projectCheckboxOptions.push({ label: surveyProjectNameArr[i], value: projectId });
                                                    return;
                                                }
                                            });
                                        });
                                        // console.log('projectCheckboxOptions', projectCheckboxOptions);

                                        const projectDefaultCheckedList = surveyProjectIdArr.map(function (projectName: any, i: any) {
                                            // console.log(`projectName ${i}`, projectName);
                                            return surveyProjectIdArr[i];
                                        });
                                        // console.log('projectDefaultCheckedList', projectDefaultCheckedList);

                                        this.setState({ 
                                            projectCheckboxOptions : projectCheckboxOptions,
                                            defaultProjectCheckedList : projectDefaultCheckedList,
                                            checkedProjectList: projectDefaultCheckedList
                                        }, () => {
                                            // console.log('this.state.projectCheckboxOptions', this.state.projectCheckboxOptions);
                                            // console.log('this.state.defaultProjectCheckedList', this.state.defaultProjectCheckedList);
                                            // console.log('this.state.checkedProjectList', this.state.checkedProjectList);
                                        });
                                    });
                                    
                                    // const numPage = parseInt(rp.Data.recordset[0].num_page)
        
                                  // console.log('num_question', numQuestion);
                                    // console.log('num_page', numPage);
                                    
                                    this.renderQuestionAnswerRow();

                                    const endTime = performance.now();
                                  // console.log('Its took ' + (endTime - startTime) + ' ms.');
                                }
                                else{
                                    this.setState({ isLoading: false });
                                    // toastr.error(rp.Messages);
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                }
        
                            } else {
                                this.setState({ isLoading: false });
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            }
                        }catch(error){ 
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    }
        
                );

            });
           
            //remove ant-modal-root child to fix a modal showing when switch between pages
            const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
            // console.log('allAntModalRootElement', allAntModalRootElement);
            if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });
            
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    renderQuestionAnswerRow(){
        
        const filterObj = {
            filterTimePeriod: {
                apply: this.state.filterTimePeriod,
                filterStartDate: this.state.filterStartDate,
                filterEndDate: this.state.filterEndDate
            },
            filterCollector: {
                apply: this.state.filterCollector,
                collectorId: this.state.checkedCollectorList
            },
            filterProject: {
                apply: this.state.filterProject,
                projectId: this.state.checkedProjectList
            },
            filterRespondentMetadata: {
                apply: this.state.filterRespondentMetadata,
                filterCustomerId: this.state.filterCustomerId.trim(),
                filterLineId: this.state.filterLineId.trim(),
                filterIdCard4Digit: this.state.filterIdCard4Digit.trim(),
                filterRoomNumber: this.state.filterRoomNumber.trim(),
                filterMobileNumber: this.state.filterMobileNumber.trim(),
                filterFirstName: this.state.filterFirstName.trim(),
                filterLastName: this.state.filterLastName.trim(),
                filterEmail: this.state.filterEmail.trim(),
                filterCustomGroup: this.state.filterCustomGroup.trim(),
                filterIPAddress: this.state.filterIPAddress.trim(),
                filterInstitutionName: this.state.filterInstitutionName.trim(),
                filterProjectName: this.state.filterProjectName.trim(),
                filterCompanyName: this.state.filterCompanyName.trim(),
                filterDepartment: this.state.filterDepartment.trim(),
                filterPosition: this.state.filterPosition.trim(),
            }
        } 

        // console.log('renderQuestionAnswerRow filterObj', filterObj);
        //get response coun
        BaseService.getWithBody<SurveyResponse>(this.props.match.params.xSite, '/response/', this.props.match.params.id, filterObj, this.state.jwtToken).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log('get SurveyResponse', rp.Messages);
                        // console.log('get SurveyResponse', rp.Data);
                        // console.log('get SurveyResponse count = ', rp.Data.recordset.length);

                        if(rp.Data.recordset.length){
                            this.setState({ 
                                respondents: rp.Data.recordset, 
                                respondentNo: 1, 
                                inputRespondentNo: 1,  
                                total_responses: rp.Data.recordset[0].total_responses 
                            }, () => {
                            // console.log('after respondents', this.state.respondents);

                                if(rp.Data.recordset.length > 0){
                                    this.renderElement();
                                }
                                else{
                                    // ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('analyze-browse-empty-wrapper'));
                                    this.setState({ isLoadingAnalyze: false });
                                }
                            });
                        }
                        else{
                            this.setState({ 
                                respondents: [],
                                isLoadingAnalyze: false
                            });
                        }
                        
                    } else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderQuestionAnswerRow BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderQuestionAnswerRow BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    async renderElement(){
        try{
            // console.log('renderElement respondentId', this.state.respondentId);

            this.setState({ 
                inputRespondentNo: this.state.respondentNo,
                exportData: [],
                // respondentIndex: this.state.respondentNo - 1
            }, () => {
                // console.log('renderElement exportData', this.state.exportData);
                // console.log('renderElement inputRespondentNo', this.state.inputRespondentNo);
                    // console.log('renderElement respondentIndex', this.state.respondentIndex);
                }
            );

            const filterObj = {
                filterTimePeriod: {
                    apply: this.state.filterTimePeriod,
                    filterStartDate: this.state.filterStartDate,
                    filterEndDate: this.state.filterEndDate
                },
                filterCollector: {
                    apply: this.state.filterCollector,
                    collectorId: this.state.checkedCollectorList
                },
                filterProject: {
                    apply: this.state.filterProject,
                    projectId: this.state.checkedProjectList
                },
                filterRespondentMetadata: {
                    apply: this.state.filterRespondentMetadata,
                    filterCustomerId: this.state.filterCustomerId.trim(),
                    filterLineId: this.state.filterLineId.trim(),
                    filterIdCard4Digit: this.state.filterIdCard4Digit.trim(),
                    filterRoomNumber: this.state.filterRoomNumber.trim(),
                    filterMobileNumber: this.state.filterMobileNumber.trim(),
                    filterFirstName: this.state.filterFirstName.trim(),
                    filterLastName: this.state.filterLastName.trim(),
                    filterEmail: this.state.filterEmail.trim(),
                    filterCustomGroup: this.state.filterCustomGroup.trim(),
                    filterIPAddress: this.state.filterIPAddress.trim(),
                    filterInstitutionName: this.state.filterInstitutionName.trim(),
                    filterProjectName: this.state.filterProjectName.trim(),
                    filterCompanyName: this.state.filterCompanyName.trim(),
                    filterDepartment: this.state.filterDepartment.trim(),
                    filterPosition: this.state.filterPosition.trim(),
                }
            } 

            // console.log('renderElement filterObj', filterObj);

            //get response info
            BaseService.getWithBody<SurveyResponse>(this.props.match.params.xSite, '/response/', this.props.match.params.id + '/' + this.state.respondents[this.state.respondentNo - 1].id, filterObj, this.state.jwtToken).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                        // console.log('get responseInfo', rp.Messages);
                        // console.log('get responseInfo', rp.Data);
                        // console.log('get responseInfo count = ', rp.Data.recordset.length);

                            if(rp.Data.recordset.length > 0){

                                this.setState({ 
                                    responseInfo: rp.Data.recordset[0]
                                }, () => {

                                        //get collector name
                                        BaseService.get<Collector>(this.props.match.params.xSite, '/collector/', this.state.responseInfo.collector_id, this.state.jwtToken).then(
                                            (rp) => {
                                                try{
                                                    if (rp.Status) {
                                                    // console.log('collector', rp.Data);

                                                        if(rp.Data.recordset){
                                                            const collectorName = rp.Data.recordset[0].name;
                                                            const collectorType = rp.Data.recordset[0].type;

                                                            const seconds = this.state.responseInfo.time_spent;
                                                            const timeSpent = moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("HH:mm:ss")
                                                        // console.log('timeSpent', timeSpent);

                                                        // console.log('collectorName', rp.Data.recordset[0].name);

                                                        console.log('responseInfo', this.state.responseInfo);

                                                            //set colector and respsonse info export data
                                                            this.setState({ 
                                                                exComplete: this.state.responseInfo.complete_status === 3 ? 'COMPLETED' : 'PARTIAL',
                                                                exCName: collectorName,
                                                                exCType: parseInt(collectorType) === 1 ? 'Web Link' : parseInt(collectorType) === 2 ? 'SMS' : parseInt(collectorType) === 3 ? 'Email' : parseInt(collectorType) === 4 ? 'Social Media' : '',
                                                                exTimeSpent: timeSpent,
                                                                exStart: this.state.responseInfo.created_date,
                                                                exLastModified: this.state.responseInfo.modified_date ? this.state.responseInfo.modified_date : this.state.responseInfo.created_date,
                                                                exIp: this.state.responseInfo.ip_address,
                                                                exEmail: this.state.responseInfo.email_address,
                                                                exMobile: this.state.responseInfo.mobile_number,
                                                                exNameTitle: this.state.responseInfo.name_title,
                                                                exFName: this.state.responseInfo.first_name,
                                                                exLName: this.state.responseInfo.last_name,
                                                                exBirthDate: this.state.responseInfo.birthdate,
                                                                exLineId: this.state.responseInfo.line_id,
                                                                exIdCard4Digit: this.state.responseInfo.id_card_4_digit,
                                                                exRoomNumber: this.state.responseInfo.room_number,
                                                                exInstitutionName: this.state.responseInfo.institution_name,
                                                                exProjectName: this.state.responseInfo.project_name,
                                                                exCusID: this.state.responseInfo.customer_id,
                                                                exCGroup: this.state.responseInfo.custom_group,
                                                            });

                                                        // console.log('render respondent-profile-data');
                                                            ReactDOM.render(<div><h5 className={ this.state.responseInfo.complete_status === 3 ? "sm-label respondent-completion-status completed" : "sm-label respondent-completion-status partial"}>
                                                            {this.state.responseInfo.complete_status === 3 ? 'COMPLETED' : 'PARTIAL'} 
                                                            </h5>
                                                            <ul className="respondent-info-fields">
                                                                <li>
                                                                    <span className="sm-label respondent-info-label">Collector:</span>
                                                                    <span className="sm-label value">
                                                                        {collectorName}
                                                                    </span>
                                                                    <span className="sm-label value collector-type">
                                                                        &nbsp;({parseInt(collectorType) === 1 ? 'Web Link' : parseInt(collectorType) === 2 ? 'SMS' : parseInt(collectorType) === 3 ? 'Email' : parseInt(collectorType) === 4 ? 'Social Media' : 'Other'})
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <span className="sm-label respondent-info-label">Started:</span>
                                                                    <span className="sm-label value">
                                                                        {/* Friday, April 10, 2020 9:34:02 AM */}
                                                                        {this.state.responseInfo.created_date}
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <span className="sm-label respondent-info-label">Last Modified:</span>
                                                                    <span className="sm-label value">
                                                                        {/* Friday, April 10, 2020 9:36:02 AM */}
                                                                        {this.state.responseInfo.modified_date ? this.state.responseInfo.modified_date : this.state.responseInfo.created_date}
                                                                        {/* {this.state.responseInfo.modified_at} */}
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <span className="sm-label respondent-info-label">Time Spent:</span>
                                                                    <span className="sm-label value">
                                                                        {/* 00:01:00 */}
                                                                        {timeSpent}
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <span className="sm-label respondent-info-label">IP Address:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.ip_address}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.customer_id ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Customer ID:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.customer_id}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.email_address ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Email:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.email_address}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.mobile_number ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Mobile:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.mobile_number}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.name_title ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Name Title:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.name_title}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.first_name ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">First Name:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.first_name}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.last_name ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Last Name:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.last_name}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.birthdate ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Birthdate (DD/MM/YYYY):</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.birthdate}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.line_id ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Line ID:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.line_id}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.id_card_4_digit ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">ID Card 4 digits:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.id_card_4_digit}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.room_number ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Room Number:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.room_number}
                                                                    </span>
                                                                </li>
                                                                <li className={this.state.responseInfo.institution_name ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Institution Name:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.institution_name}
                                                                    </span>
                                                                </li>

                                                                { this.props.match.params.xSite === "singha" ?
                                                                <li className={this.state.responseInfo.project_name ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Project Name:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.project_name}
                                                                    </span>
                                                                </li>
                                                                : null }

                                                                <li className={this.state.responseInfo.company_name ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Company Name:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.company_name}
                                                                    </span>
                                                                </li>
                                                                
                                                                <li className={this.state.responseInfo.department ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Department:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.department}
                                                                    </span>
                                                                </li>
                                                                
                                                                <li className={this.state.responseInfo.position ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Position:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.position}
                                                                    </span>
                                                                </li>

                                                                <li className={this.state.responseInfo.consent_date ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Consent Date:</span>
                                                                    <span className="sm-label value">
                                                                    {moment(this.state.responseInfo.consent_date).format("DD/MM/YYYY")}
                                                                    </span>
                                                                </li>

                                                                <li className={this.state.responseInfo.custom_group ? '' : 'hidden'}>
                                                                    <span className="sm-label respondent-info-label">Custom Group:</span>
                                                                    <span className="sm-label value">
                                                                    {this.state.responseInfo.custom_group}
                                                                    </span>
                                                                </li>
                                                            </ul></div>, document.getElementById('respondent-profile-data'));
                                                            
                                                        }
                                                        else{
                                                            this.setState({ isLoadingAnalyze: false });
                                                            // toastr.error(rp.Messages);
                                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement BaseService.get<Collector> '/collector/${this.state.responseInfo.collector_id} else rp.Data.recordset`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                                        }
                                                    } else {
                                                        this.setState({ isLoadingAnalyze: false });
                                                        // toastr.error(rp.Messages);
                                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement BaseService.get<Collector> '/collector/${this.state.responseInfo.collector_id} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                                    }
                                                }catch(error){ 
                                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement BaseService.get<Collector> '/collector/${this.state.responseInfo.collector_id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                                }
                                            }

                                        );
                                    }
                                );
                            }
                            else{
                                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('respondent-profile-data'));
                                this.setState({ isLoadingAnalyze: false });
                            }
                            
                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id}/${this.state.respondents[this.state.respondentNo - 1].id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id}/${this.state.respondents[this.state.respondentNo - 1].id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );

            // let nodeElement = [] as any;
            let nodeArr = new Array<any>(this.state.numQuestion);

            for(let i = 0; i < this.state.numQuestion; i++) { nodeArr[i] = ''; }

            const allPageNo = nodeArr.map((obj, i) => this.getPageNo(this.props.match.params.id, i+1));//i+1 = question no. start from 1 - x (number of question)
            const allPromisePageNo = await Promise.all(allPageNo);
        // console.log('allPageNoPromise', allPromisePageNo);

            let indexListPageNo = [] as any;

            let previousPageNo = 1;
            indexListPageNo.push(0);//add first page no = 1

            allPromisePageNo.forEach((currentPageNo: any, index: any) => {
                // console.log(`currentPageNo ${currentPageNo} : index = ${index}`);
                // console.log('previousPageNo', previousPageNo);
                if(currentPageNo && currentPageNo !== previousPageNo){
                    // console.log('!matched');
                    indexListPageNo.push(index);
                    previousPageNo = currentPageNo;
                }
            });

        // console.log('indexListPageNo', indexListPageNo);

            const allElement = nodeArr.map((obj, i) => this.getQuestionAnswer(this.props.match.params.id, i+1));//i+1 = question no. start from 1 - x (number of question)
        // console.log('allElement', allElement);

            //insert Page elements
            indexListPageNo.forEach((renderIndex: any, index: any) => {
                renderIndex += index;//increase renderIndex for the length of array
                let pageNo = index + 1;//convert from index to page number
            // console.log(`renderIndex = ${renderIndex} : pageNo = ${pageNo}`);
                this.insert(allElement, renderIndex, this.getPageNoElement(pageNo));
            });
        // console.log('allElement insert', allElement);
            
            const nodeElement = await Promise.all(allElement);
        // console.log('nodeElement', nodeElement);

            //render all elements
            if(nodeElement.length !== 0){
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('response-question-answer-list'));
            }
            else{
                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('response-question-answer-list'));
            }

            this.setState({ isLoadingAnalyze: false });
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse renderElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getPageNoElement = async (numPage: any) => {
        return <div key={'page-'+numPage} className="response-page-header sm-corner-t" style={{ marginTop: '15px', marginBottom: '0' }}><span className="page-title"> Page {numPage}</span></div>
    }

    getQuestionAnswer = async (surveyId: any, i: any) => {
      // console.log ("question no." + i);

        // setup formatters
        const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
        const percentFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
        const pf = new Intl.NumberFormat('en-IN', percentFormat);

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, this.state.jwtToken).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`get question ${i}`, rp.Messages);
                      // console.log(`get question ${i}`, rp.Data);
                      // console.log(`get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length){

                            const questionId = rp.Data.recordset[0].id[0];
                            const questionTypeId = rp.Data.recordset[0].type_id;
                            const questionNo = rp.Data.recordset[0].order_no;
                            const questionLabel = rp.Data.recordset[0].question_label;
                            const questionActive = rp.Data.recordset[0].active;

                            const questionAnalyzeEntity = rp.Data.recordset[0].analyze_entity;
                            const questionAnalyzeSentiment = rp.Data.recordset[0].analyze_sentiment;

                            const questionShowConsentSection = rp.Data.recordset[0].enable_consent;
                            
                          // console.log(`get question ${i} id = `, questionId);
                          // console.log(`get question ${i} type id = `, questionTypeId);
                          // console.log(`get question ${i} no = `, questionNo);
                          // console.log(`get question ${i} label = `, questionLabel);
                          // console.log(`get question ${i} active = `, questionActive);

                          // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                          // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);

                            let questionTypeName = '';

                            switch (questionTypeId) {
                                case 1: questionTypeName = 'Rating'; break;
                                case 2: questionTypeName = 'Multiple Choice'; break;
                                case 3: questionTypeName = 'Checkbox'; break;
                                case 4: questionTypeName = 'Net Promoter Score'; break;
                                case 5: questionTypeName = 'Text'; break;
                                case 6: questionTypeName = 'Dropdown'; break;
                                default: break;
                            }

                            let comment = [] as any;

                            //Star Rating & Multiple choicevariables
                            let choices = [] as any;
                            let weights = [] as any;
                            // let chartData = [] as any;

                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6){
                                
                                const questionChoice = rp.Data.recordset[0].choice.split(',');
                              // console.log(`get question ${i} choice = `, questionChoice);

                                for (let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                    } 
                                    else {
                                        weights.push(questionChoice[i]);
                                    }
                                }

                              // console.log(`get question ${i} ${questionTypeName} choices = `, choices);
                              // console.log(`get question ${i} ${questionTypeName} weights = `, weights);
                            }
                                        
                          // console.log(`get answer ${i} element`);

                            let element: any;

                            const filterObj = {
                                filterTimePeriod: {
                                    apply: this.state.filterTimePeriod,
                                    filterStartDate: this.state.filterStartDate,
                                    filterEndDate: this.state.filterEndDate
                                },
                                filterCollector: {
                                    apply: this.state.filterCollector,
                                    collectorId: this.state.checkedCollectorList
                                },
                                filterProject: {
                                    apply: this.state.filterProject,
                                    projectId: this.state.checkedProjectList
                                },
                                filterRespondentMetadata: {
                                    apply: this.state.filterRespondentMetadata,
                                    filterCustomerId: this.state.filterCustomerId.trim(),
                                    filterLineId: this.state.filterLineId.trim(),
                                    filterIdCard4Digit: this.state.filterIdCard4Digit.trim(),
                                    filterRoomNumber: this.state.filterRoomNumber.trim(),
                                    filterMobileNumber: this.state.filterMobileNumber.trim(),
                                    filterFirstName: this.state.filterFirstName.trim(),
                                    filterLastName: this.state.filterLastName.trim(),
                                    filterEmail: this.state.filterEmail.trim(),
                                    filterCustomGroup: this.state.filterCustomGroup.trim(),
                                    filterIPAddress: this.state.filterIPAddress.trim(),
                                    filterInstitutionName: this.state.filterInstitutionName.trim(),
                                    filterProjectName: this.state.filterProjectName.trim(),
                                    filterCompanyName: this.state.filterCompanyName.trim(),
                                    filterDepartment: this.state.filterDepartment.trim(),
                                    filterPosition: this.state.filterPosition.trim(),
                                }
                            } 

                            //get a answer just 1 time and wait for the process
                            element = await BaseService.getWithBody<Answer>(this.props.match.params.xSite, '/answer/', surveyId + '/' + questionId + '/' + questionTypeId + '/' + this.state.respondents[this.state.respondentNo - 1].id, filterObj, this.state.jwtToken).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                          // console.log(`get answer ${i}`, rp.Messages);
                                          // console.log(`get answer ${i}`, rp.Data);
                                          // console.log(`get answer ${i} count = `, rp.Data.recordset.length);

                                            let skip = 0;
                                            let answer = '';
                                            let comment = '';
                                            let choice = '';

                                            let signatureImage = '';
                                            let consentImagePath = '';
                                            
                                            const questionObj = {
                                                no: questionNo,
                                                label: questionLabel,
                                                enableConsent: questionShowConsentSection
                                            }

                                            // no display this question because this question didn't display when client was doing the survey
                                            // if(rp.Data.recordset.length === 0) return false;
                                            if(rp.Data.recordset.length === 0) skip = 1;

                                            //Star Rating
                                            if(questionTypeId === 1){

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);

                                                    skip = data.skip_status;
                                                    answer = data.answer;
                                                    comment = data.comment;

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                          // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                            if(parseInt(data.answer) === parseInt(weights[i])){ 
                                                                choice = choices[i];
                                                              // console.log('answer choice', choice);
                                                                return;
                                                            }   
                                                        }
                                                    }

                                                });
                                                
                                                let exportDataArr = this.state.exportData;
                                                exportDataArr.push({
                                                    complete_status: this.state.exComplete,
                                                    collector_name: this.state.exCName,
                                                    collector_type: this.state.exCType,
                                                    time_spent: this.state.exTimeSpent,
                                                    started: this.state.exStart,
                                                    last_modified: this.state.exLastModified,
                                                    ip: this.state.exIp,
                                                    email: this.state.exEmail,
                                                    mobile: this.state.exMobile,
                                                    name_title: this.state.exNameTitle,
                                                    first_name: this.state.exFName,
                                                    last_name: this.state.exLName,
                                                    birthdate: this.state.exBirthDate,
                                                    line_id: this.state.exLineId,
                                                    id_card_4_digit: this.state.exIdCard4Digit,
                                                    room_number: this.state.exRoomNumber,
                                                    institution_name: this.state.exInstitutionName,
                                                    project_name: this.state.exProjectName,
                                                    customer_id: this.state.exCusID,
                                                    custom_group: this.state.exCGroup,

                                                    question_no: questionNo,
                                                    question_name: questionLabel,
                                                    question_type: questionTypeName,
                                                    answered: skip ? 'No' : 'Yes',
                                                    answer_weight: answer,
                                                    answer_choice: choice,
                                                    comment: comment,
                                                });

                                                this.setState({
                                                    exportData: exportDataArr,
                                                },  () => { 
                                                      // console.log(`after exportData`, this.state.exportData);
                                                    } 
                                                );

                                                const answerObj = {
                                                    skip: skip,
                                                    weight: answer,
                                                    choice: choice,
                                                    comment: comment,
                                                } 
                                              // console.log(`ratting ${i} questionObj`, questionObj);
                                              // console.log(`ratting ${i} answerObj`, answerObj);

                                                return <RatingRowBrowse key={i} question={questionObj} answer={answerObj} />;
                                            }
                                            else if(questionTypeId === 2 || questionTypeId === 6){

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);

                                                    skip = data.skip_status;
                                                    answer = data.answer;
                                                    comment = data.comment;

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                          // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                            if(parseInt(data.answer) === parseInt(weights[i])){ 
                                                                choice = choices[i];
                                                              // console.log('answer choice', choice);
                                                                return;
                                                            }   
                                                        }
                                                    }
                                                    
                                                });
                                                
                                                let exportDataArr = this.state.exportData;
                                                exportDataArr.push({
                                                    complete_status: this.state.exComplete,
                                                    collector_name: this.state.exCName,
                                                    collector_type: this.state.exCType,
                                                    time_spent: this.state.exTimeSpent,
                                                    started: this.state.exStart,
                                                    last_modified: this.state.exLastModified,
                                                    ip: this.state.exIp,
                                                    email: this.state.exEmail,
                                                    mobile: this.state.exMobile,
                                                    name_title: this.state.exNameTitle,
                                                    first_name: this.state.exFName,
                                                    last_name: this.state.exLName,
                                                    birthdate: this.state.exBirthDate,
                                                    line_id: this.state.exLineId,
                                                    id_card_4_digit: this.state.exIdCard4Digit,
                                                    room_number: this.state.exRoomNumber,
                                                    institution_name: this.state.exInstitutionName,
                                                    project_name: this.state.exProjectName,
                                                    customer_id: this.state.exCusID,
                                                    custom_group: this.state.exCGroup,
                                                    question_no: questionNo,
                                                    question_name: questionLabel,
                                                    question_type: questionTypeName,
                                                    answered: skip ? 'No' : 'Yes',
                                                    answer_weight: answer,
                                                    answer_choice: choice,
                                                    comment: comment,
                                                });

                                                this.setState({
                                                    exportData: exportDataArr,
                                                },  () => { 
                                                      // console.log(`after exportData`, this.state.exportData);
                                                    } 
                                                );
                                                
                                                const answerObj = {
                                                    skip: skip,
                                                    weight: answer,
                                                    choice: choice,
                                                    comment: comment,
                                                } 

                                              // console.log(`choice ${i} questionObj`, questionObj);
                                              // console.log(`choice ${i} answerObj`, answerObj);

                                                return <ChoiceRowBrowse key={i} question={questionObj} answer={answerObj} />;
                                            }
                                            else if(questionTypeId === 3){

                                                let choiceHtml = '';

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);
                                                  // console.log('checkbox choices', choices);

                                                    skip = data.skip_status;
                                                    // answer = data.answer ? data.answer.split(',').filter(function (item: any) { return item !== null && item !== ''; }).join(', ') : '';
                                                    if(data.answer){
                                                        answer = ( data.answer.includes(',') ) ? data.answer.split(',').filter(function (item: any) { return item !== null && item !== ''; }).join(', ') : [data.answer];
                                                    }
                                                    comment = data.comment;
                                                    consentImagePath = data.consent_image_path
                                                    signatureImage = data.signature_image

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                            for (let j = 0; j < data.answer.length; j++) {
                                                              // console.log(`data.answer[${j}] = ${data.answer[j]} === weights[${i}] = `, weights[i]);
                                                                if(parseInt(data.answer[j]) === parseInt(weights[i])){ 
                                                                    choice += choices[i] + ', ';
                                                                    choiceHtml += `<li className="response-text openended-response-text">${choices[i]}</li>`;
                                                                }
                                                            }
                                                        }

                                                      // console.log('checkbox choices answer', choice);
                                                    }

                                                });

                                                let exportDataArr = this.state.exportData;
                                                exportDataArr.push({
                                                    complete_status: this.state.exComplete,
                                                    collector_name: this.state.exCName,
                                                    collector_type: this.state.exCType,
                                                    time_spent: this.state.exTimeSpent,
                                                    started: this.state.exStart,
                                                    last_modified: this.state.exLastModified,
                                                    ip: this.state.exIp,
                                                    email: this.state.exEmail,
                                                    mobile: this.state.exMobile,
                                                    name_title: this.state.exNameTitle,
                                                    first_name: this.state.exFName,
                                                    last_name: this.state.exLName,
                                                    birthdate: this.state.exBirthDate,
                                                    line_id: this.state.exLineId,
                                                    id_card_4_digit: this.state.exIdCard4Digit,
                                                    room_number: this.state.exRoomNumber,
                                                    institution_name: this.state.exInstitutionName,
                                                    project_name: this.state.exProjectName,
                                                    customer_id: this.state.exCusID,
                                                    custom_group: this.state.exCGroup,
                                                    question_no: questionNo,
                                                    question_name: questionLabel,
                                                    question_type: questionTypeName,
                                                    answered: skip ? 'No' : 'Yes',
                                                    answer_weight: answer,
                                                    answer_choice: choice,
                                                    comment: comment,
                                                });

                                                this.setState({
                                                    exportData: exportDataArr,
                                                },  () => { 
                                                      // console.log(`after exportData`, this.state.exportData);
                                                    } 
                                                );
                                                
                                                const answerObj = {
                                                    skip: skip,
                                                    weight: answer,
                                                    choice: choiceHtml,
                                                    comment: comment,
                                                    signature: signatureImage,
                                                    consent: consentImagePath,
                                                } 
                                                
                                              // console.log(`checkbox ${i} questionObj`, questionObj);
                                              // console.log(`checkbox ${i} answerObj`, answerObj);

                                                return <CheckboxRowBrowse key={i} question={questionObj} answer={answerObj} />;
                                                
                                                // rp.Data.recordset.map((data: any) => {
                                                //   // console.log('data', data);
                                                //   // console.log('answer', data.answer);
                                                //   // console.log('skip_status', data.skip_status);
                                                //     if(data.skip_status === 0){

                                                //         const answers = data.answer.split(',');
                                                //       // console.log(`get answers from data.answer = `, answers);

                                                //         //for equal of choice number
                                                //         for (let i = 0; i < choices.length; i++) {
                                                //             for(let ansIndex = 0; ansIndex < answers.length; ansIndex++) {
                                                //               // console.log(`parseInt(answers[ansIndex] = ${parseInt(answers[ansIndex])} === parseInt(weights[${i}]) = `, weights[i]);
                                                //                 if(parseInt(answers[ansIndex]) === parseInt(weights[i])){ 

                                                //                     sumScore[i]++;
                                                //                   // console.log(`in if parseInt(answers[ansIndex]) === parseInt(weights[i])`,sumScore[i]);
                                                //                     countTotal++;
                                                //                 }  
                                                //             }
                                                            
                                                //         }

                                                //         sumAnswered++;

                                                //         if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                //     }
                                                //     else{
                                                //         sumSkip++;
                                                //     }

                                                // });
                                            }
                                            else if(questionTypeId === 4){

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);

                                                    skip = data.skip_status;
                                                    answer = data.answer;
                                                    comment = data.comment;
                                                });
                                                
                                                let exportDataArr = this.state.exportData;
                                                exportDataArr.push({
                                                    complete_status: this.state.exComplete,
                                                    collector_name: this.state.exCName,
                                                    collector_type: this.state.exCType,
                                                    time_spent: this.state.exTimeSpent,
                                                    started: this.state.exStart,
                                                    last_modified: this.state.exLastModified,
                                                    ip: this.state.exIp,
                                                    email: this.state.exEmail,
                                                    mobile: this.state.exMobile,
                                                    name_title: this.state.exNameTitle,
                                                    first_name: this.state.exFName,
                                                    last_name: this.state.exLName,
                                                    birthdate: this.state.exBirthDate,
                                                    line_id: this.state.exLineId,
                                                    id_card_4_digit: this.state.exIdCard4Digit,
                                                    room_number: this.state.exRoomNumber,
                                                    institution_name: this.state.exInstitutionName,
                                                    project_name: this.state.exProjectName,
                                                    customer_id: this.state.exCusID,
                                                    custom_group: this.state.exCGroup,
                                                    question_no: questionNo,
                                                    question_name: questionLabel,
                                                    question_type: questionTypeName,
                                                    answered: skip ? 'No' : 'Yes',
                                                    answer_weight: answer,
                                                    answer_choice: choice,
                                                    comment: comment,
                                                });

                                                this.setState({
                                                    exportData: exportDataArr,
                                                },  () => { 
                                                      // console.log(`after exportData`, this.state.exportData);
                                                    } 
                                                );
                                                
                                                const answerObj = {
                                                    skip: skip,
                                                    weight: answer,
                                                    comment: comment,
                                                } 
                                                
                                              // console.log(`score ${i} questionObj`, questionObj);
                                              // console.log(`score ${i} answerObj`, answerObj);
                                                
                                                return <ScoreRowBrowse key={i} question={questionObj} answer={answerObj} />;
                                            }
                                            else if(questionTypeId === 5){

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);

                                                    skip = data.skip_status;
                                                    answer = data.answer;
                                                });

                                                let exportDataArr = this.state.exportData;
                                                exportDataArr.push({
                                                    complete_status: this.state.exComplete,
                                                    collector_name: this.state.exCName,
                                                    collector_type: this.state.exCType,
                                                    time_spent: this.state.exTimeSpent,
                                                    started: this.state.exStart,
                                                    last_modified: this.state.exLastModified,
                                                    ip: this.state.exIp,
                                                    email: this.state.exEmail,
                                                    mobile: this.state.exMobile,
                                                    name_title: this.state.exNameTitle,
                                                    first_name: this.state.exFName,
                                                    last_name: this.state.exLName,
                                                    birthdate: this.state.exBirthDate,
                                                    line_id: this.state.exLineId,
                                                    id_card_4_digit: this.state.exIdCard4Digit,
                                                    room_number: this.state.exRoomNumber,
                                                    institution_name: this.state.exInstitutionName,
                                                    project_name: this.state.exProjectName,
                                                    customer_id: this.state.exCusID,
                                                    custom_group: this.state.exCGroup,
                                                    question_no: questionNo,
                                                    question_name: questionLabel,
                                                    question_type: questionTypeName,
                                                    answered: skip ? 'No' : 'Yes',
                                                    answer_weight: '',
                                                    answer_choice: '',
                                                    comment: answer,
                                                });

                                                this.setState({
                                                    exportData: exportDataArr,
                                                },  () => { 
                                                      // console.log(`after exportData`, this.state.exportData);
                                                    } 
                                                );

                                                const answerObj = {
                                                    skip: skip,
                                                    answer: answer,
                                                } 

                                              // console.log(`text ${i} questionObj`, questionObj);
                                              // console.log(`text ${i} answerObj`, answerObj);
                                                
                                                return <TextRowBrowse key={i} question={questionObj} answer={answerObj} />;
                                            }

                                            return false;
                                        } else {
                                            // this.setState({ isLoading: false });
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getQuestionAnswer BaseService.getWithBody<Answer> '/answer/${surveyId}/${questionId}/${questionTypeId}/${this.state.respondents[this.state.respondentNo - 1].id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            return false;
                                        }
                                    }catch(error){ 
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getQuestionAnswer BaseService.getWithBody<Answer> '/answer/${surveyId}/${questionId}/${questionTypeId}/${this.state.respondents[this.state.respondentNo - 1].id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }//(rp)
                            );//call answer api to element

                          // console.log(`got answer ${i} element`, element);
                            return element;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return false;
                        }

                    } else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                } catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
                }//async (rp)
            );//call question api

        }
        
        getPageNo = async (surveyId: any, i: any) => {
          // console.log ("getPageElementRenderIndex question no." + i);
            
            return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, this.state.jwtToken).then(
                async (rp) => {
                    try{
                        if (rp.Status) {

                          // console.log(`get question ${i}`, rp.Messages);
                          // console.log(`get question ${i}`, rp.Data);
                          // console.log(`get question ${i} count = `, rp.Data.recordset.length);

                            if(rp.Data.recordset.length){

                                const questionPageNo = rp.Data.recordset[0].page_no;
                              // console.log(`get question no. ${i} questionPageNo = `, questionPageNo);

                                return questionPageNo;

                            } else {
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                return false;
                            }

                        }//if rp.Status
                        else {
                            // this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze-browse getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
            }//async (rp)
        );//call question api
    }

    insert( arr: any, index: any, item: any ) {
        arr.splice( index, 0, item );
    };

    toolChange = (e: any, arg1: any) => {
      // console.log('toggleBox', arg1);
        this.setState({ sidebarTool: arg1 }, () => 
          { /*console.log(this.state.sidebarTool)*/ }
        );
    };

    onChangeFilterStartDate = (value: any, dateString: any) => {
      // console.log('onChangeFilterStartDate Selected Time: ', value);
      // console.log('onChangeFilterStartDate Formatted Selected Time: ', dateString);

      // console.log('onChangeFilterStartDate: ', value);
        let datetime = value ? moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : '';
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
          // console.log('onChangeFilterStartDate after dateTimeSub: ', datetime);
        }
      // console.log('onChangeFilterStartDate: ', datetime);

        this.setState({ filterStartDate: datetime }, () => 
          { /*console.log('after this.state.filterStartDate', this.state.filterStartDate)*/ }
        );
    }

    onFilterStartDateOk = (value: any) => {
      // console.log('onFilterStartDateOk: ', value);
        let datetime = value ? moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '';
      // console.log('onFilterStartDateOk before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
          // console.log('onFilterStartDateOk after dateTimeSub: ', datetime);
        }
      // console.log('onFilterStartDateOk: ', datetime);

        this.setState({ filterStartDate: datetime }, () => 
          { /*console.log('after this.state.filterStartDate', this.state.filterStartDate)*/ }
        );
    }

    onChangeFilterEndDate = (value: any, dateString: any) => {
      // console.log('onChangeFilterEndDate Selected Time: ', value);
      // console.log('onChangeFilterEndDate Formatted Selected Time: ', dateString);

      // console.log('onChangeFilterEndDate: ', value);
        let datetime = value ? moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : '';
      // console.log('onChangeFilterEndDate before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
          // console.log('onChangeFilterEndDate after dateTimeSub: ', datetime);
        }
      // console.log('onChangeFilterEndDate: ', datetime);

        this.setState({ filterEndDate: datetime }, () => 
          { /*console.log('after this.state.filterEndDate', this.state.filterEndDate)*/ }
        );
    }

    onFilterEndDateOk = (value: any) => {
      // console.log('onFilterEndDateOk: ', value);
        let datetime = value ? moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '';
      // console.log('onFilterEndDateOk before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
          // console.log('onFilterEndDateOk after dateTimeSub: ', datetime);
        }
      // console.log('onFilterEndDateOk: ', datetime);

        this.setState({ filterEndDate: datetime }, () => 
          { /*console.log('after this.state.filterEndDate', this.state.filterEndDate)*/ }
        );
    }

    applyFilterTimePeriod(){
      // console.log('this.state.filterTimePeriod', this.state.filterTimePeriod);
      // console.log('this.state.filterStartDate', this.state.filterStartDate);
      // console.log('this.state.filterEndDate', this.state.filterEndDate);

        this.setState({ 
            isLoadingAnalyze: true,
            filterTimePeriod: true,
        }, () => {
          // console.log('after this.state.filterTimePeriod', this.state.filterTimePeriod);
          // console.log('after this.state.filterStartDate', this.state.filterStartDate);
          // console.log('after this.state.filterEndDate', this.state.filterEndDate);
          this.renderQuestionAnswerRow();
        });
    }

    cancelFilterTimePeriod(){

        this.setState({ 
            isLoadingAnalyze: true,
            filterTimePeriod: false,
            filterStartDate: '',
            filterEndDate: '', 
        }, () => {
          // console.log('after this.state.filterTimePeriod', this.state.filterTimePeriod);
          // console.log('after this.state.filterStartDate', this.state.filterStartDate);
          // console.log('after this.state.filterEndDate', this.state.filterEndDate);
          this.renderQuestionAnswerRow();
        });
        
    }

    onClickGotoRespondentBtn  = (e: any) => {
        e.preventDefault();
      // console.log('onClickGotoMenuBtn');
        this.setState({ gotoRespondentMenu: !this.state.gotoRespondentMenu }, () => 
          { /*console.log(this.state.gotoRespondentMenu)*/ }
        );

        // this.setState({ 
        //     respondentNo: this.state.inputRespondentNo && this.state.inputRespondentNo <= this.state.respondents.length ? this.state.inputRespondentNo : this.state.respondentNo
        // }, () => {
        //       // console.log('respondentId', this.state.respondentId);
        //         this.setState({ isLoadingAnalyze: true });
        //         this.renderElement();
        //     }
        // );
    };

    onClickGoBtn  = (e: any) => {
        e.preventDefault();
      // console.log('onClickGoBtn');
        this.setState({ gotoRespondentMenu: false }, () => 
          { /*console.log(this.state.gotoRespondentMenu)*/ }
        );

        this.setState({ 
            respondentNo: this.state.inputRespondentNo && this.state.inputRespondentNo <= this.state.respondents.length ? this.state.inputRespondentNo : this.state.respondentNo
        }, () => {
              // console.log('respondentId', this.state.respondentId);
                this.setState({ isLoadingAnalyze: true });
                this.renderElement();
            }
        );
    };

    onClickPreviousRespondentBtn  = (e: any) => {
        e.preventDefault();
      // console.log('onClickPreviousRespondentBtn respondentNo', this.state.respondentNo);
        this.setState({ 
            respondentNo: this.state.respondentNo > 1 ? this.state.respondentNo - 1 : 1,
            inputRespondentNo: this.state.respondentNo > 1 ? this.state.respondentNo - 1 : 1,
        }, () => {
              // console.log('after onClickPreviousRespondentBtn respondentNo', this.state.respondentNo);
              // console.log('after onClickPreviousRespondentBtn inputRespondentNo', this.state.inputRespondentNo);
                this.setState({ isLoadingAnalyze: true });
                this.renderElement();
            }
        );
    };

    onClickNextRespondentBtn  = (e: any) => {
        e.preventDefault();
      // console.log('onClickNextRespondentBtn respondentNo', this.state.respondentNo);
        this.setState({ 
            respondentNo: this.state.respondentNo < this.state.respondents.length ? this.state.respondentNo + 1 : this.state.respondentNo,  
            inputRespondentNo: this.state.respondentNo < this.state.respondents.length ? this.state.respondentNo + 1 : this.state.respondentNo  
        }, () => {
              // console.log('after onClickNextRespondentBtn respondentNo', this.state.respondentNo);
              // console.log('after onClickNextRespondentBtn inputRespondentNo', this.state.inputRespondentNo);
                this.setState({ isLoadingAnalyze: true });
                this.renderElement();
            }
        );
    };

    onInputHandler = (e : any) => {
        // e.preventDefault();
      // console.log('onInputHandler', e);
      // console.log('onInputHandler', e.target.value);

        this.setState({ 
            inputRespondentNo: e.target.value ? parseInt(e.target.value) : e.target.value
        }, () => {
              // console.log('inputRespondentNo', this.state.inputRespondentNo);
            }
        );
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

        let strDateTime = dd.toString() + '-' + mm.toString() + '-' + yyyy.toString() + '_' + HH.toString() + '-' + MM.toString() + '-' + SS.toString() + '-' + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }

    applyFilterCollector(){

        // console.log('applyFilterCollector');
      
        this.setState({
            isLoadingAnalyze: true,
            filterCollector: true,
        }, () => {
          this.renderQuestionAnswerRow();
        });

    }

    cancelFilterCollector(){

        // console.log('cancelFilterCollector');

        this.setState({
            isLoadingAnalyze: true,
            filterCollector: false,
            checkedCollectorList: this.state.defaultCollectorCheckedList
        }, () => {
          this.renderQuestionAnswerRow();
        });
    }

    onCollectorOptionsChange = (checkedCollectorList: any) => {
        // console.log('onCollectorOptionsChange', checkedCollectorList);
        this.setState({
            checkedCollectorList: checkedCollectorList
        });
    };

    applyFilterProject(){

        // console.log('applyFilterProject');
      
        this.setState({
            isLoadingAnalyze: true,
            filterProject: true,
        }, () => {
          this.renderQuestionAnswerRow();
        });

    }

    cancelFilterProject(){

        // console.log('cancelFilterProject');

        this.setState({
            isLoadingAnalyze: true,
            filterProject: false,
            checkedProjectList: this.state.defaultProjectCheckedList
        }, () => {
          this.renderQuestionAnswerRow();
        });
    }

    onProjectOptionsChange = (checkedProjectList: any) => {
        // console.log('onProjectOptionsChange', checkedProjectList);
        this.setState({
            checkedProjectList: checkedProjectList,
        });
    };

    //Filter Respondent Metadata
    applyFilterRespondentMetadata(){
        // console.log('filterCustomerId', this.state.filterCustomerId);
        // console.log('filterLineId', this.state.filterLineId);
        // console.log('filterMobileNumber', this.state.filterMobileNumber);
        // console.log('filterEmail', this.state.filterEmail);
        // console.log('filterFirstName', this.state.filterFirstName);
        // console.log('filterLastName', this.state.filterLastName);
        // console.log('filterCustomGroup', this.state.filterCustomGroup);
        // console.log('filterIPAddress', this.state.filterIPAddress);
        this.setState({ 
            isLoadingAnalyze: true,
            filterRespondentMetadata: true,
        }, () => {
            this.renderQuestionAnswerRow();
        });
    }

    cancelFilterRespondentMetadata(){
        this.setState({ 
            isLoadingAnalyze: true,
            filterRespondentMetadata: false,
            filterCustomerId: '',
            filterLineId: '',
            filterIdCard4Digit: '',
            filterRoomNumber: '',
            filterMobileNumber: '',
            filterFirstName: '',
            filterLastName: '', 
            filterEmail: '', 
            filterCustomGroup: '', 
            filterIPAddress: '', 
            filterInstitutionName: '', 
            filterProjectName: '', 
            filterCompanyName: '', 
            filterDepartment: '', 
            filterPosition: '', 
        }, () => {
            this.renderQuestionAnswerRow();
        });
    }

    onFilterCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterCustomerIdChange', e.target.id, e.target.value);
        this.setState({ filterCustomerId: e.target.value });
    };
    onFilterLineIdChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterLineIdChange', e.target.id, e.target.value);
        this.setState({ filterLineId: e.target.value });
    };
    onFilterIdCard4DigitChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIdCard4DigitChange', e.target.id, e.target.value);
        this.setState({ filterIdCard4Digit: e.target.value });
    };
    onFilterRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterRoomNumberChange', e.target.id, e.target.value);
        this.setState({ filterRoomNumber: e.target.value });
    };
    onFilterMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterMobileNumberChange', e.target.id, e.target.value);
        this.setState({ filterMobileNumber: e.target.value });
    };
    onFilterEmailChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterEmailChange', e.target.id, e.target.value);
        this.setState({ filterEmail: e.target.value });
    };
    onFilterFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFirstNameChange', e.target.id, e.target.value);
        this.setState({ filterFirstName: e.target.value });
    };
    onFilterLastNameChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterLastNameChange', e.target.id, e.target.value);
        this.setState({ filterLastName: e.target.value });
    };
    onFilterCustomGroupChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterCustomGroupChange', e.target.id, e.target.value);
        this.setState({ filterCustomGroup: e.target.value });
    };
    onFilterIPAddressChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterIPAddress: e.target.value });
    };
    onFilterInstitutionName = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterInstitutionName: e.target.value });
    };
    onFilterProjectName = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterProjectName: e.target.value });
    };
    onFilterCompanyName = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterCompanyName: e.target.value });
    };
    onFilterDepartment = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterDepartment: e.target.value });
    };
    onFilterPosition = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterPosition: e.target.value });
    };

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

            // <div id="create" className="translate step2 basic modern-browser themeV3 sticky">
            <div style={{borderBottom: "1px solid #d1d2d3"}}>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <div className="content-wrapper">

                    <header className="subhead">
                        <nav className="navigationTabs">
                            <div className="global-navigation-header ">
                                <div className="global-navigation-header-title-container global-navigation-header-centered clearfix" style={{ paddingTop:'4px' }}>
                                    <h1 className="wds-pageheader__title wds-type--section-title">
                                    {/* <span><span id="edit-name-icon" onClick={()=>this.Rename()} className="smf-icon notranslate">W</span> {this.state.survey.nickname}</span> */}
                                    <span><Icon type="edit" onClick={()=>this.Rename()}/> {this.state.survey.nickname}</span>
                                    </h1>
                                </div>
                                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'analyze'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>
                            </div>
                        </nav>
                    </header>

                    <div className="bd logged-in-bd" style={{marginTop: '160px'}}>

                        {/* <div className="wds-pageheader">
                            <div className="wds-pageheader__text">
                                <h1 className="wds-pageheader__title wds-type--section-title">
                                    <span>{this.state.survey.nickname}</span>
                                </h1>
                            </div>
                        </div> */}

                        {/* <MenuSurvey menuKey={'summary'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/> */}

                        <div id="overlay" className={ this.state.isLoadingAnalyze ? '' : 'hidden'}>
                            <Spin size="large" tip="Loading..."></Spin>
                        </div>
                        
                        {/* Start sm-survey-summary body */}
                        <div className="container clearfix">

                            <div id="step2" className="clearfix survey-body-v3 survey-body theme-body">
                                <aside id="sidebar" className="stick upgrade">
                                    
                                    <div id="createAccordion" className="accordion unique" style={{height: '100vh'}}>
                                        <nav className="sidenav-view collapsible" style={{height: '100vh'}}>
                                            <ul>
                                                <li onClick={ (e) => this.toolChange(e, "filter") } data-sidebar="accQuestionBank" className={ this.state.sidebarTool === "filter" ? "nav-tabs-select-style" : "" } sm-tooltip-side="right" title="FILTER">
                                                    <a href="# " className="notranslate">
                                                        <Icon type="filter"/>
                                                    </a>
                                                </li>
                                                {/* <li onClick={ (e) => this.toolChange(e, "compare") } data-sidebar="accBuilder" sm-tooltip-side="right" className={ this.state.sidebarTool === "compare" ? "nav-tabs-select-style" : "" } title="COMPARE">
                                                    <a href="# " className="notranslate">
                                                        <Icon type="swap"/>
                                                    </a>
                                                </li> */}
                                                {/* <li onClick={ (e) => this.toolChange(e, "show") } data-sidebar="accBuilder" sm-tooltip-side="right" className={ this.state.sidebarTool === "show" ? "nav-tabs-select-style" : "" } title="SHOW">
                                                    <a href="# " className="notranslate">
                                                        <Icon type="eye"/>
                                                    </a>
                                                </li> */}
                                            </ul>
                                        </nav>
                                                        
                                        <div id="accQuestionBank" className={ this.state.sidebarTool === "filter" ? "key open" : "key hidden" } style={{ display: 'block', maxHeight: '100%'}}>
                                            <header>
                                                <h3 className="accordionLabel">
                                                    <a href="# " className="press keyOpener" target="#questionBankSettings" data-action="surveyQuestionBank" style={{ cursor: 'default' }}>FILTER</a>
                                                </h3>
                                            </header>
                                            <section id="questionBankSettings">{/*style={{height: '100vh'}}>*/}
                                                {/* <div id="create-qb-container" style={{height: '100vh'}}><div className="setting src-styles-common-_reset---questionBankApp---20vDf" id="qbl-app" style={{height: '278px'}}><div className="src-styles-_AccordionView---AccordionView---1Opdf" id="qbl-accordion"><ul className="addList" id="qbl-accordion-tiles"><ul className="addList"><li id="qbl-accordion-tile-recommendation"><div className="src-styles-_AccordionTile---content---1vnHu"><i className="icon src-styles-common-_icon---smIcon---1qA7b smf-icon src-styles-_AccordionTile---arrowRight---2dwTv">ÿ</i><span className="listText src-styles-_AccordionTile---text---2evIw">Recommended Questions</span></div></li><li id="qbl-accordion-tile-tag-id-market_research"><div className="src-styles-_AccordionTile---content---1vnHu"><i className="icon src-styles-common-_icon---smIcon---1qA7b smf-icon src-styles-_AccordionTile---arrowRight---2dwTv">ÿ</i><span className="listText src-styles-_AccordionTile---text---2evIw">Market Research</span></div></li></ul></ul></div></div></div> */}
                                                <div id="builderQuestionContainer" className="setting" style={{/*height: 'calc(100vh - 200px)', overflowY: 'auto'*/}}>{/*height: '100vh'*/}
                                                    <ul className="addList">
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Time Period</span>
                                                                { !this.state.filterTimePeriod ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterTimePeriod: true }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.filterTimePeriod ? 
                                                            <div id='filter-time-period'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div>
                                                                            {/* <label className="sm-label sm-label--stretch"><b>Start Date:</b></label> */}
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Start Date : </span>
                                                                            <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.filterStartDate ? moment(this.state.filterStartDate, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeFilterStartDate} onOk={this.onFilterStartDateOk} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>End Date : </span>
                                                                            <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.filterEndDate ? moment(this.state.filterEndDate, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeFilterEndDate} onOk={this.onFilterEndDateOk} />
                                                                        </div>
                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterTimePeriod() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterTimePeriod() } }>CANCEL</a>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            : null }
                                                        </li>

                                                        {/* check if the survey has some project to do a collecotr filter */}
                                                        { this.state.projectCheckboxOptions.length ? 
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Project</span>
                                                                { !this.state.filterProject ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterProject: true, filterCollector: false }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.filterProject ? 
                                                            <div id='filter-project'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div>
                                                                            <CheckboxGroup options={this.state.projectCheckboxOptions} value={this.state.checkedProjectList} onChange={this.onProjectOptionsChange}/>
                                                                        </div>
                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterProject() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterProject() } }>CANCEL</a>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            : null }
                                                        </li>
                                                        : null }

                                                        {/* check if the survey has some collector to do a collecotr filter */}
                                                        { this.state.collectorCheckboxOptions.length ? 
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Collector</span>
                                                                { !this.state.filterCollector ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterCollector: true, filterProject: false }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.filterCollector ? 
                                                            <div id='filter-collector'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div>
                                                                            <CheckboxGroup options={this.state.collectorCheckboxOptions} value={this.state.checkedCollectorList} onChange={this.onCollectorOptionsChange}/>
                                                                        </div>
                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterCollector() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterCollector() } }>CANCEL</a>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            : null }
                                                        </li>
                                                        : null }
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Respondent Metadata</span>
                                                                { !this.state.filterRespondentMetadata ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterRespondentMetadata: true }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.filterRespondentMetadata ? 
                                                            <div id='filter-time-period'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Customer ID : </span>
                                                                            <Input placeholder="Customer ID" allowClear onChange={this.onFilterCustomerIdChange} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Email : </span>
                                                                            <Input placeholder="Email" allowClear onChange={this.onFilterEmailChange} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>First Name : </span>
                                                                            <Input placeholder="First Name" allowClear onChange={this.onFilterFirstNameChange} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Last Name : </span>
                                                                            <Input placeholder="Last Name" allowClear onChange={this.onFilterLastNameChange} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Custom Group : </span>
                                                                            <Input placeholder="Custom Group" allowClear onChange={this.onFilterCustomGroupChange} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>IP Address : </span>
                                                                            <Input placeholder="IP Address" allowClear onChange={this.onFilterIPAddressChange} />
                                                                        </div>

                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterRespondentMetadata() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterRespondentMetadata() } }>CANCEL</a>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            : null }
                                                        </li>

                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                                        
                                        <div id="accBuilder" className={ this.state.sidebarTool === "compare" ? "key open" : "key hidden" } style={{ display: 'block', maxHeight: '100%' }}>
                                            <header>
                                                <h3 className="accordionLabel">
                                                    <a href="# " onClick={ (e) => { e.preventDefault() } } className="press keyOpener" target="#accPanelBuilder" data-action="surveyBuilder">COMPARE</a>
                                                </h3>
                                                
                                            </header>
                                            <section className="acContent" id="accPanelBuilder">{/* style={{height: 'auto', overflowY: 'auto'}} */}
                                                <div id="builderQuestionContainer" className="setting" style={{/*height: 'calc(100vh - 200px)', overflowY: 'auto'*/}}>{/*height: '100vh'*/}
                                                    <ul className="addList">
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Compare by Time Period</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>COMPARE</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </aside>

                                <div className="live-preview-wrapper" style={{ padding: '0' }}> 
                                    <div id="livePreview" className="livePreview" style={{ maxWidth: '100%' }}>
                                        <div id="pageid-110955719" className="page v3theme      first-page      last-page">

                                            <div className="analyze-mode-header sm-corner-a" view-role="AnalyzeHeaderView">
                                                <div className="stats-header clearfix sm-corner-t " view-role="statsHeaderView" style={{width: '900px'}}>
                                                    <h4 className="sm-float-l">
                                                            RESPONDENTS: { this.state.respondents.length > 0 ? this.state.respondentNo : '0' } of {this.state.respondents.length} {/*this.state.respondents.length (Total responses: this.state.total_responses)*/}
                                                    </h4>
                                                    {/* <div global-share-menu="" className="persistent-buttons sm-float-r">
                                                        { this.state.respondents.length > 0 ?
                                                        <a href="#" className="wds-button wds-button--icon-right wds-button--sm wds-button--arrow-down">SAVE AS</a>
                                                        : null }
                                                    </div> */}
                                                </div>

                                                <ul className="mode-tabs clearfix" view-role="modeTabsView" style={{ display: 'block' }}>
                                                    <li id="mode_tab_question_summaries" className="">
                                                        <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/${this.state.survey.id}` }>
                                                            QUESTION SUMMARIES WITH INSIGHT
                                                        </a>
                                                    </li>
                                                        {/* <li id="mode_tab_trends" className=" mode_tab_trends_insight">
                                                            <a href="/analyze/data-trends/sUrHwPtsu8ZHNr6AN9qQlPuHu_2BmaaY8BPd23hgtgCKw_3D" className="">
                                                            INSIGHTS AND DATA TRENDS
                                                            </a>
                                                        </li> */}
                                                    <li id="mode_tab_individual_responses" className="selected">
                                                        <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/browse/${this.state.survey.id}` }>
                                                            INDIVIDUAL RESPONSES
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>

                                            { this.state.respondents.length > 0 ?
                                            <div id="analyze-browse-content-wrapper">
                                                <div className="analyze-nav-content clearfix " view-role="contentNavView" style={{ width: '900px'}}>
                                                    <div className="respondent-nav sm-float-l" view-role="respondentNavView">
                                                        <a href="/#" onClick={ (e) => this.onClickGotoRespondentBtn(e) } className="respondent-goto-menu-btn sm-float-l wds-button wds-button--util wds-button--arrow-down open" view-role="respondentMenuBtnView">
                                                            Respondent #{this.state.respondentNo}
                                                        </a>
                                                        <div className="btn-menu sm-respondent-nav-buttons sm-float-l" view-role="respondentArrowBtnsView">
                                                            <a href="/#" onClick={ (e) => this.onClickPreviousRespondentBtn(e) } className=" wds-button wds-button--util" style={{ marginRight: '5px' }}><Icon type="caret-left"/></a>
                                                            <a href="/#" onClick={ (e) => this.onClickNextRespondentBtn(e) } className=" wds-button wds-button--util"><Icon type="caret-right"/></a>
                                                            {/* <Icon type="caret-left" onClick={ (e) => this.onClickPreviousRespondentBtn(e) } style={{ marginRight: '5px' }}/>
                                                            <Icon type="caret-right" onClick={ (e) => this.onClickNextRespondentBtn(e) }/> */}
                                                            {/* <a href="/#" onClick={ (e) => this.onClickNextRespondentBtn(e) } className=" disabled  wds-button wds-button--util wds-button--arrow-right"></a> */}
                                                        </div>
                                                        <div className={ this.state.gotoRespondentMenu ? "respondent-goto-menu" : "respondent-goto-menu hidden"} style={{ top: '54px', left: '0.5px' }}>
                                                            <form action="goToRespondent">
                                                                <label>Go to:</label>
                                                                <input type="text" onChange={ (e) => this.onInputHandler(e) } className="goto-number-text sm-input" value={this.state.inputRespondentNo}/> of {this.state.respondents.length}
                                                                <button onClick={ (e) => this.onClickGoBtn(e) } className="goto-btn wds-button wds-button--sm">Go</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="analyze-pages-content-wrapper" view-role="analyzeContentWrapperView" style={{ width: '900px' }}>
                                        
                                                    <div className="respondent " sm-respondent="" view-role="respondentView" style={{ width: '900px' }}>
                                                        <div className="respondent-profile clearfix spacer-phm spacer-ptm sm-corner-a fadeable" style={{ marginBottom: '0' }}>
                                                            <div className="respondent-tool-bar sm-float-r">
                                                                <div edit-delete-menu="" className="wds-button-group sm-float-r">
                                                                </div>
                                                            </div>
                                                            <div id="respondent-profile-data" className="respondent-data">
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="response-page-list" view-role="responsePageListView">
                                                            <div className="sm-analyze-page" sm-page-id="110955719" view-role="responsePageView">

                                                                <div id="response-question-answer-list"></div>

                                                            </div>
                                                        </div>
                                        
                                                    </div>{/* respondent */}

                                                </div>{/* analyze-pages-content-wrapper */}
                                            </div>

                                            :

                                            <div id="analyze-browse-empty-wrapper" style={{ width: '900px', margin: '0 auto' }}>
                                                <Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '140px 0 100px 0' }}/>
                                            </div>

                                            }

                                        </div>{/* pageid */}
                                    </div>{/* livePreview */}

                                </div>{/* live-preview-wrapper */}

                            </div>{/* step2 */}

                        </div>{/* container */}
                    </div>{/* bd logged-in-bd*/ }

                    {/* <h1 style={{ margin: '40px 0px 50px 50px'}}>SUMMARY{this.state.survey.title}</h1> */}

                </div>

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visible}
                />

            </div>
        );
    }
}