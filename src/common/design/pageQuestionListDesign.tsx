import React from 'react';
import ReactDOM from 'react-dom';
import Surveys from '../../models/surveys';
import { Menu, Dropdown, Icon } from 'antd';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import parse from 'html-react-parser';
import reactCSS from 'reactcss';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    pageNo: any,
    backgroundPath: any,
    backgroundColor: any,
    toPageHandler: (toPageNo: any) => void;
    pageActionHandler: (pageNo: any, action: any) => void;
    callSurveyRenameModal: () => void;
    callSurveyHeaderDescriptionModal: (pageNo: any) => void;
    callSurveyFooterDescriptionModal: (pageNo: any) => void;
    callEndOfSurveyMessageModal: () => void;
    callSurveyCompletionRedirectModal: () => void;
    callSurveySubmitButtonModal: () => void;
    callAddLogoModal: () => void;
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

// requiredLabelState: any,
interface IState {
    headerDescription: any;
    footerDescription: any;
    endOfSurveyMessage: any;
    completionRedirect: any;
}

class PageQuestionListDesign extends React.Component<IProps, IState> { 

    pageNo = () => (
        <Menu>
            {this.createMenuRow()}
        </Menu>
    );

    // Font.whitelist = [false,"AppleTH","AppleEN","Arial","ArialBlack","BookAntiqua","ComicSansMS","CourierNew","Georgia","Helvetica","Impact","Lucida","Monospace","National2","Roboto","Symbol","Tahoma","Terminal","TimesNewRoman","TrebuchetMS","Verdana","Webdings","Wingdings"];

    // fontList = () => (
    //     <Menu>
    //         <Menu.Item key={"font-AppleTH"}><a href="# " onClick={()=>this.setGlobalFont("AppleTH")}  style={{ textDecoration: 'none' }}>AppleTH</a></Menu.Item>
    //     </Menu>
    // );

    toPage = (pageNo: any) => {
        if(pageNo === this.props.pageNo) return;
        // console.log('toPage', pageNo);
        this.props.toPageHandler(pageNo);
    }

    // pageActions = () => (
    //     <Menu id="pageActions">
    //         <Menu.Item key="C">
    //             <a href="# " onClick={()=>this.Copy()}  style={{ textDecoration: 'none' }}>{/*<Icon type="edit"/>*/} Copy page</a>
    //         </Menu.Item>
    //         <Menu.Item key="M">
    //             <a  href="# " onClick={()=>this.Move()} style={{ textDecoration: 'none' }}>{/*<Icon type="edit"/>*/} Move page</a>
    //         </Menu.Item>
    //         <Menu.Item key="D">
    //             <a  href="# " onClick={()=>this.Delete()} style={{ textDecoration: 'none' }}>{/*<Icon type="delete"/>*/}  Delete page</a>
    //         </Menu.Item>
    //     </Menu>
    // );
    
    Copy = () => {
        // console.log('Copy', this.props.pageNo);
        this.props.pageActionHandler(this.props.pageNo, 1);
    }

    Move = () => {
        // console.log('Move', this.props.pageNo);
        this.props.pageActionHandler(this.props.pageNo, 2);
    }

    Delete() {
        // console.log('Delete', this.props.pageNo);
        this.props.pageActionHandler(this.props.pageNo, 3);
    }
    
