import React from 'react';
import * as toastr from 'toastr';
import Surveys from '../../models/surveys';
import Collector from '../../models/collector';
import BaseService from '../../service/base.service';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../../helper/jwt.helper';
import MenuSurvey from '../../common/menu';
// import { Select, Icon, Dropdown, Menu, Empty } from "antd";
import { Select, Icon, Empty, Spin, Tooltip } from "antd";

import '../../css/wds-react.4_16_1.min.css';
import '../../css/collectweb-collector_list-bundle-min.5e29c8fb.css';
import '../../css/smlib.globaltemplates-base_nonresponsive-bundle-min.125b4dd4.css';
import '../../css/smlib.ui-global-bundle-min.9feec1b6.css';

import CollectorRow from "../../common/collector/collectorRow";
import ReactDOM from 'react-dom';

import CollectorCreateModal from '../../common/modal/collectorCreateModal';
import HeaderSurvey from '../../common/header';
import Project from '../../models/project';

import SurveyReNicknameModal from '../../common/modal/surveyRenicknameModal';
// import { Cipher } from 'crypto';

// import '../css/wds-charts.4_16_1.min.css';
// import '../css/survey-summary.css';
// import '../css/side-bar.css';
// import '../css/survey-info-stats.css';
// import '../css/status-card-survey-status.css';
// import '../css/status-card-response-count.css';
// import '../css/collector-list.css';
const { Option, OptGroup } = Select;

// const menu = (id: any) => (
//     <Menu>
//         <Menu.Item key="edit">
//             <a href={'/cxm/platform/${this.props.match.params.xSite}/edit/' + id} style={{ textDecoration: 'none' }}><Icon type="edit" /> Edit collector</a>
//         </Menu.Item>
//         <Menu.Item key="close">
//             {/* <Link to={"/edit/" + id}><Icon type="edit" />  Edit</Link> */}
//             <a  href="# " onClick={()=>Close(Number(id))} style={{ textDecoration: 'none' }}><Icon type="close" /> Close collector</a>
//         </Menu.Item>
//         <Menu.Item key="delete">
//             {/* <Link to={"#"} onClick={()=>Del(Number(id))}><Icon type="delete" />  Delete</Link> */}
//             <a  href="# " onClick={()=>Del(Number(id))} style={{ textDecoration: 'none' }}><Icon type="delete" />  Delete collector</a>
//         </Menu.Item>
//         <Menu.Item key="rename">
//             <a  href="# " onClick={()=>Rename(Number(id))} style={{ textDecoration: 'none' }}><Icon type="edit" />  Rename collector</a>
//         </Menu.Item>
//     </Menu>
// );

// function Del(ID:number) {
//   // console.log("Del click", ID);
//     // BaseService.delete(this.props.match.params.xSite, "/surveys/", ID).then(
//     //     (rp) => {
//     //         if (rp.Status) {
//     //             toastr.success(rp.Messages);    
//     //             window.location.reload();
//     //         } else { 
//     //             toastr.error(rp.Messages);
//     //             console.log("Messages: " + rp.Messages);
//     //             console.log("Exception: " + rp.Exception);
//     //         }
//     //     }
//     // );
// }

// function Rename(ID:number) {
//   // console.log("Rename click", ID);
// }

// function Close(ID:number) {
//   // console.log("Close click", ID);
// }

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            id:string   
        },
        path: string,
        url: string,
    }
}
interface IState {
    listCollectors: Array<Collector>,
    listProjects: Array<Project>,
    collector: Collector,
    survey: Surveys,
    totalCollectors: number,
    isLoading: boolean,
    isLoadingCollector: boolean,
    collectorType: string,
    collectorTypeId: string,
    visible: boolean,
    visibleRename: boolean,
    selectCollector: string,
}

