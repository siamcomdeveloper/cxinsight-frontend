import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Popconfirm } from 'antd';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { css } from 'highcharts';
import { History } from 'history';
// import reactCSS from 'reactcss';

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
    requiredLabelState: any;
    emojiShapeClass: any;
    emojiColorClass: any;
}

class RatingQuestionDesign extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            requiredLabelState: props.question.required,
            emojiShapeClass: '',
            emojiColorClass: '',
        };
        // console.log('RatingQuestionDesign constructor', props);
    }

    public componentDidMount() { 
        // console.log('RatingQuestionDesign componentDidMount', this.props.question);
        if(this.props.question.imageEnabled) this.renderImage();
        this.setEmojiClassStyle();
    }

    public renderImage() { 
        try{
            // console.log('RatingQuestionDesign renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design ratingQuestionDesign renderImage catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public setEmojiClassStyle() { 
        // console.log('RatingQuestionDesign setEmojiClassStyle');

        {/* star smiley heart thumb */}
        if(this.props.question.emojiShape === 1) this.setState({ emojiShapeClass: 'star' });
        else if(this.props.question.emojiShape === 2) this.setState({ emojiShapeClass: 'smiley' });
        else if(this.props.question.emojiShape === 3) this.setState({ emojiShapeClass: 'heart' });
        else if(this.props.question.emojiShape === 4) this.setState({ emojiShapeClass: 'thumb' });

        {/* emoji-yellow emoji-red emoji-blue emoji-green emoji-black */}
        if(this.props.question.emojiColor === 1) this.setState({ emojiColorClass: 'emoji-yellow' });
        else if(this.props.question.emojiColor === 2) this.setState({ emojiColorClass: 'emoji-red' });
        else if(this.props.question.emojiColor === 3) this.setState({ emojiColorClass: 'emoji-blue' });
        else if(this.props.question.emojiColor === 4) this.setState({ emojiColorClass: ' emoji-green' });
        else if(this.props.question.emojiColor === 5) this.setState({ emojiColorClass: ' emoji-black' });
        
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
        // console.log('RatingQuestionDesign componentWillReceiveProps', props);
        // this.setState({ requiredLabelState: props.requiredLabelStatus });
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

        // console.log('this.props.question.globalFontSize', this.props.question.globalFontSize);
        // const fontStyles = reactCSS({
        //     'default': {
        //         globalFont: {
        //             fontFamily: this.props.question.global_font_family
        //         }
        //     }
        // });
        
        return (
            <div className="question-row clearfix" >
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

                    {/* <a href="# " onClick={()=>this.props.buttonAction(this.props.question.no, 'up')} className={ this.props.first ? "wds-button wds-button--sm wds-button--util actions up disabled" : "wds-button wds-button--sm wds-button--util actions up"}><Icon type="arrow-up"/></a>
                    <a href="# " onClick={()=>this.props.buttonAction(this.props.question.no, 'down')} className={ this.props.last ? "wds-button wds-button--sm wds-button--util actions down disabled" : "wds-button wds-button--sm wds-button--util actions down"}><Icon type="arrow-down"/></a> */}

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

                    <div id="question-field-1" className=" question-emoji-rating  qn question rating" >
                        <h3 className="screenreader-only">Question Title</h3>
                        {/* <h4 className={ this.props.skipLogicStatus ? "question-validation-theme" : "question-validation-theme hidden" }><span className="user-generated notranslate" style={{fontStyle: 'italic'}}>{this.props.skipLogicText}</span></h4> */}
                        <fieldset className={ "question-fieldset question-legend" }>
                            
                            <h4 className={ this.state.requiredLabelState ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
                                <span className="question-validation-icon">!</span>
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

                            <div className="question-body question-body-emoji clearfix notranslate ">
                                
                                    <table className="question-emoji-rating-table question-matrix-table table-reset reflow" cellSpacing="0">
                                        <thead className={ this.props.question.showLabel ? '' : 'hidden' }>
                                            <tr style={{ fontSize: this.props.question.globalFontSize }}>
                                                <td style={{ width: '20.0%', fontSize: '0.8em', fontFamily: this.props.question.globalFont }} className="matrix-col-label question-body-font-theme user-generated">{parse(this.props.question.choicesHtml[0])}</td>
                                                <td style={{ width: '20.0%', fontSize: '0.8em', fontFamily: this.props.question.globalFont }} className="matrix-col-label question-body-font-theme user-generated">{parse(this.props.question.choicesHtml[1])}</td>
                                                <td style={{ width: '20.0%', fontSize: '0.8em', fontFamily: this.props.question.globalFont }} className="matrix-col-label question-body-font-theme user-generated">{parse(this.props.question.choicesHtml[2])}</td>
                                                <td style={{ width: '20.0%', fontSize: '0.8em', fontFamily: this.props.question.globalFont }} className="matrix-col-label question-body-font-theme user-generated">{parse(this.props.question.choicesHtml[3])}</td>
                                                { this.props.question.subTypeId === 1 ? null : <td style={{ width: '20.0%', fontSize: '0.8em', fontFamily: this.props.question.globalFont }} className="matrix-col-label question-body-font-theme user-generated">{parse(this.props.question.choicesHtml[4])}</td> }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="question-matrix-row-even question-matrix-row-last">
                                                <td className={ 'touch-sensitive' }>
                                                    <div>
                                                        <div id={'question-'+this.props.question.no+'-rating-star1'} className={ 'emoji-rating ' + this.state.emojiColorClass }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star1'} className={ "smf-icon emoji-color " + this.state.emojiShapeClass } aria-hidden="true"> */}
                                                            <div id={'question-'+this.props.question.no+'-star1'} className={ "smf-icon emoji-color " } aria-hidden="true">
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star1-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass}>
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                            </div>
                                                            <span id={'question-'+this.props.question.no+'-star1-text'} className="emoji-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                                <span className="smusr_radio-row-text"></span> 
                                                                {parse(this.props.question.choicesHtml[0])}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                
                                                <td className={ 'touch-sensitive' }>
                                                    <div>
                                                        <div id={'question-'+this.props.question.no+'-rating-star2'} className={ 'emoji-rating ' + this.state.emojiColorClass }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star2'} className={ "smf-icon emoji-color " + this.state.emojiShapeClass } aria-hidden="true"></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star2'} className={ "smf-icon emoji-color " } aria-hidden="true">
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star2-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass}>    
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                            </div>
                                                            <span id={'question-'+this.props.question.no+'-star2-text'} className="emoji-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                                <span className="smusr_radio-row-text"></span>
                                                                {parse(this.props.question.choicesHtml[1])}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className={ 'touch-sensitive' }>
                                                    <div>
                                                        <div id={'question-'+this.props.question.no+'-rating-star3'} className={ 'emoji-rating ' + this.state.emojiColorClass }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star3'} className={ "smf-icon emoji-color " + this.state.emojiShapeClass } aria-hidden="true"></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star3'} className={ "smf-icon emoji-color " } aria-hidden="true">
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star3-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass}>    
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                            </div>
                                                            <span id={'question-'+this.props.question.no+'-star3-text'} className="emoji-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                                <span className="smusr_radio-row-text"></span>
                                                                {parse(this.props.question.choicesHtml[2])}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                <td className={ 'touch-sensitive' }>
                                                    <div>
                                                        <div id={'question-'+this.props.question.no+'-rating-star4'} className={ 'emoji-rating ' + this.state.emojiColorClass }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star4'} className={ "smf-icon emoji-color " + this.state.emojiShapeClass } aria-hidden="true"></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star4'} className={ "smf-icon emoji-color " } aria-hidden="true">
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star4-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass}>    
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                            </div>
                                                            <span id={'question-'+this.props.question.no+'-star4-text'} className="emoji-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                                <span className="smusr_radio-row-text"></span>
                                                                {parse(this.props.question.choicesHtml[3])}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                
                                                { this.props.question.subTypeId === 1 ? null : 
                                                <td className={ 'touch-sensitive' }>
                                                    <div>
                                                        <div id={'question-'+this.props.question.no+'-rating-star5'} className={ 'emoji-rating ' + this.state.emojiColorClass }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star5'} className={ "smf-icon emoji-color " + this.state.emojiShapeClass } aria-hidden="true"></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star5'} className={ "smf-icon emoji-color " } aria-hidden="true">
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star5-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass}>    
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                            </div>
                                                            <span id={'question-'+this.props.question.no+'-star5-text'} className="emoji-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                                                <span className="smusr_radio-row-text"></span>
                                                                {parse(this.props.question.choicesHtml[4])}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                }

                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className={ this.props.question.showCommentField ? "other-answer-container" : 'other-answer-container hidden' }>
                                        <label className="question-body-font-theme answer-label other-answer-label comment-label user-generated" style={{ marginTop: '10px', marginBottom: '10px', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                            {parse(this.props.question.commentFieldLabelHtml)}
                                        </label>
                                        <textarea id={"question-"+this.props.question.no+"-comment"} className="textarea" rows={3} cols={50} maxLength={500} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }} placeholder={this.props.question.commentFieldHint} disabled></textarea>
                                    </div>

                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        );
    };
}
export default RatingQuestionDesign;