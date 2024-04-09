import React from 'react';
import 'antd/dist/antd.css';
import ChoiceDailyTrendReport from '../ChoiceDailyTrendReport';
import ChoiceMonthlyTrendReport from '../ChoiceMonthlyTrendReport';
import { Tabs } from 'antd';
import moment from 'moment';
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import { History } from 'history';
const { TabPane } = Tabs;

interface IProps {
    question: any;  
    answer: any;
    defaultActiveKey: any;
    dailyRangePicker: any;
    dateMode: any;
    datesValue: any;
    monthlyRangePicker: any;
    monthMode: any;
    monthsValue: any;
    diffDaysAbs: any,
    diffMonthsAbs: any,
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
    dateChartData: any;
    defaultActiveKey: any;
}

class ChoiceRow extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            monthChartData: [],
            dateChartData: [],
            defaultActiveKey: this.props.defaultActiveKey,
        };
    }

    public componentDidMount() { 
        
        if(this.props.dailyRangePicker) this.setState({ dateChartData: this.generateDateChartData(this.props.diffDaysAbs, [ moment(this.props.datesValue[0], 'DD/YYYY/MM'), moment(this.props.datesValue[1], 'DD/YYYY/MM') ],) });
        if(this.props.monthlyRangePicker) this.setState({ monthChartData: this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]) });

    }

    //Month Trend Report
    generateMonthChartData = (diffMonthsAbs: any, monthsValue: any) => {
        try{
            //data chart
            const lastMonthsName = [] as any;

            for(let i = diffMonthsAbs; i > 0; i--){
                // console.log('i', i);
                const subMonth = moment(monthsValue[1]).subtract( moment.duration(i, 'months') );

                const lastMonthName = moment(subMonth).format('MMM YYYY');
                // console.log('lastMonthName', lastMonthName);
                lastMonthsName.push(lastMonthName);
            }

            const lastMonthName = moment(monthsValue[1]).format('MMM YYYY');
            // console.log('lastMonthName', lastMonthName);
            lastMonthsName.push(lastMonthName);

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
                for (let j = 0; j < this.props.question.choices.length; j++) { 
                    countArr[i][j] = 0; 
                } 
            } 
            
            // console.log('countArr', countArr);

            this.props.answer.recordset[1].map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} created_at[0]`, answerObj.created_at[0]);
                if(!answerObj.skip_status){
                    const answerMonthName = moment(answerObj.created_at[0]).format('MMM YYYY');
                    // console.log(`answerObj index ${index} answerMonthName`, answerMonthName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    
                    //loop answer weigth matchs with choice weight
                    this.props.question.weights.map((weight: any, j: any) => {
                        // console.log(`weight`, weight);
                        if(parseInt(weight) === parseInt(answerObj.answer)){
                            // console.log(`in if weight ${weight} answerObj.answer ${answerObj.answer}`);
                            
                            //lop anwerMonth match with range month
                            lastMonthsName.map((MonthName: any, i: any) => { 
                                // console.log(`MonthName`, MonthName);
                                if(answerMonthName === MonthName){
                                    // console.log(`in if answerMonthName ${answerMonthName} MonthName ${MonthName}`);
                                    // console.log(`beforecountArr[${i}][${j}]`, countArr[i][j]);
                                    countArr[i][j] = countArr[i][j]+1;
                                    // console.log(`after countArr[${i}][${j}]`, countArr[i][j]);
                                }
                            });

                        }
                    });
                }

            });

            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let data = [] as any;

            for(let i = 0; i <= diffMonthsAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`lastMonthsName[${i}]`, lastMonthsName[i]);

                this.props.question.choices.map((choice: any, j: any) => {
                    // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                    data.push({
                        month: `${lastMonthsName[i]}`,
                        N: countArr[i][j],
                        label: choice
                    });
                });
                
            }
            // console.log('data', data);

            return data;
            
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative choiceRow generateMonthChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return null;
        }
    }

    //Date Trend Report
    generateDateChartData = (diffDaysAbs: any, datesValue: any) => {
        try{
            //data chart
            const lastDatesName = [] as any;

            for(let i = diffDaysAbs; i > 0; i--){
                // console.log('i', i);
                const subDate = moment(datesValue[1]).subtract( moment.duration(i, 'days') );

                const lastDateName = moment(subDate).format('DD MMM YYYY');
                // console.log('lastDateName', lastDateName);
                lastDatesName.push(lastDateName);
            }

            const lastDateName = moment(datesValue[1]).format('DD MMM YYYY');
            // console.log('lastDateName', lastDateName);
            lastDatesName.push(lastDateName);

            // console.log('lastDatesName', lastDatesName);
            
            // console.log('this.props.answer.recordset', this.props.answer.recordset);
            // console.log('this.props.answer.recordset.length', this.props.answer.recordset.length);

            //initilize 1D array elements.
            let countArr = new Array(lastDatesName.length); 
            for (let i = 0; i < countArr.length; i++) { 
                countArr[i] = []; 
            } 

            // Loop to initilize 2D array elements. 
            for (let i = 0; i < lastDatesName.length; i++) { 
                for (let j = 0; j < this.props.question.choices.length; j++) { 
                    countArr[i][j] = 0; 
                } 
            } 
            
            // console.log('countArr', countArr);
            const dailyRecordset = this.props.dailyRangePicker ? this.props.answer.recordset[0] : this.props.answer.recordset[1];

            // console.log('dailyRecordset', dailyRecordset);
            // console.log('dailyRecordset.length', dailyRecordset.length);

            dailyRecordset.map((answerObj: any, index: any) => {
                // console.log(`answerObj index ${index}`, answerObj);
                // console.log(`answerObj index ${index} created_at[0]`, answerObj.created_at[0]);
                if(!answerObj.skip_status){
                    const answerDateName = moment(answerObj.created_at[0]).format('DD MMM YYYY');
                    // console.log(`answerObj index ${index} answerDateName`, answerDateName);
                    // console.log(`answerObj index ${index} answer`, answerObj.answer);
                    
                    //loop answer weigth matchs with choice weight
                    this.props.question.weights.map((weight: any, j: any) => {
                        // console.log(`weight`, weight);
                        if(parseInt(weight) === parseInt(answerObj.answer)){
                            // console.log(`in if weight ${weight} answerObj.answer ${answerObj.answer}`);
                            
                            //lop anwerDate match with range date
                            lastDatesName.map((DateName: any, i: any) => { 
                                // console.log(`DateName`, DateName);
                                if(answerDateName === DateName){
                                    // console.log(`in if answerDateName ${answerDateName} DateName ${DateName}`);
                                    // console.log(`beforecountArr[${i}][${j}]`, countArr[i][j]);
                                    countArr[i][j] = countArr[i][j]+1;
                                    // console.log(`after countArr[${i}][${j}]`, countArr[i][j]);
                                }
                            });

                        }
                    });
                }

            });

            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let data = [] as any;

            for(let i = 0; i <= diffDaysAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`lastDatesName[${i}]`, lastDatesName[i]);

                this.props.question.choices.map((choice: any, j: any) => {
                    // console.log(`choice ${choice} countArr[${i}][${j}]`, countArr[i][j]);
                    data.push({
                        date: `${lastDatesName[i]}`,
                        N: countArr[i][j],
                        label: choice
                    });
                });
                
            }
            // console.log('data', data);

            return data;
            
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative choiceRow generateDateChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return null;
        }
    }
    
    tabsCallback(key: any) {
        try{
            // console.log('tabsCallback key', key);
            // console.log('tabsCallback dateChartData', this.state.dateChartData);
            // console.log('tabsCallback dateChartData.length', this.state.dateChartData.length);
            
            if(key === 'daily' && this.state.dateChartData.length === 0 && !this.props.dailyRangePicker){
                const current = moment();
                const endDate = current.format('DD/YYYY/MM');
                // console.log('endDate', endDate);

                const last31days = moment().subtract( moment.duration(30, 'days') );
                // console.log('last31days', last31days);
                
                const startDate = moment(last31days).format('DD/YYYY/MM');
                // console.log('startDate', startDate);
                
                this.setState({ 
                    defaultActiveKey: 'daily',
                    dateChartData: this.generateDateChartData(30, [ moment(startDate, 'DD/YYYY/MM'), moment(endDate, 'DD/YYYY/MM') ])
                });

            }
            else if(key === 'monthly'){
                const current = moment();
                const endMonth = current.format('YYYY/MM');
                // console.log('endMonth', endMonth);

                const last11Months = moment().subtract( moment.duration(11, 'months') );
                // console.log('last11Months', last11Months);
                
                const startMonth = moment(last11Months).format('YYYY/MM');
                
                this.setState({ 
                    defaultActiveKey: 'monthly',
                    monthChartData: this.generateMonthChartData(11, [ moment(startMonth, 'YYYY/MM'), moment(endMonth, 'YYYY/MM') ]),
                });
            }
            else if(key === 'yearly'){

            }
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative choiceRow tabsCallback catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    render() {

        let chartHeight = 400;
        chartHeight += this.props.question.choices.length > 3 ? (this.props.question.choices.length / 2) * 10 :  0;
        let paddingBottomPercent = 150;
        paddingBottomPercent += this.props.question.choices.length > 3 ? (this.props.question.choices.length / 2) * 10 :  0;

        return (

            <div className="sm-question-view clearfix sm-corner-a " sm-question-id="438586089" view-role="summaryQuestionViewContainer">

                <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                    <span className="sm-question-number txt-shadow-lt">Q{this.props.question.no} : {this.props.question.typeId === 2 ? 'Multiple Choice' : 'Dropdown'} {this.props.question.areaOfImpactMatchedWithFilterName ? `(Area of impact for ${this.props.question.areaOfImpactMatchedWithFilterName})`: ''}</span>
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
                        <TabPane tab="Daily Trend Report" key="daily">
                            <div className="daily-trend-report">
                                <div className="daily-trend-report-container">
                                    <div className="sm-chart">
                                        <ChoiceDailyTrendReport height={chartHeight} data={this.state.dateChartData} padding={['20', '80', paddingBottomPercent+20, '60']} rotate={30} disable={ false }/>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Monthly Trend Report" key="monthly">
                            <div className="monthly-trend-report">
                                <div className="monthly-trend-report-container">
                                    <div className="sm-chart">
                                        <ChoiceMonthlyTrendReport height={chartHeight} data={this.state.monthChartData} padding={['20', '40', paddingBottomPercent, '60']} rotate={30} disable={ false }/>
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
export default ChoiceRow;