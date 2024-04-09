import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Popconfirm } from 'antd';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { History } from 'history';

interface IProps {
    question: any;
    callModal: (questionNo: any, action: any) => void;
    handleDeleteQuestion: (questionId: any, questionTypeId: any, onOnPage: any) => void;
    handleMoveQuestion: (questionId: any, direction: any, pageNo: any , orderNo: any) => void;
    oneOnPage: any;
    first: any;
    last: any;
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
    requiredLabelState: any,
}

class ChoiceQuestionDesign extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            requiredLabelState: props.question.required,
        };
        // console.log('ChoiceQuestionDesign constructor', props);
    }

    public componentDidMount() { 
        // console.log('ChoiceQuestionDesign componentDidMount');
        if(this.props.question.imageEnabled) this.renderImage();
        this.renderElement();
    }


    public renderImage() { 
        try{
            // console.log('ChoiceQuestionDesign renderImage');

            const numImage = this.props.question.imageType.length;
            // console.log('numImage', this.props.question.imageType.length);

            let imageNode = new Array<any>(numImage);

            for(let i = 0; i < imageNode.length; i++) { imageNode[i] = ''; }

            const nodeElement = imageNode.map((obj, i) => this.getImageRow(i, this.props.question.imageName[i], this.props.question.imageNameHtml[i], this.props.question.imageSrc[i], this.props.question.imageDesc[i]));

            // console.log('nodeElement', nodeElement);

            if(nodeElement.length !== 0){
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById("image-src-"+this.props.question.no));
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design choiceQuestionDesign renderImage catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
        
    }

    public renderElement() { 
        try{
            // console.log('ChoiceQuestionDesign renderElement');

            const numChoice = this.props.question.choices.length;
            // console.log('numChoice', this.props.question.choices.length);

            let leftNode = new Array<any>(Math.ceil(numChoice/2));
            let rightNode = new Array<any>(Math.floor(numChoice/2));

            for(let i = 0; i < leftNode.length; i++) { leftNode[i] = ''; }
            for(let i = 0; i < rightNode.length; i++) { rightNode[i] = ''; }

            const leftNodeElement = leftNode.map((obj, i) => this.getChoiceRow(i, this.props.question.choices[i], this.props.question.choicesHtml[i], this.props.question.weights[i]));
            const rightNodeElement = rightNode.map((obj, i) => this.getChoiceRow(leftNode.length+i, this.props.question.choices[leftNode.length+i], this.props.question.choicesHtml[leftNode.length+i], this.props.question.weights[leftNode.length+i]));

            // console.log('leftNodeElement', leftNodeElement);
            // console.log('rightNodeElement', rightNodeElement);

            if(leftNodeElement.length !== 0){
                ReactDOM.render(<div>{leftNodeElement}</div>, document.getElementById("question-"+this.props.question.no+"-answer-option-cell-list-left"));
                ReactDOM.render(<div>{rightNodeElement}</div>, document.getElementById("question-"+this.props.question.no+"-answer-option-cell-list-right"));
            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design choiceQuestionDesign renderElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
        
    }

    getChoiceRow = (index: any, choice: any, choiceHtml: any, weight: any) => {
        // console.log(`index ${index} choice ${choice} weight ${weight}`);
        return (<div key={index} className="answer-option-cell">
                    <div id={"question-"+this.props.question.no+"-multiple-option-"+index} data-value={parseInt(weight)} className="radio-button-container">
                        <input type="radio" role="radio" className="radio-button-input" value={weight}/>
                        <label className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix '}>
                            <span className="radio-button-display"></span>
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
        // console.log('ChoiceQuestionDesign componentWillReceiveProps', props);
        // this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    shouldComponentUpdate(nextProps:any, nextState:any){
        // console.log('ChoiceQuestionDesign shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    componentDidUpdate(prevProps:any, prevState:any){
        // console.log('ChoiceQuestionDesign componentDidUpdate', prevProps, prevState);
    }

    componentWillUnmount(){
        // console.log('ChoiceQuestionDesign componentWillUnmount');
    }

    componentWillMount(){
        // console.log('ChoiceQuestionDesign componentWillMount');
    }

    componentWillUpdate(){
        // console.log('ChoiceQuestionDesign componentWillUpdate');
        this.renderElement();
    }

    confirmDelete() {
        this.props.handleDeleteQuestion(this.props.question.id, this.props.question.typeId, this.props.oneOnPage)
    }

    confirmMoveUp() {
        this.props.handleMoveQuestion(this.props.question.id, 'up', this.props.question.pageNo, this.props.question.no);
    }

    confirmMoveDown() {
        this.props.handleMoveQuestion(this.props.question.id, 'down', this.props.question.pageNo, this.props.question.no);
    }
    
    cancel() {
        // console.log(e);
        // message.error('Cancel');
    }

    render() {
        // console.log('render');
        return (
            <div className="question-row clearfix">
                <div className="question-container survey-submit-actions" style={{ cursor: 'default' }}>

                    {/* Remove "EDIT" button for a template question */}
                    {/* { (parseInt(this.props.question.templateQuestionId) === 0 || this.props.question.templateQuestionId === null) &&  */}
                    <a href="# " onClick={()=>this.props.callModal(this.props.question.no, 'edit')} className="wds-button wds-button--sm wds-button--util actions edit">EDIT</a>
                    {/* } */}
                    <a href="# " onClick={()=>this.props.callModal(this.props.question.no, 'options')} className="wds-button wds-button--sm wds-button--util actions options">OPTIONS</a>
                    <a href="# " onClick={()=>this.props.callModal(this.props.question.no, 'logic')} className="wds-button wds-button--sm wds-button--util actions logic">LOGIC</a>
                    <a href="# " onClick={()=>this.props.callModal(this.props.question.no, 'move')} className="wds-button wds-button--sm wds-button--util actions move">MOVE</a>
                    <a href="# " onClick={()=>this.props.callModal(this.props.question.no, 'copy')} className="wds-button wds-button--sm wds-button--util actions copy">COPY</a>

                    <Popconfirm
                        // title={`Are you sure delete this question ${this.props.question.no}. ?`}
                        title={<div><label>Are you sure delete this question {this.props.question.no}. ?</label><br></br><label>(This action will remove all Skip "Logic")</label></div>}
                        onConfirm={this.confirmDelete.bind(this)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a href="# " className="wds-button wds-button--sm wds-button--util actions delete">DELETE</a>
                    </Popconfirm>

                    <Popconfirm
                        // title={`Are you sure move this question ${this.props.question.no}. up?`}
                        title={<div><label>Are you sure move this question {this.props.question.no}. up?</label><br></br><label>(This action will remove all Skip "Logic")</label></div>}
                        onConfirm={this.confirmMoveUp.bind(this)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a href="# " className={ this.props.first ? "wds-button wds-button--sm wds-button--util actions up disabled" : "wds-button wds-button--sm wds-button--util actions up"}><Icon type="arrow-up"/></a>
                    </Popconfirm>

                    <Popconfirm
                        // title={`Are you sure move this question ${this.props.question.no}. down?`}
                        title={<div><label>Are you sure move this question {this.props.question.no}. down?</label><br></br><label>(This action will remove all Skip "Logic")</label></div>}
                        onConfirm={this.confirmMoveDown.bind(this)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a href="# " className={ this.props.last ? "wds-button wds-button--sm wds-button--util actions down disabled" : "wds-button wds-button--sm wds-button--util actions down"}><Icon type="arrow-down"/></a>
                    </Popconfirm>

                    <div id="question-field-414992058" className=" question-single-choice-radio qn question vertical_two_col" > 
                        <h3 className="screenreader-only">Question Title</h3>
                        {/* <h4 className={ this.props.skipLogicStatus ? "question-validation-theme" : "question-validation-theme hidden" }><span className="user-generated notranslate" style={{fontStyle: 'italic'}}>{this.props.skipLogicText}</span></h4> */}
                        <fieldset className={ "question-fieldset" }>
                           
                            <legend className="question-legend">
                                <h4 className={ this.state.requiredLabelState ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
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

                            <div className={ this.props.question.showCommentField ? "other-answer-container" : 'other-answer-container hidden' }>
                                <label className="question-body-font-theme answer-label other-answer-label comment-label user-generated" style={{ marginTop: '10px', marginBottom: '10px', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                    {/* {this.props.question.commentFieldLabel} */}
                                    {parse(this.props.question.commentFieldLabelHtml)}
                                </label>
                                <textarea id={"question-"+this.props.question.no+"-comment"}  className="textarea" rows={3} cols={50} maxLength={500} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }} placeholder={this.props.question.commentFieldHint} disabled></textarea>
                            </div>
                            
                        </fieldset>

                    </div>
                </div>
            </div>
        );
    };
}
export default ChoiceQuestionDesign;