export default class CollectorDashboard extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        this.state = {
            survey: {
                name: '',
                // template_id: ''
            },
            listCollectors: [],
            listProjects: [],
            collector: {
                name: '',
                survey_id: '',
                type: '',
                link: ''
            },
            totalCollectors: 0,
            isLoading: true,
            isLoadingCollector: true,
            collectorType: '',
            collectorTypeId: '0',
            visible: false,
            visibleRename: false,
            selectCollector: "ADD NEW COLLECTOR",
        }
        this.onFieldValueChange = this.onFieldValueChange.bind(this);

    }

    private onFieldValueChange(fieldName: string, value: any) { 
        const nextState = {
            ...this.state,
            collector: {
                ...this.state.collector,
                [fieldName]: value,
            }
        };

        this.setState(nextState);
      // console.log('Create onFieldValueChange', this.state.survey);
    }

    async componentDidMount() { 

        try{

            // console.log('list componentDidMount this.props', this.props);

            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);
            
            if( [1,4].includes(userData.ro) ) authorized = true;
            else if( [2,3].includes(userData.ro) ){
                if( userData.rs.includes('/') ) userData.rs.split('/').map((entity: any, i: any) => { if(parseInt(entity) === parseInt(this.props.match.params.id)) authorized = true; });
                else if(parseInt(userData.rs) === parseInt(this.props.match.params.id)) authorized = true;
            }
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

            document.body.id = 'collect-list';
            document.body.classList.toggle('translate', false);
            document.body.classList.toggle('step2', false);
            document.body.classList.toggle('basic', false);
            document.body.classList.toggle('modern-browser', false);
            document.body.classList.toggle('themeV3', false);
            document.body.classList.toggle('sticky', false);

            BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/', this.props.match.params.id, jwtToken).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log('componentDidMount survey', rp.Data);
                        const survey = rp.Data.recordset[0];

                        BaseService.get<Collector>(this.props.match.params.xSite, '/collector/list/', this.props.match.params.id, jwtToken).then(
                        (rp) => {
                            try{
                                if (rp.Status) {
                                    const listCollectors = rp.Data.recordset;
                                    const totalCollectors = rp.Data.recordset.length;

                                    BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/', jwtToken).then(
                                    (rp) => {
                                        try{
                                            if (rp.Status) {

                                                const listProjects = rp.Data.result.recordset;
                                                
                                                this.setState({ 
                                                    isLoading: false,
                                                    survey: survey,
                                                    listCollectors: listCollectors,
                                                    totalCollectors: totalCollectors,
                                                    listProjects: listProjects,
                                                }, () => {
                                                    // console.log('survey', survey);
                                                    // console.log('this.state.listCollectors', this.state.listCollectors);
                                                    // console.log('this.state.totalCollectors', this.state.totalCollectors);
                                                    // console.log('this.state.listProjects', this.state.listProjects);

                                                    this.collectorTable();
                                                });

                                            } else {
                                                this.setState({ isLoading: false });
                                                // toastr.error(rp.Messages);
                                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/') else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            }
                                        }catch(error){ 
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.getAll<Project>(this.props.match.params.xSite, '/projects/') catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                        }
                                    });// get projects

                                } else {
                                    this.setState({ isLoading: false });
                                    // toastr.error(rp.Messages);
                                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.get<Collector> /collector/list/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                }
                            }catch(error){ 
                                toastr.error('Something went wrong!, please refresh the page or try again later.');
                                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.get<Collector> /collector/list/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                            }
                        });// get collector

                    } else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount BaseService.get<Surveys> /surveys/${this.props.match.params.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            });// get survey

            //remove ant-modal-root child to fix a modal showing when switch between pages
            const allAntModalRootElement = document.getElementsByClassName('ant-modal-root');
            // console.log('allAntModalRootElement', allAntModalRootElement);
            if(allAntModalRootElement.length) for (let i = 0 ; i < allAntModalRootElement.length; i++) ReactDOM.render(<div></div>, document.getElementsByClassName('ant-modal-root')[i], () => { /*console.log(`ant-modal-root${i} child removed`)*/ });

        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }

    }

    componentWillReceiveProps() {
      // console.log('list componentWillReceiveProps');
        // console.log(this.state);
        // this.setState({
        //     collectorType: props.collectorType,
        //     collectorTypeId: props.collectorTypeId
        // });
        // this.props.form.setFieldsValue({
        //   // name: this.props.collectors.name,
        //   template_id: this.props.collectorType
        // }, () => console.log('after'));
        // console.log('before');
    }

    // componentWillReceiveProps() {
    //   // console.log('list componentWillReceiveProps');
    // }

    onSave = () => { 
        // console.log(`onSave`, this.state.survey.id);
        // console.log(`onSave`, this.state.collector);

        const jwt = getJwtToken();
        BaseService.create<Collector>(this.props.match.params.xSite, "/collector/", this.state.collector, jwt).then(
            (rp) => {
                if (rp.Status) {
                    // console.log(rp);
                    toastr.success(rp.Messages);
                    setTimeout(function(){ window.location.reload(); }, 500);
                    // this.history.push('/collectors/'+this.state.survey.id);
                    // window.location.reload();
                } else {
                    // toastr.error(rp.Messages);
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list onSave BaseService.create<Collector> /collector/${this.state.collector} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }
        );
    }

    // public onCreate = (typeNum: any) => { 
    showModal = (typeId: any) => {

        // if(parseInt(typeId) === 2 || parseInt(typeId) === 4) return;
        // if(parseInt(typeId) === 4) return;

        // console.log(`showModal ${typeId}`, this.state.collector);
        const current_survey_id = this.state.survey.id ? this.state.survey.id : '';

        const jwt = getJwtToken();
        BaseService.get<Surveys>(this.props.match.params.xSite, "/collector/typeName/", typeId, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // toastr.success('Survery created.'); 
                        // this.props.history.push(`/${this.props.match.params.xSite}`);
                      // console.log('templateName', rp.Data);
                        const typeName = rp.Data.recordset[0].name + ' collector';

                        this.setState({
                            visible: true,
                            collector: {
                                name: '',
                                survey_id: current_survey_id,
                                type: typeId,
                                link: `www.iconcxm.com/sv/${current_survey_id}/${typeId}`
                            },
                            collectorType: typeName,
                            selectCollector: "ADD NEW COLLECTOR"
                        });

                      // console.log('Create showModal', this.state);

                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list showModal BaseService.get<Surveys> /collector/typeName/${typeId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list showModal BaseService.get<Surveys> /collector/typeName/${typeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }

    // private onSave = () => {

    //   // console.log('Edit component onSave()');

    //     // const nextState = {
    //     //     ...this.state,
    //     //     survey: {
    //     //         ...this.state.survey,
    //     //         ['id']: this.state.survey['id'],
    //     //         ['template_id']: this.state.survey['template_id']
    //     //     }
    //     // };

    //     // console.log(nextState);
    //     // this.setState(nextState);

    //     //remove unnessary value
    //     // delete this.state.survey['id'];
    //     // delete this.state.survey['name'];
    //     // delete this.state.survey['template_id'];
    //     delete this.state.survey['status'];
    //     delete this.state.survey['num_page'];
    //     delete this.state.survey['num_question'];
    //     delete this.state.survey['total_responses'];
    //     delete this.state.survey['normal_responses'];
    //     delete this.state.survey['good_responses'];
    //     delete this.state.survey['bad_responses'];
    //     delete this.state.survey['responses_volume_id'];
    //     delete this.state.survey['alert_status'];
    //     delete this.state.survey['completion_rate'];
    //     delete this.state.survey['time_spent'];
    //     delete this.state.survey['num_collector'];
    //     delete this.state.survey['notification_status'];
    //     delete this.state.survey['active'];
    //     // delete this.state.survey['created_date'];
    //     delete this.state.survey['created_at'];
    //     // delete this.state.survey['modified_date'];
    //     delete this.state.survey['modified_at'];
    //     delete this.state.survey['deleted_at'];
    //     delete this.state.survey['template_name'];

    //     // this.setState(this.state.survey.template_id);
    //   // console.log(this.state.survey);
    //     BaseService.update<Surveys>("/surveys/", this.props.match.params.id, this.state.survey).then(
    //         (rp) => {
    //             if (rp.Status) {
    //                 toastr.success('Survey updated.');
    //                 // this.props.history.goBack();
    //                 this.props.history.push(`/${this.props.match.params.xSite}`);
    //             } else {
    //                 toastr.error(rp.Messages);
    //                 console.log("Messages: " + rp.Messages);
    //                 console.log("Exception: " + rp.Exception);
    //             }
    //         }
    //     );

    // }

    handleSelectChange = (typeId: any) => {
      // console.log(`handleSelectChange`, typeId);
        this.setState({ selectCollector: typeId});
        this.showModal(typeId);
    };

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

    getEmployeeOptions = (departmentNameList: any, departmentList: any, index: any) => {
        // console.log('departmentList.length', departmentList.length);
        // console.log(`departmentList`, departmentList);

        const employeeNodeElements = departmentList.map((employeeData: any, i: any) => {  
            // console.log(`departmentList employeeData`, employeeData);
            return (<Option key={`${i}-${this.getDateTime()}`} value={`${employeeData.UserID}`}>{employeeData.FirstName} {employeeData.LastName}</Option>);
        }); 

        // console.log('employeeNodeElements', employeeNodeElements);

        return (<OptGroup key={`${index}-${this.getDateTime()}`} label={departmentNameList[index]}>{employeeNodeElements}</OptGroup>);
    }

    collectorTable = async () => {

        // console.log(`collectorTable`);
        let employeeElement: any;

        if(this.state.totalCollectors > 0){

            if(this.props.match.params.xSite === 'realasset'){

                const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
                // console.log(`jwtToken`, jwtToken);

                // console.log('BaseService.getJSON(this.props.match.params.xSite, "/employees")');

                // BaseService.get<Collector>(this.props.match.params.xSite, '/collector/list/', this.props.match.params.id, jwtToken).then(
                employeeElement = await BaseService.getJSON(this.props.match.params.xSite, "/employees", '', jwtToken).then((rp) => {
                    try{
                        if (rp.Status) {
                            // console.log('employees rp', rp);
                            // console.log('employees rp.Data', rp.Data);
                            // console.log('employees rp.Data.result', rp.Data.result);
                            const employees = rp.Data.result;

                            // console.log('employees rp.Data.result.length', rp.Data.result.length);
                            
                            const numEmployee = employees.length;
                            // console.log('numEmployee', numEmployee);
                
                            // <OptGroup label="Manager">
                            //     <Option value="001">Jack</Option>
                            //     <Option value="200">Lucy</Option>
                            // </OptGroup>
                            //     <OptGroup label="Engineer">
                            //     <Option value="030">yiminghe</Option>
                            // </OptGroup>
                    
                            let employeeNode = new Array<any>(numEmployee);
                            for(let i = 0; i < employeeNode.length; i++) { employeeNode[i] = ''; }

                            let departmentIDList = [] as any;
                            let departmentNameList = [] as any;

                            //Genarate Department list
                            employees.map((employeeData: any, i: any) => {  if (departmentIDList.indexOf(employeeData.DepartmentID) === -1){ departmentIDList.push(employeeData.DepartmentID);  departmentNameList.push(employeeData.DepartmentName); } });

                            //create a new employeeInDepartmentList
                            let employeeInDepartmentList = new Array<any>(departmentIDList.length);
                            for(let i = 0; i < employeeInDepartmentList.length; i++) { employeeInDepartmentList[i] = [] as any; }

                            // console.log('employeeInDepartmentList', employeeInDepartmentList);
                            //Put employees in Department list
                            departmentIDList.map((departmentID: any, index: any) => {  employees.map((employeeData: any, i: any) => {  if (employeeData.DepartmentID === departmentID){ employeeInDepartmentList[index].push(employeeData); } }); });
                                
                            // console.log('departmentIDList', departmentIDList);
                            // console.log('departmentNameList', departmentNameList);
                            // console.log('employeeInDepartmentList', employeeInDepartmentList);

                            const nodeElements = employeeInDepartmentList.map((departmentList: any, index: any) => this.getEmployeeOptions(departmentNameList, departmentList, index));
                            
                            // console.log('nodeElements', nodeElements);
                            return nodeElements;
                        } else {
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'CollectorDashboard collectorList BaseService.getJSON /employees else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'CollectorDashboard collectorList BaseService.getJSON /employees catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                        return false;
                    }
                });
                    
                // console.log('Pass BaseService.getJSON(this.props.match.params.xSite, "/employees") employeeElement', employeeElement);
            }
            
            const collectorTable: JSX.Element[] = [];
        
            collectorTable.push(
                <table className="collectors-table sm-table" key='table'>
                    <thead>
                        <tr>
                            <th id="left-th" className="border-th border-th-icon" data-sort="true">
                            </th>
                            <th className="border-th border-th-nickname" data-sort="true">
                                NICKNAME <Tooltip title={'ผู้ใช้งานระบบเท่านั้นถึงจะเห็นชื่อนี้ (ผู้ทำแบบสอบถามจะไม่เห็น)'}><Icon type="info-circle-o"/></Tooltip>
                            </th>
                            <th className="border-th border-th-project" data-sort="true">
                                PROJECT / BRANCH
                            </th>
                            { this.props.match.params.xSite === 'realasset' ?
                            <th className="border-th border-th-project" data-sort="true">
                                EMPLOYEE NAME
                            </th>
                            :
                            null
                            }
                            <th className="border-th border-th-status" data-sort="true">
                                STATUS
                            </th>
                            <th className="border-th border-th-responses" data-sort="true">
                                RESPONSES
                            </th>
                            {/* <th className="border-th border-th-check" data-sort="true">
                                CHECK WITH
                            </th>
                            <th className="border-th border-th-condition" data-sort="true">
                                OPTION / CONDITION
                            </th>
                            <th className="border-th border-th-remlink" data-sort="true">
                                REM LINK
                            </th> */}
                            <th className="border-th border-th-date selected desc" data-sort="true">
                                DATE MODIFIED
                            </th>
                            <th id="right-th" style={{ minWidth: 'auto' }}></th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.collectorList(employeeElement)}

                    </tbody>
                </table>
            );

            
            collectorTable.push(<footer key='footer' style={{margin: '0'}} className="collectors-footer wds-type--product-ui wds-type-weight--regular"><b>COLLECTORS</b>: {this.state.totalCollectors} of {this.state.totalCollectors}</footer>);

            try{
                if(this.props.match.params.xSite === 'realasset'){
                    this.setState({ isLoadingCollector: false }, () => {
                        ReactDOM.render(<div>{collectorTable}</div>, document.getElementById('collector-items-list'));
                    });
                }
                else{
                    ReactDOM.render(<div>{collectorTable}</div>, document.getElementById('collector-items-list'));
                }
            }
            catch(error){
                toastr.error('Something went wrong!, please refresh the page or try again later.');
                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list collectorTable catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            }
        }
        else{
            // ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('collector-items-list'));
            if(this.props.match.params.xSite === 'realasset'){
                this.setState({ isLoadingCollector: false }, () => {
                    ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }} description={<span> No Collector </span>}/>, document.getElementById('collector-items-list'));
                });
            }
            else{
                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }} description={<span> No Collector </span>}/>, document.getElementById('collector-items-list'));
            }
        }
    }

    collectorList = (employeeElement: any) => {
      // console.log('collectorList', this.state.listCollectors);
        try{
            const collectorItems: JSX.Element[] = [];

            this.state.listCollectors.map( (collector, i) => {
                // console.log('collector', collector);

                let projectName = '-';
                this.state.listProjects.map((project: any) => {
                    // console.log('project', project);
                    if(collector.project_id === project.id){
                        projectName = project.name;
                        return;
                    }
                });
                // console.log('projectName', projectName);

                collectorItems.push(<CollectorRow collector={collector} key={i} projectName={projectName} employeeElement={employeeElement} history={this.props.history} match={this.props.match}/>);
            });

            return collectorItems;
        }
        catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `collect list collectorList catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }
    
    Rename = () => {
        // console.log('Rename');
        this.setState({
            visibleRename: true
        });
    }

    render() {
      // console.log('list render');
        
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (
            <div>

                <HeaderSurvey menuKey={'survey'} history={this.props.history} match={this.props.match}/>

                <div className="wds-pageheader" style={{ borderBottom: '1px solid #e8e8e8' }}>
                    <div className="wds-pageheader__text">
                        <h1 className="wds-pageheader__title wds-type--section-title">
                        {/* <span><span id="edit-name-icon" onClick={()=>this.Rename()} className="smf-icon notranslate">W</span> {this.state.survey.nickname}</span> */}
                        <span><Icon type="edit" onClick={()=>this.Rename()}/> {this.state.survey.nickname}</span>
                        </h1>
                    </div>
                </div>

                <MenuSurvey history={this.props.history} match={this.props.match} menuKey={'collect'} surveyId={ this.state.survey.id ? this.state.survey.id : '' }/>

                <CollectorCreateModal 
                // survey={this.state.survey}
                history={this.props.history} 
                visible={this.state.visible} 
                collectorType={this.state.collectorType}
                listProjects={this.state.listProjects}
                // collectorTypeId={this.state.collectorTypeId}
                onFieldValueChange={this.onFieldValueChange}
                onSave={this.onSave}
                />

                <div className="bd logged-in-bd">
                    <div className="container clearfix" style={{ maxWidth: '95%' }}>
                        {/* <div className="collectors clearfix"> */}
                        <div className="collectors-list clearfix">

                            <section className="collector-list-container">
                                    
                                <div className="add-collector">
                                    <Tooltip title="ตัวจัดเก็บการตอบกลับของแบบสอบถาม">
                                        <h1 className="wds-type--section-title">Survey Collectors</h1>
                                    </Tooltip>
                                    <span className="btn-menu ">
                                        
                                        {/* <a  href="# " role="button" new-collector-action-menu="" className="wds-button wds-button--icon-right wds-button--arrow-down" ref="#">ADD NEW COLLECTOR</a> */}

                                        <Select onChange={this.handleSelectChange} value={this.state.selectCollector}>
                                            <Option value="1"><Icon type="link" />&emsp;Web link collector</Option>
                                            {/* <Option value="2" disabled><Icon type="mobile" />&emsp;SMS collector</Option> */}
                                            <Option value="3"><Icon type="mail" />&emsp;Email collector</Option>
                                            {/* <Option value="4" disabled><Icon type="facebook" />&emsp;Social Media collector</Option> */}
                                            {/* <Option value="4" disabled><Icon type="facebook" />&emsp;Post to social media</Option> */}
                                            {/* { this.state.survey.rem_api_link ? <Option value="5"><Icon type="mobile" />&emsp;SMS EventTrigger collector</Option> : null === 'true' }
                                            { this.state.survey.rem_api_link ? <Option value="6"><Icon type="mail" />&emsp;Email EventTrigger collector</Option> : null === 'true' } */}
                                        </Select>
                                        
                                    </span>
                                </div>

                                <section className="collector-list-grid-container" survey-sm-key="">
                                    <section className="clgrid" view-role="CollectorsGridView">

                                    { this.props.match.params.xSite === 'realasset' && this.state.isLoadingCollector ?
                                        <div id="syncing"> <Spin size="large" tip="Syncing..."></Spin> </div>
                                    : 
                                        <div id="collector-items-list"></div>
                                    }
                                    
                                        {/* {this.collectorTable} */}
                                    </section>
                                </section>

                                <section className="collector-ads">
                                    <Tooltip placement="topLeft" title="ตัวจัดเก็บการตอบกลับของแบบสอบถาม">
                                        <header className="wds-type--section-title">Add a new collector</header>
                                    </Tooltip>
                                    <ul className="newCollector-list">
                                        <li className="add-weblink-collector">
                                            {/* <a data-icon="Ç" className="newCollector metric" href="# " collector-type="weblink" data-log-action="add_weblink_collector_button"> */}
                                            <a  href="# " onClick={()=>this.showModal(1)} className="newCollector metric" style={{ textDecoration: 'none' }}><Icon style={{ marginBottom: '15px'}} type="link" />
                                                <h3 className="wds-type--card-title" style={{ marginBottom: '10px'}} >Web Link & QR Code</h3>
                                                <p>Ideal for sharing via email, social media, etc.</p>
                                            </a>
                                        </li>

                                        <li className="add-email-collector">
                                            {/* <a data-icon="M" className="newCollector metric" href="# " collector-type="email" data-log-action="add_email_collector_button"> */}
                                            <a  href="# " onClick={()=>this.showModal(2)} className="newCollector metric" style={{ textDecoration: 'none' }}><Icon style={{ marginBottom: '15px'}} type="mail" />
                                                <h3 className="wds-type--card-title" style={{ marginBottom: '10px'}} > Email</h3>
                                                <p>Ideal for tracking your survey respondents</p>
                                            </a>
                                        </li>

                                    </ul>
                                </section>{/* collector-ads */}

                            </section>{/* collector-list-container */}

                        </div>{/* collectors */}
                    </div>{/* container clearfix */}
                </div>{/* bd logged-in-bd */}

                <SurveyReNicknameModal
                    history={this.props.history} match={this.props.match}
                    survey={this.state.survey}
                    visible={this.state.visibleRename}
                />

            </div>
        );
    }
}