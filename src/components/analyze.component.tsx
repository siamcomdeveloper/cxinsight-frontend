import React from 'react';
// import ReactDOM from 'react-dom';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import Collector from '../models/collector';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import CheckboxGroup from "antd/lib/checkbox/Group";
import MenuSurvey from '../common/menu';
import moment from 'moment';

import { Gauge, TagCloud } from 'ant-design-pro/lib/Charts';

import { Empty, Icon, Spin, DatePicker, Input} from 'antd';

import HeaderSurvey from '../common/header';
// import CollectorRow from "../common/collector/collectorRow";
// import SummaryCollectorRow from "../common/collector/summaryCollectorRow";

import SurveyResponse from '../models/surveyResponse';
import Answer from '../models/answers';
import Question from '../models/questions';

import RatingRow from "../common/analyze/ratingRow";
import TextRow from "../common/analyze/textRow";

// import '../css/wds-react.4_16_1.min.css';
// import '../css/wds-charts.4_16_1.min.css';
// import '../css/survey-summary.css';
// import '../css/side-bar.css';
// import '../css/survey-info-stats.css';
// import '../css/status-card-survey-status.css';
// import '../css/status-card-response-count.css';
// import '../css/collector-list.css';
// import '../css/createweb-global-bundle-min.ff71e50a.css';
// import '../css/createweb-step2-bundle-min.32c5304d.css';
// import '../css/createweb-common-bundle-min.37aebfc8.css';
// import '../css/createweb-step2-bundle-min.99ad07cd.css';
// import '../css/createweb-e48ff77e3f70.css';
// import '../css/create-themes-e48ff77e3f70.css';
// import '../css/surveytemplates-datepicker_lazyload-bundle-min.b2a77b7a.css';

import '../css/smlib.ui-global-bundle-min.471d0b30.css';
import '../css/anweb-summary-webpack-bundle-min.3bdc0105.css';
import '../css/anweb-analyze-bundle-min.e5376b09.css';
import '../css/anweb-summary-bundle-min.7d57dd0a.css';
import ReactDOM from 'react-dom';
import ChoiceRow from '../common/analyze/choiceRow';
import CheckboxRow from '../common/analyze/checkboxRow';
import ScoreRow from '../common/analyze/scoreRow';

// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

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
    respondents: number,
    total_responses: number,
    
    numQuestion: number,
    
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

export default class Analyze extends React.Component<IProps, IState> {

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

