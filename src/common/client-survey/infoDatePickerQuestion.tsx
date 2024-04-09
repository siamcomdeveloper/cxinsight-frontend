import React from 'react';
import BaseService from '../../service/base.service';
import { History } from 'history';
import { DatePicker } from 'antd';
import moment from 'moment';

interface IProps {
    question: any;
    answerInfoHandler: (index: any, answer: any, requiredStatus: any) => void;
    requiredLabelStatus: any;
    answer: any;
    fontStyles: any;
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
interface IState {
    answer: any,
    answerText: any,
    requiredLabelState: any,
}

class DatePickerQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            answer: props.answer,
            answerText: '',
            requiredLabelState: false,
        };
        // console.log('infoDropdownInstitutionQuestion constructor', props);
    }

    public componentDidMount() { 
        //console.log('DatePickerQuestion componentDidMount');
        // if(this.props.question.imageEnabled) this.renderImage(); 
        // this.renderElement();
    }

    componentWillReceiveProps(props: any) {
     //console.log('infoDatePickerQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    onMouseClickDateHandler = (v : any) => {
        try{
            let value = moment(v).format('DD/MM/YYYY');
            // console.log('value', value);

            this.setState({
                answer: value,
                requiredLabelState: (value === '' || value === 'other') && this.props.question.required,
            },  () => { 
                    // console.log(`this.state.answer ${this.state.answer}`);
                    if(this.state.answer === 'other') this.props.answerInfoHandler(this.props.question.index, '', true);
                    else this.props.answerInfoHandler(this.props.question.index, this.state.answer, this.state.answer === '' ? true : false);
                } 
            );
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `infoDatePickerQuestion onMouseClickDateHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    onChangeTextHandler = (e : any) => {
        //console.log('change text currentTarget id', e.currentTarget.id);
        if(e.currentTarget.id === 'question-'+this.props.question.name+'-text' ){
            // console.log('change text currentTarget value', e.currentTarget.value);
            this.setState({ 
                answerText: e.currentTarget.value,
                requiredLabelState: e.currentTarget.value.trim() === ''
            }, () => { 
                //console.log('change text setState value', this.state.answer); 
                this.props.answerInfoHandler(this.props.question.index, this.state.answerText, this.state.answerText.trim() === '' ? true : false);
            });
        }
    }

    render() {
        //console.log('render');
        return (
            <div className="question-single-choice-select qn question menu"> 
                <fieldset className={ "question-fieldset question-legend" } style={{ marginBottom: 30 }}>
                    <h4 className={ this.state.requiredLabelState ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
                        <span className="question-validation-icon">!</span>
                        <span className="user-generated required-label" style={{ display: 'inline', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                            {this.props.question.requiredLabel}
                        </span>
                    </h4>
                    <h4 className="question-title-container">
                        <span className={ this.props.question.required ? "required-asterisk notranslate" : "required-asterisk notranslate hidden" } style={{ display : 'block' }}>*</span>
                        <span className="user-generated notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                            {this.props.question.label}
                        </span>
                    </h4>

                    <div className="question-body clearfix notranslate">
                        <DatePicker id="question-date-picker" style={this.props.fontStyles} defaultValue={moment()} format='DD/MM/YYYY' onChange={ (v) => this.onMouseClickDateHandler(v) }/>
                    </div>

                    <div style={{ marginTop: '25px' }} className={ this.state.answer === 'other' ? "" : "hidden" }>
                        <div className="question-body clearfix notranslate ">
                            <textarea id={`question-${this.props.question.name}-text`} value={this.state.answerText} onChange={ (e) => this.onChangeTextHandler(e) } className="textarea" rows={1} cols={50} maxLength={200} style={this.props.fontStyles}></textarea>
                        </div>
                    </div>
                    
                </fieldset>
            </div>
        );
    };
}
export default DatePickerQuestion;