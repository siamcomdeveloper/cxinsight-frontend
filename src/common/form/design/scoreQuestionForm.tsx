/* eslint-disable import/first */
import * as React from "react";
import { Form, Input, Button, Tabs, Checkbox, Select, Icon, Divider, Upload, Alert, Tooltip, Spin } from 'antd';

import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../../service/base.service';
import { getJwtToken } from '../../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../../models/surveys";
import Question from "../../../models/questions";
import ReactDOM from "react-dom";
import { isNull } from "util";
import RichTextEditor from "../../RichTextEditor";
import { History } from 'history';
const { TabPane } = Tabs;

let imageId = 0;
let skipLogicId = 0;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
    survey: Surveys;
    question: any;
    defaultActiveKey: any;
    handleCancel: (e: any) => void;
    handleSaveQuestion: () => void;

    imageType: any;
    imageLabel: any;
    imageLabelHtml: any;
    imageSource: any;

    weightAnswerFrom:any,
    weightAnswerTo:any,
    toPage: any;
    toQuestion: any;

    oneOnPage: any;

    history: History;
    match:{ 
        isExact: boolean
        params: {
            xSite: string
        },
        path: string,
        url: string,
    }
}
interface IState{
    isLoading: boolean;
    survey: Surveys;
    question: any;
    allAreaOfImpactName: any;
    allDepartmentName: any;
    actionKey: any;
    buttonSaveText: any;
    moveToPageOption: any;
    moveToPosOption: any;
    moveToQuestionOption: any;
    copyToPageOption: any;
    copyToPosOption: any;
    copyToQuestionOption: any;
    numQuestionOnPage: any;
    questionTypeLabel: any;

    weightAnswerFromOption:any,
    weightAnswerToOption:any,
    skipToPageOption: any;
    skipToQuestionOption: any;
    numQuestionOnPageSkip: any;

    allSkipPageOptionElement: any;
    allSkipQuestionOptionElement: any;
    allPromiseSkipQuestionPageNo: any;

    selectedItems: any;
    selectedAreaOfImpacts: any;
    selectedDepartments: any;

    imageType: any;
    imageLabel: any;
    imageLabelHtml: any;
    imageSource: any;

