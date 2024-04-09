import React from 'react';
import 'antd/dist/antd.css';
import HorizontalCompareChart from '../HorizontalCompareChart';
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

class CheckboxRow extends React.Component<IProps, IState> { 
    
    constructor(props: IProps) {
        super(props);
        this.state = { 
            monthChartData: '',
            monthColumns: [],
            monthDataTable: [],
            yearChartData: '',
            yearColumns: [],
            yearDataTable: [],
            checkboxOptions: [],
            defaultActiveKey: this.props.defaultActiveKey,
        };
    }

    public componentDidMount() { 
        try{
            // console.log('componentDidMount()');

            const checkboxOptionsCopy = [...this.props.checkboxOptions];
            this.setState({ 
                checkboxOptions: checkboxOptionsCopy
            }, () => {

                // console.log('after setState');

                //remove a option(s) when the checkboxOptions length is not qual checkedList
                if(this.state.checkboxOptions.length !== this.props.checkedList.length){
                    for(let i = 0; i < this.state.checkboxOptions.length; i++){
                        let foundOption = false;
                        for(let j = 0; j < this.props.checkedList.length; j++){
                            if(parseInt(this.state.checkboxOptions[i].value) === parseInt(this.props.checkedList[j])) foundOption = true;
                        }
                        if(!foundOption) this.state.checkboxOptions.splice(i, 1);
                    }
                }

                if(this.props.monthlyRangePicker){
                    // console.log('this.generateMonthChartData', this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]));
                    // this.setState({ monthChartData: this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]) });
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
                    // console.log('this.generateYearChartData', this.generateYearChartData(this.props.diffYearsAbs, [ this.props.yearsValue[0], this.props.yearsValue[1] ]));
                    // this.setState({ yearChartData: this.generateYearChartData(this.props.diffYearsAbs, [ this.props.yearsValue[0], this.props.yearsValue[1] ]) });
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
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison checkboxRow componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                        // dataIndex: lastMonthName,
                        // key: lastMonthName,
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
                    // dataIndex: lastMonthName,
                    // key: lastMonthName,
                    // width: 20,
                }
            );

            // console.log('lastMonthsName', lastMonthsName);
            
            // console.log('this.props.answer.recordset', this.props.answer.recordset);
            // console.log('this.props.answer.recordset.length', this.props.answer.recordset.length);

            //initilize 1D array elements.
            let countArr = new Array(lastMonthsName.length); 
            for (let i = 0; i < countArr.length; i++) { 
                countArr[i] = []; 
            } 

            // Loop to initilize 2D array elements. 
            for (let i = 0; i < lastMonthsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    countArr[i][j] = [];
                } 
            } 

            // Loop to initilize 3D array elements. 
            for (let i = 0; i < lastMonthsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    for (let k = 0; k < this.props.question.choices.length; k++) { 
                        countArr[i][j][k] = 0; 
                    } 
                }
            } 
            // console.log('countArr', countArr);

            this.props.answer.recordset[1].map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} created_at[0]`, answerObj.created_at[0]);
                if(answerObj.answer && !answerObj.skip_status){
                    const answerMonthName = moment(answerObj.created_at[0]).format('MMM YYYY');
                    // console.log(`answerObj index ${index} answerMonthName`, answerMonthName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    //console.log(`answer ${j}`, answer);//lop anwerMonth match with range month
                    lastMonthsName.map((MonthName: any, i: any) => { 
                        // console.log(`MonthName`, MonthName);
                        if(answerMonthName === MonthName){
                            //loop answer weigth matchs with choice weight
                            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {
                                const collectorCheckboxOptionId = collectorCheckboxOption.value;
                                // console.log(`collectorCheckboxOptionId`, collectorCheckboxOptionId);

                                const checkboxId = this.props.checkboxType === 'collector' ? answerObj.collector_id[0] : answerObj.project_id[0];

                                if(parseInt(collectorCheckboxOptionId) === parseInt(checkboxId)){
                                    const answers = answerObj.answer.includes(',') ?  answerObj.answer.split(',') : [answerObj.answer];
                                    answers.map((answer: any) => {
                                        this.props.question.weights.map((weight: any, k: any) => {
                                            // console.log(`weight`, weight);
                                            if(parseInt(weight) === parseInt(answer)){
                                                // console.log(`in if weight ${weight} answerObj.answer ${answerObj.answer}`);
                                                // console.log(`in if answerMonthName ${answerMonthName} MonthName ${MonthName}`);
                                                // console.log(`beforecountArr[${i}][${j}]`, countArr[i][j]);
                                                countArr[i][j][k] += 1;
                                                // console.log(`after countArr[${i}][${j}]`, countArr[i][j]);
                                            }// if weight = answerObj.answer
                                        });//loop question.weights
                                    });//loop answers
                                    return;
                                }//if collectorCheckboxOptionId = answerObj.collector_id ?
                            });//loop answer collector id
                        }//if answerMonthName = MonthName ?
                    });//loop lastMonthsName
                }//if !answerObj.skip_status
            });//loop answers

            // console.log('after countArr', countArr);
            
            let dataTableN = [] as any;
            for(let i = 0; i <= diffMonthsAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`lastMonthsName[${i}]`, lastMonthsName[i]);
                this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {
                    this.props.question.choices.map((choice: any, k: any) => {
                        // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                        dataTableN.push(countArr[i][j][k]);
                    });
                });
            }
            // console.log('dataTableN', dataTableN);

            //Data Table
            const monthDataTable = [] as any;
            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {

                let chartDataForTable = [] as any;
                let countAllDataForTable = [] as any;
                for(let i = 0; i <= diffMonthsAbs; i++){
                    // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                    // console.log(`lastYearsName[${i}]`, lastYearsName[i]);
                    const choiceChildren = [] as any;
                    let countAll = 0;
                    this.props.question.choices.map((choice: any, k: any) => {
                        // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                        // dataTableN.push(countArr[i][j][k]);
                        chartDataForTable.push({
                            month: `${lastMonthsName[i]}`,
                            monthIndex: i,
                            N: countArr[i][j][k],
                            Nname: `${lastMonthsName[i]}_${choice}_N`,
                            Pname: `${lastMonthsName[i]}_${choice}_%`
                        });

                        countAll += countArr[i][j][k];

                        choiceChildren.push(
                            {
                                title: `${choice}`,
                                // dataIndex: `${lastMonthsName[i]}_${choice}`,
                                // key: `${lastMonthsName[i]}_${choice}`
                                // width: 50,
                                children: [
                                    {
                                    title: 'N',
                                    dataIndex: `${chartDataForTable[chartDataForTable.length-1].month}_${choice}_N`,
                                    key: `${chartDataForTable[chartDataForTable.length-1].month}_${choice}_N`,
                                    },
                                    {
                                    title: '%',
                                    dataIndex: `${chartDataForTable[chartDataForTable.length-1].month}_${choice}_%`,
                                    key: `${chartDataForTable[chartDataForTable.length-1].month}_${choice}_%`,
                                    },
                                ],
                            }
                        );
                    });
                    countAllDataForTable.push(countAll);
                    monthChildren[i][`children`] = choiceChildren;
                    // monthChildren[i][`${choice}`] = choiceChildren;
                    // console.log('after monthChildren', monthChildren);
                    // console.log('after countAllDataForTable', countAllDataForTable);
                }
                // console.log('after all monthChildren', monthChildren);
                // console.log('after all countAllDataForTable', countAllDataForTable);

                monthDataTable.push({
                    key: j,
                    name: collectorCheckboxOption.label,
                });
                // console.log('monthDataTable', monthDataTable);

                // console.log('chartDataForTable', chartDataForTable);
                // console.log('chartDataForTable.length', chartDataForTable.length);
                // console.log('monthDataTable', monthDataTable);
                // console.log('monthDataTable[monthDataTable.length-1]', monthDataTable[monthDataTable.length-1]);

                const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
                const af = new Intl.NumberFormat('en-IN', avgFormatAvg);

                for(let i = 0; i < chartDataForTable.length; i++){
                    // monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`] = [];
                    // this.props.question.choices.map((choice: any) => {
                    //     // console.log(`monthDataTable[${monthDataTable.length-1}][${chartDataForTable[i].month}]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`]);

                    //     console.log(`------------------------${choice}-----------------------------`);
                    //     console.log(`chartDataForTable[${i}].month`, chartDataForTable[i].month);
                    //     console.log(`chartDataForTable[${i}].N`, chartDataForTable[i].N);

                    //     console.log(`monthDataTable[${monthDataTable.length-1}]`, monthDataTable[monthDataTable.length-1]);
                    //     console.log('${chartDataForTable[i].month}_${choice}_N', `${chartDataForTable[i].month}_${choice}_N`);
                    //     console.log('${chartDataForTable[i].month}_${choice}_%', `${chartDataForTable[i].month}_${choice}_%`);

                    monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].Nname}`] = `${chartDataForTable[i].N}`;

                    // console.log(`countAllDataForTable[${chartDataForTable[i].monthIndex}]`, countAllDataForTable[chartDataForTable[i].monthIndex]);
                    const calPercent = ( chartDataForTable[i].N / countAllDataForTable[chartDataForTable[i].monthIndex] ) * 100;
                    const strPercent = isNaN(calPercent) ? af.format(0) : af.format(calPercent);
                    monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].Pname}`] = strPercent;

                    //     console.log(`monthDataTable[${monthDataTable.length-1}][${chartDataForTable[i].month}_${choice}_N]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}_${choice}_N`]);
                    //     console.log(`monthDataTable[${monthDataTable.length-1}][${chartDataForTable[i].month}_${choice}_%]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}_${choice}_%`]);
                    //     // console.log(`after monthDataTable[${chartDataForTable[i].month}]`, monthDataTable[monthDataTable.length-1][`${chartDataForTable[i].month}`]);
                    //     console.log(`--------------------------------------------------------------`);
                    // });
                }

                // console.log('monthDataTable', monthDataTable);
            });
            // console.log('after all monthDataTable', monthDataTable);

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
            
            const dataTable = [] as any;
            this.state.checkboxOptions.map((collector: any, j: any) => {
                // console.log(`collector`, collector);
                dataTable.push(collector.label);
            });
            // console.log('after dataTable', dataTable);

            // return { time: lastMonthsName, projects: dataTable, choices: this.props.question.choices, N: dataTableN };
            const chartData = { time: lastMonthsName, projects: dataTable, choices: this.props.question.choices, N: dataTableN };

            return [chartData, monthColumns, monthDataTable];
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison checkboxRow generateMonthChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                lastYearsName.push(lastYearName.toString());
                yearChildren.push(
                    {
                        title: lastYearName,
                        // dataIndex: lastYearName,
                        // key: `${i}`,
                        // width: 20,
                    }
                );
            }
            // console.log('lastYearsName', lastYearsName);
            
            // console.log('this.props.answer.recordset', this.props.answer.recordset);
            // console.log('this.props.answer.recordset.length', this.props.answer.recordset.length);

            //initilize 1D array elements.
            let countArr = new Array(lastYearsName.length); 
            for (let i = 0; i < countArr.length; i++) { 
                countArr[i] = []; 
            } 

            // Loop to initilize 2D array elements. 
            for (let i = 0; i < lastYearsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    countArr[i][j] = []; 
                } 
            } 

            // Loop to initilize 3D array elements. 
            for (let i = 0; i < lastYearsName.length; i++) { 
                for (let j = 0; j < this.state.checkboxOptions.length; j++) { 
                    for (let k = 0; k < this.props.question.choices.length; k++) { 
                        countArr[i][j][k] = 0; 
                    } 
                }
            }
            
            // console.log('countArr', countArr);

            // const yearlyRecordset = this.props.yearlyRangePicker ? this.props.answer.recordset[0] : this.props.answer.recordset[1];

            // // console.log('yearlyRecordset', yearlyRecordset);
            // // console.log('yearlyRecordset.length', yearlyRecordset.length);

            // yearlyRecordset.map((answerObj: any, index: any) => {
            //     // console.log(`answerObj index ${index}`, answerObj);
            //     // console.log(`answerObj index ${index} created_at[0]`, answerObj.created_at[0]);

            //     if(answerObj.answer && !answerObj.skip_status){
            //         const answerYearName = moment(answerObj.created_at[0]).format('DD MMM YYYY');
            //         // console.log(`answerObj index ${index} answerYearName`, answerYearName);
            //         // console.log(`answerObj index ${index} answer`, answerObj.answer);
            //         const answers = answerObj.answer.includes(',') ?  answerObj.answer.split(',') : [answerObj.answer];
            //         answers.map((answer: any) => {
            //             //console.log(`answer ${j}`, answer);
            //             //loop answer weigth matchs with choice weight
            //             this.props.question.weights.map((weight: any, j: any) => {
            //                 // console.log(`weight`, weight);
            //                 if(parseInt(weight) === parseInt(answer)){
            //                     // console.log(`in if weight ${weight} answerObj.answer ${answerObj.answer}`);
                                
            //                     //lop anwerYear match with range year
            //                     lastYearsName.map((YearName: any, i: any) => { 
            //                         // console.log(`YearName`, YearName);
            //                         if(answerYearName === YearName){
            //                             // console.log(`in if answerYearName ${answerYearName} YearName ${YearName}`);
            //                             // console.log(`beforecountArr[${i}][${j}]`, countArr[i][j]);
            //                             countArr[i][j] = countArr[i][j]+1;
            //                             // console.log(`after countArr[${i}][${j}]`, countArr[i][j]);
            //                         }
            //                     });

            //                 }
            //             });

            //         });
            //     }

            // });

            this.props.answer.recordset[1].map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} collector_id[0]`, answerObj.collector_id[0]);
                if(!answerObj.skip_status){
                    const answerYearName = moment(answerObj.created_at[0]).format('YYYY');
                    // console.log(`answerObj index ${index} answerYearName`, answerYearName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    
                    //loop anwerYear match with range year
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
                                    const answers = answerObj.answer.includes(',') ?  answerObj.answer.split(',') : [answerObj.answer];
                                    answers.map((answer: any) => {
                                        this.props.question.weights.map((weight: any, k: any) => {
                                            // console.log(`weight`, weight);
                                            if(parseInt(weight) === parseInt(answer)){
                                                // console.log(`in if weight ${weight} answerO
                                                countArr[i][j][k] += 1;
                                            }// if weight = answerObj.answer

                                        })//loop question.weights
                                    });

                                    return;
                                }//if collectorCheckboxOptionId = answerObj.collector_id ?

                            });//loop answer collector id

                        }//if answerYearName) = YearName ?
                        
                    });//loop anwerYear
                    
                }//if !answerObj.skip_status

            });//loop answers
            // console.log('after countArr', countArr);
            
            let dataTableN = [] as any;
            for(let i = 0; i <= diffYearsAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`lastYearsName[${i}]`, lastYearsName[i]);
                this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {

                    this.props.question.choices.map((choice: any, k: any) => {
                        // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                        dataTableN.push(countArr[i][j][k]);
                    });

                });
                
            }
            // console.log('dataTableN', dataTableN);
            
            //Data Table
            const yearDataTable = [] as any;
            this.state.checkboxOptions.map((collectorCheckboxOption: any, j: any) => {

                let chartDataForTable = [] as any;
                let countAllDataForTable = [] as any;
                for(let i = 0; i <= diffYearsAbs; i++){
                    // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                    // console.log(`lastYearsName[${i}]`, lastYearsName[i]);
                    const choiceChildren = [] as any;
                    let countAll = 0;
                    this.props.question.choices.map((choice: any, k: any) => {
                        // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                        // dataTableN.push(countArr[i][j][k]);
                        chartDataForTable.push({
                            year: `${lastYearsName[i]}`,
                            yearIndex: i,
                            N: countArr[i][j][k],
                            Nname: `${lastYearsName[i]}_${choice}_N`,
                            Pname: `${lastYearsName[i]}_${choice}_%`
                        });

                        countAll += countArr[i][j][k];

                        choiceChildren.push(
                            {
                                title: `${choice}`,
                                // dataIndex: `${lastYearsName[i]}_${choice}`,
                                // key: `${lastYearsName[i]}_${choice}`
                                // width: 50,
                                children: [
                                    {
                                    title: 'N',
                                    dataIndex: `${chartDataForTable[chartDataForTable.length-1].year}_${choice}_N`,
                                    key: `${chartDataForTable[chartDataForTable.length-1].year}_${choice}_N`,
                                    },
                                    {
                                    title: '%',
                                    dataIndex: `${chartDataForTable[chartDataForTable.length-1].year}_${choice}_%`,
                                    key: `${chartDataForTable[chartDataForTable.length-1].year}_${choice}_%`,
                                    },
                                ],
                            }
                        );
                    });
                    countAllDataForTable.push(countAll);
                    yearChildren[i][`children`] = choiceChildren;
                    // yearChildren[i][`${choice}`] = choiceChildren;
                    // console.log('after yearChildren', yearChildren);
                    // console.log('after countAllDataForTable', countAllDataForTable);
                }
                // console.log('after all yearChildren', yearChildren);
                // console.log('after all countAllDataForTable', countAllDataForTable);

                yearDataTable.push({
                    key: j,
                    name: collectorCheckboxOption.label,
                });
                // console.log('yearDataTable', yearDataTable);

                // console.log('chartDataForTable', chartDataForTable);
                // console.log('chartDataForTable.length', chartDataForTable.length);
                // console.log('yearDataTable', yearDataTable);
                // console.log('yearDataTable[yearDataTable.length-1]', yearDataTable[yearDataTable.length-1]);

                const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
                const af = new Intl.NumberFormat('en-IN', avgFormatAvg);

                for(let i = 0; i < chartDataForTable.length; i++){
                    // yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`] = [];
                    // this.props.question.choices.map((choice: any) => {
                    //     // console.log(`yearDataTable[${yearDataTable.length-1}][${chartDataForTable[i].year}]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`]);

                    //     console.log(`------------------------${choice}-----------------------------`);
                    //     console.log(`chartDataForTable[${i}].year`, chartDataForTable[i].year);
                    //     console.log(`chartDataForTable[${i}].N`, chartDataForTable[i].N);

                    //     console.log(`yearDataTable[${yearDataTable.length-1}]`, yearDataTable[yearDataTable.length-1]);
                    //     console.log('${chartDataForTable[i].year}_${choice}_N', `${chartDataForTable[i].year}_${choice}_N`);
                    //     console.log('${chartDataForTable[i].year}_${choice}_%', `${chartDataForTable[i].year}_${choice}_%`);

                    yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].Nname}`] = `${chartDataForTable[i].N}`;

                    // console.log(`countAllDataForTable[${chartDataForTable[i].yearIndex}]`, countAllDataForTable[chartDataForTable[i].yearIndex]);
                    const calPercent = ( chartDataForTable[i].N / countAllDataForTable[chartDataForTable[i].yearIndex] ) * 100;
                    const strPercent = isNaN(calPercent) ? af.format(0) : af.format(calPercent);
                    yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].Pname}`] = strPercent;

                    //     console.log(`yearDataTable[${yearDataTable.length-1}][${chartDataForTable[i].year}_${choice}_N]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}_${choice}_N`]);
                    //     console.log(`yearDataTable[${yearDataTable.length-1}][${chartDataForTable[i].year}_${choice}_%]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}_${choice}_%`]);
                    //     // console.log(`after yearDataTable[${chartDataForTable[i].year}]`, yearDataTable[yearDataTable.length-1][`${chartDataForTable[i].year}`]);
                    //     console.log(`--------------------------------------------------------------`);
                    // });
                }

                // console.log('yearDataTable', yearDataTable);
            });
            // console.log('after all yearDataTable', yearDataTable);

            const yearColumns = [
                {
                title: this.props.checkboxType === 'collector' ? 'Collector Name' : 'Project Name',
                //   width: 30,
                dataIndex: 'name',
                key: 'name',
                },
                {
                    title: 'Year',
                    children: yearChildren
                }
            ];

            const dataTable = [] as any;
            this.state.checkboxOptions.map((collector: any, j: any) => {
                // console.log(`collector`, collector);
                dataTable.push(collector.label);
            });
            // console.log('after dataTable', dataTable);

            // return { time: lastYearsName, projects: dataTable, choices: this.props.question.choices, N: dataTableN };
            const chartData = { time: lastYearsName, projects: dataTable, choices: this.props.question.choices, N: dataTableN };

            return [chartData, yearColumns, yearDataTable];
            
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison checkboxRow generateYearChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                
                // this.setState({ 
                //     defaultActiveKey: 'monthly',
                //     monthChartData: this.generateMonthChartData(11, [ moment(startMonth, 'YYYY/MM'), moment(endMonth, 'YYYY/MM') ]),
                // });
                const data = this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]);
                const monthChartData = data[0];
                const monthColumns = data[1];
                const monthDataTable = data[2];

                this.setState({ 
                    defaultActiveKey: 'monthly',
                    monthChartData: monthChartData,
                    monthColumns: monthColumns,
                    monthDataTable: monthDataTable
                }); 
            }
            else if(key === 'yearly' && this.state.yearChartData.length === 0 && !this.props.yearlyRangePicker){

                // this.setState({ 
                //     defaultActiveKey: 'yearly',
                //     yearChartData: this.generateYearChartData(4, [ this.props.yearsValue[0], this.props.yearsValue[1] ])
                // });
                const data = this.generateYearChartData(this.props.diffYearsAbs, [ this.props.yearsValue[0], this.props.yearsValue[1] ]);
                const yearChartData = data[0];
                const yearColumns = data[1];
                const yearDataTable = data[2];

                this.setState({ 
                    defaultActiveKey: 'yearly',
                    yearChartData: yearChartData,
                    yearColumns: yearColumns,
                    yearDataTable: yearDataTable
                });
            }
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `comparison checkboxRow tabsCallback catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render(){

        let chartHeight = 400;
        chartHeight += this.props.question.choices.length > 3 ? (this.props.question.choices.length / 2) * 10 :  0;
        let paddingBottomPercent = 150;
        paddingBottomPercent += this.props.question.choices.length > 3 ? (this.props.question.choices.length / 2) * 10 :  0;

        return (

            <div className="sm-question-view clearfix sm-corner-a " sm-question-id="438586089" view-role="summaryQuestionViewContainer">

                <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                    <span className="sm-question-number txt-shadow-lt">Q{this.props.question.no} : Checkbox {this.props.question.areaOfImpactMatchedWithFilterName ? `(Area of impact for ${this.props.question.areaOfImpactMatchedWithFilterName})`: ''}</span>
                    <div className="sm-question-btns clearfix">
                    {/* <span className="sm-float-r"><a href="#" className="wds-button wds-button--util-light wds-button--sm action-menu" onClick={(e) => this.props.exportHandler(this.state.defaultActiveKey, this.props.question.no)}>Export</a></span> */}
                        {/* <div className="sm-float-r">
                            <a href="#" customize-btn="" full-access-only="" className="wds-button wds-button--util-light wds-button--sm">Customize</a>
                        </div> */}
                    </div>
                </div>
                
                <div sm-questionview-content="" className="sm-questionview-content " view-role="summaryMatrixRatingQuestionView" style={{ minHeight: '407px'}}>
                    <h1 question-heading="" className="sm-questiontitle" title="">{this.props.question.label}</h1>
                    {/* <ul question-sub-heading="" className="sm-question-view-sub-header">
                        <li>Answered: {this.props.answer.sumAnswered}</li>
                        <li>Skipped: {this.props.answer.sumSkip}</li>
                    </ul> */}

                    <Tabs style={{ marginTop: '20px' }} onChange={this.tabsCallback.bind(this)} type="card" defaultActiveKey={this.props.defaultActiveKey}>
                        <TabPane tab="Monthly Comparison Report" key="monthly">
                            <div className="monthly-comparison-report">
                                <div className="monthly-comparison-report-container">
                                    <div className="sm-chart">
                                        <span style={{ fontWeight: 'bold', marginLeft: '25px' }}>N</span>
                                        <HorizontalCompareChart height={chartHeight} data={this.state.monthChartData} padding={['20', '80', paddingBottomPercent, '80']} rotate={10} disable={ false }/>

                                        {/* <Collapse accordion>
                                            <Panel header="Monthly Comparison Data Table" key="monthly-data-table">
                                                <Table columns={this.state.monthColumns} dataSource={this.state.monthDataTable} pagination={{ total: this.state.monthDataTable.length, pageSize: this.state.monthDataTable.length, hideOnSinglePage: true }} size="middle" bordered/>
                                            </Panel>
                                        </Collapse> */}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Yearly Comparison Report" key="yearly">
                            <div className="yearly-comparison-report">
                                <div className="yearly-comparison-report-container">
                                    <div className="sm-chart">
                                        <span style={{ fontWeight: 'bold', marginLeft: '25px' }}>N</span>
                                        <HorizontalCompareChart height={chartHeight} data={this.state.yearChartData} padding={['20', '80', paddingBottomPercent, '80']} rotate={0} disable={ false }/>

                                        <Collapse accordion>
                                            <Panel header="Yearly Comparison Data Table" key="yearly-data-table">
                                                <Table columns={this.state.yearColumns} dataSource={this.state.yearDataTable} pagination={{ total: this.state.yearDataTable.length, pageSize: this.state.yearDataTable.length, hideOnSinglePage: true }} size="middle" bordered/>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

};
export default CheckboxRow;