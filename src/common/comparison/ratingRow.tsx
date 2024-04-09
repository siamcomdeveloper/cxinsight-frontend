import React from 'react';
import 'antd/dist/antd.css';
import RatingMonthlyProjectsComparison from '../RatingMonthlyProjectsComparison';
import RatingYearlyProjectsComparison from '../RatingYearlyProjectsComparison';
import { Tabs, Table, Collapse } from 'antd';
import moment from 'moment';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import { History } from 'history';
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface IProps {
    question: any;  
    answer: any;
    defaultActiveKey: any;
    checkboxType: any,
    yearlyRangePicker: any;
    yearsValue: any;
    monthlyRangePicker: any;
    monthMode: any;
    monthsValue: any;
    diffYearsAbs: any,
    diffMonthsAbs: any,
    checkboxOptions: any,
    checkedList: any,
    // exportHandler: (defaultActiveKey: any, questionNo: any) => void;
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
    monthChartData: any;
    monthColumns: any;
    monthDataTable: any;
    yearChartData: any;
    yearColumns: any;
    yearDataTable: any;
    defaultActiveKey: any;
    checkboxOptions: any;
}

class RatingRow extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            monthChartData: [],
            monthColumns: [],
            monthDataTable: [],
            yearChartData: [],
            yearColumns: [],
            yearDataTable: [],
            checkboxOptions: [],
            defaultActiveKey: this.props.defaultActiveKey,
        };
    }

    public componentDidMount() { 
        try{
            // console.log('this.props.diffYearsAbs', this.props.diffYearsAbs);
            // console.log('this.props.yearsValue', this.props.yearsValue);
            // console.log('this.props.yearsValue[0]', this.props.yearsValue[0]);
            // console.log('this.props.yearsValue[1]', this.props.yearsValue[1]);
            // console.log('this.props.diffMonthsAbs', this.props.diffMonthsAbs);
            // console.log('this.props.monthsValue', this.props.monthsValue);
            // console.log('this.props.monthsValue[0]', this.props.monthsValue[0]);
            // console.log('this.props.monthsValue[1]', this.props.monthsValue[1]);
            
            const checkboxOptionsCopy = [...this.props.checkboxOptions];

            // console.log('checkboxOptions', this.props.checkboxOptions);
            // console.log('checkboxOptions.length', this.props.checkboxOptions.length);
            // console.log('checkboxOptionsCopy', checkboxOptionsCopy);
            // console.log('checkboxOptionsCopy.length', checkboxOptionsCopy.length);
            // console.log('checkedList', this.props.checkedList);
            // console.log('checkedList.length', this.props.checkedList.length);

            this.setState({ 
                checkboxOptions: checkboxOptionsCopy
            }, () => {

                // console.log('this.state.checkboxOptions', this.state.checkboxOptions);
                // console.log('this.state.checkboxOptions.length', this.state.checkboxOptions.length);

                //remove collecotor when the checkboxOptions not qual checkedList
                let removeCollectorindex = [] as any;
                if(this.state.checkboxOptions.length !== this.props.checkedList.length){
                    for(let i = 0; i < this.state.checkboxOptions.length; i++){
                        // console.log(`this.state.checkboxOptions[${i}].value`, this.state.checkboxOptions[i].value);
                        let foundCollector = false;
                        for(let j = 0; j < this.props.checkedList.length; j++){
                            // console.log(`this.props.checkedList[${j}]`, this.props.checkedList[j]);
                            if(parseInt(this.state.checkboxOptions[i].value) === parseInt(this.props.checkedList[j])) foundCollector = true;
                        }
                        // console.log('foundCollector', foundCollector);
                        // if(!foundCollector) this.state.checkboxOptions.splice(i, 1);
                        if(!foundCollector) removeCollectorindex.push(i);
                    }
                }
                // console.log('before this.state.checkboxOptions', this.state.checkboxOptions);

                //remove collector(s) with index which is in the list.
                const actvieCollector = this.state.checkboxOptions.filter((value: any, i: any) => !removeCollectorindex.includes(i))
                // console.log('actvieCollector', actvieCollector);

                this.setState({ 
                    checkboxOptions: actvieCollector
                }, () => {

                    // console.log('after this.state.checkboxOptions', this.state.checkboxOptions);

                    if(this.props.monthlyRangePicker){

                        const data = this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]);
                        const monthChartData = data[0];
                        const monthColumns = data[1];
                        const monthDataTable = data[2];

                        this.setState({ 
                            monthChartData: monthChartData,
                            monthColumns: monthColumns,
                            monthDataTable: monthDataTable
                        }); 
                    }
                    if(this.props.yearlyRangePicker){

                        const data = this.generateYearChartData(this.props.diffYearsAbs, [ this.props.yearsValue[0], this.props.yearsValue[1] ]);
                        const yearChartData = data[0];
                        const yearColumns = data[1];
                        const yearDataTable = data[2];

                        this.setState({ 
                            yearChartData: yearChartData,
                            yearColumns: yearColumns,
                            yearDataTable: yearDataTable
                        });
                    }
                });
                
            }); 
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison ratingRow componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    //Month Comparison Report
    generateMonthChartData = (diffMonthsAbs: any, monthsValue: any) => {
        try{
            //data chart
            const lastMonthsName = [] as any;
            const monthChildren = [] as any;

            for(let i = diffMonthsAbs; i > 0; i--){
                // console.log('i', i);
                const subMonth = moment(monthsValue[1]).subtract( moment.duration(i, 'months') );

                const lastMonthName = moment(subMonth).format('MMM YYYY');
                // console.log('lastMonthName', lastMonthName);
                lastMonthsName.push(lastMonthName);
                monthChildren.push(
                    {
                        title: lastMonthName,
                        dataIndex: lastMonthName,
                        key: `${i}`,
                        // width: 20,
                    }
                );
            }

            const lastMonthName = moment(monthsValue[1]).format('MMM YYYY');
            // console.log('lastMonthName', lastMonthName);
            lastMonthsName.push(lastMonthName);
            monthChildren.push(
                {
                    title: lastMonthName,
                    dataIndex: lastMonthName,
                    key: `${monthChildren.length+1}`,
                    // width: 20,
                }
            );

            // console.log('lastMonthsName', lastMonthsName);
            
            // console.log('this.props.answer.recordset', this.props.answer.recordset);
            // console.log('this.props.answer.recordset.length', this.props.answer.recordset.length);

            // const sumArr = new Array<any>(lastMonthsName.length);
            // const countArr = new Array<any>(lastMonthsName.length);
            // for(let i = 0; i < sumArr.length; i++) { sumArr[i] = 0; }
            // for(let i = 0; i < countArr.length; i++) { countArr[i] = 0; }

            //initilize 1D array elements.
            let sumArr = new Array(lastMonthsName.length); 
            let countArr = new Array(lastMonthsName.length); 
            for (let i = 0; i < lastMonthsName.length; i++) { 
                sumArr[i] = []; 
                countArr[i] = []; 
            } 

            // Loop to initilize 2D array elements. 
            for (let i = 0; i < lastMonthsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    sumArr[i][j] = 0; 
                    countArr[i][j] = 0; 
                } 
            } 

            this.props.answer.recordset[1].map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} collector_id[0]`, answerObj.collector_id[0]);
                if(!answerObj.skip_status){
                    const answerMonthName = moment(answerObj.created_at[0]).format('MMM YYYY');
                    // console.log(`answerObj index ${index} answerMonthName`, answerMonthName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    
                    //lop anwerMonth match with range month
                    lastMonthsName.map((MonthName: any, i: any) => { 
                        // console.log(`MonthName ${MonthName} answerMonthName ${answerMonthName}`);
                        if(answerMonthName === MonthName){
                            // console.log(`answerObj index ${index} collector_id[0]`, answerObj.collector_id[0]);
                            //loop answer collector id matchs with collector Checkbox Option id
                            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {
                                // console.log(`collectorCheckboxOption`, collectorCheckboxOption);
                                const collectorCheckboxOptionId = collectorCheckboxOption.value;
                                const checkboxId = this.props.checkboxType === 'collector' ? answerObj.collector_id[0] : answerObj.project_id[0];
                                if(parseInt(collectorCheckboxOptionId) === parseInt(checkboxId)){
                                    // console.log(`in if collectorCheckboxOptionId ${collectorCheckboxOptionId} answerObj.collector_id[0] ${answerObj.collector_id[0]}`);
                                    sumArr[i][j] += answerObj.answer;
                                    countArr[i][j] += 1;
                                }
                            });
                        }
                    });
                    
                }

            });

            // console.log('after sumArr', sumArr);
            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let chartData = [] as any;
            const monthDataTable = [] as any;

            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {
                // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                // console.log(`collectorCheckboxOption`, collectorCheckboxOption);
                // const collectorCheckboxOptionLabel = collectorCheckboxOption.label;
                // console.log(`collectorCheckboxOptionLabel`, collectorCheckboxOptionLabel);
                let chartDataForTable = [] as any;
                for(let i = 0; i <= diffMonthsAbs; i++){
                    // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                    // console.log(`lastMonthsName[${i}]`, lastMonthsName[i]);
                    const calAvg = (sumArr[i][j] / countArr[i][j]);
                    const avgScore = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                    const avgScoreForTable = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                    // console.log(`avgScore`, avgScore);
        
                    const avgScoreFloat = parseFloat(avgScore);
                    // console.log(`avgScoreFloat`, avgScoreFloat);

                    chartData.push({
                        month: `${lastMonthsName[i]}`,
                        score: avgScoreFloat,
                        N: countArr[i][j],
                        label: collectorCheckboxOption.label
                    });

                    chartDataForTable.push({
                        month: `${lastMonthsName[i]}`,
                        score: avgScoreForTable,
                        N: countArr[i][j],
                    });
                }

                monthDataTable.push({
                    key: j,
                    name: collectorCheckboxOption.label,
                });
                // console.log('monthDataTable', monthDataTable);

                // console.log('chartDataForTable', chartDataForTable);
                // console.log('chartDataForTable.length', chartDataForTable.length);
                // console.log('monthDataTable[monthDataTable.length-1]', monthDataTable[monthDataTable.length-1]);

                for(let i = 0; i < chartDataForTable.length; i++){
                    // console.log(`chartDataForTable[${i}].month`, chartDataForTable[i].month);

                    // console.log(`monthDataTable[monthDataTable.length-1][${chartDataForTable[i].month}]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`]);
                    monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`] = `${chartDataForTable[i].score}\n(N = ${chartDataForTable[i].N})`;
                    // console.log(`after monthDataTable[${chartDataForTable[i].month}]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`]);
                }

                // console.log('after monthDataTable', monthDataTable);
            });
                
            // console.log('chartData', chartData);
            // console.log('monthDataTable', monthDataTable);

            const monthColumns = [
                {
                title: this.props.checkboxType === 'collector' ? 'Collector Name' : 'Project Name',
                //   width: 30,
                dataIndex: 'name',
                key: 'name',
                },
                {
                    title: 'Month',
                    children: monthChildren
                }
            ];
            
            return [chartData, monthColumns, monthDataTable];

        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison ratingRow generateMonthChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return [null, null, null];
        }
    }

    //Year Comparison Report
    generateYearChartData = (diffYearsAbs: any, yearsValue: any) => {
        try{
            //data chart
            const lastYearsName = [] as any;
            const yearChildren = [] as any;

            for(let i = 0; i <= diffYearsAbs; i++){
                // console.log('i', i);
                const lastYearName = parseInt(yearsValue[0])+i;
                // console.log('lastYearName', lastYearName);
                lastYearsName.push(lastYearName);
                yearChildren.push(
                    {
                        title: lastYearName,
                        dataIndex: lastYearName,
                        key: `${i}`,
                        width: 20,
                    }
                );
            }

            // console.log('lastYearName', lastYearsName);

            //initilize 1D array elements.
            let sumArr = new Array(lastYearsName.length); 
            let countArr = new Array(lastYearsName.length); 
            for (let i = 0; i < lastYearsName.length; i++) { 
                sumArr[i] = []; 
                countArr[i] = []; 
            } 

            // Loop to initilize 2D array elements. 
            for (let i = 0; i < lastYearsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    sumArr[i][j] = 0; 
                    countArr[i][j] = 0; 
                } 
            } 

            this.props.answer.recordset[1].map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} collector_id[0]`, answerObj.collector_id[0]);
                if(!answerObj.skip_status){
                    const answerYearName = moment(answerObj.created_at[0]).format('YYYY');
                    // console.log(`answerObj index ${index} answerYearName`, answerYearName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    
                    //lop anwerYear match with range year
                    lastYearsName.map((YearName: any, i: any) => { 
                        // console.log(`YearName ${YearName} answerYearName ${answerYearName}`);
                        if(parseInt(answerYearName) === parseInt(YearName)){
                            // console.log(`answerObj index ${index} collector_id[0]`, answerObj.collector_id[0]);
                            //loop answer collector id matchs with collector Checkbox Option id
                            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {
                                const collectorCheckboxOptionId = collectorCheckboxOption.value;
                                // console.log(`collectorCheckboxOptionId`, collectorCheckboxOptionId);
                                const checkboxId = this.props.checkboxType === 'collector' ? answerObj.collector_id[0] : answerObj.project_id[0];
                                if(parseInt(collectorCheckboxOptionId) === parseInt(checkboxId)){
                                    // console.log(`in if collectorCheckboxOptionId ${collectorCheckboxOptionId} answerObj.collector_id[0] ${answerObj.collector_id[0]}`);
                                    sumArr[i][j] += answerObj.answer;
                                    countArr[i][j] += 1;
                                }
                            });
                            return;
                        }
                    });
                    
                }

            });

            // console.log('after sumArr', sumArr);
            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let chartData = [] as any;
            const yearDataTable = [] as any;
            // for (let i = 0; i < 10; i++) {
            //     yearDataTable.push({
            //         key: i,
            //         name: `Collector ${i}`,
            //         2020: i+20,
            //         2019: i+19,
            //         2018: i+18,
            //         2017: i+17,
            //         2016: i+16,
            //     });
            // }
        
            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {

                let chartDataForTable = [] as any;
                for(let i = 0; i <= diffYearsAbs; i++){
                    // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                    // console.log(`lastYearsName[${i}]`, lastYearsName[i]);
                    // console.log(`sumArr[${i}][${j}]`, sumArr[i][j]);
                    // console.log(`countArr[${i}][${j}]`, countArr[i][j]);
                    // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                    // console.log(`collectorCheckboxOption`, collectorCheckboxOption);
                    // const collectorCheckboxOptionLabel = collectorCheckboxOption.label;
                    // console.log(`collectorCheckboxOptionLabel`, collectorCheckboxOptionLabel);
                    const calAvg = (sumArr[i][j] / countArr[i][j]);
                    const avgScore = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                    const avgScoreForTable = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                    // console.log(`avgScore`, avgScore);
        
                    const avgScoreFloat = parseFloat(avgScore);
                    // console.log(`avgScoreFloat`, avgScoreFloat);

                    chartData.push({
                        year: `${lastYearsName[i]}`,
                        score: avgScoreFloat,
                        N: countArr[i][j],
                        label: collectorCheckboxOption.label
                    });

                    chartDataForTable.push({
                        year: `${lastYearsName[i]}`,
                        score: avgScoreForTable,
                        N: countArr[i][j],
                    });
                }

                yearDataTable.push({
                    key: j,
                    name: collectorCheckboxOption.label,
                });
                // console.log('yearDataTable', yearDataTable);

                // console.log('chartDataForTable', chartDataForTable);
                // console.log('chartDataForTable.length', chartDataForTable.length);
                // console.log('yearDataTable[yearDataTable.length-1]', yearDataTable[yearDataTable.length-1]);

                for(let i = 0; i < chartDataForTable.length; i++){
                    // console.log(`chartDataForTable[${i}].year`, chartDataForTable[i].year);

                    // console.log(`yearDataTable[yearDataTable.length-1][${chartDataForTable[i].year}]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`]);
                    yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`] = `${chartDataForTable[i].score} (N = ${chartDataForTable[i].N})`;
                    // console.log(`after yearDataTable[${chartDataForTable[i].year}]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`]);
                }

                // console.log('after yearDataTable', yearDataTable);

            });

            // console.log('chartData', chartData);
            // console.log('yearDataTable', yearDataTable);

            const yearColumns = [
                {
                title: this.props.checkboxType === 'collector' ? 'Collector Name' : 'Project Name',
                width: 30,
                dataIndex: 'name',
                key: 'name',
                },
                {
                    title: 'Year',
                    children: yearChildren
                }
            ];
            
            return [chartData, yearColumns, yearDataTable];
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison ratingRow generateYearChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return [null, null, null];
        }
    }
    
    tabsCallback(key: any) {
        try{
            // console.log('tabsCallback key', key);
            // console.log('tabsCallback yearChartData', this.state.yearChartData);
            // console.log('tabsCallback yearChartData.length', this.state.yearChartData.length);
            
            if(key === 'monthly' && this.state.monthChartData.length === 0 && !this.props.monthlyRangePicker){
                const current = moment();
                const endMonth = current.format('YYYY/MM');
                // console.log('endMonth', endMonth);

                const last11Months = moment().subtract( moment.duration(11, 'months') );
                // console.log('last11Months', last11Months);
                
                const startMonth = moment(last11Months).format('YYYY/MM');
                
                const data = this.generateMonthChartData(11, [ moment(startMonth, 'YYYY/MM'), moment(endMonth, 'YYYY/MM') ]);
                // console.log('data', data);

                const monthChartData = data[0];
                const monthColumns = data[1];
                const monthDataTable = data[2];
                // console.log('monthChartData', monthChartData);
                // console.log('monthColumns', monthColumns);
                // console.log('monthDataTable', monthDataTable);

                this.setState({ 
                    defaultActiveKey: 'monthly',
                    monthChartData: monthChartData,
                    monthColumns: monthColumns,
                    monthDataTable: monthDataTable
                });

                // this.setState({ 
                //     defaultActiveKey: 'monthly',
                //     monthChartData: this.generateMonthChartData(11, [ moment(startMonth, 'YYYY/MM'), moment(endMonth, 'YYYY/MM') ]),
                // });
            }
            else if(key === 'yearly' && this.state.yearChartData.length === 0 && !this.props.yearlyRangePicker){
                const current = moment();
                const endYear = current.format('YYYY');
                // console.log('endYear', endYear);

                const lastyears = moment().subtract( moment.duration(4, 'years') );
                // console.log('lastyears', lastyears);
                
                const startYear = moment(lastyears).format('YYYY');
                // console.log('startYear', startYear);
                
                const data = this.generateYearChartData(4, [ this.props.yearsValue[0], this.props.yearsValue[1] ]);
                // console.log('data', data);

                const yearChartData = data[0];
                const yearColumns = data[1];
                const yearDataTable = data[2];
                // console.log('yearChartData', yearChartData);
                // console.log('yearColumns', yearColumns);
                // console.log('yearDataTable', yearDataTable);

                this.setState({ 
                    defaultActiveKey: 'yearly',
                    yearChartData: yearChartData,
                    yearColumns: yearColumns,
                    yearDataTable: yearDataTable
                });
                
                // this.setState({ 
                //     defaultActiveKey: 'yearly',
                //     yearChartData: this.generateYearChartData(4, [ moment(startYear, 'YYYY').format('YYYY'), moment(endYear, 'YYYY').format('YYYY') ])
                // });
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison ratingRow tabsCallback catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {

        return (

            <div className="sm-question-view clearfix sm-corner-a " sm-question-id="438586089" view-role="summaryQuestionViewContainer">

                <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                <span className="sm-question-number txt-shadow-lt">Q{this.props.question.no} : Rating {this.props.question.departmentMatchedWithFilterName ? `(KPI for ${this.props.question.departmentMatchedWithFilterName} Department)`: ''} {this.props.question.areaOfImpactMatchedWithFilterName ? `(Area of impact for ${this.props.question.areaOfImpactMatchedWithFilterName})`: ''}</span>
                    <div className="sm-question-btns clearfix">
                    {/* <span className="sm-float-r"><a href="#" className="wds-button wds-button--util-light wds-button--sm action-menu" onClick={(e) => this.props.exportHandler(this.state.defaultActiveKey, this.props.question.no)}>Export</a></span> */}
                        {/* <div className="sm-float-r">
                            <a href="#" customize-btn="" full-access-only="" className="wds-button wds-button--util-light wds-button--sm">Customize</a>
                        </div> */}
                    </div>
                </div>
                
                <div sm-questionview-content="" className="sm-questionview-content " view-role="summaryMatrixRatingQuestionView" style={{ minHeight: '407px'}}>
                    <h1 question-heading="" className="sm-questiontitle" title="">{this.props.question.label}</h1>

                    <Tabs style={{ marginTop: '20px' }} onChange={this.tabsCallback.bind(this)} type="card" defaultActiveKey={this.props.defaultActiveKey}>
                        <TabPane tab="Monthly Comparison Report" key="monthly">
                            <div className="monthly-comparison-report">
                                <div className="monthly-comparison-report-container">
                                    <div className="sm-chart">
                                        <RatingMonthlyProjectsComparison height={400} data={this.state.monthChartData} padding={['20', '40', '150', '60']} rotate={30} disable={ false }/>
                                    </div>
                                    {/* <Collapse accordion>
                                        <Panel header="Monthly Comparison Data Table" key="monthly-data-table">
                                            <Table style={{ whiteSpace: 'break-spaces'}} columns={this.state.monthColumns} dataSource={this.state.monthDataTable} scroll={{ x: 'max-content', y: 'max-content' }} pagination={{ total: this.state.monthDataTable.length, pageSize: this.state.monthDataTable.length, hideOnSinglePage: true }} size="middle" bordered/>
                                        </Panel>
                                    </Collapse> */}
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Yearly Comparison Report" key="yearly">
                            <div className="yearly-comparison-report">
                                <div className="yearly-comparison-report-container">
                                    <div className="sm-chart">
                                        <RatingYearlyProjectsComparison height={400} data={this.state.yearChartData} padding={['20', '80', '170', '60']} rotate={30} disable={ false }/>
                                    </div>
                                    <Collapse accordion>
                                        <Panel header="Yearly Comparison Data Table" key="yearly-data-table">
                                            <Table style={{ whiteSpace: 'break-spaces'}} columns={this.state.yearColumns} dataSource={this.state.yearDataTable} scroll={{ x: 'max-content', y: 'max-content' }} pagination={{ total: this.state.yearDataTable.length, pageSize: this.state.yearDataTable.length, hideOnSinglePage: true }} size="middle" bordered/>
                                        </Panel>
                                    </Collapse>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
};
export default RatingRow;