import React from 'react';
import ReactDOM from 'react-dom';
import * as toastr from 'toastr';
import Surveys from '../../models/surveys';
import Collector from '../../models/collector';
import BaseService from '../../service/base.service';
import { History } from 'history';
import { getJwtToken } from '../../helper/jwt.helper';
import MenuSurvey from '../../common/menu';
import { Icon, Dropdown, Menu, Spin, Tooltip, Button, Divider, Radio, Checkbox, Select } from "antd";
import moment from 'moment';

import '../../css/wds-react.4_16_1.min.css';
import '../../css/collectweb-collector_list-bundle-min.5e29c8fb.css';
import '../../css/smlib.globaltemplates-base_nonresponsive-bundle-min.125b4dd4.css';
import '../../css/smlib.ui-global-bundle-min.9feec1b6.css';
import '../../css/collectweb-collector_get-bundle-min.ea15b72a.css';
import '../../css/smlib.ui-global-pro-bundle-min.3a0c69ab.css';

import CollectorEditModal from '../../common/modal/collectorEditModal';
import HeaderSurvey from '../../common/header';
import Project from '../../models/project';
import Question from '../../models/questions';

import SurveyReNicknameModal from '../../common/modal/surveyRenicknameModal';

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
    questionList: any,
    selectQuestion: number,
    visibleBanner: boolean,

    answerRating: string,
    answerChoice: string,
    answerCheckbox: any[],
    answerScore: string,
    answerText: string,
    answerDropdown: any,
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
                link: '',
                collect_option: 0
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
            questionList: [],
            selectQuestion: 0,
            visibleBanner: false,

            answerRating: '',
            answerChoice: '',
            answerCheckbox: [],
            answerScore: '',
            answerText: '',
            answerDropdown: '',
        }
        // this.onFieldValueChange = this.onFieldValueChange.bind(this);
    }

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
                        async (rp) => {
                            if (rp.Status) {
                              // console.log('componentDidMount survey', rp.Data.recordset);
                                const surveyData = rp.Data.recordset[0];
                                let questionListTmp:any = [];

                                for(let i = 1; i<=surveyData.num_question; i++){
                                    const respons = await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyData.id + '/' + i, jwt).then(
                                    (rpQuestion) => {
                                        try{
                                            if (rpQuestion.Status) {
                                                if(rpQuestion.Data.recordset.length){
                                                    const questionObj = rpQuestion.Data.recordset[0];
                                                    return questionObj
                                                } else {
                                                    const questionObj = {
                                                        order_no: '',
                                                        question_label: '',
                                                    }
                                                    return questionObj
                                                }
                                            }
                                            else {
                                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getPageNo BaseService.get<Question> /question/${surveyData.id}/${i} else rp.Status`, message: `Messages: ${rpQuestion.Messages} | Exception: ${rpQuestion.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                                return false;
                                            }
                                        }catch(error){
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getPageNo BaseService.get<Question> /question/${surveyData.id}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                        }
                                    });
                                    questionListTmp.push(respons);
                                }

                                this.setState({ 
                                    survey: surveyData, 
                                    isLoading: false, 
                                    questionList: questionListTmp, 
                                    selectQuestion: collector.collect_option ? collector.collect_option : 0
                                });
                            } else {
                                this.setState({ isLoading: false });
                                // toastr.error(rp.Messages);
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                // console.log("Messages: " + rp.Messages);
                                // console.log("Exception: " + rp.Exception);
                            }
                        }

                    );

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
                    // console.log("Messages: " + rp.Messages);
                    // console.log("Exception: " + rp.Exception);
                }
            }

        );

    }

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
                    // console.log("Messages: " + rp.Messages);
                    // console.log("Exception: " + rp.Exception);
                }
            }
        );

    }

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
                    // console.log("Messages: " + rp.Messages);
                    // console.log("Exception: " + rp.Exception);
                }
            }
        );
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
                    // console.log("Messages: " + rp.Messages);
                    // console.log("Exception: " + rp.Exception);
                }
            }
        );

    }

    onSelectQuestion = async (value: any) => {
        this.setState({ selectQuestion: value.target.value, visible: false, visibleRename: false, visibleBanner: false });
    }

    Rename = () => {
        // console.log('Rename');
        this.setState({
            visibleRename: true
        });
    }

    onClickGenerateScript = () => {
        let getScript = ``;
        if(this.state.selectQuestion){
            let questionObj:any;
            getScript = (`<div id="question-banner" style="position: fixed; bottom: 0px; right: 0px; z-index: 1000; padding: 10px 20px; max-width: 800px;">
                <div style="background-color: #fff; display: flex; padding: 10px; box-shadow: 0px 1px 5px #b0b0b0; border-radius: 5px;">`);
            for (const obj of this.state.questionList) {
                if(obj.order_no == this.state.selectQuestion){
                    questionObj = obj;
                    getScript += `<div>
                            <div style="padding-right: 10px;">
                                <img 
                                    style="width: 30px;height: 30px;max-width: 100%;z_index: 1;" 
                                    src=${this.state.survey.image_src ? this.state.survey.image_src : '/cxm/platform/logo_template.png'} 
                                    alt="logo"
                                />
                                <span style="margin: 0px 5px;">${obj.question_label}</span>
                                <div onclick="closeQuestionBanner()" class="fa fas fa-times" style="cursor: pointer; position: absolute; top: 15px; right: 27px; color: #000000ba;"></div>
                            </div>
                            <div style="margin-top: 10px;">
                            ${this.getQuestionType(obj)}
                            </div>
                            <div id="grecaptcha" class="g-recaptcha" data-sitekey="6LfzAcIcAAAAAKQX7_GUWTisTgEgeB9rdorF0v0i"></div>
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #a8a8a8a6; font-size: 14px;">${this.state.survey.footer_description.slice(this.state.survey.footer_description.indexOf(">",3)+1, this.state.survey.footer_description.indexOf("</span>"))}</div>
                        </div>`;
                }
            }
            getScript += `</div></div><script>`;
            if(questionObj.type_id === 1){
                getScript += (`
                    function clickRatingQuestion(indexRating,length,color) {
                        for(i=0; i<length; i++){
                            var element = document.getElementById("rating-choice-"+i);
                            if(i==indexRating){
                                element.classList.add("checked-rating-"+color);
                            } else {
                                element.classList.remove("checked-rating-"+color);
                            }
                        }
                    }
                    function clickDoneRating(length,color) {
                        for(i=0; i<length; i++){
                            var choiceClass = document.getElementById("rating-choice-"+i).classList;
                            var choiceClassArray = Array.from(choiceClass);
                            for(j=0; j<choiceClassArray.length; j++){
                                if(choiceClassArray[j] == "checked-rating-"+color){
                                    doneQuestionBanner(i+1,'');
                                }
                            }
                        }
                    }
                `);
            }
            if(questionObj.type_id === 2){
                getScript += (`
                    function clickDoneRadio(length) {
                        for(i=0; i<length; i++){
                            var radioValue = document.getElementsByName("questionRadio")[i].checked;
                            if(radioValue){
                                doneQuestionBanner(i+1,'');
                            }
                        }
                    }
                `);
            }
            if(questionObj.type_id === 3){
                getScript += (`
                    function clickCheckboxQuestion(limitMax,length) {
                        var choiceChecked = 0;
                        var choiceNotCheck = [];
                        for(i=0; i<length; i++){
                            if(document.getElementsByName("questionCheckbox")[i].checked){
                                choiceChecked++;
                            } else {
                                choiceNotCheck.push(i);
                            }
                        }
                        if(limitMax == choiceChecked){
                            for(j=0; j<choiceNotCheck.length; j++){
                                document.getElementById("checkbox-choice-"+choiceNotCheck[j]).disabled = true;
                            }
                        } else {
                            for(j=0; j<choiceNotCheck.length; j++){
                                document.getElementById("checkbox-choice-"+choiceNotCheck[j]).disabled = false;
                            }
                        }
                    }
                    function clickDoneCheckbox(length) {
                        var tmpValue = '';
                        for(i=0; i<length; i++){
                            var CheckboxValue = document.getElementsByName("questionCheckbox")[i].checked;
                            if(CheckboxValue){
                                tmpValue += i+1;
                            }
                            if(i+1<length){
                                tmpValue += ',';
                            }
                        }
                        doneQuestionBanner(tmpValue,'');
                    }
                `);
            }
            if(questionObj.type_id === 4){
                getScript += (`
                    function clickScoreQuestion(index) {
                        for(i=0; i<10; i++){
                            var element = document.getElementById("score-box-"+i);
                            if(i==index){
                                element.classList.add("checked-score");
                            } else {
                                element.classList.remove("checked-score");
                            }
                        }
                    }
                    function clickDoneScore() {
                        for(i=0; i<10; i++){
                            var radioValue = document.getElementsByName("questionRadio")[i].checked;
                            if(radioValue){
                                doneQuestionBanner(i+1,'');
                            }
                        }
                    }
                `);
            }
            if(questionObj.type_id === 5){
                getScript += (`
                    function clickDoneText() {
                        var textValue = document.getElementById("answer-question-textarea").value;
                        doneQuestionBanner(textValue,'');
                    }
                `);
            }
            if(questionObj.type_id === 6){
                getScript += (`
                    function clickDoneSelect() {
                        var selectValue = document.getElementById("answer-question-select").value;
                        doneQuestionBanner(selectValue,'');
                    }
                `);
            }
            getScript += (`
                function doneQuestionBanner(answer,comment) {
                    var verifyCallback = function(recaptchaResponse) {
                        if(recaptchaResponse){
                            var _RootQL = {
                                survey_id: ${this.state.survey.id}, 
                                project_id: ${this.state.survey.project_id},
                                collector_id: ${this.state.collector.id}, 
                                time_spent: 0,
                                complete_status: 3,
                                ip_address: '',
                            }
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", \`${process.env.REACT_APP_BASE_URL}/response?re=\${recaptchaResponse}\`, true);
                            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                            xhr.setRequestHeader('x-site', '${this.props.match.params.xSite}');
                            xhr.send(JSON.stringify(_RootQL));
                            xhr.onload = function () {
                                var response = JSON.parse(this.responseText);
                                if(response.status){
                                    var _answerObj = {
                                        survey_id: ${this.state.survey.id},
                                        project_id: ${this.state.survey.project_id},
                                        collector_id: ${this.state.collector.id},
                                        response_id: response.result.recordset[0].id,
                        
                                        question_id: ${questionObj.question_id},
                                        question_type_id: ${questionObj.type_id},
        
                                        question_analyze_entity: ${questionObj.analyze_entity},
                                        question_analyze_sentiment: ${questionObj.analyze_sentiment},
                        
                                        answer: answer,
                                        comment: comment,
                                        //signature_image: signature,
                                        //consent_image_path: consent,
                                        analyze_entity: '',
                                        analyze_sentiment: '',
                        
                                        skip_status: 0,
                                        alert_status: 0,
                                    }
                                    var xhrAnswer = new XMLHttpRequest();
                                    xhrAnswer.open("POST", \`${process.env.REACT_APP_BASE_URL}/answer?re=\${recaptchaResponse}\`, true);
                                    xhrAnswer.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                                    xhrAnswer.setRequestHeader('x-site', '${this.props.match.params.xSite}');
                                    xhrAnswer.send(JSON.stringify(_answerObj));
                                    xhrAnswer.onload = function () {
                                        var rpAnswer = JSON.parse(this.responseText);
                                        if (rpAnswer.status) {
                                            const answerInsertedId = rpAnswer.result.recordset[0].id;
                                            let text = '';
                                            if(${questionObj.type_id} === 5){
                                                text = _answerObj.answer;
                                            }
                                            else{
                                                text = _answerObj.comment;
                                            }
                                            if( !_answerObj.skip_status && text.trim() !== '' && (${questionObj.analyze_entity} === 1 || ${questionObj.analyze_sentiment} === 1) ){
                                                var xhrGoogleapi = new XMLHttpRequest();
                                                xhrGoogleapi.open("PUT", \`${process.env.REACT_APP_BASE_URL}/answer/googleapi/${questionObj.type_id}/\${answerInsertedId}?re=\${recaptchaResponse}\`, true);
                                                xhrGoogleapi.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                                                xhrGoogleapi.setRequestHeader('x-site', '${this.props.match.params.xSite}');
                                                xhrGoogleapi.send(JSON.stringify(_answerObj));
                                            
                                                xhrGoogleapi.onload = function () {
                                                    var data = JSON.parse(this.responseText);
                                                }
                                            }
                                        }
                                        closeQuestionBanner();
                                    }
                                }
                            }
                        }
                    };
                    grecaptcha.render('grecaptcha', {
                        'sitekey' : '6LfzAcIcAAAAAKQX7_GUWTisTgEgeB9rdorF0v0i',
                        'callback' : verifyCallback,
                        'theme' : 'light'
                    });
                }
                function closeQuestionBanner() {
                    var getID = document.getElementById("question-banner");
                    getID.classList.add("close-banner");
                }
                window.onload = async () => {
                    var addFontAwesomeOnHead = document.createElement('head');
                    addFontAwesomeOnHead.innerHTML = \`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\`
                    document.getElementsByTagName('head')[0].appendChild(addFontAwesomeOnHead);
                    addCssClassBanner();
                }
                const addCssClassBanner = () => {
                    var cssClass = document.createElement('style');
                    cssClass.type = 'text/css';
                    cssClass.innerHTML = \`
                        .close-banner {
                            display: none;
                        }
                        .btn-done {
                            color: rgb(255, 255, 255);
                            cursor: pointer;
                            background-color: ${this.state.survey.button_color_theme ? this.state.survey.button_color_theme : 'dodgerblue'};
                            border: 1px solid transparent;
                            padding: 5px 10px;
                            border-radius: 3px;
                        }
                        .btn-done:hover {
                            background-color: white;
                            border-color: ${this.state.survey.button_color_theme ? this.state.survey.button_color_theme : 'dodgerblue'};
                            color: ${this.state.survey.button_color_theme ? this.state.survey.button_color_theme : 'dodgerblue'};
                        }
                        .emoji-rating .emoji-color {
                            color: rgb(255, 255, 255);
                            left: 10px;
                            position: absolute;
                            right: 0;
                            display: inline;
                            cursor: pointer;
                            line-height: 42px;
                        }
                        .emoji-rating {
                        font-size: 28px;
                        color: #FFF;
                        height: 42px;
                        position: relative;
                        cursor: default;
                        }
                        .checked-rating-yellow {color: yellow !important;}
                        .checked-rating-red {color: red !important;}
                        .checked-rating-blue {color: blue !important;}
                        .checked-rating-green {color: green !important;}
                        .checked-rating-black {color: black !important;}
                        .checked-score {background-color: rgba(0,0,0,0.40) !important;}
                    \`;
                    document.getElementsByTagName('head')[0].appendChild(cssClass);
                }
            </script>
            <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>`);
            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['link', 'collect_option'], [getScript, this.state.selectQuestion]), jwt).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                            toastr.success('Collector updated');
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${this.state.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
        }
        this.setState({ 
            visibleBanner: true, 
            visible: false, 
            visibleRename: false, 
            collector: {
                ...this.state.collector,
                link: getScript,
                collect_option: this.state.selectQuestion
            },
        });
    }

    getQuestionType = (questionObj:any) => {
        let getScript = ``;
        if(questionObj.type_id === 1){
            let choiceArray = questionObj.choice.includes(",") ? questionObj.choice.split(',') : [questionObj.choice];
            let choice_label: any[] = [];
            let choice_value: any[] = [];
            for(let i = 0; i < choiceArray.length; i++) { 
                if(i%2 === 0){
                    choice_label.push(choiceArray[i]);
                } else {
                    choice_value.push(choiceArray[i]);
                }
            }
            let emojiShapeClass = '';
            let emojiColorClass = '';
            {/* star smiley heart thumb */}
            if(questionObj.shape === 1) emojiShapeClass = 'fas fa-circle';
            else if(questionObj.shape === 2) emojiShapeClass = 'fas fa-smile';
            else if(questionObj.shape === 3) emojiShapeClass = 'fas fa-heart';
            else if(questionObj.shape === 4) emojiShapeClass = 'fas fa-thumbs-up';
    
            {/* emoji-yellow emoji-red emoji-blue emoji-green emoji-black */}
            if(questionObj.color === 1) emojiColorClass = 'yellow';
            else if(questionObj.color === 2) emojiColorClass = 'red';
            else if(questionObj.color === 3) emojiColorClass = 'blue';
            else if(questionObj.color === 4) emojiColorClass = 'green';
            else if(questionObj.color === 5) emojiColorClass = 'black';
            choice_label.map((label:string, i:number) => (
                getScript += (`<div style="margin: 5px 0px;">
                    <div class="emoji-rating" style="background-color: #e5e5e5; display: flex; align-items: center;">
                        <div id="rating-choice-${i}" class="${"smf-icon emoji-color fa " + emojiShapeClass}" onclick="clickRatingQuestion(${i},${choice_label.length},'${emojiColorClass}')" style="left: 10px;" aria-hidden="true"></div>
                        <div style="font-size: 18px; color: black; margin-left: 45px;">${label}</div>
                    </div>
                </div>`)
            ))
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneRating(${choice_label.length},'${emojiColorClass}')">${this.state.survey.done_text}</button>
            </div>`;
        } else if(questionObj.type_id === 2){
            let choiceArray = questionObj.choice.includes(",") ? questionObj.choice.split(',') : [questionObj.choice];
            let choice_label: any[] = [];
            let choice_value: any[] = [];
            for(let i = 0; i < choiceArray.length; i++) { 
                if(i%2 === 0){
                    choice_label.push(choiceArray[i]);
                } else {
                    choice_value.push(choiceArray[i]);
                }
            };
            choice_label.map((label:string, i:number) => (
                getScript += `
                    <input type="radio" id="radio-choice-${i}" name="questionRadio" value="${choice_value[i]}">
                    <label for="radio-choice-${i}">${label}</label>
                `
            ));
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneRadio(${choice_label.length})">${this.state.survey.done_text}</button>
            </div>`;
        } else if(questionObj.type_id === 3){
            let choiceArray = questionObj.choice.includes(",") ? questionObj.choice.split(',') : [questionObj.choice];
            let choice_label: any[] = [];
            let choice_value: any[] = [];
            for(let i = 0; i < choiceArray.length; i++) { 
                if(i%2 === 0){
                    choice_label.push(choiceArray[i]);
                } else {
                    choice_value.push(choiceArray[i]);
                }
            }
            choice_label.map((label:string, i:number) => (
                getScript += `
                    <input type="checkbox" id="checkbox-choice-${i}" name="questionCheckbox" value="${choice_value[i]}" ${questionObj.limit_selection ? `onclick="clickCheckboxQuestion(${questionObj.limit_max},${choice_label.length})"` : ''}>
                    <label for="checkbox-choice-${i}">${label}</label>
                `
            ));
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneCheckbox(${choice_label.length})">${this.state.survey.done_text}</button>
            </div>`;
        } else if(questionObj.type_id === 4){
            let score = ['1','2','3','4','5','6','7','8','9','10'];
            getScript += `<div style="display: flex; justify-content: space-between; font-size: 14px; max-width: 775px;">
                <div>${questionObj.low_score_label ? questionObj.low_score_label : 'low'}</div>
                <div>${questionObj.high_score_label ? questionObj.high_score_label : 'high'}</div>
            </div>
            <div style="display: flex; width: 100%; min-width: 300px; max-width: 775px; justify-content: center; text-align: center;">`;
            score.map((label:string, i:number) => (
                getScript += `<div id="score-box-${i}" style="border: 1px solid #00bf6f; width: 10%; background-clip: padding-box; background-color: rgba(0,0,0,0.10); display: flex; align-items: center; height: 50%;">
                    <input type="radio" role="radio" id="score-choice-${i}" name="questionRadio" value="${label}" style="display: none;">
                    <label for="score-choice-${i}" onclick="clickScoreQuestion(${i})" style="display: block; padding: 10px; cursor: pointer; width: 100%;">${label}</label>
                </div>`
            ))
            getScript += `</div>`;
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneScore()">${this.state.survey.done_text}</button>
            </div>`;
        } else if(questionObj.type_id === 5){
            getScript += `<textarea id="answer-question-textarea" style="width: 100%; height: 100px; borderColor: #d6d6d6;"></textarea>`;
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneText()">${this.state.survey.done_text}</button>
            </div>`;
        } else if(questionObj.type_id === 6){
            let choiceArray = questionObj.choice.includes(",") ? questionObj.choice.split(',') : [questionObj.choice];
            let choice_label: any[] = [];
            let choice_value: any[] = [];
            for(let i = 0; i < choiceArray.length; i++) { 
                if(i%2 === 0){
                    choice_label.push(choiceArray[i]);
                } else {
                    choice_value.push(choiceArray[i]);
                }
            }
            getScript += `<select id="answer-question-select" style="width: 100%; padding: 3px 0px; border-color: #8e8e8e; border-radius: 3px;">`;
            choice_label.map((item: any, i:number) => (
                getScript += `
                    <option value="${item}">${item}</option>
                `
            ))
            getScript += `</select>`;
            getScript += `<div style="margin: 5px 0px;">
                <button class="btn-done" onclick="clickDoneSelect()">${this.state.survey.done_text}</button>
            </div>`;
        }
        return getScript;
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
                                
                                <span id="collector-created-date">Link created: {this.state.collector.created_date}</span>
                                
                                <section className="weblink">

                                    <div id="edit-weblink">
                                        <div id="collector-status" className="clearfix">
                                            <div>
                                                Project / Branch : <b>{this.state.listProjects.map((project: any) => { if(project.id === this.state.collector.project_id) return project.name; })} <span><Icon type="edit" onClick={()=>this.showModal(this.state.collector.type)}/></span></b>
                                            </div>
                                            <Dropdown overlay={this.menu(this.state.collector.id, this.state.collector.type)} trigger={['click']}>
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

                                        <div>
                                            <label>Question : </label>
                                            <div className="sm-input sm-input--select sm-input--sm">
                                                <select value={this.state.selectQuestion} onChange={(v:any) => this.onSelectQuestion(v)}>
                                                    {!this.state.selectQuestion && <option value={0}></option>}
                                                    {this.state.questionList.map((obj: any, idx: any) => (
                                                        <option key={idx} value={obj.order_no}>{obj.order_no}. {obj.question_label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ margin: "10px 0px" }}>
                                            <Button style={{ color: '#fff', backgroundColor: 'dodgerblue' }} onClick={this.onClickGenerateScript}>Generate script</Button>
                                        </div>
                                        <div>
                                            <textarea style={{ width: '100%', height: '160px', borderWidth: '0px' }} value={this.state.collector.link} id="weblink-url" readOnly={true} />
                                            <div className="buttons">
                                                {/* <a id="url-customize" className="btn-small btn ">CUSTOMIZE</a> */}
                                                <button id="copy-link-btn" onClick={this.toClipboard}className="wds-button wds-button--sm" data-clipboard-target="#weblink-url">COPY</button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
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