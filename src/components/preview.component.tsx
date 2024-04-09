import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import MenuSurvey from '../common/menu';
import { Spin, Icon } from 'antd';
import HeaderSurvey from '../common/header';

import '../css/createweb-step3-bundle-min.118ab706.css';
import '../css/createweb-global-bundle-min.ff71e50a.css';
import Collector from '../models/collector';
import Question from '../models/questions';
import ReactDOM from 'react-dom';

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
                                                src={`/cxm/platform/${this.props.match.params.xSite}/sv-preview/${this.props.match.params.id}/${this.state.deviewView}`}>
                                            </iframe>
                                        </div>
                                    </div>

                                    <div id="floating-buttons-step3" className="floating-buttons">
                                        <div id="preview-buttons-step3" className="preview-buttons">
                                            <div className="resize-buttons">
                                                <div className="preview-device">Device View</div>
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(1)} className={ this.state.deviewView === 1 ? "resize selected" : "resize" } title="Preview on desktop"><Icon type="desktop" style={{ fontSize: '30px' }} /></a>&nbsp;&nbsp;
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(2)} className={ this.state.deviewView === 2 ? "resize selected" : "resize" } title="Preview on tablet"><Icon type="tablet" /></a>&nbsp;
                                                <a href="#" style={{ textDecoration: 'none' }} onClick={(e) => this.onDeviewViewHandler(3)} className={ this.state.deviewView === 3 ? "resize selected" : "resize" } title="Preview on phone"><Icon type="mobile" /></a>
                                            </div>
                                        </div>
                                        
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