/* eslint-disable import/first */
import React from 'react';
import ReactDOM from "react-dom";
import Surveys from '../models/surveys';
import BaseService from '../service/base.service';
import SurveyRow from './survey/surveyRow';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
// import SurveyDraftRow from './survey/surveyDraftRow';
// import SurveyClosedRow from "./survey/surveyClosedRow";
import { Input, Select, Empty, } from "antd";
import { History } from 'history';
const { Search } = Input;
const { Option } = Select;

interface IProps { 
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
    listSurveys: Array<Surveys>,
    totalSurveys: number,
    searchKey: string,
    searchStatus: string
}

class AllSurveys extends React.Component<IProps, IState> {

    public state: IState = {
        listSurveys: new Array<Surveys>(),
        totalSurveys: 0,
        searchKey: '',
        searchStatus: ''
    };
    constructor(props: IProps) {
        super(props);
        this.state = { 
            listSurveys: [],
            totalSurveys: 0,
            searchKey: '',
            searchStatus: ''
        };
    }

    public async componentDidMount() {

        const jwt = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
        
        BaseService.getAll<Surveys>(this.props.match.params.xSite, "/surveys", jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp.Data);
                        // console.log(Object.keys(rp.Data).length);
                        // this.setState({ listSurveys: rp.Data, totalSurveys: Object.keys(rp.Data).length});
                        if(!rp.Data.recordset) return;
                        
                        // console.log(rp);
                        // console.log(rp.Data);
                        // console.log(rp.Data.recordset);
                        // console.log(rp.Data.recordset.length);
                        this.setState({
                            listSurveys: rp.Data.recordset,
                            totalSurveys: rp.Data.recordset.length 
                        }, this.tabRow);
                        // this.tabRow();
                    } else {
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'allSurveys componentDidMount BaseService.getAll<Surveys> /surveys catch', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'allSurveys componentDidMount BaseService.getAll<Surveys> /surveys catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    public tabRow = () => {
        // console.log('tabRow', this.state.listSurveys);
        try{
            const nodeElement = this.state.listSurveys.map( (object, i) => {
            // return this.state.listSurveys.map(function (object, i) {
                // console.log(i, object);
                // console.log(i, object.status);
                // console.log(i, object.active);

                const nf = new Intl.NumberFormat();

                // setup formatters
                const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
                const af = new Intl.NumberFormat('en-IN', avgFormatAvg);

                object.time_spent = object.time_spent ? af.format(parseInt(object.time_spent)/60) : '0' ;
                object.total_responses = object.total_responses ? nf.format(parseInt(object.total_responses)) : '0' ;
                object.bad_responses = object.bad_responses ? nf.format(parseInt(object.bad_responses)) : '0' ;
                
                if(object.active){
                    return <SurveyRow surveys={object} key={`${i}-${this.getDateTime()}`} history={this.props.history} match={this.props.match}/>;
                }
                else{
                    return null;
                }
            });

            // console.log('nodeElement', nodeElement);
            // console.log('nodeElement.length', nodeElement.length);

            if(nodeElement.length !== 0)
                ReactDOM.render(<div>{nodeElement}</div>, document.getElementById('survey-items-list'));
            else{
                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('survey-items-list'));
            }
        }
        catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'allSurveys tabRow catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    searchSubmit(keyword: string) {
        this.setState({searchKey: keyword});
        // console.log(`search() ${keyword}`, this.state.searchStatus);
        this.doSearch(keyword, this.state.searchStatus);
    }

    handleSelectChange = (status: any) => {
        this.setState({searchStatus: status})
        // console.log(`handleSelectChange ${this.state.searchKey}`, status);
        this.doSearch(this.state.searchKey, status);
    };

    handleInputChange = (event: { target: { value: any; }; }) => {
        const keyword = event.target.value;
        this.setState({searchKey: keyword});
        // console.log(`InputChange ${keyword}`, this.state.searchStatus);
        this.doSearch(keyword, this.state.searchStatus);
    };

    doSearch(searchKey: any, searchStatus: any) {
        // console.log(`getSearch ${searchKey}`, searchStatus);
        const keyword = searchKey ? searchKey : 'null';
        const status = searchStatus ? searchStatus : 'null';
        const values = `?keyword=${keyword}&status=${status}`;
        // console.log('values', values);
        const jwt = getJwtToken();
        BaseService.getSearch(this.props.match.params.xSite, "/surveys/search", values, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp.Data);
                        // console.log(Object.keys(rp.Data).length);
                        // this.setState({ listSurveys: rp.Data, totalSurveys: Object.keys(rp.Data).length});
                        // console.log(rp.Data.recordset);
                        // console.log(rp.Data.recordset.length);
                        this.setState({ 
                            listSurveys: rp.Data.recordset, 
                            totalSurveys: rp.Data.recordset.length 
                        }, this.tabRow );
                    } else { 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'allSurveys doSearch BaseService.getSearch /surveys/search else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'allSurveys doSearch BaseService.getSearch /surveys/search catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
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
		return strDateTime;
	}
  
    render() {
        return (
            <div data-reactroot="" className="dw-container survey-list" style={{ padding: '0', position: 'relative'}} >

                <table style={{width:'100%'}}>
                    <tr style={{backgroundColor: '#eff2f5'}}>
                        <th><h2 style={{ margin: 0, fontWeight: "normal" }}>Survey</h2></th>
                        <th><h2 style={{ margin: 0, float: 'right', fontWeight: "normal", fontSize: "20px" }}>Status Filter</h2></th>
                    </tr>
                </table>
            
                <div className="dw-container search-bar" style={{ paddingRight: 0 }}>
                    <div className="dw-survey-search">
                        <div className="search-box">
                            <div className="react-autosuggest__container">
                                <Search
                                    placeholder="Search recent surveys"
                                    // onSearch={value => console.log('Search', value)}
                                    onChange={this.handleInputChange}
                                    onSearch={value => this.searchSubmit(value)}
                                />
                                
                                {/* <input type="text" value="" aria-autocomplete="list" aria-controls="react-autowhatever-1" className="react-autosuggest__input" placeholder="Search recent surveys"> */}
                                <div id="react-autowhatever-1" role="listbox" className="react-autosuggest__suggestions-container"></div>
                            </div>
                        <span className="smf-icon start-search"></span>
                        </div>
                    </div>

                    <Select defaultValue="All Surveys" onChange={this.handleSelectChange}>
                        <Option value="">All Surveys</Option>
                        <Option value="2">Open Surveys</Option>
                        <Option value="1">Draft Surveys</Option>
                        <Option value="3">Closed Surveys</Option>
                    </Select>
                    
                </div>

                <div>
                    <ul className="survey-items-list" id="survey-items-list">
                    
                        {/* {this.tabRow()} */}

                    </ul>

                    <div className="sl-footer">
                        <div className="sl-pagination">Showing {this.state.totalSurveys} of {this.state.totalSurveys} total surveys.</div>  

                        <div className="buttons-ctnr">
                            <a href={`/cxm/platform/${this.props.match.params.xSite}/create/`} className="wds-button sl-create-survey" style={{display: 'flex'}} data-action-type="goto_create_survey">CREATE</a>
                        </div>

                    </div>
                </div>

            </div>    
        );
    }
}

export default AllSurveys;
// export default ReactDOM.render(<WrappedApp />, document.getElementById("root"));
