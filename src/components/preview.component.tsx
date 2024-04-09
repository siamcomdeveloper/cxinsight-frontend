import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import MenuSurvey from '../common/menu';
import { Spin, Icon } from 'antd';
// import CollectorRow from "../common/collector/collectorRow";
// import SummaryCollectorRow from "../common/collector/summaryCollectorRow";
import HeaderSurvey from '../common/header';
// import '../css/wds-react.4_16_1.min.css';
// import '../css/wds-charts.4_16_1.min.css';
// import '../css/survey-summary.css';
// import '../css/side-bar.css';
// import '../css/survey-info-stats.css';
// import '../css/status-card-survey-status.css';
// import '../css/status-card-response-count.css';
// import '../css/collector-list.css';

import '../css/createweb-step3-bundle-min.118ab706.css';
import '../css/createweb-global-bundle-min.ff71e50a.css';
import Collector from '../models/collector';
import Question from '../models/questions';
import ReactDOM from 'react-dom';
// import { Empty } from 'antd';
// import ReactDOM from 'react-dom';

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
    listCollectors: Array<Collector>,
    isLoading: boolean,
    totalCollectors: number,
    deviewView: number,
    overallGenius: any,
    requiredQuestions: any,
    estimatedCompleted: any,
    estimatedTime: any,
    numOfSkiplogics: any,
    textAnalysis: any,
    entityAnalysis: any,
    sentimentAnalysis: any,

    nodeElement: any;
    questionTypeId: any;
    questionRequired: any;
    questionAnalyzeEntity: any;
    questionAnalyzeSentiment: any;
    skipLogicStatus: any;
    visible: boolean;
}


export default class Preview extends React.Component<IProps, IState> {

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
            deviewView: 1,
            overallGenius: '',
            estimatedCompleted: 0,
            estimatedTime: 0,
            requiredQuestions: 0,
            numOfSkiplogics: 0,
            textAnalysis: '',
            entityAnalysis: 0,
            sentimentAnalysis: 0,

            nodeElement: [],
            questionTypeId: [],
            questionRequired: [],
            questionAnalyzeEntity: [],
            questionAnalyzeSentiment: [],
            skipLogicStatus: [],

            visible: false,
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

            document.body.id = 'preview-body';
            document.body.classList.toggle('translate', true);
            document.body.classList.toggle('step3', true);
            document.body.classList.toggle('basic', true);
            document.body.classList.toggle('modern-browser', true);
            document.body.classList.toggle('themeV3', false);
            document.body.classList.toggle('sticky', false);

            BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.id, jwtToken).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log('edit', rp.Data);
                            const survey = rp.Data.recordset[0];

                            const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                            // console.log('numQuestion', numQuestion);

                            // const numPage = parseInt(rp.Data.recordset[0].num_page)
                            // console.log('numPage', numPage);

                            let nodeArr = new Array<any>(numQuestion);
                            let questionTypeIdArr = new Array<any>(numQuestion);
                            let questionRequiredArr = new Array<any>(numQuestion);
                            let questionAnalyzeEntityArr = new Array<any>(numQuestion);
                            let questionAnalyzeSentimentArr = new Array<any>(numQuestion);
                            let skipLogicStatusArr = new Array<any>(numQuestion);
                            
                            for(let i = 0; i < numQuestion; i++) { 
                                nodeArr[i] = ''; 
                                questionTypeIdArr[i] = '';
                                questionRequiredArr[i] = false;
                                questionAnalyzeEntityArr[i] = '';
                                questionAnalyzeSentimentArr[i] = '';
                                skipLogicStatusArr[i] = false;
                            }
                            
                            this.setState({ 
                                survey: survey, 
                                nodeElement: nodeArr,
                                questionTypeId: questionTypeIdArr, 
                                questionRequired: questionRequiredArr, 
                                questionAnalyzeEntity: questionAnalyzeEntityArr, 
                                questionAnalyzeSentiment: questionAnalyzeSentimentArr, 
                                skipLogicStatus: skipLogicStatusArr, 
                            },  async () => { 
                                
                                    const allElement = this.state.nodeElement.map((obj: any, i: number) => this.getQuestionRow(this.props.match.params.id, i+1));
                                    
                                    const nodeElement = await Promise.all(allElement);
                                    
                                    // console.log(`after nodeElement`, nodeElement);
                                    // console.log(`after survey`, this.state.survey);
                                    // console.log(`after nodeElement`, this.state.nodeElement);
                                  // console.log(`after questionTypeId`, this.state.questionTypeId);

                                    const numRating = this.state.questionTypeId.filter((x: any) => x === 1).length;
                                    const numChoice = this.state.questionTypeId.filter((x: any) => x === 2).length;
                                    const numCheck = this.state.questionTypeId.filter((x: any) => x === 3).length;
                                    const numNPS = this.state.questionTypeId.filter((x: any) => x === 4).length;
                                    const numText = this.state.questionTypeId.filter((x: any) => x === 5).length;
                                    const numDropdown = this.state.questionTypeId.filter((x: any) => x === 6).length;

                                  // console.log(`after numRating`, numRating);
                                  // console.log(`after numChoice`, numChoice);
                                  // console.log(`after numCheck`, numCheck);
                                  // console.log(`after numNPS`, numNPS);
                                  // console.log(`after numText`, numText);
                                  // console.log(`after numDropdown`, numDropdown);

                                    //Star Rating = 15 sec
                                    //Multiple Choice = 20 sec
                                    //Checkboxes = 20 sec
                                    //Net Promoter Score = 15 sec
                                    //Text = 150 sec
                                    //Dropdown = 20 sec
                                    const estimatedTime = Math.ceil( ( ( numRating * 15 ) + ( numChoice * 20 ) + ( numCheck * 20 ) + ( numNPS * 15 ) + ( numText * 150 ) + ( numDropdown * 20 ) ) / 60 );//from sec to min
                                    // console.log(`estimatedTime`, estimatedTime);

                                    let estimatedCompleted = Math.ceil(100 - (3.33 * estimatedTime));
                                    // console.log(`estimatedCompleted`, estimatedCompleted);

                                    let overallGenius = "NOT SO GOOD";
                                    if(estimatedTime <= 5) overallGenius = "GREAT"; 
                                    else if(estimatedTime <= 8) overallGenius = "GOOD"; 
                                    else if (estimatedTime <= 10) overallGenius = "OK"; 

                                    // console.log(`after questionRequired`, this.state.questionRequired);
                                    // console.log(`after skipLogicStatus`, this.state.skipLogicStatus);

                                    // console.log(`questionRequired`, this.state.questionRequired.filter((x: any) => x === true).length);
                                    // console.log(`questionAnalyzeEntity`, this.state.questionAnalyzeEntity);
                                    // console.log(`questionAnalyzeSentiment`, this.state.questionAnalyzeSentiment);

                                    this.setState({ 
                                        overallGenius: overallGenius,
                                        estimatedTime: estimatedTime,
                                        estimatedCompleted: estimatedCompleted,
                                        requiredQuestions: this.state.questionRequired.filter((x: any) => x === true).length,
                                        numOfSkiplogics: this.state.skipLogicStatus.filter((x: any) => x === true).length,
                                        textAnalysis: this.state.questionAnalyzeEntity.filter((x: any) => x === 1).length || this.state.questionAnalyzeSentiment.filter((x: any) => x === 1).length ? "YES" : "NO",
                                        entityAnalysis: this.state.questionAnalyzeEntity.filter((x: any) => x === 1).length,
                                        sentimentAnalysis: this.state.questionAnalyzeSentiment.filter((x: any) => x === 1).length,
                                        isLoading: false 
                                    });
                                }
                            );
                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            console.log("Messages: " + rp.Messages);
                            console.log("Exception: " + rp.Exception);
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        console.log("Exception: " + error); 
                    }
                }

            );

            //remove ant-modal-root child to fix a modal showing when switch between pages
            const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
            // console.log('allAntModalRootElement', allAntModalRootElement);
            if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });
            
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            console.log('error', error); 
        }

    }

    getQuestionRow = async (surveyId: any, i: any) => {
        // console.log (`question no.${i} answer = `, currentAnswer);

        const index = i-1;  

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/client/', surveyId + '/' + i + '?re=1').then(
            async (rp) => {
                try{
                    if (rp.Status) {

                        // console.log(`get question ${i}`, rp.Messages);
                        // console.log(`get question ${i}`, rp.Data);
                        // console.log(`get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length === 1){

                            // const questionNo = rp.Data.recordset[0].order_no;
                            // const questionId = rp.Data.recordset[0].id[0];
                            const questionTypeId = rp.Data.recordset[0].type_id;

                            // const questionLabel = rp.Data.recordset[0].question_label;
                            // const questionActive = rp.Data.recordset[0].active;

                            const questionRequired = rp.Data.recordset[0].required;
                            // const questionRequiredLabel = rp.Data.recordset[0].required_label;

                            const questionAnalyzeEntity = rp.Data.recordset[0].analyze_entity;
                            const questionAnalyzeSentiment = rp.Data.recordset[0].analyze_sentiment;

                            let questionSkipLogic = null;
                            if(rp.Data.recordset[0].skip_logic) questionSkipLogic =  rp.Data.recordset[0].skip_logic.includes(',') ? rp.Data.recordset[0].skip_logic.split(',') : null;

                            // const questionShowCommentField = rp.Data.recordset[0].show_comment_field;
                            // const questionCommentFieldLabel = rp.Data.recordset[0].comment_field_label;
                            // const questionCommentFieldHint = rp.Data.recordset[0].comment_field_hint;

                            // const questionShowCommentFieldWhenAnswers = rp.Data.recordset[0].show_comment_when_answer;

                            // console.log(`get question ${i} id = `, questionId);
                            // console.log(`get question ${i} type id = `, questionTypeId);
                            // console.log(`get question ${i} no = `, questionNo);
                            // console.log(`get question ${i} label = `, questionLabel);
                            // console.log(`get question ${i} active = `, questionActive);

                            // console.log(`get question ${i} required = `, questionRequired);
                            
                            // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                            // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);

                            // console.log(`get question ${i} skip_logic = `, questionSkipLogic);
                            // console.log(`get question ${i} show_comment_field = `, questionShowCommentField);
                            // console.log(`get question ${i} comment_field_label = `, questionCommentFieldLabel);
                            // console.log(`get question ${i} show_comment_when_answer = `, questionShowCommentFieldWhenAnswers);
                            // console.log(`get question ${i} comment_field_hint = `, questionCommentFieldHint);

                            // let questionIdArr = this.state.questionId;
                            // questionIdArr[index] = questionId;

                            let questionTypeIdArr = this.state.questionTypeId;
                            questionTypeIdArr[index] = questionTypeId;

                            let questionRequiredArr = this.state.questionRequired;
                            questionRequiredArr[index] = questionRequired ? true : false;

                            let questionAnalyzeEntityArr = this.state.questionAnalyzeEntity;
                            questionAnalyzeEntityArr[index] = questionAnalyzeEntity;

                            let questionAnalyzeSentimentArr = this.state.questionAnalyzeSentiment;
                            questionAnalyzeSentimentArr[index] = questionAnalyzeSentiment;

                            this.setState({
                                // questionId: questionIdArr,
                                questionTypeId: questionTypeIdArr,
                                questionRequired: questionRequiredArr,
                                questionAnalyzeEntity: questionAnalyzeEntityArr,
                                questionAnalyzeSentiment: questionAnalyzeSentimentArr,
                            },  () => { 
                                    // console.log(`after questionId`, this.state.questionId);
                                    // console.log(`after questionTypeId`, this.state.questionTypeId);
                                    // console.log(`after questionRequired`, this.state.questionRequired);
                                    // console.log(`after questionAnalyzeEntity`, this.state.questionAnalyzeEntity);
                                    // console.log(`after questionAnalyzeSentiment`, this.state.questionAnalyzeSentiment);
                                } 
                            );

                            //Star Rating & Multiple choice variables
                            let choices = [] as any;
                            let weights = [] as any;

                            let weightAnswer = [] as any;
                            let toPage = [] as any;
                            let toQuestion = [] as any;

                            //NPS variables 
                            let weightAnswerFrom = [] as any;
                            let weightAnswerTo = [] as any;

                            //image variables 
                            // const questionImageType = rp.Data.recordset[0].image_src_type ? rp.Data.recordset[0].image_src_type.split(',') : '';
                            // const questionImageName = rp.Data.recordset[0].image_name ? rp.Data.recordset[0].image_name.split(',') : '';
                            // const questionImageSrc = rp.Data.recordset[0].image_src ? rp.Data.recordset[0].image_src.split(',') : '';
                            // const questionImageDesc = rp.Data.recordset[0].image_description ? rp.Data.recordset[0].image_description.split(',') : '';
                            
                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6 ){
                                
                                const questionChoice = rp.Data.recordset[0].choice.split(',');
                                // console.log(`get question ${i} choice = `, questionChoice);

                                choices = [] as any;
                                weights = [] as any;
                                for(let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                    } 
                                    else {
                                        weights.push(questionChoice[i]);
                                    }
                                }

                                // console.log(`get question ${i} choices = `, choices);
                                // console.log(`get question ${i} weights = `, weights);
                                
                                //get skip logic
                                weightAnswer = [] as any;
                                toPage = [] as any;
                                toQuestion = [] as any;
                                for(let i = 0; i < questionSkipLogic.length; i++) {
                                    if (i % 3 === 0) {
                                        weightAnswer.push(parseInt(questionSkipLogic[i]));
                                    } 
                                    else if (i % 3 === 1) {
                                        toPage.push(parseInt(questionSkipLogic[i]));
                                    }
                                    else {
                                        toQuestion.push(parseInt(questionSkipLogic[i]));
                                    }
                                }

                                const disableSkipLogicPage = toPage.every((item: any) => toPage.indexOf(item) === 0 && item === 0);
                                const disableSkipLogicQuestion = toQuestion.every((item: any) => toQuestion.indexOf(item) === 0 && item === 0);

                                // console.log(`get question ${i} weightAnswer = `, weightAnswer);
                                // console.log(`get question ${i} toPage = `, toPage);
                                // console.log(`get question ${i} toQuestion = `, toQuestion);

                                // console.log(`get question ${i} toPage.every = `, disableSkipLogicPage);
                                // console.log(`get question ${i} toQuestion.every = `, disableSkipLogicQuestion);

                                let skipLogicStatusArr = this.state.skipLogicStatus;

                                if(!disableSkipLogicPage && !disableSkipLogicQuestion){
                                    skipLogicStatusArr[index] = true;
                                }

                                this.setState({
                                    skipLogicStatus: skipLogicStatusArr,
                                },  () => { 
                                        // console.log(`after get question ${i} skip logic statue`, this.state.skipLogicStatus);
                                    } 
                                );
                            }
                            else if(questionTypeId === 4){

                                //get skip logic
                                weightAnswerFrom = [] as any;
                                weightAnswerTo = [] as any;
                                toPage = [] as any;
                                toQuestion = [] as any;
                                for(let i = 0; i < questionSkipLogic.length; i++) {
                                    if (i % 4 === 0) {
                                        weightAnswerFrom.push(parseInt(questionSkipLogic[i]));
                                    } 
                                    else if (i % 4 === 1) {
                                        weightAnswerTo.push(parseInt(questionSkipLogic[i]));
                                    }
                                    else if (i % 4 === 2) {
                                        toPage.push(parseInt(questionSkipLogic[i]));
                                    }
                                    else {
                                        toQuestion.push(parseInt(questionSkipLogic[i]));
                                    }
                                }

                                const disableSkipLogicPage = toPage.every((item: any) => toPage.indexOf(item) === 0 && item === 0);
                                const disableSkipLogicQuestion = toQuestion.every((item: any) => toQuestion.indexOf(item) === 0 && item === 0);

                                // console.log(`get question ${i} weightAnswerFrom = `, weightAnswerFrom);
                                // console.log(`get question ${i} weightAnswerTo = `, weightAnswerTo);
                                // console.log(`get question ${i} toPage = `, toPage);
                                // console.log(`get question ${i} toQuestion = `, toQuestion);

                                // console.log(`get question ${i} toPage.every = `, disableSkipLogicPage);
                                // console.log(`get question ${i} toQuestion.every = `, disableSkipLogicQuestion);

                                let skipLogicStatusArr = this.state.skipLogicStatus;
                                
                                if(!disableSkipLogicPage && !disableSkipLogicQuestion){
                                    skipLogicStatusArr[index] = true;
                                }

                                this.setState({
                                    skipLogicStatus: skipLogicStatusArr,
                                },  () => { 
                                        // console.log(`after get question ${i} skip logic statue`, this.state.skipLogicStatus);
                                    } 
                                );
                            }
                                        
                            // console.log(`get question ${i} element`);
                            // console.log(`got question ${i} element`, element);
                            return true;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return false;
                        }

                    } else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        console.log("Messages: " + rp.Messages);
                        console.log("Exception: " + rp.Exception);
                        return <div key={index}></div>;
                    }
                } catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log('catch', error); 
                }
            }//async (rp)
        );//call question api

    }

    // onDeviewViewHandler = (deviewView: any) => {
    //     // console.log('onDeviewViewHandler deviewView', deviewView);
    //     this.setState({ deviewView: deviewView });
    // }

    onDeviewViewHandler = (deviewView: any) => {
        // console.log('onDeviewViewHandler deviewView', deviewView);
        this.setState({ deviewView: deviewView }, () => {
            ReactDOM.render(
            <div id="iframeWrapper" className={ this.state.deviewView === 1 ? "desktop-size" : this.state.deviewView === 2 ? "tablet-size" : "mobile-size" }>
                <iframe id="surveyPreview" className={ this.state.deviewView === 1 ? "desktop-size" : this.state.deviewView === 2 ? "tablet-size" : "mobile-size" }
                    src={`/cxm/platform/${this.props.match.params.xSite}/sv-preview/${this.props.match.params.id}/${this.state.deviewView}`}>
                </iframe>
            </div>,
            document.getElementById('iframeWrapper-container'));
        });
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
            <div style={{borderBottom: "1px solid #d1d2d3"}}>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                {/* Start sm-survey-summary body */}
                {/* <div className="container clearfix"> */}
                <div className="content-wrapper">

                    <header className="subhead">
                        <nav className="navigationTabs">
                            <div className="global-navigation-header ">
                                <div className="global-navigation-header-title-container global-navigation-header-centered clearfix" style={{ paddingTop:'4px' }}>
                                    <h1 className="wds-pageheader__title wds-type--section-title wds-type--section-title-custom">
                                    {/* <span><span id="edit-name-icon" onClick={()=>this.Rename()} className="smf-icon notranslate">W</span> {this.state.survey.nickname}</span> */}
                                    <span><Icon type="edit" onClick={()=>this.Rename()}/> {this.state.survey.nickname}</span>
                                    </h1>
                                </div>
                                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'preview'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>
                            </div>
                        </nav>
                    </header>

                    <div className="bd logged-in-bd" style={{marginTop: '0', minHeight: '600px'}}>

                        {/* Start sm-survey-summary body */}
                        <div className="container clearfix">
                            {/* <div id="step2" className="clearfix survey-body-v3 survey-body theme-body"></div> */}
            
                            <div className="preview-score">
                                <div className="score-logic-container ">
                                    <div className="score-panel step3-panel ">
                                        <div className="score-data miniature">
                                            <p className="score-header" style={{ fontSize:'20px', paddingTop: '20px', paddingBottom: 0 }}>OVERALL</p>
                                            {/* <div className="success-circle-container"> */}
                                                {/* <div id="successCircleSmall"><canvas width="84" height="84" style={{height: "42px", width: "42px"}}></canvas></div> */}
                                                {/* <div id="scoreMiniature" style={{ display: "inline-block", marginLeft: '16px' }}>Great</div> */}
                                                {/* <span className="content" style={{ display: "inline-block", marginLeft: '16px', fontSize: '20px', color: '#00BF6F' }}>{this.state.overallGenius}</span> */}
                                            {/* </div> */}

                                            <div className="completion-time" style={{ marginTop: 30 }}>
                                                <div className="heading"> TOTAL PAGES </div>
                                                <span>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.survey.num_page}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Pages</span>
                                                </span>
                                            </div>

                                            <div className="completion-time" style={{ marginTop: 30 }}>
                                                <div className="heading"> TOTAL QUESTIONS </div>
                                                <span>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.survey.num_question}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Questions</span>
                                                </span>
                                            </div>

                                            {this.state.numOfSkiplogics ? 
                                            <div className="completion-time" style={{ marginTop: 30 }}>
                                                <div className="heading"> REQUIRED QUESTIONS </div>
                                                <span>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.requiredQuestions}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Questions</span>
                                                </span>
                                            </div>
                                            : ''}

                                            {this.state.numOfSkiplogics ? 
                                            <div className="completion-time" style={{ marginTop: 30 }}>
                                                <div className="heading"> NUMBER OF SKIP LOGICS </div>
                                                <span>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.numOfSkiplogics}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Skip logics</span>
                                                </span>
                                            </div>
                                            : ''}
                                            
                                            {/* { this.state.entityAnalysis || this.state.sentimentAnalysis ? 
                                            <div className="completion-time" style={{ marginTop: 30 }}>
                                                <div className="heading"> TEXT ANALYSIS </div>
                                                <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.textAnalysis}</span>

                                                { this.state.entityAnalysis ? 
                                                <span style={{display: "block", marginTop: 5 }}>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.entityAnalysis}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Entity analysis</span>
                                                </span>
                                                : ''}

                                                { this.state.sentimentAnalysis ? 
                                                <span style={{display: "block", marginTop: 5 }}>
                                                    <span id="completionTime" className="content" style={{display: "inline"}}>{this.state.sentimentAnalysis}</span>
                                                    <span className="minutes" style={{display: "inline"}}> Sentiment analysis</span>
                                                </span>
                                                : ''}

                                            </div>
                                            : ''} */}

                                        </div>
                                    </div>
                                </div>

                                <div className="preview">
                                    <div id="iframeWrapper-container" style={{ height: '100%' }}>
                                        <div id="iframeWrapper" className={ this.state.deviewView === 1 ? "desktop-size" : this.state.deviewView === 2 ? "tablet-size" : "mobile-size" }>
                                            {/* <div className="spinner sm-spin spin-large hide"></div>
                                            <div id="previewEnd" className=" desktop-size">
                                                <div className="message"> That's the end of the preview! </div>
                                                <div className="primary-ctas">
                                                    <a className="wds-button wds-button--primary wds-button--sm preview-again"> PREVIEW AGAIN </a>
                                                    <a href="/collect/send?sm=sUrHwPtsu8ZHNr6AN9qQlCr5Y3ZyDfiIFgC2GbxXUXM_3D" className="wds-button wds-button--primary wds-button--sm collect-responses-preview-end-page upgrade-status-check-cta"> COLLECT RESPONSES </a>
                                                </div>
                                                <div className="secondary-ctas">
                                                    <a href="/create/?sm=sUrHwPtsu8ZHNr6AN9qQlCr5Y3ZyDfiIFgC2GbxXUXM_3D" className="design-preview-end-page"> Back to design </a>
                                                </div>
                                            </div> */}
                                            <iframe id="surveyPreview" className={ this.state.deviewView === 1 ? "desktop-size" : this.state.deviewView === 2 ? "tablet-size" : "mobile-size" }
                                                // src="https://cxthailand.com/cxm/platform/${this.props.match.params.xSite}/sv-preview/1">
                                                src={`/cxm/platform/${this.props.match.params.xSite}/sv-preview/${this.props.match.params.id}/${this.state.deviewView}`}>
                                            </iframe>
                                        </div>
                                    </div>

                                    {/* <div id="iframeWrapper" className={ this.state.deviewView === 2 ? "tablet-size" : "hide" }>
                                        <iframe id="surveyPreview" className="tablet-size" 
                                            src="https://cxthailand.com/cxm/platform/${this.props.match.params.xSite}/sv-preview/1">
                                        </iframe>
                                    </div>

                                    <div id="iframeWrapper" className={ this.state.deviewView === 3 ? "mobile-size" : "hide" }>
                                        <iframe id="surveyPreview" className="mobile-size" 
                                            src="https://cxthailand.com/cxm/platform/${this.props.match.params.xSite}/sv-preview/1">
                                        </iframe>
                                    </div> */}

                                    <div id="floating-buttons-step3" className="floating-buttons">
                                        <div id="preview-buttons-step3" className="preview-buttons">
                                            <div className="resize-buttons">
                                                <div className="preview-device">Device View</div>
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(1)} className={ this.state.deviewView === 1 ? "resize selected" : "resize" } title="Preview on desktop"><Icon type="desktop" style={{ fontSize: '30px' }} /></a>&nbsp;&nbsp;
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(2)} className={ this.state.deviewView === 2 ? "resize selected" : "resize" } title="Preview on tablet"><Icon type="tablet" /></a>&nbsp;
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(3)} className={ this.state.deviewView === 3 ? "resize selected" : "resize" } title="Preview on phone"><Icon type="mobile" /></a>
                                            </div>
                                        </div>
                                        {/* <div className="survey-format-buttons">
                                            <div className="survey-formats">
                                                Survey Format
                                                <div className="q">
                                                    <span className="notranslate">?</span>
                                                    <div className="popout survey-format-help-content">
                                                        <div className="format-content-wrapper">
                                                            <div id="oqaatHelp" className="format-help">
                                                                <div className="heading">
                                                                    One Question at a Time
                                                                </div>
                                                                <div className="image-example">
                                                                    <img className="img-oqaat" src="https://cdn.smassets.net/assets/createweb/createweb/301.3/assets/images/Thumb_OQAAT.png"/>
                                                                </div>
                                                                <div className="help-text">
                                                                    <p>Automatically scroll to the next question.</p><br/>
                                                                    <p>Best for shorter, one-page surveys. People can focus their attention on one question at a time before moving on to the next one. Works with all question types.</p>
                                                                </div>
                                                            </div>
                                                            <div id="classicHelp" className="format-help">
                                                                <div className="heading">
                                                                    Classic
                                                                </div>
                                                                <div className="image-example">
                                                                    <img className="img-classic" src="https://cdn.smassets.net/assets/createweb/createweb/301.3/assets/images/Thumb_Classic.png"/>
                                                                </div>
                                                                <div className="help-text">
                                                                    <p>Show all questions on a page at once.</p><br/>
                                                                    <p>Best for longer surveys with multiple pages. People can see how much they have to answer at a glance. Works with all question types.</p>
                                                                </div>
                                                            </div>
                                                            <div id="conversationHelp" className="format-help">
                                                                <div className="heading">
                                                                    Conversation
                                                                </div>
                                                                <div className="image-example">
                                                                    <img className="img-conversation" src="https://cdn.smassets.net/assets/createweb/createweb/301.3/assets/images/Thumb_Chat.png"/>
                                                                </div>
                                                                <div className="help-text">
                                                                    <p>Turn your survey into a chat conversation.</p><br/>
                                                                    <p>Best for quick surveys with 15 questions or less. Works with most question types except Matrix/Rating Scale and File Upload.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a href="http://help.iconcxm.com/articles/en_US/kb/Survey-Format?uid=whgUWPOUm1IEpdt50ud7d82F_2BijRb06sZ6Xpe61q8HTnRjZHl4iUC_2F4v9BZcI7TTMan0heiiGKtPyJVxMShV900pOb4l8uttP_2FqB5PGC5jIrvmRYADdj2POEwZmSWscUJ4s6DejZZorNmByyyMRMMA_3D_3D" target="_blank" className="learn-more-link">Learn more</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="auto-scroll survey-format" data-format="auto_scroll" title="Switch to one question at a time" sm-tooltip-side="top">
                                                <svg className="survey-format-svg" viewBox="0 0 25 26" version="1.1">
                                                    <g id="format-oqaat" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                                        <g id="format-oqaat-2" transform="translate(1.000000, 1.000000)" stroke="#333E48" stroke-width="1.5" style={{stroke: "rgb(51, 62, 72)"}}>
                                                            <rect id="Rectangle-path" x="0" y="8" width="23" height="8"></rect>
                                                            <polyline id="Shape" points="23 0 23 4 0 4 0 0"></polyline>
                                                            <polyline id="Shape" points="0 24 0 20 23 20 23 24"></polyline>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="classic survey-format" data-format="classic" title="Switch to classic" sm-tooltip-side="top">
                                                <svg className="survey-format-svg" viewBox="0 0 22 24" version="1.1">
                                                    <g id="format-classic" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <path d="M8.91891892,15 L16.6486486,15 C17.140973,15 17.5405405,14.5968 17.5405405,14.1 C17.5405405,13.6032 17.140973,13.2 16.6486486,13.2 L8.91891892,13.2 C8.42659459,13.2 8.02702703,13.6032 8.02702703,14.1 C8.02702703,14.5968 8.42659459,15 8.91891892,15 Z M8.91891892,19.2 L16.6486486,19.2 C17.140973,19.2 17.5405405,18.7968 17.5405405,18.3 C17.5405405,17.8032 17.140973,17.4 16.6486486,17.4 L8.91891892,17.4 C8.42659459,17.4 8.02702703,17.8032 8.02702703,18.3 C8.02702703,18.7968 8.42659459,19.2 8.91891892,19.2 Z M8.91891892,6.6 L16.6486486,6.6 C17.140973,6.6 17.5405405,6.1968 17.5405405,5.7 C17.5405405,5.2032 17.140973,4.8 16.6486486,4.8 L8.91891892,4.8 C8.42659459,4.8 8.02702703,5.2032 8.02702703,5.7 C8.02702703,6.1968 8.42659459,6.6 8.91891892,6.6 Z M8.91891892,10.8 L16.6486486,10.8 C17.140973,10.8 17.5405405,10.3968 17.5405405,9.9 C17.5405405,9.4032 17.140973,9 16.6486486,9 L8.91891892,9 C8.42659459,9 8.02702703,9.4032 8.02702703,9.9 C8.02702703,10.3968 8.42659459,10.8 8.91891892,10.8 Z M4.72108108,14.736 C4.88756757,14.904 5.11351351,15 5.35135135,15 C5.47027027,15 5.58918919,14.9748 5.69621622,14.9268 C5.80324324,14.8788 5.89837838,14.82 5.98162162,14.736 C6.06486486,14.652 6.13621622,14.556 6.17189189,14.448 C6.21945946,14.34 6.24324324,14.22 6.24324324,14.1 C6.24324324,13.86 6.14810811,13.6308 5.98162162,13.464 C5.64864865,13.128 5.05405405,13.128 4.72108108,13.464 C4.55459459,13.6308 4.45945946,13.86 4.45945946,14.1 C4.45945946,14.22 4.48324324,14.34 4.53081081,14.448 C4.56648649,14.556 4.63783784,14.652 4.72108108,14.736 Z M4.72108108,18.936 C4.88756757,19.104 5.11351351,19.2 5.35135135,19.2 C5.47027027,19.2 5.58918919,19.1748 5.69621622,19.1268 C5.80324324,19.092 5.89837838,19.02 5.98162162,18.936 C6.14810811,18.768 6.24324324,18.54 6.24324324,18.3 C6.24324324,18.1788 6.21945946,18.06 6.17189189,17.952 C6.13621622,17.844 6.06486486,17.748 5.98162162,17.664 C5.64864865,17.3268 5.04216216,17.3268 4.72108108,17.664 C4.63783784,17.748 4.57837838,17.844 4.53081081,17.952 C4.48324324,18.06 4.45945946,18.1788 4.45945946,18.3 C4.45945946,18.42 4.48324324,18.54 4.53081081,18.648 C4.56648649,18.756 4.63783784,18.852 4.72108108,18.936 Z M5.00648649,6.528 C5.11351351,6.576 5.23243243,6.6 5.35135135,6.6 C5.58918919,6.6 5.81513514,6.504 5.98162162,6.336 C6.14810811,6.168 6.24324324,5.94 6.24324324,5.7 C6.24324324,5.46 6.14810811,5.232 5.98162162,5.064 C5.73189189,4.812 5.33945946,4.74 5.00648649,4.872 C4.89945946,4.92 4.80432432,4.98 4.72108108,5.064 C4.55459459,5.232 4.45945946,5.46 4.45945946,5.7 C4.45945946,5.94 4.55459459,6.168 4.72108108,6.336 C4.80432432,6.42 4.89945946,6.48 5.00648649,6.528 Z M4.72108108,10.536 C4.88756757,10.704 5.11351351,10.8 5.35135135,10.8 C5.58918919,10.8 5.81513514,10.704 5.98162162,10.536 C6.06486486,10.452 6.13621622,10.356 6.17189189,10.248 C6.21945946,10.14 6.24324324,10.02 6.24324324,9.9 C6.24324324,9.78 6.21945946,9.672 6.17189189,9.552 C6.13621622,9.444 6.06486486,9.348 5.98162162,9.264 C5.64864865,8.928 5.05405405,8.928 4.72108108,9.264 C4.63783784,9.348 4.57837838,9.444 4.53081081,9.552 C4.48324324,9.672 4.45945946,9.78 4.45945946,9.9 C4.45945946,10.02 4.48324324,10.14 4.53081081,10.248 C4.57837838,10.356 4.63783784,10.452 4.72108108,10.536 Z M1.78378378,22.2 L20.2162162,22.2 L20.2162162,1.8 L1.78378378,1.8 L1.78378378,22.2 Z M21.1081081,0 L0.891891892,0 C0.399567568,0 0,0.4032 0,0.9 L0,23.1 C0,23.5968 0.399567568,24 0.891891892,24 L21.1081081,24 C21.6004324,24 22,23.5968 22,23.1 L22,0.9 C22,0.4032 21.6004324,0 21.1081081,0 Z" id="Fill-1-Copy" fill="#000000" style={{fill: "dodgerblue"}}></path>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="conversation survey-format" data-format="chat_mode" title="Switch to conversation" sm-tooltip-side="top" style={{display: "none"}}>
                                                <svg className="survey-format-svg" viewBox="0 0 23 23" version="1.1">
                                                    <g id="format-conversation" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <g id="format-conversation-2" fill="#333E48" fill-rule="nonzero" style={{fill: "rgb(51, 62, 72)"}}>
                                                            <path d="M6.0456171,19.3301851 L1.37879186,22.826336 C0.810403431,23.2521441 0,22.8463864 0,22.1359942 L0,18.4677438 C0,18.4196627 0.00393284223,18.3725006 0.0114942529,18.3265619 L0.0114942529,3.16228489 C0.0114942529,1.41580317 1.42668614,0 3.17241379,0 L19.8390805,0 C21.5848081,0 23,1.41580317 23,3.16228489 L23,16.1679002 C23,17.9143819 21.5848081,19.3301851 19.8390805,19.3301851 L6.0456171,19.3301851 Z M1.72413793,20.4127309 L5.2418978,17.777402 C5.39102528,17.6656831 5.5723163,17.6053024 5.75862069,17.6053024 L19.8390805,17.6053024 C20.632593,17.6053024 21.2758621,16.9617555 21.2758621,16.1679002 L21.2758621,3.16228489 C21.2758621,2.36842956 20.632593,1.72488267 19.8390805,1.72488267 L3.17241379,1.72488267 C2.37890122,1.72488267 1.73563218,2.36842956 1.73563218,3.16228489 L1.73563218,18.4677438 C1.73563218,18.5158248 1.73169934,18.5629869 1.72413793,18.6089256 L1.72413793,20.4127309 Z" id="Shape-Copy-3"></path>
                                                            <path d="M11.5,11 C10.6715729,11 10,10.3284271 10,9.5 C10,8.67157288 10.6715729,8 11.5,8 C12.3284271,8 13,8.67157288 13,9.5 C13,10.3284271 12.3284271,11 11.5,11 Z" id="Oval-Copy"></path>
                                                            <path d="M16.5,11 C15.6715729,11 15,10.3284271 15,9.5 C15,8.67157288 15.6715729,8 16.5,8 C17.3284271,8 18,8.67157288 18,9.5 C18,10.3284271 17.3284271,11 16.5,11 Z" id="Oval-Copy-2"></path>
                                                            <path d="M6.5,11 C5.67157288,11 5,10.3284271 5,9.5 C5,8.67157288 5.67157288,8 6.5,8 C7.32842712,8 8,8.67157288 8,9.5 C8,10.3284271 7.32842712,11 6.5,11 Z" id="Oval-Copy-3"></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End sm-survey-summary body */}
                        {/* <h1 style={{ margin: '40px 0px 50px 50px'}}>SUMMARY{this.state.survey.title}</h1> */}
                    </div>
                    
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