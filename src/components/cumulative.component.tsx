import React from 'react';
import ReactDOM from 'react-dom';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import CheckboxGroup from "antd/lib/checkbox/Group";
import MenuSurvey from '../common/menu';
import moment from 'moment';

import { Empty, Icon, Spin, DatePicker, Tooltip, Input, Button} from 'antd';

import HeaderSurvey from '../common/header';

import SurveyResponse from '../models/surveyResponse';
import Answer from '../models/answers';
import Question from '../models/questions';

import RatingRow from "../common/cumulative/ratingRow";
import TextRow from "../common/cumulative/textRow";
import ChoiceRow from '../common/cumulative/choiceRow';
import CheckboxRow from '../common/cumulative/checkboxRow';
import ScoreRow from '../common/cumulative/scoreRow';

import '../css/smlib.ui-global-bundle-min.471d0b30.css';
import '../css/anweb-summary-webpack-bundle-min.3bdc0105.css';
import '../css/anweb-analyze-bundle-min.e5376b09.css';
import '../css/anweb-summary-bundle-min.7d57dd0a.css';

import SurveyReNicknameModal from '../common/modal/surveyRenicknameModal';

const { RangePicker } = DatePicker;

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
    respondents: number,
    total_responses: number,
    
    numQuestion: number,

    dailyRangePicker: boolean,
    monthlyRangePicker: boolean,

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
    filterCompanyName: string,
    filterDepartmentName: string,
    filterPosition: string,

    exportData: any,
    
    jwtToken: any,

    filterCollector: boolean,
    collectorCheckboxOptions: any,
    checkedCollectorList: any,
    defaultCollectorCheckedList: any,

    filterProject: boolean,
    projectCheckboxOptions: any,
    checkedProjectList: any,
    defaultProjectCheckedList: any,

    filterDepartment: boolean,
    departmentCheckboxOptions: any,
    checkedDepartmentList: any,
    defaultDepartmentCheckedList: any,
    
    filterAreaOfImpact: boolean,
    areaOfImpactsCheckboxOptions: any,
    checkedAreaOfImpactstList: any,
    defaultAreaOfImpactsCheckedList: any,

    TabDefaultActiveKey: any,
    dateMode: any,
    datesValue: any,
    diffDaysAbs: any,
    monthMode: any,
    monthsValue: any,
    diffMonthsAbs: any,
    visible: boolean,

    countEmptyDepartment: number,
    countEmptyAreaOfImpact: number
}

export default class Cumulative extends React.Component<IProps, IState> {

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
            respondents: 0,
            total_responses: 0,

            numQuestion: 0,

            dailyRangePicker: false,
            monthlyRangePicker: true,

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
            filterCompanyName: '',
            filterDepartmentName: '',
            filterPosition: '',

            exportData: [],

            jwtToken: {},

            filterCollector: false,
            collectorCheckboxOptions: [],
            checkedCollectorList: [],
            defaultCollectorCheckedList: [],

            filterProject: false,
            projectCheckboxOptions: [],
            checkedProjectList: [],
            defaultProjectCheckedList: [],

            filterDepartment: false,
            departmentCheckboxOptions: [],
            checkedDepartmentList: [],
            defaultDepartmentCheckedList: [],
            
            filterAreaOfImpact: false,
            areaOfImpactsCheckboxOptions: [],
            checkedAreaOfImpactstList: [],
            defaultAreaOfImpactsCheckedList: [],

            TabDefaultActiveKey: 'monthly',
            dateMode: ['date', 'date'],
            datesValue: [],
            monthMode: ['month', 'month'],
            monthsValue: [],
            diffDaysAbs: 30,
            diffMonthsAbs: 11,
            visible: false,

            countEmptyDepartment: 0,
            countEmptyAreaOfImpact: 0,
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