    createMenuRow() {
        // console.log('createMenuRow', this.props.pageNo);
        let menuRow = [];
    
        // Outer loop to create parent
        for (let pageNo = 1; pageNo <= parseInt(this.props.survey.num_page as string); pageNo++) {

            menuRow.push(
                <Menu.Item key={"Page "+pageNo}>
                    <a href="# " onClick={()=>this.toPage(pageNo)}  style={{ textDecoration: 'none' }}>Page {pageNo}</a>
                </Menu.Item>
            );
            
        }
        return menuRow;
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            headerDescription: '',
            footerDescription: '',
            endOfSurveyMessage: '',
            completionRedirect: '',
        }
        // console.log('PageQuestionListDesign constructor', props);
    }

    public componentDidMount() { 
        try{
            // console.log('PageQuestionListDesign componentDidMount pageNo', this.props.pageNo);
            // console.log('PageQuestionListDesign componentDidMount header_description', this.props.survey.header_description);
            // console.log('PageQuestionListDesign componentDidMount footer_description', this.props.survey.footer_description);

            //Get current header description
            const headerDescription = this.props.survey.header_description ? this.props.survey.header_description.includes('~') ? this.props.survey.header_description.split('~') : [this.props.survey.header_description] : [''];
            // console.log('headerDescription', headerDescription);
            let currentHeaderDescription = this.props.pageNo > headerDescription.length ? '' : headerDescription[this.props.pageNo-1];
            // console.log('currentHeaderDescription', headerDescription);

            //Get current footer description
            const footerDescription = this.props.survey.footer_description ? this.props.survey.footer_description.includes('~') ? this.props.survey.footer_description.split('~') : [this.props.survey.footer_description] : [''];
            // console.log('footerDescription', footerDescription);
            let currentFooterDescription = this.props.pageNo > footerDescription.length ? '' : footerDescription[this.props.pageNo-1];
            // console.log('currentFooterDescription', footerDescription);

            this.setState({ 
                // headerDescription: currentHeaderDescription ? currentHeaderDescription.includes('\n') ? currentHeaderDescription.split('\n').map((item: any, i: any) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{currentHeaderDescription}</p>] : '',
                // footerDescription: currentFooterDescription ? currentFooterDescription.includes('\n') ? currentFooterDescription.split('\n').map((item: any, i: any) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{currentFooterDescription}</p>] : '',
                // endOfSurveyMessage: this.props.survey.end_of_survey_message ? this.props.survey.end_of_survey_message.includes('\n') ? this.props.survey.end_of_survey_message.split('\n').map((item: any, i: any) => { return <p key={i}>{item}</p>; }) : [<p key={0}>{this.props.survey.end_of_survey_message}</p>] : '',
                // completionRedirect: this.props.survey.completion_redirect ? this.props.survey.completion_redirect : ''
                headerDescription: currentHeaderDescription,
                footerDescription: currentFooterDescription ,
                endOfSurveyMessage: this.props.survey.end_of_survey_message ? this.props.survey.end_of_survey_message : '' ,
                completionRedirect: this.props.survey.completion_redirect ? this.props.survey.completion_redirect : ''
            });

        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `design pageQuestionListDesign componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    componentWillReceiveProps(props: any) {
        // console.log('PageQuestionListDesign componentWillReceiveProps', props);
        // this.setState({ requiredLabelState: props.requiredLabelStatus });
    }
    
    render() {

        const styles = reactCSS({
            'default': {
                previousButton: {
                    fontFamily: this.props.survey.global_font_family, fontSize: this.props.survey.global_font_size, fontWeight: 900, marginRight: '10px',
                    backgroundColor: this.props.survey.button_color_theme
                },
                nextButton: {
                    fontFamily: this.props.survey.global_font_family, fontSize: this.props.survey.global_font_size, fontWeight: 900,
                    backgroundColor: this.props.survey.button_color_theme
                },
                doneButton: {
                    fontFamily: this.props.survey.global_font_family, fontSize: this.props.survey.global_font_size, fontWeight: 900,
                    backgroundColor: this.props.survey.button_color_theme
                },
                globalFont: {
                    fontFamily: this.props.survey.global_font_family, fontSize: this.props.survey.global_font_size
                },
                globalFontSize: {
                    fontSize: this.props.survey.global_font_size
                },
                globalFontInline: {
                    display: 'inline', fontFamily: this.props.survey.global_font_family, fontSize: this.props.survey.global_font_size
                },
                surveyImage: {
                    width: this.props.survey.image_width ? ( parseInt(this.props.survey.image_width) > 0 ? parseInt(this.props.survey.image_width) : 200 ) : 200,
                    minWidth: 50,
                    maxWidth: '100%',
                    zIndex: 1
                },
                endOfMessageImage: {
                    width: this.props.survey.end_of_survey_image_width ? ( parseInt(this.props.survey.end_of_survey_image_width) > 0 ? parseInt(this.props.survey.end_of_survey_image_width) : 200 ) : 200,
                    minWidth: 50,
                    maxWidth: '100%',
                    zIndex: 1
                },
                surveyBackground: {
                    opacity: '1',
                    backgroundColor: `${this.props.backgroundColor}`,
                    backgroundImage: `url("${this.props.backgroundPath}")`,
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }
            },
        });

        // console.log('PageQuestionListDesign render', styles.surveyBackground);

        return (
            <div>
                <div id={"pageid-"+this.props.pageNo} className="page v3theme" style={{ marginBottom: 20 }}>
                    <div className="pageControls clearfix sticky-controls">
                        <div className="pageNavigation">

                            <Dropdown overlay={this.pageNo()} trigger={['click']}>
                                <a href="#" className="wds-button wds-button--sm wds-button--util-light" data-action="selectPage">
                                    <div className="pageName">
                                        Page <span data-info="pagePosition" className="notranslate">{this.props.pageNo}</span>
                                        <span data-info="pageTitle" className="notranslate"></span>
                                    </div>
                                    <span className="dropdownArrow smf-icon"><Icon type="caret-down"></Icon></span>
                                </a>
                            </Dropdown>

                        </div>
                        {/* <div className="pageActions">

                            <Dropdown overlay={this.menu()} trigger={['click']}>
                                <a href="# " className="wds-button wds-button--sm wds-button--util-light wds-button--arrow wds-button--icon-right" onClick={e => e.preventDefault()} style={{ marginRight: '5px', textDecoration: 'none' }} >
                                    Page Logic
                                </a>
                            </Dropdown>
                            
                            <Dropdown overlay={this.pageActions()} trigger={['click']}>
                                <a href="# " className="wds-button wds-button--sm wds-button--util-light wds-button--arrow wds-button--icon-right" onClick={e => e.preventDefault()} style={{ textDecoration: 'none' }} >
                                    Page Actions
                                </a>
                            </Dropdown>

                        </div> */}
                    </div>

                    <article className="survey-page survey-page-v3 survey-page-white  auto-scroll" data-layout="text-center" style={styles.surveyBackground}>
                        <div className="theme-inner-wrapper">

                            { this.props.survey.enable_src_type === 2 ?
                            <div data-question-type="presentation_image" data-rq-question-type="" className="question-container survey-submit-actions" style={{ marginTop: '0', marginBottom: '0', padding: '0'}} onClick={()=>this.props.callAddLogoModal()}>
                                <a href="# " onClick={()=>this.props.callAddLogoModal()} className="wds-button wds-button--sm wds-button--util actions delete">EDIT</a>
                                <span className="actions" style={{ paddingLeft: 5, fontSize: '18px', color: '#555', textDecoration: 'underline', zIndex: 2 }}>BANNER</span>
                                <div className="question-presentation-image qn question image" data-alt-title="Image">
                                    <img className="user-generated notranslate" style={{ zIndex: 1 }} src={this.props.survey.banner_src ? this.props.survey.banner_src : `http://localhost:3000/images/logo_template.png`} alt="logo"/>
                                </div>
                            </div>
                            :
                            <div className="addLogoHere">
                                <div data-question-type="presentation_image" data-rq-question-type="" className="question-container survey-submit-actions" style={{ marginBottom: '0'}} onClick={()=>this.props.callAddLogoModal()}>
                                    <a href="# " onClick={()=>this.props.callAddLogoModal()} className="wds-button wds-button--sm wds-button--util actions delete">EDIT</a>
                                    <span className="actions" style={{ paddingLeft: 5, fontSize: '18px', color: '#555', textDecoration: 'underline', zIndex: 2 }}>LOGO</span>
                                    <div className={ this.props.survey.logo_alignment === 1 ? 'question-presentation-image question logo-align-center' : this.props.survey.logo_alignment === 2 ? 'question-presentation-image question logo-align-right' : 'question-presentation-image question'}>
                                        <img className="user-generated notranslate" style={styles.surveyImage} src={this.props.survey.image_src ? this.props.survey.image_src : `http://localhost:3000/images/logo_template.png`} alt="logo"/>
                                    </div>
                                </div>
                            </div>
                            }

                            <section className="survey-page-body survey-page-body-v3" style={{ minHeight: '0' }}>

                                <div className="titles-container-wrapper" style={{ paddingBottom: '0' }}>

                                    <div className="survey-title-container clearfix survey-title-align-left has-survey-title survey-submit-actions" style={{ margin: '0', padding: '0'}}  onClick={()=>this.props.callSurveyRenameModal()}>
                                        <div className="survey-title-table-wrapper">
                                            <a href="# " onClick={()=>this.props.callSurveyRenameModal()} className="wds-button wds-button--sm wds-button--util actions delete" style={{top: '7px'}}>EDIT</a>
                                            <table role="presentation" className="survey-title-table table-reset">
                                                <tbody>
                                                    <tr style={{ background: 'none'}}>
                                                        <td className="survey-title-cell">
                                                            <h1 className="survey-title user-generated notranslate">
                                                                <span className="title-text" style={styles.globalFont}>
                                                                    {this.props.survey.name_html ? parse(this.props.survey.name_html) : this.props.survey.name}
                                                                </span>
                                                            </h1>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="survey-title-container clearfix survey-title-align-left has-survey-title survey-submit-actions" style={{ margin: '0', marginTop: 20, padding: '0'}} onClick={()=>this.props.callSurveyHeaderDescriptionModal(this.props.pageNo)}>
                                        <div className="survey-title-table-wrapper">
                                            <a href="# " onClick={()=>this.props.callSurveyHeaderDescriptionModal(this.props.pageNo)} className="wds-button wds-button--sm wds-button--util actions delete" style={{top: '7px'}}>EDIT</a>
                                            <span /*className="actions"*/ style={{ /*paddingLeft: 5,*/ fontSize: '18px', color: '#555', textDecoration: 'underline' }}>HEADER DESCRIPTION</span>
                                            <table className="survey-title-table table-reset">
                                                <tbody>
                                                    <tr style={{ background: 'none'}}>
                                                        <td className="survey-title-cell">
                                                            <div style={{ marginTop: '45px', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
                                                                {/* <span style={{fontSize: '20px'}}>{parse(`${this.state.headerDescription}`)}</span> */}
                                                                <span style={styles.globalFont}>
                                                                    {parse(this.state.headerDescription)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="h3 page-subtitle overlay user-generated notranslate hide" role="heading">&nbsp;</div>

                                </div>

                                <form name="surveyForm" action="" method="post" data-survey-page-form="">
                                    <div className="questions-container">
                                        <div id={ "question-items-list-" + this.props.pageNo } className="questions clearfix ui-sortable"></div>
                                    </div>
                                    
                                    <div className="survey-submit-actions center-text ui-droppable" title="Click to edit navigation buttons" onClick={()=>this.props.callSurveySubmitButtonModal()}>

                                        <a href="# " onClick={()=>this.props.callSurveySubmitButtonModal()} className="wds-button wds-button--sm wds-button--util actions delete">EDIT</a>

                                        { this.props.pageNo > 1 &&
                                        <button type="button" id={`previous-button-${this.props.pageNo}`} className={ "wds-button wds-button--sm survey-page-button prev-button notranslate"} style={ styles.previousButton }>
                                            {parse(this.props.survey.previous_text)}
                                        </button>
                                        }

                                        { this.props.pageNo < parseInt(this.props.survey.num_page as string) &&
                                        <button type="button" id={`next-button-${this.props.pageNo}`} className={ "wds-button wds-button--sm survey-page-button done-button notranslate"} style={ styles.nextButton }>
                                            {parse(this.props.survey.next_text)}
                                        </button>
                                        }

                                        { this.props.pageNo === parseInt(this.props.survey.num_page as string) &&
                                        <button type="button" id={`done-button-${this.props.pageNo}`} className={ "wds-button wds-button--sm survey-page-button next-button notranslate"} style={ styles.doneButton }>
                                            {parse(this.props.survey.done_text)}
                                        </button>
                                        }                                    
                                    </div>
                                
                                </form>

                                <div className="survey-title-container clearfix survey-title-align-left has-survey-title survey-submit-actions" style={{ margin: '0', padding: '0'}} onClick={()=>this.props.callSurveyFooterDescriptionModal(this.props.pageNo)}>
                                    <div className="survey-title-table-wrapper">
                                        <a href="# " onClick={()=>this.props.callSurveyFooterDescriptionModal(this.props.pageNo)} className="wds-button wds-button--sm wds-button--util actions delete" style={{top: '7px'}}>EDIT</a>
                                        <span /*className="actions"*/ style={{ /*paddingLeft: 5,*/ fontSize: '18px', color: '#555', textDecoration: 'underline' }}>FOOTER DESCRIPTION</span>
                                        <table className="survey-title-table table-reset">
                                            <tbody>
                                                <tr style={{ background: 'none'}}>
                                                    <td className="survey-title-cell">
                                                        <div style={{ marginTop: '45px', marginBottom: '40px', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                                            {/* <span style={{ fontSize: '16px', 'dodgerblue' }}>{this.state.footerDescription}</span> */}
                                                            <span style={styles.globalFont}>
                                                                {parse(this.state.footerDescription)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </section>

                        </div>
                    </article>

                    {/* <div className="addNewPage ui-droppable">
                        <a href="# " id="add_page" data-link="add_page" data-icon="+">NEW PAGE</a>
                    </div> */}
                </div>

                { this.props.pageNo === this.props.survey.num_page &&
                <div className="page v3theme" style={{ marginBottom: 20 }}>

                    <div className="pageControls clearfix sticky-controls" style={{ /*textAlign: 'center',*/ backgroundColor: 'lightgray' }}>
                        <label style={{ marginLeft: '10px', fontWeight: 500 , fontSize: '18px' }}>Thank you page!</label>
                    </div>
                    
                    <article className="survey-page survey-page-v3 survey-page-white  auto-scroll" data-layout="text-center" style={styles.surveyBackground}>
                        <div className="theme-inner-wrapper">

                            <section className="survey-page-body survey-page-body-v3" style={{ minHeight: '0' }}>
                                <div className="survey-title-container clearfix survey-title-align-left has-survey-title survey-submit-actions" style={{ margin: '0', padding: '0'}} onClick={()=>this.props.callEndOfSurveyMessageModal()}>
                                    <div className="survey-title-table-wrapper">
                                        <a href="# " onClick={()=>this.props.callEndOfSurveyMessageModal()} className="wds-button wds-button--sm wds-button--util actions delete" style={{top: '7px'}}>EDIT</a>
                                        <span /*className="actions"*/ style={{ /*paddingLeft: 5,*/ fontSize: '18px', color: '#555', textDecoration: 'underline' }}>END OF SURVEY MESSAGE</span>

                                        { this.props.survey.end_of_survey_enable_src_type === 1 && this.props.survey.end_of_survey_image_src ?
                                        <div data-question-type="presentation_image" data-rq-question-type="" className="question-container" style={{ marginBottom: '0'}}>
                                            {/* <span className="actions" style={{ paddingLeft: 5, fontSize: '18px', color: '#555', textDecoration: 'underline', zIndex: 2 }}>LOGO</span> */}
                                            {/* <div className="question-presentation-image qn question image" style={{ textAlign: 'center' }} data-alt-title="Image"> */}
                                            <div className={ this.props.survey.end_of_survey_logo_alignment === 1 ? 'question-presentation-image question end-of-survey-logo-image logo-align-center' : this.props.survey.end_of_survey_logo_alignment === 2 ? 'question-presentation-image question end-of-survey-logo-image logo-align-right' : 'question-presentation-image question end-of-survey-logo-image'}>
                                                <img className="user-generated notranslate" style={styles.endOfMessageImage} src={this.props.survey.end_of_survey_image_src} alt="logo"/>
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                        }

                                        { this.props.survey.end_of_survey_enable_src_type === 2 && this.props.survey.end_of_survey_banner_src ?
                                        <div data-question-type="presentation_image" data-rq-question-type="" className="question-container" style={{ marginTop: '0', marginBottom: '0', padding: '0'}}>
                                            {/* <span className="actions" style={{ paddingLeft: 5, fontSize: '18px', color: '#555', textDecoration: 'underline', zIndex: 2 }}>BANNER</span> */}
                                            <div style={{ textAlign: 'center'}} className="question-presentation-image qn question image end-of-survey-banner-image" data-alt-title="Image">
                                                <img className="user-generated notranslate" style={{ zIndex: 1 }} src={this.props.survey.end_of_survey_banner_src} alt="logo"/>
                                            </div>
                                        </div>
                                        :
                                        <div></div>
                                        }
                                        
                                        <table className="survey-title-table table-reset">
                                            <tbody>
                                                <tr style={{ background: 'none'}}>
                                                    <td className="survey-title-cell">
                                                        <div style={{ marginTop: '45px', marginBottom: '40px', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                                            {/* <span style={{ fontSize: '16px', 'dodgerblue' }}>{this.state.footerDescription}</span> */}
                                                            <span className="title-text" style={styles.globalFont}>
                                                                {parse(this.state.endOfSurveyMessage)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                            
                            <section className="survey-page-body survey-page-body-v3" style={{ minHeight: '0' }}>
                                <div className="survey-title-container clearfix survey-title-align-left has-survey-title survey-submit-actions" style={{ margin: '0', padding: '0'}} onClick={()=>this.props.callSurveyCompletionRedirectModal()}>
                                    <div className="survey-title-table-wrapper">
                                        <a href="# " onClick={()=>this.props.callSurveyCompletionRedirectModal()} className="wds-button wds-button--sm wds-button--util actions delete" style={{top: '7px'}}>EDIT</a>
                                        <span /*className="actions"*/ style={{ /*paddingLeft: 5,*/ fontSize: '18px', color: '#555', textDecoration: 'underline' }}>SURVEY COMPLETION REDIRECT URL</span>
                                        <table className="survey-title-table table-reset">
                                            <tbody>
                                                <tr style={{ background: 'none'}}>
                                                    <td className="survey-title-cell">
                                                        <div style={{ /*marginTop: '45px', marginBottom: '40px', textAlign: 'center', whiteSpace: 'pre-wrap'*/ }}>
                                                            {/* <span style={{ fontSize: '16px', 'dodgerblue' }}>{this.props.survey.completion_redirect}</span> */}
                                                            <h3><span className="title-text" style={{fontWeight: 'normal'}}>{this.state.completionRedirect}</span></h3>
                                                        </div>
                                                    </td>
                                                    
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </article>

                </div>
                }

            </div>
        );
    }
};
export default PageQuestionListDesign;