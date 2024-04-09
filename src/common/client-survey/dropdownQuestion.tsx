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
    comment: any,
    requiredLabelState: any,
}

class DropdownQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            comment: props.comment,
            requiredLabelState: false,
        };
        // console.log('DropdownQuestion constructor', props);
    }

    public componentDidMount() { 
     //console.log('DropdownQuestion componentDidMount');
        if(this.props.question.imageEnabled) this.renderImage(); 
        this.renderElement();
    }

    public renderImage() { 
        try{
            //console.log('DropdownQuestion renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `dropdownQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderElement() { 
        try{
            //console.log('DropdownQuestion renderElement');

            const numChoice = this.props.question.choices.length;
            //console.log('numChoice', this.props.question.choices.length);

            let nodeChoice = new Array<any>(numChoice+1);

            for(let i = -1; i < nodeChoice.length; i++) { nodeChoice[i] = ''; }

            const nodeElement = nodeChoice.map((obj, i) => this.getChoiceRow(i-1, this.props.question.choices[i-1], this.props.question.choicesHtml[i-1], parseInt(this.props.question.weights[i-1]), parseInt(this.props.answer)));

            // console.log('nodeElement', nodeElement);

            if(nodeElement.length !== 0){
                ReactDOM.render(nodeElement, document.getElementById("question-"+this.props.question.no+"-dropdown-option"));
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `dropdownQuestion renderElement catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
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

    getChoiceRow = (index: any, choice: any, choiceHtml: any, weight: any, answer: any) => {
        if(index === -1) return (<option key={index} value='' className="user-generated"></option>);
        else if(answer === weight) return (<option key={index} value={weight} className="user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }} selected>{choice}</option>);
        else return (<option key={index} value={weight} className="user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>{choice}</option>);
    }

    componentWillReceiveProps(props: any) {
     //console.log('DropdownQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    shouldComponentUpdate(nextProps:any, nextState:any){
     //console.log('DropdownQuestion shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    componentDidUpdate(prevProps:any, prevState:any){
     //console.log('DropdownQuestion componentDidUpdate', prevProps, prevState);
    }

    componentWillUnmount(){
     //console.log('DropdownQuestion componentWillUnmount');
    }

    componentWillMount(){
     //console.log('DropdownQuestion componentWillMount');
    }

    componentWillUpdate(){
     //console.log('DropdownQuestion componentWillUpdate');
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

    onMouseClickDropdownOptionHandler = (e : any) => {
        try{
            //console.log('click Dropdown Option target', e.target);
            //console.log('click Dropdown Option target id', e.target.id);
            //console.log('click Dropdown Option target value', e.target.value);

            const value = e.target.value;

            //console.log('click Dropdown value', value);

            this.setState({
                requiredLabelState: !value && this.props.question.required,
            },  () => { 
                //console.log(`value ${value}`);
                    this.props.answerHandler(this.props.question.no, value ? value : '', this.state.requiredLabelState);
                } 
            );
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `dropdownQuestion onMouseClickDropdownOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {
     //console.log('render');
        return (
            <div className="question-row clearfix">
                <div className="question-container">
                    <div id="question-field" className="question-single-choice-select qn question menu" > 
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
                                
                                <h4 id="question-title" className="question-title-container">
                                    <span className={ this.props.question.required ? "required-asterisk notranslate" : "required-asterisk notranslate hidden" } style={{ display : 'block' }}>*</span>
                                    <span className="question-number notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>{this.props.question.no}<span className="question-dot">.</span> </span>
                                    {/* <span className="user-generated notranslate">{this.props.question.label}</span> */}
                                    <span className="user-generated notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                        {parse(this.props.question.labelHtml)}
                                    </span>
                                </h4>
                            </legend>

                            <div id={"image-src-"+this.props.question.no}></div>

                            <div className="question-body question-dropdown-option notranslate">
                                <select id={"question-"+this.props.question.no+"-dropdown-option"} className="select no-touch" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }} onChange={ (e) => this.onMouseClickDropdownOptionHandler(e) }>
                                </select>
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
export default DropdownQuestion;