    loadingImage: boolean;
    isNotTemplateQuestion: boolean;
    alreadyResponded: boolean;
    fontColor: any;
}
class ScoreQuestionForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        question: this.props.question,
        allAreaOfImpactName: [],
        allDepartmentName: [],
        actionKey: this.props.defaultActiveKey,
        buttonSaveText: 'SAVE',

        moveToPageOption: 1,
        moveToPosOption: 'after',
        moveToQuestionOption: 0,
        copyToPageOption: 1,
        copyToPosOption: 'after',
        copyToQuestionOption: 1,
        numQuestionOnPage: 0,
        questionTypeLabel: '',

        weightAnswerFromOption: this.props.weightAnswerFrom,
        weightAnswerToOption: this.props.weightAnswerTo,
        skipToPageOption: this.props.toPage,
        skipToQuestionOption: this.props.toQuestion,
        numQuestionOnPageSkip: [],

        allSkipPageOptionElement: [],
        allSkipQuestionOptionElement: [],
        allPromiseSkipQuestionPageNo: [],

        selectedItems: [],
        selectedAreaOfImpacts: [],
        selectedDepartments: [],

        imageType: this.props.imageType,
        imageLabel: this.props.imageLabel,
        imageLabelHtml: this.props.imageLabelHtml,
        imageSource: this.props.imageSource,

        loadingImage: false,
        isNotTemplateQuestion: (parseInt(this.props.question.template_question_id) === 0 || this.props.question.template_question_id === null),
        alreadyResponded: parseInt(this.props.question.already_responded as any) > 0,
        fontColor: []
      }
    // console.log('ScoreQuestionForm constructor', props);
    }

    componentDidMount() { 

        // console.log('ScoreQuestionForm componentDidMount');

        const jwt = getJwtToken();
        BaseService.getJSON(this.props.match.params.xSite, "/color", '', jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // const colors = rp.Data.result.recordset;
                        const colors = rp.Data.result.recordset.map((colorData: any) => {return colorData.hex_code;});
                        // console.log('colors', colors);

                        this.setState({
                            fontColor: colors
                        }, () => {
                            this.setState({ isLoading: false }, () => {

                                this.setQuestionTypeLabel(parseInt(this.state.question.type_id));
                                this.renderElement(this.state.actionKey);
                                this.setButtonSaveText(this.state.actionKey);
                                
                            });
                        });
  
                      } else {
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'scoreQuestionForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'scoreQuestionForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    componentWillReceiveProps(props: any) {
      // console.log('ScoreQuestionForm componentWillReceiveProps', props);
    }

    setQuestionTypeLabel(typeId: any){
        //button save text
        switch(typeId){
            case 1 :  this.setState({ questionTypeLabel: 'Star Rating' }); break;
            case 2 :  this.setState({ questionTypeLabel: 'Multiple Choice' }); break;
            case 3 :  this.setState({ questionTypeLabel: 'Checkboxes' }); break;
            case 4 :  this.setState({ questionTypeLabel: 'Net Promoter Score' }); break;
            case 5 :  this.setState({ questionTypeLabel: 'Comment Box' }); break;
            case 6 :  this.setState({ questionTypeLabel: 'Dropdown' }); break;
        }
    }
    
    setButtonSaveText(key: any){
        //button save text
        if(key === 'edit') this.setState({ buttonSaveText: 'SAVE' });
        else if(key === 'options') this.setState({ buttonSaveText: 'SAVE' });
        else if(key === 'logic') this.setState({ buttonSaveText: 'SAVE' });
        else if(key === 'move') this.setState({ buttonSaveText: 'MOVE QUESTION' });
        else if(key === 'copy') this.setState({ buttonSaveText: 'COPY QUESTION' });
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
  
    check = () => {

        if(this.state.actionKey === 'edit') this.onSaveEdit();
        else if(this.state.actionKey === 'options') this.onSaveOptions();
        else if(this.state.actionKey === 'logic') this.onSaveLogic();
        else if(this.state.actionKey === 'move') this.onSaveMove();
        else if(this.state.actionKey === 'copy') this.onSaveCopy();

    };

    onSaveCopy(){
        let toPosition = 0;
        if(this.state.copyToPosOption === 'after') toPosition = 1;
        else if(this.state.copyToPosOption === 'before') toPosition = 0;
      // console.log(`onSaveCopy to Page: ${this.state.copyToPageOption} Question: ${this.state.copyToQuestionOption} Position: ${this.state.copyToPosOption} toPosition: ${toPosition}`);
        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/question/design/copy/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.type_id + '/' + this.state.copyToPageOption + '/' + this.state.copyToQuestionOption + '/' + toPosition, '', jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log(rp);
                    toastr.success(rp.Messages);
                    this.props.handleSaveQuestion();
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveCopy BaseService.update /question/design/copy/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id}/${this.state.copyToPageOption}/${this.state.copyToQuestionOption}/${toPosition} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
    }

    onSaveMove(){
        // router.route('/design/move/to/:surveyId/:questionId/:orderNo/:toPageNo/:toOrderNo/:toPosition/:oneOnPage')
        let toPosition = 0;
        if(this.state.moveToPosOption === 'after') toPosition = 1;
        else if(this.state.moveToPosOption === 'before') toPosition = 0;

        const oneOnPage = this.props.oneOnPage ? 1 : 0;

        const direction = parseInt(this.state.moveToQuestionOption) > parseInt(this.state.question.order_no) ? 'downto' : 'upto';
      // console.log(`onSaveMove to Page: ${this.state.moveToPageOption} Question: ${this.state.moveToQuestionOption} Position: ${this.state.moveToPosOption} toPosition ${toPosition} direction ${direction} oneOnPage ${oneOnPage}`);

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/question/design/move/"+ direction + "/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.page_no + '/' + this.state.question.order_no + '/' + this.state.moveToPageOption + '/' + this.state.moveToQuestionOption + '/' + toPosition + '/' + oneOnPage, '', jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log(rp);
                    toastr.success(rp.Messages);
                    this.props.handleSaveQuestion();
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveMove BaseService.update /question/design/move/${direction}/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.page_no}/${this.state.question.order_no}/${this.state.moveToPageOption}/${this.state.moveToQuestionOption}/${toPosition}/${oneOnPage} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
        
    }

    onSaveLogic(){
        try{
            //skip logic array to string with ',' separate
            // console.log(`onSaveLogic this.state.weightAnswerFromOption`, this.state.weightAnswerFromOption);
            // console.log(`onSaveLogic this.state.weightAnswerToOption`, this.state.weightAnswerToOption);
            // console.log(`onSaveLogic this.state.skipToPageOption`, this.state.skipToPageOption);
            // console.log(`onSaveLogic this.state.skipToQuestionOption`, this.state.skipToQuestionOption);
            let strSkipLogic = '';
            for(let index = 0 ; index < this.state.skipToQuestionOption.length ; index ++){
                //clear the skip to question no when select "--Choose Page--" or "End of survey" option on the dropdown page option
                const skipToQuestionOption = this.state.skipToPageOption[index] < 1 ? 0 : this.state.skipToQuestionOption[index];
                strSkipLogic += this.state.weightAnswerFromOption[index] + ',' + this.state.weightAnswerToOption[index] + ',' + this.state.skipToPageOption[index] + ',' + skipToQuestionOption;
                if(index < this.state.skipToQuestionOption.length - 1) strSkipLogic += ',';
            }
            // console.log(`onSaveLogic strSkipLogic`, strSkipLogic);

            //show comment when answer to string with ',' separate
            let strShowCommentWhenAnswer = '';
            if(this.state.question.show_comment_field_logic){
            // console.log(`onSaveLogic this.state.show_comment_field_logic = ${this.state.question.show_comment_field_logic}`);
            // console.log(`onSaveLogic this.state.selectedItems`, this.state.selectedItems);
                strShowCommentWhenAnswer = this.state.selectedItems.join();
            // console.log(`onSaveLogic strShowCommentWhenAnswer`, strShowCommentWhenAnswer);
            }

            const jwt = getJwtToken();
            BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.type_id, 
                this.selectUpdate(
                        this.state.question, 
                        ['skip_logic', 'show_comment_when_answer', 'show_comment_field_logic'],
                        [strSkipLogic, strShowCommentWhenAnswer, this.state.question.show_comment_field_logic]
                    )
                , jwt).then(
                (rp) => {
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.props.handleSaveQuestion();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveLogic BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }
            );
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveLogic catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    onSaveOptions(){
        try{
            // console.log(`onSaveOptions this.state.question.`, this.state.question);
                
            let pass = false;

            if(this.state.question.required){
                // console.log(`in if(this.state.question.required_label || this.state.question.required_label.trim() === '')`);
                let fields = [] as any;
                
                if(this.state.survey.multi_lang) fields = ['required_label', 'required_label_EN', 'required_label_html', 'required_label_EN_html'];
                else fields = ['required_label', 'required_label_html'];

                this.props.form.validateFields(fields, (err) => {
                    // console.log(`err`, err);
                    if (!err || isNull(err) ) {
                        // console.log(`in if (!err || isNull(err) )`);
                        pass = true;
                        //do something
                    }
                });
                // return;
            }
            else{
                pass = true;
            }

            let sourceFieldArr;
            let imageKeys;

            // console.log(`onSaveOptions pass`, pass);
            // console.log(`onSaveOptions image_enabled`, this.state.question.image_enabled);
            // if(pass || !this.state.question.image_enabled){
            if(pass){

                let imageSrcType = '';
                let strImageName = '';
                let strImageNameHtml = '';
                let strImageSrc = '';
                let strImageDesc = '';
                if(this.state.question.image_enabled){

                    const imageKeys = this.props.form.getFieldValue('imageKeys');
                // console.log(`onSaveOptions this.state.imageSource`, this.state.imageSource);

                    const sourceFieldsValueArrFilter = this.state.imageSource.filter(function (item: any) { return item !== null; });
                // console.log(`onSaveOptions sourceFieldsValueArrFilter.length`, sourceFieldsValueArrFilter.length);
                // console.log(`onSaveOptions sourceFieldsValueArrFilter`, sourceFieldsValueArrFilter);

                    let strImageSource = sourceFieldsValueArrFilter.map((data: any) => {
                    // console.log(`sourceFieldsValueArrFilter.map data = `, data);
                        if(data === '') return null;
                        else if(data === undefined) return '';
                        else return data;
                    });

                // console.log(`strImageSource`, strImageSource);
                // console.log(`strImageSource.length`, strImageSource.length);
                // console.log(`strImageSource.join()`, strImageSource.join());

                    //imageSrcType (image_src_type)
                    for(let i = 0 ; i < strImageSource.length; i++ ){
                        imageSrcType += '2';
                        if(i < strImageSource.length-1) imageSrcType += ',';
                    }

                    //imageLabel (image_name)
                    const labelFieldArr = imageKeys.map((k: any, index: any) => {
                    // console.log(`onSaveOptions imageKeys.map k = ${k} index = ${index}`);
                        return 'image_name['+k+']';
                    });
                    // console.log(`onSaveOptions labelFieldArr`, labelFieldArr);
                    const labelFieldArrHtml = imageKeys.map((k: any, index: any) => {
                        // console.log(`onSaveOptions imageKeys.map k = ${k} index = ${index}`);
                        return 'image_name_html['+k+']';
                    });
                    // console.log(`onSaveOptions labelFieldArrHtml`, labelFieldArrHtml);

                    const labelFieldsValueArr = this.props.form.getFieldsValue(labelFieldArr);
                    const labelFieldsValueArrHtml = this.props.form.getFieldsValue(labelFieldArrHtml);
                    // console.log(`onSaveOptions labelFieldsValueArr`, labelFieldsValueArr);
                    // console.log(`onSaveOptions labelFieldsValueArrHtml`, labelFieldsValueArrHtml);

                    const labelFieldsValueArrFilter = labelFieldsValueArr.image_name.filter(function (item: any) { return item !== null; })
                    const labelFieldsValueArrFilterHtml = labelFieldsValueArrHtml.image_name_html.filter(function (item: any) { return item !== null; })
                    // console.log(`onSaveOptions labelFieldsValueArrFilter.length`, labelFieldsValueArrFilter.length);
                    // console.log(`onSaveOptions labelFieldsValueArrFilter`, labelFieldsValueArrFilter);
                    // console.log(`onSaveOptions labelFieldsValueArrFilterHtml.length`, labelFieldsValueArrFilterHtml.length);
                    // console.log(`onSaveOptions labelFieldsValueArrFilterHtml`, labelFieldsValueArrFilterHtml);

                    const strImageLabel = labelFieldsValueArrFilter.map((data: any) => {
                    // console.log(`labelFieldsValueArrFilter.map data = `, data);
                        //if empty
                        if(data === '') return null;
                        else if(data === undefined) return '';
                        else return data;
                    });

                    const strImageLabelHtml = labelFieldsValueArrFilterHtml.map((data: any) => {
                    // console.log(`labelFieldsValueArrFilterHtml.map data = `, data);
                        //if empty
                        if(data === '') return null;
                        else if(data === undefined) return '';
                        else return data;
                    });

                    // console.log(`strImageLabel`, strImageLabel);
                    // console.log(`strImageLabelHtml`, strImageLabelHtml);
                    // console.log(`strImageLabel.length`, strImageLabel.length);
                    // console.log(`strImageLabel.join()`, strImageLabel.join());

                    //prepare variable to store in DB
                    strImageName = strImageLabel.join();
                    strImageNameHtml = strImageLabelHtml.join('~');
                    strImageSrc = strImageSource.join();
                    strImageDesc = strImageName;
                }
                else{
                    imageSrcType = this.state.question.image_src_type;
                    strImageName = this.state.question.image_name;
                    strImageSrc = this.state.question.image_src;
                    strImageDesc = this.state.question.image_description;
                }

                // console.log(`onSaveOptions this.state.question.required`, this.state.question.required);
                // console.log(`onSaveOptions this.state.question.required_label`, this.state.question.required_label);
                // console.log(`onSaveOptions imageSrcType`, imageSrcType);
                // console.log(`onSaveOptions strImageName`, strImageName);
                // console.log(`onSaveOptions strImageSrc`, strImageSrc);
                // console.log(`onSaveOptions strImageDesc`, strImageDesc);
                // console.log(`onSaveOptions this.state.question.image_enabled`, this.state.question.image_enabled);

                // console.log(`onSaveOptions strImageNameHtml`, strImageNameHtml);

                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id, 
                    this.selectUpdate( this.state.question, ['required', 'required_label', 'required_label_EN', 'required_label_html', 'required_label_EN_html'], [this.state.question.required, this.state.question.required_label, this.state.question.required_label_EN, this.state.question.required_label_html, this.state.question.required_label_EN_html]), jwt).then(
                    (rp) => {
                        if (rp.Status) {
                        // console.log(rp);

                            BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.type_id, 
                                this.selectUpdate(
                                        this.state.question, 
                                        ['image_src_type', 'image_name', 'image_name_html', 'image_src', 'image_description', 'image_enabled'],
                                        [imageSrcType, strImageName, strImageNameHtml, strImageSrc, strImageDesc, this.state.question.image_enabled]
                                    )
                                , jwt).then(
                                (rp) => {
                                    if (rp.Status) {
                                        // console.log(rp);
                                        toastr.success(rp.Messages);
                                        this.props.handleSaveQuestion();
                                    } else {
                                        // toastr.error(rp.Messages);
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveOptions BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                }
                            );
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveOptions BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveOptions catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    onSaveEdit(){
        try{
            // console.log('onSaveEdit');

            let passQuestionLabelField = false;

            let fields = [] as any;
            if(this.state.survey.multi_lang){
                if(this.state.survey.show_label) fields = ['question_label', 'question_label_EN', 'low_score_label', 'low_score_label_EN', 'high_score_label', 'high_score_label_EN'];
                else fields = ['question_label', 'question_label_EN'];
            } 
            else{
                if(this.state.survey.show_label) fields = ['question_label', 'low_score_label', 'high_score_label'];
                else fields = ['question_label'];
            }

            this.props.form.validateFields(fields, (err, values) => {
            // console.log(`onSaveOptions question_label validateFields`, err, values);
                if (!err || isNull(err) ) {
                    passQuestionLabelField = true;
                }
            });
            // console.log(`onSaveOptions pass value`, passQuestionLabelField);
            
            let strSelectedAreaOfImpactsId = '';
            strSelectedAreaOfImpactsId = this.state.selectedAreaOfImpacts.map((selectedAreaOfImpact: any, selectedAreaOfImpactIndex: any) => {
                // console.log(`selectedAreaOfImpact ${selectedAreaOfImpact} selectedAreaOfImpactIndex ${selectedAreaOfImpactIndex}`);
                let no;
                this.state.allAreaOfImpactName.map((areaOfImpactName: any, areaOfImpactIndex: any) => {
                    const areaOfImpactNameSplit = areaOfImpactName.split('~')[0];
                    const areaOfImpactId = parseInt(areaOfImpactName.split('~')[1]);
                    // console.log(`areaOfImpactNameSplit ${areaOfImpactNameSplit} areaOfImpactId ${areaOfImpactId}`);
                    // console.log(`selectedAreaOfImpact ${selectedAreaOfImpact} === areaOfImpactNameSplit ${areaOfImpactNameSplit}`, selectedAreaOfImpact === areaOfImpactNameSplit);
                    if(selectedAreaOfImpact === areaOfImpactNameSplit) {
                    // console.log('in if no', areaOfImpactId);
                        no = areaOfImpactId;
                        return;
                    }
                });
                return no;
            }).join();

            if(strSelectedAreaOfImpactsId === '') strSelectedAreaOfImpactsId = '1';
            // console.log(`strSelectedAreaOfImpactsId`, strSelectedAreaOfImpactsId);

            let strSelectedDepartmentId = '';
            strSelectedDepartmentId = this.state.selectedDepartments.map((selectedDepartment: any, selectedDepartmentIndex: any) => {
                // console.log(`selectedDepartment ${selectedDepartment} selectedDepartmentIndex ${selectedDepartmentIndex}`);
                let no;
                this.state.allDepartmentName.map((departmentName: any, departmentIndex: any) => {
                    // console.log(`departmentName ${departmentName} departmentIndex ${departmentIndex}`);
                // console.log(`selectedDepartment ${selectedDepartment} === departmentName ${departmentName}`, selectedDepartment === departmentName);
                    if(selectedDepartment === departmentName) {
                    // console.log('in if no', departmentIndex+1);
                        no = departmentIndex+1;
                        return;
                    }
                });
                return no;
            }).join();
                
            if(passQuestionLabelField){

                // console.log('onSaveEdit this.state.question.question_id', this.state.question.question_id);
                // console.log('onSaveEdit this.state.question.question_label', this.state.question.question_label);
                // console.log('onSaveEdit this.state.question.show_label', this.state.question.show_label);
                // console.log('onSaveEdit this.state.question.show_comment_field', this.state.question.show_comment_field);
                // console.log('onSaveEdit this.state.question.comment_field_label', this.state.question.comment_field_label);
                // console.log('onSaveEdit this.state.question.comment_field_hint', this.state.question.comment_field_hint);

                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id, 
                    this.selectUpdate( this.state.question, ['question_label', 'question_label_EN', 'question_label_html', 'question_label_EN_html', 'area_of_impact_id', 'enabled_kpi', 'department_id'], [this.state.question.question_label, this.state.question.question_label_EN, this.state.question.question_label_html, this.state.question.question_label_EN_html, strSelectedAreaOfImpactsId, this.state.question.enabled_kpi, strSelectedDepartmentId]), jwt).then(
                    (rp) => {
                        if (rp.Status) {
                        // console.log(rp);

                            BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.type_id, 
                                this.selectUpdate(
                                        this.state.question, 
                                        ['show_label', 'low_score_label', 'low_score_label_EN', 'low_score_label_html', 'low_score_label_EN_html', 'high_score_label', 'high_score_label_EN', 'high_score_label_html', 'high_score_label_EN_html', 'show_comment_field', 'comment_field_label', 'comment_field_hint', 'comment_field_label_EN', 'comment_field_hint_EN', 'comment_field_label_html', 'comment_field_hint_html', 'comment_field_label_EN_html', 'comment_field_hint_EN_html'],
                                        [this.state.question.show_label, this.state.question.low_score_label, this.state.question.low_score_label_EN, this.state.question.low_score_label_html, this.state.question.low_score_label_EN_html, this.state.question.high_score_label, this.state.question.high_score_label_EN, this.state.question.high_score_label_html, this.state.question.high_score_label_EN_html, this.state.question.show_comment_field, this.state.question.comment_field_label, this.state.question.comment_field_hint, this.state.question.comment_field_label_EN, this.state.question.comment_field_hint_EN, this.state.question.comment_field_label_html, this.state.question.comment_field_hint_html, this.state.question.comment_field_label_EN_html, this.state.question.comment_field_hint_EN_html]
                                    )
                                , jwt).then(
                                (rp) => {
                                    if (rp.Status) {
                                    // console.log(rp);
                                        toastr.success(rp.Messages);
                                        this.props.handleSaveQuestion();
                                    } else {
                                        // toastr.error(rp.Messages);
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveEdit BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                }
                            );
                            
                            // toastr.success(rp.Messages);
                            // setInterval(function(){ window.location.reload(); }, 500);
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveEdit BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm onSaveEdit catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }
  
    handleAddCommentLogicChange = (selectedItems: any) => {
        this.setState({ selectedItems });
    };

    handleAddAreaOfImpactChange = (selectedAreaOfImpacts: any) => {
        this.setState({ selectedAreaOfImpacts });
    };

    handleAddDepartmentChange = (selectedDepartments: any) => {
        this.setState({ selectedDepartments });
    };

    onChangeSurvey = (e: React.ChangeEvent<HTMLInputElement>)=> {
      // console.log(`onchange e.target.id ${e.target.id} e.target.value ${e.target.value}`);
        this.onFieldSurveyValueChange(e.target.id, e.target.value)
    }

    onChangeQuestion = (e: React.ChangeEvent<HTMLInputElement>)=> {
      // console.log(`onchange e.target.id ${e.target.id} e.target.value ${e.target.value}`);
        this.onFieldQuestionValueChange(e.target.id, e.target.value)
    }

    onQuestionRichChange = (id: any, richTextEditor: any) => {
        this.onFieldQuestionValueChange(id, richTextEditor.text.trim()); 
        this.props.form.setFieldsValue({
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.text.trim(),
            [`${id}_html`]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        }, () => {
            this.onFieldQuestionValueChange(`${id}_html`, richTextEditor.html.trim()); 
        });
    };

    onChoiceRichChange = (id: any, richTextEditor: any, index: any) => {
        // console.log(`onRichChange id ${id} index ${index} richTextEditor`, richTextEditor);

        // console.log(`onFieldQuestionValueChange ${id}[${index}]`, richTextEditor.text.trim());
        // console.log(`onFieldQuestionValueChange ${id}_html[${index}]`, richTextEditor.html.trim());
        this.onFieldQuestionValueChange(`${id}[${index}]`, richTextEditor.text.trim()); 
        this.props.form.setFieldsValue({
            [`${id}[${index}]`]: richTextEditor.length === 1 ? '' :richTextEditor.text.trim(),
            [`${id}_html[${index}]`]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        }, () => {
            this.onFieldQuestionValueChange(`${id}_html[${index}]`, richTextEditor.html.trim()); 
        });
    };
    
    onFieldQuestionValueChange = (fieldName: string, value: any) => { 
        const nextState = {
            ...this.state,
            question: {
                ...this.state.question,
                [fieldName]: value,
            }
        };

        this.setState(nextState);
      // console.log('onFieldQuestionValueChange', this.state.question);
    }

    onFieldSurveyValueChange = (fieldName: string, value: any) => { 
        const nextState = {
            ...this.state,
            survey: {
                ...this.state.survey,
                [fieldName]: value,
            }
        };

        this.setState(nextState);
      // console.log('onFieldSurveyValueChange', this.state.survey);
    }

    tabCall = (key: any) => {
      // console.log('tabCall', key);
        this.setState( { actionKey: key }, () => {
            // console.log('after tabCall', this.state.actionKey);
              this.setButtonSaveText(this.state.actionKey);
              this.renderElement(this.state.actionKey);
            }
        );
    }

    onRequiredChange(e: any) {
        // console.log(`onRequiredChange checked = ${e.target.checked}`);
  
        this.setState({
        question: {
            ...this.state.question,
            ['required']: e.target.checked ? 1 : 0,
        }
        }, () => {
            // console.log(`onRequiredChange required = ${this.state.question.required}`);
            // console.log(`onRequiredChange required_label = ${this.state.question.required_label}`);

            if(e.target.checked){
                this.props.form.setFieldsValue({
                required_label: this.state.question.required_label ? this.state.question.required_label : '',
                required_label_html: this.state.question.required_label_html ? this.state.question.required_label_html : `<p>${this.state.question.required_label ? this.state.question.required_label : ''}</p>`,
                }, () => { /*console.log('setFieldsValue required_label')*/ });

                //set required label EN
                if(this.state.survey.multi_lang){
                    this.props.form.setFieldsValue({
                        required_label_EN: this.props.question.required_label_EN ? this.props.question.required_label_EN : this.state.question.required_label ? this.state.question.required_label : '',
                        required_label_EN_html: this.state.question.required_label_EN_html ? this.state.question.required_label_EN_html : ( this.props.question.required_label_EN ? `<p>${this.props.question.required_label_EN}</p>` : this.state.question.required_label ? `<p>${this.state.question.required_label}</p>` : '<p></p>' ),
                    }, () => { /*console.log('setFieldsValue required_label_EN')*/ });
                }
            }

            } 
        );

    }

    onAddCommentChange(e: any) {
        // console.log(`onAddCommentChange checked = ${e.target.checked}`);
  
        this.setState({
        question: {
            ...this.state.question,
            ['show_comment_field']: e.target.checked ? 1 : 0,
        }
        }, () => {
            // console.log(`onRequiredChange show_comment_field = ${this.state.question.show_comment_field}`);
            // console.log(`onRequiredChange comment_field_label = ${this.state.question.comment_field_label}`);
            // console.log(`onRequiredChange comment_field_hint = ${this.state.question.comment_field_hint}`);

            if(e.target.checked){
                this.props.form.setFieldsValue({
                    comment_field_label: this.state.question.comment_field_label ? this.state.question.comment_field_label : '',
                    comment_field_label_html: this.state.question.comment_field_label_html ? this.state.question.comment_field_label_html : `<p>${this.state.question.comment_field_label ? this.state.question.comment_field_label : ''}</p>`,

                    comment_field_hint: this.state.question.comment_field_hint ? this.state.question.comment_field_hint : '',
                    comment_field_hint_html: this.state.question.comment_field_hint_html ? this.state.question.comment_field_hint_html : `<p>${this.state.question.comment_field_hint ? this.state.question.comment_field_hint : ''}</p>`,
                }, () => { 
                    // console.log('setFieldsValue comment_field_label')
                });

                if(this.state.survey.multi_lang){
                    this.props.form.setFieldsValue({
                        comment_field_label_EN: this.state.question.comment_field_label_EN ? this.state.question.comment_field_label_EN : this.state.question.comment_field_label ? this.state.question.comment_field_label : '',
                        comment_field_label_EN_html: this.state.question.comment_field_label_EN_html ? this.state.question.comment_field_label_EN_html : ( this.props.question.comment_field_label_EN ? `<p>${this.props.question.comment_field_label_EN}</p>` : this.state.question.comment_field_label ? `<p>${this.state.question.comment_field_label}</p>` : '<p></p>' ),
                        
                        comment_field_hint_EN: this.state.question.comment_field_hint_EN ? this.state.question.comment_field_hint_EN : this.state.question.comment_field_hint ? this.state.question.comment_field_hint : '',
                        comment_field_hint_EN_html: this.state.question.comment_field_hint_EN_html ? this.state.question.comment_field_hint_EN_html : ( this.props.question.comment_field_hint_EN ? `<p>${this.props.question.comment_field_hint_EN}</p>` : this.state.question.comment_field_hint ? `<p>${this.state.question.comment_field_hint}</p>` : '<p></p>' ),
                    }, () => { 
                        // console.log('setFieldsValue comment_field_label')
                    });
                }
            }

            } 
        );

    }

    onAddCommentLogicChange(e: any) {
      // console.log(`onAddCommentLogicChange checked = ${e.target.checked}`);

        this.setState({
          question: {
            ...this.state.question,
            ['show_comment_field_logic']: e.target.checked ? 1 : 0,
          }
        }, () => {
            // console.log(`onAddCommentLogicChange show_comment_field_logic = ${this.state.question.show_comment_field_logic}`);
            // console.log(`onAddCommentLogicChange show_comment_when_answer = ${this.state.question.show_comment_when_answer}`);
            } 
        );

    }

    onEnabledImageChange(e: any) {
      // console.log(`onEnabledImageChange checked = ${e.target.checked}`);

        this.setState({
          question: {
            ...this.state.question,
            ['image_enabled']: e.target.checked ? 1 : 0,
          }
        }, () => {
              // console.log(`onEnabledImageChange image_enabled = ${this.state.question.image_enabled}`);
                // console.log(`onEnabledImageChange show_comment_when_answer = ${this.state.question.show_comment_when_answer}`);
                this.setImageWhenAddChekced();
            } 
        );

    }

    onShowLabelChange(e: any) {
      // console.log(`onShowLabelChange checked = ${e.target.checked}`);

        this.setState({
          question: {
            ...this.state.question,
            ['show_label']: e.target.checked ? 1 : 0,
          }
        }, () => {
            // console.log(`onShowLabelChange show_label = ${this.state.question.show_label}`);
            }
        );

    }

    onEnabledKPIChange(e: any) {
        // console.log(`onShowLabelChange checked = ${e.target.checked}`);
  
          this.setState({
            question: {
              ...this.state.question,
              ['enabled_kpi']: e.target.checked ? 1 : 0,
            }
          }, () => {
                  // console.log(`onShowLabelChange show_label = ${this.state.question.show_label}`);
                  // this.setChoiceWeightWhenChecked();
              } 
          );
  
      }

    public renderPageDropdownOptionElement(index: any) {
        let parentEl = document.getElementById("question-"+this.state.question.order_no+"-dropdown-skip-page-container-"+(index+1));
        let childEl = <select value={this.state.skipToPageOption[index]} placeholder="Select a person" id={"question-"+this.state.question.order_no+"-dropdown-skip-page-"+(index+1)} className="" onChange={ (e) => this.setSkipToPageHandler(e, index+1) }></select>
        ReactDOM.render(childEl, parentEl, () => {
            this.renderLogicDropdownPageElement(index);
        });
    }

    public renderQuestionDropdownOptionElement(index: any, pageChanged?: boolean) {
        let parentEl = document.getElementById("question-"+this.state.question.order_no+"-dropdown-skip-question-container-"+(index+1));
        let childEl = <select value={this.state.skipToQuestionOption[index]} id={"question-"+this.state.question.order_no+"-dropdown-skip-question-"+(index+1)} className="" onChange={ (e) => this.setSkipToQuestionHandler(e, index+1) } disabled={ this.state.skipToPageOption[index] === 0 && this.state.skipToQuestionOption[index] === 0 ? true : false }></select>
        ReactDOM.render(childEl, parentEl, () => {
            this.renderLogicDropdownQuestionElement(index, pageChanged);
        }); 
    }

    public renderAnswerFromDropdownOptionElement(index: any) {
      // console.log('renderAnswerFromDropdownOptionElement index', index);
        let parentEl = document.getElementById("question-"+this.state.question.order_no+"-dropdown-answer-from-container-"+(index+1));
      // console.log('parentEl', parentEl);
        let childEl = <select className="answerRangeFrom" value={this.state.weightAnswerFromOption[index]} style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}} onChange={ (e) => this.setAnswerFromHandler(e, index) }><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>
      // console.log('childEl', childEl);
        ReactDOM.render(childEl, parentEl, () => {
            // this.renderLogicDropdownPageElement(index);
        });
    }

    public renderAnswerToDropdownOptionElement(index: any, pageChanged?: boolean) {
        let parentEl = document.getElementById("question-"+this.state.question.order_no+"-dropdown-answer-to-container-"+(index+1));
        let childEl = <select className="answerRangeTo" value={this.state.weightAnswerToOption[index]} style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}} onChange={ (e) => this.setAnswerToHandler(e, index) }><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>
        ReactDOM.render(childEl, parentEl, () => {
            // this.renderLogicDropdownQuestionElement(index, pageChanged);
        }); 
    }

    public async renderLogicDropdownPageElement(j: any) {
        try{
            // console.log('renderLogicDropdownPageElement index', j);

            if(this.state.allSkipPageOptionElement.length !== 0){

                const numPage = this.state.survey.num_page ? parseInt(this.state.survey.num_page as string) : 0;
            // console.log('renderLogicDropdownPageElement numPage', numPage);
            // console.log('this.state.allPromiseSkipQuestionPageNo', this.state.allPromiseSkipQuestionPageNo);

                //count total question and get this current question location on this page
                let matchCount = 0;
                let noOnPage = 0;
                this.state.allPromiseSkipQuestionPageNo.forEach((questionPageNo: any, index: any) => {
                // console.log(` index = ${index} -> questionPageNo ${questionPageNo} this.state.question.page_no : ${this.state.question.page_no}`);
                    if(questionPageNo && parseInt(questionPageNo) === this.state.question.page_no){
                        matchCount++;
                    }
                    if(questionPageNo && parseInt(questionPageNo) === this.state.question.page_no &&
                            parseInt(this.state.question.order_no) === index+1 ){
                                noOnPage = matchCount;
                    }
                });
            // console.log('matched count', matchCount);
            // console.log('matched noOnPage', noOnPage);

                //copy all page element
                let allPageOptionElementCopy = [] as any;
                for (let i = 0; i < this.state.allSkipPageOptionElement.length; i++) {
                    allPageOptionElementCopy[i] = this.state.allSkipPageOptionElement[i];
                }
            // console.log(`renderLogicDropdownPageElement loop ${j} copy`, allPageOptionElementCopy);

                //remove before this current page from dropdown option
                for(let no = 1; no <= numPage; no++){
                // console.log(`renderLogicDropdownPageElement no ${no} this.state.question.page_no ${this.state.question.page_no}`);
                // console.log(`renderLogicDropdownPageElement matchCount ${matchCount} this.state.question.order_no + 1 ${parseInt(this.state.question.order_no) + 1}`, matchCount <= parseInt(this.state.question.order_no) + 1);
                    //And remove the page number on the few last question which is no question option in that question dropdown element
                    if( ( no  <  this.state.question.page_no ) || 
                        ( no === this.state.question.page_no && matchCount <= (noOnPage + 1) )
                    ){
                        const index = no; //skip index 0 "--Choose Page--" one
                        delete allPageOptionElementCopy[index];
                    // console.log(`renderLogicDropdownPageElement delete index ${no}`, allPageOptionElementCopy);
                    }
                }
            // console.log(`renderLogicDropdownPageElement allPageOptionElementCopy deleted`, allPageOptionElementCopy);
                //render move dropdown page option
                ReactDOM.render(allPageOptionElementCopy, document.getElementById("question-"+this.state.question.order_no+"-dropdown-skip-page-"+(j+1)));
            // console.log('render question-x-dropdown-skip-page-'+(j+1));
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm renderLogicDropdownPageElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderLogicDropdownQuestionElement(j: any, pageChanged?: boolean) {
        try{
            const numQuestion = this.state.survey.num_question ? parseInt(this.state.survey.num_question as string) : 0;
            // console.log('renderLogicDropdownQuestionElement numQuestion', numQuestion);
            
            //cal allQuestionOptionElementCopy
            let allQuestionOptionElementCopy = this.getAllQuestionOptionElementCopy(j);

            //render move dropdown question option with no this question
            if(allQuestionOptionElementCopy.length !== 0){

                //remove before this current question from dropdown option
                for(let no = 1; no <= numQuestion; no++){
                    if(no <= this.state.question.order_no + 1){
                        const index = no - 1;
                        delete allQuestionOptionElementCopy[index];
                    }
                }

            // console.log(`render question-x-dropdown-skip-question-${j+1} allQuestionOptionElementCopy ${allQuestionOptionElementCopy} allQuestionOptionElementCopy.filter((item: any) => item).length ${allQuestionOptionElementCopy.filter((item: any) => item).length}`);
                ReactDOM.render(allQuestionOptionElementCopy, document.getElementById("question-"+this.state.question.order_no+"-dropdown-skip-question-"+(j+1)));

            // console.log(`pageChange`, pageChanged);
                //set the first question dropdown option to be the skip question when selected page dropdown option
                if(pageChanged && allQuestionOptionElementCopy.filter((item: any) => item).length > 0){
                    
                    //get no of the first element which is not null in array
                    let no = 0;
                    allQuestionOptionElementCopy.forEach((obj: any, index: any) => { 
                    // console.log(`obj = ${obj.props.value} : index = ${index}`); 
                    // console.log(`obj.props.value = ${obj.props.value} : index = ${index}`);
                        if(!no && obj) {
                            no = index + 1;
                        }
                    });

                    let skipToQuestionOptionArr = this.state.skipToQuestionOption;
                    skipToQuestionOptionArr[j] = no;
                    
                    this.setState({
                        skipToQuestionOption: skipToQuestionOptionArr,
                    },  () => { 
                        // console.log(`pageChange ${j} this.state.skipToQuestionOption ${this.state.skipToQuestionOption}`);
                        }
                    );
                }

            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm renderLogicDropdownQuestionElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public getAllQuestionOptionElementCopy(j: any){
        try{
            //find list of question index to remove and count
            let indexListToRemove = [] as any;
            let count = 0;
            let toPageOption = this.state.skipToPageOption[j];
        // console.log(`loop ${j} toPageOption`, toPageOption);
            this.state.allPromiseSkipQuestionPageNo.forEach((questionPageNo: any, index: any) => {
            // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
                // console.log('currentPageNo', currentPageNo);
                if(questionPageNo && parseInt(questionPageNo) !== parseInt(toPageOption)){
                    // console.log('!matched');
                    indexListToRemove.push(index);
                }
                else if(questionPageNo && parseInt(questionPageNo) === parseInt(toPageOption)){
                    count++;
                }
            });
        // console.log(`indexListToRemove loop ${j}`, indexListToRemove);

            this.setState({
                numQuestionOnPage: count,
            },  () => { 
                // console.log(`numQuestionOnPage ${this.state.numQuestionOnPage}`);
                } 
            );
            
            //copy all question element
            let allQuestionOptionElementCopy = [] as any;
            for (let i = 0; i < this.state.allSkipQuestionOptionElement.length; i++) {
                allQuestionOptionElementCopy[i] = this.state.allSkipQuestionOptionElement[i];
            }
        // console.log(`allQuestionOptionElementCopy loop ${j} copy`, allQuestionOptionElementCopy);

            //remove elements
            indexListToRemove.forEach((removeIndex: any, index: any) => { 
            // console.log(`removeIndex = ${removeIndex} : index = ${index}`); 
                delete allQuestionOptionElementCopy[removeIndex];
            });

        // console.log(`allQuestionOptionElementCopy loop ${j} removed`, allQuestionOptionElementCopy);

            return allQuestionOptionElementCopy;
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getAllQuestionOptionElementCopy catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public setFirstCopyQuestionOption(allQuestionOptionElementCopy: any) {
        //set the first question dropdown option to be the skip question when selected page dropdown option
        if(allQuestionOptionElementCopy.filter((item: any) => item).length > 0){
                        
            //get no of the first element which is not null in array
            let no = 0;
            allQuestionOptionElementCopy.forEach((obj: any, index: any) => { 
              // console.log(`obj = ${obj.props.value} : index = ${index}`); 
              // console.log(`obj.props.value = ${obj.props.value} : index = ${index}`);
                if(!no && obj) {
                    no = index + 1;
                }
            });

            this.setState({
                copyToQuestionOption: no,
            },  () => { 
                  // console.log(`this.state.copyToQuestionOption value = ${no}`);
                } 
            );
        }
    }

    public setFirstMoveQuestionOption(allQuestionOptionElementCopy: any) {
        //set the first question dropdown option to be the skip question when selected page dropdown option
        if(allQuestionOptionElementCopy.filter((item: any) => item).length > 0){
                        
            //get no of the first element which is not null in array
            let no = 0;
            allQuestionOptionElementCopy.forEach((obj: any, index: any) => { 
              // console.log(`obj = ${obj.props.value} : index = ${index}`); 
              // console.log(`obj.props.value = ${obj.props.value} : index = ${index}`);
                if(!no && obj) {
                    no = index + 1;
                }
            });

            this.setState({
                moveToQuestionOption: no,
            },  () => { 
                  // console.log(`this.state.moveToQuestionOption value = ${no}`);
                } 
            );
        }
    }

    public async renderElement(key: any) { 
        try{
        // console.log('ScoreQuestionForm renderElement');

            const jwt = getJwtToken();
            if(key === 'edit'){

                //set question label
                this.props.form.setFieldsValue({
                    question_label: this.props.question.question_label ? this.props.question.question_label : '',
                    question_label_html: this.state.question.question_label_html ? this.state.question.question_label_html : `<p>${this.state.question.question_label ? this.state.question.question_label : ''}</p>`,
                }, () => { 
                    // console.log('setFieldsValue question_label')
                });

                // //set question label EN
                // if(this.state.survey.multi_lang){
                //     this.props.form.setFieldsValue({
                //         question_label_EN: this.props.question.question_label_EN ? this.props.question.question_label_EN : this.props.question.question_label ? this.props.question.question_label : '',
                //         question_label_EN_html: this.state.question.question_label_EN_html ? this.state.question.question_label_EN_html : ( this.props.question.question_label_EN ? `<p>${this.props.question.question_label_EN}</p>` : this.state.question.question_label ? `<p>${this.state.question.question_label}</p>` : '<p></p>' ),
                //     }, () => { 
                //         // console.log('setFieldsValue question_label_EN')
                //     });
                // }
                
                this.props.form.setFieldsValue({
                    low_score_label: this.props.question.low_score_label ? this.props.question.low_score_label : '',
                    low_score_label_html: this.state.question.low_score_label_html ? this.state.question.low_score_label_html : `<p>${this.state.question.low_score_label ? this.state.question.low_score_label : ''}</p>`,
                    high_score_label: this.props.question.high_score_label,
                    high_score_label_html: this.state.question.high_score_label_html ? this.state.question.high_score_label_html : `<p>${this.state.question.high_score_label ? this.state.question.high_score_label : ''}</p>`,
                }, () => { /*console.log('setFieldsValue low_score_label')*/ });

                // //set question label EN
                // if(this.state.survey.multi_lang){
                //     this.props.form.setFieldsValue({
                //         low_score_label_EN: this.props.question.low_score_label_EN,
                //         low_score_label_EN_html: this.state.question.low_score_label_EN_html ? this.state.question.low_score_label_EN_html : ( this.props.question.low_score_label_EN ? `<p>${this.props.question.low_score_label_EN}</p>` : this.state.question.low_score_label ? `<p>${this.state.question.low_score_label}</p>` : '<p></p>' ),
                //         high_score_label_EN: this.props.question.high_score_label_EN,
                //         high_score_label_EN_html: this.state.question.high_score_label_EN_html ? this.state.question.high_score_label_EN_html : ( this.props.question.high_score_label_EN ? `<p>${this.props.question.high_score_label_EN}</p>` : this.state.question.high_score_label ? `<p>${this.state.question.high_score_label}</p>` : '<p></p>' ),
                //     }, () => { /*console.log('setFieldsValue low_score_label_EN')*/ });
                // }

                // let selectedAreaOfImpactsName = [];
                // const areaOfImpacts = this.state.question.area_of_impact_id.includes(',') ? this.state.question.area_of_impact_id.split(',') : [this.state.question.area_of_impact_id];
                // let allAreaOfImpactName = this.props.survey.name_area_of_impacts.includes(",") ? this.props.survey.name_area_of_impacts.split(',') : [this.props.survey.name_area_of_impacts];

                // // console.log('areaOfImpacts', areaOfImpacts);
                // // console.log('allAreaOfImpactName', allAreaOfImpactName);

                // //replace &amp; with & character
                // allAreaOfImpactName = allAreaOfImpactName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

                // selectedAreaOfImpactsName = areaOfImpacts.map((selectedAreaOfImpactId: any, selectedAreaOfImpactIndex: any) => {
                //     // console.log(`selectedAreaOfImpactId ${selectedAreaOfImpactId} selectedAreaOfImpactIndex ${selectedAreaOfImpactIndex}`);
                //     let selectedAreaOfImpactName;
                //     allAreaOfImpactName.map((areaOfImpactName: any, areaOfImpactIndex: any) => {
                //     const areaOfImpactNameSplit = areaOfImpactName.split('~')[0];
                //     const areaOfImpactId = parseInt(areaOfImpactName.split('~')[1]);
                //     // console.log(`areaOfImpactName ${areaOfImpactName} areaOfImpactId ${areaOfImpactId} areaOfImpactIndex ${areaOfImpactIndex} no ${areaOfImpactIndex+1}`);
                //     // console.log(`selectedAreaOfImpactId ${selectedAreaOfImpactId} === areaOfImpactId ${areaOfImpactId}`, parseInt(selectedAreaOfImpactId) === areaOfImpactId);
                //         if(parseInt(selectedAreaOfImpactId) === areaOfImpactId) {
                //             // console.log('in if areaOfImpactNameSplit', areaOfImpactNameSplit);
                //             selectedAreaOfImpactName = areaOfImpactNameSplit;
                //             return;
                //         }
                //     });
                //     return selectedAreaOfImpactName;
                // });

                // // console.log('selectedAreaOfImpactName', selectedAreaOfImpactsName);

                // let selectedDepartmentsName = [];
                // const Departments = this.state.question.department_id ? this.state.question.department_id.includes(',') ? this.state.question.department_id.split(',') : [this.state.question.department_id] : [];
                // let allDepartmentName = this.props.survey.name_departments.includes(",") ? this.props.survey.name_departments.split(',') : [this.props.survey.name_departments];
                // // console.log('Departments', Departments);
                // // console.log('allDepartmentName', allDepartmentName);

                // //replace &amp; with & character
                // allDepartmentName = allDepartmentName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

                // selectedDepartmentsName = Departments.map((selectedDepartmentId: any, selectedDepartmentIndex: any) => {
                // // console.log(`selectedDepartmentId ${selectedDepartmentId} selectedDepartmentIndex ${selectedDepartmentIndex}`);
                //     let selectedDepartmentsName;
                //     allDepartmentName.map((departmentName: any, departmentIndex: any) => {
                //     // console.log(`departmentName ${departmentName} departmentIndex ${departmentIndex} no ${departmentIndex+1}`);
                //     // console.log(`selectedDepartmentId ${selectedDepartmentId} === no ${departmentIndex+1}`, parseInt(selectedDepartmentId) === (departmentIndex+1));
                //         if(parseInt(selectedDepartmentId) === (departmentIndex+1)) {
                //         // console.log('in if departmentName', departmentName);
                //             selectedDepartmentsName = departmentName;
                //             return;
                //         }
                //     });
                //     return selectedDepartmentsName;
                // });

                // // console.log('selectedAreaOfImpactsName', selectedAreaOfImpactsName);
                // // console.log('selectedDepartmentsName', selectedDepartmentsName);

                // this.setState( 
                //     { 
                //         selectedAreaOfImpacts: selectedAreaOfImpactsName, 
                //         allAreaOfImpactName: allAreaOfImpactName,
                        
                //         selectedDepartments: selectedDepartmentsName, 
                //         allDepartmentName: allDepartmentName,
                //     }, () => {
                //     //   console.log('after selectedAreaOfImpacts', this.state.selectedAreaOfImpacts);
                //     //   console.log('after allAreaOfImpactName', this.state.allAreaOfImpactName);
                //     //   console.log('after selectedDepartments', this.state.selectedDepartments);
                //     //   console.log('after allDepartmentName', this.state.allDepartmentName);
                //     }
                // );

                //check required
                if(this.state.question.show_comment_field){

                    this.props.form.setFieldsValue({
                        comment_field_label: this.state.question.comment_field_label ? this.state.question.comment_field_label : '',
                        comment_field_label_html: this.state.question.comment_field_label_html ? this.state.question.comment_field_label_html : `<p>${this.state.question.comment_field_label ? this.state.question.comment_field_label : ''}</p>`,
    
                        comment_field_hint: this.state.question.comment_field_hint ? this.state.question.comment_field_hint : '',
                        comment_field_hint_html: this.state.question.comment_field_hint_html ? this.state.question.comment_field_hint_html : `<p>${this.state.question.comment_field_hint ? this.state.question.comment_field_hint : ''}</p>`,
                    }, () => { 
                        // console.log('setFieldsValue comment_field_label')
                    });
    
                    if(this.state.survey.multi_lang){
                        this.props.form.setFieldsValue({
                            comment_field_label_EN: this.state.question.comment_field_label_EN ? this.state.question.comment_field_label_EN : '',
                            comment_field_label_EN_html: this.state.question.comment_field_label_EN_html ? this.state.question.comment_field_label_EN_html : `<p>${this.state.question.comment_field_label_EN ? this.state.question.comment_field_label_EN : ''}</p>`,
                            
                            comment_field_hint_EN: this.state.question.comment_field_hint_EN ? this.state.question.comment_field_hint_EN : '',
                            comment_field_hint_EN_html: this.state.question.comment_field_hint_EN_html ? this.state.question.comment_field_hint_EN_html : `<p>${this.state.question.comment_field_hint_EN ? this.state.question.comment_field_hint_EN : ''}</p>`,
                        }, () => { 
                            // console.log('setFieldsValue comment_field_label')
                        });
                    }
                    
                }

            }
            else if(key === 'options'){

                //first image add auto when no image setting at first
                if(this.state.imageType.length === 0) this.addImage();
                else for(let i = 0 ; i < this.state.imageType.length ; i++) this.addImage();
                
                //check required
                if(this.state.question.required){

                    //set required label
                    this.props.form.setFieldsValue({
                        required_label: this.props.question.required_label ? this.props.question.required_label : 'Hint',
                        required_label_html: this.props.question.required_label_html ? this.props.question.required_label_html : '',
                    }, () => { /*console.log('setFieldsValue required_label')*/ });

                    //set required label EN
                    if(this.state.survey.multi_lang){
                        this.props.form.setFieldsValue({
                            required_label_EN: this.props.question.required_label_EN ? this.props.question.required_label_EN : 'Hint',
                            required_label_EN_html: this.props.question.required_label_EN_html ? this.props.question.required_label_EN_html : '',
                        }, () => { /*console.log('setFieldsValue required_label_EN')*/ });
                    }

                }
                
            }
            else if(key === 'logic'){

            // console.log('renderElement logic');
            // console.log('weightAnswerFromOption', this.state.weightAnswerFromOption);
            // console.log('weightAnswerToOption', this.state.weightAnswerToOption);
            // console.log('skipToPageOption', this.state.skipToPageOption);
            // console.log('skipToQuestionOption', this.state.skipToQuestionOption);
                // console.log('renderElement logic show_comment_when_answer', this.state.question.show_comment_when_answer.split(','));

                //clear skipLogicKeys
                const { form } = this.props;
                const skipLogicKeys = form.getFieldValue('skipLogicKeys');
            // console.log(`logic skipLogicKeys`, skipLogicKeys);
                if(skipLogicKeys) form.setFieldsValue({  skipLogicKeys: [] });

                let selectedItems = [];
                if(this.state.question.show_comment_when_answer) selectedItems = this.state.question.show_comment_when_answer.includes(',') ? this.state.question.show_comment_when_answer.split(',') : [this.state.question.show_comment_when_answer];

                if(this.state.question.show_comment_field_logic){
                    this.setState( { selectedItems: selectedItems }, () => {
                        // console.log('after selectedItems', this.state.selectedItems);
                        }
                    );
                }
                
                const numPage = this.state.survey.num_page ? parseInt(this.state.survey.num_page as string) : 0;
            // console.log('numPage', numPage);

                const numQuestion = this.state.survey.num_question ? parseInt(this.state.survey.num_question as string) : 0;
            // console.log('numQuestion', numQuestion);

                let nodePageOption = new Array<any>(numPage+1);
                let nodeQuestionOption = new Array<any>(numQuestion);
                
                for(let i = 0; i < nodePageOption.length; i++) { nodePageOption[i] = ''; }
                for(let i = 0; i < nodeQuestionOption.length; i++) { nodeQuestionOption[i] = ''; }

                const nodePageOptionElement = nodePageOption.map((obj, i) => this.getPageOptionRow(i));
                const nodeQuestionOptionElement = nodeQuestionOption.map((obj, i) => this.getQuestionOptionRow(i+1, jwt));

                const endOfSurveyOption = <option key={this.state.actionKey+'-option-end-of-survey'} value={-1} className="user-generated">End of survey</option> as any;
                nodePageOptionElement.push(endOfSurveyOption);
                
                let allPageOptionElement = nodePageOptionElement;
                let allQuestionOptionElement = await Promise.all(nodeQuestionOptionElement);

            // console.log('allPageOptionElement', allPageOptionElement);
            // console.log('allQuestionOptionElement', allQuestionOptionElement);
                
                this.setState({
                    allSkipPageOptionElement: allPageOptionElement,
                    allSkipQuestionOptionElement: allQuestionOptionElement,
                },  () => { 
                    // console.log(`allSkipPageOptionElement ${this.state.allSkipPageOptionElement}`);
                    // console.log(`allSkipQuestionOptionElement ${this.state.allSkipQuestionOptionElement}`);
                    } 
                );
                
                //get pageNo for each question
                const questionPageNo = nodeQuestionOption.map((obj: any, i: number) => this.getPageNo(this.state.survey.id, i+1, jwt));//i+1 = question no. start from 1 - x (number of question)
                const allPromiseQuestionPageNo = await Promise.all(questionPageNo);

            // console.log('allPromiseQuestionPageNo', allPromiseQuestionPageNo);

                this.setState({
                    allPromiseSkipQuestionPageNo: allPromiseQuestionPageNo,
                },  () => { 
                    // console.log(`allPromiseSkipQuestionPageNo ${this.state.allPromiseSkipQuestionPageNo}`);
                    } 
                );

                //fix elements are not render correctly at the first time so have to loop twice time to render correctly
                for(let fix = 0 ; fix < 2 ; fix++){

                    //render skip logic tab element
                    let parentEl = document.getElementById("question-"+this.state.question.order_no+"-skip-logic");
                    let childEl= <div key={"question-"+this.state.question.order_no+"-skip-logic-tab"}>{this.skipLogicTabElement()}</div>;
                    ReactDOM.render(childEl, parentEl, () => {

                        //genarate skip logic row with 2 dropdown selection
                        // let allSkipLogicTr = new Array<any>(5).fill('');

                        //render skip logic row in the tbody element
                        let parentEl = document.getElementById("tbody-logic-row");
                        // let childEl = allSkipLogicTr.map((obj, i) => this.getSkipLogicRow(i));
                        let childEl = this.getAllSkipLogicRow();
                        // console.log('childEl', childEl);
                        ReactDOM.render(childEl, parentEl, () => {

                            //first skip logic add auto when no skip logic setting at first
                            if(this.state.skipToQuestionOption.length === 0) this.addSkipLogic(true, fix , 0);
                            else for(let i = 0 ; i < this.state.skipToQuestionOption.length ; i++) this.addSkipLogic(true, fix, i);
                            
                        // console.log('ReactDOM.render(child, parent, function() done');
                        });
                    });
                }

            }
            else if(key === 'move' || key === 'copy'){
                const numPage = this.state.survey.num_page ? parseInt(this.state.survey.num_page as string) : 0;
            // console.log('numPage', numPage);

                const numQuestion = this.state.survey.num_question ? parseInt(this.state.survey.num_question as string) : 0;
            // console.log('numQuestion', numQuestion);

                let nodePageOption = new Array<any>(numPage);
                let nodeQuestionOption = new Array<any>(numQuestion);

                for(let i = 0; i < nodePageOption.length; i++) { nodePageOption[i] = ''; }
                for(let i = 0; i < nodeQuestionOption.length; i++) { nodeQuestionOption[i] = ''; }

                const nodePageOptionElement = nodePageOption.map((obj, i) => this.getPageOptionRow(i+1));
                const nodeQuestionOptionElement = nodeQuestionOption.map((obj, i) => this.getQuestionOptionRow(i+1, jwt));

                let allPageOptionElement = await Promise.all(nodePageOptionElement);
                let allQuestionOptionElement = await Promise.all(nodeQuestionOptionElement);

            // console.log('allPageOptionElement', allPageOptionElement);
            // console.log('allQuestionOptionElement', allQuestionOptionElement);

                //get pageNo for each question
                const questionPageNo = nodeQuestionOption.map((obj: any, i: number) => this.getPageNo(this.state.survey.id, i+1, jwt));//i+1 = question no. start from 1 - x (number of question)
                const allPromiseQuestionPageNo = await Promise.all(questionPageNo);
            // console.log('allPromiseQuestionPageNo', allPromiseQuestionPageNo);
            
                //find list of question index to remove and count
                let indexListToRemove = [] as any;
                let count = 0;
                let toPageOption = key === 'move' ? this.state.moveToPageOption : this.state.copyToPageOption
                allPromiseQuestionPageNo.forEach((questionPageNo: any, index: any) => {
                // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
                    // console.log('currentPageNo', currentPageNo);
                    if(questionPageNo && parseInt(questionPageNo) !== parseInt(toPageOption)){
                        // console.log('!matched');
                        indexListToRemove.push(index);
                    }
                    else if(questionPageNo && parseInt(questionPageNo) === parseInt(toPageOption)){
                        count++;
                    }
                });
            // console.log('indexListToRemove', indexListToRemove);

                this.setState({
                numQuestionOnPage: count,
                },  () => { 
                    // console.log(`numQuestionOnPage ${this.state.numQuestionOnPage}`);
                        // this.props.answerHandler(this.props.question.no, value ? value : '', this.state.requiredLabelState);
                    } 
                );
                
                //copy all question element
                let allQuestionOptionElementCopy = [] as any;
                for (let i = 0; i < allQuestionOptionElement.length; i++) {
                    allQuestionOptionElementCopy[i] = allQuestionOptionElement[i];
                }

                //remove elements
                indexListToRemove.forEach((removeIndex: any, index: any) => { 
                // console.log(`removeIndex = ${removeIndex} : index = ${index}`); 
                    delete allQuestionOptionElementCopy[removeIndex];
                });

            // console.log('allQuestionOptionElementCopy removed', allQuestionOptionElementCopy);
                // allQuestionOptionElement = allQuestionOptionElementCopy;
                
                if(allPageOptionElement.length !== 0 && key === 'move'){

                    //render move tab element
                    ReactDOM.render(<div key={"question-"+this.state.question.order_no+"-move-dropdown"}>{this.moveDropdownElement(this.state.numQuestionOnPage)}</div>, document.getElementById("question-"+this.state.question.order_no+"-move-dropdown"));
                // console.log('render question-x-move-dropdown');

                    //render move dropdown page option
                    ReactDOM.render(allPageOptionElement, document.getElementById("question-"+this.state.question.order_no+"-dropdown-move-page-option"));
                // console.log('render question-x-dropdown-move-page-option');

                    //render move dropdown question option with no this question
                    if(allQuestionOptionElementCopy.length !== 0){

                        //remove current question from dropdown option
                        for(let no = 1; no <= numQuestion; no++){
                            if(this.state.question.order_no === no){
                                const index = no - 1;
                                delete allQuestionOptionElementCopy[index];
                                break;
                            }
                        }

                        this.setFirstMoveQuestionOption(allQuestionOptionElementCopy);
                        
                    // console.log('render question-x-dropdown-move-question-option');
                        ReactDOM.render(allQuestionOptionElementCopy, document.getElementById("question-"+this.state.question.order_no+"-dropdown-move-question-option"));
                    }
                }
                
                if(allPageOptionElement.length !== 0 && key === 'copy'){

                    //render copy tab element
                    ReactDOM.render(<div key={"question-"+this.state.question.order_no+"-copy-dropdown"}>{this.copyDropdownElement()}</div>, document.getElementById("question-"+this.state.question.order_no+"-copy-dropdown"));

                    //render copy dropdown page option
                    ReactDOM.render(allPageOptionElement, document.getElementById("question-"+this.state.question.order_no+"-dropdown-copy-page-option"));
                // console.log('render question-x-dropdown-copy-page-option');

                    //render copy dropdown question option
                    if(allQuestionOptionElementCopy.length !== 0){

                        this.setFirstCopyQuestionOption(allQuestionOptionElementCopy);

                        ReactDOM.render(allQuestionOptionElementCopy, document.getElementById("question-"+this.state.question.order_no+"-dropdown-copy-question-option"));
                    // console.log('render question-x-dropdown-copy-question-option');
                    }
                }
                
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm renderElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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

    getPageNo = async (surveyId: any, i: any, jwt: any) => {
      // console.log ("getPageElementRenderIndex question no." + i);
        
        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, jwt).then(
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getPageOptionRow = (pageNo: any) => {
        if(pageNo === 0) return (<option key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-option-page-'+pageNo} value={pageNo} className="user-generated">-- Choose Page --</option>);
        else return (<option key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-option-page-'+pageNo} value={pageNo} className="user-generated">{pageNo}. </option>);
    }

    // getSkipLogicRow = (index: any) => {
    //     return (
    //         <tr key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-skip-logic-tr-'+(index+1)} className="logicRow">
    //             <td className={ index > 0 ? "answerValue img-replace shapeLabel default-answerValue answerRange" : "answerValue img-replace shapeLabel first-answerValue answerRange"}>
    //                 {/* <label className={ index > 0 ? 'hidden' : ''}>Score</label> */}
    //                 <div className="sm-input sm-input--select sm-input--sm">
    //                     <select className="answerRangeFrom" style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}}><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option><option value="6">5</option><option value="7">6</option><option value="8">7</option><option value="9">8</option><option value="10">9</option><option value="11">10</option></select>
    //                 </div>
    //                 &nbsp; to &nbsp;
    //                 <div className="sm-input sm-input--select sm-input--sm">
    //                     <select className="answerRangeTo" style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}}><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option><option value="6">5</option><option value="7">6</option><option value="8">7</option><option value="9">8</option><option value="10">9</option><option value="11">10</option></select>
    //                 </div>
    //             </td>
    //             <td className="skipTo">
                    
    //                 <div className="block" style={{ marginTop: '15px'}}>

    //                     <div className="thePage">
    //                         <label className={ index > 0 ? 'hidden' : ''}>Page</label>
    //                         <div className="sm-input sm-input--select sm-input--sm" id={"question-"+this.state.question.order_no+"-dropdown-skip-page-container-"+(index+1)}>
    //                         </div>
    //                     </div>

    //                     <div className={ parseInt(this.state.question.page_no) === parseInt(this.state.skipToPageOption[index]) && this.state.numQuestionOnPageSkip[index] === 1 ? 'hidden' : "theQuestion"}>
    //                         <span>
    //                             <label className={ index > 0 ? 'hidden' : ''}>Question</label>
    //                             <div className="sm-input sm-input--select sm-input--sm" style={{ width: '400px' }} id={"question-"+this.state.question.order_no+"-dropdown-skip-question-container-"+(index+1)}>
    //                             </div>
    //                         </span>
    //                     </div>

    //                 </div>

    //                 {/* <a className="selectPage faux_dropdown" href="#" >--Choose Page--</a>
    //                 <a className="selectQuestion faux_dropdown disabled" href="#">&nbsp;</a> */}
    //             </td>
    //             <td className={ index > 0 ? "logicActions default-logicActions" : "logicActions first-logicActions"}>
    //                 {/* <a className="deleteLogic" href="#" title="Delete this logic row."><span className="smf-icon">-</span></a> */}
    //                 <a href="# " className="clearLogic link" onClick={()=>this.clearSkipLogicDropdownOption(index)}>Clear</a>
    //             </td>
    //         </tr>
    //     );
    // }

    getAllSkipLogicRow = () => {

      // console.log('getAllSkipLogicRow');
        const { getFieldDecorator, getFieldValue  } = this.props.form;
        getFieldDecorator('skipLogicKeys', { initialValue: [] });
        const skipLogicKeys = getFieldValue('skipLogicKeys');
      // console.log('skipLogicKeys', skipLogicKeys);
        // skipLogicKeys.push(skipLogicId++);
        const skipLogicItems = skipLogicKeys.map((k: any, index: any) => (

            <tr key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-skip-logic-tr-'+(index+1)} className="logicRow">
                <td className={ index > 0 ? "answerValue img-replace shapeLabel default-answerValue answerRange" : "answerValue img-replace shapeLabel first-answerValue answerRange"}>
                    {/* <label className={ index > 0 ? 'hidden' : ''}>Score</label> */}
                    <div className="sm-input sm-input--select sm-input--sm" id={"question-"+this.state.question.order_no+"-dropdown-answer-from-container-"+(index+1)}>
                    </div>
                    &nbsp; to &nbsp;
                    <div className="sm-input sm-input--select sm-input--sm" id={"question-"+this.state.question.order_no+"-dropdown-answer-to-container-"+(index+1)}>
                    </div>
                </td>
                <td className="skipTo">
                    
                    <div className="block" style={{ marginTop: '15px'}}>

                        <div className="thePage">
                            <label className={ index > 0 ? 'hidden' : ''}>Page</label>
                            <div className="sm-input sm-input--select sm-input--sm" id={"question-"+this.state.question.order_no+"-dropdown-skip-page-container-"+(index+1)}>
                            </div>
                        </div>

                        <div className={ parseInt(this.state.question.page_no) === parseInt(this.state.skipToPageOption[index]) && this.state.numQuestionOnPageSkip[index] === 1 ? 'hidden' : "theQuestion"}>
                            <span>
                                <label className={ index > 0 ? 'hidden' : ''}>Question</label>
                                <div className="sm-input sm-input--select sm-input--sm" style={{ width: '400px' }} id={"question-"+this.state.question.order_no+"-dropdown-skip-question-container-"+(index+1)}>
                                </div>
                            </span>
                        </div>

                    </div>

                    {/* <a className="selectPage faux_dropdown" href="#" >--Choose Page--</a>
                    <a className="selectQuestion faux_dropdown disabled" href="#">&nbsp;</a> */}
                </td>
                <td className={ index > 0 ? "logicActions default-logicActions" : "logicActions first-logicActions"}>
                    {/* <a className="deleteLogic" href="#" title="Delete this logic row."><span className="smf-icon">-</span></a> */}
                    {/* <a href="# " className="clearLogic link" onClick={()=>this.clearSkipLogicDropdownOption(index)}>Clear</a> */}

                    { skipLogicKeys.length > 1 ? (
                        <Icon
                            className={"dynamic-delete-button"}
                            type="minus-circle-o"
                            onClick={() => this.removeSkipLogic(k, index)}
                            style={{ paddingRight: '10px'}}
                        />
                    ) : null }

                    { skipLogicKeys.length === index + 1 ? (
                        <Icon
                            className={"dynamic-delete-button"}
                            type="plus-circle-o"
                            onClick={() => this.addSkipLogic()}
                        />
                    ) : null }

                </td>
            </tr>
            // <div key={`formItem-`+k}>

            //     <Divider style={{ fontSize: '16px', fontStyle: 'italic' }} >Image {index+1}</Divider>

            //     <Form.Item>
            //         <label className="sm-label sm-label--stretch" style={{ width: 'auto', display: 'inline-block', paddingRight: 52 }}>Image label : </label>
            //         {getFieldDecorator(`image_name[${k}]`, {
            //         validateTrigger: ['onChange'],
            //         initialValue: this.state.imageLabel ? this.state.imageLabel[index] : '',
            //         rules: [{
            //             // required: true,
            //             // whitespace: true,
            //             // message: "Enter an image label.",
            //         }],
            //         })(
            //         <Input placeholder="Image label" style={{ width: '80%' }} />
            //         )}
            //     </Form.Item>

            //     <Form.Item>
            //         <label className="sm-label sm-label--stretch" style={{ width: 'auto', display: 'inline-block', paddingRight: 8 }}>URL Image source : </label>
            //         {getFieldDecorator(`image_src[${k}]`, {
            //         validateTrigger: ['onChange'],
            //         initialValue: this.state.imageSource ? this.state.imageSource[index] : '',
            //         rules: [{
            //             required: true,
            //             // whitespace: true,
            //             message: "Enter an URL image source.",
            //         }],
            //         })(
            //         <Input placeholder="URL image source" style={{ width: '80%' }} />
            //         )}
            //     </Form.Item>

            //     <div style={{ textAlign: 'center' }}>
                    
            //         {keys.length === index+1 ? (
            //             <Icon
            //                 className={"dynamic-delete-button"}
            //                 type="plus-circle-o"
            //                 onClick={() => this.addImage()}
            //                 style={{ paddingRight: '5px'}}
            //             />
            //         ) : null}

            //         {/* {keys.length > 1 && index > 0 ? ( */}
            //         {keys.length > 1 ? (
            //             <Icon
            //                 className={"dynamic-delete-button"}
            //                 type="minus-circle-o"
            //                 onClick={() => this.removeImage(k, index)}
            //             />
            //         ) : null}
            //     </div>

            // </div>
        ));

        return skipLogicItems;

        // return (
            // <tr key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-skip-logic-tr-'+(index+1)} className="logicRow">
            //     <td className={ index > 0 ? "answerValue img-replace shapeLabel default-answerValue answerRange" : "answerValue img-replace shapeLabel first-answerValue answerRange"}>
            //         {/* <label className={ index > 0 ? 'hidden' : ''}>Score</label> */}
            //         <div className="sm-input sm-input--select sm-input--sm">
            //             <select className="answerRangeFrom" style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}}><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option><option value="6">5</option><option value="7">6</option><option value="8">7</option><option value="9">8</option><option value="10">9</option><option value="11">10</option></select>
            //         </div>
            //         &nbsp; to &nbsp;
            //         <div className="sm-input sm-input--select sm-input--sm">
            //             <select className="answerRangeTo" style={{paddingTop:'1px', paddingBottom:'1px', paddingRight:'30px'}}><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option><option value="6">5</option><option value="7">6</option><option value="8">7</option><option value="9">8</option><option value="10">9</option><option value="11">10</option></select>
            //         </div>
            //     </td>
            //     <td className="skipTo">
                    
            //         <div className="block" style={{ marginTop: '15px'}}>

            //             <div className="thePage">
            //                 <label className={ index > 0 ? 'hidden' : ''}>Page</label>
            //                 <div className="sm-input sm-input--select sm-input--sm" id={"question-"+this.state.question.order_no+"-dropdown-skip-page-container-"+(index+1)}>
            //                 </div>
            //             </div>

            //             <div className={ parseInt(this.state.question.page_no) === parseInt(this.state.skipToPageOption[index]) && this.state.numQuestionOnPageSkip[index] === 1 ? 'hidden' : "theQuestion"}>
            //                 <span>
            //                     <label className={ index > 0 ? 'hidden' : ''}>Question</label>
            //                     <div className="sm-input sm-input--select sm-input--sm" style={{ width: '400px' }} id={"question-"+this.state.question.order_no+"-dropdown-skip-question-container-"+(index+1)}>
            //                     </div>
            //                 </span>
            //             </div>

            //         </div>

            //         {/* <a className="selectPage faux_dropdown" href="#" >--Choose Page--</a>
            //         <a className="selectQuestion faux_dropdown disabled" href="#">&nbsp;</a> */}
            //     </td>
            //     <td className={ index > 0 ? "logicActions default-logicActions" : "logicActions first-logicActions"}>
            //         {/* <a className="deleteLogic" href="#" title="Delete this logic row."><span className="smf-icon">-</span></a> */}
            //         <a href="# " className="clearLogic link" onClick={()=>this.clearSkipLogicDropdownOption(index)}>Clear</a>
            //     </td>
            // </tr>
        // );
    }

    getQuestionOptionRow = async (no: any, jwt: any) => {
      // console.log (`question no.${no}`);

        const index = no-1;  

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', this.state.survey.id + '/' + no, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`get question ${no}`, rp.Messages);
                      // console.log(`get question ${no}`, rp.Data);
                      // console.log(`get question ${no} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length === 1){
                        return (<option key={this.state.actionKey+'-option-'+no} value={no} className="user-generated">{rp.Data.recordset[0].order_no}. {rp.Data.recordset[0].question_label}</option>);
                        }

                        return <option key={this.state.actionKey+'-option-'+no}></option>;

                    } else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return <option key={this.state.actionKey+'-option-'+no}></option>;
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    //MOVE Handler Fucntions
    setMoveToPageHandler = (e : any) => {

      // console.log('click Dropdown Page Option target', e.target);
      // console.log('click Dropdown Page Option target id', e.target.id);
      // console.log('click Dropdown Page Option target value', e.target.value);

        const value = e.target.value;

      // console.log('click Dropdown Page Option value', value);

        this.setState({
            moveToPageOption: value,
        },  () => { 
              // console.log(`value ${value}`);
                this.renderElement(this.state.actionKey);
                // this.setFirstQuestionOption(allQuestionOptionElementCopy);
                // this.props.answerHandler(this.props.question.no, value ? value : '', this.state.requiredLabelState);
            } 
        );

    }

    setToPosHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown Position Option value', value);
        this.setState({
            moveToPosOption: value,
        },  () => { 
              // console.log(`value ${value}`);
            } 
        );
    }
    
    setToQuestionHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown Question Option value', value);

        this.setState({
            moveToQuestionOption: value,
        },  () => { 
              // console.log(`value ${value}`);
            } 
        );
    }

    //COPY Handler Fucntions
    setCopyToPageHandler = (e : any) => {
      // console.log('click Dropdown Copy Page Option target', e.target);
      // console.log('click Dropdown Copy Page Option target id', e.target.id);
      // console.log('click Dropdown Copy Page Option target value', e.target.value);

        const value = e.target.value;

      // console.log('click Dropdown Copy Page Option value', value);

        this.setState({
            copyToPageOption: value,
        },  () => { 
              // console.log(`value ${value}`);
                // this.props.answerHandler(this.props.question.no, value ? value : '', this.state.requiredLabelState);
            } 
        );
        
        this.renderElement(this.state.actionKey);
    }

    setCopyToQuestionHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown Copy Question Option value', value);

        this.setState({
            copyToQuestionOption: value,
        },  () => { 
              // console.log(`value ${value}`);
            } 
        );
    }

    setCopyToPosHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown Copy Position Option value', value);
        this.setState({
            copyToPosOption: value,
        },  () => { 
              // console.log(`value ${value}`);
            } 
        );
    }

    moveDropdownElement(numQuestionOnPage: any){
      return (
                <div className="questionSetting">
                    <fieldset className="expander expand moveSetting">
                        <Alert message={`"Move" action will remove all Skip "Logic".`} type="info" showIcon />
                        <br/>
                        <label className="switch">
                            Move this question to ...
                            {/* <a className="q " data-help="help-options-move-question"><span className="notranslate">?</span></a> */}
                        </label>

                        <div className="block" style={{ marginTop: '15px'}}>

                            <div className="thePage">
                                <label>Page</label>
                                <div className="sm-input sm-input--select sm-input--sm">
                                    <select value={this.state.moveToPageOption} id={"question-"+this.state.question.order_no+"-dropdown-move-page-option"} className="movePage no-touch" onChange={ (e) => this.setMoveToPageHandler(e) }></select>
                                </div>
                            </div>

                            <div className={ parseInt(this.state.question.page_no) === parseInt(this.state.moveToPageOption) && numQuestionOnPage === 1 ? 'hidden' : "beforeAfter"}>
                                <label>Position</label>
                                <div className="sm-input sm-input--select sm-input--sm">
                                    <select className="movePos" onChange={ (e) => this.setToPosHandler(e) }>
                                        <option value="after">After</option>
                                        <option value="before">Before</option>
                                    </select>
                                </div>
                            </div>

                            <div className={ parseInt(this.state.question.page_no) === parseInt(this.state.moveToPageOption) && numQuestionOnPage === 1 ? 'hidden' : "theQuestion"}>
                                <span>
                                    <label>Question</label>
                                    <div className="sm-input sm-input--select sm-input--sm">
                                        <select id={"question-"+this.state.question.order_no+"-dropdown-move-question-option"} className="moveTarget no-touch" onChange={ (e) => this.setToQuestionHandler(e) }></select>
                                    </div>
                                </span>
                            </div>

                        </div>
                    </fieldset>
                </div>
      );
    }

    copyDropdownElement(){
      return (
                <div className="questionSetting">
                    <fieldset className="expander expand moveSetting">
                        <Alert message={`"Copy" action will remove all Skip "Logic".`} type="info" showIcon />
                        <br/>
                        <label className="switch">
                            Copy this question and put it on ...
                            {/* {/* <a className="q " data-help="help-options-copy-question"><span className="notranslate">?</span></a> */}
                        </label>

                        <div className="block" style={{ marginTop: '15px'}}>

                            <div className="thePage">
                                <label>Page</label>
                                <div className="sm-input sm-input--select sm-input--sm">
                                    <select value={this.state.copyToPageOption} id={"question-"+this.state.question.order_no+"-dropdown-copy-page-option"} className="copyPage no-touch" onChange={ (e) => this.setCopyToPageHandler(e) }></select>
                                </div>
                            </div>

                            <div className="beforeAfter">
                                <label>Position</label>
                                <div className="sm-input sm-input--select sm-input--sm">
                                    <select className="copyPos" onChange={ (e) => this.setCopyToPosHandler(e) }>
                                        <option value="after">After</option>
                                        <option value="before">Before</option>
                                    </select>
                                </div>
                            </div>

                            <div className="theQuestion">
                                <span>
                                    <label>Question</label>
                                    <div className="sm-input sm-input--select sm-input--sm">
                                        <select id={"question-"+this.state.question.order_no+"-dropdown-copy-question-option"} className="copyTarget no-touch" onChange={ (e) => this.setCopyToQuestionHandler(e) }></select>
                                    </div>
                                </span>
                            </div>

                        </div>
                    </fieldset>
                </div>
      );
    }

    clearAllSkipLogicDropdownOption(){

      // console.log(`clearAllSkipLogicDropdownOption`);

        let skipToPageOptionArr = this.state.skipToPageOption;
        for(let index = 0 ; index < skipToPageOptionArr.length ; index++) skipToPageOptionArr[index] = 0;
        let skipToQuestionOptionArr = this.state.skipToQuestionOption;
        for(let index = 0 ; index < skipToQuestionOptionArr.length ; index++) skipToQuestionOptionArr[index] = 0;

        this.setState({
            skipToPageOption: skipToPageOptionArr,
            skipToQuestionOption: skipToQuestionOptionArr,
        },  () => { 
              // console.log(`clearAllSkipLogicDropdownOption this.state.skipToPageOption ${this.state.skipToPageOption}`);
              // console.log(`clearAllSkipLogicDropdownOption this.state.skipToQuestionOption ${this.state.skipToQuestionOption}`);
                // this.renderElement(this.state.actionKey);
                // this.renderLogicDropdownElement(index);
                // for(let index = 0 ; index < 5 ; index++){
                //     this.renderPageDropdownOptionElement(index);
                //     this.renderQuestionDropdownOptionElement(index, false);
                // }
                this.skipLogicListRender();
            } 
        );

    }
    
    // clearSkipLogicDropdownOption(index: any){
    //   // console.log(`clearSkipLogicDropdownOption index`, index);

    //     let skipToPageOptionArr = this.state.skipToPageOption;
    //     skipToPageOptionArr[index] = 0;
    //     let skipToQuestionOptionArr = this.state.skipToQuestionOption;
    //     skipToQuestionOptionArr[index] = 0;
        
    //     this.setState({
    //         skipToPageOption: skipToPageOptionArr,
    //         skipToQuestionOption: skipToQuestionOptionArr,
    //     },  () => { 
    //           // console.log(`clearAllSkipLogicDropdownOption this.state.skipToPageOption ${this.state.skipToPageOption}`);
    //           // console.log(`clearAllSkipLogicDropdownOption this.state.skipToQuestionOption ${this.state.skipToQuestionOption}`);
    //             this.renderPageDropdownOptionElement(index);
    //             this.renderQuestionDropdownOptionElement(index, false);
    //         } 
    //     );
    // }

    skipLogicTabElement(){
        return (
        <div className="questionSetting editorSection">
            {/* <Alert
                message="Warning"
                description={`Please make sure you have arrange all your questions in a proper order before performing a Skip "Logic".`}
                type="warning"
                showIcon
                /> */}
            <Alert message={`Please make sure you have arrange all your questions in a proper order before performing a Skip "Logic".`} type="warning" showIcon />
            <br/>
            <table className="choiceSkipLogic question-single-choice-radio question-multiple-choice question-single-choice-select question-matrix question-nps question-emoji question-image-choice-single question-image-choice-multiple" cellSpacing="0" id="logicRows">
                <thead>
                    <tr className="highlight">
                        <th className="answerValue shapeLabel">If answer is from... 
                            {/* <a className="q " data-help="help-question-iflogic"><span className="notranslate">?</span></a> */}
                        </th>
                        <th className="skipTo" style={{ width: '650px' }}>Then skip to ... 
                            {/* <a className="q " data-help="help-question-thenlogic"><span className="notranslate">?</span></a> */}
                        </th>
                        <th className="clearAllLogic">
                            <a href="# " className="link" onClick={()=>this.clearAllSkipLogicDropdownOption()}>Clear All</a>
                        </th>
                    </tr>
                </thead>

                <tbody id="tbody-logic-row"></tbody>

            </table>
        </div>
        );
    }

    setImageWhenAddChekced = () => {
        // console.log(`setImageWhenAddChekced this.state.question.image_enabled`, this.state.question.image_enabled);
        if(this.state.question.image_enabled){
            for(let i = 0; i < this.state.imageType.length; i++){
                // set star choice and weight
                let imageLabelFieldName = 'image_name['+i+']';
                let imageLabelFieldNameHtml = 'image_name_html['+i+']';
                let imageSourceFieldName = 'image_src['+i+']';
                this.props.form.setFieldsValue({
                    [imageLabelFieldName]: this.state.imageLabel[i],
                    [imageLabelFieldNameHtml]: this.state.imageLabelHtml[i],
                    [imageSourceFieldName]: this.state.imageSource[i],
                }, () => { 
                    // console.log('setFieldsValue', imageLabelFieldName)
                });

                // this.props.form.setFieldsValue({
                //     [imageSourceFieldName]: this.state.imageSource[i],
                // }, () => { 
                //     // console.log('setFieldsValue', imageSourceFieldName)
                // });
            }
        }
    }

    setSkipToPageHandler = (e: any, no: any) => {
        const index = no - 1;
        const value = e.target.value;
      // console.log(`click Dropdown Skip ${no} to Page Option value`, value);

        let skipToPageOptionArr = this.state.skipToPageOption;
        skipToPageOptionArr[index] = parseInt(value);
        
        this.setState({
            skipToPageOption: skipToPageOptionArr,
        },  () => { 
              // console.log(`setSkipToPageHandler ${no} this.state.skipToPageOption ${this.state.skipToPageOption[index]}`);
                this.renderPageDropdownOptionElement(index);
                this.renderQuestionDropdownOptionElement(index, true);
            } 
        );
    }
    
    setSkipToQuestionHandler = (e: any, no: any) => {
        const index = no - 1;
        const value = e.target.value;
      // console.log(`click Dropdown Skip to Question ${no} Option value`, value);

        let skipToQuestionOptionArr = this.state.skipToQuestionOption;
        skipToQuestionOptionArr[index] = parseInt(value);
        
        this.setState({
            skipToQuestionOption: skipToQuestionOptionArr,
        },  () => { 
              // console.log(`setSkipToQuestionHandler ${no} this.state.skipToQuestionOption ${this.state.skipToQuestionOption[index]}`);
                this.renderPageDropdownOptionElement(index);
                this.renderQuestionDropdownOptionElement(index);
            } 
        );
    }
    
    setAnswerFromHandler = (e: any, no: any) => {
        const index = no;
        const value = e.target.value;
      // console.log(`click Dropdown Answer From Option no`, no);
      // console.log(`click Dropdown Answer From Option value`, value);

        let weightAnswerFromOptionArr = this.state.weightAnswerFromOption;
        this.state.weightAnswerFromOption[index] = parseInt(value);
        
        this.setState({
            weightAnswerFromOption: weightAnswerFromOptionArr,
        },  () => { 
              // console.log(`setAnswerToHandler ${no} this.state.weightAnswerFromOption ${this.state.weightAnswerFromOption}`);
                this.renderAnswerFromDropdownOptionElement(index);
            } 
        );
    }

    setAnswerToHandler = (e: any, no: any) => {
        const index = no;
        const value = e.target.value;
      // console.log(`click Dropdown Answer to Option no`, no);
      // console.log(`click Dropdown Answer to Option value`, value);

        let weightAnswerToOptionArr = this.state.weightAnswerToOption;
        this.state.weightAnswerToOption[index] = parseInt(value);
        
        this.setState({
            weightAnswerToOption: weightAnswerToOptionArr,
        },  () => { 
              // console.log(`setAnswerToHandler ${no} this.state.weightAnswerToOption ${this.state.weightAnswerToOption}`);
                this.renderAnswerToDropdownOptionElement(index);
            } 
        );
    }

    removeImage = (k: any, index: any) => {
        const { form } = this.props;
        // can use data-binding to get
        const imageKeys = form.getFieldValue('imageKeys');
        // We need at least one image
        if (imageKeys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            imageKeys: imageKeys.filter((key: any) => key !== k),
        });

        let imageLabelArr = this.state.imageLabel;
        let imageLabelHtmlArr = this.state.imageLabelHtml;
        let imageSourceArr = this.state.imageSource;

        imageLabelArr.splice(index, 1);
        imageLabelHtmlArr.splice(index, 1);
        imageSourceArr.splice(index, 1);

        this.setState({
            imageLabel: imageLabelArr,
            imageLabelHtml: imageLabelHtmlArr,
            imageSource: imageSourceArr
        },  () => { 
              // console.log(`after removeImage index[${index}] this.state.imageLabe`, this.state.imageLabel);
              // console.log(`after removeImage index[${index}] this.state.imageSource`, this.state.imageSource);
            } 
        );
    }

    addImage = () => {
        const { form } = this.props;
        // can use data-binding to get
        const imageKeys = form.getFieldValue('imageKeys');
        const nextImageKeys = imageKeys.concat( imageId++ );

      // console.log(`addImage imageKeys and nextImageKeys`, imageKeys, nextImageKeys)

        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            imageKeys: nextImageKeys,
        });
    }

    removeSkipLogic = (k: any, index: any) => {

        const { form } = this.props;
        // can use data-binding to get
        const skipLogicKeys = form.getFieldValue('skipLogicKeys');

      // console.log(`removeSkipLogic k ${k} index ${index} skipLogicKeys`, skipLogicKeys);

        // We need at least one skip logic
        if (skipLogicKeys.length === 1) {
            return;
        }
        
        // can use data-binding to set
        form.setFieldsValue({ 
            skipLogicKeys: skipLogicKeys.filter((key: any) => key !== k),
        }, () => {
          // console.log(`removeSkipLogic k ${k} index ${index} skipLogicKeys`, skipLogicKeys);

            let weightAnswerFromOptionArr = this.state.weightAnswerFromOption;
            let weightAnswerToOptionArr = this.state.weightAnswerToOption;
            let skipToPageOptionArr = this.state.skipToPageOption;
            let skipToQuestionOptionArr = this.state.skipToQuestionOption;

            weightAnswerFromOptionArr.splice(index, 1);
            weightAnswerToOptionArr.splice(index, 1);
            skipToPageOptionArr.splice(index, 1);
            skipToQuestionOptionArr.splice(index, 1);

            this.setState({
                weightAnswerFromOption: weightAnswerFromOptionArr,
                weightAnswerToOption: weightAnswerToOptionArr,
                skipToPageOption: skipToPageOptionArr,
                skipToQuestionOption: skipToQuestionOptionArr,
            },  () => { 
                  // console.log(`after removeSkipLogic index[${index}] this.state.weightAnswerFromOption`, this.state.weightAnswerFromOption);
                  // console.log(`after removeSkipLogic index[${index}] this.state.weightAnswerToOption`, this.state.weightAnswerToOption);
                  // console.log(`after removeSkipLogic index[${index}] this.state.skipToPageOption`, this.state.skipToPageOption);
                  // console.log(`after removeSkipLogic index[${index}] this.state.skipToQuestionOption`, this.state.skipToQuestionOption);
                    this.skipLogicListRender();
                } 
            );

        });
    }

    addSkipLogic = (firstTimeLoad?: any, fix?: any, index?: any) => {

      // console.log(`addSkipLogic firstTimeLoad ${firstTimeLoad} fix ${fix} index ${index}`);
        if(firstTimeLoad){

            if(fix === 0){
                const { form } = this.props;
                // can use data-binding to get
                const skipLogicKeys = form.getFieldValue('skipLogicKeys');
                const nextskipLogicKeys = skipLogicKeys.concat( skipLogicId++ );
              // console.log(`addSkipLogic skipLogicKeys and nextskipLogicKeys`, skipLogicKeys, nextskipLogicKeys)
                // can use data-binding to set
                // important! notify form to detect changes
                form.setFieldsValue({
                    skipLogicKeys: nextskipLogicKeys,
                });
            }

            //render skip logic row in the tbody element
            let parentEl = document.getElementById("tbody-logic-row");
            // let childEl = allSkipLogicTr.map((obj, i) => this.getSkipLogicRow(i));
            let childEl = this.getAllSkipLogicRow();
            ReactDOM.render(childEl, parentEl, () => {
                    
                //render dropdown option for tr
                for(let index = 0 ; index < this.state.skipToQuestionOption.length ; index++){
                    
                    //render question dropdown from answer option
                    this.renderAnswerFromDropdownOptionElement(index);

                    //render page dropdown to answer option
                    this.renderAnswerToDropdownOptionElement(index);

                    //render question dropdown option
                    this.renderPageDropdownOptionElement(index);

                    //render page dropdown option
                    this.renderQuestionDropdownOptionElement(index);

                }//index loop

              // console.log('ReactDOM.render(child, parent, function() done');
            });
        }
        else{
            const { form } = this.props;
            // can use data-binding to get
            const skipLogicKeys = form.getFieldValue('skipLogicKeys');
            const nextskipLogicKeys = skipLogicKeys.concat( skipLogicId++ );
          // console.log(`addSkipLogic skipLogicKeys and nextskipLogicKeys`, skipLogicKeys, nextskipLogicKeys)
            // can use data-binding to set
            // important! notify form to detect changes
            // form.setFieldsValue({
            //     skipLogicKeys: nextskipLogicKeys,
            // });

            form.setFieldsValue({ 
                skipLogicKeys: nextskipLogicKeys,
            }, () => {
              // console.log(`addSkipLogic skipLogicKeys`, skipLogicKeys);
    
                let weightAnswerFromOptionArr = this.state.weightAnswerFromOption;
                let weightAnswerToOptionArr = this.state.weightAnswerToOption;
                let skipToPageOptionArr = this.state.skipToPageOption;
                let skipToQuestionOptionArr = this.state.skipToQuestionOption;
    
                weightAnswerFromOptionArr.push(0);
                weightAnswerToOptionArr.push(0);
                skipToPageOptionArr.push(0);
                skipToQuestionOptionArr.push(0);
    
                this.setState({
                    weightAnswerFromOption: weightAnswerFromOptionArr,
                    weightAnswerToOption: weightAnswerToOptionArr,
                    skipToPageOption: skipToPageOptionArr,
                    skipToQuestionOption: skipToQuestionOptionArr,
                },  () => { 
                      // console.log(`after addSkipLogic index[${index}] this.state.weightAnswerFromOption`, this.state.weightAnswerFromOption);
                      // console.log(`after addSkipLogic index[${index}] this.state.weightAnswerToOption`, this.state.weightAnswerToOption);
                      // console.log(`after addSkipLogic index[${index}] this.state.skipToPageOption`, this.state.skipToPageOption);
                      // console.log(`after addSkipLogic index[${index}] this.state.skipToQuestionOption`, this.state.skipToQuestionOption);
                        this.skipLogicListRender();
                    } 
                );
    
            });

            // this.skipLogicListRender(nextskipLogicKeys);
        }
    }

    skipLogicListRender(){
      // console.log('skipLogicListRender');
        //render skip logic row in the tbody element
        let parentEl = document.getElementById("tbody-logic-row");
        // let childEl = allSkipLogicTr.map((obj, i) => this.getSkipLogicRow(i));
        let childEl = this.getAllSkipLogicRow();
        ReactDOM.render(childEl, parentEl, () => {
                
            //render dropdown option for tr
            for(let index = 0 ; index < this.state.skipToQuestionOption.length ; index ++){
                
                //render question dropdown from answer option
                this.renderAnswerFromDropdownOptionElement(index);

                //render page dropdown to answer option
                this.renderAnswerToDropdownOptionElement(index);
                
                //render question dropdown option
                this.renderPageDropdownOptionElement(index);

                //render page dropdown option
                this.renderQuestionDropdownOptionElement(index);

            }//index loop

        });
    }

    // addSkipLogic = () => {
    //     const { form } = this.props;
    //     // can use data-binding to get
    //     const skipLogicKeys = form.getFieldValue('skipLogicKeys');
    //     const nextskipLogicKeys = skipLogicKeys.concat( skipLogicId++ );
    //   // console.log(`addSkipLogic skipLogicKeys and nextskipLogicKeys`, skipLogicKeys, nextskipLogicKeys)
    //     // can use data-binding to set
    //     // important! notify form to detect changes
    //     form.setFieldsValue({
    //         skipLogicKeys: nextskipLogicKeys,
    //     });

    //     //render skip logic row in the tbody element
    //     let parentEl = document.getElementById("tbody-logic-row");
    //     // let childEl = allSkipLogicTr.map((obj, i) => this.getSkipLogicRow(i));
    //     let childEl = this.getAllSkipLogicRow();
    //     // console.log('childEl', childEl);
    //     ReactDOM.render(childEl, parentEl, () => {
            
    //         //render dropdown option for tr
    //         for(let index = 0 ; index < nextskipLogicKeys.length ; index ++){
                
    //             //render question dropdown option
    //             this.renderPageDropdownOptionElement(index);

    //             //render page dropdown option
    //             this.renderQuestionDropdownOptionElement(index);

    //         }//index loop

    //       // console.log('ReactDOM.render(child, parent, function() done');
    //     });
    // }

    customRequest = (componentsData: any) => {
      // console.log('componentsData', componentsData);
        let formData = new FormData();
        formData.append('file', componentsData.file);
        formData.append('domain', 'POST');
        formData.append('filename', componentsData.file.name );
    
        fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getJwtToken() as string}`,
                'x-site' : this.props.match.params.xSite as string
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => { 
          // console.log('data', data); 
          // console.log('data.url', data.url); 

            let imageSourceArr = this.state.imageSource;
          // console.log('imageSourceArr', imageSourceArr); 

            imageSourceArr[componentsData.data.fieldNum] = data.url;
          // console.log('after imageSourceArr', imageSourceArr); 

            this.setState({
                imageSource: imageSourceArr,
            }, () => { 
              // console.log('this.state.imageSource', this.state.imageSource)
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `scoreQuestionForm customRequest catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading image")
        })   
    }

    handleImageChange = (info: any) => {
        if (info.file.status === 'uploading') {
          this.setState({ loadingImage: true });
          return;
        }
  
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (imageUrl: any) =>
              this.setState({
                // imageUrl,
                loadingImage: false,
              }, () => { /*console.log('imageUrl', imageUrl)*/ }),
            );
            toastr.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            toastr.error(`${info.file.name} file upload failed.`);
        }
  
    };

    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file: any) => {
      // console.log('file', file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            toastr.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }

    render() {

        const uploadButton = (
            <div>
                <Icon type={this.state.loadingImage ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const { getFieldDecorator, getFieldValue  } = this.props.form;
        const { selectedItems, selectedAreaOfImpacts, selectedDepartments } = this.state;
        const OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

        // const areaOfImpactsOptions = this.state.allAreaOfImpactName.map((k: any, index: any) => { return k });
        const areaOfImpactsOptions = this.state.allAreaOfImpactName.map((k: any, index: any) => { return k.split('~')[0] });
        const filteredAreaOfImpactsOptions = areaOfImpactsOptions.filter((o: any, index: any) => !selectedAreaOfImpacts.includes(o));

        const departmentsOptions = this.state.allDepartmentName.map((k: any, index: any) => { return k });
        const filteredDepartmentsOptions = departmentsOptions.filter((o: any, index: any) => !selectedDepartments.includes(o));

        getFieldDecorator('imageKeys', { initialValue: [] });
        const imageKeys = getFieldValue('imageKeys');
        const formItems = imageKeys.map((k: any, index: any) => (
            <div key={`formItem-`+k}>

                <Divider style={{ fontSize: '16px', fontStyle: 'italic' }} >Image {index+1}</Divider>

                <Form.Item>
                    <label className="sm-label sm-label--stretch" style={{ width: 'auto', display: 'inline-block', paddingRight: 52 }}>Image label : </label>
                    <RichTextEditor
                        xSite={this.props.match.params.xSite}
                        style={{ marginBottom: '15px' }}
                        id={`image_name`}
                        index={`${k}`}
                        theme={'snow'}
                        fontColor={this.state.fontColor}
                        defaultValue={this.state.imageLabelHtml ? this.state.imageLabelHtml[index] : '<p></p>'} 
                        disableAlign={true}
                        onChange={this.onChoiceRichChange}
                        placeholder={'You can enter an image label here...'}
                    />
                    {getFieldDecorator(`image_name[${k}]`, {
                    validateTrigger: ['onChange'],
                    initialValue: this.state.imageLabel ? this.state.imageLabel[index] : '',
                    rules: [{
                        // required: true,
                        // whitespace: true,
                        // message: "Enter an image label.",
                    }],
                    })(
                    <Input style={{display: 'none'}} /*placeholder="Image label" style={{ width: '80%' }}*/ />
                    )}
                </Form.Item>
                <Form.Item style={{display: 'none'}} > {getFieldDecorator(`image_name_html[${k}]`)(<Input/>)} </Form.Item>

                <Upload 
                        customRequest={this.customRequest}
                        name="image"
                        listType="picture-card"
                        className="image-uploader"
                        showUploadList={false}
                        data={{ fieldNum : index }}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleImageChange}
                    >
                    {this.state.imageSource[index] ? <img src={this.state.imageSource[index]} alt="image" style={{ width: '100%' }} /> : uploadButton}
                </Upload>

                <div style={{ textAlign: 'center' }}>
                    
                    {imageKeys.length === index+1 ? (
                        <Icon
                            className={"dynamic-delete-button"}
                            type="plus-circle-o"
                            onClick={() => this.addImage()}
                            style={{ paddingRight: '5px'}}
                        />
                    ) : null}

                    {/* {imageKeys.length > 1 && index > 0 ? ( */}
                    {imageKeys.length > 1 ? (
                        <Icon
                            className={"dynamic-delete-button"}
                            type="minus-circle-o"
                            onClick={() => this.removeImage(k, index)}
                        />
                    ) : null}
                </div>

            </div>
        ));

        // console.log(`scoreQuestionForm render() return(...)`);
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (
            <div>

                <Tabs defaultActiveKey={this.state.actionKey} onChange={this.tabCall} className="tabs question-setting-tabs">

                    {/* Remove "EDIT" tab for a template question */}
                    <TabPane tab="EDIT" key="edit" className="bottom-space">

                        <div className="questionSetting singleVariation questionTitle" id="questionTitleWrap">
                            <table>
                                <tbody className="question-title-box" data-questionsection="title">
                                    <tr className="title-row">
                                        <td className="questionNum">
                                            <strong>Q<var className="questionPos notranslate">{this.state.question.order_no}</var></strong>
                                        </td>
                                        { this.state.survey.multi_lang ? 
                                        <td className="questionNum">
                                            <strong>TH</strong>
                                        </td>
                                        : null
                                        }
                                        <td className="questionText">

                                            <Form.Item {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`question_label`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.question_label_html ? this.state.question.question_label_html : `<p>${this.state.question.question_label ? this.state.question.question_label : ''}</p>`} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'You must enter question text...'}
                                                    disable={this.state.alreadyResponded}
                                                /> 
                                                {getFieldDecorator('question_label', {
                                                    rules: [
                                                    {
                                                        required: true,
                                                        message: 'You must enter question text.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Enter your question text"*/ />)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('question_label_html')(<Input/>)} </Form.Item>
                                        </td>
                                        <td className="questionType">
                                            <span className="qNumType staticType">
                                                <span className="question-essay i">{this.state.questionTypeLabel}</span>
                                            </span>
                                        </td>
                                    </tr>
                                    { this.state.survey.multi_lang ? 
                                    <tr className="title-row">
                                        <td className="questionNum">
                                        &nbsp;
                                        </td>
                                        { this.state.survey.multi_lang ? 
                                        <td className="questionNum">
                                            <strong>EN</strong>
                                        </td>
                                        : null
                                        }
                                        <td className="questionText" style={{ paddingTop: '20px' }}>

                                            <Form.Item {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`question_label_EN`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.question_label_EN_html ? this.state.question.question_label_EN_html : ( this.props.question.question_label_EN ? `<p>${this.props.question.question_label_EN}</p>` : this.state.question.question_label ? `<p>${this.state.question.question_label}</p>` : '<p></p>' )} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'You must enter question text...'}
                                                    disable={this.state.alreadyResponded}
                                                /> 
                                                {getFieldDecorator('question_label_EN', {
                                                    rules: [
                                                    {
                                                        required: true,
                                                        message: 'You must enter question text.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}}/*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Enter your question text"*/ />)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('question_label_EN_html')(<Input/>)} </Form.Item>
                                        </td>
                                        {/* <td className="questionType">
                                            <span className="qNumType staticType">
                                                <span className="question-essay i">{this.state.questionTypeLabel}</span>
                                            </span>
                                        </td> */}
                                    </tr>
                                    : null }
                                </tbody>
                            </table>
                        </div>

                        {/* <div className="questionSetting starTable" style={{ borderBottom: 'solid 1px lightgray' }}>
                            <label className="switch" style={{ display: 'inline-block', fontSize: '14px', fontWeight: 'bold' }}>Area of impact</label>
                            <div className="clearfix" style={{ display: 'inline-block', width: '80%', padding: '0px 25px 25px 25px' }}>
                                <Select
                                    mode="multiple"
                                    placeholder="Please select Area Of Impacts for this question"
                                    value={selectedAreaOfImpacts}
                                    onChange={this.handleAddAreaOfImpactChange}
                                    style={{ width: '100%' }}
                                >
                                    {filteredAreaOfImpactsOptions.map((item: any) => (
                                    <Select.Option key={item} value={item}>
                                        {item}
                                    </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <Checkbox onChange={this.onEnabledKPIChange.bind(this)} checked={this.state.question.enabled_kpi}>Enable KPI</Checkbox>

                            { this.state.question.enabled_kpi ? 
                            <div>
                                <label className="switch" style={{ display: 'inline-block', fontSize: '14px', fontWeight: 'bold' }}>Department</label>
                                <div className="clearfix" style={{ display: 'inline-block', width: '80%', padding: '15px 25px 5px 25px' }}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Please select KPI Department for this question"
                                        value={selectedDepartments}
                                        onChange={this.handleAddDepartmentChange}
                                        style={{ width: '100%' }}
                                    >
                                        {filteredDepartmentsOptions.map((item: any) => (
                                        <Select.Option key={item} value={item}>
                                            {item}
                                        </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            : null }
                        </div> */}

                        <div className="editorSection">
                            
                            <div className="questionSetting starTable comment-box-setting-container">

                                <Checkbox onChange={this.onShowLabelChange.bind(this)} checked={this.state.question.show_label}>Add labels</Checkbox>

                                {this.state.question.show_label ?
                                
                                <div className="clearfix" style={{ padding: '25px' }}>
                                    { this.state.survey.multi_lang ?
                                    <div>
                                        <label className="sm-label sm-label--stretch"><b>Low score label: </b></label>
                                        <Form.Item label="TH" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`low_score_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.low_score_label_html ? this.state.question.low_score_label_html : `<p>${this.state.question.low_score_label ? this.state.question.low_score_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            /> 
                                            {getFieldDecorator('low_score_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('low_score_label_html')(<Input/>)} </Form.Item>

                                        <Form.Item label="EN" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`low_score_label_EN`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.low_score_label_EN_html ? this.state.question.low_score_label_EN_html : `<p>${this.state.question.low_score_label_EN ? this.state.question.low_score_label_EN : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            /> 
                                            {getFieldDecorator('low_score_label_EN', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('low_score_label_EN_html')(<Input/>)} </Form.Item>
                                    </div>
                                    : 
                                    <div>
                                        <label className="sm-label sm-label--stretch"><b>Low score label:</b></label>
                                        <Form.Item {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`low_score_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.low_score_label_html ? this.state.question.low_score_label_html : `<p>${this.state.question.low_score_label ? this.state.question.low_score_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            />
                                            {getFieldDecorator('low_score_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('low_score_label_html')(<Input/>)} </Form.Item>
                                    </div>
                                    }

                                    { this.state.survey.multi_lang ? 
                                    <div style={{ marginTop: '35px' }}>
                                        <label className="sm-label sm-label--stretch"><b>High score label:</b></label>
                                        <Form.Item label="TH" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`high_score_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.high_score_label_html ? this.state.question.high_score_label_html : `<p>${this.state.question.high_score_label ? this.state.question.high_score_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            />
                                            {getFieldDecorator('high_score_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('high_score_label_html')(<Input/>)} </Form.Item>

                                        <Form.Item label="EN" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`high_score_label_EN`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.high_score_label_EN_html ? this.state.question.high_score_label_EN_html : `<p>${this.state.question.high_score_label_EN ? this.state.question.high_score_label_EN : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            />
                                            {getFieldDecorator('high_score_label_EN', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('high_score_label_EN_html')(<Input/>)} </Form.Item>
                                    </div>
                                    : 
                                    <div style={{ marginTop: '35px' }}>
                                        <label className="sm-label sm-label--stretch"><b>High score label:</b></label>
                                        <Form.Item {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`high_score_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.high_score_label_html ? this.state.question.high_score_label_html : `<p>${this.state.question.high_score_label ? this.state.question.high_score_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter a label...'}
                                                disable={this.state.alreadyResponded}
                                            />
                                            {getFieldDecorator('high_score_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter a label.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}} /*disabled={ !this.state.isNotTemplateQuestion || this.state.alreadyResponded } className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)"*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('high_score_label_html')(<Input/>)} </Form.Item>
                                    </div>
                                    }

                                </div>

                                : null }

                            </div>
                            
                        </div>

                        <div className="editorSection">

                            <div className="questionSetting starTable comment-box-setting-container">

                                <Checkbox onChange={this.onAddCommentChange.bind(this)} checked={this.state.question.show_comment_field}>Add a Comment box (Always on display)</Checkbox>

                                { this.state.question.show_comment_field ? 
                                    
                                    <div className="clearfix" style={{ padding: '25px' }}>
                                        { this.state.survey.multi_lang ?
                                        <div>
                                            <label className="sm-label sm-label--stretch"><b>Label</b></label>
                                            <Form.Item label="TH" {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_label`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_label_html ? this.state.question.comment_field_label_html : `<p>${this.state.question.comment_field_label ? this.state.question.comment_field_label : ''}</p>`} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field label...'}
                                                />
                                                {getFieldDecorator('comment_field_label', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a label.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)" *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_label_html')(<Input/>)} </Form.Item>

                                            <Form.Item label="EN" {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_label_EN`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_label_EN_html ? this.state.question.comment_field_label_EN_html : ( this.props.question.comment_field_label_EN ? `<p>${this.props.question.comment_field_label_EN}</p>` : this.state.question.comment_field_label ? `<p>${this.state.question.comment_field_label}</p>` : '<p></p>' )} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field label...'}
                                                />
                                                {getFieldDecorator('comment_field_label_EN', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a label.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)" *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_label_EN_html')(<Input/>)} </Form.Item>
                                        </div>
                                        : 
                                        <div>
                                            <label className="sm-label sm-label--stretch"><b>Label</b></label>
                                            <Form.Item {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_label`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_label_html ? this.state.question.comment_field_label_html : `<p>${this.state.question.comment_field_label ? this.state.question.comment_field_label : ''}</p>`} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field label...'}
                                                />
                                                {getFieldDecorator('comment_field_label', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a label.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Other (please specify)" *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_label_html')(<Input/>)} </Form.Item>
                                        </div>
                                        }

                                        { this.state.survey.multi_lang ? 
                                        <div style={{ marginTop: '35px' }}>
                                            <label className="sm-label sm-label--stretch"><b>Hint</b></label>
                                            <Form.Item label="TH" {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_hint`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_hint_html ? this.state.question.comment_field_hint_html : `<p>${this.state.question.comment_field_hint ? this.state.question.comment_field_hint : ''}</p>`} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field hint...'}
                                                />
                                                {getFieldDecorator('comment_field_hint', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a hint message.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Please enter a hint." *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_hint_html')(<Input/>)} </Form.Item>

                                            <Form.Item label="EN" {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_hint_EN`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_hint_EN_html ? this.state.question.comment_field_hint_EN_html : ( this.props.question.comment_field_hint_EN ? `<p>${this.props.question.comment_field_hint_EN}</p>` : this.state.question.comment_field_hint ? `<p>${this.state.question.comment_field_hint}</p>` : '<p></p>' )} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field hint...'}
                                                />
                                                {getFieldDecorator('comment_field_hint_EN', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a hint message.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Please enter a hint." *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_hint_EN_html')(<Input/>)} </Form.Item>
                                        </div>
                                        : 
                                        <div style={{ marginTop: '35px' }}>
                                            <label className="sm-label sm-label--stretch"><b>Hint</b></label>
                                            <Form.Item {...formItemLayout} >
                                                <RichTextEditor
                                                    xSite={this.props.match.params.xSite}
                                                    id={`comment_field_hint`}
                                                    theme={'snow'}
                                                    fontColor={this.state.fontColor}
                                                    defaultValue={this.state.question.comment_field_hint_html ? this.state.question.comment_field_hint_html : `<p>${this.state.question.comment_field_hint ? this.state.question.comment_field_hint : ''}</p>`} 
                                                    disableAlign={true}
                                                    onChange={this.onQuestionRichChange}
                                                    placeholder={'Please enter comment field hint...'}
                                                />
                                                {getFieldDecorator('comment_field_hint', {
                                                    rules: [
                                                    {
                                                        // required: true,
                                                        // message: 'You must enter a hint message.',
                                                    },
                                                    ],
                                                })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Please enter a hint." *//>)}
                                            </Form.Item>
                                            <Form.Item style={{display: 'none'}}> {getFieldDecorator('comment_field_hint_html')(<Input/>)} </Form.Item>
                                        </div>
                                        }

                                    </div>

                                    : null }
                            </div>
                            
                        </div>

                    </TabPane>
                    {/* } */}

                    <TabPane tab="OPTIONS" key="options">

                        <div className="questionSetting required-setting-container">

                            <Checkbox onChange={this.onRequiredChange.bind(this)} checked={this.state.question.required}>Require an Answer to This Question</Checkbox>

                            { this.state.question.required ? 

                                <div className="clearfix" style={{ padding: '25px' }}>
                                    { this.state.survey.multi_lang ? 
                                    <div>
                                        <label className="sm-label sm-label--stretch"><b>Display this error message when this question is not answered.</b></label>
                                        <Form.Item label="TH" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`required_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.required_label_html ? this.state.question.required_label_html : `<p>${this.state.question.required_label ? this.state.question.required_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter an error message...'}
                                            /> 
                                            {getFieldDecorator('required_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter an error message.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}}/*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="When a textbox is not answered, display this error message."*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('required_label_html')(<Input/>)} </Form.Item>

                                        <Form.Item label="EN" {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`required_label_EN`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.required_label_EN_html ? this.state.question.required_label_EN_html : ( this.props.question.required_label_EN ? `<p>${this.props.question.required_label_EN}</p>` : this.state.question.required_label ? `<p>${this.state.question.required_label}</p>` : '<p></p>' )} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter an error message...'}
                                            /> 
                                            {getFieldDecorator('required_label_EN', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter an error message.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}}className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="When a textbox is not answered, display this error message." />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('required_label_EN_html')(<Input/>)} </Form.Item>
                                    </div>
                                    :
                                    <div>
                                        <label className="sm-label sm-label--stretch"><b>Display this error message when this question is not answered.</b></label>
                                        <Form.Item {...formItemLayout} >
                                            <RichTextEditor
                                                xSite={this.props.match.params.xSite}
                                                id={`required_label`}
                                                theme={'snow'}
                                                fontColor={this.state.fontColor}
                                                defaultValue={this.state.question.required_label_html ? this.state.question.required_label_html : `<p>${this.state.question.required_label ? this.state.question.required_label : ''}</p>`} 
                                                disableAlign={true}
                                                onChange={this.onQuestionRichChange}
                                                placeholder={'You must enter an error message...'}
                                            /> 
                                            {getFieldDecorator('required_label', {
                                                rules: [
                                                {
                                                    required: true,
                                                    message: 'You must enter an error message.',
                                                },
                                                ],
                                            })(<Input style={{display: 'none'}}/*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="When a textbox is not answered, display this error message."*/ />)}
                                        </Form.Item>
                                        <Form.Item style={{display: 'none'}}> {getFieldDecorator('required_label_html')(<Input/>)} </Form.Item>
                                    </div>
                                    }
                                </div>

                                : null }

                        </div>

                        <div className="questionSetting starTable">

                            <Checkbox onChange={this.onEnabledImageChange.bind(this)} checked={this.state.question.image_enabled}>Add an image(s)</Checkbox>

                            { this.state.question.image_enabled ? 
                                
                                <div className="clearfix" style={{ padding: '25px' }}>
                                    <Form>
                                        {formItems}
                                    </Form>
                                </div>

                                : null }
                        </div>
                    </TabPane>

                    <TabPane tab="LOGIC" key="logic">

                        {/* <div className="questionSetting starTable" style={{ borderBottom: 'solid 1px #D0D2D3' }}>

                            <Checkbox onChange={this.onAddCommentLogicChange.bind(this)} checked={this.state.question.show_comment_field_logic}>Comment Box:  Make the comment box appear once the customer answer matches the choice(s) set below.&nbsp;
                                <Tooltip title="Let your customer voice be heard. You can set the comment box to appear when customer answer matches the choice(s) below.">
                                    <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                </Tooltip>
                            </Checkbox>

                            { this.state.question.show_comment_field_logic ? 
                                
                                <div className="clearfix" style={{ padding: '0 25px 25px 25px' }}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Please select rating choices to Add a Comment box for this question"
                                        value={selectedItems}
                                        onChange={this.handleAddCommentLogicChange}
                                        style={{ width: '100%' }}
                                    >
                                        {filteredOptions.map(item => (
                                        <Select.Option key={item} value={item}>
                                            {item}
                                        </Select.Option>
                                        ))}
                                    </Select>
                                </div>

                                : null }
                        </div> */}

                        <div id={"question-"+this.state.question.order_no+"-skip-logic"}></div>
                    </TabPane>

                    <TabPane tab="MOVE" key="move">
                        <div id={"question-"+this.state.question.order_no+"-move-dropdown"}></div>
                    </TabPane>

                    <TabPane tab="COPY" key="copy">
                        <div id={"question-"+this.state.question.order_no+"-copy-dropdown"}></div>
                    </TabPane>

                </Tabs>

                <footer className="wds-modal__foot">
                    <div className="wds-modal__actions-right">
                    <Button type="primary" className="wds-button wds-button--ghost-filled wds-button--md" onClick={this.props.handleCancel}>
                        CANCEL
                    </Button>
                    <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.check}>
                        {this.state.buttonSaveText}
                    </Button>
                    </div>
                </footer>
            </div>
        );
    }
}
  
const scoreQuestionForm = Form.create<Props>()(ScoreQuestionForm);
export default scoreQuestionForm;
