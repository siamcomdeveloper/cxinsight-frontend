import React from 'react';
import ReactDOM from 'react-dom';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { History } from 'history';

interface IProps {
    question: any;
    answerHandler: (questionNo: any, answer: any, requiredStatus: any) => void;
    commentHandler: (questionNo: any, comment: any) => void;
    disable: any;
    skipLogicText: any;
    showCommentFieldStatus: any;
    requiredLabelStatus: any;
    answer: any;
    comment: any;
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
    multiple_option_selected: any,
    comment: any,
    requiredLabelState: any,
}

class ChoiceQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            multiple_option_selected: [],
            comment: props.comment,
            requiredLabelState: false,
        };
        // console.log('ChoiceQuestion constructor', props);
    }

    public componentDidMount() { 
     //console.log('ChoiceQuestion componentDidMount');
        this.setAnswer();
        if(this.props.question.imageEnabled) this.renderImage();
        this.renderElement();
    }

    public setAnswer(){
        try{
            //console.log('ChoiceQuestion setAnswer', this.props.answer);

            const numChoice = this.props.question.choices.length;

            let multiple_option_selected = this.state.multiple_option_selected;

            for(let i = 0; i < numChoice; i++) { 

                //console.log('ChoiceQuestion weight = ', this.props.question.weights[i]);

                if(parseInt(this.props.question.weights[i]) === parseInt(this.props.answer)){
                    multiple_option_selected.push(true);
                }
                else{
                    multiple_option_selected.push(false);
                }
            }

            this.setState({
                multiple_option_selected: multiple_option_selected,
            }, () => { 
                //console.log('ChoiceQuestion setAnswer multiple_option_selected', this.state.multiple_option_selected);
            });
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `choiceQuestion setAnswer catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderImage() { 
        try{
            //console.log('ChoiceQuestion renderImage');

            const numImage = this.props.question.imageType.length;
            //console.log('numImage', this.props.question.imageType.length);

            let imageNode = new Array<any>(numImage);

            for(let i = 0; i < imageNode.length; i++) { imageNode[i] = ''; }

            const nodeElement = imageNode.map((obj, i) => this.getImageRow(i, this.props.question.imageName[i], this.props.question.imageNameHtml[i], this.props.question.imageSrc[i], this.props.question.imageDesc[i]));

            //console.log('nodeElement', nodeElement);

            if(nodeElement.length !== 0){
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById("image-src-"+this.props.question.no));
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `choiceQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderElement() {
        try{ 
            //console.log('ChoiceQuestion renderElement');

            const numChoice = this.props.question.choices.length;
            //console.log('numChoice', this.props.question.choices.length);

            let leftNode = new Array<any>(Math.ceil(numChoice/2));
            let rightNode = new Array<any>(Math.floor(numChoice/2));

            for(let i = 0; i < leftNode.length; i++) { leftNode[i] = ''; }
            for(let i = 0; i < rightNode.length; i++) { rightNode[i] = ''; }

            //console.log('multiple_option_selected', this.state.multiple_option_selected);

            const leftNodeElement = leftNode.map((obj, i) => this.getChoiceRow(i, this.props.question.choices[i], this.props.question.choicesHtml[i], this.props.question.weights[i]));
            const rightNodeElement = rightNode.map((obj, i) => this.getChoiceRow(leftNode.length+i, this.props.question.choices[leftNode.length+i], this.props.question.choicesHtml[leftNode.length+i], this.props.question.weights[leftNode.length+i]));

            //console.log('leftNodeElement', leftNodeElement);
            //console.log('rightNodeElement', rightNodeElement);

            if(leftNodeElement.length !== 0){
                ReactDOM.render(<div>{leftNodeElement}</div>, document.getElementById("question-"+this.props.question.no+"-answer-option-cell-list-left"));
                ReactDOM.render(<div>{rightNodeElement}</div>, document.getElementById("question-"+this.props.question.no+"-answer-option-cell-list-right"));
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `renderImage renderElement catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getChoiceRow = (index: any, choice: any, choiceHtml: any, weight: any) => {
        // console.log(`index ${index} choice ${choice} weight ${weight}`);
        return (<div key={index} className="answer-option-cell">
                    <div id={"question-"+this.props.question.no+"-multiple-option-"+index} onClick={ (e) => this.onMouseClickMultipleOptionHandler(e) } data-value={parseInt(weight)} className="radio-button-container">
                        <input type="radio" role="radio" className="radio-button-input" value={weight}/>{/*id="question-'+this.props.question.no+'-option1-input"*/}
                        <label className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.multiple_option_selected[index] ? 'checked' : '')}>{/*id="question-'+this.props.question.no+'-option1-label"*/}
                            <span className="radio-button-display"></span>{/*id="question-'+this.props.question.no+'-option1-display"*/}
                            {/* <span className="radio-button-label-text question-body-font-theme user-generated ">
                                {choice}
                            </span> */}
                            <span className="radio-button-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                {parse(choiceHtml)}
                            </span>
                        </label>
                    </div>
                </div>);
    }

    getImageRow = (index: any, imageName: any, imageNameHtml: any, imageSrc: any, imageDesc: any) => {
        return (<div key={index} className="question-presentation-image qn question image">
                    <h4 className={ imageName ? "question-title-container user-generated" : "question-title-container user-generated hidden"}>
                        <span className="notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                            {parse(imageNameHtml)}
                        </span>
                    </h4>
                    <div style={{textAlign: 'center'}}>
                        <img className="user-generated" src={imageSrc} alt={imageDesc}/>
                    </div>
                </div>);
    }

    componentWillReceiveProps(props: any) {
     //console.log('ChoiceQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    shouldComponentUpdate(nextProps:any, nextState:any){
     //console.log('ChoiceQuestion shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    componentDidUpdate(prevProps:any, prevState:any){
     //console.log('ChoiceQuestion componentDidUpdate', prevProps, prevState);
    }

    componentWillUnmount(){
     //console.log('ChoiceQuestion componentWillUnmount');
    }

    componentWillMount(){
     //console.log('ChoiceQuestion componentWillMount');
    }

    componentWillUpdate(){
     //console.log('ChoiceQuestion componentWillUpdate');
        this.renderElement();
    }

    onChangeCommentHandler = (e : any) => {
     //console.log('change text currentTarget id', e.currentTarget.id);
        if(e.currentTarget.id === 'question-'+this.props.question.no+'-comment' ){
         //console.log('change text currentTarget value', e.currentTarget.value);
            this.setState({ 
                comment: e.currentTarget.value
            }, () => { 
             //console.log('change text setState value', this.state.comment); 
                this.props.commentHandler(this.props.question.no, this.state.comment);
            });
        }
    }

    onMouseClickMultipleOptionHandler = (e : any) => {
        try{
            //console.log('click Multiple Option currentTarget id', e.currentTarget.id);
            //console.log('click Multiple Option currentTarget getAttribute value', e.currentTarget.getAttribute("data-value"));

            const value = parseInt(e.currentTarget.getAttribute("data-value"));

            for (let i = 0; i < this.state.multiple_option_selected.length; i++) {
                if(e.currentTarget.id === 'question-'+this.props.question.no+'-multiple-option-'+i ){

                    let multiple_option_selected = this.state.multiple_option_selected;
                    for (let j = 0; j < multiple_option_selected.length; j++) {
                        if(j === i){
                            multiple_option_selected[j] = !multiple_option_selected[j];
                        }
                        else{
                            multiple_option_selected[j] = false;
                        }
                    }

                    //console.log(`after loop j multiple_option_selected`, multiple_option_selected);

                    this.setState({
                        multiple_option_selected: multiple_option_selected,
                        requiredLabelState: !multiple_option_selected[i] && this.props.question.required,
                    },  () => { 
                            //console.log(`this.state.multiple_option_selected[${i}]`, this.state.multiple_option_selected[i]);
                            //console.log(`value ${value}`);
                            this.props.answerHandler(this.props.question.no, this.state.multiple_option_selected[i] ? value : '', this.state.requiredLabelState);
                            //console.log(`after set multiple_option_selected`, this.state.multiple_option_selected[i]);
                            //console.log(`after set this.props.question.required`, this.props.question.required);
                            //console.log(`after set !multiple_option_selected[i] && this.props.question.required`, !multiple_option_selected[i] && this.props.question.required);
                            //console.log(`after set requiredLabelState`, this.state.requiredLabelState);
                            //console.log('after multiple_option_selected', this.state.multiple_option_selected);
                        } 
                    );

                }
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `renderImage onMouseClickMultipleOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {
     //console.log('render');
        return (
            <div className="question-row clearfix">
                <div className="question-container">
                    <div id="question-field-414992058" className=" question-single-choice-radio qn question vertical_two_col" > 
                        <h3 className="screenreader-only">Question Title</h3>
                        <h4 className={ this.props.disable ? "question-validation-theme" : "question-validation-theme hidden" }><span className="user-generated notranslate" style={{fontStyle: 'italic'}}>{this.props.skipLogicText}</span></h4>
                        <fieldset className={ this.props.disable ? "question-fieldset question-disable" : "question-fieldset" } disabled={this.props.disable}>
                           
                            <legend className="question-legend">
                                <h4 className={ this.state.requiredLabelState && !this.props.disable ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
                                    <span className="question-validation-icon">!</span>
                                    {/* <span className="user-generated">{this.props.question.requiredLabel}</span> */}
                                    <span className="user-generated required-label" style={{ display: 'inline', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                        {parse(this.props.question.requiredLabelHtml)}
                                    </span>
                                </h4>
                                <h4 id="question-title-438586089" className="question-title-container">
                                    <span className={ this.props.question.required ? "required-asterisk notranslate" : "required-asterisk notranslate hidden" } style={{ display : 'block' }}>*</span>
                                    <span className="question-number notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>{this.props.question.no}<span className="question-dot">.</span> </span>
                                    {/* <span className="user-generated notranslate">{this.props.question.label}</span> */}
                                    <span className="user-generated notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                        {parse(this.props.question.labelHtml)}
                                    </span>
                                </h4>
                            </legend>

                            <div id={"image-src-"+this.props.question.no}></div>

                            <div className="question-body clearfix notranslate">
                                <div className="answer-option-col answer-option-col-2">
                                    <div id={"question-"+this.props.question.no+"-answer-option-cell-list-left"}></div>
                                </div>   

                                <div className="answer-option-col answer-option-col-2" >
                                    <div id={"question-"+this.props.question.no+"-answer-option-cell-list-right"}></div>
                                </div> 
                            </div>

                            <div className={ (this.props.question.showCommentField || this.props.showCommentFieldStatus) ? "other-answer-container" : 'other-answer-container hidden' }>
                                <label className="question-body-font-theme answer-label other-answer-label comment-label user-generated" style={{ marginTop: '10px', marginBottom: '10px', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                    {/* {this.props.question.commentFieldLabel} */}
                                    {parse(this.props.question.commentFieldLabelHtml)}
                                </label>
                                <textarea id={"question-"+this.props.question.no+"-comment"} value={this.state.comment} onChange={ (e) => this.onChangeCommentHandler(e) } className="textarea" rows={3} cols={50} maxLength={500} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }} placeholder={this.props.question.commentFieldHint}></textarea>
                            </div>
                            
                        </fieldset>

                    </div>
                </div>
            </div>
        );
    };
}
export default ChoiceQuestion;