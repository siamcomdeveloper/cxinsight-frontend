import React from 'react';
import ReactDOM from 'react-dom';
import * as toastr from 'toastr';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { History } from 'history';
import Popup from 'reactjs-popup';
// import SignatureCanvas from 'react-signature-canvas';
import { Button, Upload } from 'antd';

interface IProps {
    question: any;
    answerHandler: (questionNo: any, answer: any, requiredStatus: any) => void;
    commentHandler: (questionNo: any, comment: any) => void;
    signatureHandler: (questionNo: any, signature: any) => void;
    consentHandler: (questionNo: any, consent: any) => void;
    disable: any;
    skipLogicText: any;
    showCommentFieldStatus: any;
    requiredLabelStatus: any;
    answer: any;
    comment: any;
    signature: any;
    consent: any;
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
    checkbox_option_selected: any,
    checkbox_option_disabled: any,
    comment: any,
    requiredLabelState: any,
    signedDataURL: any,
    consentPath: any;
    loadingConsentImage: boolean;
}

class CheckboxQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            checkbox_option_selected: [],
            checkbox_option_disabled: [],
            comment: props.comment,
            signedDataURL: props.signature,
            requiredLabelState: false,
            consentPath: '',
            loadingConsentImage: false,
        };
        // this.close = this.close.bind(this);
        // this.clear = this.clear.bind(this);
        // this.sign = this.sign.bind(this);
        // console.log('CheckboxQuestion constructor', props);
    }

    public componentDidMount() { 
        // console.log('CheckboxQuestion componentDidMount', this.props.question);
        this.setAnswer();
        if(this.props.question.imageEnabled) this.renderImage();
        this.renderElement();
    }

    public setAnswer(){

        try{
            //console.log('CheckboxQuestion setAnswer', this.props.answer);

            const numChoice = this.props.question.choices.length;

            let checkbox_option_selected = this.state.checkbox_option_selected;
            let checkbox_option_disabled = this.state.checkbox_option_disabled;

            for(let i = 0; i < numChoice; i++) checkbox_option_disabled.push(false);

            const answers = this.props.answer.includes(',') ? this.props.answer.split(',') : [this.props.answer];
            //console.log(`get answers = `, answers);

            for(let i = 0; i < numChoice; i++) { 

                let match = false;
                
                answers.forEach((answer: any, j: any) => {
                    
                //console.log(`answer ${j}`, answer);
                //console.log('CheckboxQuestion weight = ', this.props.question.weights[i]);

                    if(parseInt(answer) === parseInt(this.props.question.weights[i])){
                        match = true;
                        return;
                    }
                });

                if(match) checkbox_option_selected.push(true);
                else checkbox_option_selected.push(false);
            }

            const checkboxOptionSelectedLength = this.state.checkbox_option_selected.filter((selected: any) => selected === true ).length;

            if(this.props.question.limitSelection){
                if(checkboxOptionSelectedLength === parseInt(this.props.question.limitMax)){
                    // console.log('=== max');
                    let checkbox_option_disabled = this.state.checkbox_option_disabled;
                    checkbox_option_selected.map((optionSelected: any, i: number) => { checkbox_option_disabled[i] = !optionSelected });
                    this.setState({ checkbox_option_disabled: checkbox_option_disabled });
                }
                else if(checkboxOptionSelectedLength < parseInt(this.props.question.limitMax)){
                    // console.log('< max');
                    let checkbox_option_disabled = this.state.checkbox_option_disabled;
                    checkbox_option_selected.map((optionSelected: any, i: number) => { checkbox_option_disabled[i] = false });
                    this.setState({ checkbox_option_disabled: checkbox_option_disabled });
                }
            }
            
            this.setState({
                checkbox_option_selected: checkbox_option_selected,
            }, () => { 
                //console.log('CheckboxQuestion setAnswer checkbox_option_selected', this.state.checkbox_option_selected);
            });

        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `checkboxQuestion setAnswer catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderImage() { 
        try{
            //console.log('CheckboxQuestion renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `checkboxQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public renderElement() { 
        try{
            //console.log('CheckboxQuestion renderElement');

            const numChoice = this.props.question.choices.length;
            //console.log('numChoice', this.props.question.choices.length);

            let leftNode = new Array<any>(Math.ceil(numChoice/2));
            let rightNode = new Array<any>(Math.floor(numChoice/2));

            for(let i = 0; i < leftNode.length; i++) { leftNode[i] = ''; }
            for(let i = 0; i < rightNode.length; i++) { rightNode[i] = ''; }

            //console.log('checkbox_option_selected', this.state.checkbox_option_selected);

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `checkboxQuestion renderElement catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getChoiceRow = (index: any, choice: any, choiceHtml: any, weight: any) => {
        // console.log(`index ${index} choice ${choice} weight ${weight}`);
        return (<div key={index} className="answer-option-cell">
                    <div id={"question-"+this.props.question.no+"-checkbox-option-"+index} onClick={ (e) => this.onMouseClickCheckboxOptionHandler(e) } data-value={parseInt(weight)} className={`checkbox-button-container ` + ( this.state.checkbox_option_disabled[index] ? 'div-disabled' : '')}>
                        <input name="414992059" type="checkbox" className="checkbox-button-input" value={weight}/>
                        <label className={ 'answer-label checkbox-button-label no-touch touch-sensitive clearfix ' + ( this.state.checkbox_option_selected[index] ? 'checked' : '')}>{/*id="question-'+this.props.question.no+'-option1-label"*/}
                            <span className="checkbox-button-display"></span>
                            {/* <span className="checkbox-button-label-text question-body-font-theme user-generated">
                                {choice}
                            </span> */}
                            <span className="checkbox-button-label-text question-body-font-theme user-generated" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
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
     //console.log('CheckboxQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    shouldComponentUpdate(nextProps:any, nextState:any){
     //console.log('CheckboxQuestion shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    componentDidUpdate(prevProps:any, prevState:any){
     //console.log('CheckboxQuestion componentDidUpdate', prevProps, prevState);
    }

    componentWillUnmount(){
     //console.log('CheckboxQuestion componentWillUnmount');
    }

    componentWillMount(){
     //console.log('CheckboxQuestion componentWillMount');
    }

    componentWillUpdate(){
     //console.log('CheckboxQuestion componentWillUpdate');
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

    onMouseClickCheckboxOptionHandler = (e : any) => {
        try{
            //console.log('click Checkbox Option currentTarget id', e.currentTarget.id);
            //console.log('click Checkbox Option currentTarget getAttribute value', e.currentTarget.getAttribute("data-value"));
            
            const value = parseInt(e.currentTarget.getAttribute("data-value"));
            
            //console.log('click Checkbox Option value', value);

            for (let i = 0; i < this.state.checkbox_option_selected.length; i++) {
                if(e.currentTarget.id === 'question-'+this.props.question.no+'-checkbox-option-'+i ){

                    let checkbox_option_selected = this.state.checkbox_option_selected;
                    checkbox_option_selected[i] = !checkbox_option_selected[i];

                    //check selected
                    let selected = false;

                    //prepare string value separate with ','
                    const strAnswer = checkbox_option_selected.map((optionSelected: any, i: number) => {
                        if(optionSelected) { 
                        //console.log(`checkbox_option_selected.map this.props.question.weights[${i}]`, this.props.question.weights[i]);
                            selected = true; 
                            return `${this.props.question.weights[i]}`; 
                        }
                    }).join(',');

                    // console.log(`after map checkbox_option_selected`, checkbox_option_selected);
                    //console.log(`after map strAnswer`, strAnswer);
                    //console.log(`after map selected`, selected);

                    // console.log('this.state.checkbox_option_selected', this.state.checkbox_option_selected);
                    // console.log('this.state.checkbox_option_selected.filter selected', this.state.checkbox_option_selected.filter((selected: any) => selected === true ));

                    // const checkboxOptionSelectedLength = this.state.checkbox_option_selected.filter((selected: any) => selected === true ).length;
                    // console.log('checkboxOptionSelectedLength', checkboxOptionSelectedLength);

                    // console.log('this.props.question.limitSelection', this.props.question.limitSelection);
                    // console.log('this.props.question.limitMin', this.props.question.limitMin);
                    // console.log('this.props.question.limitMax', this.props.question.limitMax);

                    // let checkbox_option_disabled = this.state.checkbox_option_disabled;
                    // console.log('checkbox_option_disabled', checkbox_option_disabled);
                    let lessThanMin = false;

                    // if(checkboxOptionSelectedLength === parseInt(this.props.question.limitMax)){
                    //     console.log('=== max');
                    //     this.state.checkbox_option_disabled.map((optionSelected: any, i: number) => { checkbox_option_disabled[i] = !optionSelected });
                    //     console.log('max checkbox_option_disabled', checkbox_option_disabled);
                    // }
                    // else if(checkboxOptionSelectedLength < parseInt(this.props.question.limitMax)){
                    //     console.log('< max');
                    //     this.state.checkbox_option_disabled.map((i: number) => { checkbox_option_disabled[i] = false });
                    //     console.log('< max checkbox_option_disabled', checkbox_option_disabled);
                    // }
                    // else if(checkboxOptionSelectedLength === parseInt(this.props.question.limitMin)){
                    //     console.log('=== min');
                    // }
                    // else if(checkboxOptionSelectedLength < parseInt(this.props.question.limitMin)){
                    //     console.log('< min');
                    //     lessThanMin = true;
                    // }

                    // console.log('this.state.checkbox_option_selected', this.state.checkbox_option_selected);
                    // console.log('this.state.checkbox_option_selected.filter selected', this.state.checkbox_option_selected.filter((selected: any) => selected === true ));

                    const checkboxOptionSelectedLength = this.state.checkbox_option_selected.filter((selected: any) => selected === true ).length;
                    // console.log('checkboxOptionSelectedLength', checkboxOptionSelectedLength);

                    // console.log('this.props.question.limitSelection', this.props.question.limitSelection);
                    // console.log('this.props.question.limitMin', this.props.question.limitMin);
                    // console.log('this.props.question.limitMax', this.props.question.limitMax);
                    if(this.props.question.limitSelection){
                        if(checkboxOptionSelectedLength === parseInt(this.props.question.limitMax)){
                            // console.log('=== max');
                            let checkbox_option_disabled = this.state.checkbox_option_disabled;
                            checkbox_option_selected.map((optionSelected: any, i: number) => { checkbox_option_disabled[i] = !optionSelected });
                            this.setState({ checkbox_option_disabled: checkbox_option_disabled });
                        }
                        if(checkboxOptionSelectedLength < parseInt(this.props.question.limitMax)){
                            // console.log('< max');
                            let checkbox_option_disabled = this.state.checkbox_option_disabled;
                            checkbox_option_selected.map((optionSelected: any, i: number) => { checkbox_option_disabled[i] = false });
                            this.setState({ checkbox_option_disabled: checkbox_option_disabled });

                            if(checkboxOptionSelectedLength === parseInt(this.props.question.limitMin)){
                                // console.log('=== min');
                            }
                            else if(checkboxOptionSelectedLength < parseInt(this.props.question.limitMin)){
                                // console.log('< min');
                                lessThanMin = true;
                            }
                        }
                    }
                    let tmpRequired = (!selected && this.props.question.required) || lessThanMin;

                    this.setState({
                        checkbox_option_selected: checkbox_option_selected,
                        // Set a required label when this queestion is required and have not answer or client answers is not enough number of min limit answer
                        requiredLabelState: tmpRequired,
                    },  () => { 
                            this.props.answerHandler(this.props.question.no, (selected && !tmpRequired) ? strAnswer : '', tmpRequired);
                        } 
                    );

                    return;
                }
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `checkboxQuestion onMouseClickCheckboxOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file: any) => {
        // console.log('file', file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            // message.error('You can only upload JPG/PNG file!');
            toastr.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   message.error('Image must smaller than 2MB!');
        // }
        // return isJpgOrPng && isLt2M;
    }

    customRequestConsent = (componentsData: any) => {
        // console.log('customRequestConsent componentsData', componentsData);
        let formData = new FormData();
        formData.append('file', componentsData.file);
        formData.append('domain', 'POST');
        formData.append('filename', componentsData.file.name );

        fetch(`${process.env.REACT_APP_BASE_URL}/upload/consent`, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getJwtToken() as string}`,
                'x-site' : this.props.match.params.xSite as string
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => { 
            // console.log('data', data); 
            // console.log('data.url', data.url); 
            this.setState({
                consentPath: data.url
            }, () => { 
                this.props.consentHandler(this.props.question.no, this.state.consentPath);
            });

        })
        .then(data => componentsData.onSuccess())
        .catch(error => {
            // console.log('Error fetching image ' + error)
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `checkboxQuestion customRequestConsent fetch ${process.env.REACT_APP_BASE_URL}/upload/consent catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            componentsData.onError("Error uploading consent image")
        })      
    }

    handleConsentChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingConsentImage: true });
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (consentPath: any) =>
                this.setState({
                    consentPath: consentPath,
                    loadingConsentImage: false,
                }, () => { 
                    /*console.log('consentPath', consentPath)*/
                }),
            );
            // message.success(`${info.file.name} file uploaded successfully`);
            toastr.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            // message.error(`${info.file.name} file upload failed.`);
            toastr.error(`${info.file.name} file upload failed.`);
        }

    };

    sigCanvas = {clear:()=>{},toDataURL:(param: any)=>{return ""}};

    // close(){
    //     console.log('close');
    //     this.setState({ isOpen: false }, () => { console.log('this.state.isOpen', this.state.isOpen)});
    // }

    // clear(){
    //     this.sigCanvas.clear();
    // }
    // sign(){
    //     console.log('sign');
    //     // console.log(this.sigCanvas);
    //     //let trimmedCanvas = this.sigCanvas.getTrimmedCanvas();
    //     this.setState({ isOpen: false, signedDataURL: this.sigCanvas.toDataURL('image/png')}, () => { console.log('this.state.signedDataURL', this.state.signedDataURL); console.log('this.state.isOpen', this.state.isOpen); } );
    // }

    render() {
     //console.log('render');
        let {signedDataURL} = this.state;

        const uploadButton = (
            <div>
              {/* <Icon type={this.state.loadingConsentImage ? 'loading' : 'plus'} /> */}
              { this.state.loadingConsentImage ? 
                <div>
                  <img className="img" style={{ width: '20px' }} src={`/cxm/platform/loading.gif`} alt="Loading"/>
                  <div className="ant-upload-text">Upload here</div>
                </div>
              : 
                <div className="ant-upload-text">Upload here</div>
              }
            </div>
        );
        
        return (
            <div className="question-row clearfix">
                <div className="question-container">
                    <div id="question-field-414992058" className="question-checkbox-choice qn question vertical_two_col"> 
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
export default CheckboxQuestion;