    getEntitySentiment(rp: any, questionAnalyzeEntity: any, questionAnalyzeSentiment: any){

        try{
            let tags = [] as any;
            let tags_positive = [] as any;
            let tags_negative = [] as any;
            // let tags_sentiment_answer = [] as any;

            rp.Data.recordset.map((data: any) => {
            // console.log('getEntitySentiment data', data);
            // console.log('getEntitySentiment answer', data.answer);
            // console.log('getEntitySentiment skip_status', data.skip_status);
            // console.log('getEntitySentiment', data.analyze_entity);
            // console.log('active[1]', data.active[1]);//active

                //is active
                if(data.skip_status === 0 && data.active[1]){

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
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'analyze getEntitySentiment catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                            const questionSubTypeId = rp.Data.recordset[0].sub_type_id;
                            const questionNo = rp.Data.recordset[0].order_no;
                            const questionLabel = rp.Data.recordset[0].question_label;
                            const questionActive = rp.Data.recordset[0].active;

                            const questionAnalyzeEntity = rp.Data.recordset[0].analyze_entity;
                            const questionAnalyzeSentiment = rp.Data.recordset[0].analyze_sentiment;

                            const questionShowLabel = rp.Data.recordset[0].show_label;
                            
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
                            element = await BaseService.getWithBody<Answer>(this.props.match.params.xSite, '/answer/', surveyId + '/' + questionId + '/' + questionTypeId, filterObj, this.state.jwtToken).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                        //   console.log(`get answer ${i}`, rp.Messages);
                                        //   console.log(`get answer ${i}`, rp.Data);
                                        //   console.log(`get answer ${i} count = `, rp.Data.recordset.length);

                                            let tags = [] as any;
                                            let tags_positive = [] as any;
                                            let tags_negative = [] as any;
                                            
                                            //Star Rating
                                            if(questionTypeId === 1){

                                                let sumSkip = 0;
                                                let sumAnswered = 0;
                                                let sum = 0;
                                                let avg = '0.0';
                                                let sumScore1 = 0;
                                                let sumScore2 = 0;
                                                let sumScore3 = 0;
                                                let sumScore4 = 0;
                                                let sumScore5 = 0;
                                                let percentScore1 = '0.00';
                                                let percentScore2 = '0.00';
                                                let percentScore3 = '0.00';
                                                let percentScore4 = '0.00';
                                                let percentScore5 = '0.00';

                                                rp.Data.recordset.map((data: any) => {
                                                //   console.log('data', data);
                                                //   console.log('answer', data.answer);
                                                //   console.log('active[1]', data.active[1]);//active
                                                //   console.log('comment', data.comment);
                                                //   console.log('skip_status', data.skip_status);
                                                    //is active
                                                    if(data.active[1]){
                                                        if(data.skip_status === 0){
                                                            if(data.answer === 1){ sumScore1++; sum+=parseInt(data.answer) }
                                                            else if(data.answer === 2){ sumScore2++; sum+=parseInt(data.answer) }
                                                            else if(data.answer === 3){ sumScore3++; sum+=parseInt(data.answer) }
                                                            else if(data.answer === 4){ sumScore4++; sum+=parseInt(data.answer) }
                                                            else if(data.answer === 5){ sumScore5++; sum+=parseInt(data.answer) }
                                                            sumAnswered++;

                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                        else{
                                                            sumSkip++;
                                                        }
                                                    }

                                                });

                                                //cal
                                                const calAvg = (sum / sumAnswered);
                                                avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();

                                                const cal1 = (sumScore1 / sumAnswered) * 100;
                                                const cal2 = (sumScore2 / sumAnswered) * 100;
                                                const cal3 = (sumScore3 / sumAnswered) * 100;
                                                const cal4 = (sumScore4 / sumAnswered) * 100;
                                                const cal5 = (sumScore5 / sumAnswered) * 100;

                                                percentScore1 = isNaN(cal1) ? pf.format(0) : pf.format((sumScore1 / sumAnswered) * 100).toString()+'%';
                                                percentScore2 = isNaN(cal2) ? pf.format(0) : pf.format((sumScore2 / sumAnswered) * 100).toString()+'%';
                                                percentScore3 = isNaN(cal3) ? pf.format(0) : pf.format((sumScore3 / sumAnswered) * 100).toString()+'%';
                                                percentScore4 = isNaN(cal4) ? pf.format(0) : pf.format((sumScore4 / sumAnswered) * 100).toString()+'%';
                                                percentScore5 = isNaN(cal5) ? pf.format(0) : pf.format((sumScore5 / sumAnswered) * 100).toString()+'%';

                                                //getEntitySentiment
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
                                                    choices: choices,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment,
                                                    showLabel: questionShowLabel,
                                                    sub_type_id: questionSubTypeId
                                                }

                                                const answerObj = {
                                                    recordset: rp.Data.recordset,
                                                    avg: avg,
                                                    sumAnswered: sumAnswered,
                                                    sumSkip: sumSkip,
                                                    percentScore1: percentScore1,
                                                    sumScore1: sumScore1,
                                                    percentScore2: percentScore2,
                                                    sumScore2: sumScore2,
                                                    percentScore3: percentScore3,
                                                    sumScore3: sumScore3,
                                                    percentScore4: percentScore4,
                                                    sumScore4: sumScore4,
                                                    percentScore5: percentScore5,
                                                    sumScore5: sumScore5,
                                                    tags: tags,
                                                    tags_positive: tags_positive,
                                                    tags_negative: tags_negative,
                                                    comment: comment,
                                                } 

                                              // console.log('ratting comment', comment);

                                                // nodeElement.push(<RatingRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>);
                                                return <RatingRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*//>;
                                            }
                                            else if(questionTypeId === 2 || questionTypeId === 6){

                                                let sumSkip = 0;
                                                let sumAnswered = 0;
                                                let sum = 0;
                                                let avg = '0.0';
                                                let sumScore = new Array<number>(choices.length);
                                                let percentScore = new Array<string>(choices.length);

                                                for(let i = 0; i < choices.length; i++) 
                                                {  
                                                    sumScore[i] = 0;
                                                    percentScore[i] = '0.00';
                                                  // console.log(`sumScore[${i}] = `, sumScore[i] );
                                                  // console.log(`percentScore[${i}] = `, percentScore[i] );
                                                } 
                                                
                                                rp.Data.recordset.map((data: any) => {
                                                //   console.log('data', data);
                                                //   console.log('answer', data.answer);
                                                //   console.log('skip_status', data.skip_status);
                                                //   console.log('active[1]', data.active[1]);//active
                                                    //is active
                                                    if(data.active[1]){
                                                        if(data.skip_status === 0){
                                                            //for equal of choice number
                                                            for (let i = 0; i < choices.length; i++) {
                                                                // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                                if(data.answer === parseInt(weights[i])){ 
                                                                    sumScore[i]++;
                                                                    sum+=parseInt(data.answer);
                                                                }   
                                                            }
                                                            sumAnswered++;

                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                        else{
                                                            sumSkip++;
                                                        }
                                                    }

                                                });

                                                //cal
                                                const calAvg = (sum / sumAnswered);
                                                avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();

                                                for (let i = choices.length-1 ; i >= 0; i--) {

                                                    const cal = (sumScore[i] / sumAnswered) * 100;

                                                    percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((sumScore[i] / sumAnswered) * 100).toString();

                                                    // chartData.push( { answer: choices[i], percent: parseFloat(percentScore[i]), name: "Ratio" } );
                                                    chartData.push( { answer: choices[i], percent: parseFloat(percentScore[i]), name: "Ratio", totalN: sumAnswered, N: sumScore[i] } );

                                                    percentScore[i] += '%';
                                                }

                                                //getEntitySentiment
                                                const tagsArr = this.getEntitySentiment(rp, questionAnalyzeEntity, questionAnalyzeSentiment);

                                                tags = tagsArr.tags;
                                                tags_positive = tagsArr.tags_positive;
                                                tags_negative = tagsArr.tags_negative;

                                              // console.log(`after ${i} getEntitySentiment tags`, tags);
                                              // console.log(`after ${i} getEntitySentiment tags_positive`, tags_positive);
                                              // console.log(`after ${i} getEntitySentiment tags_negative`, tags_negative);

                                              // console.log(`sumSkip ${i}`, sumSkip);
                                              // console.log(`sumAnswered ${i}`, sumAnswered);
                                              // console.log(`avg ${i}`, avg);
                                              // console.log(`sumScore ${i}`, sumScore);
                                              // console.log(`percentScore ${i}`, percentScore);
                                              // console.log(`chartData ${i}`, chartData);

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    choices: choices,
                                                    weights: weights,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                } 

                                                const answerObj = {
                                                    recordset: rp.Data.recordset,
                                                    avg: avg,
                                                    sumAnswered: sumAnswered,
                                                    sumSkip: sumSkip,
                                                    percentScore: percentScore,
                                                    sumScore: sumScore,
                                                    chartData: chartData,
                                                    tags: tags,
                                                    tags_positive: tags_positive,
                                                    tags_negative: tags_negative,
                                                    comment: comment,
                                                } 

                                              // console.log('multiple choice comment', comment);

                                                // nodeElement.push(<ChoiceRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>);
                                                return <ChoiceRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*//>;
                                            }
                                            else if(questionTypeId === 3){

                                                let sumSkip = 0;
                                                let sumAnswered = 0;
                                                let sumScore = new Array<number>(choices.length);
                                                let percentScore = new Array<string>(choices.length);
                                                let countTotal = 0;

                                                for(let i = 0; i < choices.length; i++) 
                                                {  
                                                    sumScore[i] = 0;
                                                    percentScore[i] = '0.00';
                                                  // console.log(`sumScore[${i}] = `, sumScore[i] );
                                                  // console.log(`percentScore[${i}] = `, percentScore[i] );
                                                } 
                                                
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);
                                                  // console.log('active[1]', data.active[1]);//active
                                                    //is active
                                                    if(data.active[1]){
                                                        if(data.skip_status === 0){

                                                        // console.log('data.answer', data.answer);
                                                            let answers = [] as any;
                                                            if(data.answer){
                                                                answers = data.answer.includes(',') ? data.answer.split(',') : [data.answer];
                                                            }
                                                        // console.log(`get answers from data.answer = `, answers);

                                                            //for equal of choice number
                                                            for (let i = 0; i < choices.length; i++) {
                                                                for(let ansIndex = 0; ansIndex < answers.length; ansIndex++) {
                                                                // console.log(`parseInt(answers[ansIndex] = ${parseInt(answers[ansIndex])} === parseInt(weights[${i}]) = `, weights[i]);
                                                                    if(parseInt(answers[ansIndex]) === parseInt(weights[i])){ 

                                                                        sumScore[i]++;
                                                                    // console.log(`in if parseInt(answers[ansIndex]) === parseInt(weights[i])`,sumScore[i]);
                                                                        countTotal++;
                                                                    }  
                                                                }
                                                                
                                                            }

                                                            sumAnswered++;

                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                        else{
                                                            sumSkip++;
                                                        }
                                                    }

                                                });

                                                //cal
                                                for (let i = choices.length-1 ; i >= 0; i--) {
                                                    const cal = (sumScore[i] / countTotal) * 100;

                                                    percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((sumScore[i] / countTotal) * 100);
                                                    // chartData.push( { answer: choices[i], count: sumScore[i], total: countTotal, name: "Ratio" } );
                                                    // chartData.push( { answer: choices[i], percent: parseFloat(percentScore[i]), name: "Ratio" } );
                                                    chartData.push( { answer: choices[i], percent: parseFloat(percentScore[i]), name: "Ratio", totalN: countTotal, N: sumScore[i] } );

                                                    percentScore[i] += '%';
                                                    // console.log(`cal for ${i}`,sumScore[i]);
                                                    // console.log(`cal for ${i}`,sumAnswered);
                                                    // console.log(`cal for ${i}`,percentScore[i]);
                                                    // console.log(`cal for ${i}`,chartData);
                                                    // console.log(`cal for ${i}`,countTotal);
                                                }
                                                
                                              // console.log(`chartData`, chartData);

                                                //getEntitySentiment
                                                const tagsArr = this.getEntitySentiment(rp, questionAnalyzeEntity, questionAnalyzeSentiment);
                                                
                                                tags = tagsArr.tags;
                                                tags_positive = tagsArr.tags_positive;
                                                tags_negative = tagsArr.tags_negative;
                                                
                                              // console.log(`after ${i} getEntitySentiment tags`, tags);
                                              // console.log(`after ${i} getEntitySentiment tags_positive`, tags_positive);
                                              // console.log(`after ${i} getEntitySentiment tags_negative`, tags_negative);
                                                
                                              // console.log(`sumSkip ${i}`, sumSkip);
                                              // console.log(`sumAnswered ${i}`, sumAnswered);
                                              // console.log(`sumScore ${i}`, sumScore);
                                              // console.log(`percentScore ${i}`, percentScore);
                                              // console.log(`chartData ${i}`, chartData);
                                              // console.log(`countTotal ${i}`,countTotal);

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    choices: choices,
                                                    weights: weights,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment
                                                } 

                                                const answerObj = {
                                                    recordset: rp.Data.recordset,
                                                    sumAnswered: sumAnswered,
                                                    sumSkip: sumSkip,
                                                    percentScore: percentScore,
                                                    sumScore: sumScore,
                                                    countTotal: countTotal,
                                                    chartData: chartData,
                                                    tags: tags,
                                                    tags_positive: tags_positive,
                                                    tags_negative: tags_negative,
                                                    comment: comment,
                                                } 

                                              // console.log('multiple choice comment', comment);

                                                // nodeElement.push(<ChoiceRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>);
                                                // return <CheckRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>
                                                return <CheckboxRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*//>;
                                            }
                                            else if(questionTypeId === 4){

                                                let sumSkip = 0;
                                                let sumAnswered = 0;
                                                let sum = 0;
                                                let avg = '0.0';
                                                let sumScore1 = 0;
                                                let sumScore2 = 0;
                                                let sumScore3 = 0;
                                                let percentScore1 = '0.00';
                                                let percentScore2 = '0.00';
                                                let percentScore3 = '0.00';
                                                
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                  // console.log('answer', data.answer);
                                                  // console.log('skip_status', data.skip_status);
                                                  // console.log('active[1]', data.active[1]);//active
                                                    //is active
                                                    if(data.active[1]){
                                                        if(data.skip_status === 0){
                                                            if(data.answer <= 6){ sumScore1++; sum+=parseInt(data.answer) }
                                                            else if(data.answer <= 8){ sumScore2++; sum+=parseInt(data.answer) }
                                                            else if(data.answer >= 9){ sumScore3++; sum+=parseInt(data.answer) }
                                                            sumAnswered++;

                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                        else{
                                                            sumSkip++;
                                                        }
                                                    }

                                                });

                                                //cal
                                                const calAvg = (sum / sumAnswered);
                                                avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();
                                                avg = calAvg === 10 ? '10' : avg;

                                                const cal1 = (sumScore1 / sumAnswered) * 100;
                                                const cal2 = (sumScore1 / sumAnswered) * 100;
                                                const cal3 = (sumScore1 / sumAnswered) * 100;

                                                percentScore1 = isNaN(cal1) ? pf.format(0) : pf.format((sumScore1 / sumAnswered) * 100).toString();
                                                percentScore2 = isNaN(cal2) ? pf.format(0) : pf.format((sumScore1 / sumAnswered) * 100).toString();
                                                percentScore3 = isNaN(cal3) ? pf.format(0) : pf.format((sumScore1 / sumAnswered) * 100).toString();

                                                const titleNPS = `
                                                <div className="big-stat__label" style="font-size: 55px; color: black; font-weight: 300; top: -50px; left: 113px; position: absolute;">${avg}</div>
                                                <div className="big-stat__label" style="font-size: 25px; color: black; font-weight: 100; top: 20px; position: absolute;">Average Net Promoter Score</div>
                                                <div className="big-stat__label" style="font-size: 18px;color: black;font-weight: 300;top: -23px;left: 65px;position: absolute;">0</div>
                                                <div className="big-stat__label" style="font-size: 18px;color: black;font-weight: 300;top: -23px;right: 60px;position: absolute;">10</div>
                                                `;

                                                //getEntitySentiment
                                                const tagsArr = this.getEntitySentiment(rp, questionAnalyzeEntity, questionAnalyzeSentiment);

                                                tags = tagsArr.tags;
                                                tags_positive = tagsArr.tags_positive;
                                                tags_negative = tagsArr.tags_negative;

                                              // console.log(`after ${i} getEntitySentiment tags`, tags);
                                              // console.log(`after ${i} getEntitySentiment tags_positive`, tags_positive);
                                              // console.log(`after ${i} getEntitySentiment tags_negative`, tags_negative);

                                              // console.log(`sumSkip ${i}`, sumSkip);
                                              // console.log(`sumAnswered ${i}`, sumAnswered);
                                              // console.log(`avg ${i}`, avg);
                                              // console.log(`sumScore1 ${i}`, sumScore1);
                                              // console.log(`sumScore2 ${i}`, sumScore2);
                                              // console.log(`sumScore3 ${i}`, sumScore3);
                                              // console.log(`percentScore1 ${i}`, percentScore1);
                                              // console.log(`percentScore2 ${i}`, percentScore2);
                                              // console.log(`percentScore3 ${i}`, percentScore3);

                                                const questionObj = {
                                                    no: questionNo,
                                                    label: questionLabel,
                                                    analyze_entity: questionAnalyzeEntity,
                                                    analyze_sentiment: questionAnalyzeSentiment,
                                                    sub_type_id: questionSubTypeId
                                                }

                                                const answerObj = {
                                                    recordset: rp.Data.recordset,
                                                    avg: avg,
                                                    sumAnswered: sumAnswered,
                                                    sumSkip: sumSkip,
                                                    percentScore1: percentScore1,
                                                    sumScore1: sumScore1,
                                                    percentScore2: percentScore2,
                                                    sumScore2: sumScore2,
                                                    percentScore3: percentScore3,
                                                    sumScore3: sumScore3,
                                                    titleNPS: titleNPS,
                                                    tags: tags,
                                                    tags_positive: tags_positive,
                                                    tags_negative: tags_negative,
                                                    comment: comment,
                                                }

                                              // console.log('score answerObj', answerObj);
                                                // nodeElement.push(<ScoreRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>);
                                                return <ScoreRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*//>;
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

                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('text data', data);
                                                  // console.log('text answer', data.answer);
                                                  // console.log('text skip_status', data.skip_status);

                                                  // console.log('active[1]', data.active[1]);//active
                                                    //is active
                                                    if(data.active[1]){
                                                        if(data.skip_status === 0){
                                                            sumAnswered++;
                                                            comment.push('('+data.created_date+') ' + data.answer);
                                                            //function getEntitySentiment
                                                        }
                                                        else{
                                                            sumSkip++;
                                                        }
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
                                                // console.log('text tags_sentiment_answer', tags_sentiment_answer);
                                                // console.log('text tags_positive_answer', tags_positive_answer);
                                                // console.log('text tags_negative_answer', tags_negative_answer);
                                                // nodeElement.push(<TextRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>);
                                                return <TextRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} /*exportHandler={this.exportHandler.bind(this)}*//>;
                                            }
                                            return false;

                                        } else {
                                            this.setState({ isLoading: false });
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getQuestionAnswer BaseService.getWithBody<Answer> /answer/${surveyId}/${questionId}/${questionTypeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            return false;
                                        }
                                    }catch(error){ 
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getQuestionAnswer BaseService.getWithBody<Answer> /answer/${surveyId}/${questionId}/${questionTypeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                } catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    insert( arr: any, index: any, item: any ) {
        arr.splice( index, 0, item );
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
                                    console.log('surveyProjectNameArr', surveyProjectNameArr);
                                    const surveyProjectIdArr = this.state.survey.survey_project_id ? this.state.survey.survey_project_id.includes(",") ? this.state.survey.survey_project_id.split(',') : [this.state.survey.survey_project_id] : [];
                                    console.log('surveyProjectIdArr', surveyProjectIdArr);
                                    const collectorProjectIdArr = this.state.survey.collector_project_id ? this.state.survey.collector_project_id.includes(",") ? this.state.survey.collector_project_id.split(',') : [this.state.survey.collector_project_id] : [];
                                    console.log('collectorProjectIdArr', collectorProjectIdArr);

                                    let projectCheckboxOptions = [] as any;
                                    surveyProjectIdArr.forEach((projectId: any, i: any) => {
                                        console.log(`projectId ${i}`, projectId);
                                        collectorProjectIdArr.forEach((collectorProjectId: any, j: any) => {
                                            console.log(`collectorProjectId ${j}`, collectorProjectId);
                                            if(projectId === collectorProjectId && projectCheckboxOptions.filter((projectOption: any) => projectOption.label === surveyProjectNameArr[i]).length === 0){
                                                console.log(`in if projectId === collectorProjectId`);
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

                            // console.log('num_question', numQuestion);
                            // console.log('num_page', numPage);

                            //     // let nodeElement = [] as any;
                            //     let nodeArr = new Array<any>(numQuestion);

                            //     for(let i = 0; i < numQuestion; i++) { nodeArr[i] = ''; }

                            //     const allPageNo = nodeArr.map((obj, i) => this.getPageNo(surveyId, i+1));//i+1 = question no. start from 1 - x (number of question)
                            //     const allPromisePageNo = await Promise.all(allPageNo);
                            // // console.log('allPageNoPromise', allPromisePageNo);

                            //     let indexListPageNo = [] as any;

                            //     let previousPageNo = 1;
                            //     indexListPageNo.push(0);//add first page no = 1

                            //     allPromisePageNo.forEach((currentPageNo: any, index: any) => {
                            //         // console.log(`currentPageNo ${currentPageNo} : index = ${index}`);
                            //         // console.log('previousPageNo', previousPageNo);
                            //         if(currentPageNo && currentPageNo !== previousPageNo){
                            //             // console.log('!matched');
                            //             indexListPageNo.push(index);
                            //             previousPageNo = currentPageNo;
                            //         }
                            //     });

                            // // console.log('indexListPageNo', indexListPageNo);

                            //     const allElement = nodeArr.map((obj, i) => this.getQuestionAnswer(surveyId, i+1));//i+1 = question no. start from 1 - x (number of question)
                            // // console.log('allElement', allElement);

                            //     //insert Page elements
                            //     indexListPageNo.forEach((renderIndex: any, index: any) => {
                            //         renderIndex += index;//increase renderIndex for the length of array
                            //         let pageNo = index + 1;//convert from index to page number
                            //     // console.log(`renderIndex = ${renderIndex} : pageNo = ${pageNo}`);
                            //         this.insert(allElement, renderIndex, this.getPageNoElement(pageNo));
                            //     });
                            // // console.log('allElement insert', allElement);
                                
                            //     const nodeElement = await Promise.all(allElement);
                            // // console.log('nodeElement', nodeElement);

                            //     // this.setState({ isLoading: false });

                            //     //render all elements
                            //     if(nodeElement.length !== 0){
                            //         ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('analyze-items-list'));
                            //     }
                            //     else{
                            //         ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('analyze-items-list'));
                            //     }

                                const endTime = performance.now();
                                // console.log('Its took ' + (endTime - startTime) + ' ms.');

                                // this.setState({ isLoadingAnalyze: false });
                                this.renderQuestionAnswerRow();
                
                                //remove ant-modal-root child to fix a modal showing when switch between pages
                                const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
                                // console.log('allAntModalRootElement', allAntModalRootElement);
                                if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });
                                
                            } else {
                                this.setState({ isLoading: false });
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            }
                        }catch(error){ 
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        }
                    }

                );
                
            });

        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    async renderQuestionAnswerRow(){

        try{
            // let nodeElement = [] as any;
            let nodeArr = new Array<any>(this.state.numQuestion);

            for(let i = 0; i < this.state.numQuestion; i++) { nodeArr[i] = ''; }

            const allPageNo = nodeArr.map((obj, i) => this.getPageNo(this.state.survey.id, i+1));//i+1 = question no. start from 1 - x (number of question)
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

            const allElement = nodeArr.map((obj, i) => this.getQuestionAnswer(this.state.survey.id, i+1));//i+1 = question no. start from 1 - x (number of question)
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

            // this.setState({ isLoading: false });

            //render all elements
            if(nodeElement.length !== 0){
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('analyze-items-list'));
            }
            else{
                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('analyze-items-list'));
            }

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
                                    respondents: rp.Data.recordset[0].total_respondents, 
                                    total_responses: rp.Data.recordset.length 
                                });
                            }
                            else{
                                this.setState({ 
                                    respondents: 0,
                                    total_responses: 0
                                });
                            }
                            
                            this.setState({ isLoadingAnalyze: false });

                        } else {
                            this.setState({ isLoadingAnalyze: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze renderQuestionAnswerRow BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze renderQuestionAnswerRow BaseService.getWithBody<SurveyResponse> /response/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze renderQuestionAnswerRow catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    /*
    exportToCSV = (csvData: any, fileName: any) => {
        try{
            // exportToCSV = () => {
            // console.log('exportToCSV exportData', this.state.exportData);
            
            // const csvData = this.state.exportData;
            // const fileName = 'export-' + this.getDateTime();

            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';

            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportToCSV catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }*/
    
    /*
    exportHandler(questionNo?: any){
      // console.log(`exportHandler questionNo`, questionNo);

        //clear export data array
        this.setState({ 
            exportData: [],
            isLoadingAnalyze: true
        }, async () => {
                // console.log('exportHandler exportData', this.state.exportData);
                try{
                    const startTime = performance.now();

                    const surveyId = this.props.match.params.id;
                    const numQuestion = questionNo ? 1 : this.state.numQuestion;

                    let nodeArr = new Array<any>(numQuestion);
                    for(let i = 0; i < nodeArr.length; i++) { nodeArr[i] = ''; }

                    // const jwt = getJwtToken();
                    const allExportArr = nodeArr.map((obj, i) => this.exportQuestionAnswer(surveyId, questionNo ? questionNo : i+1));

                    const allExportPromise = await Promise.all(allExportArr);
                    // console.log('allExportPromise', allExportPromise);
                    // console.log('exportAll this.state.exportData', this.state.exportData);

                    const exportDataAnswered = this.state.exportData.filter(function (item: any) { return item.answered === 'Yes'; });
                    // console.log('exportAll exportDataAnswered', exportDataAnswered);

                    const fileName = questionNo ? 'export-' + this.getDateTime() : 'export-all-' + this.getDateTime();
                    this.exportToCSV(this.state.exportData, fileName);

                    this.setState({ isLoadingAnalyze: false });

                    const endTime = performance.now();
                    // console.log('Its took ' + (endTime - startTime) + ' ms.');
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportHandler catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
                
            }
        );

    }*/

    // async exportAll(){
    //   // console.log('exportAll');
    //     this.setState({ isLoadingAnalyze: true });
    //     const startTime = performance.now();

    //     const surveyId = this.props.match.params.id;
    //     let nodeArr = new Array<any>(this.state.numQuestion);

    //     for(let i = 0; i < nodeArr.length; i++) { nodeArr[i] = ''; }

    //     const allExportArr = nodeArr.map((obj, i) => this.exportQuestionAnswer(surveyId, i+1));
    //     const allExportPromise = await Promise.all(allExportArr);
    //   // console.log('allExportPromise', allExportPromise);
    //   // console.log('exportAll this.state.exportData', this.state.exportData);

    //     const exportDataAnswered = this.state.exportData.filter(function (item: any) { return item.answered === 'Yes'; });
    //   // console.log('exportAll exportDataAnswered', exportDataAnswered);

    //     this.exportToCSV(this.state.exportData, 'export-all-' + this.getDateTime());

    //     this.setState({ isLoadingAnalyze: false });

    //     const endTime = performance.now();
    //   // console.log('Its took ' + (endTime - startTime) + ' ms.');
    // }

    exportQuestionAnswer = async (surveyId: any, i: any) => {
      // console.log ("exportQuestionAnswer question no." + i);

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, this.state.jwtToken).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`exportQuestionAnswer question ${i}`, rp.Messages);
                      // console.log(`exportQuestionAnswer question ${i}`, rp.Data);
                      // console.log(`exportQuestionAnswer question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length){

                            const questionId = rp.Data.recordset[0].id[0];
                            const questionTypeId = rp.Data.recordset[0].type_id;
                            const questionNo = rp.Data.recordset[0].order_no;
                            const questionLabel = rp.Data.recordset[0].question_label;

                          // console.log(`exportQuestionAnswer question ${i} id = `, questionId);
                          // console.log(`exportQuestionAnswer question ${i} type id = `, questionTypeId);
                          // console.log(`exportQuestionAnswer question ${i} no = `, questionNo);
                          // console.log(`exportQuestionAnswer question ${i} label = `, questionLabel);

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

                            //Star Rating & Multiple choicevariables
                            let choices = [] as any;
                            let weights = [] as any;

                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6){
                                
                                const questionChoice = rp.Data.recordset[0].choice.split(',');
                              // console.log(`exportQuestionAnswer question ${i} choice = `, questionChoice);

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

                              // console.log(`exportQuestionAnswer question ${i} choices = `, choices);
                              // console.log(`exportQuestionAnswer question ${i} weights = `, weights);
                            }
                                        
                          // console.log(`exportQuestionAnswer answer ${i} element`);

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

                            //get a answer just 1 time and wait for each type of the answer process
                            element = await BaseService.getWithBody<Answer>(this.props.match.params.xSite, '/answer/export/', surveyId + '/' + questionId + '/' + questionTypeId, filterObj, this.state.jwtToken).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                          // console.log(`exportQuestionAnswer answer rp ${i}`, rp);
                                          // console.log(`exportQuestionAnswer answer Messages ${i}`, rp.Messages);
                                          // console.log(`exportQuestionAnswer answer Data ${i}`, rp.Data);
                                            // console.log(`exportQuestionAnswer answer ${i} count = `, rp.Data.recordset.length);

                                            //Star Rating
                                            if(questionTypeId === 1){

                                                if(rp.Data)
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                    // console.log('answer', data.answer);
                                                    // console.log('skip_status', data.skip_status);

                                                    const skip = data.skip_status;
                                                    const answer = data.answer;
                                                    const comment = data.comment;
                                                    let choice = '';

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                            // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                            if(parseInt(data.answer) === parseInt(weights[i])){ 
                                                                choice = choices[i];
                                                                // console.log('answer choice', choice);
                                                                // return;
                                                            }   
                                                        }
                                                    }
                                                    
                                                    let exportDataArr = this.state.exportData;
                                                    exportDataArr.push({
                                                        complete_status: this.checkCompleteStatus(data.complete_status),
                                                        collector_name: data.collector_name,
                                                        collector_type: this.checkCollectorType(data.collector_type),
                                                        time_spent: moment.utc(moment.duration(data.time_spent, "seconds").asMilliseconds()).format("HH:mm:ss"),
                                                        started: data.started,
                                                        last_modified: data.last_modified ? data.last_modified : data.started,
                                                        ip: data.ip_address,
                                                        email: data.email_address,
                                                        mobile: data.mobile_number,
                                                        name_title: data.name_title,
                                                        first_name: data.first_name,
                                                        last_name: data.last_name,
                                                        birthdate: data.birthdate,
                                                        line_id: data.line_id,
                                                        id_card_4_digit: data.id_card_4_digit,
                                                        room_number: data.room_number,
                                                        institution_name: data.institution_name,
                                                        project_name: data.project_name,
                                                        customer_id: data.customer_id,
                                                        custom_group: data.custom_group,
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

                                                });
                                                    
                                                return true;
                                            }
                                            else if(questionTypeId === 2 || questionTypeId === 6){
                                                
                                                if(rp.Data)
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                    // console.log('answer', data.answer);
                                                    // console.log('skip_status', data.skip_status);

                                                    const skip = data.skip_status;
                                                    const answer = data.answer;
                                                    const comment = data.comment;
                                                    let choice = '';

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                            // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                            if(parseInt(data.answer) === parseInt(weights[i])){ 
                                                                choice = choices[i];
                                                                // console.log('answer choice', choice);
                                                                // return;
                                                            }   
                                                        }
                                                    }

                                                    let exportDataArr = this.state.exportData;
                                                    exportDataArr.push({
                                                        complete_status: this.checkCompleteStatus(data.complete_status),
                                                        collector_name: data.collector_name,
                                                        collector_type: this.checkCollectorType(data.collector_type),
                                                        time_spent: moment.utc(moment.duration(data.time_spent, "seconds").asMilliseconds()).format("HH:mm:ss"),
                                                        started: data.started,
                                                        last_modified: data.last_modified ? data.last_modified : data.started,
                                                        ip: data.ip_address,
                                                        email: data.email_address,
                                                        mobile: data.mobile_number,
                                                        name_title: data.name_title,
                                                        first_name: data.first_name,
                                                        last_name: data.last_name,
                                                        birthdate: data.birthdate,
                                                        line_id: data.line_id,
                                                        id_card_4_digit: data.id_card_4_digit,
                                                        room_number: data.room_number,
                                                        institution_name: data.institution_name,
                                                        project_name: data.project_name,
                                                        customer_id: data.customer_id,
                                                        custom_group: data.custom_group,
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
                                                    
                                                });
                                                
                                                return true;
                                            }
                                            else if(questionTypeId === 3){

                                                if(rp.Data)
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                    // console.log('answer', data.answer);
                                                    // console.log('skip_status', data.skip_status);
                                                    // console.log('checkbox choices', choices);

                                                    const skip = data.skip_status;
                                                    const answer = data.answer ? data.answer.split(',').filter(function (item: any) { return item !== null && item !== ''; }).join(', ') : '';
                                                    const comment = data.comment;
                                                    let choice = '';

                                                    if(data.skip_status === 0){
                                                        //for equal of choice number
                                                        for (let i = 0; i < choices.length; i++) {
                                                            for (let j = 0; j < data.answer.length; j++) {
                                                                // console.log(`data.answer[${j}] = ${data.answer[j]} === weights[${i}] = `, weights[i]);
                                                                if(parseInt(data.answer[j]) === parseInt(weights[i])){ 
                                                                    choice += choices[i] + ', ';
                                                                }
                                                            }
                                                        }
                                                        // console.log('checkbox choices answer', choice);
                                                    }
                                                    
                                                    let exportDataArr = this.state.exportData;
                                                    exportDataArr.push({
                                                        complete_status: this.checkCompleteStatus(data.complete_status),
                                                        collector_name: data.collector_name,
                                                        collector_type: this.checkCollectorType(data.collector_type),
                                                        time_spent: moment.utc(moment.duration(data.time_spent, "seconds").asMilliseconds()).format("HH:mm:ss"),
                                                        started: data.started,
                                                        last_modified: data.last_modified ? data.last_modified : data.started,
                                                        ip: data.ip_address,
                                                        email: data.email_address,
                                                        mobile: data.mobile_number,
                                                        name_title: data.name_title,
                                                        first_name: data.first_name,
                                                        last_name: data.last_name,
                                                        birthdate: data.birthdate,
                                                        line_id: data.line_id,
                                                        id_card_4_digit: data.id_card_4_digit,
                                                        room_number: data.room_number,
                                                        institution_name: data.institution_name,
                                                        project_name: data.project_name,
                                                        customer_id: data.customer_id,
                                                        custom_group: data.custom_group,
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

                                                });

                                                return true;
                                            }
                                            else if(questionTypeId === 4){

                                                if(rp.Data)
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                    // console.log('answer', data.answer);
                                                    // console.log('skip_status', data.skip_status);

                                                    const skip = data.skip_status;
                                                    const answer = data.answer;
                                                    const comment = data.comment;
                                                    let choice = '';

                                                    let exportDataArr = this.state.exportData;
                                                    exportDataArr.push({
                                                        complete_status: this.checkCompleteStatus(data.complete_status),
                                                        collector_name: data.collector_name,
                                                        collector_type: this.checkCollectorType(data.collector_type),
                                                        time_spent: moment.utc(moment.duration(data.time_spent, "seconds").asMilliseconds()).format("HH:mm:ss"),
                                                        started: data.started,
                                                        last_modified: data.last_modified ? data.last_modified : data.started,
                                                        ip: data.ip_address,
                                                        email: data.email_address,
                                                        mobile: data.mobile_number,
                                                        name_title: data.name_title,
                                                        first_name: data.first_name,
                                                        last_name: data.last_name,
                                                        birthdate: data.birthdate,
                                                        line_id: data.line_id,
                                                        id_card_4_digit: data.id_card_4_digit,
                                                        room_number: data.room_number,
                                                        institution_name: data.institution_name,
                                                        project_name: data.project_name,
                                                        customer_id: data.customer_id,
                                                        custom_group: data.custom_group,
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
                                                });
                                                
                                                return true;
                                            }
                                            else if(questionTypeId === 5){

                                                if(rp.Data)
                                                rp.Data.recordset.map((data: any) => {
                                                  // console.log('data', data);
                                                    // console.log('answer', data.answer);
                                                    // console.log('skip_status', data.skip_status);

                                                    const skip = data.skip_status;
                                                    const answer = data.answer;

                                                    let exportDataArr = this.state.exportData;
                                                    exportDataArr.push({
                                                        complete_status: this.checkCompleteStatus(data.complete_status),
                                                        collector_name: data.collector_name,
                                                        collector_type: this.checkCollectorType(data.collector_type),
                                                        time_spent: moment.utc(moment.duration(data.time_spent, "seconds").asMilliseconds()).format("HH:mm:ss"),
                                                        started: data.started,
                                                        last_modified: data.last_modified ? data.last_modified : data.started,
                                                        ip: data.ip_address,
                                                        email: data.email_address,
                                                        mobile: data.mobile_number,
                                                        name_title: data.name_title,
                                                        first_name: data.first_name,
                                                        last_name: data.last_name,
                                                        birthdate: data.birthdate,
                                                        line_id: data.line_id,
                                                        id_card_4_digit: data.id_card_4_digit,
                                                        room_number: data.room_number,
                                                        institution_name: data.institution_name,
                                                        project_name: data.project_name,
                                                        customer_id: data.customer_id,
                                                        custom_group: data.custom_group,
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
                                                });

                                                return true
                                            }
                                            
                                            return false;

                                        } else {
                                            this.setState({ isLoading: false });
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportQuestionAnswer BaseService.getWithBody<Answer> '/answer/export/${surveyId}/${questionId}/${questionTypeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            return false;
                                        }
                                    }catch(error){ 
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportQuestionAnswer BaseService.getWithBody<Answer> '/answer/export/${surveyId}/${questionId}/${questionTypeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                        this.setState({ isLoadingAnalyze: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `analyze exportQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

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
                                                        
                                                        {/* <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Question and Answer</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>APPLY</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Collector</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>APPLY</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Filter by Completeness</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>APPLY</span>
                                                            </a>
                                                        </li> */}

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
                                                                <span className="listText">Compare by Question and Answer</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>COMPARE</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                                <span className="listText">Compare by Collector</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>COMPARE</span>
                                                            </a>
                                                        </li>
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

                                        {/* <div id="accBuilder" className={ this.state.sidebarTool === "show" ? "key open" : "key hidden" } style={{ display: 'block', maxHeight: '100%' }}>
                                            <header>
                                                <h3 className="accordionLabel">
                                                    <a href="# " onClick={ (e) => { e.preventDefault() } } className="press keyOpener" target="#accPanelBuilder" data-action="surveyBuilder">SHOW</a>
                                                </h3>
                                                
                                            </header>
                                            <section className="acContent" id="accPanelBuilder">
                                                <div id="builderQuestionContainer" className="setting" style={{ height: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                                                    <ul className="addList">
                                                    <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q1: How satisfied are you with the location of this project?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q2: How likely is it that you would recommend this project to a friend?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 cta dta chat-mode-unsupported acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q3: How satisfied are you with our project?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q4: How would you rate the interior design of the unit?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q5: How satisfied are you with the common area (or facilities) in this project?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q6: How would you rate your overall satisfaction towards our sales representative?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q7: The information that is provided to you by the sales staff is relavant towards your purchase decision?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>

                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'pointer' }}>
                                                            <a href="# " style={{ cursor: 'pointer', paddingLeft: '0' }}>
                                                                <span className="listText">Q8: Overall, how satisfied are you with the price and promotional offer from the project?</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>SHOW</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                        </div> */}

                                    </div>
                                </aside>

                                <div className="live-preview-wrapper" style={{ padding: '0' }}> 
                                    <div id="livePreview" className="livePreview" style={{ maxWidth: '100%' }}>
                                        <div id="pageid-110955719" className="page v3theme      first-page      last-page">

                                            <div className="analyze-mode-header sm-corner-a" view-role="AnalyzeHeaderView">
                                                <div className="stats-header clearfix sm-corner-t " view-role="statsHeaderView" style={{width: '900px'}}>
                                                    <h4 className="sm-float-l">
                                                            RESPONDENTS: {this.state.respondents} of {this.state.total_responses} 
                                                    </h4>
                                                    <div global-share-menu="" className="persistent-buttons sm-float-r">
                                                    {/* <a href="#" className="wds-button wds-button--icon-right wds-button--sm" onClick={(e) => this.exportHandler()}>Export All</a> */}
                                                        {/* <a href="#" className="wds-button wds-button--icon-right wds-button--sm wds-button--arrow-down" onClick={(e) => this.exportHandler()}>SAVE AS</a> */}
                                                    </div>
                                                </div>

                                                <ul className="mode-tabs clearfix" view-role="modeTabsView" style={{ display: 'block' }}>
                                                    <li id="mode_tab_question_summaries" className="selected">
                                                        <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/${this.state.survey.id}` }>
                                                            QUESTION SUMMARIES WITH INSIGHT
                                                        </a>
                                                    </li>
                                                        {/* <li id="mode_tab_trends" className=" mode_tab_trends_insight">
                                                            <a href="/analyze/data-trends/sUrHwPtsu8ZHNr6AN9qQlPuHu_2BmaaY8BPd23hgtgCKw_3D" className="">
                                                            INSIGHTS AND DATA TRENDS
                                                            </a>
                                                        </li> */}
                                                    <li id="mode_tab_individual_responses" className="">
                                                        <a href={ `/cxm/platform/${this.props.match.params.xSite}/analyze/browse/${this.state.survey.id}` }>
                                                            INDIVIDUAL RESPONSES
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>

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