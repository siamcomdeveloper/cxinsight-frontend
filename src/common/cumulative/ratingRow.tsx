import React from 'react';
import 'antd/dist/antd.css';
import RatingDailyTrendReport from '../RatingDailyTrendReport';
import RatingMonthlyTrendReport from '../RatingMonthlyTrendReport';
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

class RatingRow extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            monthChartData: [],
            dateChartData: [],
            defaultActiveKey: this.props.defaultActiveKey,
        };
    }

    public componentDidMount() { 
        // console.log('RatingRow componentDidMount tabsCallback diffDaysAbs', this.props.diffDaysAbs);
        
        if(this.props.dailyRangePicker) this.setState({ dateChartData: this.generateDateChartData(this.props.diffDaysAbs, [ moment(this.props.datesValue[0], 'DD/YYYY/MM'), moment(this.props.datesValue[1], 'DD/YYYY/MM') ],) });
        if(this.props.monthlyRangePicker) this.setState({ monthChartData: this.generateMonthChartData(this.props.diffMonthsAbs, [ moment(this.props.monthsValue[0], 'YYYY/MM'), moment(this.props.monthsValue[1], 'YYYY/MM') ]) });
     
    }

    //Month Trend Report
    generateMonthChartData = (diffMonthsAbs: any, monthsValue: any) => {
        try{
            //data chart
            // const lastMonthsNum = [] as any;
            const lastMonthsName = [] as any;

            for(let i = diffMonthsAbs; i > 0; i--){
                // console.log('i', i);
                const subMonth = moment(monthsValue[1]).subtract( moment.duration(i, 'months') );
                // console.log('last10Months', last10Months);
                // const lastmonthNum = moment(subMonth).format('MM/YYYY');
                // console.log('lastmonthNum', lastmonthNum);
                // lastMonthsNum.push(lastmonthNum);

                const lastMonthName = moment(subMonth).format('MMM YYYY');
                // console.log('lastMonthName', lastMonthName);
                lastMonthsName.push(lastMonthName);
            }

            // const lastmonthNum = moment(this.state.value[1]).format('MM/YYYY');
            // console.log('lastmonthNum', lastmonthNum);
            // lastMonthsNum.push(lastmonthNum);

            const lastMonthName = moment(monthsValue[1]).format('MMM YYYY');
            // console.log('lastMonthName', lastMonthName);
            lastMonthsName.push(lastMonthName);

            // console.log('lastMonthsNum', lastMonthsNum);
            // console.log('lastMonthsName', lastMonthsName);
            
            // let data = [] as any;

            // for(let i = 0; i <= diffMonthsAbs; i++){
            //     data.push({
            //         month: `${lastMonthsName[i]}`,
            //         label: "score",
            //         score: i/3
            //     });
            // }
            // console.log('data', data);

            // console.log('this.props.answer.recordset', this.props.answer.recordset);
            // console.log('this.props.answer.recordset.length', this.props.answer.recordset.length);

            const sumArr = new Array<any>(lastMonthsName.length);
            const countArr = new Array<any>(lastMonthsName.length);
            for(let i = 0; i < sumArr.length; i++) { sumArr[i] = 0; }
            for(let i = 0; i < countArr.length; i++) { countArr[i] = 0; }
            // console.log('sumArr', sumArr);
            // console.log('countArr', countArr);
            // console.log('this.props.answer.recordset', this.props.answer.recordset);

            this.props.answer.recordset[1].map((answerObj: any, i: any) => {
                // console.log(`answerObj index ${i}`, answerObj);
                // console.log(`answerObj index ${i} created_at[0]`, answerObj.created_at[0]);
                if(!answerObj.skip_status){
                    const answerMonthName = moment(answerObj.created_at[0]).format('MMM YYYY');
                    // console.log(`answerObj index ${i} answerMonthName`, answerMonthName);
                    // console.log(`answerObj index ${i} answer`, answerObj.answer);

                    lastMonthsName.forEach((MonthName: any, index: any) => { 
                        // console.log(`MonthName`, MonthName);
                        if(answerMonthName === MonthName){
                            // console.log(`in if answerMonthName ${answerMonthName} MonthName ${MonthName}`);
                            sumArr[index] += answerObj.answer;
                            countArr[index]++;
                        }
                    });
                }
            });

            // console.log('after sumArr', sumArr);
            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let data = [] as any;

            for(let i = 0; i <= diffMonthsAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`sumArr[${i}]`, sumArr[i]);
                // console.log(`countArr[${i}]`, countArr[i]);

                const calAvg = (sumArr[i] / countArr[i]);
                const avgScore = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                // console.log(`avgScore`, avgScore);

                const avgScoreFloat = parseFloat(avgScore);
                // console.log(`avgScoreFloat`, avgScoreFloat);

                data.push({
                    month: `${lastMonthsName[i]},${countArr[i]}`,
                    score: avgScoreFloat,
                    label: "Rating Score"
                });
            }
            // console.log('data', data);

            return data;

        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative ratingRow generateMonthChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            return null;
        }
    }

    //Date Trend Report
    generateDateChartData = (diffDaysAbs: any, datesValue: any) => {
        try{
            // console.log('diffDaysAbs', diffDaysAbs);
            // console.log('datesValue', datesValue);
            //data chart
            const lastDatesName = [] as any;

            for(let i = diffDaysAbs; i > 0; i--){
                const subDate = moment(datesValue[1]).subtract( moment.duration(i, 'days') );
                const lastDateName = moment(subDate).format('DD MMM YYYY');
                // console.log('lastDateName', lastDateName);
                lastDatesName.push(lastDateName);
            }

            const lastDateName = moment(datesValue[1]).format('DD MMM YYYY');
            // console.log('lastDateName', lastDateName);
            lastDatesName.push(lastDateName);

            // console.log('lastDatesName', lastDatesName);
            
            const sumArr = new Array<any>(lastDatesName.length);
            const countArr = new Array<any>(lastDatesName.length);
            for(let i = 0; i < sumArr.length; i++) { sumArr[i] = 0; }
            for(let i = 0; i < countArr.length; i++) { countArr[i] = 0; }
            // console.log('sumArr', sumArr);
            // console.log('countArr', countArr);

            const dailyRecordset = this.props.dailyRangePicker ? this.props.answer.recordset[0] : this.props.answer.recordset[1];

            // console.log('dailyRecordset', dailyRecordset);
            // console.log('dailyRecordset.length', dailyRecordset.length);

            dailyRecordset.map((answerObj: any, i: any) => {
                // console.log(`answerObj index ${i}`, answerObj);
                // console.log(`answerObj index ${i} created_at[0]`, answerObj.created_at[0]);
                if(!answerObj.skip_status){
                    const answerDateName = moment(answerObj.created_at[0]).format('DD MMM YYYY');
                    // console.log(`answerObj index ${i} answerDateName`, answerDateName);
                    // console.log(`answerObj index ${i} answer`, answerObj.answer);

                    lastDatesName.forEach((DateName: any, index: any) => { 
                        // console.log(`DateName`, DateName);
                        if(answerDateName === DateName){
                            // console.log(`in if answerDateName ${answerDateName} DateName ${DateName}`);
                            sumArr[index] += answerObj.answer;
                            countArr[index]++;
                        }
                    });
                }
            });

            // console.log('after sumArr', sumArr);
            // console.log('after countArr', countArr);
            
            const avgFormatAvg = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
            const af = new Intl.NumberFormat('en-IN', avgFormatAvg);
            
            let data = [] as any;

            for(let i = 0; i <= diffDaysAbs; i++){
                // console.log(`sumArr[${i}]/countArr[${i}]`, sumArr[i]/countArr[i]);
                // console.log(`sumArr[${i}]`, sumArr[i]);
                // console.log(`countArr[${i}]`, countArr[i]);

                const calAvg = (sumArr[i] / countArr[i]);
                const avgScore = isNaN(calAvg) ? af.format(0) : af.format(calAvg);
                // console.log(`avgScore`, avgScore);

                const avgScoreFloat = parseFloat(avgScore);
                // console.log(`avgScoreFloat`, avgScoreFloat);

                data.push({
                    date: `${lastDatesName[i]},${countArr[i]}`,
                    score: avgScoreFloat,
                    label: "Rating Score"
                });
            }
            // console.log('data', data);

            return data;

        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative ratingRow generateDateChartData catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                    dateChartData: this.generateDateChartData(30, [ moment(startDate, 'DD/YYYY/MM'), moment(endDate, 'DD/YYYY/MM') ]),
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
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `cumulative ratingRow tabsCallback catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
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
                    <h1 question-heading="" className="sm-questiontitle" title="Star Rating">{this.props.question.label}</h1>
                    {/* <ul question-sub-heading="" className="sm-question-view-sub-header">
                        <li>Answered: {this.props.answer.sumAnswered}</li>
                        <li>Skipped: {this.props.answer.sumSkip}</li>
                    </ul> */}

                    <Tabs style={{ marginTop: '20px' }} onChange={this.tabsCallback.bind(this)} type="card" defaultActiveKey={this.props.defaultActiveKey}>
                        <TabPane tab="Daily Trend Report" key="daily">
                            <div className="daily-trend-report">
                                <div className="daily-trend-report-container">
                                    <div className="sm-chart">
                                        <RatingDailyTrendReport height={350} data={this.state.dateChartData} padding={['20', '80', '120', '60']} rotate={30} disable={ false }/>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Monthly Trend Report" key="monthly">
                            <div className="monthly-trend-report">
                                <div className="monthly-trend-report-container">
                                    <div className="sm-chart">
                                        <RatingMonthlyTrendReport height={350} data={this.state.monthChartData} padding={['20', '40', '100', '60']} rotate={30} disable={ false }/>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        {/* <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                        </TabPane> */}
                    </Tabs>
                    
                </div>

            </div>

        );
    }

};
export default RatingRow;