import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { Result, Spin, Modal, Button, Progress } from 'antd';

import '../css/smlib.surveytemplates-survey_page-bundle-min.9c1fec94.css';
import '../css/responseweb-base-bundle-min.d03455d7.css';
import '../css/smlib.surveytemplates-survey_page-bundle-min.74c6465c.css';
import '../css/palette-1_471b9133-d1b8-4b9d-8978-e48ff77e3f70.css';
import '../css/bootstrap-datepicker3.standalone.min.css';
import '../css/smlib.surveytemplates-datepicker-bundle-min.f6e20542.css';

import SurveyResponse from '../models/surveyResponse';
import Answer from '../models/answers';
import Question from '../models/questions';
import RatingQuestion from '../common/client-survey/ratingQuestion';
import ReactDOM from 'react-dom';
import ChoiceQuestion from '../common/client-survey/choiceQuestion';
import ScoreQuestion from '../common/client-survey/scoreQuestion';
import TextQuestion from '../common/client-survey/textQuestion';
import CheckboxQuestion from '../common/client-survey/checkboxQuestion';
import DropdownQuestion from '../common/client-survey/dropdownQuestion';
import InfoTextQuestion from '../common/client-survey/infoTextQuestion';
import InfoDropdownQuestion from '../common/client-survey/infoDropdownQuestion';
import InfoDropdownInstitutionQuestion from '../common/client-survey/infoDropdownInstitutionQuestion';
import InfoDropdownProjectQuestion from '../common/client-survey/infoDropdownProjectQuestion';
import InfoDatePickerQuestion from '../common/client-survey/infoDatePickerQuestion';
import { refreshJwtToken, getJwtToken } from '../helper/jwt.helper';
import parse from 'html-react-parser';
import reactCSS from 'reactcss';

import Recaptcha from 'react-recaptcha';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            surveyId:string,
            size:string,
            // collectorId:string,
            // token:string
        },
        path: string,
        url: string,
    }
}

interface IState {
    survey: Surveys,
    surveyResponse: SurveyResponse,
    listAnswers: Array<Answer>,
    isLoading: boolean,
    isChecking: boolean,
    RecaptchaResponse: any,
    isSuccessLoading: boolean,
    totalCollectors: number,
    hover : boolean,
    thankyou : boolean,
    submitLoading: boolean,

    submitButtonElement: any,

    nodeElement: any;
    currentPageNo: number;
    disableElement: any;
    numQuestion: number;
    numPage: number;
    questionId: any;
    questionTypeId: any;
    questionRequired: any;
    questionAnalyzeEntity: any;
    questionAnalyzeSentiment: any;
    questionShowCommentFieldWhenAnswers: any;
    showCommentFieldStatus: any;
    showConsentSection: any;
    answer: any;
    answerInfo: any;
    comment: any;
    signature: any;
    consent: any;
    skipLogicStatus: any;
    skipLogic: any;
    skipLogicText: any;
    requiredLabelStatus: any;
    requiredLabelStatusInfo: any;
    
    callAnswerApi: any;
    htmlElRef: any;
    htmlElRefInfo: any;

    responseId: any;
    timeSpent: any;

    authorized: any;
    cutoffDue: any;

    surveyId: any;
    collectorId: any;

    email_id: any;
    sms_id: any;

    headerDescription: any;
    footerDescription: any;
    endOfSurveyMessage: any;
    completionRedirect: any;
    lang: any;
    langModalVisible: any;

    isMobile: boolean,
    clientInfoNum: any,

    rp: any

    sumAnswer: any;
}

//this styles for scrollTo ref elements
const containerStyles = {
    overflow: 'auto',
    height: '100vh',
}

export default class PreviewClientSurvey extends React.Component<IProps, IState> {
    container: any;

    constructor(props: IProps) {

        super(props);

        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            surveyResponse:{
                survey_id: '',
                collector_id: '',
                time_spent: '', 
                complete_status: 0
            },
            listAnswers: [],
            isLoading: true,
            isChecking: true,
            RecaptchaResponse: '',
            isSuccessLoading: false,
            submitLoading: false,
            totalCollectors: 0,
            hover: false,
            thankyou: false,
            
            submitButtonElement: '',

            nodeElement: [],
            currentPageNo: 1,
            disableElement: [],
            numQuestion: 0,
            numPage: 1,
            questionId: [],
            questionTypeId: [],
            questionRequired: [],
            questionAnalyzeEntity: [],
            questionAnalyzeSentiment: [],
            questionShowCommentFieldWhenAnswers: [],
            showCommentFieldStatus: [],
            showConsentSection: [],
            answer: [],
            answerInfo: [],
            comment: [],
            signature: [],
            consent: [],
            skipLogicStatus: [],
            skipLogic: [],
            skipLogicText: [],
            requiredLabelStatus: [],
            requiredLabelStatusInfo: [],

            callAnswerApi: [],
            htmlElRef: [],
            htmlElRefInfo: [],

            responseId: '',
            timeSpent: 0,

            authorized: false,
            cutoffDue: false,
            surveyId: 0,
            collectorId: 0,
            email_id: 0,
            sms_id: 0,

            headerDescription: [],
            footerDescription: [],
            endOfSurveyMessage: '',
            completionRedirect: '',
            lang: 0,
            langModalVisible: false,

            isMobile: parseInt(this.props.match.params.size) === 3 ? true : false,
            // isMobile: window.outerWidth < 768 ? true : false,
            clientInfoNum: 11,

            rp: [],
            
            sumAnswer: 0
        }

