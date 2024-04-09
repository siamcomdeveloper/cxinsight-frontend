import React from 'react';
import ReactDOM from 'react-dom';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import * as toastr from 'toastr';
import Surveys from '../models/surveys';
import Collector from '../models/collector';
import BaseService from '../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import MenuSurvey from '../common/menu';

import { Empty, Icon, Spin, Collapse, Badge, Tooltip, Radio, Menu, Dropdown, Upload } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import HeaderSurvey from '../common/header';

import Question from '../models/questions';
import '../css/createweb-global-bundle-min.ff71e50a.css';
// import '../css/createweb-step2-bundle-min.d835899c.css';
import '../css/createweb-step2-bundle-min.32c5304d.css';
import '../css/createweb-common-bundle-min.37aebfc8.css';
import '../css/createweb-e48ff77e3f70.css';
import '../css/surveytemplates-datepicker_lazyload-bundle-min.b2a77b7a.css';
import RatingQuestionDesign from '../common/design/ratingQuestionDesign';
import ChoiceQuestionDesign from '../common/design/choiceQuestionDesign';
import CheckboxQuestionDesign from '../common/design/checkboxQuestionDesign';
import ScoreQuestionDesign from '../common/design/scoreQuestionDesign';
import TextQuestionDesign from '../common/design/textQuestionDesign';
import DropdownQuestionDesign from '../common/design/dropdownQuestionDesign';
import PageQuestionListDesign from '../common/design/pageQuestionListDesign';

import RatingQuestionModal from '../common/modal/design/ratingQuestionModal';
import Answer from '../models/answers';
import TextQuestionModal from '../common/modal/design/textQuestionModal';
import ChoiceQuestionModal from '../common/modal/design/choiceQuestionModal';
import CheckboxQuestionModal from '../common/modal/design/checkboxQuestionModal';
import ScoreQuestionModal from '../common/modal/design/scoreQuestionModal';
import DropdownQuestionModal from '../common/modal/design/dropdownQuestionModal';
import NewQuestionModal from '../common/modal/design/newQuestionModal';
import NewQuestionTemplateModal from '../common/modal/design/newQuestionTemplateModal';

import SurveyAddLogoModal from '../common/modal/surveyAddLogoModal';
import SurveyRenameModal from '../common/modal/surveyRenameModal';
import SurveyHeaderDescriptonModal from '../common/modal/surveyHeaderDescriptionModal';
import SurveyFooterDescriptonModal from '../common/modal/surveyFooterDescriptionModal';
import SurveySubmitButtonModal from '../common/modal/surveySubmitButtonModal';
import SurveyEndOfSurveyMessageModal from '../common/modal/surveyEndOfSurveyMessageModal';
import SurveyCompletionRedirectModal from '../common/modal/surveyCompletionRedirectModal';

import SurveyReNicknameModal from '../common/modal/surveyRenicknameModal';

const { Panel } = Collapse;

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            surveyId:string
        },
        path: string,
        url: string,
    }
}
interface IState {
    survey: Surveys,
    loadingBackgroundImage: boolean;
    listCollectors: Array<Collector>,
    isLoadingPage: boolean,
    isLoadingDesign: boolean,
    modalVisible: boolean,

    totalCollectors: number,
    sidebarTool: string,
    nodeElement: any;
    currentPageNo: number;
    numQuestion: number;
    numPage: number;

    questionId: any;
    questionTypeId: any;
    questionRequired: any;
    showCommentFieldStatus: any;
    skipLogicStatus: any;
    skipLogic: any;
    skipLogicText: any;
    requiredLabelStatus: any;
    
    pageElRef: any;
    questionElRef: any;

    allPromiseSkipQuestionPageNo: any;
    // numQuestionOnpage: any;
    questionBankLang: any;
    
    fontRow: any;
    backgroundRow: any;
    globalFontName: any;
    globalFontSize: any;

    bgPath: any;
    color: any;
    displayColorPicker: any;
    
    visible: boolean;
}

//this styles for scrollTo ref elements
const containerStyles = {
    overflow: 'auto',
    height: '100vh',
    borderBottom: "1px solid #d1d2d3"
}

export default class DemoDesign extends React.Component<IProps, IState> {
    container: any;

    // pageNo = () => (
    //     <Menu>
    //         {this.createMenuRow()}
    //     </Menu>
    // );

