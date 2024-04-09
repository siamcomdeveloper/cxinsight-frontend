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
    score0_selected: any,
    score1_selected: any,
    score2_selected: any,
    score3_selected: any,
    score4_selected: any,
    score5_selected: any,
    score6_selected: any,
    score7_selected: any,
    score8_selected: any,
    score9_selected: any,
    score10_selected: any,
    comment: any,
    requiredLabelState: any,
}

class ScoreQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            score0_selected: false,
            score1_selected: false,
            score2_selected: false,
            score3_selected: false,
            score4_selected: false,
            score5_selected: false,
            score6_selected: false,
            score7_selected: false,
            score8_selected: false,
            score9_selected: false,
            score10_selected: false,
            comment: props.comment,
            requiredLabelState: false,
        };
     //console.log('RatingQuestion constructor', props);
    }

    public componentDidMount() { 
     //console.log('ScoreQuestion componentDidMount');
        this.setAnswer();
        if(this.props.question.imageEnabled) this.renderImage();
    }

    public setAnswer(){
        //console.log('RatingQuestion setAnswer', this.props.answer);
        if(this.props.answer === 0) this.setState({ score0_selected: true });
        else if(this.props.answer === 1) this.setState({ score1_selected: true });
        else if(this.props.answer === 2) this.setState({ score2_selected: true });
        else if(this.props.answer === 3) this.setState({ score3_selected: true });
        else if(this.props.answer === 4) this.setState({ score4_selected: true });
        else if(this.props.answer === 5) this.setState({ score5_selected: true });
        else if(this.props.answer === 6) this.setState({ score6_selected: true });
        else if(this.props.answer === 7) this.setState({ score7_selected: true });
        else if(this.props.answer === 8) this.setState({ score8_selected: true });
        else if(this.props.answer === 9) this.setState({ score9_selected: true });
        else if(this.props.answer === 10) this.setState({ score10_selected: true });
    }

    public renderImage() { 
        try{
            //console.log('ScoreQuestion renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `scoreQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
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

    componentWillReceiveProps(props: any) {
     //console.log('ChoiceQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
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
    
    onMouseClickNPSHandler = (e : any) => {
        try{
            //console.log('click', e.target.id);

            if(e.target.id === 'question-'+this.props.question.no+'-NPS-score0' || e.target.id === 'question-'+this.props.question.no+'-NPS-score0-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score0-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score0-span'){
                this.setState({ 
                    score0_selected: !this.state.score0_selected,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score0_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score0_selected ? 0 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score1' || e.target.id === 'question-'+this.props.question.no+'-NPS-score1-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score1-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score1-span'){
                this.setState({ 
                    score0_selected: false,
                    score1_selected: !this.state.score1_selected,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score1_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score1_selected ? 1 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score2' || e.target.id === 'question-'+this.props.question.no+'-NPS-score2-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score2-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score2-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: !this.state.score2_selected,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score2_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score2_selected ? 2 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score3' || e.target.id === 'question-'+this.props.question.no+'-NPS-score3-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score3-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score3-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: !this.state.score3_selected,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score3_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score3_selected ? 3 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score4' || e.target.id === 'question-'+this.props.question.no+'-NPS-score4-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score4-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score4-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: !this.state.score4_selected,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score4_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score4_selected ? 4 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score5' || e.target.id === 'question-'+this.props.question.no+'-NPS-score5-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score5-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score5-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: !this.state.score5_selected,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score5_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score5_selected ? 5 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score6' || e.target.id === 'question-'+this.props.question.no+'-NPS-score6-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score6-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score6-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: !this.state.score6_selected,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score6_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score6_selected ? 6 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score7' || e.target.id === 'question-'+this.props.question.no+'-NPS-score7-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score7-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score7-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: !this.state.score7_selected,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score7_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score7_selected ? 7 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score8' || e.target.id === 'question-'+this.props.question.no+'-NPS-score8-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score8-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score8-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: !this.state.score8_selected,
                    score9_selected: false,
                    score10_selected: false,
                    requiredLabelState: this.state.score8_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score8_selected ? 8 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score9' || e.target.id === 'question-'+this.props.question.no+'-NPS-score9-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score9-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score9-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: !this.state.score9_selected,
                    score10_selected: false,
                    requiredLabelState: this.state.score9_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score9_selected ? 9 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-NPS-score10' || e.target.id === 'question-'+this.props.question.no+'-NPS-score10-input' || e.target.id === 'question-'+this.props.question.no+'-NPS-score10-label' || e.target.id === 'question-'+this.props.question.no+'-NPS-score10-span'){
                this.setState({
                    score0_selected: false,
                    score1_selected: false,
                    score2_selected: false,
                    score3_selected: false,
                    score4_selected: false,
                    score5_selected: false,
                    score6_selected: false,
                    score7_selected: false,
                    score8_selected: false,
                    score9_selected: false,
                    score10_selected: !this.state.score10_selected,
                    requiredLabelState: this.state.score10_selected && this.props.question.required,
                },  () => { 
                        this.props.answerHandler(this.props.question.no, this.state.score10_selected ? 10 : '', this.state.requiredLabelState);
                    } 
                );
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `scoreQuestion onMouseClickNPSHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {
        return (
            <div className="question-row clearfix">
                <div className="question-container">
                    <div id="question-field-414992057" className=" question-matrix-nps-table qn question rating"style={{ width: '100%' }}>
                        <h3 className="screenreader-only">Question Title</h3>
                        <h4 className={ this.props.disable ? "question-validation-theme" : "question-validation-theme hidden" }><span className="user-generated notranslate" style={{fontStyle: 'italic'}}>{this.props.skipLogicText}</span></h4>
                        <fieldset className={ this.props.disable ? "question-fieldset question-legend question-disable" : "question-fieldset question-legend" } disabled={this.props.disable}>
                            
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

                            <div id={"image-src-"+this.props.question.no}></div>

                            <div className="question-body clearfix notranslate ">
                                { this.props.question.showLabel ?
                                <div className="nps-col-text-container" style={{ fontSize: this.props.question.globalFontSize }}>
                                    <div className="question-body-font-theme nps-col-text-left" style={{ fontFamily: this.props.question.globalFont }}>
                                    { parse(this.props.question.lowScoreLabelHtml) }
                                    </div>
                                    <div className="question-body-font-theme nps-col-text-right" style={{ fontFamily: this.props.question.globalFont }}>
                                    { parse(this.props.question.highScoreLabelHtml) }
                                    </div>
                                </div>
                                : null }
                                
                                <div className="nps-pop-up"><span className="nps-pop-up-text"></span></div>

                                <table className="question-matrix-nps-table table-reset" cellSpacing="0" role="presentation">
                                    <thead>
                                        <tr className="nps-col-position">
                                            <td className="question-body-font-theme">0</td>
                                            <td className="question-body-font-theme">1</td>
                                            <td className="question-body-font-theme">2</td>
                                            <td className="question-body-font-theme">3</td>
                                            <td className="question-body-font-theme">4</td>
                                            <td className="question-body-font-theme">5</td>
                                            <td className="question-body-font-theme">6</td>
                                            <td className="question-body-font-theme">7</td>
                                            <td className="question-body-font-theme">8</td>
                                            <td className="question-body-font-theme">9</td>
                                            <td className="question-body-font-theme">10</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                
                                        <tr data-nps>
                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score0"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score0-input"} name={"question-"+this.props.question.no+"-NPS-score0-input"} type="radio" role="radio" className="radio-button-input" value="0"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score0-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score0_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score0-span"} className="radio-button-display">0</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score1"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score1-input"} name={"question-"+this.props.question.no+"-NPS-score1-input"} type="radio" role="radio" className="radio-button-input" value="1"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score1-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score1_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score1-span"} className="radio-button-display">1</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score2"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score2-input"} name={"question-"+this.props.question.no+"-NPS-score2-input"} type="radio" role="radio" className="radio-button-input" value="2"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score2-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score2_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score2-span"} className="radio-button-display">2</span>
                                                    </label>
                                                </div>
                                            </td>
                                            
                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score3"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score3-input"} name={"question-"+this.props.question.no+"-NPS-score3-input"} type="radio" role="radio" className="radio-button-input" value="3"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score3-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score3_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score3-span"} className="radio-button-display">3</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score4"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score4-input"} name={"question-"+this.props.question.no+"-NPS-score4-input"} type="radio" role="radio" className="radio-button-input" value="4"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score4-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score4_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score4-span"} className="radio-button-display">4</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score5"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score5-input"} name={"question-"+this.props.question.no+"-NPS-score5-input"} type="radio" role="radio" className="radio-button-input" value="5"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score5-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score5_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score5-span"} className="radio-button-display">5</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score6"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score6-input"} name={"question-"+this.props.question.no+"-NPS-score6-input"} type="radio" role="radio" className="radio-button-input" value="6"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score6-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score6_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score6-span"} className="radio-button-display">6</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score7"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score7-input"} name={"question-"+this.props.question.no+"-NPS-score7-input"} type="radio" role="radio" className="radio-button-input" value="7"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score7-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score7_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score7-span"} className="radio-button-display">7</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score8"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score8-input"} name={"question-"+this.props.question.no+"-NPS-score8-input"} type="radio" role="radio" className="radio-button-input" value="8"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score8-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score8_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score8-span"} className="radio-button-display">8</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score9"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score9-input"} name={"question-"+this.props.question.no+"-NPS-score9-input"} type="radio" role="radio" className="radio-button-input" value="9"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score9-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score9_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score9-span"} className="radio-button-display">9</span>
                                                    </label>
                                                </div>
                                            </td>

                                            <td className="nps-radio-button-container no-touch touch-sensitive" onClick={ (e) => this.onMouseClickNPSHandler(e) }>
                                                <div id={"question-"+this.props.question.no+"-NPS-score10"} className="radio-button-container">
                                                    <input id={"question-"+this.props.question.no+"-NPS-score10-input"} name={"question-"+this.props.question.no+"-NPS-score10-input"} type="radio" role="radio" className="radio-button-input" value="10"/>
                                                    <label id={"question-"+this.props.question.no+"-NPS-score10-label"} className={ 'answer-label radio-button-label no-touch touch-sensitive clearfix ' + ( this.state.score10_selected ? 'checked' : '') } style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                        <span id={"question-"+this.props.question.no+"-NPS-score10-span"} className="radio-button-display">10</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

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
export default ScoreQuestion;