/* eslint-disable import/first */
import * as React from "react";
// import { Form, Input, Button, Checkbox, Select } from 'antd';
import { Form, Input, Button, Tabs, Checkbox, Icon, Divider, Select, Upload, Spin } from 'antd';
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

let id = 0;

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

    skipToPageOption: any;
    skipToQuestionOption: any;
    numQuestionOnPageSkip: any;

    allSkipPageOptionElement: any;
    allSkipQuestionOptionElement: any;
    allPromiseSkipQuestionPageNo: any;

    selectedAreaOfImpacts: any;

    imageType: any;
    imageLabel: any;
    imageLabelHtml: any;
    imageSource: any;

    imageId: any;

    loadingImage: boolean;
    isNotTemplateQuestion: boolean;
    alreadyResponded: boolean;
    fontColor: any;
}

class TextQuestionForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        isLoading: true,
        survey: this.props.survey,
        question: this.props.question,
        allAreaOfImpactName: [],
        actionKey: this.props.defaultActiveKey,
        buttonSaveText: 'SAVE',

        moveToPageOption: 1,
        moveToPosOption: 'after',
        moveToQuestionOption: 1,
        copyToPageOption: 1,
        copyToPosOption: 'after',
        copyToQuestionOption: 1,
        numQuestionOnPage: 0,
        questionTypeLabel: '',

        skipToPageOption: this.props.toPage,
        skipToQuestionOption: this.props.toQuestion,
        numQuestionOnPageSkip: [],

        allSkipPageOptionElement: [],
        allSkipQuestionOptionElement: [],
        allPromiseSkipQuestionPageNo: [],

        selectedAreaOfImpacts: [],

        imageType: this.props.imageType,
        imageLabel: this.props.imageLabel,
        imageLabelHtml: this.props.imageLabelHtml,
        imageSource: this.props.imageSource,

        imageId: 0,

        loadingImage: false,
        isNotTemplateQuestion: (parseInt(this.props.question.template_question_id) === 0 || this.props.question.template_question_id === null),
        alreadyResponded: parseInt(this.props.question.already_responded as any) > 0,
        fontColor: []
      }
    // console.log('TextQuestionForm constructor', props);
    }

    componentDidMount() { 

        // console.log('TextQuestionForm componentDidMount');

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
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'textQuestionForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'textQuestionForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    componentWillReceiveProps(props: any) {
      // console.log('TextQuestionForm componentWillReceiveProps', props);
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
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveCopy BaseService.update /question/design/copy/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id}/${this.state.copyToPageOption}/${this.state.copyToQuestionOption}/${toPosition} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
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
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveMove BaseService.update /question/design/move/${direction}/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.page_no}/${this.state.question.order_no}/${this.state.moveToPageOption}/${this.state.moveToQuestionOption}/${toPosition}/${oneOnPage} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
        
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
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveOptions BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                }
                            );
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveOptions BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveOptions catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    onSaveEdit(){
        try{
            // console.log('onSaveEdit', this.state.survey);
            this.props.form.validateFields(err => {
                if (!err) {
                // console.log('check', this.state.survey);
                }
            });

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

            let passQuestionLabelFields = false;

            let fields = [] as any;
            if(this.state.survey.multi_lang) fields = ['question_label', 'question_label_EN', 'hint', 'hint_EN']
            else fields = ['question_label', 'hint']

            this.props.form.validateFields(fields, (err, values) => {
            // console.log(`onSaveEdit validateFields`, err, values);
                if (!err || isNull(err) ) {
                    passQuestionLabelFields = true;
                }
            });
            // console.log(`onSaveEdit pass value`, passQuestionLabelFields);
            
            if(passQuestionLabelFields){

            // console.log('onSaveEdit this.state.question.question_id', this.state.question.question_id);
            // console.log('onSaveEdit this.state.question.question_label', this.state.question.question_label);
            // console.log('onSaveEdit this.state.question.hint', this.state.question.comment_field_hint);

                const jwt = getJwtToken();
                BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id, 
                    this.selectUpdate( this.state.question, ['question_label', 'question_label_EN', 'question_label_html', 'question_label_EN_html', 'area_of_impact_id'], [this.state.question.question_label, this.state.question.question_label_EN, this.state.question.question_label_html, this.state.question.question_label_EN_html, strSelectedAreaOfImpactsId]), jwt).then(
                    (rp) => {
                        if (rp.Status) {
                        // console.log(rp);

                            BaseService.update(this.props.match.params.xSite, "/question/design/update/", this.state.survey.id + '/' + this.state.question.question_id + '/' + this.state.question.type_id, 
                                this.selectUpdate(
                                        this.state.question, 
                                        ['hint', 'hint_html', 'hint_EN', 'hint_EN_html'],
                                        [this.state.question.hint, this.state.question.hint_html, this.state.question.hint_EN, this.state.question.hint_EN_html]
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
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveEdit BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id}/${this.state.question.type_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                    }
                                }
                            );
                            
                            // toastr.success(rp.Messages);
                            // setInterval(function(){ window.location.reload(); }, 500);
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveEdit BaseService.update /question/design/update/${this.state.survey.id}/${this.state.question.question_id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        }
                    }
                );
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm onSaveEdit catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }
  
    handleAddAreaOfImpactChange = (selectedAreaOfImpacts: any) => {
        this.setState({ selectedAreaOfImpacts });
    };

    onChangeQuestion = (e: React.ChangeEvent<HTMLInputElement>)=> {
      // console.log(`onchange e.target.id ${e.target.id} e.target.value ${e.target.value}`);
        this.onFieldQuestionValueChange(e.target.id, e.target.value)
    }

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

    onEnabledImageChange(e: any) {
      // console.log(`onEnabledImageChange checked = ${e.target.checked}`);

        this.setState({
          question: {
            ...this.state.question,
            ['image_enabled']: e.target.checked ? 1 : 0,
          }
        }, () => {
            // console.log(`onEnabledImageChange image_enabled = ${this.state.question.image_enabled}`);
            // // console.log(`onEnabledImageChange show_comment_when_answer = ${this.state.question.show_comment_when_answer}`);
            this.setImageWhenAddChekced();
            } 
        );

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
        // console.log('TextQuestionForm renderElement');

            const jwt = getJwtToken();
            if(key === 'edit'){

                //set question label
                this.props.form.setFieldsValue({
                    question_label: this.props.question.question_label ? this.props.question.question_label : '',
                    question_label_html: this.state.question.question_label_html ? this.state.question.question_label_html : `<p>${this.state.question.question_label ? this.state.question.question_label : ''}</p>`,
                }, () => { 
                    // console.log('setFieldsValue question_label')
                });

                //set question label EN
                if(this.state.survey.multi_lang){
                    this.props.form.setFieldsValue({
                        question_label_EN: this.props.question.question_label_EN ? this.props.question.question_label_EN : this.props.question.question_label ? this.props.question.question_label : '',
                        question_label_EN_html: this.state.question.question_label_EN_html ? this.state.question.question_label_EN_html : ( this.props.question.question_label_EN ? `<p>${this.props.question.question_label_EN}</p>` : this.state.question.question_label ? `<p>${this.state.question.question_label}</p>` : '<p></p>' ),
                    }, () => { 
                        // console.log('setFieldsValue question_label_EN')
                    });
                }

                this.props.form.setFieldsValue({
                    hint: this.props.question.hint ? this.props.question.hint : '',
                    hint_html: this.state.question.hint_html ? this.state.question.hint_html : `<p>${this.state.question.hint ? this.state.question.hint : ''}</p>`,
                }, () => { /*console.log('setFieldsValue hint')*/ });

                //set question label EN
                if(this.state.survey.multi_lang){
                    this.props.form.setFieldsValue({
                        hint_EN: this.props.question.hint_EN ? this.props.question.hint_EN : this.props.question.hint ? this.props.question.hint : '',
                        hint_EN_html: this.state.question.hint_EN_html ? this.state.question.hint_EN_html : ( this.props.question.hint_EN ? `<p>${this.props.question.hint_EN}</p>` : this.state.question.hint ? `<p>${this.state.question.hint}</p>` : '<p></p>' ),
                    }, () => { /*console.log('setFieldsValue hint_EN')*/ });
                }

                //check required
                if(this.state.question.show_comment_field){

                    //set comment_field label
                    this.props.form.setFieldsValue({
                        comment_field_label: this.state.question.comment_field_label ? this.state.question.comment_field_label : '',
                    }, () => { /*console.log('setFieldsValue comment_field_label')*/ });

                    this.props.form.setFieldsValue({
                        comment_field_hint: this.state.question.comment_field_hint ? this.state.question.comment_field_hint : '',
                    }, () => { /*console.log('setFieldsValue comment_field_hint')*/ });

                    if(this.state.survey.multi_lang){
                        this.props.form.setFieldsValue({
                            comment_field_label_EN: this.state.question.comment_field_label_EN ? this.state.question.comment_field_label_EN : '',
                        }, () => { /*console.log('setFieldsValue comment_field_label_EN')*/ });

                        this.props.form.setFieldsValue({
                            comment_field_hint_EN: this.state.question.comment_field_hint_EN ? this.state.question.comment_field_hint_EN : '',
                        }, () => { /*console.log('setFieldsValue comment_field_hint_EN')*/ });
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
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm renderElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getPageOptionRow = (pageNo: any) => {
        if(pageNo === 0) return (<option key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-option-page-'+pageNo} value={pageNo} className="user-generated">-- Choose Page --</option>);
        else return (<option key={'question-'+this.state.question.order_no+'-'+this.state.actionKey+'-option-page-'+pageNo} value={pageNo} className="user-generated">{pageNo}. </option>);
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
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return <option key={this.state.actionKey+'-option-'+no}></option>;
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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

    setImageWhenAddChekced = () => {
      // console.log(`setImageWhenAddChekced this.state.question.image_enabled`, this.state.question.image_enabled);
        if(this.state.question.image_enabled){
            for(let i = 0; i < this.state.imageType.length; i++){
                // set star choice and weight
                let imageLabelFieldName = 'image_name['+i+']';
                let imageSourceFieldName = 'image_src['+i+']';
                this.props.form.setFieldsValue({
                    [imageLabelFieldName]: this.state.imageLabel[i],
                }, () => console.log('setFieldsValue', imageLabelFieldName));

                this.props.form.setFieldsValue({
                    [imageSourceFieldName]: this.state.imageSource[i],
                }, () => console.log('setFieldsValue', imageSourceFieldName));
            }
        }
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
        const nextKeys = imageKeys.concat( id++ );
        // this.setState({ imageId: this.state.imageId+1 });
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            imageKeys: nextKeys,
        });
    }

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
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `textQuestionForm customRequest catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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

        const { selectedAreaOfImpacts } = this.state;

        // const areaOfImpactsOptions = this.state.allAreaOfImpactName.map((k: any, index: any) => { return k });
        const areaOfImpactsOptions = this.state.allAreaOfImpactName.map((k: any, index: any) => { return k.split('~')[0] });
        const filteredAreaOfImpactsOptions = areaOfImpactsOptions.filter((o: any, index: any) => !selectedAreaOfImpacts.includes(o));

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

        // console.log(`textQuestionForm render() return(...)`);
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

                        <div className="questionSetting starTable comment-box-setting-container" style={{ paddingTop: '0' }}>

                            <div className="clearfix" style={{ padding: '25px', paddingTop: '0' }}>

                                
                                <div style={{ marginTop: '35px' }}>
                                    <label className="sm-label sm-label--stretch"><b>Hint</b></label>
                                    <Form.Item {...formItemLayout} >
                                        <RichTextEditor
                                            xSite={this.props.match.params.xSite}
                                            id={`hint`}
                                            theme={'snow'}
                                            fontColor={this.state.fontColor}
                                            defaultValue={this.state.question.hint_html ? this.state.question.hint_html : `<p>${this.state.question.hint ? this.state.question.hint : ''}</p>`} 
                                            disableAlign={true}
                                            onChange={this.onQuestionRichChange}
                                            placeholder={'Please enter comment field label...'}
                                        />
                                        {getFieldDecorator('hint', {
                                            rules: [
                                            {
                                                // required: true,
                                                // message: 'You must enter a hint message.',
                                            },
                                            ],
                                        })(<Input style={{display: 'none'}} /*className="wds-input wds-input--md wds-input--stretched" onChange={this.onChangeQuestion} placeholder="Please enter a hint." *//>)}
                                    </Form.Item>
                                    <Form.Item style={{display: 'none'}}> {getFieldDecorator('hint_html')(<Input/>)} </Form.Item>
                                </div>
                                

                            </div>
                        </div>
                    </TabPane>
                    {/* } */}

                    <TabPane tab="OPTIONS" key="options">

                        <div className="questionSetting required-setting-container">

                            <Checkbox onChange={this.onRequiredChange.bind(this)} checked={this.state.question.required}>Require an Answer to This Question</Checkbox>

                            { this.state.question.required ? 

                            <div className="clearfix" style={{ padding: '25px' }}>
                                
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
  
const textQuestionForm = Form.create<Props>()(TextQuestionForm);
export default textQuestionForm;