    constructor(props: IProps) {
        super(props);
        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            loadingBackgroundImage: false,
            listCollectors: [],
            isLoadingPage: true,
            isLoadingDesign: true,
            modalVisible: false,

            totalCollectors: 0,
            sidebarTool: "builder",

            nodeElement: [],
            currentPageNo: 1,
            numQuestion: 0,
            numPage: 1,

            questionId: [],
            questionTypeId: [],
            questionRequired: [],
            showCommentFieldStatus: [],
            skipLogicStatus: [],
            skipLogic: [],
            skipLogicText: [],
            requiredLabelStatus: [],

            pageElRef: [],
            questionElRef: [],

            allPromiseSkipQuestionPageNo: [],
            // numQuestionOnpage: [],
            questionBankLang: 0,

            fontRow: [],
            backgroundRow: [],
            globalFontName: '',
            globalFontSize: '',

            bgPath: '',
            color: {
                r: '241',
                g: '112',
                b: '19',
                a: '1',
            },
            displayColorPicker: false,
            visible: false,
        }
        this.onFieldValueChange = this.onFieldValueChange.bind(this);
        this.toPageHandler = this.toPageHandler.bind(this);
        this.pageActionHandler = this.pageActionHandler.bind(this);
        this.callModal = this.callModal.bind(this);
        this.buttonAction = this.buttonAction.bind(this);
        this.callSurveyRenameModal = this.callSurveyRenameModal.bind(this);
        this.callSurveyHeaderDescriptionModal = this.callSurveyHeaderDescriptionModal.bind(this);
        this.callSurveyFooterDescriptionModal = this.callSurveyFooterDescriptionModal.bind(this);
        this.callEndOfSurveyMessageModal = this.callEndOfSurveyMessageModal.bind(this);
        this.callSurveyCompletionRedirectModal = this.callSurveyCompletionRedirectModal.bind(this);
        this.callSurveySubmitButtonModal = this.callSurveySubmitButtonModal.bind(this);
        this.callAddLogoModal = this.callAddLogoModal.bind(this);
    }

    //1.2 Same as constructor intitial root component and default state NO setState
    componentWillMount(){
      // console.log('DemoClientSurvey componentWillMount');
    }

    //1.3 render
    
    //1.4 Call api to load data CAN setState
    async componentDidMount() {

        try{

          // console.log('DesignSurvey componentDidMount');

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

            document.body.id = 'create';
            document.body.classList.toggle('translate', true);
            document.body.classList.toggle('step2', true);
            document.body.classList.toggle('basic', true);
            document.body.classList.toggle('modern-browser', true);
            document.body.classList.toggle('themeV3', true);
            document.body.classList.toggle('sticky', true);
            
            const startTime = performance.now();
            
            BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.surveyId, jwtToken).then(
                async (rp) => {
                    try{
                        if (rp.Status) {
                        //   console.log('surveys', rp.Data);

                            // const surveyId = this.props.match.params.surveyId;
                          // console.log('surveyId', this.props.match.params.surveyId);

                            const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                          // console.log('numQuestion', numQuestion);

                            const numPage = parseInt(rp.Data.recordset[0].num_page)
                          // console.log('numPage', numPage);

                            let nodeArr = new Array<any>(numQuestion);
                            let questionIdArr = new Array<any>(numQuestion);
                            let questionTypeIdArr = new Array<any>(numQuestion);
                            let questionRequiredArr = new Array<any>(numQuestion);
                            let showCommentFieldStatusArr = new Array<any>(numQuestion);
                            let skipLogicStatusArr = new Array<any>(numQuestion);
                            let skipLogicArr = new Array<any>(numQuestion);
                            let requiredLabelStatusArr = new Array<any>(numQuestion);
                            let questionElRefArr = new Array<any>(numQuestion);

                            for(let i = 0; i < numQuestion; i++) { 
                                nodeArr[i] = ''; 
                                questionIdArr[i] = '';
                                questionTypeIdArr[i] = '';
                                questionRequiredArr[i] = false;
                                showCommentFieldStatusArr[i] = false;
                                skipLogicStatusArr[i] = false;
                                skipLogicArr[i] = '';
                                requiredLabelStatusArr[i] = false;
                                questionElRefArr[i] = '';
                            }
                            
                            this.setState({ 
                                survey: rp.Data.recordset[0], 
                                bgPath: rp.Data.recordset[0].background_image,
                                nodeElement: nodeArr,
                                numQuestion: numQuestion, 
                                numPage: numPage, 
                                questionId: questionIdArr, 
                                questionTypeId: questionTypeIdArr, 
                                questionRequired: questionRequiredArr, 
                                showCommentFieldStatus: showCommentFieldStatusArr, 
                                skipLogicStatus: skipLogicStatusArr, 
                                skipLogic: skipLogicArr, 
                                requiredLabelStatus: requiredLabelStatusArr, 
                                questionElRef: questionElRefArr, 
                                globalFontName: rp.Data.recordset[0].global_font_name ? rp.Data.recordset[0].global_font_name : "National2",
                                globalFontSize: rp.Data.recordset[0].global_font_size ? rp.Data.recordset[0].global_font_size : "20px"
                            },  () => { 
                                  // console.log(`after survey`, this.state.survey);
                                  // console.log(`after nodeElement`, this.state.nodeElement);
                                  // console.log(`after numQuestion`, this.state.numQuestion);
                                  // console.log(`after numPage`, this.state.numPage);
                                  // console.log(`after questionId`, this.state.questionId);
                                  // console.log(`after questionTypeId`, this.state.questionTypeId);
                                  // console.log(`after questionRequired`, this.state.questionRequired);
                                  // console.log(`after showCommentFieldStatus`, this.state.showCommentFieldStatus);
                                  // console.log(`after skipLogicStatus`, this.state.skipLogicStatus);
                                  // console.log(`after skipLogic`, this.state.skipLogic);
                                  // console.log(`after requiredLabelStatus`, this.state.requiredLabelStatus);
                                  // console.log(`after questionElRef`, this.state.questionElRef);
                                } 
                            );

                            this.renderElement(startTime);
                            // console.log('answer', this.state.answer);

                        } else {
                            this.setState({ isLoadingPage: false });
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design componentDidMount BaseService.get<Surveys> /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design componentDidMount BaseService.get<Surveys> /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }

            );

            //remove ant-modal-root to fix a dropdown not showing bug on new question form when switch between design survey page and preview page
            // getElementsByClassName only selects elements that have both given classes 
            const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
            // console.log('allAntModalRootElement', allAntModalRootElement);
            if(allAntModalRootElement.length){
                for (let i = 0 ; i < allAntModalRootElement.length; i++) {
                    // ReactDOM.render(<div></div>, document.getElementById('ant-modal-root'));
                    ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => {
                      // console.log(`ant-modal-root${i} child removed`)
                    });
                }
            }

        }
        catch(error){
            // console.log('error', error);
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getPageNoElement = async (numPage: any) => {
        return <div key={'page-'+numPage} className="page-header sm-corner-t " view-role="SummaryPageHeaderView"><span className="page-title">Page {numPage}</span></div>;
    }
    
    insert( arr: any, index: any, item: any ) {
        arr.splice( index, 0, item );
    };

    async renderElement(startTime?: any){
        try{
          // console.log('DemoDesign renderElement');

            //get pageNo for each question
            const jwt = getJwtToken();
            const questionPageNo = this.state.nodeElement.map((obj: any, i: number) => this.getPageNo(this.props.match.params.surveyId, i+1, jwt));//i+1 = question no. start from 1 - x (number of question)
            const allPromiseQuestionPageNo = await Promise.all(questionPageNo);
          // console.log('allPromiseQuestionPageNo', allPromiseQuestionPageNo);

            this.setState({
                allPromiseSkipQuestionPageNo: allPromiseQuestionPageNo,
            },  () => { 
                  // console.log(`this.state.allPromiseSkipQuestionPageNo ${this.state.allPromiseSkipQuestionPageNo}`);
                } 
            );

            //create a array of page node
            let pageNodeArr = new Array<any>(this.state.numPage);
            let pageElRefArr = new Array<any>(this.state.numPage);
            // let numQuestionOnpageArr = new Array<any>(this.state.numPage);
            for(let i = 0; i < this.state.numPage; i++) { 
                pageNodeArr[i] = ''; 
                pageElRefArr[i] = ''; 
                // numQuestionOnpageArr[i] = '';
            }
            this.setState({ 
                pageElRef: pageElRefArr,
                // numQuestionOnpage: numQuestionOnpageArr 
            });

            //get page elements for survey all pages
            const pageElements = pageNodeArr.map((obj: any, i: any) => this.getPageRow(i+1));//i+1 = question no. start from 1 - x (number of question)
          // console.log('pageElements', pageElements);

            this.setState({ isLoadingPage: false });
            //render all page elements to page-items-list
            if(pageElements.length){
                ReactDOM.render(pageElements, document.getElementById('page-items-list'));
            }
            else{
                ReactDOM.render(<Empty style={{ margin: '20px 0', padding: '200px 0', backgroundColor: 'white' }} description={<span> Please add a question </span>}/>, document.getElementById('page-items-list'));
            }

            //get question elements
            const questionElements = this.state.nodeElement.map((obj: any, i: any) => this.getQuestionRow(this.props.match.params.surveyId, i+1, jwt));//i+1 = question no. start from 1 - x (number of question)

            //wait all question elements as Promise
            const allQuestionElements = await Promise.all(questionElements);
          // console.log('allQuestionElements', allQuestionElements);
            
            //insert question elements
            for (let pageNo = 1; pageNo <= this.state.numPage; pageNo++) {
                
                //find list of question index to remove and count
                let indexListToRemove = [] as any;
                let count = 0;
                allPromiseQuestionPageNo.forEach((questionPageNo: any, index: any) => {
                  // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
                    // console.log('currentPageNo', currentPageNo);
                    if(questionPageNo && parseInt(questionPageNo) !== pageNo){
                        // console.log('!matched');
                        indexListToRemove.push(index);
                    }
                    else if(questionPageNo && parseInt(questionPageNo) === pageNo){
                        count++;
                    }
                });
              // console.log('indexListToRemove', indexListToRemove);

                //copy all question element
                let elementsCopy = [] as any;
                for (let i = 0; i < allQuestionElements.length; i++) {
                    elementsCopy[i] = allQuestionElements[i];
                }

                //remove elements
                indexListToRemove.forEach((removeIndex: any, index: any) => { 
                  // console.log(`removeIndex = ${removeIndex} : index = ${index}`); 
                    delete elementsCopy[removeIndex];
                });

              // console.log('elementsCopy removed', elementsCopy);
                //render to question-items-list
                ReactDOM.render(<div>{elementsCopy}</div>, document.getElementById('question-items-list-'+pageNo));

                //get num of question on each page
                // let numQuestionOnpageArr = this.state.numQuestionOnpage;
                // const index = pageNo-1;
                // numQuestionOnpageArr[index] = count;

                // this.setState({
                //     numQuestionOnpage: numQuestionOnpageArr,
                // },  () => { 
                //       // console.log(`after numQuestionOnpage`, this.state.numQuestionOnpage);
                //     } 
                // );
            }

            // BaseService.get<Surveys>(this.props.match.params.xSite, '/templates/touchpointareaofimpact', '', jwt).then(
            // BaseService.get(this.props.match.params.xSite ,"/templates/touchpointareaofimpact", '', jwt).then(
            //     async (rp) => {
            //         try{
            //             if (rp.Status) {

            //                 // this.setState({ isLoading: false });

            //                 // console.log(`get surveys rp`, rp);
            //                 // console.log(`get surveys rp.Data`, rp.Data);
                            
            //                 const result = rp.Data.result.recordset;
            //                 const resultLength = result.length;
            //                 // console.log(`get surveys resultLength`, resultLength);

            //                 if(resultLength){

            //                     let touchpointName = result[0].name_touchpoints.includes(",") ? result[0].name_touchpoints.split(',') : [result[0].name_touchpoints];
            //                     let areaOfImpactName = result[0].name_area_of_impacts.includes(",") ? result[0].name_area_of_impacts.split(',') : [result[0].name_area_of_impacts];

            //                     // console.log(`get touchpointName`, touchpointName);
            //                     // console.log(`get areaOfImpactsName`, areaOfImpactName);

            //                     //replace &amp; with & character
            //                     touchpointName = touchpointName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });
            //                     areaOfImpactName = areaOfImpactName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

            //                     // console.log(`after get touchpointName`, touchpointName);
            //                     // console.log(`after get areaOfImpactsName`, areaOfImpactName);

            //                     let nodeTouchpoint = new Array<any>(touchpointName.length);
            //                     for(let i = 0; i < nodeTouchpoint.length; i++) { nodeTouchpoint[i] = ''; }

            //                     const allTouchpointElement = nodeTouchpoint.map((obj, i) => this.getTouchpointRow(i, touchpointName)).filter(function (item: any) { return item !== null; }) as any;
            //                     // allTouchpointElement.push(<Collapse key={`collapse-${0}`} defaultActiveKey={[`panel-${0}`]}><Panel header={`${touchpointName[touchpointName.length-1]}`} key={`panel-${0}`}><ul id={`touchpoint-list-${0}`} className="addList"></ul></Panel></Collapse>)

            //                     // console.log('allTouchpointElement', allTouchpointElement);

            //                     if(allTouchpointElement.length){
            //                         //render move tab element
            //                         // ReactDOM.render(allTouchpointElement, document.getElementById("project-dropdown"));
            //                         // ReactDOM.render(allTouchpointElement, document.getElementsByClassName('touchpointsCollapse')[0], () => {
            //                         ReactDOM.render(allTouchpointElement, document.getElementById('touchpointsCollapse'));
                                    
            //                         // console.log('render touchpointsCollapse');
            //                     }
            //                 }

            //             } else {
            //                 toastr.error('Something went wrong!, please refresh the page or try again later.');
            //                 BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design renderElement BaseService.get /templates/touchpointareaofimpact else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
            //                 return false;
            //             }
            //         } catch(error){
            //             toastr.error('Something went wrong!, please refresh the page or try again later.');
            //             BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design renderElement BaseService.get /templates/touchpointareaofimpact catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            //         }
            //     }
            // );

            let fontRow = [] as any;
            BaseService.getJSON(this.props.match.params.xSite, "/font", '', jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            
                            const fonts = rp.Data.result.recordset;
                            // console.log('fonts', fonts);
                            fonts.map((fontData: any) => {
                                fontRow.push(
                                    <Menu.Item key={`font-${fontData.id}`}>
                                        <a href="# " onClick={()=>this.setGlobalFont(fontData)} style={{ textDecoration: 'none' }}>{fontData.font_name}</a>
                                    </Menu.Item>
                                );
                            });

                            // console.log('fontRow', fontRow);
                            // return fontRow;
                            this.setState({ 
                                fontRow: fontRow,
                                isLoadingDesign: false
                            });
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createFontRow BaseService.getJSON /font else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createFontRow BaseService.getJSON /font catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );

            let backgroundRow = [] as any;
            BaseService.getJSON(this.props.match.params.xSite, "/background", '', jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            
                            const backgrounds = rp.Data.result.recordset;
                            // console.log('backgrounds', backgrounds);
                            backgrounds.map((backgroundData: any, index: any) => {
                                backgroundRow.push(
                                    <li key={`background-${backgroundData.id}`} className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', textAlign: 'center' }}>
                                        <h3 style={{ minHeight: '35px' }}>Background Template No.{index+1}</h3>
                                        <img style={{ width: '150px' }} src={`${backgroundData.image_path}`}/>
                                        <a href="# " className="bg" onClick={()=>this.changeSurveyBackground(backgroundData.image_path)} style={{ cursor: 'default' }}>
                                            <span className="apply wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>APPLY</span>
                                        </a>
                                    </li>
                                );
                            });

                            // console.log('backgroundRow', backgroundRow);
                            // return backgroundRow;
                            this.setState({ 
                                backgroundRow: backgroundRow,
                                // isLoadingDesign: false
                            });
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createBackgroundRow BaseService.getJSON /background else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createBackgroundRow BaseService.getJSON /background catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );

            const endTime = performance.now();
          // console.log('Its took ' + (endTime - startTime) + ' ms.');

            // this.setState({ isLoadingDesign: false });
        } catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design renderElement catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getTouchpointRow = (No: any, touchpointName: any) => {
        // if(No > 0 && No < touchpointName.length-1) //Display all except HR and Other at first
        // console.log('touchpointName[No]', touchpointName[No]);
        if(touchpointName[No] === 'Other') return null; //No Other
        else return (<Collapse key={`collapse-${No}-${this.getDateTime()}`} /*defaultActiveKey={[`panel-${No}`]}*/ onChange={this.CollapseCallback}>
                    <Panel key={`panel-${No}`} header={`${touchpointName[No]}`}>
                        <ul id={`touchpoint-list-${No}`} className="addList"></ul>
                    </Panel>
                </Collapse>);
    }

    getTemplateRow = (No: any, template: any, areaOfImpactName:any, touchpointId: any) => {

        // console.log(`template[${No}]`, template[No]);
        // console.log(`touchpointId`, touchpointId);
        // console.log(`template[${No}].touchpoint_id `, template[No].touchpoint_id);

        if(template[No].touchpoint_id === touchpointId){
            // console.log(`in if`);

            let badge = [] as any;
            let colorClass = "callCenterBadge";
            let questionTypeClass = "qsr";
            // console.log(`template[${No}].type_id`, template[No].type_id);
            switch (template[No].type_id) {
                case 1: questionTypeClass = "qsr"; break;
                case 2: questionTypeClass = "qmc"; break;
                case 3: questionTypeClass = "qchb"; break;
                case 4: questionTypeClass = "qnp hasFont2"; break;
                case 5: questionTypeClass = "qcb"; break;
                case 6: questionTypeClass = "qdd"; break;
            }
            // console.log('questionTypeClass', questionTypeClass);

            let countBagde = 1;

            template[No].area_of_impact_id.split(',').map((areaOfImpactId: any, i: any) => { 
                // console.log(`parseInt(areaOfImpactId)`, parseInt(areaOfImpactId));
                switch (parseInt(areaOfImpactId)) {
                    case 2: colorClass = "callCenterBadge"; break;
                    case 3: colorClass = "salesBadge"; break;
                    case 4: colorClass = "contractBadge"; break;
                    case 5: colorClass = "inspectionBadge"; break;
                    case 6: colorClass = "transferBadge"; break;
                    case 7: colorClass = "warrantyBadge"; break;
                    case 8: colorClass = "afterWarrantyBadge"; break;
                    case 9: colorClass = "rentalBadge"; break;
                    case 10: colorClass = "resaleBadge"; break;
                    case 11: colorClass = "juristicPersonBadge"; break;
                    case 12: colorClass = "brandingBadge"; break;
                    case 13: colorClass = "productBadge"; break;
                    case 14: colorClass = "locationBadge"; break;
                    case 15: colorClass = "pricingBadge"; break;
                    case 16: colorClass = "marketingBadge"; break;
                    case 17: colorClass = "CRMBadge"; break;
                    case 18: colorClass = "financeBadge"; break;
                    case 19: colorClass = "employeeEngagementBadge"; break;
                    case 20: colorClass = "careerDevelopmentBadge"; break;
                    case 21: colorClass = "workEngagementBadge"; break;
                    case 22: colorClass = "relationshipManagementBadge"; break;
                    case 23: colorClass = "compensationBenefitsBadge"; break;
                    case 24: colorClass = "productQualityBadge"; break;
                    case 25: colorClass = "productDesignBadge"; break;
                    case 26: colorClass = "salesPersonBadge"; break;
                    case 27: colorClass = "workEnvironmentBadge"; break;
                }
                // console.log('colorClass', colorClass);

                //replace &amp; with & character
                areaOfImpactName[parseInt(areaOfImpactId)-1] = areaOfImpactName[parseInt(areaOfImpactId)-1].includes('&amp;') ? areaOfImpactName[parseInt(areaOfImpactId)-1].replace('&amp;', '&') : areaOfImpactName[parseInt(areaOfImpactId)-1];
                
                badge.push(<Badge key={`badge-${No}-${countBagde++}`} count={`${areaOfImpactName[parseInt(areaOfImpactId)-1]}`} className={colorClass}/>)
            });

            // return (<option key={`touchpoint-option-${No}`} value={No} className="user-generated">{touchpointName[No-1]}</option>);
            return { element: (<li key={`template-${No}`} className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                        {/* <Badge count={`${areaOfImpactName}`} className="callCenterBadge"/> */}
                        { template[No].template_question_status === 1
                        ?<Badge status="processing" text="Standard Question" />
                        :<Badge status="warning" text="Additional Question" />
                        }
                        <br />
                        {template[No].type_id === 5 ?
                        <a href="# " className={questionTypeClass} data-icon="W" style={{ marginBottom: '10px', cursor: 'default' }}>
                            <span className="listText">{this.state.questionBankLang ? template[No].question_label_EN : template[No].question_label}</span>
                            <span onClick={()=>this.callAddQuestionTemplateModal(template[No].type_id, template[No].id, template[No].question_label)} className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                        </a>
                        :
                        <a href="# " className={questionTypeClass} style={{ marginBottom: '10px', cursor: 'default' }}>
                            <span className="listText">{this.state.questionBankLang ? template[No].question_label_EN : template[No].question_label}</span>
                            <span onClick={()=>this.callAddQuestionTemplateModal(template[No].type_id, template[No].id, template[No].question_label)} className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                        </a>
                        }
                        {badge}
                    </li>), template_question_status: template[No].template_question_status };
        }
        else return null;
    }

    dynamicSort(property: any, order: any) {
        var sort_order = 1;
        if(order === "desc"){
            sort_order = -1;
        }
        return function (a: any, b: any){
            // a should come before b in the sorted order
            if(a[property] < b[property]){
                    return -1 * sort_order;
            // a should come after b in the sorted order
            }else if(a[property] > b[property]){
                    return 1 * sort_order;
            // a and b are the same
            }else{
                    return 0 * sort_order;
            }
        }
    }

    toPageHandler(toPageNo: any){
        // console.log(`toPageHandler pageNo ${toPageNo}`);

        const index = toPageNo - 1;
        const container = ReactDOM.findDOMNode(this.state.pageElRef[index]) as HTMLDivElement;

        // console.log('toPageHandler container', container);
        this.container.scrollTop = container.offsetTop;
    }

    pageActionHandler(pageNo: any, action: any){
      // console.log(`pageActionHandler pageNo ${pageNo} action ${action}`);
    }

    callModal(questionNo: any, action: any){
      // console.log(`callModal questionNo ${questionNo} action ${action}`);
        this.getQuestionSetting(questionNo, action);
    }

    callAddQuestionModal(questionTypeId: any){
      // console.log(`callAddQuestionModal questionTypeId ${questionTypeId} survey`, this.state.survey);

        const questionObj = {
            typeId: questionTypeId
        }

        ReactDOM.render(<NewQuestionModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}-${questionTypeId}`} visible={true} survey={this.state.survey} question={questionObj} handleSaveQuestion={this.handleSaveQuestion}/>, document.getElementById('modal-render'));
    }

    removeSurveyBackground(){
        // console.log('removeSurveyBackground');
        this.setState({ 
            bgPath: '',
            survey: { 
                ...this.state.survey,
                [`background_color`]: ''
            }
        }, () => { 
            // console.log(`removeSurveyBackground bgPath`, this.state.bgPath); 
            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image', 'background_color'], ['', '']), jwt).then(
                (rp) => {
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.renderElement();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Design removeSurveyBackground BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }
            );
        });
    }
    
    changeSurveyBackground(bgPath: any){
        this.setState({ 
            bgPath: `${bgPath}`,
            survey: { 
                ...this.state.survey,
                [`background_color`]: ''
            }
        }, () => { 
            // console.log(`changeSurveyBackground bgPath`, this.state.bgPath); 
            const jwt = getJwtToken();
            // BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image'], [this.state.bgPath]), jwt).then(
                BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image', 'background_color'], [this.state.bgPath, '']), jwt).then(
                (rp) => {
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.renderElement();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Design changeSurveyBackground BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }
            );
        });
    }
    
    callAddQuestionTemplateModal(questionTypeId: any, questionTemplateId: any, questionLabel: any){
      // console.log(`callAddQuestionTemplateModal questionTemplateId ${questionTemplateId} survey`, this.state.survey);

        const questionObj = {
            typeId: questionTypeId,
            templateId: questionTemplateId,
            questionLabel: questionLabel,
            questionBankLang: this.state.questionBankLang
        }

        ReactDOM.render(<NewQuestionTemplateModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}-${questionTemplateId}`} visible={true} survey={this.state.survey} question={questionObj} handleSaveQuestion={this.handleSaveQuestion}/>, document.getElementById('modal-render'));
    }

    callAddLogoModal(){
      // console.log(`callAddLogoModal survey`, this.state.survey);
        ReactDOM.render(<SurveyAddLogoModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey} handleSaveQuestion={this.handleSaveQuestion}/>, document.getElementById('modal-render'));
    }
    
    callSurveyRenameModal(){
      // console.log(`callSurveyRenameModal survey`, this.state.survey);
        ReactDOM.render(<SurveyRenameModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey}/>, document.getElementById('modal-render'));
    }

    callSurveyHeaderDescriptionModal(pageNo: any){
    //   console.log(`callSurveyHeaderDescriptionModal survey`, this.state.survey);
    //   console.log(`callSurveyHeaderDescriptionModal pageNo`, pageNo);
        ReactDOM.render(<SurveyHeaderDescriptonModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey} pageNo={pageNo}/>, document.getElementById('modal-render'));
    }

    callSurveyFooterDescriptionModal(pageNo: any){
    //   console.log(`callSurveyFooterDescriptionModal survey`, this.state.survey);
    //   console.log(`callSurveyFooterDescriptionModal pageNo`, pageNo);
        ReactDOM.render(<SurveyFooterDescriptonModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey} pageNo={pageNo}/>, document.getElementById('modal-render'));
    }

    callEndOfSurveyMessageModal(){
      // console.log(`callEndOfSurveyMessageModal survey`, this.state.survey);
        ReactDOM.render(<SurveyEndOfSurveyMessageModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey}/>, document.getElementById('modal-render'));
    }

    callSurveyCompletionRedirectModal(){
      // console.log(`callSurveyCompletionRedirectModal survey`, this.state.survey);
        ReactDOM.render(<SurveyCompletionRedirectModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey}/>, document.getElementById('modal-render'));
    }

    callSurveySubmitButtonModal(){
      // console.log(`callSurveySubmitButtonModal survey`, this.state.survey);
        ReactDOM.render(<SurveySubmitButtonModal history={this.props.history} match={this.props.match} key={`${this.getDateTime()}`} visible={true} survey={this.state.survey}/>, document.getElementById('modal-render'));
    }

    buttonAction(questionNo: any, action: any){
      // console.log(`buttonAction questionNo ${questionNo} action ${action}`);
    }
    
    refreshRenderSurveyDesign = () => {
      // console.log(`refreshRenderSurveyDesign`);
        //get refresh survey data from DB
        const jwt = getJwtToken();
        BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.surveyId, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {
                      // console.log('refreshRenderSurveyDesign surveys', rp.Data);

                        const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                      // console.log('refreshRenderSurveyDesign numQuestion', numQuestion);

                        const numPage = parseInt(rp.Data.recordset[0].num_page)
                      // console.log('refreshRenderSurveyDesign numPage', numPage);
                        
                        let nodeArr = new Array<any>(numQuestion);
                        for(let i = 0; i < numQuestion; i++) {  nodeArr[i] = ''; }
            
                        this.setState({ 
                            survey: rp.Data.recordset[0], 
                            nodeElement: nodeArr,
                            numQuestion: numQuestion, 
                            numPage: numPage, 
                        },  () => { 
                              // console.log(`refreshRenderSurveyDesign after survey`, this.state.survey);
                              // console.log(`refreshRenderSurveyDesign after numQuestion`, this.state.numQuestion);
                              // console.log(`refreshRenderSurveyDesign after numPage`, this.state.numPage);

                                const startTime = performance.now();
                                this.setState({ isLoadingDesign: true });
                                this.renderElement(startTime);
                            } 
                        );

                    } else {
                        this.setState({ isLoadingPage: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design refreshRenderSurveyDesign BaseService.get<Surveys> /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design refreshRenderSurveyDesign BaseService.get<Surveys> /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }

        );
    };
    
    handleSaveQuestion = () => {
      // console.log(`DemoDesign handleSaveQuestion`);
        this.refreshRenderSurveyDesign();
    };
    
    handleDeleteQuestion = (questionId: any, questionTypeId: any, onOnPage: any) => {
      // console.log(`DemoDesign handleDeleteQuestion questionId ${questionId} questionTypeId ${questionTypeId} onOnPage ${onOnPage}`);

        const strDeleteUrl = onOnPage ? 'sdelete' : 'ndelete';

        const jwt = getJwtToken();
        BaseService.delete(this.props.match.params.xSite, "/question/design/"+ strDeleteUrl + "/", this.state.survey.id + '/' + questionId + '/' + questionTypeId, jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log(rp);
                    toastr.success(rp.Messages);
                    this.refreshRenderSurveyDesign();
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design handleDeleteQuestion BaseService.delete /question/design/${strDeleteUrl}/${this.state.survey.id}/${questionId}/${questionTypeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
    };

    handleMoveQuestion = (questionId: any, direction: any, pageNo: any , orderNo: any) => {
      // console.log(`DemoDesign handleMoveQuestion questionId ${questionId} direction ${direction} pageNo ${pageNo} orderNo ${orderNo}`);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/question/design/move/"+ direction + "/", this.state.survey.id + '/' + questionId + '/' + pageNo + '/' + orderNo, '', jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log(rp);
                    toastr.success(rp.Messages);

                    //get refresh survey data from DB
                    BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.surveyId, jwt).then(
                        async (rp) => {
                            try{
                                if (rp.Status) {
                                  // console.log('DemoDesign handleDeleteQuestion surveys', rp.Data);
                
                                    const numQuestion = parseInt(rp.Data.recordset[0].num_question)
                                  // console.log('DemoDesign handleDeleteQuestion numQuestion', numQuestion);
                
                                    const numPage = parseInt(rp.Data.recordset[0].num_page)
                                  // console.log('DemoDesign handleDeleteQuestion numPage', numPage);
                                    
                                    let nodeArr = new Array<any>(numQuestion);
                                    for(let i = 0; i < numQuestion; i++) {  nodeArr[i] = ''; }
                        

                                    this.setState({ 
                                        survey: rp.Data.recordset[0], 
                                        nodeElement: nodeArr,
                                        numQuestion: numQuestion, 
                                        numPage: numPage, 
                                    },  () => { 
                                          // console.log(`DemoDesign handleDeleteQuestion after survey`, this.state.survey);
                                          // console.log(`DemoDesign handleDeleteQuestion after numQuestion`, this.state.numQuestion);
                                          // console.log(`DemoDesign handleDeleteQuestion after numPage`, this.state.numPage);

                                            const startTime = performance.now();
                                            this.setState({ isLoadingDesign: true });
                                            this.renderElement(startTime);
                                        } 
                                    );
                
                                } else {
                                    this.setState({ isLoadingPage: false });
                                    // toastr.error(rp.Messages);
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design handleMoveQuestion BaseService.get<Surveys> /surveys/${this.props.match.params.surveyId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                }
                            }catch(error){ 
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design handleMoveQuestion BaseService.get<Surveys> /surveys/${this.props.match.params.surveyId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                            }
                        }
            
                    );

                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design handleMoveQuestion BaseService.update /question/design/move/${direction}/${this.state.survey.id}/${questionId}/${pageNo}/${orderNo} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
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

    getQuestionSetting = (i: any, action: any) => {
      // console.log ("question no." + i);

        const jwt = getJwtToken();
        return BaseService.get<Question>(this.props.match.params.xSite, '/question/', this.state.survey.id + '/' + i, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`getQuestionSetting get question ${i}`, rp.Messages);
                      // console.log(`getQuestionSetting get question ${i}`, rp.Data);

                        if(rp.Data.recordset.length){

                            const question = rp.Data.recordset[0];

                            let questionSkipLogic = null;
                            if(rp.Data.recordset[0].skip_logic) questionSkipLogic =  rp.Data.recordset[0].skip_logic.includes(',') ? rp.Data.recordset[0].skip_logic.split(',') : null;

                          // console.log(`getQuestionSetting get question ${i}`, question);
                            // const questionId = rp.Data.recordset[0].id[0];
                            // const questionTypeId = question.type_id;
                            // const questionLabel = rp.Data.recordset[0].question_label;
                            // const questionNo = rp.Data.recordset[0].order_no;
                            // const questionRequired = rp.Data.recordset[0].required;
                            // const questionRequiredLabel = rp.Data.recordset[0].required_label;
                            // const questionActive = rp.Data.recordset[0].active;

                            // const questionAnalyzeEntity = rp.Data.recordset[0].analyze_entity;
                            // const questionAnalyzeSentiment = rp.Data.recordset[0].analyze_sentiment;
                            
                            // console.log(`get question ${i} id = `, questionId);
                            // console.log(`get question ${i} type id = `, questionTypeId);
                            // console.log(`get question ${i} no = `, questionNo);
                            // console.log(`get question ${i} label = `, questionLabel);
                            // console.log(`get question ${i} active = `, questionActive);

                            // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                            // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);

                            //count total question and get this current question location on this page
                            let matchCount = 0;
                          // console.log(`getQuestionSetting this.state.allPromiseSkipQuestionPageNo`, this.state.allPromiseSkipQuestionPageNo);
                            this.state.allPromiseSkipQuestionPageNo.forEach((questionPageNo: any, index: any) => {
                              // console.log(` index = ${index} -> questionPageNo ${questionPageNo} this.state.question.page_no : ${question.page_no}`);
                                if(questionPageNo && parseInt(questionPageNo) === question.page_no){
                                    matchCount++;
                                }
                            });
                          // console.log('getQuestionSetting matched count', matchCount);

                            //get image process
                            let imageType = [] as any;
                            let imageLabel = [] as any;
                            let imageLabelHtml = [] as any;
                            let imageSource = [] as any;
                            if(question.image_src_type){
                                if(question.image_src_type.includes(',')) imageType = question.image_src_type.split(',');
                                else imageType =  [question.image_src_type];
                            }
                            if(question.image_name){
                                if(question.image_name.includes(',')) imageLabel = question.image_name.split(',');
                                else imageLabel = [question.image_name];
                            }
                            if(question.image_name_html){
                                if(question.image_name_html.includes('~')) imageLabelHtml = question.image_name_html.split('~');
                                else imageLabelHtml = [question.image_name_html];
                            }
                            if(question.image_src){
                                if(question.image_src.includes(',')) imageSource = question.image_src.split(',');
                                else imageSource = [question.image_src];
                            }
                            
                          // console.log(`get question ${i} imageType = `, imageType);
                          // console.log(`get question ${i} imageLabel = `, imageLabel);
                          // console.log(`get question ${i} imageSource = `, imageSource);
                            
                            //Star Rating & Multiple choicevariables
                            let choices = [] as any;
                            let choicesEN = [] as any;
                            let choicesHtml = [] as any;
                            let choicesENHtml = [] as any;
                            let weights = [] as any;

                            let weightAnswer = [] as any;
                            let toPage = [] as any;
                            let toQuestion = [] as any;

                            //NPS variables 
                            let weightAnswerFrom = [] as any;
                            let weightAnswerTo = [] as any;

                            if(question.type_id === 1 || question.type_id === 2 || question.type_id === 3 || question.type_id === 6){
                                
                                const questionChoice = question.choice.split(',');
                                const questionChoiceHtml = question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; });
                                const questionChoiceEN = question.choice_EN ? question.choice_EN.split(',') : question.choice.split(',');
                                // const questionChoiceENHtml = question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) );
                                const questionChoiceENHtml = question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_EN ? question.choice_EN.split(',').map((choice_EN: any) => { return `<p>${choice_EN}</p>`; }) : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) ) );
                                // console.log(`get question ${i} choice = `, questionChoice);
                                // console.log(`getQuestionSetting questionChoiceEN`, questionChoiceEN);

                                for (let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                        choicesEN.push(questionChoiceEN[i]);
                                        choicesHtml.push(questionChoiceHtml[i]);
                                        choicesENHtml.push(questionChoiceENHtml[i]);
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

                                // console.log(`getQuestionSetting get question ${i} choicesEN = `, choicesEN);
                                //  const disableSkipLogicPage = toPage.every((item: any) => toPage.indexOf(item) === 0 && item === 0);
                                //  const disableSkipLogicQuestion = toQuestion.every((item: any) => toQuestion.indexOf(item) === 0 && item === 0);

                              // console.log(`get question ${i} weightAnswer = `, weightAnswer);
                              // console.log(`get question ${i} toPage = `, toPage);
                              // console.log(`get question ${i} toQuestion = `, toQuestion);

                                //// console.log(`get question ${i} toPage.every = `, disableSkipLogicPage);
                                //// console.log(`get question ${i} toQuestion.every = `, disableSkipLogicQuestion);
    
                                //  let skipLogicStatusArr = this.state.skipLogicStatus;
                                //  let skipLogicArr = this.state.skipLogic;
    
                                //  if(!disableSkipLogicPage && !disableSkipLogicQuestion){
                                //      skipLogicStatusArr[index] = true;
                                //      skipLogicArr[index] = questionSkipLogic;
                                //  }
    
                                //  this.setState({
                                //      skipLogicStatus: skipLogicStatusArr,
                                //      skipLogic: skipLogicArr
                                //  },  () => { 
                                //        // console.log(`after get question ${i} skip logic statue`, this.state.skipLogicStatus);
                                //        // console.log(`after get question ${i} skip logic`, this.state.skipLogic);
                                //      } 
                                //  );

                                if(question.type_id === 1) ReactDOM.render(<RatingQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} choices={choices} choicesHtml={choicesHtml} weights={weights} weightAnswer={weightAnswer} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                                else if(question.type_id === 2) ReactDOM.render(<ChoiceQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} choices={choices} choicesEN={choicesEN} choicesHtml={choicesHtml} choicesENHtml={choicesENHtml} weights={weights} weightAnswer={weightAnswer} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                                else if(question.type_id === 3) ReactDOM.render(<CheckboxQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} choices={choices} choicesEN={choicesEN} choicesHtml={choicesHtml} choicesENHtml={choicesENHtml} weights={weights} weightAnswer={weightAnswer} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                                else if(question.type_id === 6) ReactDOM.render(<DropdownQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} choices={choices} choicesEN={choicesEN} choicesHtml={choicesHtml} choicesENHtml={choicesENHtml} weights={weights} weightAnswer={weightAnswer} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                            }
                            else if(question.type_id === 4){
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

                                ReactDOM.render(<ScoreQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} weightAnswerFrom={weightAnswerFrom} weightAnswerTo={weightAnswerTo} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                            }
                            else if(question.type_id === 5) ReactDOM.render(<TextQuestionModal history={this.props.history} match={this.props.match} key={i + this.getDateTime()} visible={true} defaultActiveKey={action} survey={this.state.survey} question={question} toPage={toPage} toQuestion={toQuestion} imageType={imageType} imageLabel={imageLabel} imageLabelHtml={imageLabelHtml} imageSource={imageSource} handleSaveQuestion={this.handleSaveQuestion} oneOnPage={matchCount === 1 ? true : false}/>, document.getElementById('modal-render'));
                                        
                            // return element;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return false;
                        }

                    } else {
                        // this.setState({ isLoadingPage: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getQuestionSetting BaseService.get<Question> /question/${this.state.survey.id}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getQuestionSetting BaseService.get<Question> /question/${this.state.survey.id}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    //2. Updating or re-render
    //2.1 props change
    //2.2 state change

    //2.1.1 When props change inside child component CAN setState
    componentWillReceiveProps(props: any) {
      // console.log('DemoClientSurvey componentWillReceiveProps', props);
    }

    //2.1.2, 2.2.1 When get new props and new state to control to re-render NO setState
    shouldComponentUpdate(nextProps:any, nextState:any){
      // console.log('DemoClientSurvey shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    //2.1.3, 2.2.2 Before render same as componentWillReveiveProps function but NO setState
    componentWillUpdate(){
      // console.log('DemoClientSurvey componentWillUpdate');
    }

    //2.1.4, 2.2.3 render 

    //2.1.5, 2,2.4 When props and state change but not run at first time render, use for DOM updating CAN setState
    componentDidUpdate(prevProps:any, prevState:any){
      // console.log('DemoClientSurvey componentDidUpdate', prevProps, prevState);
    }

    //The last process : Before unmount and destroy, use for reseting (network request, listener, DOM) in the component
    componentWillUnmount(){
      // console.log('DemoClientSurvey componentWillUnmount');
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
    
    getPageNo = async (surveyId: any, i: any, jwt: any) => {
      // console.log ("getPageElementRenderIndex question no." + i);
        
        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`getPageNo get question ${i}`, rp.Messages);
                      // console.log(`getPageNo get question ${i}`, rp.Data);
                      // console.log(`getPageNo get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length){

                            const questionPageNo = rp.Data.recordset[0].page_no;
                          // console.log(`getPageNo get question no. ${i} questionPageNo = `, questionPageNo);

                            return questionPageNo;

                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        // this.setState({ isLoadingPage: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getPageNo BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getPageRow = (pageNo: any) => {
        const index = pageNo - 1;
        return <PageQuestionListDesign ref={(ref) => { let pageElRefArr = this.state.pageElRef; pageElRefArr[index] = ref; this.setState({ pageElRef: pageElRefArr }); }} key={'page-'+pageNo} survey={this.state.survey} pageNo={pageNo} toPageHandler={this.toPageHandler} pageActionHandler={this.pageActionHandler} callAddLogoModal={this.callAddLogoModal} callSurveyRenameModal={this.callSurveyRenameModal} callSurveyHeaderDescriptionModal={this.callSurveyHeaderDescriptionModal} callSurveyFooterDescriptionModal={this.callSurveyFooterDescriptionModal} callEndOfSurveyMessageModal={this.callEndOfSurveyMessageModal} callSurveyCompletionRedirectModal={this.callSurveyCompletionRedirectModal} callSurveySubmitButtonModal={this.callSurveySubmitButtonModal} backgroundPath={this.state.bgPath} backgroundColor={this.state.survey.background_color} history={this.props.history} match={this.props.match}/>
    }

    getQuestionRow = async (surveyId: any, i: any, jwt: any) => {
      // console.log (`question no.${i}`);

        const index = i-1;  

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, jwt).then(
            async (rp) => {
                try{

                    if (rp.Status) {

                      // console.log(`getQuestionRow get question ${i}`, rp.Messages);
                      // console.log(`getQuestionRow get question ${i}`, rp.Data);
                      // console.log(`getQuestionRow get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length === 1){

                            const question = rp.Data.recordset[0];

                            const questionPageNo = question.page_no;
                            const questionNo = question.order_no;
                            const questionId = question.id[0];
                            const questionTypeId = question.type_id;
                            const questionSubTypeId = question.sub_type_id;

                            const questionLabel = question.question_label;
                            const questionLabelHtml = question.question_label_html ? question.question_label_html : `<p>${questionLabel}</p>`;
                            const questionActive = question.active;

                            const questionRequired = question.required;
                            const questionRequiredLabel = question.required_label;
                            const questionRequiredLabelHtml = question.required_label_html ? question.required_label_html : `<p>${questionRequiredLabel}</p>`;

                            const questionAnalyzeEntity = question.analyze_entity;
                            const questionAnalyzeSentiment = question.analyze_sentiment;

                            const questionSkipLogic = question.skip_logic ? question.skip_logic.split(',') : null;

                            const questionShowCommentField = question.show_comment_field;
                            const questionCommentFieldLabel = question.comment_field_label;
                            const questionCommentFieldLabelHtml = question.comment_field_label_html ? question.comment_field_label_html : `<p>${questionCommentFieldLabel}</p>`;
                            const questionCommentFieldHint = question.comment_field_hint;
                            const questionCommentFieldHintHtml = question.comment_field_hint_html ? question.comment_field_hint_html : `<p>${questionCommentFieldHint}</p>` ;

                            const questionShowConsentSection = question.enable_consent;
                          // console.log(`get question ${i} id = `, questionId);
                          // console.log(`get question ${i} type id = `, questionTypeId);
                          // console.log(`get question ${i} page no = `, questionPageNo);
                          // console.log(`get question ${i} no = `, questionNo);
                          // console.log(`get question ${i} label = `, questionLabel);
                          // console.log(`get question ${i} active = `, questionActive);

                          // console.log(`get question ${i} required = `, questionRequired);
                            
                          // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                          // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);

                          // console.log(`get question ${i} skip_logic = `, questionSkipLogic);
                          // console.log(`get question ${i} show_comment_field = `, questionShowCommentField);
                          // console.log(`get question ${i} comment_field_label = `, questionCommentFieldLabel);
                          // console.log(`get question ${i} comment_field_hint = `, questionCommentFieldHint);

                            let questionIdArr = this.state.questionId;
                            questionIdArr[index] = questionId;

                            let questionTypeIdArr = this.state.questionTypeId;
                            questionTypeIdArr[index] = questionTypeId;

                            let questionRequiredArr = this.state.questionRequired;
                            questionRequiredArr[index] = questionRequired ? true : false;

                            this.setState({
                                questionId: questionIdArr,
                                questionTypeId: questionTypeIdArr,
                                questionRequired: questionRequiredArr,
                                // questionElRef: questionElRefArr,
                            },  () => { 
                                  // console.log(`after questionId`, this.state.questionId);
                                  // console.log(`after questionTypeId`, this.state.questionTypeId);
                                  // console.log(`after questionRequired`, this.state.questionRequired);
                                    // console.log(`after questionElRef`, this.state.questionElRef);
                                } 
                            );

                            //Star Rating & Multiple choice variables
                            let choices = [] as any;
                            let choicesEN = [] as any;
                            let choicesHtml = [] as any;
                            let choicesENHtml = [] as any;
                            let weights = [] as any;

                            let weightAnswer = [] as any;
                            let toPage = [] as any;
                            let toQuestion = [] as any;

                            //NPS variables 
                            let weightAnswerFrom = [] as any;
                            let weightAnswerTo = [] as any;

                            //image variables 
                            const questionImageType = question.image_src_type ? question.image_src_type.split(',') : '';
                            const questionImageName = question.image_name ? question.image_name.split(',') : '';
                            const questionImageNameHtml = question.image_name_html ? question.image_name_html.split('~') : (question.image_name ? question.image_name.split(',').map((name: any) => { return `<p>${name}</p>`; } ) : '<p></p>');
                            const questionImageSrc = question.image_src ? question.image_src.split(',') : '';
                            const questionImageDesc = question.image_description ? question.image_description.split(',') : '';
                            
                            //count total question and get this current question location on this page
                            let matchCount = 0;
                            // let noOnPage = 0;
                          // console.log(`getQuestionRow this.state.allPromiseSkipQuestionPageNo`, this.state.allPromiseSkipQuestionPageNo);
                            this.state.allPromiseSkipQuestionPageNo.forEach((questionPageNo: any, index: any) => {
                              // console.log(` index = ${index} -> questionPageNo ${questionPageNo} this.state.question.page_no : ${question.page_no}`);
                                if(questionPageNo && parseInt(questionPageNo) === question.page_no){
                                    matchCount++;
                                }
                                // if(questionPageNo && parseInt(questionPageNo) === question.page_no &&
                                //         parseInt(question.order_no) === index+1 ){
                                //             noOnPage = matchCount;
                                // }
                            });
                          // console.log('matched count', matchCount);
                            // console.log('matched noOnPage', noOnPage);
                            
                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6 ){
                                
                              // console.log(`questionId ${questionId} question.choice`, question.choice);
                                const questionChoice = question.choice.split(',');
                                const questionChoiceHtml = question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; });
                                const questionChoiceEN = question.choice_EN ? question.choice_EN.split(',') : question.choice.split(',');
                                const questionChoiceENHtml = question.choice_EN_html ? question.choice_EN_html.split('~') : ( question.choice_html ? question.choice_html.split('~') : question.choice.split(',').map((choice: any) => { return `<p>${choice}</p>`; }) );
                              // console.log(`get question ${i} choice = `, questionChoice);
                                // console.log(`getQuestionRow get questionChoiceEN`, questionChoiceEN);

                                choices = [] as any;
                                choicesEN = [] as any;
                                choicesHtml = [] as any;
                                choicesENHtml = [] as any;
                                weights = [] as any;
                                for(let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                        choicesEN.push(questionChoiceEN[i]);
                                        choicesHtml.push(questionChoiceHtml[i]);
                                        choicesENHtml.push(questionChoiceENHtml[i]);
                                    } 
                                    else {
                                        weights.push(questionChoice[i]);
                                    }
                                }

                              // console.log(`get question ${i} choices = `, choices);
                            //   console.log(`getQuestionRow get question ${i} choicesEN = `, choicesEN);
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

                                if(!disableSkipLogicPage && !disableSkipLogicQuestion){
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
                                
                                if(!disableSkipLogicPage && !disableSkipLogicQuestion){
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
                                    id: questionId,
                                    typeId: questionTypeId,
                                    subTypeId: questionSubTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    choicesEN: choicesEN,
                                    imageEnabled: question.image_enabled,
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
                                }
                                // console.log(`questionTypeId ${questionTypeId} questionObj`, questionObj);

                            return <RatingQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-rating-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 2){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    id: questionId,
                                    typeId: questionTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    choicesEN: choicesEN,
                                    weights: weights,
                                    imageEnabled: question.image_enabled,
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
                                return <ChoiceQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-choice-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 3){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    id: questionId,
                                    typeId: questionTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    weights: weights,
                                    imageEnabled: question.image_enabled,
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
                                    showConsentSection: questionShowConsentSection,
                                }
                                return <CheckboxQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-checkbox-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 4){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    id: questionId,
                                    typeId: questionTypeId,
                                    subTypeId: questionSubTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    lowScoreLabel: question.low_score_label ? question.low_score_label : '',
                                    highScoreLabel: question.high_score_label ? question.high_score_label : '',
                                    lowScoreLabelHtml: question.low_score_label_html ? question.low_score_label_html : (question.low_score_label ? `<p>${question.low_score_label}</p>` : '<p></p>'),
                                    highScoreLabelHtml: question.high_score_label_html ? question.high_score_label_html : (question.high_score_label ? `<p>${question.high_score_label}</p>` : '<p></p>'),
                                    showLabel: question.show_label,
                                    imageEnabled: question.image_enabled,
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
                                return <ScoreQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-score-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 5){
                                const questionHint = question.hint;
                                const questionHintEN = question.hint_EN;
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    id: questionId,
                                    typeId: questionTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    hint: questionHint,
                                    hintEN: questionHintEN,
                                    imageEnabled: question.image_enabled,
                                    imageType: questionImageType,
                                    imageName: questionImageName,
                                    imageNameHtml: questionImageNameHtml,
                                    imageSrc: questionImageSrc,
                                    imageDesc: questionImageDesc,
                                    required: questionRequired,
                                    requiredLabel: questionRequiredLabel,
                                    requiredLabelHtml: questionRequiredLabelHtml,
                                }
                                return <TextQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-text-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }
                            else if(questionTypeId === 6){
                                const questionObj = {
                                    globalFont: this.state.survey.global_font_family,
                                    globalFontSize: this.state.survey.global_font_size ? this.state.survey.global_font_size : '20px',
                                    id: questionId,
                                    typeId: questionTypeId,
                                    templateQuestionId: question.template_question_id,
                                    no: questionNo,
                                    pageNo: questionPageNo,
                                    label: questionLabel,
                                    labelHtml: questionLabelHtml,
                                    choices: choices,
                                    choicesHtml: choicesHtml,
                                    weights: weights,
                                    imageEnabled: question.image_enabled,
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
                                return <DropdownQuestionDesign ref={(ref) => { let questionElRefArr = this.state.questionElRef; questionElRefArr[index] = ref; this.setState({ questionElRef: questionElRefArr }); }} key={'question-choice-'+i+'-'+this.getDateTime()} question={questionObj} callModal={this.callModal} handleDeleteQuestion={this.handleDeleteQuestion} handleMoveQuestion={this.handleMoveQuestion} oneOnPage={matchCount === 1 ? true : false} first={questionNo === 1 ? true : false} last={questionNo === this.state.numQuestion ? true : false} history={this.props.history} match={this.props.match}/>
                            }

                          // console.log(`got question ${i} element`, element);
                            return element;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return <div key={index}></div>;
                        }

                    } else {
                        // this.setState({ isLoadingPage: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getQuestionRow BaseService.get<Question> /question/${surveyId}/${i} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return <div key={index}></div>;
                    }
                } catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design getQuestionRow BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    toolChange = (e: any, arg1: any) => {
      // console.log('toggleBox', arg1);
        this.setState({ sidebarTool: arg1 }, () => {
        //   console.log(this.state.sidebarTool)
        });
    };

    onChangeQuestionBankLang = (e: RadioChangeEvent) => {
        // console.log('onChangeQuestionBankLang checked', e.target.value);
        this.setState({
            questionBankLang: e.target.value,
            isLoadingDesign: true
        }, () => {
            this.renderElement();
        });
    };

    // createMenuRow() {
    //     // console.log('createMenuRow', this.props.pageNo);
    //     let menuRow = [];
    
    //     // Outer loop to create parent
    //     for (let pageNo = 1; pageNo <= parseInt(this.props.survey.num_page as string); pageNo++) {

    //         menuRow.push(
    //             <Menu.Item key={"Page "+pageNo}>
    //                 <a href="# " onClick={()=>this.toPage(pageNo)}  style={{ textDecoration: 'none' }}>Page {pageNo}</a>
    //             </Menu.Item>
    //         );
            
    //     }
    //     return menuRow;
    // }

    // async createFontRow() {
    //     console.log('createFontRow');
    //     let fontRow = [] as any;
    
    //     const jwt = getJwtToken();
    //     BaseService.getJSON(this.props.match.params.xSite, "/font", '', jwt).then(
    //         (rp) => {
    //             try{
    //                 if (rp.Status) {
                        
    //                     const fonts = rp.Data.result.recordset;
    //                     console.log('fonts', fonts);
    //                     // fonts.map((fontData: any) => {
    //                     //     fontRow.push(
    //                     //         <Menu.Item key={`font-${fontData.id}`}>
    //                     //             <a href="# " onClick={()=>this.setGlobalFont(fontData.font_name)} style={{ textDecoration: 'none' }}>{fontData.font_family}</a>
    //                     //         </Menu.Item>
    //                     //     );
    //                     // });

    //                     // console.log('fontRow', fontRow);

    //                     return fontRow;

    //                 } else {
    //                     BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createFontRow BaseService.getJSON /font else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
    //                     return [];
    //                 }
    //             }catch(error){ 
    //                 BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'demo-design.component createFontRow BaseService.getJSON /font catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
    //                 return [];
    //             }
    //         }
    //     );
    // }

    setGlobalFont = (fontData: any) => {
        // console.log('setGlobalFont fontData', fontData);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, { global_font_name: fontData.font_name, global_font_family: fontData.font_family }, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.setState({ globalFontName: fontData.font_name }, () => {
                            setTimeout(function(){ window.location.reload(); }, 500);
                        });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `demo-design.component setGlobalFont BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `demo-design.component setGlobalFont catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }
    
    setGlobalFontSize = (fontSize: any) => {
        // console.log('setGlobalFontSize fontSize', fontSize);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, { global_font_size: fontSize }, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.setState({ globalFontSize: fontSize }, () => {
                            setTimeout(function(){ window.location.reload(); }, 500);
                        });
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `demo-design.component setGlobalFontSize BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `demo-design.component setGlobalFontSize catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    CollapseCallback = (key: any) => {
        // console.log('CollapseCallback key', key);

        const jwt = getJwtToken();  
        BaseService.get(this.props.match.params.xSite ,"/templates", '', jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {
                        // console.log('rp', rp);
                        // console.log('rp.Data', rp.Data);
                        // console.log('rp.Data.result.recordset', rp.Data.result.recordset);
                        const templates = rp.Data.result.recordset;
                        const templateType = rp.Data.type;
                        // console.log('templates.length', templates.length);
                        // console.log('templates', templates);
                        // console.log('templateType', templateType);

                        if(!templates.length) return;
                        
                        let areaOfImpactName = templates[0].name_area_of_impacts.includes(",") ? templates[0].name_area_of_impacts.split(',') : [templates[0].name_area_of_impacts];
                        //replace &amp; with & character
                        areaOfImpactName = areaOfImpactName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

                        if(templateType === 'realestate'){
                            /* Real Estate */

                            let nodeTemplateCallCenter = [], nodeTemplateSales = [], nodeTemplateContract = [], nodeTemplateInspection = [], nodeTemplateTransfer = [], nodeTemplateWarranty = [], nodeTemplateAfterWarranty = [], nodeTemplateResaleRental = [], nodeTemplateJuristicPerson = [], nodeTemplateOnline = [], nodeTemplateCovid19Impact = [], nodeTemplateHR = [];

                            if(key[0] === 'panel-0') nodeTemplateCallCenter = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 1; }).length);
                            if(key[0] === 'panel-1') nodeTemplateSales = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 2; }).length);
                            if(key[0] === 'panel-2') nodeTemplateContract = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 3; }).length);
                            if(key[0] === 'panel-3') nodeTemplateInspection = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 4; }).length);
                            if(key[0] === 'panel-4') nodeTemplateTransfer = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 5; }).length);
                            if(key[0] === 'panel-5') nodeTemplateWarranty = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 6; }).length);
                            if(key[0] === 'panel-6') nodeTemplateAfterWarranty = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 7; }).length);
                            if(key[0] === 'panel-7') nodeTemplateResaleRental = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 8; }).length);
                            if(key[0] === 'panel-8') nodeTemplateJuristicPerson = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 9; }).length);
                            if(key[0] === 'panel-9') nodeTemplateCovid19Impact = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 10; }).length);
                            if(key[0] === 'panel-10') nodeTemplateOnline = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 11; }).length);
                            if(key[0] === 'panel-11') nodeTemplateHR = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 98; }).length);

                            if(key[0] === 'panel-0') for(let i = 0; i < nodeTemplateCallCenter.length; i++) { nodeTemplateCallCenter[i] = ''; }
                            if(key[0] === 'panel-1') for(let i = 0; i < nodeTemplateSales.length; i++) { nodeTemplateSales[i] = ''; }
                            if(key[0] === 'panel-2') for(let i = 0; i < nodeTemplateContract.length; i++) { nodeTemplateContract[i] = ''; }
                            if(key[0] === 'panel-3') for(let i = 0; i < nodeTemplateInspection.length; i++) { nodeTemplateInspection[i] = ''; }
                            if(key[0] === 'panel-4') for(let i = 0; i < nodeTemplateTransfer.length; i++) { nodeTemplateTransfer[i] = ''; }
                            if(key[0] === 'panel-5') for(let i = 0; i < nodeTemplateWarranty.length; i++) { nodeTemplateWarranty[i] = ''; }
                            if(key[0] === 'panel-6') for(let i = 0; i < nodeTemplateAfterWarranty.length; i++) { nodeTemplateAfterWarranty[i] = ''; }
                            if(key[0] === 'panel-7') for(let i = 0; i < nodeTemplateResaleRental.length; i++) { nodeTemplateResaleRental[i] = ''; }
                            if(key[0] === 'panel-8') for(let i = 0; i < nodeTemplateJuristicPerson.length; i++) { nodeTemplateJuristicPerson[i] = ''; }
                            if(key[0] === 'panel-9') for(let i = 0; i < nodeTemplateCovid19Impact.length; i++) { nodeTemplateCovid19Impact[i] = ''; }
                            if(key[0] === 'panel-10') for(let i = 0; i < nodeTemplateOnline.length; i++) { nodeTemplateOnline[i] = ''; }
                            if(key[0] === 'panel-11') for(let i = 0; i < nodeTemplateHR.length; i++) { nodeTemplateHR[i] = ''; }

                            let allTemplateCallCenterElement = [] as any, allTemplateSalesElement = [] as any, allTemplateContractElement = [] as any, allTemplateInspectionElement = [] as any, allTemplateTransferElement = [] as any, allTemplateWarrantyElement = [] as any, allTemplateAfterWarrantyElement = [] as any, allTemplateResaleRentalElement = [] as any, allTemplateJuristicPersonElement = [] as any, allTemplateOnlineElement = [] as any, allTemplateCovid19ImpactElement = [] as any, allTemplateHRElement = [] as any;

                            if(key[0] === 'panel-0') allTemplateCallCenterElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 1)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-1') allTemplateSalesElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 2)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-2') allTemplateContractElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 3)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-3') allTemplateInspectionElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 4)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-4') allTemplateTransferElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 5)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-5') allTemplateWarrantyElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 6)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-6') allTemplateAfterWarrantyElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 7)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-7') allTemplateResaleRentalElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 8)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-8') allTemplateJuristicPersonElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 9)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-9') allTemplateCovid19ImpactElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 10)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-10') allTemplateOnlineElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 11)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-11') allTemplateHRElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 98)).filter(function (item: any) { return item !== null; }) as any;
                            
                            // console.log('allTemplateSalesElement', allTemplateSalesElement);
                            // console.log("Sorting based on the item property")
                            // console.log(allTemplateSalesElement.sort(this.dynamicSort("template_question_status","asc")));
                            if(key[0] === 'panel-0') allTemplateCallCenterElement = allTemplateCallCenterElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-1') allTemplateSalesElement = allTemplateSalesElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-2') allTemplateContractElement = allTemplateContractElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-3') allTemplateInspectionElement = allTemplateInspectionElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-4') allTemplateTransferElement = allTemplateTransferElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-5') allTemplateWarrantyElement = allTemplateWarrantyElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-6') allTemplateAfterWarrantyElement = allTemplateAfterWarrantyElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-7') allTemplateResaleRentalElement = allTemplateResaleRentalElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-8') allTemplateJuristicPersonElement = allTemplateJuristicPersonElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-9') allTemplateCovid19ImpactElement = allTemplateCovid19ImpactElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-10') allTemplateOnlineElement = allTemplateOnlineElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-11') allTemplateHRElement = allTemplateHRElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            // console.log('after allTemplateSalesElement', allTemplateSalesElement);

                            if(key[0] === 'panel-0') if(allTemplateCallCenterElement.length){ ReactDOM.render(allTemplateCallCenterElement, document.getElementById('touchpoint-list-0')); }
                            if(key[0] === 'panel-1') if(allTemplateSalesElement.length){ ReactDOM.render(allTemplateSalesElement, document.getElementById('touchpoint-list-1')); }
                            if(key[0] === 'panel-2') if(allTemplateContractElement.length){ ReactDOM.render(allTemplateContractElement, document.getElementById('touchpoint-list-2')); }
                            if(key[0] === 'panel-3') if(allTemplateInspectionElement.length){ ReactDOM.render(allTemplateInspectionElement, document.getElementById('touchpoint-list-3')); }
                            if(key[0] === 'panel-4') if(allTemplateTransferElement.length){ ReactDOM.render(allTemplateTransferElement, document.getElementById('touchpoint-list-4')); }
                            if(key[0] === 'panel-5') if(allTemplateWarrantyElement.length){ ReactDOM.render(allTemplateWarrantyElement, document.getElementById('touchpoint-list-5')); }
                            if(key[0] === 'panel-6') if(allTemplateAfterWarrantyElement.length){ ReactDOM.render(allTemplateAfterWarrantyElement, document.getElementById('touchpoint-list-6')); }
                            if(key[0] === 'panel-7') if(allTemplateResaleRentalElement.length){ ReactDOM.render(allTemplateResaleRentalElement, document.getElementById('touchpoint-list-7')); }
                            if(key[0] === 'panel-8') if(allTemplateJuristicPersonElement.length){ ReactDOM.render(allTemplateJuristicPersonElement, document.getElementById('touchpoint-list-8')); }
                            if(key[0] === 'panel-9') if(allTemplateCovid19ImpactElement.length){ ReactDOM.render(allTemplateCovid19ImpactElement, document.getElementById('touchpoint-list-9')); }
                            if(key[0] === 'panel-10') if(allTemplateOnlineElement.length){ ReactDOM.render(allTemplateOnlineElement, document.getElementById('touchpoint-list-10')); }
                            if(key[0] === 'panel-11') if(allTemplateHRElement.length){ ReactDOM.render(allTemplateHRElement, document.getElementById('touchpoint-list-11')); }
                        }
                        else if(templateType === 'restaurant'){
                            /* Restaurant */
                            let nodeTemplateRestaurantDineIn = [], nodeTemplateRestaurantDelivery = [], nodeTemplateCoffeeShop = [], nodeTemplateHR = [];
                            
                            if(key[0] === 'panel-0') nodeTemplateRestaurantDineIn = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 1; }).length);
                            if(key[0] === 'panel-1') nodeTemplateRestaurantDelivery = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 2; }).length);
                            if(key[0] === 'panel-2') nodeTemplateCoffeeShop = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 3; }).length);
                            if(key[0] === 'panel-3') nodeTemplateHR = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 98; }).length);

                            if(key[0] === 'panel-0') for(let i = 0; i < nodeTemplateRestaurantDineIn.length; i++) { nodeTemplateRestaurantDineIn[i] = ''; }
                            if(key[0] === 'panel-1') for(let i = 0; i < nodeTemplateRestaurantDelivery.length; i++) { nodeTemplateRestaurantDelivery[i] = ''; }
                            if(key[0] === 'panel-2') for(let i = 0; i < nodeTemplateCoffeeShop.length; i++) { nodeTemplateCoffeeShop[i] = ''; }
                            if(key[0] === 'panel-3') for(let i = 0; i < nodeTemplateHR.length; i++) { nodeTemplateHR[i] = ''; }

                            let allTemplateRestaurantDineInElement = [], allTemplateRestaurantDeliveryElement = [], allTemplateCoffeeShopElement = [], allTemplateHRElement = [];

                            if(key[0] === 'panel-0') allTemplateRestaurantDineInElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 1)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-1') allTemplateRestaurantDeliveryElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 2)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-2') allTemplateCoffeeShopElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 3)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-3') allTemplateHRElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 98)).filter(function (item: any) { return item !== null; }) as any;
                            
                            if(key[0] === 'panel-0') allTemplateRestaurantDineInElement = allTemplateRestaurantDineInElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-1') allTemplateRestaurantDeliveryElement = allTemplateRestaurantDeliveryElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-2') allTemplateCoffeeShopElement = allTemplateCoffeeShopElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-3') allTemplateHRElement = allTemplateHRElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });

                            if(key[0] === 'panel-0') if(allTemplateRestaurantDineInElement.length){ ReactDOM.render(allTemplateRestaurantDineInElement, document.getElementById('touchpoint-list-0')); }
                            if(key[0] === 'panel-1') if(allTemplateRestaurantDeliveryElement.length){ ReactDOM.render(allTemplateRestaurantDeliveryElement, document.getElementById('touchpoint-list-1')); }
                            if(key[0] === 'panel-2') if(allTemplateCoffeeShopElement.length){ ReactDOM.render(allTemplateCoffeeShopElement, document.getElementById('touchpoint-list-2')); }
                            if(key[0] === 'panel-3') if(allTemplateHRElement.length){ ReactDOM.render(allTemplateHRElement, document.getElementById('touchpoint-list-3')); }
                        }
                        else if(templateType === 'education'){
                            /* Education */
                            let nodeTemplateGeneralSchool = [], nodeTemplateOnlineLearning = [], nodeTemplateFaculty = [], nodeTemplateCourseEvaluation = [], nodeTemplateGradeSatisfaction = [], nodeTemplateParent = [], nodeTemplateHR = [];

                            if(key[0] === 'panel-0') nodeTemplateGeneralSchool = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 1; }).length);
                            if(key[0] === 'panel-1') nodeTemplateOnlineLearning = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 2; }).length);
                            if(key[0] === 'panel-2') nodeTemplateFaculty = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 3; }).length);
                            if(key[0] === 'panel-3') nodeTemplateCourseEvaluation = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 4; }).length);
                            if(key[0] === 'panel-4') nodeTemplateGradeSatisfaction = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 5; }).length);
                            if(key[0] === 'panel-5') nodeTemplateParent = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 6; }).length);
                            if(key[0] === 'panel-6') nodeTemplateHR = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 98; }).length);

                            if(key[0] === 'panel-0') for(let i = 0; i < nodeTemplateGeneralSchool.length; i++) { nodeTemplateGeneralSchool[i] = ''; }
                            if(key[0] === 'panel-1') for(let i = 0; i < nodeTemplateOnlineLearning.length; i++) { nodeTemplateOnlineLearning[i] = ''; }
                            if(key[0] === 'panel-2') for(let i = 0; i < nodeTemplateFaculty.length; i++) { nodeTemplateFaculty[i] = ''; }
                            if(key[0] === 'panel-3') for(let i = 0; i < nodeTemplateCourseEvaluation.length; i++) { nodeTemplateCourseEvaluation[i] = ''; }
                            if(key[0] === 'panel-4') for(let i = 0; i < nodeTemplateGradeSatisfaction.length; i++) { nodeTemplateGradeSatisfaction[i] = ''; }
                            if(key[0] === 'panel-5') for(let i = 0; i < nodeTemplateParent.length; i++) { nodeTemplateParent[i] = ''; }
                            if(key[0] === 'panel-6') for(let i = 0; i < nodeTemplateHR.length; i++) { nodeTemplateHR[i] = ''; }

                            let allTemplateGeneralSchoolElement = [], allTemplateOnlineLearningElement = [], allTemplateFacultyElement = [], allTemplateCourseEvaluationElement = [], allTemplateGradeSatisfactionElement = [], allTemplateParentElement = [], allTemplateHRElement = [];

                            if(key[0] === 'panel-0') allTemplateGeneralSchoolElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 1)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-1') allTemplateOnlineLearningElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 2)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-2') allTemplateFacultyElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 3)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-3') allTemplateCourseEvaluationElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 4)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-4') allTemplateGradeSatisfactionElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 5)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-5') allTemplateParentElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 6)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-6') allTemplateHRElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 98)).filter(function (item: any) { return item !== null; }) as any;
                            
                            if(key[0] === 'panel-0') allTemplateGeneralSchoolElement = allTemplateGeneralSchoolElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-1') allTemplateOnlineLearningElement = allTemplateOnlineLearningElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-2') allTemplateFacultyElement = allTemplateFacultyElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-3') allTemplateCourseEvaluationElement = allTemplateCourseEvaluationElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-4') allTemplateGradeSatisfactionElement = allTemplateGradeSatisfactionElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-5') allTemplateParentElement = allTemplateParentElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-6') allTemplateHRElement = allTemplateHRElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });

                            if(key[0] === 'panel-0') if(allTemplateGeneralSchoolElement.length){ ReactDOM.render(allTemplateGeneralSchoolElement, document.getElementById('touchpoint-list-0')); }
                            if(key[0] === 'panel-1') if(allTemplateOnlineLearningElement.length){ ReactDOM.render(allTemplateOnlineLearningElement, document.getElementById('touchpoint-list-1')); }
                            if(key[0] === 'panel-2') if(allTemplateFacultyElement.length){ ReactDOM.render(allTemplateFacultyElement, document.getElementById('touchpoint-list-2')); }
                            if(key[0] === 'panel-3') if(allTemplateCourseEvaluationElement.length){ ReactDOM.render(allTemplateCourseEvaluationElement, document.getElementById('touchpoint-list-3')); }
                            if(key[0] === 'panel-4') if(allTemplateGradeSatisfactionElement.length){ ReactDOM.render(allTemplateGradeSatisfactionElement, document.getElementById('touchpoint-list-4')); }
                            if(key[0] === 'panel-5') if(allTemplateParentElement.length){ ReactDOM.render(allTemplateParentElement, document.getElementById('touchpoint-list-5')); }
                            if(key[0] === 'panel-6') if(allTemplateHRElement.length){ ReactDOM.render(allTemplateHRElement, document.getElementById('touchpoint-list-6')); }
                        }
                        else if(templateType === 'bank'){
                            /* Bank */
                            let nodeTemplateGeneral = [], nodeTemplateBankBranch = [], nodeTemplateProduct = [], nodeTemplateOnlineBanking = [], nodeTemplateAtHomeService = [], nodeTemplateHR = [];

                            if(key[0] === 'panel-0') nodeTemplateGeneral = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 1; }).length);
                            if(key[0] === 'panel-1') nodeTemplateBankBranch = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 2; }).length);
                            if(key[0] === 'panel-2') nodeTemplateProduct = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 3; }).length);
                            if(key[0] === 'panel-3') nodeTemplateOnlineBanking = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 4; }).length);
                            if(key[0] === 'panel-4') nodeTemplateAtHomeService = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 5; }).length);
                            if(key[0] === 'panel-5') nodeTemplateHR = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 98; }).length);

                            if(key[0] === 'panel-0') for(let i = 0; i < nodeTemplateGeneral.length; i++) { nodeTemplateGeneral[i] = ''; }
                            if(key[0] === 'panel-1') for(let i = 0; i < nodeTemplateBankBranch.length; i++) { nodeTemplateBankBranch[i] = ''; }
                            if(key[0] === 'panel-2') for(let i = 0; i < nodeTemplateProduct.length; i++) { nodeTemplateProduct[i] = ''; }
                            if(key[0] === 'panel-3') for(let i = 0; i < nodeTemplateOnlineBanking.length; i++) { nodeTemplateOnlineBanking[i] = ''; }
                            if(key[0] === 'panel-4') for(let i = 0; i < nodeTemplateAtHomeService.length; i++) { nodeTemplateAtHomeService[i] = ''; }
                            if(key[0] === 'panel-5') for(let i = 0; i < nodeTemplateHR.length; i++) { nodeTemplateHR[i] = ''; }

                            let allTemplateGeneralElement = [], allTemplateBankBranchElement = [], allTemplateProductElement = [], allTemplateOnlineBankingElement = [], allTemplateAtHomeServiceElement = [], allTemplateHRElement = [];

                            if(key[0] === 'panel-0') allTemplateGeneralElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 1)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-1') allTemplateBankBranchElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 2)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-2') allTemplateProductElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 3)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-3') allTemplateOnlineBankingElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 4)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-4') allTemplateAtHomeServiceElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 5)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-5') allTemplateHRElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 98)).filter(function (item: any) { return item !== null; }) as any;
                            
                            if(key[0] === 'panel-0') allTemplateGeneralElement = allTemplateGeneralElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-1') allTemplateBankBranchElement = allTemplateBankBranchElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-2') allTemplateProductElement = allTemplateProductElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-3') allTemplateOnlineBankingElement = allTemplateOnlineBankingElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-4') allTemplateAtHomeServiceElement = allTemplateAtHomeServiceElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-5') allTemplateHRElement = allTemplateHRElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });

                            if(key[0] === 'panel-0') if(allTemplateGeneralElement.length){ ReactDOM.render(allTemplateGeneralElement, document.getElementById('touchpoint-list-0')); }
                            if(key[0] === 'panel-1') if(allTemplateBankBranchElement.length){ ReactDOM.render(allTemplateBankBranchElement, document.getElementById('touchpoint-list-1')); }
                            if(key[0] === 'panel-2') if(allTemplateProductElement.length){ ReactDOM.render(allTemplateProductElement, document.getElementById('touchpoint-list-2')); }
                            if(key[0] === 'panel-3') if(allTemplateOnlineBankingElement.length){ ReactDOM.render(allTemplateOnlineBankingElement, document.getElementById('touchpoint-list-3')); }
                            if(key[0] === 'panel-4') if(allTemplateAtHomeServiceElement.length){ ReactDOM.render(allTemplateAtHomeServiceElement, document.getElementById('touchpoint-list-4')); }
                            if(key[0] === 'panel-5') if(allTemplateHRElement.length){ ReactDOM.render(allTemplateHRElement, document.getElementById('touchpoint-list-5')); }
                        }
                        else if(templateType === 'medicine'){
                            /* Medicine */
                            let nodeTemplateHR = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 98; }).length);

                            for(let i = 0; i < nodeTemplateHR.length; i++) { nodeTemplateHR[i] = ''; }

                            let allTemplateHRElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 98)).filter(function (item: any) { return item !== null; }) as any;
                            
                            allTemplateHRElement = allTemplateHRElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });

                            if(allTemplateHRElement.length){ ReactDOM.render(allTemplateHRElement, document.getElementById('touchpoint-list-0')); }
                        }
                        else if(templateType === 'healthcare'){
                            /* Health care */

                            let nodeTemplateDischarge = [], nodeTemplateRegistration = [], nodeTemplateCheckUp = [], nodeTemplateAdmission = [], nodeTemplateNursesCare = [], nodeTemplateDoctors = [], nodeTemplateInPatient = [], nodeTemplateCovid19 = [];

                            if(key[0] === 'panel-0') nodeTemplateDischarge = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 1; }).length);
                            if(key[0] === 'panel-1') nodeTemplateRegistration = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 2; }).length);
                            if(key[0] === 'panel-2') nodeTemplateCheckUp = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 3; }).length);
                            if(key[0] === 'panel-3') nodeTemplateAdmission = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 4; }).length);
                            if(key[0] === 'panel-4') nodeTemplateNursesCare = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 5; }).length);
                            if(key[0] === 'panel-5') nodeTemplateDoctors = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 6; }).length);
                            if(key[0] === 'panel-6') nodeTemplateInPatient = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 7; }).length);
                            if(key[0] === 'panel-7') nodeTemplateCovid19 = new Array<any>(templates.filter(function (item: any) { return item.touchpoint_id === 8; }).length);

                            if(key[0] === 'panel-0') for(let i = 0; i < nodeTemplateDischarge.length; i++) { nodeTemplateDischarge[i] = ''; }
                            if(key[0] === 'panel-1') for(let i = 0; i < nodeTemplateRegistration.length; i++) { nodeTemplateRegistration[i] = ''; }
                            if(key[0] === 'panel-2') for(let i = 0; i < nodeTemplateCheckUp.length; i++) { nodeTemplateCheckUp[i] = ''; }
                            if(key[0] === 'panel-3') for(let i = 0; i < nodeTemplateAdmission.length; i++) { nodeTemplateAdmission[i] = ''; }
                            if(key[0] === 'panel-4') for(let i = 0; i < nodeTemplateNursesCare.length; i++) { nodeTemplateNursesCare[i] = ''; }
                            if(key[0] === 'panel-5') for(let i = 0; i < nodeTemplateDoctors.length; i++) { nodeTemplateDoctors[i] = ''; }
                            if(key[0] === 'panel-6') for(let i = 0; i < nodeTemplateInPatient.length; i++) { nodeTemplateInPatient[i] = ''; }
                            if(key[0] === 'panel-7') for(let i = 0; i < nodeTemplateCovid19.length; i++) { nodeTemplateCovid19[i] = ''; }

                            let allTemplateDischargeElement = [] as any, allTemplateRegistrationElement = [] as any, allTemplateCheckUpElement = [] as any, allTemplateAdmissionElement = [] as any, allTemplateNursesCareElement = [] as any, allTemplateDoctorsElement = [] as any, allTemplateInPatientElement = [] as any, allTemplateCovid19Element = [] as any;

                            if(key[0] === 'panel-0') allTemplateDischargeElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 1)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-1') allTemplateRegistrationElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 2)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-2') allTemplateCheckUpElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 3)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-3') allTemplateAdmissionElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 4)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-4') allTemplateNursesCareElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 5)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-5') allTemplateDoctorsElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 6)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-6') allTemplateInPatientElement = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 7)).filter(function (item: any) { return item !== null; }) as any;
                            if(key[0] === 'panel-7') allTemplateCovid19Element = templates.map((obj: any, i: any) => this.getTemplateRow(i, templates, areaOfImpactName, 8)).filter(function (item: any) { return item !== null; }) as any;
                            
                            if(key[0] === 'panel-0') allTemplateDischargeElement = allTemplateDischargeElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-1') allTemplateRegistrationElement = allTemplateRegistrationElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-2') allTemplateCheckUpElement = allTemplateCheckUpElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-3') allTemplateAdmissionElement = allTemplateAdmissionElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-4') allTemplateNursesCareElement = allTemplateNursesCareElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-5') allTemplateDoctorsElement = allTemplateDoctorsElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-6') allTemplateInPatientElement = allTemplateInPatientElement.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });
                            if(key[0] === 'panel-7') allTemplateCovid19Element = allTemplateCovid19Element.sort(this.dynamicSort("template_question_status","asc")).map((obj: any, i: any) => { return obj.element });

                            if(key[0] === 'panel-0') if(allTemplateDischargeElement.length){ ReactDOM.render(allTemplateDischargeElement, document.getElementById('touchpoint-list-0')); }
                            if(key[0] === 'panel-1') if(allTemplateRegistrationElement.length){ ReactDOM.render(allTemplateRegistrationElement, document.getElementById('touchpoint-list-1')); }
                            if(key[0] === 'panel-2') if(allTemplateCheckUpElement.length){ ReactDOM.render(allTemplateCheckUpElement, document.getElementById('touchpoint-list-2')); }
                            if(key[0] === 'panel-3') if(allTemplateAdmissionElement.length){ ReactDOM.render(allTemplateAdmissionElement, document.getElementById('touchpoint-list-3')); }
                            if(key[0] === 'panel-4') if(allTemplateNursesCareElement.length){ ReactDOM.render(allTemplateNursesCareElement, document.getElementById('touchpoint-list-4')); }
                            if(key[0] === 'panel-5') if(allTemplateDoctorsElement.length){ ReactDOM.render(allTemplateDoctorsElement, document.getElementById('touchpoint-list-5')); }
                            if(key[0] === 'panel-6') if(allTemplateInPatientElement.length){ ReactDOM.render(allTemplateInPatientElement, document.getElementById('touchpoint-list-6')); }
                            if(key[0] === 'panel-7') if(allTemplateCovid19Element.length){ ReactDOM.render(allTemplateCovid19Element, document.getElementById('touchpoint-list-7')); }
                        }
                        
                    } else {
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design renderElement BaseService.get /templates else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'design renderElement BaseService.get /templates catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file: any) => {
        // console.log('file', file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            // message.error('You can only upload JPG/PNG file!');
            toastr.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   message.error('Image must smaller than 2MB!');
        // }
        // return isJpgOrPng && isLt2M;
    }

    handleBackgroundChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingBackgroundImage: true });
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (bgPath: any) =>
                this.setState({
                    bgPath: bgPath,
                    survey: { 
                        ...this.state.survey,
                        [`background_color`]: ''
                    },
                    loadingBackgroundImage: false,
                }, () => { 
                    /*console.log('bgPath', bgPath)*/
                }),
            );
            // message.success(`${info.file.name} file uploaded successfully`);
            toastr.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // message.error(`${info.file.name} file upload failed.`);
            toastr.error(`${info.file.name} file upload failed.`);
        }

    };

    customRequestBackground = (componentsData: any) => {
        // console.log('customRequestBackground componentsData', componentsData);
        let formData = new FormData();
        formData.append('file', componentsData.file);
        formData.append('domain', 'POST');
        formData.append('filename', componentsData.file.name );

        fetch(`${process.env.REACT_APP_BASE_URL}/upload/bg`, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getJwtToken() as string}`,
                'x-site' : this.props.match.params.xSite as string
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => { 
        //   console.log('data', data); 
          // console.log('data.url', data.url); 

            this.setState({
                bgPath: data.url,
                survey: { 
                    ...this.state.survey,
                    [`background_color`]: ''
                }
            }, () => { 
                // console.log('this.state.image_src', this.state.image_src) 
                const jwt = getJwtToken();
                // BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image'], [this.state.bgPath]), jwt).then(
                    BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image', 'background_color'], [this.state.bgPath, '']), jwt).then(
                    (rp) => {
                        if (rp.Status) {
                            // console.log(rp);
                            toastr.success(rp.Messages);
                            this.renderElement();
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Design customRequestBackground BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
                
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Design customRequestBackground fetch ${process.env.REACT_APP_BASE_URL}/upload/bg catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading background image")
        })      
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color: any) => {
        // console.log('handleChange color', color);
        // console.log('handleChange color.hex', color.hex);
        this.setState({ 
            bgPath: '',
            color: color.rgb,
            survey: { 
                ...this.state.survey,
                [`background_color`]: color.hex 
            }
        }, () => {
            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, ['background_image', 'background_color'], ['', this.state.survey.background_color]), jwt).then(
                (rp) => {
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.renderElement();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `Design handleChange BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }
            );
        })
    };
    
    Rename = () => {
        // console.log('Rename');
        this.setState({
            visible: true
        });
    }

    render() {

        const fontList = () => (
            <Menu>
                {this.state.fontRow}
            </Menu>
        );
        const sizeList = () => (
            <Menu>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('12px')} style={{ textDecoration: 'none' }}>12px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('14px')} style={{ textDecoration: 'none' }}>14px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('16px')} style={{ textDecoration: 'none' }}>16px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('18px')} style={{ textDecoration: 'none' }}>18px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('20px')} style={{ textDecoration: 'none' }}>20px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('22px')} style={{ textDecoration: 'none' }}>22px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('24px')} style={{ textDecoration: 'none' }}>24px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('26px')} style={{ textDecoration: 'none' }}>26px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('28px')} style={{ textDecoration: 'none' }}>28px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('30px')} style={{ textDecoration: 'none' }}>30px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('32px')} style={{ textDecoration: 'none' }}>32px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('34px')} style={{ textDecoration: 'none' }}>34px</a></Menu.Item>
                <Menu.Item><a href="# " onClick={()=>this.setGlobalFontSize('36px')} style={{ textDecoration: 'none' }}>36px</a></Menu.Item>
            </Menu>
        );
        const uploadButton = (
            <div>
              <Icon type={this.state.loadingBackgroundImage ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
        );

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                    backgroundColor: this.state.survey.background_color ? this.state.survey.background_color : '#FFFFFF'
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
            },
        });

        if (this.state.isLoadingPage) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (

            // <div id="create" className="translate step2 basic modern-browser themeV3 sticky">
            // <div style={{borderBottom: "1px solid #d1d2d3"}}>
            <div ref={ el => this.container = el} style={containerStyles}> 

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <div className="content-wrapper">

                    <header className="subhead">
                        <nav className="navigationTabs">
                            <div className="global-navigation-header ">
                                <div className="global-navigation-header-title-container global-navigation-header-centered clearfix" style={{ paddingTop:'4px', paddingBottom:'10px', paddingLeft:'25px' }}>
                                    <h1 className="wds-pageheader__title wds-type--section-title wds-type--section-title-custom">
                                    <span><Icon type="edit" onClick={()=>this.Rename()}/> {this.state.survey.nickname}</span>
                                    </h1>
                                </div>
                                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'design'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>
                            </div>
                        </nav>
                    </header>

                    <div className="bd logged-in-bd" style={{marginTop: '160px'}}>
                        <div className="container clearfix">

                            <div id="step2" className="clearfix survey-body-v3 survey-body theme-body">
                                <aside id="sidebar" className="stick upgrade">
                                    
                                    <div id="createAccordion" className="accordion unique" style={{height: '100vh'}}>
                                        <nav className="sidenav-view collapsible" style={{height: '100vh'}}>
                                            <ul>
                                                {/* <Tooltip placement="leftBottom" title="Question Bank">
                                                    <li onClick={ (e) => this.toolChange(e, "bank") } data-sidebar="accQuestionBank" className={ this.state.sidebarTool === "bank" ? "nav-tabs-select-style" : "" } sm-tooltip-side="right" title="">
                                                        <a href="# " className="notranslate">
                                                            <Icon type="database"/>
                                                        </a>
                                                    </li>
                                                </Tooltip> */}
                                                <Tooltip placement="leftBottom" title="Create a New Question">
                                                    <li onClick={ (e) => this.toolChange(e, "builder") } data-sidebar="accBuilder" sm-tooltip-side="right" className={ this.state.sidebarTool === "builder" ? "nav-tabs-select-style" : "" } title="">
                                                        <a href="# " className="notranslate">
                                                            <Icon type="edit"/>
                                                        </a>
                                                    </li>
                                                </Tooltip>
                                                <Tooltip placement="leftBottom" title="Survey Background">
                                                    <li onClick={ (e) => this.toolChange(e, "background") } data-sidebar="accBackground" sm-tooltip-side="right" className={ this.state.sidebarTool === "background" ? "nav-tabs-select-style" : "" } title="">
                                                        <a href="# " className="notranslate">
                                                            <Icon type="picture"/>
                                                        </a>
                                                    </li>
                                                </Tooltip>
                                            </ul>
                                        </nav>
                                                        
                                        <div id="accBuilder" className={ this.state.sidebarTool === "builder" ? "key open" : "key hidden" } style={{ display: 'block', maxHeight: '100%' }}>
                                            <header>
                                                <h3 className="accordionLabel">
                                                    <a href="# " onClick={ (e) => { e.preventDefault() } } className="press keyOpener" target="#accPanelBuilder" data-action="surveyBuilder"  style={{ cursor: 'default' }}>CREATE A NEW QUESTION</a>
                                                </h3>
                                                
                                            </header>
                                            <section className="acContent" id="accPanelBuilder">{/* style={{height: 'auto', overflowY: 'auto'}} */}
                                                <div id="builderQuestionContainer" className="setting" style={{/*height: 'calc(100vh - 200px)', overflowY: 'auto'*/}}>{/*height: '100vh'*/}
                                                    <ul className="addList">
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(1)} className="qsr" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(1)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="star"></Icon> &nbsp; Star Rating</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(2)} className="qmc" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(2)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="unordered-list"></Icon> &nbsp; Multiple Choice</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(3)} className="qchb" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(3)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="check-square"></Icon> &nbsp; Checkboxes</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(4)} className="qnp hasFont2" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(4)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="dashboard"></Icon> &nbsp; Net Promoter® Score</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(5)} className="ct" data-icon="W" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(5)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="form"></Icon> &nbsp; Text</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', paddingLeft: 0 }}>
                                                            {/* <a href="# " onClick={()=>this.callAddQuestionModal(6)} className="qdd" style={{ cursor: 'default' }}> */}
                                                            <a href="# " onClick={()=>this.callAddQuestionModal(6)} style={{ cursor: 'default' }}>
                                                                <span className="listText"><Icon type="credit-card"></Icon> &nbsp; Dropdown</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li>
                                                        {/* <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " className="ci" style={{ cursor: 'default' }}>
                                                                <span className="listText">Image</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li> */}
                                                        {/* <li className="c1 cta dta chat-mode-unsupported acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                            <a href="# " className="qdt" style={{ cursor: 'default' }}>
                                                                <span className="listText">Date / Time</span>
                                                                <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }}>ADD</span>
                                                            </a>
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            </section>
                                        </div>
                                        
                                        <div id="accBackground" className={ this.state.sidebarTool === "background" ? "key open" : "key hidden" } style={{ display: 'block', maxHeight: '100%' }}>
                                            <header>
                                                <h3 className="accordionLabel">
                                                    <a href="# " onClick={ (e) => { e.preventDefault() } } className="press keyOpener" target="#accPanelBuilder" data-action="surveyBuilder"  style={{ cursor: 'default' }}>SURVEY BACKGROUND</a>
                                                </h3>
                                                
                                            </header>
                                            <section className="acContent" id="accPanelBuilder">{/* style={{height: 'auto', overflowY: 'auto'}} */}
                                                <div id="builderQuestionContainer" className="setting" style={{/*height: 'calc(100vh - 200px)', overflowY: 'auto'*/}}>{/*height: '100vh'*/}
                                                    <ul className="addList">
                                                        <li key={`background-remove`} className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', textAlign: 'center' }}>
                                                            <h3 style={{ minHeight: '20px' }}>Remove Survey Background</h3>
                                                            <a href="# " className="bg" onClick={()=>this.removeSurveyBackground()} style={{ cursor: 'default', display: 'block', width: '150px' }}>
                                                                <span className="wds-button wds-button--ghost-filled wds-button--tight" style={{ width: '150px', height: 'auto' }}>REMOVE</span>
                                                            </a>
                                                        </li>
                                                        <li key={`background-cololr`} className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', textAlign: 'center' }}>
                                                            <h3 style={{ minHeight: '30px' }}>Background Color</h3>
                                                            <div>
                                                                <div style={ styles.swatch } onClick={ this.handleClick }>
                                                                    <div style={ styles.color } />
                                                                </div>

                                                                { this.state.displayColorPicker ? 
                                                                // <div style={ styles.popover }>
                                                                <div style={{ position: 'absolute', zIndex: 2 }}>
                                                                    <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }} onClick={ this.handleClose }></div>
                                                                    <SketchPicker color={ this.state.survey.background_color ? this.state.survey.background_color : '#FFFFFF' } onChange={ this.handleChange } />
                                                                </div> 
                                                                : null }
                                                                </div>
                                                        </li>
                                                        <li key={`background-upload`} className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default', textAlign: 'center' }}>
                                                            <h3 style={{ minHeight: '35px' }}>Upload Background Image</h3>
                                                            <Upload 
                                                                // {...props}
                                                                customRequest={this.customRequestBackground}
                                                                name="background"
                                                                listType="picture-card"
                                                                className="background-uploader"
                                                                showUploadList={false}
                                                                // action="http://localhost:3000/upload"
                                                                beforeUpload={this.beforeUpload}
                                                                onChange={this.handleBackgroundChange}
                                                                >
                                                                {this.state.survey.background_image || this.state.bgPath ? <img src={this.state.bgPath ? this.state.bgPath : this.state.survey.background_image } alt="background" style={{ width: '100%' }} /> : uploadButton}
                                                            </Upload>
                                                        </li>
                                                        {this.state.backgroundRow}
                                                    </ul>
                                                </div>
                                            </section>
                                        </div>

                                    </div>
                                </aside>
                                
                                <div id="overlay" className={ this.state.isLoadingDesign ? '' : 'hidden'}>
                                    <Spin size="large" tip="Loading..."></Spin>
                                    {/* <div className="spinner"></div>
                                    <br/>
                                    Loading... */}
                                </div>
                                
                                <div className="live-preview-wrapper">
                                    <div id="livePreview" className="livePreview noLogo hidePageTitle hidePageNumbering">
                                        
                                        <div id="modal-render"></div>

                                        <div className="analyze-mode-header sm-corner-a">
                                            <div className="stats-header clearfix sm-corner-t" style={{ backgroundColor: 'white', margin: '0', padding: '10px', width: '100%' }}>
                                            <div style={{ display: 'inline-flex' }}>
                                                    <h4 className="sm-float-l" style={{ marginRight: '10px' }}>
                                                        Global Font : 
                                                    </h4>
                                                    <Dropdown overlay={fontList()} trigger={['click']}>
                                                        <a href="#" className="wds-button wds-button--sm wds-button--util-light" style={{ float: 'left'}}>
                                                            <div className="pageName" style={{ display: 'inline-block' }}>
                                                                {this.state.globalFontName}
                                                            </div>
                                                            <span className="dropdownArrow smf-icon"><Icon type="caret-down"></Icon></span>
                                                        </a>
                                                    </Dropdown>
                                                </div>
                                                
                                                <div style={{ display: 'inline-flex' }}>
                                                    <h4 className="sm-float-l" style={{ marginLeft: '15px', marginRight: '10px' }}>
                                                        Size : 
                                                    </h4>
                                                    <Dropdown overlay={sizeList()} trigger={['click']}>
                                                        <a href="#" className="wds-button wds-button--sm wds-button--util-light" style={{ float: 'left'}}>
                                                            <div className="pageName" style={{ display: 'inline-block' }}>
                                                                {this.state.globalFontSize}
                                                            </div>
                                                            {/* <span className="dropdownArrow smf-icon">–</span> */}
                                                            <span className="dropdownArrow smf-icon"><Icon type="caret-down"></Icon></span>
                                                        </a>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div id="page-items-list"></div>

                                    </div>
                                </div>{/* live-preview-wrapper */}

                            </div>{/* step2 */}

                        </div>{/* container clearfix */}
                    </div>{/* bd logged-in-bd */}

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