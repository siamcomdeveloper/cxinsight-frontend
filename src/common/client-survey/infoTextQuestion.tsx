import React from 'react';

interface IProps {
    question: any;
    answerInfoHandler: (index: any, answer: any, requiredStatus: any) => void;
    requiredLabelStatus: any;
    answer: any;
}
interface IState {
    answer: any,
    requiredLabelState: any,
}

class InfoTextQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            answer: props.answer,
            requiredLabelState: false,
        };
        // console.log('InfoTextQuestion constructor', props);
    }

    public componentDidMount() { 
        //console.log('TextQuestion componentDidMount');
        // if(this.props.question.imageEnabled) this.renderImage();
    }

    onChangeTextHandler = (e : any) => {
        //console.log('change text currentTarget id', e.currentTarget.id);

        if(e.currentTarget.id === 'question-mobile-number-text' || e.currentTarget.id === 'question-id-card-4-digit-text'){
            // console.log('mobile-number change text currentTarget value', e.currentTarget.value);
            const NUMBER = /^[0-9]+$/;
            // console.log('e.currentTarget.value.match(NUMBER)', e.currentTarget.value.match(NUMBER));

            if(e.currentTarget.value.match(NUMBER) || e.currentTarget.value === ''){
                this.setState({ 
                    answer: e.currentTarget.value,
                    requiredLabelState: e.currentTarget.value.trim() === ''
                }, () => { 
                //console.log('change text setState value', this.state.answer); 
                    this.props.answerInfoHandler(this.props.question.index, this.state.answer, this.state.answer.trim() === '' ? true : false);
                });
            }
        }   
        else if(e.currentTarget.id === 'question-'+this.props.question.name+'-text' ){
            //console.log('change text currentTarget value', e.currentTarget.value);
            this.setState({ 
                answer: e.currentTarget.value,
                requiredLabelState: e.currentTarget.value.trim() === ''
            }, () => { 
             //console.log('change text setState value', this.state.answer); 
                this.props.answerInfoHandler(this.props.question.index, this.state.answer, this.state.answer.trim() === '' ? true : false);
            });
        }
    }

    componentWillReceiveProps(props: any) {
        // console.log('InfoTextQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }
    
    render() {
        return (
            <div className="question-essay qn question essay">
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
                    <div className="question-body clearfix notranslate ">
                        <textarea id={"question-"+this.props.question.name+"-text"} value={this.state.answer} onChange={ (e) => this.onChangeTextHandler(e) } className="textarea" rows={1} cols={this.props.question.cols} maxLength={this.props.question.maxLength} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }}></textarea>
                    </div>
                </fieldset>  
            </div>
        );
    }
};
export default InfoTextQuestion;