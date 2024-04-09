import * as React from 'react';
import { History } from 'history';
import * as toastr from 'toastr';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
// import AllSurveys from '../common/allSurveys';
// import Posts from '../models/posts';
// import Surveys from '../models/surveys';
// import BaseService from '../service/base.service';
// import { Progress, Row, Col, Statistic, Card, Icon, Layout } from 'antd';
// import { TimelineChart, Gauge } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import CheckboxGroup from "antd/lib/checkbox/Group";
import { Row, Col, Card, Layout, Spin, Empty, Divider, Collapse, List, DatePicker, Tree, Tooltip, Icon } from 'antd';
import { Gauge, TagCloud } from 'ant-design-pro/lib/Charts';

import BulletGraph from '../common/BulletGraph';
import BulletGraph2 from '../common/BulletGraph2';
import BulletGraph3 from '../common/BulletGraph3';

import {
    // G2,
    Chart,
    Geom,
    Axis,
    // Tooltip,
    Coord,
    View,
    Guide,
    Legend,
    Label,
    // Label,
    // Shape,
    // Facet,
    // Util
} from "bizcharts";
import HeaderSurvey from '../common/header';
// import SurveyResponse from '../models/surveyResponse';
import BaseService from '../service/base.service';
import Answer from '../models/answers';
import HorizontalPercent from '../common/HorizontalPercent';
import Question from '../models/questions';
import ReactDOM from 'react-dom';
// import HorizontalPercentFold from '../common/HorizontalPercentFold';
import Surveys from '../models/surveys';
import reactCSS from 'reactcss';
const { Region, Text } = Guide;
// import '../App.css'; 
const { Content } = Layout;
const { Panel } = Collapse;
const { TreeNode } = Tree;

// import { Input } from "antd";
// import TableRow from '../common/form/TableRow';
// const { Search } = Input;

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
// interface IState {
//     listSurveys: Array<Surveys>
// }

interface IState {
    statisticData: {
        num_draft: number;
        num_open: number;
        total_responses: number;
        completion_rate: number;
        time_spent: string;
    }
    isLoading: boolean;
    isLoadingReport: boolean;
    display: boolean;

    projectId: any;
    touchpointId: any;

    filterTimePeriod: boolean,
    filterStartDate: string,
    filterEndDate: string,

    isMobile: boolean,
    paddingRight: any,
    paddingLeft: any,
    paddingRightPercent: any,
    paddingLeftPercent: any,
    BulletGraphnLocation: any,
    BulletGraph2nLocation: any,
    BulletGraph3nLocation: any,
    rotateLabel: any,

    enableAreaOfImpactCard: any,

    avgNPS: string;
    AvgGaugeTitle: string;
    NPSGaugeTitle: string;
    avgRating: string;

    surveys: any,
    actionSurveyOptions: any;
    selectedSurveyOptions: any;

    collectorCheckboxOptions: any,
    checkedCollectorList: any,
    defaultCheckedList: any,

    filterTouchpoint: boolean,

    filterSurveyCollector: boolean,
    expandedKeys: any,
    checkedKeys: any,
    autoExpandParent: any,

    filterProject: boolean,
    projectCheckboxOptions: any,
    checkedProjectList: any,
    defaultProjectCheckedList: any,

    treeData: any,
}

class ExecutiveReport extends React.Component<IProps, IState> {
// class Dashboard extends React.Component {

    constructor(props: IProps) {
        super(props);
        this.state = { 
            statisticData: {
                num_draft: 0,
                num_open: 0,
                total_responses: 0,
                completion_rate: 0,
                time_spent: ''
            },
            isLoading: true,
            isLoadingReport: true,
            display: false,

            projectId: 1,
            touchpointId: 0,

            filterTimePeriod: false,
            filterStartDate: '',
            filterEndDate: '',

            isMobile: window.outerWidth <= 575 ? true : false,
            paddingRight: window.outerWidth <= 575 ? '100' : '150',
            paddingLeft: window.outerWidth <= 575 ? '100' : '150',
            paddingRightPercent: window.outerWidth <= 575 ? '30' : '150',
            paddingLeftPercent: window.outerWidth <= 575 ? '90' : '150',
            BulletGraphnLocation: window.outerWidth <= 575 ? 6.5 : 5.6,
            BulletGraph2nLocation: window.outerWidth <= 575 ? 5.8 : 5.29,
            BulletGraph3nLocation: window.outerWidth <= 575 ? 10.8 : 10.39,
            rotateLabel: window.outerWidth <= 575 ? 30 : 0,

            enableAreaOfImpactCard: [],
            avgNPS: '',
            AvgGaugeTitle: '',
            NPSGaugeTitle: '',
            avgRating: '',

            surveys: {},
            actionSurveyOptions: [],
            selectedSurveyOptions: [],

            collectorCheckboxOptions: [],
            checkedCollectorList: [],
            defaultCheckedList: [],
            
            filterProject: false,
            projectCheckboxOptions: [],
            checkedProjectList: [],
            defaultProjectCheckedList: [],        
            filterTouchpoint: true,

            filterSurveyCollector: true,
            // expandedKeys: ['survey-1'],
            // checkedKeys: ['collector-1','survey-2'],
            expandedKeys: [],
            checkedKeys: [],
            autoExpandParent: true,
            treeData: [],
         };
    }

