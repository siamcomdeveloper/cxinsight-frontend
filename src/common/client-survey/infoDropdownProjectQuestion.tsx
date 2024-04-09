import React from 'react';
import BaseService from '../../service/base.service';
import { History } from 'history';

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

class DropdownQuestion extends React.Component<IProps, IState> { 

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
        //console.log('DropdownQuestion componentDidMount');
        // if(this.props.question.imageEnabled) this.renderImage(); 
        // this.renderElement();
    }

    componentWillReceiveProps(props: any) {
     //console.log('infoDropdownQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    onMouseClickDropdownOptionHandler = (e : any) => {
        try{
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target', e.target);
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target id', e.target.id);
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target value', e.target.value);

            const value = e.target.value;

            // console.log('click Dropdown value', value);

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `infoDropdownQuestion onMouseClickDropdownOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
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
                        <select id="question-project-name-dropdown-option" className="select no-touch" style={this.props.fontStyles} defaultValue={this.state.answer} onChange={ (e) => this.onMouseClickDropdownOptionHandler(e) }>
                            <option value="" className="user-generated"></option>
                            <option value="other" className="user-generated">Other project</option>
                            <option value="THE ESSE ASOKE" className="user-generated">THE ESSE ASOKE</option>
                            <option value="THE ESSE AT SINGHA COMPLEX" className="user-generated">THE ESSE AT SINGHA COMPLEX</option>
                            <option value="THE ESSE SUKHUMVIT 36" className="user-generated">THE ESSE SUKHUMVIT 36</option>
                            <option value="THE EXTRO" className="user-generated">THE EXTRO</option>
                            <option value="SANTIBURI" className="user-generated">SANTIBURI</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '25px' }} className={ this.state.answer === 'other' ? "" : "hidden" }>
                        {/* <h4 className="question-title-container">
                            <span className="user-generated notranslate" style={this.props.fontStyles}>{'กรุณากรอกชื่อโครงการ'}</span>
                        </h4> */}
                        <div className="question-body clearfix notranslate ">
                            <textarea id={`question-${this.props.question.name}-text`} value={this.state.answerText} onChange={ (e) => this.onChangeTextHandler(e) } className="textarea" rows={1} cols={50} maxLength={200} style={this.props.fontStyles}></textarea>
                        </div>
                    </div>
                    
                </fieldset>
            </div>
        );
    };
}
export default DropdownQuestion;