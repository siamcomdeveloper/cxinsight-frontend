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
    requiredLabelState: any,
}

class DropdownQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            answer: props.answer,
            requiredLabelState: false,
        };
        // console.log('infoDropdownQuestion constructor', props);
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
            // console.log('infoDropdownQuestion click Dropdown Option target', e.target);
            // console.log('infoDropdownQuestion click Dropdown Option target id', e.target.id);
            // console.log('infoDropdownQuestion click Dropdown Option target value', e.target.value);

            const value = e.target.value;

            //console.log('click Dropdown value', value);

            this.setState({
                answer: value,
                requiredLabelState: !value && this.props.question.required,
            },  () => { 
                    // console.log(`this.state.answer ${this.state.answer}`);
                    this.props.answerInfoHandler(this.props.question.index, this.state.answer, this.state.answer === '' ? true : false);
                } 
            );
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `infoDropdownQuestion onMouseClickDropdownOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
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

                    { this.props.question.lang ?

                    <div className="question-body clearfix notranslate">
                        <select id="question-name-title-dropdown-option" className="select no-touch" style={this.props.fontStyles} defaultValue={this.state.answer} onChange={ (e) => this.onMouseClickDropdownOptionHandler(e) }>
                            <option value="" className="user-generated"></option>
                            <option value="Mr." className="user-generated">Mr.</option>
                            <option value="Mrs." className="user-generated">Mrs.</option>
                            <option value="Miss" className="user-generated">Miss</option>
                        </select>
                    </div>
                    :
                    <div className="question-body clearfix notranslate">
                        <select id="question-name-title-dropdown-option" className="select no-touch" style={this.props.fontStyles} defaultValue={this.state.answer} onChange={ (e) => this.onMouseClickDropdownOptionHandler(e) }>
                            <option value="" className="user-generated"></option>
                            <option value="นาย" className="user-generated">นาย</option>
                            <option value="นาง" className="user-generated">นาง</option>
                            <option value="นางสาว" className="user-generated">นางสาว</option>
                        </select>
                    </div>
                    }
                    
                </fieldset>
            </div>
        );
    };
}
export default DropdownQuestion;