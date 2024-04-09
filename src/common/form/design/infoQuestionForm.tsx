/* eslint-disable import/first */
import * as React from "react";
import { Form, Button, Tabs, Checkbox, Spin } from 'antd';

import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../../service/base.service';
import { getJwtToken } from '../../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../../models/surveys";
import { History } from 'history';
const { TabPane } = Tabs;

interface Props extends FormComponentProps{
    survey: Surveys;
    defaultActiveKey: any;
    handleCancel: (e: any) => void;
    handleSaveQuestion: () => void;
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
    survey: Surveys;
    actionKey: any;
    buttonSaveText: any;
}

class InfoQuestionForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        survey: this.props.survey,
        actionKey: this.props.defaultActiveKey,
        buttonSaveText: 'SAVE',
      }
    // console.log('infoQuestionForm constructor', props);
    }

    componentDidMount() { 

        // console.log('infoQuestionForm componentDidMount this.state.survey', this.state.survey);
        // console.log('infoQuestionForm componentDidMount this.state.question', this.state.question);
        // this.renderElement(this.state.actionKey);
        this.setButtonSaveText(this.state.actionKey);
    }

    componentWillReceiveProps(props: any) {
      // console.log('infoQuestionForm componentWillReceiveProps', props);
    }

    setButtonSaveText(key: any){
        //button save text
        if(key === 'edit') this.setState({ buttonSaveText: 'SAVE' });
        else if(key === 'options') this.setState({ buttonSaveText: 'SAVE' });
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
        this.onSave();
    };

    onSave(){
        const fields = [
            'client_info_form', 

            'enable_name_title', 
            'enable_first_name', 
            'enable_last_name', 
            'enable_birthdate', 
            'enable_mobile_number', 
            'enable_email', 
            'enable_line_id',
            'enable_id_card_4_digit',
            'enable_room_number',
            'enable_institution_name',
            'enable_project_name',
            'enable_company_name',
            'enable_department',
            'enable_position',
            'enable_consent_date',

            'required_name_title', 
            'required_first_name', 
            'required_last_name', 
            'required_birthdate', 
            'required_mobile_number', 
            'required_email', 
            'required_line_id',
            'required_id_card_4_digit',
            'required_room_number',
            'required_institution_name',
            'required_project_name',
            'required_company_name',
            'required_department',
            'required_position',
            'required_consent_date',
        ];

        const values = [
            this.state.survey.client_info_form, 

            this.state.survey.enable_name_title, 
            this.state.survey.enable_first_name, 
            this.state.survey.enable_last_name, 
            this.state.survey.enable_birthdate, 
            this.state.survey.enable_mobile_number, 
            this.state.survey.enable_email, 
            this.state.survey.enable_line_id,
            this.state.survey.enable_id_card_4_digit,
            this.state.survey.enable_room_number,
            this.state.survey.enable_institution_name,
            this.state.survey.enable_project_name,
            this.state.survey.enable_company_name,
            this.state.survey.enable_department,
            this.state.survey.enable_position,
            this.state.survey.enable_consent_date,

            this.state.survey.required_name_title, 
            this.state.survey.required_first_name, 
            this.state.survey.required_last_name, 
            this.state.survey.required_birthdate, 
            this.state.survey.required_mobile_number, 
            this.state.survey.required_email, 
            this.state.survey.required_line_id,
            this.state.survey.required_id_card_4_digit,
            this.state.survey.required_room_number,
            this.state.survey.required_institution_name,
            this.state.survey.required_project_name,
            this.state.survey.required_company_name,
            this.state.survey.required_department,
            this.state.survey.required_position,
            this.state.survey.required_consent_date,
        ];

        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, values), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        this.props.handleSaveQuestion();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'infoQuestionForm check BaseService.update /surveys/ else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'infoQuestionForm check BaseService.update /surveys/ catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    tabCall = (key: any) => {
      // console.log('tabCall', key);
        this.setState( { actionKey: key }, () => {
            // console.log('after tabCall', this.state.actionKey);
              this.setButtonSaveText(this.state.actionKey);
            }
        );
    }

    onCheckboxChange(e: any) {

        // console.log('onCheckboxChange target id', e.target.id);
        // console.log(`onCheckboxChange checked = ${e.target.checked}`);

        this.setState({
        survey: {
            ...this.state.survey,
            [e.target.id]: e.target.checked ? 1 : 0,
        }
        }, () => {
                // console.log(`onCheckboxChange survey`, this.state.survey);
            } 
        );
  
    }

    render() {

        // console.log('infoQuestionForm render this.state.survey', this.state.survey);
        
        return (
            <div>

                <Tabs defaultActiveKey={this.state.actionKey} onChange={this.tabCall} className="tabs question-setting-tabs">
                    
                    {/* Remove "EDIT" tab for a template question */}
                    <TabPane tab="EDIT" key="edit" className="bottom-space">
                        <div className="editorSection">
                            <div className="questionSetting starTable comment-box-setting-container">
                                <Checkbox className="info-checkbox" id='client_info_form' onChange={this.onCheckboxChange.bind(this)} checked={this.state.survey.client_info_form}> Enable Client Info Form</Checkbox>
                            </div>
                        </div>
                        
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
  
const infoQuestionForm = Form.create<Props>()(InfoQuestionForm);
export default infoQuestionForm;