/* eslint-disable import/first */
import * as React from "react";
import { Form, Button, Alert } from 'antd';

import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../../service/base.service';
import { getJwtToken } from '../../../helper/jwt.helper';
import * as toastr from 'toastr';
import Surveys from "../../../models/surveys";
import Question from "../../../models/questions";
import ReactDOM from "react-dom";
import { History } from 'history';

interface Props extends FormComponentProps{
    survey: Surveys;
    question: any;
    handleCancel: (e: any) => void;
    handleSaveQuestion: () => void;
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
interface IState{
    survey: Surveys;
    question: any;
    buttonSaveText: any;
    newToPageOption: any;
    newToPosOption: any;
    newToQuestionOption: any;
    allQuestionOptionElement: any;
}

class NewQuestionForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
        survey: this.props.survey,
        question: this.props.question,
        buttonSaveText: 'SAVE',

        newToPageOption: parseInt(this.props.survey.num_page as string) ? this.props.survey.num_page : 1,
        newToPosOption: 'after',
        newToQuestionOption: 1,
        allQuestionOptionElement: [],
      }
    // console.log('NewQuestionForm constructor', props);
    }

    componentDidMount() { 

      // console.log('NewQuestionForm componentDidMount');
        this.renderElement();
    }

    componentWillReceiveProps(props: any) {
      // console.log('NewQuestionForm componentWillReceiveProps', props);
    }

    selectUpdate = (obj: any, selectKeys: any, params: any) => {
        const clone = Object.assign({}, obj);

        // console.log(selectKeys);

        for (const key in obj) {
            let matched = false;

            selectKeys.forEach((selectKey: any, index: any) => {
                // console.log('index', index);
                if(selectKey === key){
                    matched = true;
                    clone[selectKey] = params[index];
                }
            });
            if(!matched) {
                delete clone[key];
                // console.log('delete!');
            }
        }

        return clone;
    }
  
    onSaveNew(){
        let toPosition = 0;
        
        // console.log('onSaveNew newToPosOption', this.state.newToPosOption ? true : false);
        let pathUrl = '';

        //check add a question on existing page
        if(this.state.newToPosOption){
            if(this.state.newToPosOption === 'after') toPosition = 1;
            else if(this.state.newToPosOption === 'before') toPosition = 0;

            pathUrl = this.state.survey.id + '/' + this.state.question.typeId + '/' + this.state.newToPageOption + '/' + this.state.newToQuestionOption + '/' + toPosition;
        }
        //check add a question to a new page
        else{
            pathUrl = this.state.survey.id + '/' + this.state.question.typeId + '/' + this.state.newToPageOption + '/' + this.state.survey.num_question;
        }

      // console.log(`onSaveNew to Page: ${this.state.newToPageOption} Question: ${this.state.newToQuestionOption} Position: ${this.state.newToPosOption} toPosition: ${toPosition} pathUrl`, pathUrl, this.state.newToPosOption ? true : false);
        const jwt = getJwtToken();
        BaseService.update(this.props.match.params.xSite, "/question/design/new/", pathUrl, '', jwt).then(
            (rp) => {
                if (rp.Status) {
                  // console.log(rp);
                    toastr.success(rp.Messages);
                    this.props.handleSaveQuestion();
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm onSaveNew BaseService.update /question/design/new/${pathUrl} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
    }

    public setLastNewQuestionOption(allQuestionOptionElementCopy: any) {
        //set the first question dropdown option to be the skip question when selected page dropdown option
        if(allQuestionOptionElementCopy.filter((item: any) => item).length > 0){
                        
            //get no of the first element which is not null in array
            let no = 0;
            allQuestionOptionElementCopy.forEach((obj: any, index: any) => { 
              // console.log(`obj = ${obj.props.value} : index = ${index}`); 
              // console.log(`obj.props.value = ${obj.props.value} : index = ${index}`);
                // if(!no && obj) {
                    no = index + 1;
                // }
            });

            this.setState({
                newToQuestionOption: no,
            },  () => { 
                  // console.log(`this.state.newToQuestionOption value = ${no}`);
                } 
            );
        }
    }

    public async renderElement() { 
      try{
        // console.log('NewQuestionForm renderElement');

          const jwt = getJwtToken();

          const numPage = parseInt(this.state.survey.num_page as string)+1;
        // console.log('numPage', numPage);

          const numQuestion = this.state.survey.num_question ? parseInt(this.state.survey.num_question as string) : 0;
        // console.log('numQuestion', numQuestion);

          let nodePageOption = new Array<any>(numPage);
          let nodeQuestionOption = new Array<any>(numQuestion);

          for(let i = 0; i < nodePageOption.length; i++) { nodePageOption[i] = ''; }
          for(let i = 0; i < nodeQuestionOption.length; i++) { nodeQuestionOption[i] = ''; }

          const nodePageOptionElement = nodePageOption.map((obj, i) => this.getPageOptionRow(i+1));
          const nodeQuestionOptionElement = nodeQuestionOption.map((obj, i) => this.getQuestionOptionRow(i+1, jwt));

          let allPageOptionElement = await Promise.all(nodePageOptionElement);
          let allQuestionOptionElement = await Promise.all(nodeQuestionOptionElement);

        // console.log('allPageOptionElement', allPageOptionElement);
        // console.log('allQuestionOptionElement', allQuestionOptionElement);

          //get pageNo for each question
          const questionPageNo = nodeQuestionOption.map((obj: any, i: number) => this.getPageNo(this.state.survey.id, i+1, jwt));//i+1 = question no. start from 1 - x (number of question)
          const allPromiseQuestionPageNo = await Promise.all(questionPageNo);
        // console.log('allPromiseQuestionPageNo', allPromiseQuestionPageNo);
      
          //find list of question index to remove and count
          let indexListToRemove = [] as any;
          let count = 0;
          let toPageOption = this.state.newToPageOption;
          allPromiseQuestionPageNo.forEach((questionPageNo: any, index: any) => {
            // console.log(`questionPageNo ${questionPageNo} : index = ${index}`);
              // console.log('currentPageNo', currentPageNo);
              //if the question is not in this current page so remove it from the dropdown
              if(questionPageNo && parseInt(questionPageNo) !== parseInt(toPageOption)){
                  // console.log('!matched');
                  indexListToRemove.push(index);
              }
              //if the question is in this current page so add it in the dropdown
              else if(questionPageNo && parseInt(questionPageNo) === parseInt(toPageOption)){
                  count++;
              }
          });
        // console.log('indexListToRemove', indexListToRemove);

          //copy all question element
          let allQuestionOptionElementCopy = [] as any;
          for (let i = 0; i < allQuestionOptionElement.length; i++) {
              allQuestionOptionElementCopy[i] = allQuestionOptionElement[i];
          }

          //remove elements
          indexListToRemove.forEach((removeIndex: any, index: any) => { 
            // console.log(`removeIndex = ${removeIndex} : index = ${index}`); 
              delete allQuestionOptionElementCopy[removeIndex];
          });

        // console.log('allQuestionOptionElementCopy removed', allQuestionOptionElementCopy);
          // allQuestionOptionElement = allQuestionOptionElementCopy;
          
          if(allPageOptionElement.length !== 0){

              //fix elements are not render correctly at the first time so have to loop twice time to render correctly
              for(let fix = 0 ; fix < 2 ; fix++){
                  //render copy tab element
                  ReactDOM.render(<div key={"question-"+this.state.question.typeId+"-new-dropdown"}>{this.newDropdownElement()}</div>, document.getElementById("question-"+this.state.question.typeId+"-new-dropdown"));

                  //render copy dropdown page option
                  ReactDOM.render(allPageOptionElement, document.getElementById("question-"+this.state.question.typeId+"-dropdown-new-page-option"));
                // console.log('render question-x-dropdown-new-page-option');

                  //render copy dropdown question option
                  if(allQuestionOptionElementCopy.filter(function (item: any) { return item !== null; }).length !== 0){

                      this.setLastNewQuestionOption(allQuestionOptionElementCopy);

                      this.setState({
                          allQuestionOptionElement: allQuestionOptionElementCopy,
                      },  () => { 
                            // console.log(`this.state.allQuestionOptionElement`, allQuestionOptionElement);
                          } 
                      );

                      //remove asNewPage section
                      ReactDOM.render(<div key={`${this.getDateTime()}`}></div>, document.getElementById("asNewPage"));

                      //add beforeAfter section
                      let parentEl = document.getElementById("beforeAfter");
                      let childEl = (<div key={`${this.getDateTime()}`}>
                                          <label>Position</label>
                                          <div className="sm-input sm-input--select sm-input--sm">
                                              <select className="newPos" onChange={ (e) => this.setNewToPosHandler(e) }>
                                                  <option value="after">After</option>
                                                  <option value="before">Before</option>
                                              </select>
                                          </div>
                                      </div>);
                      ReactDOM.render(childEl, parentEl, () => {});

                    // console.log('add theQuestion section', this.state.newToQuestionOption);
                      //add theQuestion section
                      // childEl = (<div key={`${this.getDateTime()}`}>
                      parentEl = document.getElementById("theQuestion");
                      childEl = (<div key={`theQuestion`}>
                                      <span>
                                          <label>Question</label>
                                          <div className="sm-input sm-input--select sm-input--sm">
                                              <select value={this.state.newToQuestionOption} id={"question-"+this.state.question.typeId+"-dropdown-new-question-option"} className="newTarget no-touch" onChange={ (e) => this.setNewToQuestionHandler(e) }></select>
                                          </div>
                                      </span>
                                  </div>);
                      ReactDOM.render(childEl, parentEl, () => {
                          ReactDOM.render(allQuestionOptionElementCopy, document.getElementById("question-"+this.state.question.typeId+"-dropdown-new-question-option"));
                        // console.log('render if question-x-dropdown-new-question-option');
                      });

                      this.setState({
                          newToPosOption: 'after',
                      },  () => { 
                            // console.log(`newToPosOption ${this.state.newToPosOption}`);
                          } 
                      );
                  }
                  else{
                      //remove beforeAfter section
                      ReactDOM.render(<div key={`${this.getDateTime()}`}></div>, document.getElementById("beforeAfter"));
                      //remove theQuestion section
                      ReactDOM.render(<div key={`${this.getDateTime()}`}></div>, document.getElementById("theQuestion"));
                      //add asNewPage section
                      ReactDOM.render(<div key={`${this.getDateTime()}`} style={{ marginTop: '28px', display: 'inline-block' }}><span>as a new page.</span></div>, document.getElementById("asNewPage"));

                      this.setState({
                          newToPosOption: '',
                      },  () => { 
                            // console.log(`newToPosOption ${this.state.newToPosOption}`);
                          } 
                      );

                    // console.log('render else remove theQuestion and beforeAfter');
                  }
              }
          }
        }catch(error){
          toastr.error('Something went wrong!, please refresh the page or try again later.');
          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm renderElement catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    getDateTime(){
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //As January is 0.
        let yyyy = today.getFullYear();
        let HH = today.getHours();
        let MM = today.getMinutes();
        let SS = today.getSeconds();
        let MS = today.getMilliseconds();

        let strDateTime = dd.toString() + mm.toString() + yyyy.toString() + HH.toString() + MM.toString() + SS.toString() + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }

    getPageNo = async (surveyId: any, i: any, jwt: any) => {
      // console.log ("getPageElementRenderIndex question no." + i);
        
        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`get question ${i}`, rp.Messages);
                      // console.log(`get question ${i}`, rp.Data);
                      // console.log(`get question ${i} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length){

                            const questionPageNo = rp.Data.recordset[0].page_no;
                          // console.log(`get question no. ${i} questionPageNo = `, questionPageNo);

                            return questionPageNo;

                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Data.recordset.length`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getPageNo BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getPageOptionRow = (pageNo: any) => {
        if(pageNo === 0) return (<option key={'question-'+this.state.question.typeId+'-new-option-page-'+pageNo} value={pageNo} className="user-generated">-- Choose Page --</option>);
        else return (<option key={'question-'+this.state.question.typeId+'-new-option-page-'+pageNo} value={pageNo} className="user-generated">{pageNo}. </option>);
    }

    getQuestionOptionRow = async (no: any, jwt: any) => {
      // console.log (`question no.${no}`);

        const index = no-1;  

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', this.state.survey.id + '/' + no, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                      // console.log(`get question ${no}`, rp.Messages);
                      // console.log(`get question ${no}`, rp.Data);
                      // console.log(`get question ${no} count = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length === 1){
                        return (<option key={'new-option-'+no} value={no} className="user-generated">{rp.Data.recordset[0].order_no}. {rp.Data.recordset[0].question_label}</option>);
                        }

                        return <div key={'new-option-'+no}></div>;

                    } else {
                        // this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return <div key={'new-option-'+no}></div>;
                    }
                  }catch(error){
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `newQuestionForm getQuestionOptionRow BaseService.get<Question> /question/${this.state.survey.id}/${no} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    //COPY Handler Fucntions
    setNewToPageHandler = (e : any) => {
      // console.log('click Dropdown New Page Option target', e.target);
      // console.log('click Dropdown New Page Option target id', e.target.id);
      // console.log('click Dropdown New Page Option target value', e.target.value);

        const value = e.target.value;

      // console.log('click Dropdown New Page Option value', value);

        this.setState({
            newToPageOption: value,
        },  () => { 
              // console.log(`value ${value}`);
                // this.props.answerHandler(this.props.question.no, value ? value : '', this.state.requiredLabelState);
            } 
        );
        
        this.renderElement();
    }

    setNewToQuestionHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown New Question Option value', value);

        this.setState({
            newToQuestionOption: value,
        },  () => { 
              // console.log(`value ${value}`);
            } 
        );

      // console.log('add theQuestion section', value);
        //add theQuestion section
        const parentEl = document.getElementById("theQuestion");
        const childEl = (<div key={`theQuestion`}>
                        <span>
                            <label>Question</label>
                            <div className="sm-input sm-input--select sm-input--sm">
                                <select value={value} id={"question-"+this.state.question.typeId+"-dropdown-new-question-option"} className="newTarget no-touch" onChange={ (e) => this.setNewToQuestionHandler(e) }></select>
                            </div>
                        </span>
                    </div>);
        ReactDOM.render(childEl, parentEl, () => {
            ReactDOM.render(this.state.allQuestionOptionElement, document.getElementById("question-"+this.state.question.typeId+"-dropdown-new-question-option"));
          // console.log('render if question-x-dropdown-new-question-option');
        });
    }
    
    setNewToPosHandler = (e : any) => {
        const value = e.target.value;
      // console.log('click Dropdown New Position Option value', value);
        this.setState({
            newToPosOption: value,
        },  () => { 
              // console.log(`newToPosOption ${this.state.newToPosOption}`);
            } 
        );
    }

    newDropdownElement(){
      return (
              <div className="questionSetting">
                  <fieldset className="expander expand moveSetting">
                        <Alert message={`This action will remove all Skip "Logic".`} type="info" showIcon />
                        <br/>
                        <label className="switch">
                            Add this question and put it on ...
                            {/* {/* <a className="q " data-help="help-options-new-question"><span className="notranslate">?</span></a> */}
                        </label>

                        <div className="block" style={{ marginTop: '15px'}}>

                            <div className="thePage">
                                <label>Page</label>
                                <div className="sm-input sm-input--select sm-input--sm">
                                    <select value={this.state.newToPageOption} id={"question-"+this.state.question.typeId+"-dropdown-new-page-option"} className="newPage no-touch" onChange={ (e) => this.setNewToPageHandler(e) }></select>
                                </div>
                            </div>

                            <div id="asNewPage">
                            </div>

                            <div id="beforeAfter" className="beforeAfter">
                            </div>

                            <div id="theQuestion" className="theQuestion">
                            </div>

                        </div>
                    </fieldset>
                </div>
      );
    }


    render() {
      // console.log(`newQuestionForm render() return(...)`);
        
        return (
            <div>
                <div id={"question-"+this.state.question.typeId+"-new-dropdown"}></div>

                <footer className="wds-modal__foot">
                    <div className="wds-modal__actions-right">
                    <Button type="primary" className="wds-button wds-button--ghost-filled wds-button--md" onClick={this.props.handleCancel}>
                        CANCEL
                    </Button>
                    <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.onSaveNew.bind(this)}>
                        {this.state.buttonSaveText}
                    </Button>
                    </div>
                </footer>
            </div>
        );
    }
}
  
const newQuestionForm = Form.create<Props>()(NewQuestionForm);
export default newQuestionForm;