    getEntitySentiment(rp: any, questionAnalyzeEntity: any, questionAnalyzeSentiment: any){
        try{
            let tags = [] as any;
            let tags_positive = [] as any;
            let tags_negative = [] as any;
            // let tags_sentiment_answer = [] as any;

            rp.Data.recordsets[1].map((data: any) => {
            // console.log('getEntitySentiment data', data);
            // console.log('getEntitySentiment answer', data.answer);
            // console.log('getEntitySentiment skip_status', data.skip_status);
            // console.log('getEntitySentiment', data.analyze_entity);
                
                if(data.skip_status === 0){

                    if(questionAnalyzeEntity && !questionAnalyzeSentiment && data.analyze_entity){

                        if(data.analyze_entity.includes(',')){

                            data.analyze_entity.split(',').map((entity: any, i: any) => {
                                
                            // console.log('map entity.name', entity);
                                
                                let matched = false;
                
                                tags.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags10[index]', tags10[index]);
                                    // console.log('entity name', entity);
                                    // console.log('tags.name', tags10[index].name);
                                    // console.log('tags.value', tags10[index].value);
                                    // console.log(`${entity} === ${tags10[index].name}`, entity === tags10[index].name);
                                    if(entity === tags[index].name){
                                        // console.log('matched');
                                        tags[index].value += 1;
                                        matched = true;
                                    }
                                });
                
                                if(!matched){
                                    // console.log('not match');
                                    tags.push({
                                        name: entity,
                                        value: 1,
                                    });
                                }
                
                            });
                        }
                        else{
                            // tags.push({
                            //     name: data.analyze_entity,
                            //     value: 1,
                            // });
                            let matched = false;
                
                            tags.forEach((item: any, index: any) => {
                                // console.log('index', index);
                                // console.log('tags10[index]', tags10[index]);
                                // console.log('entity name', entity);
                                // console.log('tags.name', tags10[index].name);
                                // console.log('tags.value', tags10[index].value);
                                // console.log(`${entity} === ${tags10[index].name}`, entity === tags10[index].name);
                                if(data.analyze_entity === tags[index].name){
                                    // console.log('matched');
                                    tags[index].value += 1;
                                    matched = true;
                                }
                            });
            
                            if(!matched){
                                // console.log('not match');
                                tags.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }
                        }
                    }
                    else if(questionAnalyzeEntity && questionAnalyzeSentiment && data.analyze_entity){
            
                        // tags_sentiment_answer.push(data.answer);
            
                        let sentimentScores: any;
                        
                    // console.log('tags analyze sentiment', data.analyze_sentiment);
                        //check analyze_sentiment is not empty
                        if(data.analyze_sentiment){
                            sentimentScores = data.analyze_sentiment.includes(',') ? data.analyze_sentiment.split(',').map((sentiment: any) => { console.log(sentiment); return parseFloat(sentiment);}) : [parseFloat(data.analyze_sentiment)];
                        }
                        else{//using analyze_entity instead and set sentiment score = 0
                            sentimentScores =  data.analyze_entity.includes(',') ? data.analyze_entity.split(',').map((sentiment: any) => { return 0; }) : [0];
                        }
                        
                    // console.log('tags analyze sentimentScores', sentimentScores);
            
                        if(data.analyze_entity.includes(',')){

                            data.analyze_entity.split(',').map((entity: any, i: any) => {
                            
                            // console.log('map entity.name', entity);
                                
                                let matched = false;
                                
                            // console.log(`map sentimentScores ${i}`, sentimentScores[i]);
                
                                if( sentimentScores[i] <= 0 ){
                
                                    // tags_negative_answer.push(data.answer);
                
                                    tags_negative.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags_negative[index]', tags_negative[index]);
                                        // console.log('item', item);
                                        // console.log('item.name', item.name);
                                    // console.log('entity name', entity);
                                        // console.log('entity.value', entity.value);
                                    // console.log('tags.name', tags_negative[index].name);
                                    // console.log('tags.value', tags_negative[index].value);
                                        // console.log(`localeCompare ${tags_negative[index].name} === ${item.name}`, tags_negative[index].name.localeCompare(item.name));
                                        // console.log(`localeCompare ${entity.name} === ${item.name}`, entity.name.localeCompare(item.name));
                                    // console.log(`${entity} === ${tags_negative[index].name}`, entity === tags_negative[index].name);
                                        // if(tags_negative[index].name.localeCompare(item.name) === 0){
                                        if(entity === tags_negative[index].name){
                                        // console.log('matched');
                                            tags_negative[index].value += 1;
                                            matched = true;
                                        }
                                    });
                
                                    if(!matched){
                                    // console.log('not match');
                                        tags_negative.push({
                                            name: entity,
                                            value: 1,
                                        });
                                    }
                                }
                                else{
                
                                    // tags_positive_answer.push(data.answer);
                
                                    tags_positive.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags_positive[index]', tags_positive[index]);
                                        // console.log('item', item);
                                        // console.log('item.name', item.name);
                                    // console.log('entity name', entity);
                                        // console.log('entity.value', entity.value);
                                    // console.log('tags.name', tags_positive[index].name);
                                    // console.log('tags.value', tags_positive[index].value);
                                        // console.log(`localeCompare ${tags_positive[index].name} === ${item.name}`, tags_positive[index].name.localeCompare(item.name));
                                        // console.log(`localeCompare ${entity.name} === ${item.name}`, entity.name.localeCompare(item.name));
                                    // console.log(`${entity} === ${tags_positive[index].name}`, entity === tags_positive[index].name);
                                        // if(tags_positive[index].name.localeCompare(item.name) === 0){
                                        if(entity === tags_positive[index].name){
                                        // console.log('matched');
                                            tags_positive[index].value += 1;
                                            matched = true;
                                        }
                                    });
                
                                    if(!matched){
                                    // console.log('not match');
                                        tags_positive.push({
                                            name: entity,
                                            value: 1,
                                        });
                                    }
                                }//if else
                                
                            });//data.analyze_entity.split(',')
                        }
                        else{
                            if( sentimentScores[0] <= 0 ){
                                tags_negative.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }
                            else{
                                tags_positive.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }//if else
                        }
                    }

                }
            });

            return {
                tags: tags,
                tags_positive: tags_positive,
                tags_negative: tags_negative
            };
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getEntitySentiment catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return {
                tags: [],
                tags_positive: [],
                tags_negative: []
            };
        }
    }

    getPageNoElement = async (numPage: any) => {
        return <div key={'page-'+numPage} className="page-header sm-corner-t " view-role="SummaryPageHeaderView"><span className="page-title">Page {numPage}</span></div>;
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

                            const questionShowLabel = rp.Data.recordset[0].show_label;
                            
                            const questionEnabledKPI = rp.Data.recordset[0].enabled_kpi;
                            const questionDepartmentId = rp.Data.recordset[0].department_id;
                            const questionDepartmentIdArr = questionDepartmentId ? questionDepartmentId.includes(',') ? questionDepartmentId.split(',') : [questionDepartmentId] : [];
                            
                            const questionAreaOfImpactsId = rp.Data.recordset[0].area_of_impact_id;
                            const questionAreaOfImpactsIdArr = questionAreaOfImpactsId ? questionAreaOfImpactsId.includes(',') ? questionAreaOfImpactsId.split(',') : [questionAreaOfImpactsId] : [];

                            //find some question id which is matched with department filter list
                            let isFoundedDepartment = this.state.checkedDepartmentList.some( (ai: any) => questionDepartmentIdArr.includes(ai) );

                            //find some question id which is matched with area of impact filter list
                            let isFoundedAreaOfImpact = this.state.checkedAreaOfImpactstList.some( (ai: any) => questionAreaOfImpactsIdArr.includes(ai) );

                           

                            // console.log(`get question ${i} id = `, questionId);
                            // console.log(`get question ${i} type id = `, questionTypeId);
                            // console.log(`get question ${i} no = `, questionNo);
                            // console.log(`get question ${i} label = `, questionLabel);
                            // console.log(`get question ${i} active = `, questionActive);

                            // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                            // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);

                            let comment = [] as any;

                            //Star Rating & Multiple choicevariables
                            let choices = [] as any;
                            let weights = [] as any;
                            let chartData = [] as any;

                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6){
                                
                                const questionChoice = rp.Data.recordset[0].choice.split(',');
                              // console.log(`get question ${i} choice = `, questionChoice);

                                choices = [] as any;
                                weights = [] as any;
                                for (let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                    } 
                                    else {
                                        weights.push(questionChoice[i]);
                                    }
                                }

                              // console.log(`get question ${i} choices = `, choices);
                              // console.log(`get question ${i} weights = `, weights);
                            }
                                        
                            // console.log(`get answer ${i} element`);

                            let element: any;

                            // const firstDay = moment(this.state.datesValue[0]).endOf('month').format("YYYY-MM-DD HH:mm:ss");
                            // const lastDay = moment(this.state.datesValue[1]).endOf('month').format("YYYY-MM-DD HH:mm:ss");

                            // console.log('firstDay', firstDay);
                            // console.log('lastDay', lastDay);

                            const filterObj = {
                                dailyRangePicker: {
                                    apply: this.state.dailyRangePicker,
                                    dailyStartDate: moment(this.state.datesValue[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                                    dailyEndDate: moment(this.state.datesValue[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                                },
                                monthlyRangePicker: {
                                    apply: this.state.monthlyRangePicker,
                                    monthlyStartDate: moment(this.state.monthsValue[0]).startOf('month').format("YYYY-MM-DD HH:mm:ss"),
                                    monthlyEndDate: moment(this.state.monthsValue[1]).endOf('month').format("YYYY-MM-DD HH:mm:ss")
                                },
                                filterCollector: {
                                    apply: this.state.filterCollector,
                                    collectorId: this.state.checkedCollectorList
                                },
                                filterProject: {
                                    apply: this.state.filterProject,
                                    projectId: this.state.checkedProjectList
                                },
                                // filterDepartment: {
                                //     apply: this.state.filterDepartment,
                                //     departmentId: this.state.checkedDepartmentList
                                // },
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
                                    filterCompanyName: this.state.filterCompanyName.trim(),
                                    filterDepartment: this.state.filterDepartmentName.trim(),
                                    filterPosition: this.state.filterPosition.trim(),
                                }
                            }    

                            // console.log('answer filterObj', filterObj);

                            //get a answer just 1 time and wait for the process
                            element = await BaseService.getWithBody<Answer>(this.props.match.params.xSite, '/answer/rangepicker/', surveyId + '/' + questionId + '/' + questionTypeId, filterObj, this.state.jwtToken).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                            // console.log(`get answer ${i}`, rp.Messages);
                                            // console.log(`get answer ${i}`, rp.Data);
                                            // console.log(`get answer ${i} count = `, rp.Data.recordset.length);

                                            // let tags = [] as any;
                                            // let tags_positive = [] as any;
                                            // let tags_negative = [] as any;
                                            
                                            //Star Rating
                                            if(questionTypeId === 1){

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    choices: choices,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment,
                                                    showLabel: questionShowLabel,
                                                }

                                                const answerObj = {
                                                    recordset: rp.Data.recordsets,
                                                }

                                                // console.log('this.state.TabDefaultActiveKey', this.state.TabDefaultActiveKey);

                                                // console.log('this.state.dailyRangePicker', this.state.dailyRangePicker);
                                                // console.log('this.state.dateMode', this.state.dateMode);
                                                // console.log('this.state.datesValue', this.state.datesValue);
                                                // console.log('this.state.diffDaysAbs', this.state.diffDaysAbs);

                                                // console.log('this.state.monthlyRangePicker', this.state.monthlyRangePicker);
                                                // console.log('this.state.monthMode', this.state.monthMode);
                                                // console.log('this.state.monthsValue', this.state.monthsValue);
                                                // console.log('this.state.diffMonthsAbs', this.state.diffMonthsAbs);

                                                return <RatingRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*/ defaultActiveKey={this.state.TabDefaultActiveKey} dailyRangePicker={this.state.dailyRangePicker} dateMode={this.state.dateMode} datesValue={this.state.datesValue} diffDaysAbs={this.state.diffDaysAbs} monthlyRangePicker={this.state.monthlyRangePicker} monthMode={this.state.monthMode} monthsValue={this.state.monthsValue} diffMonthsAbs={this.state.diffMonthsAbs} history={this.props.history} match={this.props.match}/>
                                            }
                                            else if(questionTypeId === 2 || questionTypeId === 6){

                                                const questionObj = {
                                                    no: questionNo,
                                                    typeId: questionTypeId,
                                                    label: questionLabel,
                                                    choices: choices,
                                                    weights: weights,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                } 

                                                const answerObj = {
                                                    recordset: rp.Data.recordsets
                                                } 

                                                return <ChoiceRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*/ defaultActiveKey={this.state.TabDefaultActiveKey} dailyRangePicker={this.state.dailyRangePicker} dateMode={this.state.dateMode} datesValue={this.state.datesValue} diffDaysAbs={this.state.diffDaysAbs} monthlyRangePicker={this.state.monthlyRangePicker} monthMode={this.state.monthMode} monthsValue={this.state.monthsValue} diffMonthsAbs={this.state.diffMonthsAbs} history={this.props.history} match={this.props.match}/>
                                            } 
                                            else if(questionTypeId === 3){

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    choices: choices,
                                                    weights: weights,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                } 

                                                const answerObj = {
                                                    recordset: rp.Data.recordsets,
                                                } 

                                                return <CheckboxRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*/ defaultActiveKey={this.state.TabDefaultActiveKey} dailyRangePicker={this.state.dailyRangePicker} dateMode={this.state.dateMode} datesValue={this.state.datesValue} diffDaysAbs={this.state.diffDaysAbs} monthlyRangePicker={this.state.monthlyRangePicker} monthMode={this.state.monthMode} monthsValue={this.state.monthsValue} diffMonthsAbs={this.state.diffMonthsAbs} history={this.props.history} match={this.props.match}/>
                                            }
                                            else if(questionTypeId === 4){

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                }

                                                const answerObj = {
                                                    recordset: rp.Data.recordsets,
                                                }

                                                return <ScoreRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*/ defaultActiveKey={this.state.TabDefaultActiveKey} dailyRangePicker={this.state.dailyRangePicker} dateMode={this.state.dateMode} datesValue={this.state.datesValue} diffDaysAbs={this.state.diffDaysAbs} monthlyRangePicker={this.state.monthlyRangePicker} monthMode={this.state.monthMode} monthsValue={this.state.monthsValue} diffMonthsAbs={this.state.diffMonthsAbs} history={this.props.history} match={this.props.match}/>
                                            }
                                            else if(questionTypeId === 5){

                                                let sumSkip = 0;
                                                let sumAnswered = 0;
                                                let comment = [] as any;

                                                let tags = [] as any;
                                                let tags_positive = [] as any;
                                                let tags_negative = [] as any;
                                                // let tags_sentiment_answer = [] as any;
                                                // let tags_positive_answer = [] as any;
                                                // let tags_negative_answer = [] as any;

                                                rp.Data.recordsets[1].map((data: any) => {
                                                  // console.log('text data', data);
                                                  // console.log('text answer', data.answer);
                                                  // console.log('text skip_status', data.skip_status);

                                                    if(data.skip_status === 0){
                                                        sumAnswered++;
                                                        comment.push('('+data.created_date+') ' + data.answer);
                                                        //function getEntitySentiment
                                                    }
                                                    else{
                                                        sumSkip++;
                                                    }
                                                });

                                                const tagsArr = this.getEntitySentiment(rp, questionAnalyzeEntity, questionAnalyzeSentiment);

                                                tags = tagsArr.tags;
                                                tags_positive = tagsArr.tags_positive;
                                                tags_negative = tagsArr.tags_negative;

                                              // console.log(`after ${i} getEntitySentiment tags`, tags);
                                              // console.log(`after ${i} getEntitySentiment tags_positive`, tags_positive);
                                              // console.log(`after ${i} getEntitySentiment tags_negative`, tags_negative);

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                }

                                                const answerObj = {
                                                    sumAnswered: sumAnswered,
                                                    sumSkip: sumSkip,
                                                    tags: tags,
                                                    tags_positive: tags_positive,
                                                    tags_negative: tags_negative,
                                                    comment: comment,
                                                    // tags_sentiment_answer: tags_sentiment_answer,
                                                    // tags_positive_answer: tags_positive_answer,
                                                    // tags_negative_answer: tags_negative_answer,
                                                }
                                                
                                                // console.log('text tags', tags);
                                                // console.log('text tags_positive', tags_positive);
                                                // console.log('text tags_negative', tags_negative);
                                                // console.log('text comment', comment);
                                                return <TextRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*/ history={this.props.history} match={this.props.match}/>
                                            }
                                            return false;

                                        } else {
                                            this.setState({ isLoading: false });
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getQuestionAnswer BaseService.getWithBody<Answer> /answer/rangepicker/${surveyId}/${questionId}/${questionTypeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            return false;
                                        }
                                    }catch(error){ 
                                        this.setState({ isLoading: false });
                                        // toastr.error(error);
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getQuestionAnswer BaseService.getWithBody<Answer> /answer/rangepicker/${surveyId}/${questionId}/${questionTypeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                } catch(error){ 
                    this.setState({ isLoading: false });
                    // toastr.error(error);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    this.setState({ isLoading: false });
                    // toastr.error(error);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    //Insert page element in to question elements on the index number
    insert( allQuestionElement: any, index: any, pageElement: any ) {
        allQuestionElement.splice( index, 0, pageElement );
        // arr.push(item);// append (last)
        // arr.unshift(item);//prepend (first)
    };

    public async componentDidMount() {

      // console.log('Analyze componentDidMount');

        try{
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
                                // console.log('surveys rp', rp);
                                // console.log('surveys rp.Data', rp.Data);
                                this.setState({ 
                                    survey: rp.Data.recordset[0], 
                                    isLoading: false
                                }, () => {
                                    // console.log('numQuestion', this.state.numQuestion);
                                    //check if the survey has some collector to do a collecotr filter
                                    if(this.state.survey.survey_collector_nickname && this.state.survey.survey_collector_id){
                                        const surveyCollectorNameArr = this.state.survey.survey_collector_nickname ? this.state.survey.survey_collector_nickname.includes(",") ? this.state.survey.survey_collector_nickname.split(',') : [this.state.survey.survey_collector_nickname] : [];
                                        const surveyCollectorIdArr = this.state.survey.survey_collector_id ? this.state.survey.survey_collector_id.includes(",") ? this.state.survey.survey_collector_id.split(',') : [this.state.survey.survey_collector_id] : [];
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

                                        //Department
                                        const surveyDepartmentNameArr =  this.state.survey.name_departments ? this.state.survey.name_departments.includes(",") ? this.state.survey.name_departments.split(',') : [this.state.survey.name_departments] : [];
                                        const surveyDepartmentIdArr = this.state.survey.id_departments ? this.state.survey.id_departments.includes(",") ? this.state.survey.id_departments.split(',') : [this.state.survey.id_departments] : [];
                                        const departmentCheckboxOptions = surveyDepartmentNameArr.map(function (departmentName: any, i: any) {
                                            // console.log('i', i);
                                            // console.log('departmentName', departmentName);
                                            return { label: departmentName, value: surveyDepartmentIdArr[i] };
                                        });
                                        const departmentDefaultCheckedList = surveyDepartmentNameArr.map(function (departmentName: any, i: any) {
                                            // console.log('i', i);
                                            // console.log('departmentName', departmentName);
                                            return surveyDepartmentIdArr[i];
                                        });
                                        // const departmentCheckboxOptions = [ { label: "IDEO MIX", value: `${1}` }, { label: "IDEO MOBI", value: `${2}` }, { label: "IDEO O2", value: `${3}` } ];
                                        
                                        //Area_of_impacts
                                        const surveyAreaOfImpactsArr = this.state.survey.name_area_of_impacts ? this.state.survey.name_area_of_impacts.includes(",") ? this.state.survey.name_area_of_impacts.split(',') : [this.state.survey.name_area_of_impacts] : [];
                                        const surveyAreaOfImpactsNameArr = surveyAreaOfImpactsArr.map(function (list: any) { return list.slice(0, list.indexOf('~')) });
                                        const surveyAreaOfImpactsIDArr =  surveyAreaOfImpactsArr.map(function (list: any) { return list.slice(list.indexOf('~')+1) });
                                        const areaOfImpactsCheckboxOptions = surveyAreaOfImpactsNameArr.map(function (areaOfImpactsName: any, i: any) {
                                            return { label: areaOfImpactsName, value: surveyAreaOfImpactsIDArr[i] };
                                        });

                                        this.setState({ 
                                            collectorCheckboxOptions : collectorCheckboxOptions,
                                            defaultCollectorCheckedList : collectorDefaultCheckedList,
                                            checkedCollectorList: collectorDefaultCheckedList,

                                            departmentCheckboxOptions : departmentCheckboxOptions,
                                            defaultDepartmentCheckedList : departmentDefaultCheckedList,
                                            checkedDepartmentList: departmentDefaultCheckedList,

                                            areaOfImpactsCheckboxOptions : areaOfImpactsCheckboxOptions,
                                            defaultAreaOfImpactsCheckedList : surveyAreaOfImpactsIDArr,
                                            checkedAreaOfImpactstList: surveyAreaOfImpactsIDArr
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
                                
                                const surveyId = this.props.match.params.id;
                                const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                                const numPage = parseInt(rp.Data.recordset[0].num_page)

                                //numQuestion for Export function
                                this.setState({ 
                                    numQuestion: numQuestion,
                                }, () => {
                                    // console.log('after set this.state.numQuestion', this.state.numQuestion);
                                    }
                                );

                                const endTime = performance.now();
                                // console.log('Its took ' + (endTime - startTime) + ' ms.');

                                //Default Daily and Monthly Range Picker
                                const current = moment();
                                const endMonth = current.format('YYYY/MM');
                                const endDate = current.format('DD/YYYY/MM');
                                // // console.log('current', current);
                                // // console.log('endMonth', endMonth);

                                const last11Months = moment().subtract( moment.duration(11, 'months') );
                                const last31days = moment().subtract( moment.duration(30, 'days') );
                                // console.log('last11Months', last11Months);
                                // console.log('last31days', last31days);
                                
                                const startMonth = moment(last11Months).format('YYYY/MM');
                                const startDate = moment(last31days).format('DD/YYYY/MM');

                                this.setState({
                                    monthsValue: [moment(startMonth, 'YYYY/MM'), moment(endMonth, 'YYYY/MM')],
                                    datesValue: [moment(startDate, 'DD/YYYY/MM'), moment(endDate, 'DD/YYYY/MM')],
                                }, () => {

                                    // this.setState({ isLoadingAnalyze: false });
                                    this.renderQuestionAnswerRow();
                    
                                    //remove ant-modal-root child to fix a modal showing when switch between pages
                                    const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
                                    // console.log('allAntModalRootElement', allAntModalRootElement);
                                    if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });
                                        
                                });
                                
                            } else {
                                this.setState({ isLoading: false });
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            }
                        }catch(error){ 
                            this.setState({ isLoading: false });
                            // toastr.error(error);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    }

                );
                
            });

        }catch(error){ 
            this.setState({ isLoading: false });
            // toastr.error(error);
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'cumulative componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    async renderQuestionAnswerRow(){

        try{
            // let nodeElement = [] as any;
            let nodeArr = new Array<any>(this.state.numQuestion);

            for(let i = 0; i < this.state.numQuestion; i++) { nodeArr[i] = ''; }

            //get each question page no
            const allPageNo = nodeArr.map((obj, i) => this.getPageNo(this.state.survey.id, i+1));//i+1 = question no. start from 1 - x (number of question)
            const allPromisePageNo = await Promise.all(allPageNo);
            // console.log('allPageNoPromise', allPromisePageNo);

            let indexListPageNo = [] as any;
            let previousPageNo = 1;
            indexListPageNo.push(0);//add first page no = 1

            //found the question on which page no
            allPromisePageNo.forEach((currentPageNo: any, index: any) => {
                // console.log(`currentPageNo ${currentPageNo} : index = ${index} : previousPageNo = ${previousPageNo}`);
                if(currentPageNo && currentPageNo !== previousPageNo){
                    // console.log('!matched');
                    indexListPageNo.push(index);
                    previousPageNo = currentPageNo;
                }
            });
            // console.log('indexListPageNo', indexListPageNo);

            const allElement = nodeArr.map((obj, i) => this.getQuestionAnswer(this.state.survey.id, i+1));//i+1 = question no. start from 1 - x (number of question)
            // console.log('allElement', allElement);

            //Skip the insert process when filter by KPI Department
            if(!this.state.filterDepartment)
            //insert page elements with question elements
            indexListPageNo.forEach((renderIndex: any, index: any) => {
                renderIndex += index;//increase renderIndex for the length of array
                let pageNo = index + 1;//convert from index to page number
                // console.log(`renderIndex = ${renderIndex} : pageNo = ${pageNo}`);
                this.insert(allElement, renderIndex, this.getPageNoElement(pageNo));
            });
            // console.log('allElement insert', allElement);
            
            const nodeElement = await Promise.all(allElement);
            // console.log('nodeElement', nodeElement);

            // this.setState({ isLoading: false });

            //render all elements
            if(nodeElement.length !== 0){
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('analyze-items-list'));
            }
            else{
                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('analyze-items-list'));
            }

            this.setState({ isLoadingAnalyze: false });
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'cumulative renderQuestionAnswerRow catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    checkCollectorType(collectorTypeId: number){
        switch (collectorTypeId) {
            case 1: return 'Web Link';
            case 2: return 'SMS';
            case 3: return 'Email';
            case 4: return 'Social Media';
            default: return 'Other';
        }
    }

    checkCompleteStatus(completeStatusId: number){
        switch (completeStatusId) {
            case 1: return 'NO';
            case 2: return 'PARTIAL';
            case 3: return 'COMPLETED';
            default: return 'Other';
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

        let strDateTime = dd.toString() + '-' + mm.toString() + '-' + yyyy.toString() + '_' + HH.toString() + '-' + MM.toString() + '-' + SS.toString() + '-' + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }

    toolChange = (e: any, arg1: any) => {
      // console.log('toggleBox', arg1);
        this.setState({ sidebarTool: arg1 }, () => 
          { /*console.log(this.state.sidebarTool)*/ }
        );
    };
      

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

    applyFilterDepartment(){

        // console.log('applyFilterDepartment');
      
        this.setState({
            isLoadingAnalyze: true,
            filterDepartment: true,
            countEmptyDepartment: 0,
        }, () => {
          this.renderQuestionAnswerRow();
        });

    }

    cancelFilterDepartment(){

        // console.log('cancelFilterDepartment');

        this.setState({
            isLoadingAnalyze: true,
            filterDepartment: false,
            checkedDepartmentList: this.state.defaultDepartmentCheckedList,
            countEmptyDepartment: 0,
        }, () => {
          this.renderQuestionAnswerRow();
        });
    }

    applyFilterAreaOfImpact(){
        this.setState({
            isLoadingAnalyze: true,
            filterAreaOfImpact: true,
            countEmptyAreaOfImpact: 0,
        }, () => {
          this.renderQuestionAnswerRow();
        });

    }

    cancelFilterAreaOfImpact(){
        this.setState({
            isLoadingAnalyze: true,
            filterAreaOfImpact: false,
            checkedAreaOfImpactstList: this.state.defaultAreaOfImpactsCheckedList,
            countEmptyAreaOfImpact: 0,
        }, () => {
          this.renderQuestionAnswerRow();
        });
    }

    onCollectorOptionsChange = (checkedCollectorList: any) => {
        // console.log('onCollectorOptionsChange', checkedCollectorList);
        this.setState({
            checkedCollectorList: checkedCollectorList,
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

    onDepartmentOptionsChange = (checkedDepartmentList: any) => {
        // console.log('onDepartmentOptionsChange', checkedDepartmentList);
        this.setState({
            checkedDepartmentList: checkedDepartmentList,
        });
    };

    onAreaOfImpactOptionsChange = (checkedAreaOfImpactsList: any) => {
        this.setState({
            checkedAreaOfImpactstList: checkedAreaOfImpactsList,
        });
    };

    //Monthly
    handleMonthlyPanelChange = (monthsValue: any, mode: any) => {
        // console.log('handleMonthlyPanelChange', monthsValue);
        this.setState({
            monthsValue,
            monthMode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
    };
    
    handleMonthlyRangeChange = (monthsValue: any) => {
        // console.log('handleMonthlyRangeChange', monthsValue);
        this.setState({ monthsValue });
    };

    handleMonthlyApply(){
        try{
            // console.log('handleMonthlyApply this.state.monthsValue[0]', this.state.monthsValue[0]);
            // console.log('handleMonthlyApply this.state.monthsValue[1]', this.state.monthsValue[1]);

            const startMonth = moment(this.state.monthsValue[0]);
            const endMonth = moment(this.state.monthsValue[1]);

            // const diffYears = startMonth.diff(endMonth, 'year');
            // endMonth.add(diffYears, 'years');

            const diffMonths = startMonth.diff(endMonth, 'months');
            // endMonth.add(diffMonths, 'months');

            // const diffDays = startMonth.diff(endMonth, 'days');
            // console.log(diffYears + ' years ' + diffMonths + ' months ' + diffDays + ' days');

            // const diffYearsAbs = Math.abs(diffYears);
            const diffMonthsAbs = Math.abs(diffMonths);
            // console.log('diffMonthsAbs', diffMonthsAbs);
            // const diffDaysAbs = Math.abs(diffDays);
            // console.log(diffYearsAbs + ' years ' + diffMonthsAbs + ' months ' + diffDaysAbs + ' days');

            if( diffMonthsAbs === 0 || diffMonthsAbs > 11 ){
                // console.log('less than 2 months or more then 12 months')
                toastr.error('Invalid month selection! You must select at least 2 months and up to 12 months to display the report.');
            }
            else{
                // console.log('Ok');

                this.setState({
                    isLoadingAnalyze: true,
                    TabDefaultActiveKey: 'monthly',
                    diffMonthsAbs: diffMonthsAbs,
                }, () => { 
                    this.renderQuestionAnswerRow(); 
                });

            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative handleMonthlyApply catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    cancelMonthlyRangePicker(){
        // console.log('cancelMonthlyRangePicker');
        this.setState({ 
            monthlyRangePicker: false
            // isLoadingAnalyze: true,
        }, () => {
            // this.renderQuestionAnswerRow();
        });
    }

    //Daily
    handleDailyPanelChange = (datesValue: any, mode: any) => {
        // console.log('handleDailyPanelChange', datesValue);
        this.setState({
            datesValue,
            dateMode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
    };
    
    handleDailyRangeChange = (datesValue: any) => {
        // console.log('handleDailyRangeChange', datesValue);
        this.setState({ datesValue });
    };

    handleDailyApply(){
        try{
            // console.log('handleDailyApply this.state.datesValue[0]', this.state.datesValue[0]);
            // console.log('handleDailyApply this.state.datesValue[1]', this.state.datesValue[1]);

            const startDate = moment(this.state.datesValue[0]);
            const endDate = moment(this.state.datesValue[1]);

            // const diffYears = startDate.diff(endDate, 'year');
            // endDate.add(diffYears, 'years');

            // const diffMonths = startDate.diff(endDate, 'months');
            // endDate.add(diffMonths, 'months');

            const diffDays = startDate.diff(endDate, 'days');
            // console.log(diffYears + ' years ' + diffMonths + ' dates ' + diffDays + ' days');

            // const diffYearsAbs = Math.abs(diffYears);
            // const diffMonthsAbs = Math.abs(diffMonths);
            const diffDaysAbs = Math.abs(diffDays);
            // console.log('handleDailyApply diffDaysAbs', diffDaysAbs);
            // console.log(diffYearsAbs + ' years ' + diffMonthsAbs + ' dates ' + diffDaysAbs + ' days');

            // if( diffDaysAbs === 0 || diffMonthsAbs > 0 || diffYearsAbs > 0 ){
            if( diffDaysAbs === 0 || diffDaysAbs > 30 ){
                // console.log('less than 2 dates or more then 31 dates')
                toastr.error('Invalid date selection! You must select at least 2 dates and up to 31 dates to display the report.');
            }
            else{
                // console.log('Ok');
                this.setState({
                    isLoadingAnalyze: true,
                    TabDefaultActiveKey: 'daily',
                    diffDaysAbs: diffDaysAbs
                }, () => { 
                    this.renderQuestionAnswerRow(); 
                });
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative handleDailyApply catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    cancelDailyRangePicker(){
        // console.log('cancelDailyRangePicker');
        this.setState({ 
            dailyRangePicker: false
            // isLoadingAnalyze: true,
        }, () => {
        //   this.renderQuestionAnswerRow();
        });
    }

    //Filter Respondent Metadata
    applyFilterRespondentMetadata(){
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
            filterCompanyName: '', 
            filterDepartmentName: '', 
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
    onFilterCompanyName = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterCompanyName: e.target.value });
    };
    onFilterDepartment = (e: React.ChangeEvent<HTMLInputElement>)=> {
        // console.log('onFilterIPAddressChange', e.target.id, e.target.value);
        this.setState({ filterDepartmentName: e.target.value });
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
                                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'cumulative'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>
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
                                                                <span className="listText">Daily Range Picker &nbsp;<Tooltip title="You must select at least 2 days and up to 31 days to display the report."><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </span>
                                                                { !this.state.dailyRangePicker ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ dailyRangePicker: true }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.dailyRangePicker ? 
                                                            <div id='filter-time-period'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div className="daily-range-picker">
                                                                            <RangePicker
                                                                                placeholder={['Start date', 'End date']}
                                                                                format={'DD MMM YYYY'}
                                                                                value={this.state.datesValue}
                                                                                mode={this.state.dateMode}
                                                                                onChange={this.handleDailyRangeChange}
                                                                                onPanelChange={this.handleDailyPanelChange}
                                                                            />
                                                                            {/* <a href="#" className="wds-button wds-button--icon-right wds-button--sm" style={{ marginLeft: '20px' }} onClick={(e) => this.handleDailyApply()}>Apply</a> */}
                                                                        </div>
                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.handleDailyApply() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelDailyRangePicker() } }>CANCEL</a>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            : null }
                                                        </li>

                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Monthly Range Picker &nbsp;<Tooltip title="You must select at least 2 months and up to 12 months to display the report."><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </span>
                                                                { !this.state.monthlyRangePicker ? 
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ monthlyRangePicker: true }) } }>APPLY</span>
                                                                : null }
                                                            </a>

                                                            { this.state.monthlyRangePicker ? 
                                                            <div id='filter-time-period'>
                                                                <section id="panel-send-date" style={{height: 'auto'}}>
                                                                    <div id="send-date-module" className="clearfix">
                                                                        <div className="daily-range-picker">
                                                                            <RangePicker
                                                                                placeholder={['Start month', 'End month']}
                                                                                format={'MMM YYYY'}
                                                                                value={this.state.monthsValue}
                                                                                mode={this.state.monthMode}
                                                                                onChange={this.handleMonthlyRangeChange}
                                                                                onPanelChange={this.handleMonthlyPanelChange}
                                                                            />
                                                                            {/* <a href="#" className="wds-button wds-button--icon-right wds-button--sm" style={{ marginLeft: '20px' }} onClick={(e) => this.handleDailyApply()}>Apply</a> */}
                                                                        </div>
                                                                        <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                            <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.handleMonthlyApply() } }>APPLY</a>
                                                                            <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelMonthlyRangePicker() } }>CANCEL</a>
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

                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                                        
                                    </div>
                                </aside>

                                <div className="live-preview-wrapper" style={{ padding: '0' }}> 
                                    <div id="livePreview" className="livePreview" style={{ maxWidth: '100%' }}>
                                        <div id="pageid-110955719" className="page v3theme      first-page      last-page">

                                            <div className="analyze-pages-content-wrapper" view-role="analyzeContentWrapperView" style={{ width: '900px' }}>
                                                <div className="analyze-pages-content" view-role="analyzeContentView">
                                                    <div className="sm-analyze-pages" view-role="pageListView">
                                                        <div className="sm-analyze-page fadeable" sm-page-id="110955719" view-role="summaryPageView">

                                                            <div id="analyze-items-list"></div>

                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div id="jump-to-top" className="smf-icon jump-to-top" view-role="analyzeJumpToTopView">Ÿ</div> */}
                                            </div>{/*analyze-pages-content-wrapper*/}

                                        </div>{/* pageid */}
                                    </div>{/* livePreview */}
                                </div>{/* live-preview-wrapper */}
                                
                            </div>{/* survey-body */}

                        </div>{/* container clearfix */}
                    </div>{/* logged-in-bd */}

                    {/* <h1 style={{ margin: '40px 0px 50px 50px'}}>SUMMARY{this.state.survey.title}</h1> */}

                </div>{/* content-wrapper */}

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visible}
                />

            </div>
        );
    }
}