import React from 'react';
import ReactDOM from 'react-dom';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { History } from 'history';

interface IProps {
    question: any;
    answerHandler: (questionNo: any, answer: any, requiredStatus: any) => void;
    disable: any;
    skipLogicText: any;
    requiredLabelStatus: any;
    answer: any;
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

class TextQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            answer: props.answer,
            requiredLabelState: false,
        };
     //console.log('TextQuestion constructor', props);
    }

    public componentDidMount() { 
        //console.log('TextQuestion componentDidMount');
        if(this.props.question.imageEnabled) this.renderImage();
    }

    public renderImage() { 
        try{
            //console.log('TextQuestion renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `textQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
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
    
    onChangeTextHandler = (e : any) => {
        //console.log('change text currentTarget id', e.currentTarget.id);
        if(e.currentTarget.id === 'question-'+this.props.question.no+'-text' ){
         //console.log('change text currentTarget value', e.currentTarget.value);
            this.setState({ 
                answer: e.currentTarget.value,
                requiredLabelState: false
            }, () => { 
             //console.log('change text setState value', this.state.answer); 
                this.props.answerHandler(this.props.question.no, this.state.answer, false);
            });
        }
    }

    componentWillReceiveProps(props: any) {
        //console.log('RatingQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }
    
    render() {
        return (
            <div className="question-row clearfix" >
                <div className="question-container">

                    <div id="question-field-414992062" className=" question-essay qn question essay">
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
                                <span className="question-number notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>{this.props.question.no}<span className="question-dot">. </span> </span>
                                {/* <span className="user-generated notranslate">{this.props.question.label}</span> */}
                                <span className="user-generated notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                    {parse(this.props.question.labelHtml)}
                                </span>
                            </h4>

                            <div id={"image-src-"+this.props.question.no}></div>

                            <div className="question-body clearfix notranslate ">
                            
                                <textarea id={"question-"+this.props.question.no+"-text"} value={this.state.answer} onChange={ (e) => this.onChangeTextHandler(e) } className="textarea" rows={3} cols={50} maxLength={500} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }} placeholder={this.props.question.hint}></textarea>

                            </div>
                        </fieldset>  
                    </div>

                </div>
            </div>
        );
    }
};
export default TextQuestion;