    public async componentDidMount() {
      // console.log('componentDidMount ExecutiveReport');
        try{
            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = true;
            const userData = jwt.decode(jwtToken) as any;
          // console.log('userData', userData);
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);
            
            if(userData.ro === 3 && !userData.rs) authorized = false;
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

            document.body.id = 'executive-report';
            document.body.classList.toggle('sticky', true);

            //Update User Token
            BaseService.getUserToken(this.props.match.params.xSite, jwtToken).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                          // console.log('getUserToken rp', rp);
                          // console.log('getUserToken rp.Data', rp.Data);
                          // console.log('rp.Data.userToken', rp.Data.userToken);
                            localStorage.setItem('iconcxmuser', rp.Data.userToken);
                        } else {
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report componentDidMount BaseService.getUserToken(${jwtToken}) else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            localStorage.removeItem('iconcxmuser');
                            this.props.history.push(`/${this.props.match.params.xSite}/login`);
                        }
                    }catch(error){ 
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report componentDidMount BaseService.getUserToken(${jwtToken}) catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
            this.renderFilter(true);
            this.renderElement(true);
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'executive-report componentDidMount catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    public async renderFilter(firstTime: boolean){
        const jwt = getJwtToken();
        BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/executive-report/', this.state.touchpointId, jwt).then(
                async (rp) => {
                    try{
                        if (rp.Status) {

                            this.setState({ isLoading: false });

                            // console.log(`componentDidMount get surveys rp`, rp);
                            // console.log(`componentDidMount get surveys rp.Data`, rp.Data);
                            
                            const result = rp.Data.result.recordset;
                            const resultLength = result.length;
                            // console.log(`componentDidMount get surveys resultLength`, resultLength);

                            const treeData = [] as any;
                            const expandedKeys = [] as any;
                            const checkedKeys = [] as any;
                                
                            if(resultLength){
                                result.map((survey: any, index: any) => {
                                    // console.log('survey', survey);
                                    // console.log('survey.survey_id', survey.survey_id);
                                    // console.log('survey.survey_name', survey.survey_name);
                                    // console.log('survey.collector_id', survey.collector_id);
                                    // console.log('survey.collector_nickname', survey.collector_nickname);

                                    const surveyName = survey.survey_name.includes('&amp;') ? survey.survey_name.replace('&amp;', '&') : survey.survey_name;

                                    let collectorIdArr = survey.collector_id ? survey.collector_id.includes(",") ? survey.collector_id.split(',') : [survey.collector_id] : [];
                                    let collectorNameArr = survey.collector_nickname ? survey.collector_nickname.includes(",") ? survey.collector_nickname.split(',') : [survey.collector_nickname] : [];
                                    collectorNameArr = collectorNameArr.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

                                    // console.log('collectorIdArr', collectorIdArr);
                                    // console.log('collectorNameArr', collectorNameArr);

                                    const children = [] as any;
                                    for(let i = 0; i < collectorIdArr.length; i++){
                                        // console.log(`collector[${i}]`, collectorIdArr[i]);
                                        children.push({title: <div><Tooltip title={`${collectorNameArr[i]} Collector`}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> <span className="collector-name-title">{collectorNameArr[i]}</span></div>, key: `collector-${collectorIdArr[i]}`});
                                        //redirect to this page at the first time and only get the first survey
                                        if(!(firstTime && index > 0)) checkedKeys.push(`collector-${collectorIdArr[i]}`);
                                    }

                                    // console.log('children', children);

                                    treeData.push({
                                        title: <div><Tooltip title={`${surveyName} Survey`}><Icon type="info-circle-o" style={{ color: 'dodgerblue' }}/></Tooltip> <span className="survey-name-title">{surveyName}</span></div>,
                                        key: `survey-${survey.survey_id}`,
                                        children: children
                                        // children: [
                                        //     { title: 'Collector 1', key: 'collector-1' },
                                        //     { title: 'Collector 2', key: 'collector-2' },
                                        // ]
                                    });
                                    expandedKeys.push(`survey-${survey.survey_id}`);
                                    
                                    // console.log('expandedKeys', expandedKeys);
                                    // console.log('checkedKeys', checkedKeys);

                                    this.setState({ 
                                        filterSurveyCollector: true,
                                        treeData: treeData,
                                        expandedKeys: expandedKeys,
                                        checkedKeys: checkedKeys,
                                    });

                                });

                                //get project id and name filter
                                const surveyProjectNameArr = result[0].survey_project_name ? result[0].survey_project_name.includes(",") ? result[0].survey_project_name.split(',') : [result[0].survey_project_name] : [];
                                // console.log('surveyProjectNameArr', surveyProjectNameArr);
                                const surveyProjectIdArr = result[0].survey_project_id ? result[0].survey_project_id.includes(",") ? result[0].survey_project_id.split(',') : [result[0].survey_project_id] : [];
                                // console.log('surveyProjectIdArr', surveyProjectIdArr);
                                // const collectorProjectIdArr = result[0].collector_project_id.includes(",") ? result[0].collector_project_id.split(',') : [result[0].collector_project_id];
                                // console.log('collectorProjectIdArr', collectorProjectIdArr);

                                // let projectCheckboxOptions = [] as any;
                                const projectCheckboxOptions = surveyProjectIdArr.map((projectId: any, i: any) => {
                                    // console.log(`projectId ${i}`, projectId);
                                    // projectCheckboxOptions.push({ label: surveyProjectNameArr[i], value: projectId });
                                    return { label: surveyProjectNameArr[i], value: projectId };
                                });

                                // let projectCheckboxOptions = [] as any;
                                // surveyProjectIdArr.forEach((projectId: any, i: any) => {
                                //     // console.log(`projectId ${i}`, projectId);
                                //     collectorProjectIdArr.forEach((collectorProjectId: any, j: any) => {
                                //         // console.log(`collectorProjectId ${j}`, collectorProjectId);
                                //         if(projectId === collectorProjectId && projectCheckboxOptions.filter((projectOption: any) => projectOption.label === surveyProjectNameArr[i]).length === 0){
                                //             // console.log(`in if projectId === collectorProjectId`);
                                //             projectCheckboxOptions.push({ label: surveyProjectNameArr[i], value: projectId });
                                //             return;
                                //         }
                                //     });
                                // });
                                // console.log('projectCheckboxOptions', projectCheckboxOptions);

                                const projectDefaultCheckedList = surveyProjectIdArr.map(function (projectName: any, i: any) {
                                    // console.log(`projectName ${i}`, projectName);
                                    return surveyProjectIdArr[i];
                                });
                                // console.log('projectDefaultCheckedList', projectDefaultCheckedList);

                                this.setState({ 
                                    projectCheckboxOptions : projectCheckboxOptions,
                                    defaultProjectCheckedList : projectDefaultCheckedList,
                                    checkedProjectList: projectDefaultCheckedList
                                }, () => {
                                    // console.log('this.state.projectCheckboxOptions', this.state.projectCheckboxOptions);
                                    // console.log('this.state.defaultProjectCheckedList', this.state.defaultProjectCheckedList);
                                    // console.log('this.state.checkedProjectList', this.state.checkedProjectList);
                                });

                                // const treeData = [
                                //         {
                                //         title: 'Survey 1',
                                //         key: 'survey-1',
                                //             children: [
                                //                 { title: 'Collector 1', key: 'collector-1' },
                                //                 { title: 'Collector 2', key: 'collector-2' },
                                //             ]
                                //         },
                                //         {
                                //         title: 'Survey 2',
                                //         key: 'survey-2',
                                //             children: [
                                //                 { title: 'Collector 2-1', key: 'collector-2-1' },
                                //                 { title: 'Collector 2-2', key: 'collector-2-2' },
                                //                 { title: 'Collector 2-3', key: 'collector-2-3' },
                                //             ]
                                //         },
                                // ];

                                // const numProjects = result[0].num_projects;
                                const numTouchpoints = result[0].num_touchpoints;
                                // let projectName = result[0].name_projects.includes(",") ? result[0].name_projects.split(',') : [result[0].name_projects];
                                let touchpointName = result[0].name_touchpoints ? result[0].name_touchpoints.includes(",") ? result[0].name_touchpoints.split(',') : [result[0].name_touchpoints] : [];

                                // console.log(`get numProjects`, numProjects);
                                // console.log(`get numTouchpoints`, numTouchpoints);
                                // console.log(`get projectName`, projectName);
                                // console.log(`get touchpointName`, touchpointName);

                                //replace &amp; with & character
                                // projectName = projectName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });
                                touchpointName = touchpointName.map((name: any) => { return name.includes('&amp;') ? name.replace('&amp;', '&') : name; });

                                // let nodeProjectOption = new Array<any>(numProjects+1);
                                let nodeTouchpointOption = new Array<any>(numTouchpoints+1);

                                // for(let i = 0; i < nodeProjectOption.length; i++) { nodeProjectOption[i] = ''; }
                                for(let i = 0; i < nodeTouchpointOption.length; i++) { nodeTouchpointOption[i] = ''; }

                                // const allProjectOptionElement = nodeProjectOption.map((obj, i) => this.getProjectOptionRow(i, projectName));
                                const allTouchpointOptionElement = nodeTouchpointOption.map((obj, i) => this.getTouchpointOptionRow(i, touchpointName));
                                // console.log('allProjectOptionElement', allProjectOptionElement);
                                // console.log('allTouchpointOptionElement', allTouchpointOptionElement);

                                // allTouchpointOptionElement.push(<option key={`touchpoint-option-${99}`} value='99' className="user-generated">{touchpointName[numTouchpoints-1]}</option>);
                                // console.log('allTouchpointOptionElement', allTouchpointOptionElement);

                                // if(allProjectOptionElement.length){
                                //     //render move tab element
                                //     ReactDOM.render(allProjectOptionElement, document.getElementById("project-dropdown"));
                                //   // console.log('render project-dropdown');
                                // }

                                if(allTouchpointOptionElement.length){
                                    //render move dropdown page option
                                    ReactDOM.render(allTouchpointOptionElement, document.getElementById("touchpoint-dropdown"));
                                  // console.log('render touchpoint-dropdown');
                                }
                            }
                            else{
                                // console.log('display 1');
                                this.setState({ 
                                    isLoadingReport: false, 
                                    display: false,
                                    filterSurveyCollector: false,
                                    treeData: treeData,
                                    expandedKeys: expandedKeys,
                                    checkedKeys: checkedKeys,
                                });
                            }

                        } else {
                            // console.log('display 2');
                            this.setState({ isLoadingReport: false, display: false });
                            // ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('bullet-graph-list'));
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report renderFilter BaseService.get<Surveys> /surveys/executive-report/${this.state.touchpointId} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }
                    } catch(error){
                        // console.log('display 3');
                        this.setState({ isLoadingReport: false, display: false });
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report renderFilter BaseService.get<Surveys> /surveys/executive-report/${this.state.touchpointId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
    }

    public async renderElement(firstTime: boolean){

        const startTime = performance.now();

        this.setState({ isLoadingReport: true });

        const jwt = getJwtToken();
        // BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/report/', this.state.projectId + '/' + this.state.touchpointId, jwt).then(
        BaseService.get<Surveys>(this.props.match.params.xSite, '/surveys/executive-report/', this.state.touchpointId, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                        this.setState({ display: true });

                        // console.log(`renderElement get surveys rp`, rp);
                        // console.log(`renderElement get surveys rp.Data`, rp.Data);
                        const result = rp.Data.result.recordset;
                        const resultLength = result.length;
                        // console.log(`renderElement get surveys resultLength`, resultLength);

                        if(resultLength){

                            // const numProjects = result[0].num_projects;
                            // const numTouchpoints = result[0].num_touchpoints;
                            const numAreaOfImpacts = result[0].num_area_of_impacts;
                            // const projectName = result[0].name_projects.includes(",") ? result[0].name_projects.split(',') : [result[0].name_projects];
                            // const touchpointName = result[0].name_touchpoints.includes(",") ? result[0].name_touchpoints.split(',') : [result[0].name_touchpoints];
                            const areaOfImpactNameTemp = result[0].name_area_of_impacts.includes(",") ? result[0].name_area_of_impacts.split(',') : [result[0].name_area_of_impacts];
                            let areaOfImpactName = [] as any;

                            for(let i = 0; i < areaOfImpactNameTemp.length; i++) areaOfImpactName.push(areaOfImpactNameTemp[i].includes('&amp;') ? areaOfImpactNameTemp[i].replace('&amp;', '&') : areaOfImpactNameTemp[i]);
                            
                            // console.log(`before areaOfImpactName`, areaOfImpactName);

                            const areaOfImpactId = areaOfImpactName.map((name: any, index: any) => { return parseInt(name.split('~')[1]); });
                            areaOfImpactName = areaOfImpactName.map((name: any, index: any) => { return name.split('~')[0]; });

                            // console.log(`get areaOfImpactId`, areaOfImpactId);

                            // console.log(`get numProjects`, numProjects);
                            // console.log(`get numTouchpoints`, numTouchpoints);
                            // console.log(`get numAreaOfImpacts`, numAreaOfImpacts);
                            // console.log(`get projectName`, projectName);
                            // console.log(`get touchpointName`, touchpointName);
                            // console.log(`get areaOfImpactName`, areaOfImpactName);

                            // let nodeProjectOption = new Array<any>(numProjects+1);
                            // let nodeTouchpointOption = new Array<any>(numTouchpoints+1);

                            // for(let i = 0; i < nodeProjectOption.length; i++) { nodeProjectOption[i] = ''; }
                            // for(let i = 0; i < nodeTouchpointOption.length; i++) { nodeTouchpointOption[i] = ''; }

                            // const allProjectOptionElement = nodeProjectOption.map((obj, i) => this.getProjectOptionRow(i, projectName));
                            // const allTouchpointOptionElement = nodeTouchpointOption.map((obj, i) => this.getTouchpointOptionRow(i, touchpointName));
                            // console.log('allProjectOptionElement', allProjectOptionElement);
                            // console.log('allTouchpointOptionElement', allTouchpointOptionElement);

                            // if(allProjectOptionElement.length){
                            //     //render move tab element
                            //     ReactDOM.render(allProjectOptionElement, document.getElementById("project-dropdown"));
                            //   // console.log('render project-dropdown');
                            // }

                            // if(allTouchpointOptionElement.length){
                            //     //render move dropdown page option
                            //     ReactDOM.render(allTouchpointOptionElement, document.getElementById("touchpoint-dropdown"));
                            //   // console.log('render touchpoint-dropdown');
                            // }

                            let allAreaOfImpactsElement = new Array<any>(numAreaOfImpacts+1);
                            let allAreaOfImpactsAvg = new Array<any>(numAreaOfImpacts+1);
                            let allAreaOfImpactsNPS = new Array<any>(numAreaOfImpacts+1);
                            let allAreaOfImpactsAnswered = new Array<any>(numAreaOfImpacts+1);

                            for(let i = 0; i < numAreaOfImpacts+1; i++) { 
                                allAreaOfImpactsElement[i] = [];
                                allAreaOfImpactsAvg[i] = [];
                                allAreaOfImpactsNPS[i] = [];
                                allAreaOfImpactsAnswered[i] = [];
                            }

                            // console.log(`allAreaOfImpactsElement`, allAreaOfImpactsElement);
                            // console.log(`allAreaOfImpactsAvg`, allAreaOfImpactsAvg);
                            // console.log(`allAreaOfImpactsAnswered`, allAreaOfImpactsAnswered);
                        
                            //redirect to this page at the first time and only get the first survey data
                            const num = firstTime ? 1 : resultLength;
                            let nodeElement = [] as any;
                            let allElement = new Array<any>(num);

                            let numQuestion = 0;
                            for(let i = 0; i < num ; i++) { 
                                const surveyId = result[i].survey_id;
                                // console.log('surveyId', surveyId);
                                numQuestion = parseInt(result[i].num_question);
                                // console.log('num_question', numQuestion);

                                let nodeArr = new Array<any>(numQuestion);
                                for(let i = 0; i < nodeArr.length; i++) { nodeArr[i] = ''; }
                                nodeElement = nodeArr.map((obj, i) => this.getQuestionAnswer(surveyId, i+1, jwt));
                                allElement[i] = await Promise.all(nodeElement);
                            }

                            // console.log('allElement', allElement);

                            for(let i = 0; i < num; i++) {
                                // console.log(`allElement[${i}]`, allElement[i]);//num of survey that macth with this project and touchpoint
                                for(let j = 0; j <  allElement[i].length; j++) {//num of question in the each survey
                                    // console.log(`i = ${i}, j = ${j}`);

                                    // console.log(`allElement[${i}][${j}]`, allElement[i][j]);//num of question in the each survey
                                    
                                    if(allElement[i][j]){
                                    
                                        // console.log(`allElement[${i}][${j}][0]`, allElement[i][j][0]);//num of area of impacts on the question

                                        for(let k = 0; k < allElement[i][j][0].length; k++) {//loop num of area of impacts on the question
                                            // console.log(`allElement[${i}][${j}][0][${k}]`, allElement[i][j][0][k]);
                                            let areaOfImpactNumber = allElement[i][j][0][k];
                                            // console.log(`areaOfImpactNumber`, areaOfImpactNumber);

                                            areaOfImpactId.map((id: any, index: any) => { 
                                                // console.log('id', id);
                                                if(areaOfImpactNumber === id) { areaOfImpactNumber = id; return; }
                                            });

                                            // console.log(`after areaOfImpactNumber`, areaOfImpactNumber);

                                            // console.log(`allElement[${i}][${j}][1][${k}]`, allElement[i][j][1]);
                                            const element = allElement[i][j][1];
                                            // console.log(`element`, element);

                                                // console.log(`allAreaOfImpactsElement`, allAreaOfImpactsElement);
                                            allAreaOfImpactsElement[areaOfImpactNumber].push(element);

                                            // console.log(`allElement[${i}][${j}][2]`, allElement[i][j][2]);//question type id
                                            const questionTypeId = allElement[i][j][2];
                                            // console.log(`questionTypeId`, questionTypeId);
                                            
                                            if(questionTypeId === 1){
                                            //   console.log(`allElement[${i}][${j}][3]`, allElement[i][j][3]);//avg
                                                const avg = parseFloat(allElement[i][j][3]);
                                            //   console.log(`avg`, avg);
                                                allAreaOfImpactsAvg[areaOfImpactNumber].push(avg);

                                            //   console.log(`allElement[${i}][${j}][4]`, allElement[i][j][4]);//answered
                                                const answered = parseFloat(allElement[i][j][4]);
                                            //   console.log(`answered`, answered);
                                                allAreaOfImpactsAnswered[areaOfImpactNumber].push(answered);
                                            }
                                            else if(questionTypeId === 4){
                                            //   console.log(`allElement[${i}][${j}][3]`, allElement[i][j][3]);//avg
                                                const nps = parseFloat(allElement[i][j][3]);
                                            //   console.log(`nps`, nps);
                                                allAreaOfImpactsNPS[areaOfImpactNumber].push(nps);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            // console.log(`after allAreaOfImpactsElement`, allAreaOfImpactsElement);
                            // console.log(`after allAreaOfImpactsAvg`, allAreaOfImpactsAvg);
                            // console.log(`after allAreaOfImpactsNPS`, allAreaOfImpactsNPS);
                            // console.log(`after allAreaOfImpactsAnswered`, allAreaOfImpactsAnswered);
                            // console.log('after areaOfImpactName', areaOfImpactName);

                            let allAreaOfImpactsElementContainer = new Array<any>(numAreaOfImpacts+1);

                            let enableAreaOfImpactCardArr = new Array<any>(numAreaOfImpacts+1);
                            // for(let i = 0; i < allAreaOfImpactsElementContainer.length; i++) { enableAreaOfImpactCardArr[i] = true; }
                            // console.log('enableAreaOfImpactCardArr', enableAreaOfImpactCardArr);

                            const bulletGraphArr = [] as any;
                            let totalAvg = 0;
                            let totalAvgStr = '';
                            let countTotalAvg = 0;
                            let totalNPS = 0;
                            let totalNPSStr = '';
                            let countTotalNPS = 0;
                            let chartDataOther = [{actual: 0}];
                            if(allAreaOfImpactsElement.length !== 0){
                                for(let i = 1; i < numAreaOfImpacts+1; i++) {
                                    if(allAreaOfImpactsElement[i].length){
                                        enableAreaOfImpactCardArr[i] = true;
                                        // console.log(`if enableAreaOfImpactCardArr[${i}]`, enableAreaOfImpactCardArr);
                                    }
                                    else{
                                        enableAreaOfImpactCardArr[i] = false;
                                        // console.log(`else enableAreaOfImpactCardArr[${i}]`, enableAreaOfImpactCardArr);
                                    }
                                    
                                    if(allAreaOfImpactsAvg[i].length){
                                        const countAvgArr = allAreaOfImpactsAvg[i].length;
                                        allAreaOfImpactsAvg[i] = allAreaOfImpactsAvg[i].reduce(function (a: any, b: any) { return a + b; }) / countAvgArr;
                                        totalAvg += allAreaOfImpactsAvg[i];
                                        countTotalAvg++;
                                      // console.log(`allAreaOfImpactsAvg[${i}] Sum`, allAreaOfImpactsAvg[i]);

                                        allAreaOfImpactsAnswered[i] = allAreaOfImpactsAnswered[i].reduce(function (a: any, b: any) { return a + b; });
                                      // console.log(`allAreaOfImpactsAnswered[${i}] Sum`, allAreaOfImpactsAnswered[i]);
                                        let chartData = [
                                            {
                                                // title: `${areaOfImpactName[i-1]}`,
                                                title: "Rating",
                                                subtitle: `N(Q) = ${allAreaOfImpactsAnswered[i]}`,
                                                ranges: [2, 4, 5],
                                                target: 4,
                                                actual: parseFloat(allAreaOfImpactsAvg[i])
                                            },
                                        ];

                                        const thisAreaOfImpactName = areaOfImpactId.map((id: any, index: any) => { 
                                            // console.log(`i ${i}, id ${id}, index ${index}`);
                                            if(i === id) { 
                                                // console.log('areaOfImpactName[index]', areaOfImpactName[index]);
                                                return areaOfImpactName[index];
                                            }
                                        });

                                        // console.log('thisAreaOfImpactName', thisAreaOfImpactName);
                                        // console.log('areaOfImpactName[i-1]', areaOfImpactName[i-1]);

                                        // console.log('i > 1 && chartData[0].actual > 0 chartDataOther[0].actual', chartDataOther[0].actual);
                                        // console.log('i > 1 && chartData[0].actual > 0 chartDataOther[0].actual.toFixed(2)', chartDataOther[0].actual.toFixed(2));
                                        if(i > 1 && chartData[0].actual > 0){

                                            const scoreColor = chartData[0].actual <= 2 ? "red" : chartData[0].actual >= 4 ? "#00BF6F" : "orange";
                                            const styles = reactCSS({
                                                'default': {
                                                    scoreFontColor: {
                                                        color: scoreColor
                                                    }
                                                }
                                            });

                                            // console.log('if chartData[0].actual', chartData[0].actual);
                                            bulletGraphArr.push(
                                                // <div style={{ margin: '10px', border: 'solid 1px lightgrey', paddingTop: '10px' }} key={`${areaOfImpactName[i-1]}-${this.getDateTime()}`}>
                                                <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${thisAreaOfImpactName}-${this.getDateTime()}`}>
                                                    <h4 style={{ display: 'inline', fontSize: '18px', fontWeight: 'bold', color: 'black', marginLeft: '5px'}}>
                                                        {thisAreaOfImpactName}
                                                        &nbsp;
                                                    </h4>
                                                    <span style={{ fontWeight: 'bold' }}>( Score = <span style={styles.scoreFontColor}>{chartData[0].actual.toFixed(2)}</span> )</span>
                                                    <BulletGraph key={`avg-area-of-impact-${i}-${this.getDateTime()}`} unique={`unique-${i}-${this.getDateTime()}`} data={chartData} height={100} padding={['60', '100', '60', '100']} nlocation={this.state.BulletGraphnLocation} yGap={1.6}/>
                                                </div>
                                            );
                                        }
                                        else if(i === 1) { 
                                            // console.log('else chartData[0].actual', chartData[0].actual);
                                            chartDataOther = chartData; 
                                        }
                                    }

                                    if(allAreaOfImpactsNPS[i].length){
                                        const countNPSArr = allAreaOfImpactsNPS[i].length;
                                        allAreaOfImpactsNPS[i] = allAreaOfImpactsNPS[i].reduce(function (a: any, b: any) { return a + b; }) / countNPSArr;
                                        totalNPS += allAreaOfImpactsNPS[i];
                                        countTotalNPS++;
                                      // console.log(`allAreaOfImpactsNPS[${i}] Sum`, allAreaOfImpactsNPS[i]);
                                    }
                                }

                                // console.log('chartDataOther[0].actual > 0 chartDataOther[0].actual', chartDataOther[0].actual);
                                // console.log('chartDataOther[0].actual > 0 chartDataOther[0].actual.toFixed(2)', chartDataOther[0].actual.toFixed(2));
                                if(chartDataOther[0].actual > 0){
                                    const scoreColor = chartDataOther[0].actual <= 2 ? "red" : chartDataOther[0].actual >= 4 ? "#00BF6F" : "orange";
                                    const styles = reactCSS({
                                        'default': {
                                            scoreFontColor: {
                                                color: scoreColor
                                            }
                                        }
                                    });
                                                   
                                    // console.log('areaOfImpactName', areaOfImpactName);
                                    // console.log('areaOfImpactName[numAreaOfImpacts-1]', areaOfImpactName[numAreaOfImpacts-1]);
                                    bulletGraphArr.push(
                                        // <div style={{ margin: '10px', border: 'solid 1px lightgrey', paddingTop: '10px' }} key={`${areaOfImpactName[numAreaOfImpacts-1]}-${this.getDateTime()}`}>
                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${areaOfImpactName[numAreaOfImpacts-1]}-${this.getDateTime()}`}>
                                            <h4 style={{ display: 'inline', fontSize: '18px', fontWeight: 'bold', color: 'black', marginLeft: '5px'}}>
                                                {areaOfImpactName[numAreaOfImpacts-1]}
                                                &nbsp;
                                            </h4>
                                            <span style={{ fontWeight: 'bold' }}>( Score = <span style={styles.scoreFontColor}>{chartDataOther[0].actual.toFixed(2)}</span> )</span>
                                            <BulletGraph key={`avg-area-of-impact-${0}-${this.getDateTime()}`} unique={`unique-${0}-${this.getDateTime()}`} data={chartDataOther} height={100} padding={['60', '100', '60', '100']} nlocation={this.state.BulletGraphnLocation} yGap={1.6}/>
                                        </div>
                                    );
                                }

                                bulletGraphArr.push(
                                    <div style={{ textAlign: 'center' }} key={`N(Q)-${this.getDateTime()}`}>
                                        <span style={{ fontWeight: 'bold' }}>
                                            N(Q)&nbsp;
                                            <Tooltip title={`N(Q) คือ จำนวนข้อคำถาม ที่ผู้ทำแบบสอบถามตอบมาทั้งหมด ของใน Area of Impact นั้น ยกตัวอย่างเช่น (จำนวนข้อลูกค้าที่ตอบ) 50 x 2 [ข้อคำถามด้าน Sales] = 100 เพราะฉะนั้นค่าที่แสดงในแถบ Sales 0-5 มาจากการนำคะแนน 100 คำตอบมาคำนวนหาค่าเฉลี่ย`}>
                                                <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
                                            </Tooltip> 
                                        </span>
                                    </div>
                                );
                            }

                            // console.log(`allAreaOfImpactsNPS`, allAreaOfImpactsNPS);
                            // console.log(`totalAvg`, totalAvg);
                            // console.log(`totalNPS`, totalNPS);
                            // console.log(`countTotalAvg`, countTotalAvg);
                            // console.log(`countTotalNPS`, countTotalNPS);
                            
                            // console.log(`totalAvg / countTotalAvg = `, totalAvg/countTotalAvg);
                            // console.log(`totalNPS / countTotalNPS = `, totalNPS/countTotalNPS);

                            // setup formatters
                            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
                            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
                            
                            // const totalAvgCountTotalAvgNaiveRound = this.naiveRound(totalAvg/countTotalAvg, 1);
                            // const totalNPSTotalNPS2NaiveRound = this.naiveRound(totalNPS/countTotalNPS, 1);
                            
                            // const totalAvgCountTotalAvg = Math.round((totalAvg/countTotalAvg)*10)/10;
                            // const totalNPSTotalNPS = Math.round((totalNPS/countTotalNPS)*10)/10;
                            
                            // const totalAvgCountTotalAvg2 = Math.round((totalAvg/countTotalAvg)*100)/100;
                            // const totalNPSTotalNPS2 = Math.round((totalNPS/countTotalNPS)*100)/100;
                            
                            // console.log(`totalAvgCountTotalAvgNaiveRound`, totalAvgCountTotalAvgNaiveRound);
                            // console.log(`totalNPSTotalNPS2NaiveRound`, totalNPSTotalNPS2NaiveRound);


                            // console.log(`totalAvgCountTotalAvg2`, totalAvgCountTotalAvg2);
                            // console.log(`totalNPSTotalNPS2`, totalNPSTotalNPS2);

                            // console.log(`totalAvg / countTotalAvg = `, totalAvg/countTotalAvg);
                            // console.log(`parseFloat((totalAvg/countTotalAvg).toFixed(3); = `, parseFloat((totalAvg/countTotalAvg).toFixed(3)));

                            // console.log(`parseFloat((totalAvg/countTotalAvg).toFixed(2); = `, parseFloat((totalAvg/countTotalAvg).toFixed(2)));

                            // console.log(`parseFloat((totalAvg/countTotalAvg).toFixed(1)`, parseFloat((totalAvg/countTotalAvg).toFixed(1)));

                            const totalAvgCountTotalAvgToFixed2 = parseFloat((totalAvg/countTotalAvg).toFixed(2));
                            // console.log(`totalAvgCountTotalAvgToFixed2`, totalAvgCountTotalAvgToFixed2);

                            const totalAvgCountTotalAvgRound = Math.round(totalAvgCountTotalAvgToFixed2*10)/10;

                            // console.log(`parseFloat((totalAvg / countTotalAvg).toFixed(1); = `, parseFloat(totalAvgCountTotalAvgToFixed2.toFixed(1)));

                            // const totalAvgCountTotalAvgToFixed1 = parseFloat(totalAvgCountTotalAvgToFixed2.toFixed(1));
                            // console.log(`totalAvgCountTotalAvgToFixed1`, totalAvgCountTotalAvgToFixed1);

                            // console.log(`Math.round(totalAvg / countTotalAvg) = `, Math.round(totalAvg/countTotalAvg));

                            const totalNPSTotalNPSToFixed2 = parseFloat((totalNPS/countTotalNPS).toFixed(2));
                            // console.log(`totalNPSTotalNPSToFixed2`, totalNPSTotalNPSToFixed2);

                            const totalNPSTotalNPSRound = Math.round(totalNPSTotalNPSToFixed2*10)/10;

                            // console.log(`parseFloat((totalNPS / countTotalNPS).toFixed(1); = `, parseFloat(totalAvgCountTotalAvgToFixed2.toFixed(1)));

                            // const totalNPSTotalNPSToFixed1 = parseFloat(totalNPSTotalNPSToFixed2.toFixed(1));

                            // console.log(`totalAvgCountTotalAvgRound`, totalAvgCountTotalAvgRound);
                            // console.log(`totalNPSTotalNPSRound`, totalNPSTotalNPSRound);
                            
                            totalAvgStr = af.format(totalAvgCountTotalAvgRound).toString();
                            totalNPSStr = af.format(totalNPSTotalNPSRound).toString();
                            // totalNPSStr = af.format(totalNPS / countTotalNPS).toString();

                            // console.log(`totalAvgStr`, totalAvgStr);
                            // console.log(`totalNPSStr`, totalNPSStr);

                            if(bulletGraphArr.length > 1){
                                ReactDOM.render(<div>{bulletGraphArr}</div>, document.getElementById('bullet-graph-list'));
                            }
                            else{
                                ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '50px 0 50px 0' }}/>, document.getElementById('bullet-graph-list'));
                            }

                            const titleAvg = `
                            <span>Score</span><br/>
                            <span style="font-size: 28px; color: black;">${totalAvgStr}</span>
                            <div style="font-size: 16px;color: black;font-weight: 300;top: 10px;left: 65px;position: absolute;">0</div>
                            <div style="font-size: 16px;color: black;font-weight: 300;top: 10px;right: 60px;position: absolute;">5</div>
                            `;

                            const titleNPS = `
                            <span>Score</span><br/>
                            <span style="font-size: 28px; color: black;">${totalNPSStr}</span>
                            <div style="font-size: 16px;color: black;font-weight: 300;top: 10px;left: 65px;position: absolute;">0</div>
                            <div style="font-size: 16px;color: black;font-weight: 300;top: 10px;right: 60px;position: absolute;">10</div>
                            `;

                            this.setState({ 
                                avgRating: totalAvgStr,
                                avgNPS: totalNPSStr,
                                AvgGaugeTitle: titleAvg,
                                NPSGaugeTitle: titleNPS,
                                enableAreaOfImpactCard: enableAreaOfImpactCardArr,
                            }, () => {
                                // console.log(`setState enableAreaOfImpactCard`, this.state.enableAreaOfImpactCard);
                                // console.log(`setState avgRating`, this.state.avgRating);
                                // console.log(`setState avgNPS`, this.state.avgNPS);
                                // console.log(`setState NPSGaugeTitle`, this.state.NPSGaugeTitle);
                                // console.log(`setState enableAreaOfImpactCard`, this.state.enableAreaOfImpactCard);
                                for(let i = 1; i < allAreaOfImpactsElementContainer.length; i++) { 

                                    const thisAreaOfImpactName = areaOfImpactId.map((id: any, index: any) => { 
                                        if(i+1 === id) { 
                                            // console.log(`i+1 ${i+1}, id ${id}, index ${index}`);
                                            // console.log('areaOfImpactName[index]', areaOfImpactName[index]);
                                            return areaOfImpactName[index];
                                        }
                                    });

                                    allAreaOfImpactsElementContainer[i] = this.areaOfImpactCard(i+1, thisAreaOfImpactName);
                                }
                                // allAreaOfImpactsElementContainer[numAreaOfImpacts] = this.areaOfImpactCard(0, 'Other');
                                allAreaOfImpactsElementContainer[numAreaOfImpacts] = this.areaOfImpactCard(1, 'Other');
                                // console.log(`allAreaOfImpactsElementContainer`, allAreaOfImpactsElementContainer);
                            });

                            // ReactDOM.render(<div key={`area-of-impact-list-${this.getDateTime()}`}>{allAreaOfImpactsElementContainer}</div>, document.getElementById(`area-of-impact-list`));
                            // this.setState({ isLoadingReport: false });

                            let parentEl = document.getElementById(`area-of-impact-list`);
                            let childEl = <div key={`area-of-impact-child-${this.getDateTime()}`}>{allAreaOfImpactsElementContainer}</div>
                            ReactDOM.render(childEl, parentEl, () => {
                                
                                if(allAreaOfImpactsElement.length !== 0){
                                    for(let i = 0; i < numAreaOfImpacts+1; i++) {

                                        // console.log(`allAreaOfImpactsElement[${i}]`, allAreaOfImpactsElement[i]);
                                        // console.log(`allAreaOfImpactsElement[${i}].length`, allAreaOfImpactsElement[i].length);

                                        if(allAreaOfImpactsElement[i].length){
                                            ReactDOM.render(<div key={`area-of-impact-${i}-list-${this.getDateTime()}`}>{allAreaOfImpactsElement[i]}</div>, document.getElementById(`area-of-impact-${i}-list`));
                                        }
                                        // else{
                                        //     let enableAreaOfImpactCardArr = this.state.enableAreaOfImpactCard;
                                        //     enableAreaOfImpactCardArr[i] = false;

                                        //   // console.log(`else ${i} enableAreaOfImpactCardArr`, enableAreaOfImpactCardArr);

                                        //     this.setState({ 
                                        //         enableAreaOfImpactCard: enableAreaOfImpactCardArr,  
                                        //     }, () => {
                                        //       // console.log(`setState enableAreaOfImpactCard`, this.state.enableAreaOfImpactCard);
                                        //     });
                                        //     // lestyle={this.state.customColor}
                                        //     // ReactDOM.render(<div style={{ display : 'none' }}></div>, document.getElementById(`area-of-impact-card-${i}`));
                                        // }
                                    }
                                }

                                const endTime = performance.now();
                              // console.log('Its took ' + (endTime - startTime) + ' ms.');

                                // console.log('display 4');
                                this.setState({ isLoadingReport: false });
                            });

                        } else {
                            // console.log('display 5');
                            this.setState({ isLoadingReport: false, display: false });
                            // ReactDOM.render(<Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '100px 0 100px 0' }}/>, document.getElementById('bullet-graph-list'));
                            // toastr.error(rp.Messages);
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report renderElement BaseService.get<Surveys> /surveys/executive-report/${this.state.touchpointId} else resultLength`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            return false;
                        }

                    }//if rp.Status
                    else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report renderElement BaseService.get<Surveys> /surveys/executive-report/${this.state.touchpointId} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                } catch(error){
                    // console.log('display 6');
                    this.setState({ isLoadingReport: false, display: false });
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report renderElement BaseService.get<Surveys> /surveys/executive-report/${this.state.touchpointId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api
    }

    getQuestionAnswer = async (surveyId: any, i: any, jwt: any) => {
      // console.log (`survey id = ${surveyId} question no.` + i);

        // setup formatters
        const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
        const percentFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
        const pf = new Intl.NumberFormat('en-IN', percentFormat);

        return await BaseService.get<Question>(this.props.match.params.xSite, '/question/', surveyId + '/' + i, jwt).then(
            async (rp) => {
                try{
                    if (rp.Status) {

                        // console.log(`get question ${i} rp`, rp);
                        // console.log(`get question ${i} rp.Data`, rp.Data);
                        // console.log(`get question ${i} rp.Data.recordset.length = `, rp.Data.recordset.length);

                        if(rp.Data.recordset.length){

                            const surveyName = rp.Data.recordset[0].survey_name;

                            const questionId = rp.Data.recordset[0].id[0];
                            const questionTypeId = rp.Data.recordset[0].type_id;
                            // const questionNo = rp.Data.recordset[0].order_no;
                            const questionLabel = rp.Data.recordset[0].question_label;
                            // const questionActive = rp.Data.recordset[0].active;

                            const questionAnalyzeEntity = rp.Data.recordset[0].analyze_entity;
                            const questionAnalyzeSentiment = rp.Data.recordset[0].analyze_sentiment;

                            // const questionShowLabel = rp.Data.recordset[0].show_label;
                            const questionAreaOfImpactId = rp.Data.recordset[0].area_of_impact_id.includes(",") ? rp.Data.recordset[0].area_of_impact_id.split(',') : [rp.Data.recordset[0].area_of_impact_id];
                            
                            // console.log(`get question ${i} id = `, questionId);
                            // console.log(`get question ${i} type id = `, questionTypeId);
                            // console.log(`get question ${i} no = `, questionNo);
                            // console.log(`get question ${i} label = `, questionLabel);
                            // console.log(`get question ${i} active = `, questionActive);

                            // console.log(`get question ${i} entity = `, questionAnalyzeEntity);
                            // console.log(`get question ${i} sentiment = `, questionAnalyzeSentiment);
                                
                            // console.log(`get question ${i} questionAreaOfImpactId = `, questionAreaOfImpactId);

                            let comment = [] as any;

                            //Star Rating & Multiple choicevariables
                            let choices = [] as any;
                            let weights = [] as any;
                            let chartData = [] as any;

                            if(questionTypeId === 1 || questionTypeId === 2 || questionTypeId === 3 || questionTypeId === 6){
                                
                                const questionChoice = rp.Data.recordset[0].choice.split(',');
                                // console.log(`get question ${i} choice = `, questionChoice);

                                choices = [] as any;
                                weights = [] as any;
                                for (let i = 0; i < questionChoice.length; i++) {
                                    if (i % 2 === 0) {
                                        choices.push(questionChoice[i]);
                                    } 
                                    else {
                                        weights.push(questionChoice[i]);
                                    }
                                }

                                // console.log(`get question ${i} choices = `, choices);
                                // console.log(`get question ${i} weights = `, weights);
                            }
                                        
                            // console.log(`get question ${i} element`);

                            let element: any;

                            // const filterObj = {
                            //     filterTimePeriod: {
                            //         apply: this.state.filterTimePeriod,
                            //         filterStartDate: this.state.filterStartDate,
                            //         filterEndDate: this.state.filterEndDate
                            //     },
                            //     // areaOfImpacts: questionAreaOfImpactId
                            // }    

                            const collectorId = [] as any;
                            this.state.checkedKeys.map((key: any) => {
                                // console.log('key', key);
                                // console.log(`key.includes('collector-')`, key.includes('collector-'));
                                if(key.includes('collector-')){
                                    const id = key.split('-')[1];
                                    collectorId.push(id);
                                    // console.log('id', id);
                                }
                            });
                            // console.log('collectorId', collectorId);

                            const filterObj = {
                                filterTimePeriod: {
                                    apply: this.state.filterTimePeriod,
                                    filterStartDate: this.state.filterStartDate,
                                    filterEndDate: this.state.filterEndDate
                                },
                                filterSurveyCollector: {
                                    apply: this.state.filterSurveyCollector,
                                    collectorId: collectorId
                                },
                                filterProject: {
                                    apply: this.state.filterProject,
                                    projectId: this.state.checkedProjectList
                                },
                            }   
                            // console.log('filterObj', filterObj);

                            // const projectId = 2;
                            // const touchpointId = 2;
                            //get a answer just 1 time and wait for the process
                            // element = await BaseService.getWithBody<Answer>('/answer/', surveyId + '/' + questionId + '/' + questionTypeId + '/' + projectId + '/' + touchpointId , filterObj).then(
                                element = await BaseService.getWithBody<Answer>(this.props.match.params.xSite, '/answer/report/', surveyId + '/' + questionId + '/' + questionTypeId, filterObj, jwt).then(
                                (rp) => {
                                    try{
                                        if (rp.Status) {
                                            // console.log(`get answer ${i}`, rp.Messages);
                                            // console.log(`get answer ${i}`, rp.Data);
                                            // console.log(`get answer ${i} count = `, rp.Data.recordset.length);

                                            if(rp.Data.recordset.length){
                                                let tags = [] as any;
                                                let tags_positive = [] as any;
                                                let tags_negative = [] as any;
                                                
                                                //Star Rating
                                                if(questionTypeId === 1){

                                                    let sumAnswered = 0;
                                                    let sum = 0;
                                                    let avg = '0.0';

                                                    let countEachN = new Array<number>(5);
                                                    let percentScore = new Array<string>(5);

                                                    for(let i = 0; i < countEachN.length; i++) 
                                                    {  
                                                        countEachN[i] = 0;
                                                        percentScore[i] = '0.00';
                                                    } 

                                                    rp.Data.recordset.map((data: any) => {
                                                        // console.log('data', data);
                                                        // console.log('answer', data.answer);
                                                        // console.log('comment', data.comment);
                                                        // console.log('skip_status', data.skip_status);

                                                        if(data.skip_status === 0){
                                                            sum+=parseInt(data.answer);
                                                            sumAnswered++;
                                                            countEachN[parseInt(data.answer)-1]++;
                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                    });

                                                    //cal
                                                    const calAvg = (sum / sumAnswered);
                                                    avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();

                                                    for(let i = 0; i < countEachN.length; i++) 
                                                    {  
                                                        const cal = (countEachN[i] / sumAnswered) * 100;
                                                        percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((countEachN[i] / sumAnswered) * 100).toString();
                                                    } 

                                                    const chartData =    
                                                    [
                                                        {
                                                            title: "Rating",
                                                            subtitle: `N = ${sumAnswered}`,
                                                            ranges: [2, 4, 5],
                                                            actual: parseFloat(avg),
                                                            eachN: `N: 1 (${countEachN[0]}), 2 (${countEachN[1]}), 3 (${countEachN[2]}), 4 (${countEachN[3]}), 5 (${countEachN[4]})`
                                                            // eachN: `N: 1 [${percentScore[0]}% (${countEachN[0]})], 2 [${percentScore[1]}% (${countEachN[1]})], 3 [${percentScore[2]}% (${countEachN[2]})], 4 [${percentScore[3]}% (${countEachN[3]})], 5 [${percentScore[4]}% (${countEachN[4]})]`
                                                        },
                                                    ];

                                                    const scoreColor = chartData[0].actual <= 2 ? "red" : chartData[0].actual >= 4 ? "#00BF6F" : "orange";
                                                    const styles = reactCSS({
                                                        'default': {
                                                            scoreFontColor: {
                                                                color: scoreColor
                                                            }
                                                        }
                                                    });

                                                    return [questionAreaOfImpactId, (
                                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${questionId}-${this.getDateTime()}`}>
                                                            <h4 style={{ display: 'inline', fontSize: '18px', color: 'black', marginLeft: '5px'}}>
                                                                {/* {questionNo}. {questionLabel} */}
                                                                {questionLabel}&nbsp;
                                                                <Tooltip title={`Survey : ${surveyName}`}>
                                                                    <Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                                                </Tooltip> 
                                                                &nbsp;
                                                            </h4>
                                                            <span style={{ fontWeight: 'bold' }}>( Score = <span style={styles.scoreFontColor}>{chartData[0].actual}</span> )</span>
                                                            <BulletGraph2 key={`chart-${questionId}-${this.getDateTime()}`} unique={`unique-${questionId}-${this.getDateTime()}`} height={100} data={chartData} padding={['30', this.state.paddingRight, '0', this.state.paddingLeft ]} nlocation={this.state.BulletGraph2nLocation} yGap={0.1}/>

                                                            <div className={ tags && questionAnalyzeEntity && !questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                                                <TagCloud data={tags} height={200} color={""} />
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ (tags_positive.length ||  tags_negative.length) && questionAnalyzeEntity && questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                                                <TagCloud data={tags_positive} height={200} color={"green"}/>

                                                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                                                <TagCloud data={tags_negative} height={200} color={"red"}/>
                                                                
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ comment.length && !questionAnalyzeEntity && !questionAnalyzeSentiment ? 'comment-list' : 'comment-list hidden'}>
                                                                <Collapse accordion>
                                                                    <Panel header="comment" key="comment">
                                                                        <List
                                                                            bordered
                                                                            dataSource={comment as any []}
                                                                            renderItem={item => (
                                                                                <List.Item>
                                                                                    {item}
                                                                                </List.Item>
                                                                            )}
                                                                        />
                                                                    </Panel>
                                                                </Collapse>
                                                            </div>

                                                        </div>
                                                    ), questionTypeId, avg, sumAnswered];
                                                    // return avg;
                                                    // return <RatingRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>;
                                                }
                                                else if(questionTypeId === 2 || questionTypeId === 6){

                                                    let sumSkip = 0;
                                                    let sumAnswered = 0;
                                                    let sum = 0;
                                                    let avg = '0.0';
                                                    let sumScore = new Array<number>(choices.length);
                                                    let percentScore = new Array<string>(choices.length);
                                                    let countTotalRespondent = 0;

                                                    for(let i = 0; i < choices.length; i++) 
                                                    {  
                                                        sumScore[i] = 0;
                                                        percentScore[i] = '0.00';
                                                      // console.log(`sumScore[${i}] = `, sumScore[i] );
                                                      // console.log(`percentScore[${i}] = `, percentScore[i] );
                                                    } 
                                                    
                                                    rp.Data.recordset.map((data: any) => {
                                                        // console.log('data', data);
                                                        // console.log('answer', data.answer);
                                                        // console.log('skip_status', data.skip_status);
                                                        if(data.skip_status === 0){
                                                            //for equal of choice number
                                                            for (let i = 0; i < choices.length; i++) {
                                                                // console.log(`data.answer = ${data.answer} === weights[${i}] = `, weights[i]);
                                                                if(data.answer === parseInt(weights[i])){ 
                                                                    sumScore[i]++;
                                                                    sum+=parseInt(data.answer);
                                                                }   
                                                            }
                                                            sumAnswered++;
                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);

                                                            countTotalRespondent++;
                                                        }
                                                    });

                                                    //cal
                                                    const calAvg = (sum / sumAnswered);
                                                    avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();

                                                    for (let i = choices.length-1 ; i >= 0; i--) {
                                                        const cal = (sumScore[i] / sumAnswered) * 100;
                                                        percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((sumScore[i] / sumAnswered) * 100).toString();
                                                        chartData.push( { answer: choices[i], name: "Percent", percent: parseFloat(percentScore[i]), totalN: sumAnswered, N: sumScore[i], totalRespondent : countTotalRespondent } );
                                                    }

                                                    let chartHeight = 140;
                                                    chartHeight += choices.length > 3 ? (choices.length / 2) * 10 :  0; //+60
                                                    let paddingBottomPercent = 70;
                                                    paddingBottomPercent += choices.length > 3 ? (choices.length / 2) * 10 :  0; //+60

                                                  // console.log(`chartData ${i}`, chartData);

                                                    return [questionAreaOfImpactId, (
                                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${questionId}-${this.getDateTime()}`}>
                                                            <h4 style={{ fontSize: '18px', color: 'black', marginLeft: '5px'}}>
                                                                {/* {questionNo}. {questionLabel} */}
                                                                {questionLabel}&nbsp;
                                                                <Tooltip title={`Survey : ${surveyName}`}>
                                                                    <Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                                                </Tooltip> 
                                                            </h4>
                                                            <HorizontalPercent key={`chart-${questionId}-${this.getDateTime()}`} height={chartHeight} data={chartData} padding={['20', this.state.paddingRightPercent, paddingBottomPercent.toString(), this.state.paddingLeftPercent ]} rotate={this.state.rotateLabel} disable={false} />

                                                            <div className={ tags && questionAnalyzeEntity && !questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                                                <TagCloud data={tags} height={200} color={""} />
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ (tags_positive.length ||  tags_negative.length) && questionAnalyzeEntity && questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                                                <TagCloud data={tags_positive} height={200} color={"green"}/>

                                                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                                                <TagCloud data={tags_negative} height={200} color={"red"}/>
                                                                
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ comment.length && !questionAnalyzeEntity && !questionAnalyzeSentiment ? 'comment-list' : 'comment-list hidden'}>
                                                                <Collapse accordion>
                                                                    <Panel header="comment" key="comment">
                                                                        <List
                                                                            bordered
                                                                            dataSource={comment as any []}
                                                                            renderItem={item => (
                                                                                <List.Item>
                                                                                    {item}
                                                                                </List.Item>
                                                                            )}
                                                                        />
                                                                    </Panel>
                                                                </Collapse>
                                                            </div>
                                                            
                                                        </div>
                                                    ), questionTypeId];
                                                }
                                                else if(questionTypeId === 3){

                                                    let sumScore = new Array<number>(choices.length);
                                                    let percentScore = new Array<string>(choices.length);
                                                    let countTotal = 0;
                                                    let countTotalRespondent = 0;

                                                    for(let i = 0; i < choices.length; i++) 
                                                    {  
                                                        sumScore[i] = 0;
                                                        percentScore[i] = '0.00';
                                                        // console.log(`sumScore[${i}] = `, sumScore[i] );
                                                        // console.log(`percentScore[${i}] = `, percentScore[i] );
                                                    } 
                                                    
                                                    rp.Data.recordset.map((data: any) => {
                                                        // console.log('data', data);
                                                        // console.log('answer', data.answer);
                                                        // console.log('skip_status', data.skip_status);
                                                        if(data.skip_status === 0 && data.answer){

                                                            const answers = data.answer.includes(',') ? data.answer.split(',') : [data.answer];
                                                            
                                                            // console.log(`get answers from data.answer = `, answers);

                                                            //for equal of choice number
                                                            for (let i = 0; i < choices.length; i++) {
                                                                for(let ansIndex = 0; ansIndex < answers.length; ansIndex++) {
                                                                    // console.log(`parseInt(answers[ansIndex] = ${parseInt(answers[ansIndex])} === parseInt(weights[${i}]) = `, weights[i]);
                                                                    if(parseInt(answers[ansIndex]) === parseInt(weights[i])){ 

                                                                        sumScore[i]++;
                                                                        // console.log(`in if parseInt(answers[ansIndex]) === parseInt(weights[i])`,sumScore[i]);
                                                                        countTotal++;
                                                                    }  
                                                                }
                                                                
                                                            }
                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);

                                                            countTotalRespondent++;
                                                        }

                                                    });

                                                    //cal
                                                    for (let i = choices.length-1 ; i >= 0; i--) {
                                                        const cal = (sumScore[i] / countTotal) * 100;

                                                        percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((sumScore[i] / countTotal) * 100);
                                                        chartData.push( { answer: choices[i], name: "Percent", percent: parseFloat(percentScore[i]), totalN: countTotal, N: sumScore[i], totalRespondent : countTotalRespondent } );
                                                    }

                                                    let chartHeight = 140;
                                                    chartHeight += choices.length > 3 ? (choices.length / 2) * 10 :  0; //+60
                                                    let paddingBottomPercent = 70;
                                                    paddingBottomPercent += choices.length > 3 ? (choices.length / 2) * 10 :  0; //+60

                                                  // console.log(`chartData ${i}`, chartData);
                                                    return [questionAreaOfImpactId, (
                                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${questionId}-${this.getDateTime()}`}>
                                                            <h4 style={{ fontSize: '18px', color: 'black', marginLeft: '5px'}}>
                                                                {/* {questionNo}. {questionLabel} */}
                                                                {questionLabel}&nbsp;
                                                                <Tooltip title={`Survey : ${surveyName}`}>
                                                                    <Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                                                </Tooltip> 
                                                            </h4> 
                                                            <HorizontalPercent key={`chart-${questionId}-${this.getDateTime()}`} height={chartHeight} data={chartData} padding={['20', this.state.paddingRightPercent, paddingBottomPercent.toString(), this.state.paddingLeftPercent ]} rotate={this.state.rotateLabel} disable={false} />

                                                            <div className={ tags && questionAnalyzeEntity && !questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                                                <TagCloud data={tags} height={200} color={""} />
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ (tags_positive.length ||  tags_negative.length) && questionAnalyzeEntity && questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                                                <TagCloud data={tags_positive} height={200} color={"green"}/>

                                                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                                                <TagCloud data={tags_negative} height={200} color={"red"}/>
                                                                
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ comment.length && !questionAnalyzeEntity && !questionAnalyzeSentiment ? 'comment-list' : 'comment-list hidden'}>
                                                                <Collapse accordion>
                                                                    <Panel header="comment" key="comment">
                                                                        <List
                                                                            bordered
                                                                            dataSource={comment as any []}
                                                                            renderItem={item => (
                                                                                <List.Item>
                                                                                    {item}
                                                                                </List.Item>
                                                                            )}
                                                                        />
                                                                    </Panel>
                                                                </Collapse>
                                                            </div>

                                                        </div>
                                                    ), questionTypeId];
                                                }
                                                else if(questionTypeId === 4){

                                                    let sumAnswered = 0;
                                                    let sum = 0;
                                                    let avg = '0.0';

                                                    let countEachN = new Array<number>(11);
                                                    // let percentScore = new Array<string>(10);

                                                    for(let i = 0; i < countEachN.length; i++) 
                                                    {  
                                                        countEachN[i] = 0;
                                                        // percentScore[i] = '0.00';
                                                    } 
                                                    
                                                    rp.Data.recordset.map((data: any) => {
                                                        // console.log('data', data);
                                                        // console.log('answer', data.answer);
                                                        // console.log('skip_status', data.skip_status);
                                                        if(data.skip_status === 0){
                                                            sum+=parseInt(data.answer)
                                                            sumAnswered++;
                                                            countEachN[parseInt(data.answer)]++;
                                                            if(data.comment) comment.push('('+data.created_date+') ' + data.comment);
                                                        }
                                                    });

                                                    //cal
                                                    const calAvg = (sum / sumAnswered);
                                                    avg = isNaN(calAvg) ? af.format(0) : af.format(sum / sumAnswered).toString();
                                                    avg = calAvg === 10 ? '10' : avg;

                                                    for(let i = 0; i < countEachN.length; i++) 
                                                    {  
                                                        const cal = (countEachN[i] / sumAnswered) * 100;
                                                        // percentScore[i] = isNaN(cal) ? pf.format(0) : pf.format((countEachN[i] / sumAnswered) * 100).toString();
                                                    } 

                                                    const chartData =    
                                                    [
                                                        {
                                                            title: "NPS",
                                                            subtitle: `N = ${sumAnswered}`,
                                                            ranges: [4, 8, 10],
                                                            actual: parseFloat(avg),
                                                            eachNrow1: `N: 0 (${countEachN[0]}), 1 (${countEachN[1]}), 2 (${countEachN[2]}), 3 (${countEachN[3]}), 4 (${countEachN[4]})`,
                                                            eachNrow2: `5 (${countEachN[5]}), 6 (${countEachN[6]}), 7 (${countEachN[7]}), 8 (${countEachN[8]}), 9 (${countEachN[9]}), 10 (${countEachN[10]})`
                                                        },
                                                    ];

                                                    const scoreColor = chartData[0].actual <= 2 ? "red" : chartData[0].actual >= 4 ? "#00BF6F" : "orange";
                                                    const styles = reactCSS({
                                                        'default': {
                                                            scoreFontColor: {
                                                                color: scoreColor
                                                            }
                                                        }
                                                    });

                                                    return [questionAreaOfImpactId, (
                                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${questionId}-${this.getDateTime()}`}>
                                                            <h4 style={{ display: 'inline', fontSize: '18px', color: 'black', marginLeft: '5px'}}>
                                                                {/* {questionNo}. {questionLabel} */}
                                                                {questionLabel}&nbsp;
                                                                <Tooltip title={`Survey : ${surveyName}`}>
                                                                    <Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                                                </Tooltip> 
                                                                &nbsp;
                                                            </h4>
                                                            <span style={{ fontWeight: 'bold' }}>( Score = <span style={styles.scoreFontColor}>{chartData[0].actual}</span> )</span>
                                                            <BulletGraph3 key={`chart-${questionId}-${this.getDateTime()}`} unique={`unique-${questionId}-${this.getDateTime()}`} height={120} data={chartData} padding={['30', this.state.paddingRight, '0', this.state.paddingLeft ]} nlocation={this.state.BulletGraph3nLocation} yGap={0.1}/>

                                                            <div className={ tags && questionAnalyzeEntity && !questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                                                <TagCloud data={tags} height={200} color={""} />
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ (tags_positive.length ||  tags_negative.length) && questionAnalyzeEntity && questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                                                <TagCloud data={tags_positive} height={200} color={"green"}/>

                                                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                                                <TagCloud data={tags_negative} height={200} color={"red"}/>
                                                                
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ comment.length && !questionAnalyzeEntity && !questionAnalyzeSentiment ? 'comment-list' : 'comment-list hidden'}>
                                                                <Collapse accordion>
                                                                    <Panel header="comment" key="comment">
                                                                        <List
                                                                            bordered
                                                                            dataSource={comment as any []}
                                                                            renderItem={item => (
                                                                                <List.Item>
                                                                                    {item}
                                                                                </List.Item>
                                                                            )}
                                                                        />
                                                                    </Panel>
                                                                </Collapse>
                                                            </div>

                                                        </div>
                                                    ), questionTypeId, avg, sumAnswered];
                                                    // return avg;
                                                    // return <ScoreRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>
                                                }
                                                else if(questionTypeId === 5){

                                                    let comment = [] as any;
                                                    let tags = [] as any;
                                                    let tags_positive = [] as any;
                                                    let tags_negative = [] as any;

                                                    rp.Data.recordset.map((data: any) => {
                                                        // console.log('text data', data);
                                                        // console.log('text answer', data.answer);
                                                        // console.log('text skip_status', data.skip_status);

                                                        if(data.skip_status === 0){
                                                            comment.push('('+data.created_date+') ' + data.answer);
                                                        }
                                                    });

                                                    const tagsArr = this.getEntitySentiment(rp, questionAnalyzeEntity, questionAnalyzeSentiment);

                                                    tags = tagsArr.tags;
                                                    tags_positive = tagsArr.tags_positive;
                                                    tags_negative = tagsArr.tags_negative;

                                                        // if(data.analyze_entity && questionAnalyzeEntity && !questionAnalyzeSentiment){

                                                        //     data.analyze_entity.includes(",") ?
                                                        //     data.analyze_entity.split(',').map((entity: any, i: any) => {
                                                                
                                                        //         // console.log('map entity.name', entity);
                                                        //         let matched = false;
                                                        //         tags.forEach((item: any, index: any) => {
                                                        //             // console.log('index', index);
                                                        //             // console.log('tags[index]', tags[index]);
                                                        //             // console.log('entity name', entity);
                                                        //             // console.log('tags.name', tags[index].name);
                                                        //             // console.log('tags.value', tags[index].value);
                                                        //             // console.log(`${entity} === ${tags[index].name}`, entity === tags[index].name);
                                                        //             if(entity === tags[index].name){
                                                        //                 // console.log('matched');
                                                        //                 tags[index].value += 1;
                                                        //                 matched = true;
                                                        //             }
                                                        //         });

                                                        //         if(!matched){
                                                        //             // console.log('not match');
                                                        //             tags.push({
                                                        //                 name: entity,
                                                        //                 value: 1,
                                                        //             });
                                                        //         }

                                                        //     }) : 
                                                        //     tags.push({
                                                        //         name: data.analyze_entity,
                                                        //         value: 1,
                                                        //     });
                                                        // }
                                                        // else if(data.analyze_entity && data.analyze_sentiment && questionAnalyzeSentiment){
                                                        //     // let sentimentScores = [] as any;
                                                        //     // data.analyze_sentiment.includes(",") ?
                                                        //     const sentimentScores = data.analyze_sentiment.split(',').map((sentiment: any) => {
                                                        //       // console.log(sentiment);
                                                        //         return parseFloat(sentiment);
                                                        //     });
                                                        //     // }) :
                                                        //     // sentimentScores = [parseFloat(data.analyze_sentiment)];
                                                        //   // console.log('sentimentScores', sentimentScores);

                                                        //     // data.analyze_entity.includes(",") ?
                                                        //     data.analyze_entity.split(',').map((entity: any, i: any) => {
                                                                
                                                        //         // console.log('map entity.name', entity);
                                                        //         let matched = false;
                                                        //         // console.log(`map sentimentScores ${i}`, sentimentScores[i]);

                                                        //         if( sentimentScores[i] <= 0 ){
                                                        //             tags_negative.forEach((item: any, index: any) => {
                                                        //                 // console.log('index', index);
                                                        //                 // console.log('tags_negative[index]', tags_negative[index]);
                                                        //                 // console.log('entity name', entity);
                                                        //                 // console.log('tags.name', tags_negative[index].name);
                                                        //                 // console.log('tags.value', tags_negative[index].value);
                                                        //                 // console.log(`${entity} === ${tags_negative[index].name}`, entity === tags_negative[index].name);
                                                        //                 if(entity === tags_negative[index].name){
                                                        //                     // console.log('matched');
                                                        //                     tags_negative[index].value += 1;
                                                        //                     matched = true;
                                                        //                 }
                                                        //             });

                                                        //             if(!matched){
                                                        //                 // console.log('not match');
                                                        //                 tags_negative.push({
                                                        //                     name: entity,
                                                        //                     value: 1,
                                                        //                 });
                                                        //             }
                                                        //         }
                                                        //         else{
                                                        //             tags_positive.forEach((item: any, index: any) => {
                                                        //                 // console.log('index', index);
                                                        //                 // console.log('tags_positive[index]', tags_positive[index]);
                                                        //                 // console.log('entity name', entity);
                                                        //                 // console.log('tags.name', tags_positive[index].name);
                                                        //                 // console.log('tags.value', tags_positive[index].value);
                                                        //                 // console.log(`${entity} === ${tags_positive[index].name}`, entity === tags_positive[index].name);
                                                        //                 if(entity === tags_positive[index].name){
                                                        //                     // console.log('matched');
                                                        //                     tags_positive[index].value += 1;
                                                        //                     matched = true;
                                                        //                 }
                                                        //             });

                                                        //             if(!matched){
                                                        //                 // console.log('not match');
                                                        //                 tags_positive.push({
                                                        //                     name: entity,
                                                        //                     value: 1,
                                                        //                 });
                                                        //             }
                                                        //         }
                                                        //     });
                                                        //     // }) : 
                                                            
                                                        //     // sentimentScores[i] <= 0 ? 
                                                        //     // tags_negative.push({
                                                        //     //     name: data.analyze_entity,
                                                        //     //     value: 1,
                                                        //     // }) : 
                                                        //     // tags_positive.push({
                                                        //     //     name: data.analyze_entity,
                                                        //     //     value: 1,
                                                        //     // });

                                                        // }
                                                    // });

                                                  // console.log(`questionAnalyzeEntity`, questionAnalyzeEntity);
                                                  // console.log(`questionAnalyzeSentiment`, questionAnalyzeSentiment);

                                                  // console.log('text tags', tags);
                                                  // console.log('text tags_positive', tags_positive);
                                                  // console.log('text tags_negative', tags_negative);
                                                  // console.log('text comment', comment);
                                                    // return [questionAreaOfImpactId, comment];
                                                    return [questionAreaOfImpactId, (
                                                        <div style={{ marginTop: '30px', textAlign: 'left' }} key={`${questionId}-${this.getDateTime()}`}>
                                                            <h4 style={{ fontSize: '18px', color: 'black', marginLeft: '5px'}}>
                                                                {/* {questionNo}. {questionLabel} */}
                                                                {questionLabel}&nbsp;
                                                                <Tooltip title={`Survey : ${surveyName}`}>
                                                                    <Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/> 
                                                                </Tooltip> 
                                                            </h4>

                                                            <div className={ tags && questionAnalyzeEntity && !questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                                                <TagCloud data={tags} height={200} color={""} />
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ (tags_positive.length ||  tags_negative.length) && questionAnalyzeEntity && questionAnalyzeSentiment ? '' : 'hidden' }>
                                                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                                                <TagCloud data={tags_positive} height={200} color={"green"}/>

                                                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                                                <TagCloud data={tags_negative} height={200} color={"red"}/>
                                                                
                                                                <div className="comment-list">
                                                                    <Collapse accordion>
                                                                        <Panel header="comment" key="comment">
                                                                            <List
                                                                                bordered
                                                                                dataSource={comment as any []}
                                                                                renderItem={item => (
                                                                                    <List.Item>
                                                                                        {item}
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Panel>
                                                                    </Collapse>
                                                                </div>
                                                            </div>

                                                            <div className={ comment.length && !questionAnalyzeEntity && !questionAnalyzeSentiment ? 'comment-list' : 'comment-list hidden'}>
                                                                <Collapse accordion>
                                                                    <Panel header="comment" key="comment">
                                                                        <List
                                                                            bordered
                                                                            dataSource={comment as any []}
                                                                            renderItem={item => (
                                                                                <List.Item>
                                                                                    {item}
                                                                                </List.Item>
                                                                            )}
                                                                        />
                                                                    </Panel>
                                                                </Collapse>
                                                            </div>
                                                        </div>
                                                    ), questionTypeId];
                                                    // return <TextRow key={`${i}-${this.getDateTime()}`} question={questionObj} answer={answerObj} exportHandler={this.exportHandler.bind(this)}/>
                                                }
                                            }
                                            return false;

                                        } else {
                                            this.setState({ isLoading: false });
                                            // toastr.error(rp.Messages);
                                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report getQuestionAnswer BaseService.getWithBody<Answer> /answer/report/${surveyId}/${questionId}/${questionTypeId} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                                            return false;
                                        }
                                    }catch(error){ 
                                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report getQuestionAnswer BaseService.getWithBody<Answer> /answer/report/${surveyId}/${questionId}/${questionTypeId} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                                    }
                                }//(rp)
                            );//call answer api to element

                          // console.log(`got answer ${i} element`, element);
                            return element;
                        }//end if (rp.Data.recordset.length)
                        else{
                            return false;
                        }

                    } else {
                        this.setState({ isLoading: false });
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} else rp.Status`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                        return false;
                    }
                } catch(error){
                    this.setState({ isLoading: false });
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report getQuestionAnswer BaseService.get<Question> /question/${surveyId}/${i} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }//async (rp)
        );//call question api

    }

    getEntitySentiment(rp: any, questionAnalyzeEntity: any, questionAnalyzeSentiment: any){

        try{
            let tags = [] as any;
            let tags_positive = [] as any;
            let tags_negative = [] as any;
            // let tags_sentiment_answer = [] as any;

            rp.Data.recordset.map((data: any) => {
            // console.log('getEntitySentiment data', data);
            // console.log('getEntitySentiment answer', data.answer);
            // console.log('getEntitySentiment skip_status', data.skip_status);
            // console.log('getEntitySentiment', data.analyze_entity);
                
                if(data.skip_status === 0){

                    if(questionAnalyzeEntity && !questionAnalyzeSentiment && data.analyze_entity){

                        if(data.analyze_entity.includes(',')){

                            data.analyze_entity.split(',').map((entity: any, i: any) => {
                                
                            // console.log('map entity.name', entity);
                                
                                let matched = false;
                
                                tags.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags10[index]', tags10[index]);
                                    // console.log('entity name', entity);
                                    // console.log('tags.name', tags10[index].name);
                                    // console.log('tags.value', tags10[index].value);
                                    // console.log(`${entity} === ${tags10[index].name}`, entity === tags10[index].name);
                                    if(entity === tags[index].name){
                                        // console.log('matched');
                                        tags[index].value += 1;
                                        matched = true;
                                    }
                                });
                
                                if(!matched){
                                    // console.log('not match');
                                    tags.push({
                                        name: entity,
                                        value: 1,
                                    });
                                }
                
                            });
                        }
                        else{
                            // tags.push({
                            //     name: data.analyze_entity,
                            //     value: 1,
                            // });
                            let matched = false;
                
                            tags.forEach((item: any, index: any) => {
                                // console.log('index', index);
                                // console.log('tags10[index]', tags10[index]);
                                // console.log('entity name', entity);
                                // console.log('tags.name', tags10[index].name);
                                // console.log('tags.value', tags10[index].value);
                                // console.log(`${entity} === ${tags10[index].name}`, entity === tags10[index].name);
                                if(data.analyze_entity === tags[index].name){
                                    // console.log('matched');
                                    tags[index].value += 1;
                                    matched = true;
                                }
                            });
            
                            if(!matched){
                                // console.log('not match');
                                tags.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }
                        }
                    }
                    else if(questionAnalyzeEntity && questionAnalyzeSentiment && data.analyze_entity){
            
                        // tags_sentiment_answer.push(data.answer);
            
                        let sentimentScores: any;
                        
                    // console.log('tags analyze sentiment', data.analyze_sentiment);
                        //check analyze_sentiment is not empty

                        if(data.analyze_sentiment){
                            sentimentScores = data.analyze_sentiment.includes(',') ? data.analyze_sentiment.split(',').map((sentiment: any) => { console.log(sentiment); return parseFloat(sentiment);}) : [parseFloat(data.analyze_sentiment)];
                        }
                        else{//using analyze_entity instead and set sentiment score = 0
                            sentimentScores =  data.analyze_entity.includes(',') ? data.analyze_entity.split(',').map((sentiment: any) => { return 0; }) : [0];
                        }
                        
                    // console.log('tags analyze sentimentScores', sentimentScores);
            
                        if(data.analyze_entity.includes(',')){

                            data.analyze_entity.split(',').map((entity: any, i: any) => {
                                
                            // console.log('map entity.name', entity);
                                
                                let matched = false;
                                
                            // console.log(`map sentimentScores ${i}`, sentimentScores[i]);
                
                                if( sentimentScores[i] <= 0 ){
                
                                    // tags_negative_answer.push(data.answer);
                
                                    tags_negative.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags_negative[index]', tags_negative[index]);
                                        // console.log('item', item);
                                        // console.log('item.name', item.name);
                                    // console.log('entity name', entity);
                                        // console.log('entity.value', entity.value);
                                    // console.log('tags.name', tags_negative[index].name);
                                    // console.log('tags.value', tags_negative[index].value);
                                        // console.log(`localeCompare ${tags_negative[index].name} === ${item.name}`, tags_negative[index].name.localeCompare(item.name));
                                        // console.log(`localeCompare ${entity.name} === ${item.name}`, entity.name.localeCompare(item.name));
                                    // console.log(`${entity} === ${tags_negative[index].name}`, entity === tags_negative[index].name);
                                        // if(tags_negative[index].name.localeCompare(item.name) === 0){
                                        if(entity === tags_negative[index].name){
                                        // console.log('matched');
                                            tags_negative[index].value += 1;
                                            matched = true;
                                        }
                                    });
                
                                    if(!matched){
                                    // console.log('not match');
                                        tags_negative.push({
                                            name: entity,
                                            value: 1,
                                        });
                                    }
                                }
                                else{
                
                                    // tags_positive_answer.push(data.answer);
                
                                    tags_positive.forEach((item: any, index: any) => {
                                    // console.log('index', index);
                                    // console.log('tags_positive[index]', tags_positive[index]);
                                        // console.log('item', item);
                                        // console.log('item.name', item.name);
                                    // console.log('entity name', entity);
                                        // console.log('entity.value', entity.value);
                                    // console.log('tags.name', tags_positive[index].name);
                                    // console.log('tags.value', tags_positive[index].value);
                                        // console.log(`localeCompare ${tags_positive[index].name} === ${item.name}`, tags_positive[index].name.localeCompare(item.name));
                                        // console.log(`localeCompare ${entity.name} === ${item.name}`, entity.name.localeCompare(item.name));
                                    // console.log(`${entity} === ${tags_positive[index].name}`, entity === tags_positive[index].name);
                                        // if(tags_positive[index].name.localeCompare(item.name) === 0){
                                        if(entity === tags_positive[index].name){
                                        // console.log('matched');
                                            tags_positive[index].value += 1;
                                            matched = true;
                                        }
                                    });
                
                                    if(!matched){
                                    // console.log('not match');
                                        tags_positive.push({
                                            name: entity,
                                            value: 1,
                                        });
                                    }
                                }//if else
                                
                            });//data.analyze_entity.split(',')
                        }
                        else{
                            if( sentimentScores[0] <= 0 ){
                                tags_negative.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }
                            else{
                                tags_positive.push({
                                    name: data.analyze_entity,
                                    value: 1,
                                });
                            }//if else
                        }
                    }

                }
            });

            return {
                tags: tags,
                tags_positive: tags_positive,
                tags_negative: tags_negative
            };

        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `executive-report getEntitySentiment catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return {
                tags: [],
                tags_positive: [],
                tags_negative: []
            };
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

        let strDateTime = dd.toString() + '-' + mm.toString() + '-' + yyyy.toString() + '_' + HH.toString() + '-' + MM.toString() + '-' + SS.toString() + '-' + MS.toString();
      // console.log('getDateTime', strDateTime);

        return strDateTime;
    }

    areaOfImpactCard(areaOfImpactNo: any, areaOfImpactName: any){
        return (
            <div key={`area-of-impact-card-${areaOfImpactNo}`} id={`area-of-impact-card-${areaOfImpactNo}`} className={ this.state.enableAreaOfImpactCard[areaOfImpactNo] ? '' : 'hidden' }>
                <Col span={6} xs={24} sm={24} md={24} lg={24} xl={24} style={{ padding: '8px' }}>
                    <Card className="horizontal-score-chart-statistic-card dashboard-statistic-card" style={{ paddingTop: '25px', paddingRight: '0', paddingLeft: '0' }}>
                        <h4 style={{ fontSize: '22px', color: 'black', marginLeft: '5px', marginBottom: '30px' }}>{areaOfImpactName}</h4>
                        <div id={`area-of-impact-${areaOfImpactNo}-list`}></div>
                    </Card>
                </Col>
            </div>
        );
    }
    
    getProjectOptionRow = (No: any, projectName: any) => {
        if(No === 0) return (<option key={`project-option-${No}`} value={No} className="user-generated">All Projects</option>);
        else return (<option key={`project-option-${No}`} value={No} className="user-generated">{projectName[No-1]}</option>);
    }

    getTouchpointOptionRow = (No: any, touchpointName: any) => {
        if(No === 0) return (<option key={`touchpoint-option-${No}`} value={No} className="user-generated">All Touchpoints</option>);
        else if(touchpointName[No-1] === "HR") return (<option key={`touchpoint-option-${No}`} value={98} className="user-generated">{touchpointName[No-1]}</option>);
        else if(touchpointName[No-1] === "Other") return (<option key={`touchpoint-option-${No}`} value={99} className="user-generated">{touchpointName[No-1]}</option>);
        else return (<option key={`touchpoint-option-${No}`} value={No} className="user-generated">{touchpointName[No-1]}</option>);
    }

    //Project dropdown Fucntions
    // setToProjectHandler = (e : any) => {

    //   // console.log('click Dropdown Project Option target', e.target);
    //   // console.log('click Dropdown Project Option target id', e.target.id);
    //   // console.log('click Dropdown Project Option target value', e.target.value);

    //     const value = e.target.value;

    //   // console.log('click Dropdown Project Option value', value);

    //     this.setState({
    //         projectId: value,
    //     },  () => { 
    //           // console.log(`setState projectId`, this.state.projectId);
    //             this.renderElement();
    //         } 
    //     );

    // }

    //Touchpoint dropdown Fucntions
    setToTouchpointHandler = (e : any) => {

      // console.log('click Dropdown Touchpoint Option target', e.target);
      // console.log('click Dropdown Touchpoint Option target id', e.target.id);
      // console.log('click Dropdown Touchpoint Option target value', e.target.value);

        const value = e.target.value;

      // console.log('click Dropdown Touchpoint Option value', value);

        this.setState({
            touchpointId: value,
            filterProject: false,
        },  () => { 
              // console.log(`setState touchpointId`, this.state.touchpointId);
                this.renderFilter(false);
                this.renderElement(false);
            } 
        );

    }

    onChangeFilterStartDate = (value: any, dateString: any) => {
        // console.log('onChangeFilterStartDate Selected Time: ', value);
        // console.log('onChangeFilterStartDate Formatted Selected Time: ', dateString);
  
        // console.log('onChangeFilterStartDate: ', value);
        let datetime = value ? moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : '';
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
            // console.log('onChangeFilterStartDate after dateTimeSub: ', datetime);
        }
        // console.log('onChangeFilterStartDate: ', datetime);

        this.setState({ filterStartDate: datetime }, () => {
            // console.log('after this.state.filterStartDate', this.state.filterStartDate)
            }
        );
    }
  
    onFilterStartDateOk = (value: any) => {
    // console.log('onFilterStartDateOk: ', value);
        let datetime = value ? moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '';
    // console.log('onFilterStartDateOk before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
        // console.log('onFilterStartDateOk after dateTimeSub: ', datetime);
        }
    // console.log('onFilterStartDateOk: ', datetime);

        this.setState({ filterStartDate: datetime }, () => {
                // console.log('after this.state.filterStartDate', this.state.filterStartDate)
            }
        );
    }

    onChangeFilterEndDate = (value: any, dateString: any) => {
    // console.log('onChangeFilterEndDate Selected Time: ', value);
    // console.log('onChangeFilterEndDate Formatted Selected Time: ', dateString);

    // console.log('onChangeFilterEndDate: ', value);
        let datetime = value ? moment(dateString, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : '';
    // console.log('onChangeFilterEndDate before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
        // console.log('onChangeFilterEndDate after dateTimeSub: ', datetime);
        }
    // console.log('onChangeFilterEndDate: ', datetime);

        this.setState({ filterEndDate: datetime }, () => {
                // console.log('after this.state.filterEndDate', this.state.filterEndDate)
            }
        );
    }

    onFilterEndDateOk = (value: any) => {
    // console.log('onFilterEndDateOk: ', value);
        let datetime = value ? moment(value._d, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '';
    // console.log('onFilterEndDateOk before datetime: ', datetime);
        if(datetime){
            //const time = moment.duration("07:00:00");
            const dateTimeSub = moment(datetime);
            //dateTimeSub.subtract(time);
            datetime = moment(dateTimeSub).format('YYYY-MM-DD HH:mm:ss');
        // console.log('onFilterEndDateOk after dateTimeSub: ', datetime);
        }
    // console.log('onFilterEndDateOk: ', datetime);

        this.setState({ filterEndDate: datetime }, () => {
                // console.log('after this.state.filterEndDate', this.state.filterEndDate)
            }
        );
    }

    applyFilterTimePeriod(){
        // console.log('this.state.filterTimePeriod', this.state.filterTimePeriod);
        // console.log('this.state.filterStartDate', this.state.filterStartDate);
        // console.log('this.state.filterEndDate', this.state.filterEndDate);

        this.setState({ 
            isLoadingReport: true,
            filterTimePeriod: true,
        }, () => {
            // console.log('after this.state.filterTimePeriod', this.state.filterTimePeriod);
            // console.log('after this.state.filterStartDate', this.state.filterStartDate);
            // console.log('after this.state.filterEndDate', this.state.filterEndDate);
            this.renderElement(false);
        });
    }

    cancelFilterTimePeriod(){

        this.setState({ 
            isLoadingReport: true,
            filterTimePeriod: false,
            filterStartDate: '',
            filterEndDate: '', 
        }, () => {
            // console.log('after this.state.filterTimePeriod', this.state.filterTimePeriod);
            // console.log('after this.state.filterStartDate', this.state.filterStartDate);
            // console.log('after this.state.filterEndDate', this.state.filterEndDate);
            this.renderElement(false);
        });
        
    }

    // applyFilterTouchpoint(){
    //     this.setState({ 
    //         isLoadingReport: true,
    //         filterTouchpoint: true,
    //     }, () => {
    //         console.log('after applyFilterTouchpoint this.state.filterTouchpoint', this.state.filterTouchpoint)
    //         console.log('after applyFilterTouchpoint this.state.touchpointId', this.state.touchpointId)
    //         this.renderElement();
    //     });
    // }

    // cancelFilterTouchpoint(){
    //     this.setState({ 
    //         isLoadingReport: true,
    //         filterTouchpoint: false,
    //     }, () => {
    //         console.log('after cancelFilterTouchpoint this.state.filterTouchpoint', this.state.filterTouchpoint);
    //         this.renderElement();
    //     });
    // }

    applyFilterSurveysCollectors(){
        this.setState({ 
            isLoadingReport: true,
            filterSurveyCollector: true,
        }, () => {
            // console.log('after applyFilterSurveysCollectors this.state.filterSurveyCollector', this.state.filterSurveyCollector)
            // console.log('after applyFilterSurveysCollectors this.state.checkedKeys', this.state.checkedKeys)
            if(this.state.checkedKeys.length) this.renderElement(false);
            else this.setState({ isLoadingReport: false, display: false });
        });
    }

    cancelFilterSurveysCollectors(){
        this.setState({ 
            isLoadingReport: true,
            filterSurveyCollector: false,
        }, () => {
            // console.log('after cancelFilterSurveysCollectors this.state.filterSurveyCollector', this.state.filterSurveyCollector);
            this.renderFilter(false);
            this.renderElement(false);
        });
    }

    applyFilterProject(){

        // console.log('applyFilterProject');
      
        this.setState({
            isLoadingReport: true,
            filterProject: true,
        }, () => {
            if(this.state.checkedProjectList.length) this.renderElement(false);
            else this.setState({ isLoadingReport: false, display: false });
        });

    }

    cancelFilterProject(){

        // console.log('cancelFilterProject');

        this.setState({
            isLoadingReport: true,
            filterProject: false,
            checkedProjectList: this.state.defaultProjectCheckedList
        }, () => {
            this.renderFilter(false);
            this.renderElement(false);
        });
    }

    onProjectOptionsChange = (checkedProjectList: any) => {
        // console.log('onProjectOptionsChange', checkedProjectList);
        this.setState({
            checkedProjectList: checkedProjectList,
        });
    };
  
    //   applyFilterCollector(){
  
    //       // console.log('applyFilterCollector');
        
    //       this.setState({
    //           isLoadingReport: true,
    //           filterCollector: true,
    //       }, () => {
    //         this.renderElement();
    //       });
  
    //   }
  
    //   cancelFilterCollector(){
  
    //       // console.log('cancelFilterCollector');
  
    //       this.setState({
    //           isLoadingReport: true,
    //           filterCollector: false,
    //           checkedCollectorList: this.state.defaultCheckedList
    //       }, () => {
    //         this.renderElement();
    //       });
    //   }
  
    // onCollectorOptionsChange = (checkedCollectorList: any) => {
    //     // console.log('onCollectorOptionsChange', checkedCollectorList);
    //     this.setState({
    //         checkedCollectorList: checkedCollectorList,
    //     });
    // };

    // onSelect = (selectedKeys: any, info: any) => {
    //     console.log('selected', selectedKeys, info);
    // };

    // onCheck = (checkedKeys: any, info: any) => {
    //     console.log('onCheck', checkedKeys, info);
    // };

    onExpand = (expandedKeys: any) => {
        // console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    
    onCheck = (checkedKeys: any) => {
        // console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
    
    //   onSelect = (selectedKeys: any, info: any) => {
    //     console.log('onSelect', info);
    //     this.setState({ selectedKeys });
    //   };
    
    renderTreeNodes = (data: any) =>
    data.map((item: any) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} />;
    });
    
    // public renderHTML = (escapedHTML: string) => React.createElement("div", { dangerouslySetInnerHTML: { __html: escapedHTML } });

    public render(): React.ReactNode {

        // const isMobile = window.outerWidth <= 575 ? true : false;

        // const paddingRight = window.outerWidth <= 575 ? '100' : '150';
        // const paddingLeft = window.outerWidth <= 575 ? '100' : '150';

        // const paddingRightPercent = window.outerWidth <= 575 ? '30' : '150';
        // const paddingLeftPercent = window.outerWidth <= 575 ? '90' : '150';

        // // const BulletGraphnLocation = window.outerWidth <= 575 ? 6 : 5.8;
        // const BulletGraph2nLocation = window.outerWidth <= 575 ? 5.8 : 5.3;
        // const BulletGraph3nLocation = window.outerWidth <= 575 ? 10.8 : 10.4;

        // const rotateLabel = window.outerWidth <= 575 ? 30 : 0;

        // const treeData = [
        //     {
        //         title: 'Survey 1',
        //         key: 'survey-1',
        //             children: [
        //                 { title: 'Collector 1', key: 'collector-1' },
        //                 { title: 'Collector 2', key: 'collector-2' },
        //             ]
        //         },
        //         {
        //         title: 'Survey 2',
        //         key: 'survey-2',
        //             children: [
        //                 { title: 'Collector 2-1', key: 'collector-2-1' },
        //                 { title: 'Collector 2-2', key: 'collector-2-2' },
        //                 { title: 'Collector 2-3', key: 'collector-2-3' },
        //             ]
        //         },
        // ];
          
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (

            <div>

            <HeaderSurvey menuKey={'executive-report'} history={this.props.history} match={this.props.match}/>

            <div id="overlay" className={ this.state.isLoadingReport ? '' : 'hidden'}>
                <Spin size="large" tip="Loading..."></Spin>
            </div>

            <header className="subhead">
                <nav className="navigationTabs">
                    <div className="global-navigation-header ">
                        <div className="global-navigation-header-title-container global-navigation-header-centered clearfix" style={{ paddingTop:'4px' }}>
                            <h1 className="wds-pageheader__title wds-type--section-title">
                                <span>Executive Report</span>
                            </h1>
                        </div>
                    </div>
                </nav>
            </header>
            
            <div className="bd logged-in-bd" style={{marginTop: '110px'}}>

                    <aside id="sidebar" className="stick upgrade">
                                            
                        <div id="createAccordion" className="accordion unique" /*style={{height: '100vh', background: '#eee', borderRight: 'solid 2px #ddd'}}*/>
                            {/* <nav className="sidenav-view collapsible" style={{height: '100vh'}}>
                                <ul>
                                    <li onClick={ (e) => this.toolChange(e, "filter") } data-sidebar="accQuestionBank" className={ this.state.sidebarTool === "filter" ? "nav-tabs-select-style" : "" } sm-tooltip-side="right" title="FILTER">
                                        <a href="# " className="notranslate">
                                            <Icon type="filter"/>
                                        </a>
                                    </li>
                                </ul>
                            </nav> */}
                                            
                            <div id="accQuestionBank" className={"key open"} style={{ display: 'block', maxHeight: '100%'}}>
                                <header>
                                    <h3 className="accordionLabel">
                                        <a href="# " className="press keyOpener" target="#questionBankSettings" data-action="surveyQuestionBank" style={{ cursor: 'default' }}>FILTER</a>
                                    </h3>
                                </header>
                                <section id="questionBankSettings">{/*style={{height: '100vh'}}>*/}
                                    {/* <div id="create-qb-container" style={{height: '100vh'}}><div className="setting src-styles-common-_reset---questionBankApp---20vDf" id="qbl-app" style={{height: '278px'}}><div className="src-styles-_AccordionView---AccordionView---1Opdf" id="qbl-accordion"><ul className="addList" id="qbl-accordion-tiles"><ul className="addList"><li id="qbl-accordion-tile-recommendation"><div className="src-styles-_AccordionTile---content---1vnHu"><i className="icon src-styles-common-_icon---smIcon---1qA7b smf-icon src-styles-_AccordionTile---arrowRight---2dwTv">ÿ</i><span className="listText src-styles-_AccordionTile---text---2evIw">Recommended Questions</span></div></li><li id="qbl-accordion-tile-tag-id-market_research"><div className="src-styles-_AccordionTile---content---1vnHu"><i className="icon src-styles-common-_icon---smIcon---1qA7b smf-icon src-styles-_AccordionTile---arrowRight---2dwTv">ÿ</i><span className="listText src-styles-_AccordionTile---text---2evIw">Market Research</span></div></li></ul></ul></div></div></div> */}
                                    <div className="setting" style={{height: 'calc(100vh - 150px)', overflowY: 'auto'}}>{/*height: '100vh'*/}
                                        <ul className="addList">

                                            <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                    <span className="listText">Filter by Touchpoint</span>
                                                    { !this.state.filterTouchpoint ? 
                                                    <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterTouchpoint: true }) } }>APPLY</span>
                                                    : null }
                                                </a>

                                                { this.state.filterTouchpoint ? 
                                                <div id='filter-time-period'>
                                                    <section id="panel-send-date" style={{height: 'auto'}}>
                                                        <div id="send-date-module" className="clearfix">
                                                            <div className="sm-input sm-input--select sm-input--sm">
                                                                <select id={"touchpoint-dropdown"} value={this.state.touchpointId} style={{ fontSize: '14px', fontFamily: 'inherit', fontWeight: 400 }} className="no-touch" onChange={ (e) => this.setToTouchpointHandler(e) }></select>
                                                            </div>
                                                            {/* <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterTouchpoint() } }>APPLY</a>
                                                                <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterTouchpoint() } }>CANCEL</a>
                                                            </div> */}
                                                        </div>
                                                    </section>
                                                </div>
                                                : null }
                                            </li>

                                            <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                    <span className="listText">Filter by Time Period</span>
                                                    { !this.state.filterTimePeriod ? 
                                                    <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterTimePeriod: true }) } }>APPLY</span>
                                                    : null }
                                                </a>

                                                { this.state.filterTimePeriod ? 
                                                <div id='filter-time-period'>
                                                    <section id="panel-send-date" style={{height: 'auto'}}>
                                                        <div id="send-date-module" className="clearfix">
                                                            <div>
                                                                {/* <label className="sm-label sm-label--stretch"><b>Start Date:</b></label> */}
                                                                <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>Start Date : </span>
                                                                <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.filterStartDate ? moment(this.state.filterStartDate, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeFilterStartDate} onOk={this.onFilterStartDateOk} />
                                                            </div>
                                                            <div>
                                                                <span className="timezone" style={{ position: 'static', fontSize: '12px', display: 'block', paddingTop: '10px', paddingBottom: '5px' }}>End Date : </span>
                                                                <DatePicker showTime={{ format: 'DD-MM-YYYY HH:mm' }} format="DD-MM-YYYY HH:mm" defaultValue={this.state.filterEndDate ? moment(this.state.filterEndDate, "YYYY-MM-DD HH:mm:ss") : null} onChange={this.onChangeFilterEndDate} onOk={this.onFilterEndDateOk} />
                                                            </div>
                                                            <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterTimePeriod() } }>APPLY</a>
                                                                <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterTimePeriod() } }>CANCEL</a>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                                : null }
                                            </li>

                                            {/* check if the survey has some project to do a collecotr filter */}
                                            { this.state.projectCheckboxOptions.length ? 
                                            <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                    <span className="listText">Filter by Project</span>
                                                    { !this.state.filterProject ? 
                                                    <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterProject: true, filterSurveyCollector: false }) } }>APPLY</span>
                                                    : null }
                                                </a>

                                                { this.state.filterProject ? 
                                                <div id='filter-project'>
                                                    <section id="panel-send-date" style={{height: 'auto'}}>
                                                        <div id="send-date-module" className="clearfix">
                                                            <div>
                                                                <CheckboxGroup options={this.state.projectCheckboxOptions} value={this.state.checkedProjectList} onChange={this.onProjectOptionsChange}/>
                                                            </div>
                                                            <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterProject() } }>APPLY</a>
                                                                <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterProject() } }>CANCEL</a>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                                : null }
                                            </li>
                                            : null }
                                        
                                            <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                    <span className="listText">Filter by Survey and Collector</span>
                                                    { !this.state.filterSurveyCollector ? 
                                                    <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterSurveyCollector: true, filterProject: false }) } }>APPLY</span>
                                                    : null }
                                                </a>

                                                { this.state.filterSurveyCollector ? 
                                                <div id='filter-time-period'>
                                                    <section id="panel-send-date" style={{height: 'auto'}}>
                                                        <div id="send-date-module" className="clearfix">
                                                        {this.state.checkedKeys.length || this.state.filterSurveyCollector ? 
                                                        <Tree
                                                            checkable
                                                            onExpand={this.onExpand}
                                                            expandedKeys={this.state.expandedKeys}
                                                            autoExpandParent={this.state.autoExpandParent}
                                                            onCheck={this.onCheck}
                                                            checkedKeys={this.state.checkedKeys}
                                                            // onSelect={this.onSelect}
                                                            // selectedKeys={this.state.selectedKeys}
                                                        >
                                                            {this.renderTreeNodes(this.state.treeData)}
                                                        </Tree>
                                                        : 'No Survey Data' }
                                                            {/* <Tree
                                                                checkable
                                                                defaultExpandedKeys={['survey-1']}
                                                                // defaultSelectedKeys={['survey-1']}
                                                                defaultCheckedKeys={['collector-1']}
                                                                // showLine={true}
                                                                onSelect={this.onSelect}
                                                                onCheck={this.onCheck}
                                                            >
                                                                <TreeNode title="Survey 1" key="survey-1">
                                                                    <TreeNode title={`Collector 1`} key="collector-1" />
                                                                    <TreeNode title={`Collector 2`} key="collector-2" />
                                                                </TreeNode>
                                                                <TreeNode title="parent 1" key="0-0">
                                                                <TreeNode title="parent 1-0" key="0-0-0" disabled>
                                                                    <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                                                                    <TreeNode title="leaf" key="0-0-0-1" />
                                                                </TreeNode>
                                                                <TreeNode title="parent 1-1" key="0-0-1">
                                                                    <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
                                                                </TreeNode>
                                                                </TreeNode>
                                                            </Tree> */}
                                                            <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterSurveysCollectors() } }>APPLY</a>
                                                                <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterSurveysCollectors() } }>CANCEL</a>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                                : null }
                                            </li>

                                            {/* check if the survey has some collector to do a collecotr filter */}
                                            { this.state.collectorCheckboxOptions.length ? 
                                            <li className="c1 dta cta acc_question_types ui-draggable" style={{ cursor: 'default' }}>
                                                {/* <a href="# " style={{ cursor: 'default', paddingLeft: '0' }}>
                                                    <span className="listText">Filter by Collector</span>
                                                    { !this.state.filterCollector ? 
                                                    <span className="add wds-button wds-button--ghost-filled wds-button--tight" style={{ height: 'auto' }} onClick={ (e) => { e.preventDefault(); this.setState({ filterCollector: true }) } }>APPLY</span>
                                                    : null }
                                                </a> */}

                                                {/* { this.state.filterCollector ?  */}
                                                {/* <div id='filter-collector'>
                                                    <section id="panel-send-date" style={{height: 'auto'}}>
                                                        <div id="send-date-module" className="clearfix">
                                                            <div>
                                                                <CheckboxGroup options={this.state.collectorCheckboxOptions} value={this.state.checkedCollectorList} onChange={this.onCollectorOptionsChange}/>
                                                            </div>
                                                            <div className="btn-float-right" style={{ paddingTop: '15px' }}>
                                                                <a className="wds-button wds-button--primary wds-button--sm apply-btn " style={{ cursor: 'pointer' }} onClick={ (e) => { e.preventDefault(); this.applyFilterCollector() } }>APPLY</a>
                                                                <a className="wds-button wds-button--util wds-button--sm cancel-btn" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={ (e) => { e.preventDefault(); this.cancelFilterCollector() } }>CANCEL</a>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div> */}
                                                {/* : null } */}
                                            </li>
                                            : null }

                                        </ul>
                                    </div>
                                </section>
                            </div>

                        </div>
                    </aside>

                    {/* <Content className="dw-container" style={{ width: '1280px', marginTop: '50px', marginBottom: '50px'/*background: 'white'*/ }
                    {/* <Content className="dw-container" style={{ marginTop: '50px', marginBottom: '50px'/*background: 'white'*/ }
                    <Content className="live-preview-wrapper">

                        <Row gutter={[16, 16]}>
                            {/* <Col span={6} xs={24} sm={24} md={24} lg={24} xl={24}>
                                <h4 style={{ fontSize: '36px', color: 'black', textAlign: 'center' }}>Executive Report</h4>
                            </Col> */}
                            <Col span={6} xs={24} sm={24} md={24} lg={24} xl={24} className={ this.state.isMobile ? 'text-align-center' : '' }>
                                {/* <div className="sm-input sm-input--select sm-input--sm">
                                    <select id={"project-dropdown"} value={this.state.projectId} style={{ fontSize: '24px' }} className="no-touch" onChange={ (e) => this.setToProjectHandler(e) }></select>
                                </div>
                                <span className="reportDropdownDash" style={{ fontSize: '24px', fontWeight: 'bold', paddingRight: '15px', paddingLeft: '15px'}}> - </span> */}
                                {/* <div className="sm-input sm-input--select sm-input--sm">
                                    <select id={"touchpoint-dropdown"} value={this.state.touchpointId} style={{ fontSize: '24px' }} className="no-touch" onChange={ (e) => this.setToTouchpointHandler(e) }></select>
                                </div> */}
                                {/* <h4 style={{ fontSize: '28px', color: 'black' }}><span style={{marginRight: '15px', textDecoration: 'underline'}}>Project A</span> - <span style={{marginLeft: '15px', textDecoration: 'underline'}}>Sales</span></h4> */}
                            </Col>

                            <Col span={6} xs={24} sm={24} md={24} lg={24} xl={24} className={ this.state.display ? 'hidden' : ''} style={{ padding: '8px' }}>
                                <Empty style={{ backgroundColor: 'white', margin: '20px 0', padding: '150px 0 200px 0' }}/>
                            </Col>
                            
                            <div className={ this.state.display ? "" : 'hidden' } >
                                <Col span={6} xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card className="horizontal-score-chart-statistic-card dashboard-statistic-card" style={{ paddingTop: '0', paddingRight: '0', paddingLeft: '0' }}>
                                    <h4 className="overall-area-of-impact-score-title">Overall Area of Impact Score</h4>
                                        <div id="bullet-graph-list"></div>
                                        {/* <BulletGraph data={this.state.dataState[0]} height={100} padding={['60', '100', '60', '120']} nlocation={BulletGraphnLocation} yGap={1.6}/>
                                        <BulletGraph data={this.state.dataState[1]} height={100} padding={['60', '100', '60', '120']} nlocation={BulletGraphnLocation} yGap={1.6}/>
                                        <BulletGraph data={this.state.dataState[2]} height={100} padding={['60', '100', '60', '120']} nlocation={BulletGraphnLocation} yGap={1.6}/>
                                        <BulletGraph data={this.state.dataState[3]} height={100} padding={['60', '100', '60', '120']} nlocation={BulletGraphnLocation} yGap={1.6}/> */}
                                        {/* <BulletGraph data={this.state.dataState} height={870} padding={['80', '100', '50', '120']} nlocation={BulletGraphnLocation} yGap={-0.06}/> */}
                                    </Card>
                                </Col>
                                { (this.state.avgRating !== 'NaN' && this.state.avgRating !== '-NaN') &&
                                <Col span={6} xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Card className="dashboard-statistic-card">
                                        <h4 style={{ fontSize: '18px', color: 'black', textAlign: 'center', marginBottom: '10px' }}>Average Customer Satisfaction Score</h4>
                                        <Gauge title={this.state.AvgGaugeTitle} height={164} percent={ ( parseFloat(this.state.avgRating)*2 ) * 10 } color={ parseFloat(this.state.avgRating) <= 2 ? 'red' : parseFloat(this.state.avgRating) < 4 ? 'orange' : 'green' }/>
                                    </Card>
                                </Col>
                                }

                                { (this.state.avgNPS !== 'NaN' && this.state.avgNPS !== '-NaN') &&
                                <Col span={6} xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Card className="dashboard-statistic-card">
                                        <h4 style={{ fontSize: '18px', color: 'black', textAlign: 'center', marginBottom: '10px' }}>Overall Net Promoter Score</h4>
                                        <Gauge title={this.state.NPSGaugeTitle} height={164} percent={ parseFloat(this.state.avgNPS)*10 } color={ parseFloat(this.state.avgNPS) <= 4 ? 'red' : parseFloat(this.state.avgNPS) < 8 ? 'orange' : 'green' }/>
                                    </Card>
                                </Col>
                                }

                                <div id='area-of-impact-list'></div>

                            </div>
                        </Row>

                    </Content>
                </div>
            </div>
            
        );
    }
}
export default ExecutiveReport;