        this.onFieldValueChange = this.onFieldValueChange.bind(this);
        this.answerHandler = this.answerHandler.bind(this);
        this.answerInfoHandler = this.answerInfoHandler.bind(this);
        this.commentHandler = this.commentHandler.bind(this);
        this.signatureHandler = this.signatureHandler.bind(this);
        this.consentHandler = this.consentHandler.bind(this);
    }

    async componentDidMount() {
        this.renderSurvey();
    }

    // async passRecaptcha(){
    async renderSurvey(){
        try{
            document.body.id = 'client-survey';
            document.body.classList.toggle('translate', true);
            document.body.classList.toggle('survey-body', true);
            document.body.classList.toggle('modern-browser', true);
            
            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);
            
            if( [1,4].includes(userData.ro) ) authorized = true;
            else if( [2,3].includes(userData.ro) ){
                if( userData.rs.includes('/') ) userData.rs.split('/').map((entity: any, i: any) => { if(parseInt(entity) === parseInt(this.props.match.params.surveyId)) authorized = true; });
                else if(parseInt(userData.rs) === parseInt(this.props.match.params.surveyId)) authorized = true;
            }
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }
            
            BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.surveyId, jwtToken).then(
                async (rp) => {
                    try{
                        if (rp.Status) {
                            // console.log('survey rp.Data', rp.Data);
                            // console.log('survey rp.Data.recordset[0].multi_lang', rp.Data.recordset[0].multi_lang);

                            const multiLangSurvey = rp.Data.recordset[0].multi_lang;
                            // console.log('multiLangSurvey', multiLangSurvey);

                            if(multiLangSurvey){
                                this.setState({
                                    langModalVisible: true,
                                    isLoading: false,
                                    rp: rp,
                                });
                            }
                            else{
                                this.setState({
                                    isLoading: false,
                                    rp: rp,
                                });
                                this.getSurveyData(this.state.rp);
                            }

                        } else {
                            this.setState({ isLoading: false });
                            // toastr.error(rp.Messages + '- something went wrong!');
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'preview componentDidMount BaseService.get<Surveys> /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    } catch(error){
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages + '- something went wrong!');
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'preview componentDidMount BaseService.get<Surveys> /surveys/ catch', message: `catch: ${error} | Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error} | Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }

            );
        }
        catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'preview componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    async getSurveyData(rp: any){
        
        this.setState({ isLoading: true });

        //lang
        //0 = TH or Default Single Language, 1 = EN
        // console.log('getSurveyData this.state.lang', this.state.lang);

        const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
        if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

        let authorized = false;
        const userData = jwt.decode(jwtToken) as any;
        if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);
        
        if( [1,4].includes(userData.ro) ) authorized = true;
        else if( [2,3].includes(userData.ro) ){
            if( userData.rs.includes('/') ) userData.rs.split('/').map((entity: any, i: any) => { if(parseInt(entity) === parseInt(this.props.match.params.surveyId)) authorized = true; });
            else if(parseInt(userData.rs) === parseInt(this.props.match.params.surveyId)) authorized = true;
        }
        if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }
        
        // const startTime = performance.now();
        BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.surveyId, jwtToken).then(
            async (rp) => {
                try{
                    if (rp.Status) {
                        // console.log('survey collector rp.Data', rp.Data);

                        const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                        // console.log('numQuestion', numQuestion);

                        const numPage = parseInt(rp.Data.recordset[0].num_page)
                        // console.log('numPage', numPage);

                        let nodeArr = new Array<any>(numQuestion);
                        let disableArr = new Array<any>(numQuestion);
                        let questionIdArr = new Array<any>(numQuestion);
                        let questionTypeIdArr = new Array<any>(numQuestion);
                        let questionRequiredArr = new Array<any>(numQuestion);
                        let questionAnalyzeEntityArr = new Array<any>(numQuestion);
                        let questionAnalyzeSentimentArr = new Array<any>(numQuestion);
                        let questionShowCommentFieldWhenAnswersArr = new Array<any>(numQuestion);
                        let showCommentFieldStatusArr = new Array<any>(numQuestion);
                        let showConsentSectionArr = new Array<any>(numQuestion);
                        let answerArr = new Array<any>(numQuestion);
                        let answerInfoArr = new Array<any>(this.state.clientInfoNum);
                        let commentArr = new Array<any>(numQuestion);
                        let signatureArr = new Array<any>(numQuestion);
                        let consentArr = new Array<any>(numQuestion);
                        let skipLogicStatusArr = new Array<any>(numQuestion);
                        let skipLogicArr = new Array<any>(numQuestion);
                        let requiredLabelStatusArr = new Array<any>(numQuestion);
                        let requiredLabelStatusInfoArr = new Array<any>(this.state.clientInfoNum);
                        let callAnswerApiArr = new Array<any>(numQuestion);
                        let htmlElRefArr = new Array<any>(numQuestion);
                        let htmlElRefInfoArr = new Array<any>(this.state.clientInfoNum);
                        
                        for(let i = 0; i < numQuestion; i++) { 
                            nodeArr[i] = ''; 
                            disableArr[i] = false; 
                            questionIdArr[i] = '';
                            questionTypeIdArr[i] = '';
                            questionRequiredArr[i] = false;
                            questionAnalyzeEntityArr[i] = '';
                            questionAnalyzeSentimentArr[i] = '';
                            questionShowCommentFieldWhenAnswersArr[i] = '';
                            showCommentFieldStatusArr[i] = false;
                            showConsentSectionArr[i] = false;
                            answerArr[i] = '';
                            commentArr[i] = '';
                            signatureArr[i] = '';
                            consentArr[i] = '';
                            skipLogicStatusArr[i] = false;
                            skipLogicArr[i] = '';
                            requiredLabelStatusArr[i] = false;
                            callAnswerApiArr[i] = false;
                            htmlElRefArr[i] = '';
                            htmlElRefInfoArr[i] = '';
                        }

                        for(let i = 0; i < this.state.clientInfoNum; i++) { 
                            answerInfoArr[i] = ''; 
                            requiredLabelStatusInfoArr[i] = false;
                        }
                        
                        this.setState({ 
                            survey: rp.Data.recordset[0], 
                            surveyId: this.props.match.params.surveyId, 
                            nodeElement: nodeArr,
                            disableElement: disableArr,
                            numQuestion: numQuestion, 
                            numPage: numPage, 
                            questionId: questionIdArr, 
                            questionTypeId: questionTypeIdArr, 
                            questionRequired: questionRequiredArr, 
                            questionAnalyzeEntity: questionAnalyzeEntityArr, 
                            questionAnalyzeSentiment: questionAnalyzeSentimentArr, 
                            questionShowCommentFieldWhenAnswers: questionShowCommentFieldWhenAnswersArr, 
                            showCommentFieldStatus: showCommentFieldStatusArr, 
                            showConsentSection: showConsentSectionArr, 
                            answer: answerArr, 
                            answerInfo: answerInfoArr, 
                            comment: commentArr, 
                            signature: signatureArr, 
                            consent: consentArr, 
                            skipLogicStatus: skipLogicStatusArr, 
                            skipLogic: skipLogicArr, 
                            requiredLabelStatus: requiredLabelStatusArr, 
                            requiredLabelStatusInfo: requiredLabelStatusInfoArr, 
                            callAnswerApi: callAnswerApiArr, 
                            htmlElRef: htmlElRefArr, 
                            htmlElRefInfo: htmlElRefInfoArr, 
                        },  () => { 
                                // console.log(`after survey`, this.state.survey);
                                // console.log(`after nodeElement`, this.state.nodeElement);
                                // console.log(`after disableElement`, this.state.disableElement);
                                // console.log(`after numQuestion`, this.state.numQuestion);
                                // console.log(`after numPage`, this.state.numPage);
                                // console.log(`after questionId`, this.state.questionId);
                                // console.log(`after questionTypeId`, this.state.questionTypeId);
                                // console.log(`after questionRequired`, this.state.questionRequired);
                                // console.log(`after questionAnalyzeEntity`, this.state.questionAnalyzeEntity);
                                // console.log(`after questionAnalyzeSentiment`, this.state.questionAnalyzeSentiment);
                                // console.log(`after questionShowCommentFieldWhenAnswers`, this.state.questionShowCommentFieldWhenAnswers);
                                // console.log(`after showCommentFieldStatus`, this.state.showCommentFieldStatus);
                                // console.log(`after showConsentSection`, this.state.showConsentSection);
                                // console.log(`after answer`, this.state.answer);
                                // console.log(`after comment`, this.state.comment);
                                // console.log(`after signature`, this.state.signature);
                                // console.log(`after consent`, this.state.consent);
                                // console.log(`after skipLogicStatus`, this.state.skipLogicStatus);
                                // console.log(`after skipLogic`, this.state.skipLogic);
                                // console.log(`after requiredLabelStatus`, this.state.requiredLabelStatus);
                                // console.log(`after callAnswerApi`, this.state.callAnswerApi);
                                // console.log(`after htmlElRef`, this.state.htmlElRef);
                                
                                let headerDescription = '', footerDescription = '', endOfSurveyMessage = '';

                                if(this.state.lang){
                                    //Get current header description
                                    headerDescription = this.state.survey.header_description_EN ? this.state.survey.header_description_EN.includes('~') ? this.state.survey.header_description_EN.split('~') : [this.state.survey.header_description_EN] : [''];
                                    // console.log('headerDescription', headerDescription);
                                    // let currentHeaderDescription = this.state.currentPageNo > headerDescription.length ? '' : headerDescription[this.state.currentPageNo-1];
                                    // console.log('currentHeaderDescription', headerDescription);

                                    //Get current footer description
                                    footerDescription = this.state.survey.footer_description_EN ? this.state.survey.footer_description_EN.includes('~') ? this.state.survey.footer_description_EN.split('~') : [this.state.survey.footer_description_EN] : [''];
                                    // console.log('footerDescription', footerDescription);
                                    // let currentFooterDescription = this.state.currentPageNo > footerDescription.length ? '' : footerDescription[this.state.currentPageNo-1];
                                    // console.log('currentFooterDescription', footerDescription);

                                    //Get end Of Survey Message
                                    // endOfSurveyMessage = this.state.survey.end_of_survey_message_EN ? this.state.survey.end_of_survey_message_EN.includes('\n') ? this.state.survey.end_of_survey_message_EN.split('\n').map((item: any, i: any) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{this.state.survey.end_of_survey_message_EN}</p>] : '';
                                    endOfSurveyMessage = this.state.survey.end_of_survey_message_EN ? this.state.survey.end_of_survey_message_EN : '';
                                }
                                else{
                                    //Get current header description
                                    headerDescription = this.state.survey.header_description ? this.state.survey.header_description.includes('~') ? this.state.survey.header_description.split('~') : [this.state.survey.header_description] : [''];
                                    // console.log('headerDescription', headerDescription);
                                    // let currentHeaderDescription = this.state.currentPageNo > headerDescription.length ? '' : headerDescription[this.state.currentPageNo-1];
                                    // console.log('currentHeaderDescription', headerDescription);

                                    //Get current footer description
                                    footerDescription = this.state.survey.footer_description ? this.state.survey.footer_description.includes('~') ? this.state.survey.footer_description.split('~') : [this.state.survey.footer_description] : [''];
                                    // console.log('footerDescription', footerDescription);
                                    // let currentFooterDescription = this.state.currentPageNo > footerDescription.length ? '' : footerDescription[this.state.currentPageNo-1];
                                    // console.log('currentFooterDescription', footerDescription);

                                    //Get end Of Survey Message
                                    // endOfSurveyMessage = this.state.survey.end_of_survey_message ? this.state.survey.end_of_survey_message.includes('\n') ? this.state.survey.end_of_survey_message.split('\n').map((item: any, i: any) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{this.state.survey.end_of_survey_message}</p>] : '';
                                    endOfSurveyMessage = this.state.survey.end_of_survey_message ? this.state.survey.end_of_survey_message : '';
                                }

                                this.setState({ 
                                    headerDescription: headerDescription,
                                    footerDescription: footerDescription,
                                    endOfSurveyMessage: endOfSurveyMessage,
                                    completionRedirect: this.state.survey.completion_redirect ? this.state.survey.completion_redirect : ''
                                }, () => {
                                    this.renderElement(false);
                                });

                                // const endTime = performance.now();
                                // console.log('Its took ' + (endTime - startTime) + ' ms.');
                            }
                        );

                    } else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages + '- something went wrong!');
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `preview getSurveyData BaseService.get<Surveys> /surveys/${this.props.match.params.surveyId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                } catch(error){
                    this.setState({ isLoading: false });
                    // toastr.error(rp.Messages + '- something went wrong!');
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'preview getSurveyData BaseService.get<Surveys> /surveys/${this.props.match.params.surveyId} catch', message: `catch: ${error} | Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error} | Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }

        );
    }

    async renderElement(scrollTo: any){
        // console.log('renderElement requiredLabelStatus', this.state.requiredLabelStatus);

        const allElement = this.state.answer.map((obj: any, i: number) => this.getQuestionRow(this.state.surveyId, i+1, this.state.disableElement[i], this.state.skipLogicText[i], this.state.showCommentFieldStatus[i], this.state.showConsentSection[i], this.state.requiredLabelStatus[i], this.state.answer[i], this.state.comment[i], this.state.signature[i], this.state.consent[i]));
        const nodeElement = await Promise.all(allElement);

        // console.log(`after nodeElement`, nodeElement);

        const allPageNo = this.state.answer.map((obj: any, i: number) => this.getPageNo(this.state.surveyId, i+1));//i+1 = question no. start from 1 - x (number of question)
        const allPromisePageNo = await Promise.all(allPageNo);
        // console.log('allPageNoPromise', allPromisePageNo);

        let indexListToRemove = [] as any;
        allPromisePageNo.forEach((questionPageNo: any, index: any) => {
            // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
            // console.log('currentPageNo', currentPageNo);
            if(questionPageNo && parseInt(questionPageNo) !== this.state.currentPageNo){
                // console.log('!matched');
                indexListToRemove.push(index);
            }
        });
        // console.log('indexListPageNo', indexListToRemove);

        //remove elements
        indexListToRemove.forEach((removeIndex: any, index: any) => { 
            // console.log(`removeIndex = ${removeIndex} : index = ${index}`); 
            delete nodeElement[removeIndex];
        });
        
        // console.log('nodeElement removed', nodeElement);
        
        // this.setState({
        //     nodeElement: nodeElement,
        // },  () => { 
        //       // console.log(`after nodeElement`, this.state.nodeElement);
        //     } 
        // );

        let infoQuestions = [];
        let allInfoElement: any
        let nodeInfoElement: any;

        if(this.state.survey.client_info_form){
            infoQuestions = [
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 0,
                    enable: this.state.survey.enable_name_title,
                    name: 'name-title',
                    typeId: 6,
                    label: this.state.lang ? 'Name Title' : 'คำนำหน้า',
                    required: this.state.survey.required_name_title,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    lang: this.state.lang
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 1,
                    enable: this.state.survey.enable_first_name,
                    name: 'first-name',
                    typeId: 5,
                    label: this.state.lang ? 'First Name' : 'ชื่อ',
                    required: this.state.survey.required_first_name,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 100,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 2,
                    enable: this.state.survey.enable_last_name,
                    name: 'last-name',
                    typeId: 5,
                    label: this.state.lang ? 'Last Name' : 'นามสกุล',
                    required: this.state.survey.required_last_name,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 100,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 3,
                    enable: this.state.survey.enable_birthdate,
                    name: 'birthday',
                    typeId: 5,
                    label: this.state.lang ? 'Birthday (DD/MM/YYYY)' : 'วันเดือนปีเกิด (วว/ดด/ปปปป)',
                    required: this.state.survey.required_birthdate,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 10,
                    cols: 10
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 4,
                    enable: this.state.survey.enable_mobile_number,
                    name: 'mobile-number',
                    typeId: 5,
                    label: this.state.lang ? 'Mobile Number' : 'เบอร์มือถือ',
                    required: this.state.survey.required_mobile_number,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 15,
                    cols: 20
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 5,
                    enable: this.state.survey.enable_email,
                    name: 'email',
                    typeId: 5,
                    label: this.state.lang ? 'Email' : 'อีเมล',
                    required: this.state.survey.required_email,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 50,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 6,
                    enable: this.state.survey.enable_line_id,
                    name: 'line-id',
                    typeId: 5,
                    label: this.state.lang ? 'Line ID' : 'ไอดีไลน์',
                    required: this.state.survey.required_line_id,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 50,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 7,
                    enable: this.state.survey.enable_id_card_4_digit,
                    name: 'id-card-4-digit',
                    typeId: 5,
                    label: this.state.lang ? 'ID Card last 4 digits' : 'รหัสบัตรประชาชน 4 ตัวท้าย',
                    required: this.state.survey.required_id_card_4_digit,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 4,
                    cols: 6,
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 8,
                    enable: this.state.survey.enable_room_number,
                    name: 'room-number',
                    typeId: 5,
                    label: this.state.lang ? 'Room Number' : 'หมายเลขห้อง',
                    required: this.state.survey.required_room_number,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 10,
                    cols: 15,
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 9,
                    enable: this.state.survey.enable_institution_name,
                    name: 'institution-name',
                    typeId: 7,
                    label: this.state.lang ? 'Institution Name' : 'ชื่อสถาบัน',
                    required: this.state.survey.required_institution_name,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    lang: this.state.lang
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 10,
                    enable: this.state.survey.enable_project_name,
                    name: 'project-name',
                    typeId: 8,
                    label: this.state.lang ? 'Project Name' : 'ชื่อโครงการ',
                    required: this.state.survey.required_project_name,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    lang: this.state.lang
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 11,
                    enable: this.state.survey.enable_company_name,
                    name: 'company-name',
                    typeId: 5,
                    label: this.state.lang ? 'Company Name' : 'ชื่อบริษัท',
                    required: this.state.survey.required_company_name,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 100,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 12,
                    enable: this.state.survey.enable_department,
                    name: 'department',
                    typeId: 5,
                    label: this.state.lang ? 'Department' : 'แผนก',
                    required: this.state.survey.required_department,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 100,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 13,
                    enable: this.state.survey.enable_position,
                    name: 'position',
                    typeId: 5,
                    label: this.state.lang ? 'Position' : 'ตำแหน่ง',
                    required: this.state.survey.required_position,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    maxLength: 100,
                    cols: 50
                },
                {
                    globalFont: this.state.survey.global_font_family,
                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                    index: 14,
                    enable: this.state.survey.enable_consent_date,
                    name: 'consent-date',
                    typeId: 9,
                    label: this.state.lang ? 'Consent Date' : 'วันที่ยินยอม',
                    required: this.state.survey.required_consent_date,
                    requiredLabel: this.state.lang ? 'This question requires an answer.' : 'กรุณาให้คำตอบ',
                    lang: this.state.lang
                },
            ];

            // console.log(`infoQuestions`, infoQuestions);

            allInfoElement = infoQuestions.map((infoQuestion: any, i: number) => this.getInfoQuestionRow(infoQuestion, this.state.requiredLabelStatusInfo[i], this.state.answerInfo[i]));
            nodeInfoElement = await Promise.all(allInfoElement);

            // console.log(`after nodeInfoElement`, nodeInfoElement);
        }

        this.setState({ isLoading: false, isSuccessLoading: true }, () => {
            ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('question-items-list'));
            if(this.state.survey.client_info_form) ReactDOM.render(<div>{nodeInfoElement}</div>, document.getElementById('question-info-list'));
            if(scrollTo !== false) this.container.scrollTop = scrollTo;
            // ReactDOM.render(<div>{this.state.submitButtonElement}</div>, document.getElementById('question-submit-button'));
        });
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

    getPageNo = async (surveyId: any, i: any) => {
        // console.log ("getPageElementRenderIndex question no." + i);
        
        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/client/', surveyId + '/' + i + `?re=${this.state.RecaptchaResponse}`).then(
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `preview getPageNo BaseService.get<Question> /question/${surveyId}/${i} rp.Data.recordset.length else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `preview getPageNo BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'preview getPageNo catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getQuestionRow = async (surveyId: any, i: any, disable: any, skipLogicText: any, showCommentFieldStatus: any, showConsentSection: any, requiredLabelStatus: any, currentAnswer: any, currentComment: any, currentSignature: any, currentConsent: any) => {
        // console.log (`question no.${i} answer = `, currentAnswer);

        const index = i-1;  

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/client/', surveyId + '/' + i + `?re=${this.state.RecaptchaResponse}`).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                        // console.log(`get question ${i}`, rp.Messages);
                        // console.log(`get question ${i}`, rp.Data);
                        // console.log(`get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length === 1){

                            const question = rp.Data.recordset[0];
                            
                            const questionNo = question.order_no;
                            const questionId = question.id[0];
                            const questionTypeId = question.type_id;
                            const questionSubTypeId = question.sub_type_id;

                            const questionLabel = this.state.lang ? question.question_label_EN : question.question_label;
                            const questionLabelHtml = this.state.lang ? ( question.question_label_EN_html ? question.question_label_EN_html : `<p>${questionLabel}</p>` ) : ( question.question_label_html ? question.question_label_html : `<p>${questionLabel}</p>`);
                            const questionActive = question.active;

                            const questionRequired = question.required;
                            const questionRequiredLabel = this.state.lang ? (question.required_label_EN ? question.required_label_EN : question.required_label) : question.required_label;
                            const questionRequiredLabelHtml = this.state.lang ? ( question.required_label_EN_html ? question.required_label_EN_html : ( question.required_label_html ? question.required_label_html : `<p>${questionRequiredLabel}</p>` )) : ( question.required_label_html ? question.required_label_html : `<p>${questionRequiredLabel}</p>` );

                            const questionAnalyzeEntity = question.analyze_entity;
                            const questionAnalyzeSentiment = question.analyze_sentiment;

                            let questionSkipLogic = null;
                            if(question.skip_logic) questionSkipLogic =  question.skip_logic.includes(',') ? question.skip_logic.split(',') : null;

                            const questionShowCommentField = question.show_comment_field;
                            const questionCommentFieldLabel = this.state.lang ? (question.comment_field_label_EN ? question.comment_field_label_EN : question.comment_field_label) : question.comment_field_label;
                            const questionCommentFieldLabelHtml = this.state.lang ? (question.comment_field_label_EN_html ? question.comment_field_label_EN_html : (question.comment_field_label_html ? question.comment_field_label_html : `<p>${questionCommentFieldLabel}</p>`)) : (question.comment_field_label_html ? question.comment_field_label_html : `<p>${questionCommentFieldLabel}</p>`);
                            const questionCommentFieldHint = this.state.lang ? (question.comment_field_hint_EN ? question.comment_field_hint_EN : question.comment_field_hint) : question.comment_field_hint;
                            const questionCommentFieldHintHtml = this.state.lang ? (question.comment_field_hint_EN_html ? question.comment_field_hint_EN_html : (question.comment_field_hint_html ? question.comment_field_hint_html : `<p>${questionCommentFieldHint}</p>`)) : (question.comment_field_hint_html ? question.comment_field_hint_html : `<p>${questionCommentFieldHint}</p>`);
                            
                            const questionShowCommentFieldWhenAnswers = question.show_comment_when_answer;
                            
                            const questionShowConsentSection = question.enable_consent;
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

                            let questionIdArr = this.state.questionId;
                            questionIdArr[index] = questionId;

                            let questionTypeIdArr = this.state.questionTypeId;
                            questionTypeIdArr[index] = questionTypeId;

                            let questionRequiredArr = this.state.questionRequired;
                            questionRequiredArr[index] = questionRequired ? true : false;

                            let questionAnalyzeEntityArr = this.state.questionAnalyzeEntity;
                            questionAnalyzeEntityArr[index] = questionAnalyzeEntity;

                            let questionAnalyzeSentimentArr = this.state.questionAnalyzeSentiment;
                            questionAnalyzeSentimentArr[index] = questionAnalyzeSentiment;

                            let questionShowCommentFieldWhenAnswersArr = this.state.questionShowCommentFieldWhenAnswers;
                            questionShowCommentFieldWhenAnswersArr[index] = questionShowCommentFieldWhenAnswers;
                            
                            this.setState({
                                questionId: questionIdArr,
                                questionTypeId: questionTypeIdArr,
                                questionRequired: questionRequiredArr,
                                questionAnalyzeEntity: questionAnalyzeEntityArr,
                                questionAnalyzeSentiment: questionAnalyzeSentimentArr,
                                questionShowCommentFieldWhenAnswers: questionShowCommentFieldWhenAnswersArr,
                                // htmlElRef: htmlElRefArr,
                            },  () => { 
                                    // console.log(`after questionId`, this.state.questionId);
                                    // console.log(`after questionTypeId`, this.state.questionTypeId);
                                    // console.log(`after questionRequired`, this.state.questionRequired);
                                    // console.log(`after questionAnalyzeEntity`, this.state.questionAnalyzeEntity);
                                    // console.log(`after questionAnalyzeSentiment`, this.state.questionAnalyzeSentiment);
                                    // console.log(`after questionShowCommentFieldWhenAnswers`, this.state.questionShowCommentFieldWhenAnswers);
                                    // console.log(`after htmlElRef`, this.state.htmlElRef);
                                } 
                            );

                            //Star Rating & Multiple choice variables
                            let choices = [] as any;
                            let choicesHtml = [] as any;
                            let weights = [] as any;

                            let weightAnswer = [] as any;
                            let toPage = [] as any;
                            let toQuestion = [] as any;

                            //NPS variables 
                            let weightAnswerFrom = [] as any;
                            let weightAnswerTo = [] as any;

                            //image variables 
                            const questionImageEnabled = question.image_enabled ? question.image_enabled : '';
                            const questionImageType = question.image_src_type ? question.image_src_type.split(',') : '';
                            const questionImageName = question.image_name ? question.image_name.split(',') : '';
                            // const questionImageNameHtml = question.image_name_html ? question.image_name_html.split('~') : '<p></p>';
                            const questionImageNameHtml = question.image_name_html ? question.image_name_html.split('~') : (question.image_name ? question.image_name.split(',').map((name: any) => { return `<p>${name}</p>`; } ) : '<p></p>');
                            const questionImageSrc = question.image_src ? question.image_src.split(',') : '';
                            const questionImageDesc = question.image_description ? question.image_description.split(',') : '';
                            
                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6 ){
                                
                                // const questionChoice = question.choice.split(',');
                                // const questionChoiceHtml = question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; });
                                // const questionChoiceEN = question.choice_EN ? question.choice_EN.split(',') : question.choice.split(',');
                                // const questionChoiceENHtml = question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_EN ? question.choice_EN.split(',').map((choice_EN: any) => { return `<p>${choice_EN}</p>`; }) : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) ) );

                                const questionChoice = this.state.lang ? question.choice_EN.split(',') : question.choice.split(',');
                                // const questionChoiceHtml = this.state.lang ? ( question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) )) : (question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }));
                                const questionChoiceHtml = this.state.lang ? ( question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_EN ? question.choice_EN.split(',').map((choice_EN: any) => { return `<p>${choice_EN}</p>`; }) : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) ) ) ) : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) );
                                // console.log(`get question ${i} choice = `, questionChoice);

                                choices = [] as any;
                                choicesHtml = [] as any;
                                weights = [] as any;
                                for(let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                        choicesHtml.push(questionChoiceHtml[i]);
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
                                let skipLogicArr = this.state.skipLogic;

                                if( (!disableSkipLogicPage && !disableSkipLogicQuestion) ||
                                    (!disableSkipLogicPage && toPage.indexOf(-1) > -1) ){//End of survey
                                    skipLogicStatusArr[index] = true;
                                    skipLogicArr[index] = questionSkipLogic;
                                }

                                this.setState({
                                    skipLogicStatus: skipLogicStatusArr,
                                    skipLogic: skipLogicArr
                                },  () => { 
                                        // console.log(`after get question ${i} skip logic statue`, this.state.skipLogicStatus);
                                        // console.log(`after get question ${i} skip logic`, this.state.skipLogic);
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
                                let skipLogicArr = this.state.skipLogic;
                                
                                if( (!disableSkipLogicPage && !disableSkipLogicQuestion) ||
                                    (!disableSkipLogicPage && toPage.indexOf(-1) > -1) ){//End of survey
                                    skipLogicStatusArr[index] = true;
                                    skipLogicArr[index] = questionSkipLogic;
                                }

                                this.setState({
                                    skipLogicStatus: skipLogicStatusArr,
                                    skipLogic: skipLogicArr
                                },  () => { 
                                        // console.log(`after get question ${i} skip logic statue`, this.state.skipLogicStatus);
                                        // console.log(`after get question ${i} skip logic`, this.state.skipLogic);
                                    } 
                                );
                            }
                                        
                            // console.log(`get question ${i} element`);

                            let element: any;
                            //get a question just 1 time and wait for the process
                            //Star Rating

                            if(questionTypeId === 1){

                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    subTypeId: questionSubTypeId,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                    showCommentField: questionShowCommentField,
                                    commentFieldLabel: questionCommentFieldLabel,
                                    commentFieldLabelHtml: questionCommentFieldLabelHtml,
                                    commentFieldHint: questionCommentFieldHint,
                                    commentFieldHintHtml: questionCommentFieldHintHtml,
                                    emojiShape: question.shape,
                                    emojiColor: question.color,
                                    showLabel: question.show_label,
                                    isMobile: this.state.isMobile
                                }

                                return <RatingQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-rating-'+i} question={questionObj} answerHandler={this.answerHandler} commentHandler={this.commentHandler} disable={disable} skipLogicText={skipLogicText} showCommentFieldStatus={showCommentFieldStatus} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} comment={currentComment} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 2){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    weights: weights,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                    showCommentField: questionShowCommentField,
                                    commentFieldLabel: questionCommentFieldLabel,
                                    commentFieldLabelHtml: questionCommentFieldLabelHtml,
                                    commentFieldHint: questionCommentFieldHint,
                                    commentFieldHintHtml: questionCommentFieldHintHtml,
                                }
                                return <ChoiceQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-choice-'+i} question={questionObj} answerHandler={this.answerHandler} commentHandler={this.commentHandler} disable={disable} skipLogicText={skipLogicText} showCommentFieldStatus={showCommentFieldStatus} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} comment={currentComment} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 3){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    weights: weights,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                    showCommentField: questionShowCommentField,
                                    commentFieldLabel: questionCommentFieldLabel,
                                    commentFieldLabelHtml: questionCommentFieldLabelHtml,
                                    commentFieldHint: questionCommentFieldHint,
                                    commentFieldHintHtml: questionCommentFieldHintHtml,
                                    limitSelection: question.limit_selection,
                                    limitMin: question.limit_min,
                                    limitMax: question.limit_max,
                                    showConsentSection: questionShowConsentSection,
                                }
                                return <CheckboxQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-checkbox-'+i} question={questionObj} answerHandler={this.answerHandler} commentHandler={this.commentHandler} signatureHandler={this.signatureHandler} consentHandler={this.consentHandler} disable={disable} skipLogicText={skipLogicText} showCommentFieldStatus={showCommentFieldStatus} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} comment={currentComment} signature={currentSignature} consent={currentConsent} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 4){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    subTypeId: questionSubTypeId,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    lowScoreLabel: this.state.lang ? question.low_score_label_EN : question.low_score_label,
                                    highScoreLabel: this.state.lang ? question.high_score_label_EN : question.high_score_label,
                                    lowScoreLabelHtml: this.state.lang ? ( question.low_score_label_EN_html ? question.low_score_label_EN_html : (question.low_score_label_EN ? `<p>${question.low_score_label_EN}</p>` : '<p></p>') ) : ( question.low_score_label_html ? question.low_score_label_html : (question.low_score_label ? `<p>${question.low_score_label}</p>` : '<p></p>') ),
                                    highScoreLabelHtml: this.state.lang ? ( question.high_score_label_EN_html ? question.high_score_label_EN_html : (question.high_score_label_EN ? `<p>${question.high_score_label_EN}</p>` : '<p></p>') ) : ( question.high_score_label_html ? question.high_score_label_html : (question.high_score_label ? `<p>${question.high_score_label}</p>` : '<p></p>') ),
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                    showCommentField: questionShowCommentField,
                                    commentFieldLabel: questionCommentFieldLabel,
                                    commentFieldLabelHtml: questionCommentFieldLabelHtml,
                                    commentFieldHint: questionCommentFieldHint,
                                    commentFieldHintHtml: questionCommentFieldHintHtml,
                                    showLabel: question.show_label,
                                }
                                return <ScoreQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-score-'+i} question={questionObj} answerHandler={this.answerHandler} commentHandler={this.commentHandler} disable={disable} skipLogicText={skipLogicText} showCommentFieldStatus={showCommentFieldStatus} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} comment={currentComment} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 5){
                                const questionHint = this.state.lang ? question.hint_EN : question.hint;
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    hint: questionHint,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                }
                                return <TextQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-text-'+i} question={questionObj} answerHandler={this.answerHandler} disable={disable} skipLogicText={skipLogicText} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 6){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    no: questionNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    weights: weights,
                                    imageEnabled: questionImageEnabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                    showCommentField: questionShowCommentField,
                                    commentFieldLabel: questionCommentFieldLabel,
                                    commentFieldLabelHtml: questionCommentFieldLabelHtml,
                                    commentFieldHint: questionCommentFieldHint,
                                    commentFieldHintHtml: questionCommentFieldHintHtml,
                                }
                                return <DropdownQuestion ref={(ref) => { let htmlElRefArr = this.state.htmlElRef; htmlElRefArr[index] = ref; this.setState({ htmlElRef: htmlElRefArr }); }} key={'question-choice-'+i} question={questionObj} answerHandler={this.answerHandler} commentHandler={this.commentHandler} disable={disable} skipLogicText={skipLogicText} showCommentFieldStatus={showCommentFieldStatus} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} comment={currentComment} history={this.props.history} match={this.props.match}/>
                            }

                            // console.log(`got question ${i} element`, element);
                            return element;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return <div key={index}></div>;
                        }

                    } else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `preview getQuestionRow BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return <div key={index}></div>;
                    }
                } catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `preview getQuestionRow catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    getInfoQuestionRow = async (question: any, requiredLabelStatus: any, currentAnswer: any) => {
        let element: any;
        if(question.typeId === 5 && question.enable){
            // const questionHint = this.state.lang ? question.hint_EN : question.hint;
            return <InfoTextQuestion ref={(ref) => { let htmlElRefInfoArr = this.state.htmlElRefInfo; htmlElRefInfoArr[question.index] = ref; this.setState({ htmlElRefInfo: htmlElRefInfoArr }); }} key={`question-${question.name}-text`} question={question} answerInfoHandler={this.answerInfoHandler} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer}/>
        }
        else if(question.typeId === 6 && question.enable){
            return <InfoDropdownQuestion ref={(ref) => { let htmlElRefInfoArr = this.state.htmlElRefInfo; htmlElRefInfoArr[question.index] = ref; this.setState({ htmlElRefInfo: htmlElRefInfoArr }); }} key={`question-${question.name}-choice`} question={question} answerInfoHandler={this.answerInfoHandler} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} fontStyles={{fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size}} history={this.props.history} match={this.props.match}/>
        }
        else if(question.typeId === 7 && question.enable){
            return <InfoDropdownInstitutionQuestion ref={(ref) => { let htmlElRefInfoArr = this.state.htmlElRefInfo; htmlElRefInfoArr[question.index] = ref; this.setState({ htmlElRefInfo: htmlElRefInfoArr }); }} key={`question-${question.name}-choice`} question={question} answerInfoHandler={this.answerInfoHandler} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} fontStyles={{fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size}} history={this.props.history} match={this.props.match}/>
        }
        else if(question.typeId === 8 && question.enable){
            return <InfoDropdownProjectQuestion ref={(ref) => { let htmlElRefInfoArr = this.state.htmlElRefInfo; htmlElRefInfoArr[question.index] = ref; this.setState({ htmlElRefInfo: htmlElRefInfoArr }); }} key={`question-${question.name}-choice`} question={question} answerInfoHandler={this.answerInfoHandler} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} fontStyles={{fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size}} history={this.props.history} match={this.props.match}/>
        }
        else if(question.typeId === 9 && question.enable){
            return <InfoDatePickerQuestion ref={(ref) => { let htmlElRefInfoArr = this.state.htmlElRefInfo; htmlElRefInfoArr[question.index] = ref; this.setState({ htmlElRefInfo: htmlElRefInfoArr }); }} key={`question-${question.name}-choice`} question={question} answerInfoHandler={this.answerInfoHandler} requiredLabelStatus={requiredLabelStatus} answer={currentAnswer} fontStyles={{fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size}} history={this.props.history} match={this.props.match}/>
        }

        return element;
    }

    commentHandler(questionNo: any, comment: any){
        // console.log(`commentHandler questionNo ${questionNo} comment ${comment}`);
        
        const index = questionNo-1;

        let commentArr = this.state.comment;
        commentArr[index] = comment;

        this.setState({
            comment: commentArr
        },  () => { 
                // console.log(`commentHandler comment`, this.state.comment);
            } 
        );
    }

    signatureHandler(questionNo: any, signature: any){
        // console.log(`signatureHandler questionNo ${questionNo} signature ${signature}`);
        
        const index = questionNo-1;

        let signatureArr = this.state.signature;
        signatureArr[index] = signature;

        this.setState({
            signature: signatureArr
        },  () => { 
                // console.log(`signatureHandler signature`, this.state.signature);
            } 
        );
    }

    consentHandler(questionNo: any, consent: any){
        // console.log(`consentHandler questionNo ${questionNo} consent ${consent}`);
        
        const index = questionNo-1;

        let consentArr = this.state.consent;
        consentArr[index] = consent;

        this.setState({
            consent: consentArr
        },  () => { 
                // console.log(`consentHandler consent`, this.state.consent);
            } 
        );
    }

    onChangeTextHandler = (e : any) => {
        // console.log(`change text currentTarget id ${e.currentTarget.id} e.currentTarget.value ${e.currentTarget.value}`);
        if(e.currentTarget.id === 'question-first-name-text' ) this.answerInfoHandler(1, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_first_name);
        else if(e.currentTarget.id === 'question-last-name-text' ) this.answerInfoHandler(2, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_last_name);
        else if(e.currentTarget.id === 'question-birthdate-text' ) this.answerInfoHandler(3, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_birthdate);
        else if(e.currentTarget.id === 'question-mobile-number-text' ) this.answerInfoHandler(4, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_mobile_number);
        else if(e.currentTarget.id === 'question-email-text' ) this.answerInfoHandler(5, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_email);
        else if(e.currentTarget.id === 'question-line-id-text' ) this.answerInfoHandler(6, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_line_id);
        else if(e.currentTarget.id === 'question-id-card-4-digit-text' ) this.answerInfoHandler(7, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_id_card_4_digit);
        else if(e.currentTarget.id === 'question-room-number-text' ) this.answerInfoHandler(8, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_room_number);
        else if(e.currentTarget.id === 'question-institution-name-dropdown-option' ) this.answerInfoHandler(9, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_institution_name);
        else if(e.currentTarget.id === 'question-project-name-dropdown-option' ) this.answerInfoHandler(10, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_project_name);
        else if(e.currentTarget.id === 'question-company-name-text' ) this.answerInfoHandler(11, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_company_name);
        else if(e.currentTarget.id === 'question-department-text' ) this.answerInfoHandler(12, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_department);
        else if(e.currentTarget.id === 'question-position-text' ) this.answerInfoHandler(13, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_position);
        else if(e.currentTarget.id === 'question-consent-date-text' ) this.answerInfoHandler(14, e.currentTarget.value,  !e.currentTarget.value && this.state.survey.required_consent_date);
    }

    answerInfoHandler(index: any, answer: any, requiredStatus: any){

        // console.log(`answerInfoHandler Index ${index} Answer ${answer}`);
        
        let answerInfoArr = this.state.answerInfo;
        answerInfoArr[index] = answer;

        let requiredLabelStatusInfoArr = this.state.requiredLabelStatusInfo;
        requiredLabelStatusInfoArr[index] = requiredStatus;

        this.setState({
            answerInfo: answerInfoArr,
            requiredLabelStatusInfo: requiredLabelStatusInfoArr
        },  () => { 
                // console.log(`answerInfoHandler answerInfo`, this.state.answerInfo);
                // console.log(`answerInfoHandler requiredLabelStatusInfo`, this.state.requiredLabelStatusInfo);
            } 
        );
    }

    onMouseClickDropdownOptionHandler = (e : any) => {
        try{
            // console.log('preview click Dropdown Option target', e.target);
            // console.log('preview click Dropdown Option target id', e.target.id);
            // console.log('preview click Dropdown Option target value', e.target.value);

            const value = e.target.value;

            // console.log('click Dropdown value', value);
            this.answerInfoHandler(0, value ? value : '', !value && this.state.survey.required_name_title);

        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `preview-client-survey.component onMouseClickDropdownOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    answerHandler(questionNo: any, answer: any, requiredStatus: any){

        // console.log(`answerHandler questionNo ${questionNo} Answer ${answer}`);
        
        const index = questionNo-1;

        // console.log(`answerHandler questionNo ${questionNo} this.state.questionShowCommentFieldWhenAnswers[${index}]`, this.state.questionShowCommentFieldWhenAnswers[index]);

        let answerArr = this.state.answer;
        answerArr[index] = answer;

        let requiredLabelStatusArr = this.state.requiredLabelStatus;
        requiredLabelStatusArr[index] = requiredStatus;

        let tmpSum = 0;
        for (const element of answerArr) {
            if(element){
                tmpSum++;
                this.setState({ sumAnswer: this.state.sumAnswer+1 })
            }
        }
        this.setState({ sumAnswer: tmpSum })

        //NO skip logic and show comment field setting on this question
        if(!this.state.skipLogic[index] && !this.state.questionShowCommentFieldWhenAnswers[index]){
            this.setState({
                answer: answerArr,
                requiredLabelStatus: requiredLabelStatusArr
            },  () => { 
                    // console.log(`answerHandler answer`, this.state.answer);
                    // console.log(`answerHandler requiredLabelStatus`, this.state.requiredLabelStatus);
                } 
            );
            return;
        }

        //prepare variable
        let disableArr = this.state.disableElement;
        let skipLogicTextArr = this.state.skipLogicText;
        let showCommentFieldStatusArr = this.state.showCommentFieldStatus;

        //skip logic
        if(this.state.skipLogic[index]){

            //rating and multiple choice
            let weightAnswers = [] as any;
            let toPage = [] as any;
            let toQuestion = [] as any;
            
            //NPS variables 
            let weightAnswersFrom = [] as any;
            let weightAnswersTo = [] as any;

            const questionSkipLogic = this.state.skipLogic[index];

            const disableSkipLogicPage = toPage.every((item: any) => toPage.indexOf(item) === 0 && item === 0);
            const disableSkipLogicQuestion = toQuestion.every((item: any) => toQuestion.indexOf(item) === 0 && item === 0);

            // console.log(`get skip logic ${index} weightAnswers = `, weightAnswers);
            // console.log(`get skip logic ${index} weightAnswersFrom = `, weightAnswersFrom);
            // console.log(`get skip logic ${index} weightAnswersTo = `, weightAnswersTo);
            // console.log(`get skip logic ${index} toPage = `, toPage);
            // console.log(`get skip logic ${index} toQuestion = `, toQuestion);

            // console.log(`get skip logic ${index} toPage.every = `, disableSkipLogicPage);
            // console.log(`get skip logic ${index} toQuestion.every = `, disableSkipLogicQuestion);

            // if(answer === ''){
                //clear all disable element at first
                for(let j = index+1; j < this.state.numQuestion; j++) {
                    disableArr[j] = false;
                }
            //   // console.log(`if answer === ''`, disableArr);

            // }
            if(this.state.questionTypeId[index] === 1 || this.state.questionTypeId[index] === 2 || this.state.questionTypeId[index] === 6){
                        
                //get skip logic
                weightAnswers = [] as any;
                toPage = [] as any;
                toQuestion = [] as any;
                for(let i = 0; i < questionSkipLogic.length; i++) {
                    if (i % 3 === 0) {
                        weightAnswers.push(parseInt(questionSkipLogic[i]));
                    } 
                    else if (i % 3 === 1) {
                        toPage.push(parseInt(questionSkipLogic[i]));
                    }
                    else {
                        toQuestion.push(parseInt(questionSkipLogic[i]));
                    }
                }

                weightAnswers.forEach((weightAnswer: any, i: any) => {
                    // console.log(`item ${i}`, weightAnswer);
                    if(parseInt(answer) === parseInt(weightAnswer)){
                        // console.log(`in if ${i} weightAnswer = `, weightAnswer);
                        // console.log(`in if ${i} toPage = `, toPage[i]);
                        // console.log(`in if ${i} toQuestion = `, toQuestion[i]);

                        //End of survey
                        if(toPage[i] === -1){
                            // console.log(`in if toPage -1, this.state.numQuestion`, this.state.numQuestion);
                            for(let k = index+1; k < this.state.numQuestion; k++) {
                                disableArr[k] = true;
                                skipLogicTextArr[k] = `โปรดข้ามไปส่วนสุดท้ายของแบบสอบถาม (กดปุ่มส่งแบบสอบถามเพื่อยืนยันคำตอบ)`;
                            }
                        }
                        //if set skip logic for this weight answer
                        else if(toPage[i] !== 0 && toQuestion[i] !== 0){

                            //clear disable question below this question no. 
                            for(let j = index+1; j < this.state.numQuestion; j++) { 
                                disableArr[j] = false; 
                            }

                            //set disable question element until the specific question no.
                            for(let k = index+1; k < toQuestion[i]-1; k++) {
                                disableArr[k] = true;
                                skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${toQuestion[i]}.`;
                            }

                            // console.log(`if weightAnswer.forEach`, disableArr);
                            return;
                        }
                        else{//no set skip logic for this weight answer
                            for(let j = index+1; j < this.state.numQuestion; j++) {
                                disableArr[j] = false;
                            }
                            // console.log(`else weightAnswer.forEach`, disableArr);
                            return;
                        }
                        
                    }
                });
                
            }
            else if(this.state.questionTypeId[index] === 3){
                        
                //get skip logic
                weightAnswers = [] as any;
                toPage = [] as any;
                toQuestion = [] as any;
                for(let i = 0; i < questionSkipLogic.length; i++) {
                    if (i % 3 === 0) {
                        weightAnswers.push(parseInt(questionSkipLogic[i]));
                    } 
                    else if (i % 3 === 1) {
                        toPage.push(parseInt(questionSkipLogic[i]));
                    }
                    else {
                        toQuestion.push(parseInt(questionSkipLogic[i]));
                    }
                }

                const answers = answer.includes(',') ? answer.split(',') : [answer];
                // console.log(`get answers ${index} answers = `, answers);

                const skipPageNoArr = [] as any;
                const skipQustionNoArr = [] as any;

                weightAnswers.forEach((weightAnswer: any, i: any) => {
                    // console.log(`item ${i} weightAnswer`, weightAnswer);

                    for(let ansIndex = 0; ansIndex < answers.length; ansIndex++) {

                        // console.log(`in for ansIndex ${ansIndex} answers[ansIndex] = `, answers[ansIndex]);
                        // console.log(`in for ${i} weightAnswer = `, weightAnswer);

                        if(parseInt(answers[ansIndex]) === parseInt(weightAnswer)){
                            // console.log(`in if ${i} toPage = `, toPage[i]);
                            // console.log(`in if ${i} toQuestion = `, toQuestion[i]);

                            //add this question no. to array for the second step

                            //add this page no. and question no. to array for the second step
                            skipPageNoArr.push(toPage[i]);
                            skipQustionNoArr.push(toQuestion[i]);
                            return;

                            // //if set skip logic for this weight answer
                            // if(toPage[i] !== 0 && toQuestion[i] !== 0){

                            //     //clear disable question below this question no. 
                            //     for(let j = index+1; j < this.state.numQuestion; j++) { 
                            //         disableArr[j] = false; 
                            //     }

                            //     //set disable question element until the specific question no.
                            //     for(let k = index+1; k < toQuestion[i]-1; k++) {
                            //         disableArr[k] = true;
                            //         skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${toQuestion[i]}.`;
                            //     }

                            //   // console.log(`if weightAnswer.forEach`, disableArr);
                            //     return;
                            // }
                            // else{//no set skip logic for this weight answer
                            //     for(let j = index+1; j < this.state.numQuestion; j++) {
                            //         disableArr[j] = false;
                            //     }
                            //   // console.log(`else weightAnswer.forEach`, disableArr);
                            //     return;
                            // }
                            
                        }
                    }

                });

                //the second step
                // console.log('skipPageNoArr', skipPageNoArr);
                // const skipPageNoArrSort = skipPageNoArr.sort();
                // console.log('skipPageNoArrSort', skipPageNoArrSort);
                // const minPageNo = Math.min(...skipPageNoArr);
                // console.log('minPageNo', minPageNo);

                // console.log('skipQustionNoArr', skipQustionNoArr);
                // const skipQustionNoArrSort = skipQustionNoArr.sort();
                // console.log('skipQustionNoArrSort', skipQustionNoArrSort);
                const minQustionNo = Math.min(...skipQustionNoArr);
                // console.log('minQustionNo', minQustionNo);

                // let countFilterRemove = 0;
                // const PageNoArrSortFilter = skipPageNoArrSort.filter((pageNo: any) => { countFilterRemove++; return pageNo !== -1; });
                // console.log(`PageNoArrSortFilter`, PageNoArrSortFilter);

                // const skipQustionNoArrSortFilter = skipQustionNoArrSort.map((questionNo: any, index: any) => { if(index < countFilterRemove) return questionNo; });
                // console.log(`skipQustionNoArrSortFilter`, skipQustionNoArrSortFilter);

                // //check need to have some value in the minQustionNo array
                // if(minPageNo.length){
                //     //clear disable question below this question no. 
                //     for(let j = index+1; j < this.state.numQuestion; j++) { 
                //         disableArr[j] = false; 
                //     }

                //     //set disable question element until the specific question no.
                //     for(let k = index+1; k < minQustionNo-1; k++) {
                //         disableArr[k] = true;
                //         skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${minQustionNo}.`;
                //     }
                // }

                //check need to have some value in the minQustionNo array
                if(skipQustionNoArr.length){

                    //clear disable question below this question no. 
                    for(let j = index+1; j < this.state.numQuestion; j++) { 
                        disableArr[j] = false; 
                    }

                    if(skipPageNoArr.indexOf(-1) === -1){//No End of survey
                        //set disable question element until the specific question no.
                        for(let k = index+1; k < minQustionNo-1; k++) {
                            disableArr[k] = true;
                            skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${minQustionNo}.`;
                        }
                    }
                    else{//End of survey
                        for(let k = index+1; k < this.state.numQuestion; k++) {
                            disableArr[k] = true;
                            skipLogicTextArr[k] = `โปรดข้ามไปส่วนสุดท้ายของแบบสอบถาม (กดปุ่มส่งแบบสอบถามเพื่อยืนยันคำตอบ)`;
                        }
                        // if(skipPageNoArr.length > 1){//More then one choice checked
                        //     //skip to the first question no. which is not 0
                        //     console.log(`skipQustionNoArrSortFilter[0]`, skipQustionNoArrSortFilter[0]);
                        //     for(let k = index+1; k < skipQustionNoArrSortFilter[0]-1; k++) {
                        //         disableArr[k] = true;
                        //         skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${skipQustionNoArrSortFilter[0]}.`;
                        //     }
                        // }
                        // else{//Only one choice checked
                        //     for(let k = index+1; k < this.state.numQuestion; k++) {
                        //         disableArr[k] = true;
                        //         skipLogicTextArr[k] = `โปรดข้ามไปส่วนสุดท้ายของแบบสอบถาม (กดปุ่มส่งแบบสอบถามเพื่อยืนยันคำตอบ)`;
                        //     }
                        // }
                    }
                }
                
            }
            else if(this.state.questionTypeId[index] === 4){

                //get skip logic
                weightAnswersFrom = [] as any;
                weightAnswersTo = [] as any;
                toPage = [] as any;
                toQuestion = [] as any;
                for(let i = 0; i < questionSkipLogic.length; i++) {
                    if (i % 4 === 0) {
                        weightAnswersFrom.push(parseInt(questionSkipLogic[i]));
                    } 
                    else if (i % 4 === 1) {
                        weightAnswersTo.push(parseInt(questionSkipLogic[i]));
                    }
                    else if (i % 4 === 2) {
                        toPage.push(parseInt(questionSkipLogic[i]));
                    }
                    else {
                        toQuestion.push(parseInt(questionSkipLogic[i]));
                    }
                }
                
                //check each answer with skip logic
                weightAnswersFrom.forEach((weightAnswerFrom: any, i: any) => {
                    // console.log(`item ${i}`, weightAnswerFrom);
                    
                    if(answer >= weightAnswerFrom && answer <= weightAnswersTo[i]){
                        // console.log(`in if ${i} weightAnswerFrom = `, weightAnswerFrom);
                        // console.log(`in if ${i} weightAnswerTo = `, weightAnswersTo[i]);
                        // console.log(`in if ${i} toPage = `, toPage[i]);
                        // console.log(`in if ${i} toQuestion = `, toQuestion[i]);

                        //End of survey
                        if(toPage[i] === -1){
                            // console.log(`in if toPage -1, this.state.numQuestion`, this.state.numQuestion);
                            for(let k = index+1; k < this.state.numQuestion; k++) {
                                disableArr[k] = true;
                                skipLogicTextArr[k] = `โปรดข้ามไปส่วนสุดท้ายของแบบสอบถาม (กดปุ่มส่งแบบสอบถามเพื่อยืนยันคำตอบ)`;
                            }
                        }
                        //if set skip logic for this weight answer
                        else if(toPage[i] !== 0 && toQuestion[i] !== 0){

                            //clear disable question below this question no. 
                            for(let j = index+1; j < this.state.numQuestion; j++) { 
                                disableArr[j] = false; 
                            }

                            //set disable question element until the specific question no.
                            for(let k = index+1; k < toQuestion[i]-1; k++) {
                                disableArr[k] = true;
                                skipLogicTextArr[k] = `โปรดข้ามไปยังข้อ ${toQuestion[i]}.`;
                            }

                            // console.log(`if weightAnswerFrom.forEach`, disableArr);
                            return;
                        }
                        else{//no set skip logic for this weight answer
                            for(let j = index+1; j < this.state.numQuestion; j++) {
                                disableArr[j] = false;
                            }
                            // console.log(`else weightAnswerFrom.forEach`, disableArr);
                            return;
                        }
                        
                    }
                });

            }

        }

        //question show comment field when answers
        if(this.state.questionShowCommentFieldWhenAnswers[index]){

            // console.log(`get questionShowCommentFieldWhenAnswers ${index}`, this.state.questionShowCommentFieldWhenAnswers[index]);

            const questionShowCommentFieldWhenAnswers = this.state.questionShowCommentFieldWhenAnswers[index].includes(',') ? this.state.questionShowCommentFieldWhenAnswers[index].split(',') : [ this.state.questionShowCommentFieldWhenAnswers[index] ];
            // console.log(`get questionShowCommentFieldWhenAnswers ${index} answers = `, questionShowCommentFieldWhenAnswers);

            showCommentFieldStatusArr[index] = false;

            if(this.state.questionTypeId[index] === 1 || this.state.questionTypeId[index] === 2 || this.state.questionTypeId[index] === 6){

                questionShowCommentFieldWhenAnswers.forEach((whenAnswer: any, i: any) => {
                    // console.log(`item ${i}`, parseInt(whenAnswer));
                    // console.log(`answer`, parseInt(answer));
                    if(parseInt(answer) === parseInt(whenAnswer)){
                        // console.log(`in if ${i} whenAnswer = `, whenAnswer);
                        showCommentFieldStatusArr[index] = true;
                        return;
                    }
                });

            }
            else if(this.state.questionTypeId[index] === 3 && answer !== ''){
                        
                // const answers = answer.split(',');
                const answers = answer.includes(',') ? answer.split(',') : [answer];
                // console.log(`get answers ${index} answers = `, answers);

                questionShowCommentFieldWhenAnswers.forEach((whenAnswer : any, i: any) => {
                    // console.log(`item ${i}`, whenAnswer);
                    for(let ansIndex = 0; ansIndex < answers.length; ansIndex++) {
                        if(answers[ansIndex] === whenAnswer){
                            // console.log(`in if ${i} whenAnswer = `, whenAnswer);
                            showCommentFieldStatusArr[index] = true;
                            return;
                        }
                    }
                });
                
            }
            else if(this.state.questionTypeId[index] === 4 && answer !== ''){
                
                // console.log(`in if ${index} answer = `, answer);
                // console.log(`in if ${index} answer !== '' :`, answer !== '');

                // if(
                //     ( 
                //       answer >= parseInt(questionShowCommentFieldWhenAnswers[0]) && answer <= parseInt(questionShowCommentFieldWhenAnswers[1]) ||
                //       answer <= parseInt(questionShowCommentFieldWhenAnswers[0]) && answer >= parseInt(questionShowCommentFieldWhenAnswers[1]) 
                //     )
                //   )
                // {
                //     // console.log(`in if ${0} whenAnswer = `, questionShowCommentFieldWhenAnswers[0]);
                //     // console.log(`in if ${1} whenAnswer = `, questionShowCommentFieldWhenAnswers[1]);
                //     showCommentFieldStatusArr[index] = true;
                // }

                questionShowCommentFieldWhenAnswers.forEach((whenAnswer: any, i: any) => {
                    // console.log(`item ${i}`, parseInt(whenAnswer));
                    // console.log(`answer`, parseInt(answer));
                    if(parseInt(answer) === parseInt(whenAnswer)){
                        // console.log(`in if ${i} whenAnswer = `, whenAnswer);
                        showCommentFieldStatusArr[index] = true;
                        return;
                    }
                });

            }
        }

        this.setState({
            answer: answerArr,
            disableElement: disableArr,
            skipLogicText: skipLogicTextArr,
            showCommentFieldStatus: showCommentFieldStatusArr,
        },  () => { 
                // console.log(`skipLogic answer`, this.state.answer);
                // console.log(`skipLogic disable`, this.state.disableElement);
                // console.log(`skipLogic skipLogicText`, this.state.skipLogicText);
                // console.log(`showCommentFieldStatus`, this.state.showCommentFieldStatus);
                this.renderElement(false);
            } 
        );
        
    }
    
    isRequiredAnswerInfo(){

        // console.log(`isRequiredAnswerInfo`);
        // console.log(`isRequiredAnswerInfo this.state.answer`, this.state.answer);
        // console.log(`isRequiredAnswerInfo this.state.htmlElRef`, this.state.htmlElRef);
        // console.log(`isRequiredAnswerInfo this.state.disableElement`, this.state.disableElement);
        let requiredAnswer = false;
        let scrollTo = [];

        if(this.state.survey.client_info_form){
            //prepare variable
            let requiredLabelStatusInfoArr = this.state.requiredLabelStatusInfo;

            for(let i = 0; i < this.state.clientInfoNum; i++) requiredLabelStatusInfoArr[i] = false;

            if(this.state.survey.enable_name_title && this.state.survey.required_name_title && this.state.answerInfo[0] === ''){ 
                requiredLabelStatusInfoArr[0] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[0]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_first_name && this.state.survey.required_first_name && this.state.answerInfo[1] === ''){ 
                requiredLabelStatusInfoArr[1] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[1]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_last_name && this.state.survey.required_last_name && this.state.answerInfo[2] === ''){ 
                requiredLabelStatusInfoArr[2] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[2]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_birthdate && this.state.survey.required_birthdate && this.state.answerInfo[3] === ''){ 
                requiredLabelStatusInfoArr[3] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[3]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_mobile_number && this.state.survey.required_mobile_number && this.state.answerInfo[4] === ''){ 
                requiredLabelStatusInfoArr[4] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[4]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_email && this.state.survey.required_email && this.state.answerInfo[5] === ''){ 
                requiredLabelStatusInfoArr[5] = true;
                requiredAnswer = true;

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[5]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_line_id && this.state.survey.required_line_id && this.state.answerInfo[6] === ''){ 
                requiredLabelStatusInfoArr[6] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[6]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_id_card_4_digit && this.state.survey.required_id_card_4_digit && this.state.answerInfo[7] === ''){ 
                requiredLabelStatusInfoArr[7] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[7]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_room_number && this.state.survey.required_room_number && this.state.answerInfo[8] === ''){ 
                requiredLabelStatusInfoArr[8] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[8]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_institution_name && this.state.survey.required_institution_name && this.state.answerInfo[9] === ''){ 
                requiredLabelStatusInfoArr[9] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[9]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_project_name && this.state.survey.required_project_name && this.state.answerInfo[10] === ''){ 
                requiredLabelStatusInfoArr[10] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[10]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_company_name && this.state.survey.required_company_name && this.state.answerInfo[11] === ''){ 
                requiredLabelStatusInfoArr[11] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[11]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_department && this.state.survey.required_department && this.state.answerInfo[12] === ''){ 
                requiredLabelStatusInfoArr[12] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[12]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_position && this.state.survey.required_position && this.state.answerInfo[13] === ''){ 
                requiredLabelStatusInfoArr[13] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[13]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            if(this.state.survey.enable_consent_date && this.state.survey.required_consent_date && this.state.answerInfo[14] === ''){ 
                requiredLabelStatusInfoArr[14] = true;
                requiredAnswer = true; 

                const container = ReactDOM.findDOMNode(this.state.htmlElRefInfo[14]) as HTMLDivElement;
                scrollTo.push(container.offsetTop);
            }
            
            //set required label status for all the questions
            this.setState({
                requiredLabelStatusInfo: requiredLabelStatusInfoArr,
            },  () => { 
                    // console.log(`after loop requiredLabelStatusInfo`, this.state.requiredLabelStatusInfo);
                } 
            );
        }

        // //still required some answer
        if(requiredAnswer){

            this.renderElement(false);

            this.container.scrollTop = scrollTo[0];

            this.setState({ submitLoading: false });
            
            return true;//required
        }
        else{
            // ReactDOM.render(<div>{this.state.submitButtonElement}</div>, document.getElementById('question-submit-button'));
            return false;//No required
        }
    }

    async isRequiredAnswer(isRequiredAnswerInfo: any){

        // console.log(`isRequiredAnswer`);
        // console.log(`isRequiredAnswer this.state.answer`, this.state.answer);
        // console.log(`isRequiredAnswer this.state.htmlElRef`, this.state.htmlElRef);
        // console.log(`isRequiredAnswer this.state.disableElement`, this.state.disableElement);

        //prepare variable
        let requiredAnswer = false;
        let scrollTo = [];
        let requiredLabelStatusArr = this.state.requiredLabelStatus;

        const allPageNo = this.state.answer.map((obj: any, i: number) => this.getPageNo(this.state.surveyId, i+1));//i+1 = question no. start from 1 - x (number of question)
        const allPromisePageNo = await Promise.all(allPageNo);
        // console.log('allPageNoPromise', allPromisePageNo);
        
        let indexListToCheck = [] as any;
        allPromisePageNo.forEach((questionPageNo: any, index: any) => {
            // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
            // console.log('currentPageNo', currentPageNo);
            if(questionPageNo && parseInt(questionPageNo) === this.state.currentPageNo){
                // console.log('matched');
                indexListToCheck.push(index);
            }
        });
        // console.log('indexListToCheck', indexListToCheck);
        // console.log('indexListToCheck Min', Math.min(...indexListToCheck))
        // console.log('indexListToCheck Max', Math.max(...indexListToCheck))
        
        const fromQuestionIndex = Math.min(...indexListToCheck);
        const toQuestionIndex = Math.max(...indexListToCheck);
        
        // console.log('this.state.answer', this.state.answer);
        // for(let i = 0; i < this.state.numQuestion; i++) {
        for(let i = fromQuestionIndex; i <= toQuestionIndex; i++) {
            
            // requiredLabelStatusArr[i] = false;

            if( (this.state.questionRequired[i] || requiredLabelStatusArr[i]) && this.state.answer[i] === '' && !this.state.disableElement[i] && this.state.htmlElRef[i]){

                const container = ReactDOM.findDOMNode(this.state.htmlElRef[i]) as HTMLDivElement;

                requiredLabelStatusArr[i] = true;

                scrollTo.push(container.offsetTop);
                requiredAnswer = true;
            }

        }

        //set required label status for all the questions
        this.setState({
            requiredLabelStatus: requiredLabelStatusArr,
        },  () => { 
                // console.log(`after loop requiredLabelStatus`, this.state.requiredLabelStatus);
            } 
        );

        // console.log('requiredLabelStatusArr', requiredLabelStatusArr);
        // console.log('requiredAnswer', requiredAnswer);

        // //still required some answer
        if(requiredAnswer){

            this.renderElement(false);

            if(!isRequiredAnswerInfo) this.container.scrollTop = scrollTo[0];

            this.setState({ submitLoading: false });
            
            return true;//required
        }
        else{
            // ReactDOM.render(<div>{this.state.submitButtonElement}</div>, document.getElementById('question-submit-button'));
            return false;//No required
        }
    }

    onMouseClickNextHandler = async (e : any) => {

        let isRequiredAnswerInfo = false;
        if(this.state.survey.client_info_form) isRequiredAnswerInfo = this.isRequiredAnswerInfo();
        // console.log('isRequiredAnswerInfo', isRequiredAnswerInfo);
        const isRequiredAnswer = await this.isRequiredAnswer(isRequiredAnswerInfo);
        // console.log('isRequiredAnswer', isRequiredAnswer);
        // console.log('after const isRequiredAnswer');
        // console.log('after const isRequiredAnswer');
        if(!isRequiredAnswerInfo && !isRequiredAnswer){
            this.setState({
                currentPageNo: this.state.currentPageNo+1,
                isLoading: true
            },  () => { 
                    // console.log(`onMouseClickNextHandler currentPageNo`, this.state.currentPageNo);
                    this.renderElement(0);
                } 
            );
        };
    }
    
    onMouseClickPrevHandler = (e : any) => {

        // if(this.isRequiredAnswer()) return;
        this.setState({
            currentPageNo: this.state.currentPageNo-1,
            isLoading: true 
        },  () => { 
                // console.log(`onMouseClickPrevHandler currentPageNo`, this.state.currentPageNo);
                this.renderElement(0);
            } 
        );
    }

    onMouseClickSubmitHandler = async (e : any) => {

        // console.log('submit', e.target);

        // console.log(`answer`, this.state.answer);

        // this.setState({ submitLoading: true });

        let isRequiredAnswerInfo = false;
        if(this.state.survey.client_info_form) isRequiredAnswerInfo = this.isRequiredAnswerInfo();

        const isRequiredAnswer = await this.isRequiredAnswer(isRequiredAnswerInfo);
        // console.log('after const isRequiredAnswer');
        if(!isRequiredAnswerInfo && !isRequiredAnswer){
            this.setState({
                submitLoading: false,
                thankyou: true,
            }, () => { 
                // console.log('completionRedirect', this.state.completionRedirect);
                // setTimeout(function(this: any){ window.location.href = this.state.completionRedirect; }.bind(this), 2000);
                // console.log('completionRedirect', this.state.completionRedirect);
                // setTimeout(function(this: any){ this.handleHistoryPush('/login'); }.bind(this), 2000);
                // setTimeout(function(this: any){ this.props.history.push(this.state.completionRedirect); }.bind(this), 2000);
                // setTimeout(function(this: any){ 
                //     console.log('this.state.completionRedirect', this.state.completionRedirect);
                //     window.location.replace(this.state.completionRedirect); 
                //     // window.location.replace('www.google.com');
                //     // window.location.href = 'www.google.com'; 
                // }.bind(this), 2000);
            });
        };
    }
 
    // handleHistoryPush = (url: any) => {
    //     this.props.history.push(url);
    // };

    handleTH = (e: any) => {
        // console.log('handleTH', e);
        this.setState({
            langModalVisible: false,
        });
        this.getSurveyData(this.state.rp);
    }
    handleEN = (e: any) => {
        // console.log('handleEN', e);
        this.setState({
            langModalVisible: false,
            lang: 1
        }, () => {
            this.getSurveyData(this.state.rp);
        });
    }

    // specifying your onload callback function
    callback = () => {
        // console.log('Recaptcha Loaded!!!!');
    };
    
    // specifying verify callback function
    // verifyCallback = (response: any) => {
    //     // console.log('Recaptcha verifyCallback!!!!', response)
    //     this.setState({
    //         RecaptchaResponse: response,
    //         isChecking: false
    //     }, () => { 
    //         this.passRecaptcha() 
    //     });
        
    // };

    render() {
        
        // console.log('render()'); 
        
        const fontStyles = reactCSS({
            'default': {
                globalFont: {
                    fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size
                },
                globalFontSize: {
                    fontSize: this.state.survey.global_font_size
                },
                globalFontInline: {
                    display: 'inline', fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size
                },
            }
        });

        const styles = reactCSS({
            'default': {
                previousButton: {
                    display: 'inline-block', fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size, fontWeight: 900, marginRight: '10px',
                    backgroundColor: this.state.survey.button_color_theme
                },
                nextButton: {
                    display: 'inline-block', fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size, fontWeight: 900,
                    backgroundColor: this.state.survey.button_color_theme
                },
                doneButton: {
                    display: 'inline-block', fontFamily: this.state.survey.global_font_family, fontSize: this.state.survey.global_font_size, fontWeight: 900,
                    backgroundColor: this.state.survey.button_color_theme
                },
                surveyImage: {
                    marginTop: '30px',
                    width: this.state.survey.image_width ? ( parseInt(this.state.survey.image_width) > 0 ? parseInt(this.state.survey.image_width) : 200 ) : 200,
                    minWidth: 50,
                    maxWidth: '100%',
                    zIndex: 1
                },
                endOfMessageImage: {
                    marginBottom: '35px',
                    width: this.state.survey.end_of_survey_image_width ? ( parseInt(this.state.survey.end_of_survey_image_width) > 0 ? parseInt(this.state.survey.end_of_survey_image_width) : 200 ) : 200,
                    minWidth: 50,
                    maxWidth: '100%',
                    zIndex: 1
                },
                surveyBackground: {
                    border: '0',
                    opacity: '1',
                    backgroundColor: `${this.state.survey.background_color}`,
                    backgroundImage: `url("${this.state.survey.background_image}")`,
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }
            }
        });

        // if (this.state.isChecking) {
        //     return  <div className="g-recaptcha-container">
        //                 <Recaptcha
        //                     sitekey="6LfzAcIcAAAAAKQX7_GUWTisTgEgeB9rdorF0v0i"
        //                     render="explicit"
        //                     verifyCallback={this.verifyCallback}
        //                     onloadCallback={this.callback}
        //                 />
        //             </div>
        // }
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        // else if(this.state.langModalVisible){
        //     return (
        //         <Modal
        //             className="create-survey-modal choose-survey-language-modal"
        //             title={`โปรดเลือกภาษา\nPlease choose the survey language`}
        //             visible={this.state.langModalVisible}
        //         >
        //             <Button onClick={this.handleTH}>
        //                 <img className="img" src={`/cxm/platform/TH.png`} alt="TH"/>
        //                 <span>ภาษาไทย</span>
        //             </Button>

        //             <Button onClick={this.handleEN}>
        //                 <img className="img" src={`/cxm/platform/EN.png`} alt="EN"/>
        //                 <span>English</span>
        //             </Button>
        //         </Modal>
        //     );
        // }
        else if(this.state.thankyou){
            return  <div ref={ el => this.container = el} style={containerStyles}>
                        <main className="v3theme text_center">
                            { (this.state.survey.end_of_survey_enable_src_type === 2 && this.state.survey.end_of_survey_banner_src) ?
                            <div className="survey-thankyou-page">
                                <img style={{ width: '100%', marginBottom: '35px' }} src={this.state.survey.end_of_survey_banner_src} alt="logo"/>
                                <h1 className="survey-thankyou-title user-generated notranslate">
                                    <span className="title-text" style={fontStyles.globalFont}>
                                        {parse(this.state.endOfSurveyMessage)}
                                    </span>
                                </h1>
                            </div>
                            :
                            <article data-page-id="110955719" className="survey-page survey-page-white" style={styles.surveyBackground}>
                                <section className="survey-page-body" style={{ paddingTop: '0'}}>
                                    <div className="question-row clearfix" style={{ marginTop: '100px', marginBottom: '200px' }}>
                                        <div className="question-container">
                                            <div id="question-field-439413964" className=" question-presentation-image qn question image" data-alt-title="Image" style={{ textAlign: 'center' }}>
                                                <img className={this.state.survey.end_of_survey_image_src ? "user-generated" : 'hidden'} style={styles.endOfMessageImage} src={this.state.survey.end_of_survey_image_src} alt="logo"/>
                                                <h1 className="survey-title user-generated notranslate">
                                                    <span className="title-text" style={fontStyles.globalFont}>
                                                        {parse(this.state.endOfSurveyMessage)}
                                                    </span>
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </article>
                            }
                        </main>
                    </div>    
        }
        else if (this.state.isSuccessLoading) {
            
            return (
                // <div>
                <div ref={ el => this.container = el} style={containerStyles}> 
                    <main className="v3theme text_center">
                        <article data-page-id="110955719" className="survey-page survey-page-white" style={styles.surveyBackground}>
                            <header className="survey-page-header"></header>

                            <div id="overlay" className={ this.state.submitLoading ? '' : 'hidden'}>
                                <Spin size="large" tip="Submitting..."></Spin>
                            </div>

                            { (this.state.survey.enable_src_type === 2 && this.state.survey.banner_src) &&
                            <img style={{ width: '100%', marginBottom: '65px' }} src={this.state.survey.banner_src} alt="logo"/>
                            }

                            { /* add some space */}
                            { (this.state.survey.enable_src_type === 2 && !this.state.survey.banner_src) &&
                            <div className="question-row clearfix" style={{ marginBottom: '65px' }}></div>
                            }

                            <section className="survey-page-body" style={{ paddingTop: '0'}}>
            
                                {/* <div className={ this.state.thankyou ? '' : 'hidden' }>
                                    <div className="question-row clearfix" style={{ marginTop: '100px', marginBottom: '200px' }}>
                                        <div className="question-container">
                                            <div id="question-field-439413964" className=" question-presentation-image qn question image" data-alt-title="Image" style={{ textAlign: 'center' }}>
                                                <img className={this.state.survey.image_src ? "user-generated" : 'hidden'} style={{ maxWidth: '200px' }} src={this.state.survey.image_src} alt="logo"/>
                                                <h1 className="survey-title user-generated notranslate">
                                                    <span className="title-text">ขอบคุณสำหรับความร่วมมือในการตอบแบบสำรวจ</span>
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                <div className='survey-title-container clearfix survey-title-align-left has-survey-title '>
                                    { (this.state.survey.enable_src_type === 1 && this.state.survey.image_src) &&
                                    <div className="question-row clearfix" style={{ marginBottom: 0 }}>
                                        <div className="question-container">
                                            <div className={ this.state.survey.logo_alignment === 1 ? 'question-presentation-image question logo-align-center' : this.state.survey.logo_alignment === 2 ? 'question-presentation-image question logo-align-right' : 'question-presentation-image question'}>
                                                <img style={styles.surveyImage} src={this.state.survey.image_src} alt="logo"/>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    { /* add some space */}
                                    { (this.state.survey.enable_src_type === 1 && !this.state.survey.image_src) &&
                                    <div className="question-row clearfix" style={{ marginBottom: '65px' }}></div>
                                    }
                                    <div className="survey-title-table-wrapper">
                                        <table role="presentation" className="survey-title-table table-reset">
                                            <tbody>
                                                <tr>
                                                    <td className="survey-title-cell">
                                                        <h1 className="survey-title user-generated notranslate">
                                                            <span className="title-text" style={fontStyles.globalFont}>
                                                            {this.state.lang ? ( this.state.survey.name_EN_html ? parse(this.state.survey.name_EN_html) : ( this.state.survey.name_EN ? this.state.survey.name_EN : this.state.survey.name) ) : ( this.state.survey.name_html ? parse(this.state.survey.name_html) : this.state.survey.name ) }
                                                            </span>
                                                        </h1>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {   this.state.headerDescription[this.state.currentPageNo-1] && 
                                    this.state.headerDescription[this.state.currentPageNo-1] !== '<p></p>' && 
                                    this.state.headerDescription[this.state.currentPageNo-1] !== '<p><br></p>' ?
                                    <div style={{ marginTop: '65px', marginBottom: '40px' }}>
                                        {/* <span style={{fontSize: '20px'}}> */}
                                        <span style={fontStyles.globalFont}>
                                            {parse(this.state.headerDescription[this.state.currentPageNo-1])}
                                        </span>
                                    </div>
                                    : 
                                    <div></div>
                                }

                                {/* Client Info Form only*/}
                                <div id="question-info-list" className={ this.state.currentPageNo === 1 && this.state.survey.client_info_form ? "question-row clearfix" : "hidden" } style={{ paddingTop: 30, marginBottom: 0, borderTop: '1px solid #edeeee', borderBottom: '1px solid #edeeee' }}></div>
                                
                                <form name="surveyForm"
                                    action=""
                                    method="post"
                                    // className={ this.state.thankyou ? 'hidden' : '' }
                                >
                    
                                    <div className="questions clearfix">
                                        <div id="question-items-list"></div>
                                    </div>

                                    {/* <div id="question-submit-button"></div> */}

                                    <div className="center-text clearfix" style={{ marginBottom: '50px' }}>
                                        { this.state.currentPageNo > 1 && 
                                        <button type="button" onClick={ (e) => this.onMouseClickPrevHandler(e) } className={ "btn small prev-button survey-page-button user-generated notranslate" } style={ styles.previousButton }>
                                            {this.state.lang ? parse(this.state.survey.previous_text_EN) : parse(this.state.survey.previous_text)}
                                        </button>
                                        }

                                        { this.state.currentPageNo < this.state.numPage && 
                                        <button type="button" onClick={ (e) => this.onMouseClickNextHandler(e) } className={ "btn small next-button survey-page-button user-generated notranslate" } style={ styles.nextButton }>
                                            {this.state.lang ? parse(this.state.survey.next_text_EN) : parse(this.state.survey.next_text)}
                                        </button>
                                        }
                                        {/* <button type="button" onClick={ (e) => this.onMouseClickNextHandler(e) } className={ this.state.currentPageNo < this.state.numPage ? "btn small next-button survey-page-button user-generated notranslate" : "hidden" } style={{ display: 'inline-block',  fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '16px' }}>
                                            Submit
                                        </button> */}
                                        { this.state.currentPageNo === this.state.numPage &&
                                        <button disabled={this.state.submitLoading} type="button" onClick={ (e) => this.onMouseClickSubmitHandler(e) } className={ "btn small done-button survey-page-button user-generated notranslate" } style={ styles.doneButton }>
                                            {/* <img className={ this.state.submitLoading ? '' : 'hidden' } src="https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif" width="20.5" height="20.5" style={{ marginRight: '5px' }} /> */}
                                            {this.state.lang ? parse(this.state.survey.done_text_EN) :parse(this.state.survey.done_text)}
                                        </button>
                                        }
                                    </div>

                                    <input type="hidden" id="survey_data" name="survey_data" value="4FoTYerhlqpl9" />
                                    <input type="hidden" data-response-quality id="response_quality_data" name="response_quality_data" value="{}" />
                                    <input type="hidden" id="is_previous" name="is_previous" value="false" />
                                    <input type="hidden" id="disable_survey_buttons_on_submit" name="disable_survey_buttons_on_submit" value=""/>
            
                                </form>

                                

                                {   this.state.footerDescription[this.state.currentPageNo-1] && 
                                    this.state.footerDescription[this.state.currentPageNo-1] !== '<p></p>' && 
                                    this.state.footerDescription[this.state.currentPageNo-1] !== '<p><br></p>' ?
                                    <div style={{ marginTop: '65px', marginBottom: '40px', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                        {/* <span style={{fontSize: '20px'}}> */}
                                        <span style={fontStyles.globalFont}>
                                            {parse(this.state.footerDescription[this.state.currentPageNo-1])}
                                        </span>
                                    </div>
                                    :
                                    <div></div>
                                }
                                {this.state.survey.enable_progressbar ?
                                    <div
                                        style={{
                                            backgroundColor: this.state.survey.progressbar_background_color,
                                            color: this.state.survey.progressbar_text_color,
                                            width: '100%', 
                                            position: 'fixed', 
                                            bottom: 0, 
                                            left: 0,
                                            display: "flex",
                                            justifyContent: 'center',
                                            padding: '8px'
                                        }}
                                    >
                                            <div style={{ marginRight: 10 }}>
                                                {`${this.state.sumAnswer} of ${this.state.numQuestion} answered`}</div>
                                            <Progress percent={this.state.sumAnswer ? 100*this.state.sumAnswer/this.state.numQuestion : 0 } style={{ width: '200px'}} showInfo={false}/>
                                    </div>
                                : null}
                            </section>
        
                            {/* <footer className="survey-footer bottom">
                            <div className="standard-footer notranslate">
                                <p className="survey-footer-title ">
                                    Powered by <a target="_blank" href="https://www.iconcxm.com?ut_source=survey_poweredby_home" className="footer-brand-name survey-footer-link"><img src="https://secure.iconcxm.com/assets/responseweb/smlib.surveytemplates/4.2.63/assets/sm_logo_footer.svg" alt="SurveyMonkey" className="responsive-logo"/></a>
                                </p>
                                        See how easy it is to <a target="_blank" data-mangled=rLwSZaG8FbF5ZTt1BQNusHcbpzgM002gqRNNlQBG35Wqak9UrAXretIkB7_2B_2BHtKAYINr56dexeUMokjwA07Cqj0hgTImEI2zj8t3qHM2u6s_3D className="survey-footer-link create-a-survey" href="https://www.iconcxm.com/mp/how-to-create-surveys/?ut_source=survey_poweredby_createsurveys">create a survey</a>.
                            </div>

                            <div className="survey-footer-privacy-link-container">
                                <a target="_blank" className="survey-footer-link survey-footer-privacy-link" href="https://www.iconcxm.com/mp/legal/privacy-basics/?ut_source=survey_pp">Privacy</a><span className="survey-footer-privacy-text"> & </span><a target="_blank" className="survey-footer-link survey-footer-privacy-link" href="https://help.iconcxm.com/articles/en_US/kb/About-the-cookies-we-use/?ut_source=survey_pp">Cookie Policy</a>
                            </div>
                            </footer> */}
                        </article>
                        <div className="privacy-policy-icon-super-container"></div>
                    </main>           
                </div>
            );
        }
        else{
            return(<div></div>);
        }
    }
}