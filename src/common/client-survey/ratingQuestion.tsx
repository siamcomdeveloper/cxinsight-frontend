import React from 'react';
import ReactDOM from 'react-dom';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import { History } from 'history';
import { Icon } from 'antd';

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
    star1_active: any,
    star2_active: any,
    star3_active: any,
    star4_active: any,
    star5_active: any,
    star1_selected: any,
    star2_selected: any,
    star3_selected: any,
    star4_selected: any,
    star5_selected: any,
    comment: any,
    requiredLabelState: any,
    emojiShapeClass: any;
    emojiColorClass: any;
}

class RatingQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            star1_active: false,
            star2_active: false,
            star3_active: false,
            star4_active: false,
            star5_active: false,
            star1_selected: false,
            star2_selected: false,
            star3_selected: false,
            star4_selected: false,
            star5_selected: false,
            comment: props.comment,
            requiredLabelState: false,
            emojiShapeClass: '',
            emojiColorClass: '',
        };
     //console.log('RatingQuestion constructor', props);
    }

    public componentDidMount() { 
        // console.log('RatingQuestion componentDidMount', this.props.question);
        this.setAnswer();
        if(this.props.question.imageEnabled) this.renderImage();
        this.setEmojiClassStyle();
    }

    public setAnswer(){
     //console.log('RatingQuestion setAnswer', this.props.answer);
        if(this.props.answer === 1) this.setState({ star1_selected: true });
        else if(this.props.answer === 2) this.setState({ star2_selected: true });
        else if(this.props.answer === 3) this.setState({ star3_selected: true });
        else if(this.props.answer === 4) this.setState({ star4_selected: true });
        else if(this.props.answer === 5) this.setState({ star5_selected: true });
    }

    public renderImage() { 
        try{
            //console.log('RatingQuestion renderImage');

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
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `ratingQuestion renderImage catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public setEmojiClassStyle() { 
     //console.log('RatingQuestion setEmojiClassStyle');

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
     //console.log('RatingQuestion componentWillReceiveProps', props);
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

    // onMouseEnterRatingHandler = (e : any) => {
    //  //console.log('enter', e.target.id);
    //     e.stopPropagation();

    //     if(e.target.id === 'question-'+this.props.question.no+'-star1-input'){
    //         this.setState({star1_active: true});
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star2-input'){
    //         this.setState({
    //             star1_active: true,
    //             star2_active: true,
    //         });
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star3-input'){
    //         this.setState({
    //             star1_active: true,
    //             star2_active: true,
    //             star3_active: true,
    //         });
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star4-input'){
    //         this.setState({
    //             star1_active: true,
    //             star2_active: true,
    //             star3_active: true,
    //             star4_active: true,
    //         });
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star5-input'){
    //         this.setState({
    //             star1_active: true,
    //             star2_active: true,
    //             star3_active: true,
    //             star4_active: true,
    //             star5_active: true,
    //         });
    //     }

    // }

    // onMouseClickRatingHandler = (e : any) => {

    //  //console.log('onMouseClickRatingHandler click', e.target.id);
    //     e.stopPropagation();

    //     if(e.target.id === 'question-'+this.props.question.no+'-star1' || e.target.id === 'question-'+this.props.question.no+'-star1-input' || e.target.id === 'question-'+this.props.question.no+'-rating-star1' || e.target.id === 'question-'+this.props.question.no+'-star1-text'){
    //         this.setState({
    //             star1_active: !this.state.star1_selected,
    //             star2_active: false,
    //             star3_active: false,
    //             star4_active: false,
    //             star5_active: false,
    //             star1_selected: !this.state.star1_selected,
    //             star2_selected: false,
    //             star3_selected: false,
    //             star4_selected: false,
    //             star5_selected: false,
    //             requiredLabelState: this.state.star1_selected && this.props.question.required,
    //         },  () => { 
    //                 // this.consoleLogStarSelected();
    //                 this.props.answerHandler(this.props.question.no, this.state.star1_selected ? 1 : '', this.state.requiredLabelState);
    //             } 
    //         );
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star2' || e.target.id === 'question-'+this.props.question.no+'-star2-input' || e.target.id === 'question-'+this.props.question.no+'-rating-star2' || e.target.id === 'question-'+this.props.question.no+'-star2-text'){
    //         this.setState({
    //             star1_active: !this.state.star2_selected,
    //             star2_active: !this.state.star2_selected,
    //             star3_active: false,
    //             star4_active: false,
    //             star5_active: false,
    //             star1_selected: false,
    //             star2_selected: !this.state.star2_selected,
    //             star3_selected: false,
    //             star4_selected: false,
    //             star5_selected: false,
    //             requiredLabelState: this.state.star2_selected && this.props.question.required,
    //         },  () => { 
    //                 // this.consoleLogStarSelected();
    //                 this.props.answerHandler(this.props.question.no, this.state.star2_selected ? 2 : '', this.state.requiredLabelState);
    //             } 
    //         );
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star3' || e.target.id === 'question-'+this.props.question.no+'-star3-input' || e.target.id === 'question-'+this.props.question.no+'-rating-star3' || e.target.id === 'question-'+this.props.question.no+'-star3-text'){
    //         this.setState({
    //             star1_active: !this.state.star3_selected,
    //             star2_active: !this.state.star3_selected,
    //             star3_active: !this.state.star3_selected,
    //             star4_active: false,
    //             star5_active: false,
    //             star1_selected: false,
    //             star2_selected: false,
    //             star3_selected: !this.state.star3_selected,
    //             star4_selected: false,
    //             star5_selected: false,
    //             requiredLabelState: this.state.star3_selected && this.props.question.required,
    //         },  () => { 
    //                 // this.consoleLogStarSelected();
    //                 this.props.answerHandler(this.props.question.no, this.state.star3_selected ? 3 : '', this.state.requiredLabelState);
    //             } 
    //         );
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star4' || e.target.id === 'question-'+this.props.question.no+'-star4-input' || e.target.id === 'question-'+this.props.question.no+'-rating-star4' || e.target.id === 'question-'+this.props.question.no+'-star4-text'){
    //         this.setState({
    //             star1_active: !this.state.star4_selected,
    //             star2_active: !this.state.star4_selected,
    //             star3_active: !this.state.star4_selected,
    //             star4_active: !this.state.star4_selected,
    //             star5_active: false,
    //             star1_selected: false,
    //             star2_selected: false,
    //             star3_selected: false,
    //             star4_selected: !this.state.star4_selected,
    //             star5_selected: false,
    //             requiredLabelState: this.state.star4_selected && this.props.question.required,
    //         },  () => { 
    //                 // this.consoleLogStarSelected();
    //                 this.props.answerHandler(this.props.question.no, this.state.star4_selected ? 4 : '', this.state.requiredLabelState);
    //             } 
    //         );
    //     }
    //     else if(e.target.id === 'question-'+this.props.question.no+'-star5' || e.target.id === 'question-'+this.props.question.no+'-star5-input' || e.target.id === 'question-'+this.props.question.no+'-rating-star5' || e.target.id === 'question-'+this.props.question.no+'-star5-text'){
    //         this.setState({
    //             star1_active: !this.state.star5_selected,
    //             star2_active: !this.state.star5_selected,
    //             star3_active: !this.state.star5_selected,
    //             star4_active: !this.state.star5_selected,
    //             star5_active: !this.state.star5_selected,
    //             star1_selected: false,
    //             star2_selected: false,
    //             star3_selected: false,
    //             star4_selected: false,
    //             star5_selected: !this.state.star5_selected,
    //             requiredLabelState: this.state.star5_selected && this.props.question.required,
    //         },  () => { 
    //                 // this.consoleLogStarSelected();
    //                 this.props.answerHandler(this.props.question.no, this.state.star5_selected ? 5 : '', this.state.requiredLabelState);
    //             } 
    //         );
    //     }

    // }
    
    //on mobile
    onMouseEnterRatingHandler = (e : any) => {
        try{
            //console.log('enter', e.target.id);
           e.stopPropagation();
   
           if(e.target.id === 'question-'+this.props.question.no+'-star1-input'){
                this.setState({
                    star1_active: true,
                    star2_active: false,
                    star3_active: false,
                    star4_active: false,
                    star5_active: false
                });
           }
           else if(e.target.id === 'question-'+this.props.question.no+'-star2-input'){
               this.setState({
                   star1_active: false,
                   star2_active: true,
                   star3_active: false,
                   star4_active: false,
                   star5_active: false
               });
           }
           else if(e.target.id === 'question-'+this.props.question.no+'-star3-input'){
               this.setState({
                   star1_active: false,
                   star2_active: false,
                   star3_active: true,
                   star4_active: false,
                   star5_active: false
               });
           }
           else if(e.target.id === 'question-'+this.props.question.no+'-star4-input'){
               this.setState({
                   star1_active: false,
                   star2_active: false,
                   star3_active: false,
                   star4_active: true,
                   star5_active: false
               });
           }
           else if(e.target.id === 'question-'+this.props.question.no+'-star5-input'){
               this.setState({
                   star1_active: false,
                   star2_active: false,
                   star3_active: false,
                   star4_active: false,
                   star5_active: true,
               });
           }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `ratingQuestion onMouseEnterRatingHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }
   
    onMouseClickRatingHandler = (e : any) => {
        try{
            console.log('onMouseClickRatingHandler click', e);
            console.log('onMouseClickRatingHandler click', e.target);
            console.log('onMouseClickRatingHandler click', e.target.id);

            console.log('onMouseClickRatingHandler click', e.target.closest('div').id);

            // console.log('onMouseClickRatingHandler click', parent.target.parentNode);

            e.stopPropagation();

            if(e.target.closest('div').id === 'question-'+this.props.question.no+'-star1' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star1-input' || e.target.closest('div').id === 'question-'+this.props.question.no+'-rating-star1' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star1-text'){
                this.setState({
                    star1_active: !this.state.star1_selected,
                    star2_active: false,
                    star3_active: false,
                    star4_active: false,
                    star5_active: false,
                    star1_selected: !this.state.star1_selected,
                    star2_selected: false,
                    star3_selected: false,
                    star4_selected: false,
                    star5_selected: false,
                    requiredLabelState: this.state.star1_selected && this.props.question.required,
                },  () => { 
                        // this.consoleLogStarSelected();
                        this.props.answerHandler(this.props.question.no, this.state.star1_selected ? 1 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.closest('div').id === 'question-'+this.props.question.no+'-star2' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star2-input' || e.target.closest('div').id === 'question-'+this.props.question.no+'-rating-star2' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star2-text'){
                this.setState({
                    star1_active: false,
                    star2_active: !this.state.star2_selected,
                    star3_active: false,
                    star4_active: false,
                    star5_active: false,
                    star1_selected: false,
                    star2_selected: !this.state.star2_selected,
                    star3_selected: false,
                    star4_selected: false,
                    star5_selected: false,
                    requiredLabelState: this.state.star2_selected && this.props.question.required,
                },  () => { 
                        // this.consoleLogStarSelected();
                        this.props.answerHandler(this.props.question.no, this.state.star2_selected ? 2 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.closest('div').id === 'question-'+this.props.question.no+'-star3' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star3-input' || e.target.closest('div').id === 'question-'+this.props.question.no+'-rating-star3' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star3-text'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: !this.state.star3_selected,
                    star4_active: false,
                    star5_active: false,
                    star1_selected: false,
                    star2_selected: false,
                    star3_selected: !this.state.star3_selected,
                    star4_selected: false,
                    star5_selected: false,
                    requiredLabelState: this.state.star3_selected && this.props.question.required,
                },  () => { 
                        // this.consoleLogStarSelected();
                        this.props.answerHandler(this.props.question.no, this.state.star3_selected ? 3 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.closest('div').id === 'question-'+this.props.question.no+'-star4' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star4-input' || e.target.closest('div').id === 'question-'+this.props.question.no+'-rating-star4' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star4-text'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: false,
                    star4_active: !this.state.star4_selected,
                    star5_active: false,
                    star1_selected: false,
                    star2_selected: false,
                    star3_selected: false,
                    star4_selected: !this.state.star4_selected,
                    star5_selected: false,
                    requiredLabelState: this.state.star4_selected && this.props.question.required,
                },  () => { 
                        // this.consoleLogStarSelected();
                        this.props.answerHandler(this.props.question.no, this.state.star4_selected ? 4 : '', this.state.requiredLabelState);
                    } 
                );
            }
            else if(e.target.closest('div').id === 'question-'+this.props.question.no+'-star5' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star5-input' || e.target.closest('div').id === 'question-'+this.props.question.no+'-rating-star5' || e.target.closest('div').id === 'question-'+this.props.question.no+'-star5-text'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: false,
                    star4_active: false,
                    star5_active: !this.state.star5_selected,
                    star1_selected: false,
                    star2_selected: false,
                    star3_selected: false,
                    star4_selected: false,
                    star5_selected: !this.state.star5_selected,
                    requiredLabelState: this.state.star5_selected && this.props.question.required,
                },  () => { 
                        // this.consoleLogStarSelected();
                        this.props.answerHandler(this.props.question.no, this.state.star5_selected ? 5 : '', this.state.requiredLabelState);
                    } 
                );
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `ratingQuestion onMouseClickRatingHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    consoleLogStarSelected(){
     //console.log('consoleLogStarSelected');
     //console.log(`star1_active`, this.state.star1_active);
     //console.log(`star2_active`, this.state.star2_active);
     //console.log(`star3_active`, this.state.star3_active);
     //console.log(`star4_active`, this.state.star4_active);
     //console.log(`star5_active`, this.state.star5_active);
        
     //console.log(`star1_selected`, this.state.star1_selected);
     //console.log(`star2_selected`, this.state.star2_selected);
     //console.log(`star3_selected`, this.state.star3_selected);
     //console.log(`star4_selected`, this.state.star4_selected);
     //console.log(`star5_selected`, this.state.star5_selected);

     //console.log('this.props.question.required = ', this.props.question.required);
     //console.log('this.state.star1_selected && this.props.question.required = ', this.state.star1_selected && this.props.question.required);
     //console.log('this.state.star2_selected && this.props.question.required = ', this.state.star2_selected && this.props.question.required);
     //console.log('this.state.star3_selected && this.props.question.required = ', this.state.star3_selected && this.props.question.required);
     //console.log('this.state.star4_selected && this.props.question.required = ', this.state.star4_selected && this.props.question.required);
     //console.log('this.state.star5_selected && this.props.question.required = ', this.state.star5_selected && this.props.question.required);
     //console.log('this.state.requiredLabelState = ', this.state.requiredLabelState);
    }

    onMouseLeaveRatingHandler = (e : any) => {
        try{
            //console.log('leave', e.target.id);
            e.stopPropagation();

            if(e.target.id === 'question-'+this.props.question.no+'-star1-input'){
                this.setState({star1_active: false});
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-star2-input'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                });
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-star3-input'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: false,
                });
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-star4-input'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: false,
                    star4_active: false,
                });
            }
            else if(e.target.id === 'question-'+this.props.question.no+'-star5-input'){
                this.setState({
                    star1_active: false,
                    star2_active: false,
                    star3_active: false,
                    star4_active: false,
                    star5_active: false,
                });
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `ratingQuestion onMouseLeaveRatingHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {
        return (
            <div className="question-row clearfix" >
                <div className="question-containe">
                    <div id="question-field-1" className=" question-emoji-rating  qn question rating" >
                        <h3 className="screenreader-only">Question Title</h3>
                        <h4 className={ this.props.disable ? "question-validation-theme" : "question-validation-theme hidden" }><span className="user-generated notranslate" style={{fontStyle: 'italic'}}>{this.props.skipLogicText}</span></h4>
                        <fieldset className={ this.props.disable ? "question-fieldset question-legend question-disable" : "question-fieldset question-legend" } disabled={this.props.disable}>
                            
                            <h4 className={ this.state.requiredLabelState && !this.props.disable ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
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
                                        <thead>
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
                                                        <div id={'question-'+this.props.question.no+'-rating-star1'} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)} className={ 'emoji-rating ' + this.state.emojiColorClass + ( this.state.star1_active || this.state.star1_selected ? ' selected' : '') }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star1'} className={ 'smf-icon emoji-color ' + this.state.emojiShapeClass }></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star1'} className={ "smf-icon emoji-color " } aria-hidden="true" onClick={ (e) => this.onMouseClickRatingHandler(e) }>
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star1-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)}>
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
                                                        <div id={'question-'+this.props.question.no+'-rating-star2'} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)} className={ 'emoji-rating ' + this.state.emojiColorClass + ( this.state.star2_active || this.state.star2_selected ? ' selected' : '') }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star2'} className={ 'smf-icon emoji-color ' + this.state.emojiShapeClass }></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star2'} className={ "smf-icon emoji-color " } aria-hidden="true" onClick={ (e) => this.onMouseClickRatingHandler(e) }>
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star2-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)}>
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                                {/* <input id={'question-'+this.props.question.no+'-star2-input'} type="radio" className="emoji-button-input" /> */}
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
                                                        <div id={'question-'+this.props.question.no+'-rating-star3'} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)} className={ 'emoji-rating ' + this.state.emojiColorClass + ( this.state.star3_active || this.state.star3_selected ? ' selected' : '') }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star3'} className={ 'smf-icon emoji-color ' + this.state.emojiShapeClass }></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star3'} className={ "smf-icon emoji-color " } aria-hidden="true" onClick={ (e) => this.onMouseClickRatingHandler(e) }>
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star3-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)}>
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                                {/* <input id={'question-'+this.props.question.no+'-star3-input'} type="radio" className="emoji-button-input" /> */}
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
                                                        <div id={'question-'+this.props.question.no+'-rating-star4'} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)} className={ 'emoji-rating ' + this.state.emojiColorClass + ( this.state.star4_active || this.state.star4_selected ? ' selected' : '') }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star4'} className={ 'smf-icon emoji-color ' + this.state.emojiShapeClass }></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star4'} className={ "smf-icon emoji-color " } aria-hidden="true" onClick={ (e) => this.onMouseClickRatingHandler(e) }>
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star4-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)}>
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                                {/* <input id={'question-'+this.props.question.no+'-star4-input'} type="radio" className="emoji-button-input" /> */}
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
                                                        <div id={'question-'+this.props.question.no+'-rating-star5'} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)} className={ 'emoji-rating ' + this.state.emojiColorClass + ( this.state.star5_active || this.state.star5_selected ? ' selected' : '') }>
                                                            {/* <div id={'question-'+this.props.question.no+'-star5'} className={ 'smf-icon emoji-color ' + this.state.emojiShapeClass }></div> */}
                                                            <div id={'question-'+this.props.question.no+'-star5'} className={ "smf-icon emoji-color " } aria-hidden="true" onClick={ (e) => this.onMouseClickRatingHandler(e) }>
                                                                { this.state.emojiShapeClass == "star" ? <Icon type="star" theme="filled"></Icon> : this.state.emojiShapeClass == "smiley" ? <Icon type="smile" theme="filled"></Icon> : this.state.emojiShapeClass == "heart" ? <Icon type="heart" theme="filled"></Icon> : <Icon type="like" theme="filled"></Icon> }
                                                            </div>
                                                            <div id={'question-'+this.props.question.no+'-star5-input'} className={ "smf-icon emoji-border " + this.state.emojiShapeClass + ' ' + this.state.emojiColorClass} onClick={ (e) => this.onMouseClickRatingHandler(e) } onMouseEnter={ (e) => this.onMouseEnterRatingHandler(e)} onMouseLeave={ (e) => this.onMouseLeaveRatingHandler(e)}>
                                                                <span className="rating-fill" aria-hidden="true"></span>
                                                                {/* <input id={'question-'+this.props.question.no+'-star5-input'} type="radio" className="emoji-button-input" /> */}
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

                                    <div className={ (this.props.question.showCommentField || this.props.showCommentFieldStatus) ? "other-answer-container" : 'other-answer-container hidden' }>
                                        <label className="question-body-font-theme answer-label other-answer-label comment-label user-generated" style={{ marginTop: '10px', marginBottom: '10px', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                                            {parse(this.props.question.commentFieldLabelHtml)}
                                        </label>
                                        <textarea id={"question-"+this.props.question.no+"-comment"} value={this.state.comment} onChange={ (e) => this.onChangeCommentHandler(e) } className="textarea" rows={3} cols={50} maxLength={500} style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize, backgroundColor: '#f3f3f3', opacity: 1 }} placeholder={this.props.question.commentFieldHint}></textarea>
                                        {/* <input id="438586089_other" name="438586089_other" type="text" className="text other-answer-text" size={50} data-other-text=""/> */}
                                    </div>

                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        );
    };
}
export default RatingQuestion;