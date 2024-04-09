import React from 'react';
import 'antd/dist/antd.css';
import HorizontalChart from '../HorizontalChart';
import HorizontalPercent from '../HorizontalPercent';
// import PieChart from '../PieChart';
import { TagCloud } from 'ant-design-pro/lib/Charts';
import { List, Collapse, Divider } from 'antd';
const { Panel } = Collapse;

interface IProps {
    question: any;  
    answer: any;
    // exportHandler: (questionNo: any) => void;
}

const CheckboxRow: React.StatelessComponent<IProps> = (props) => { 
    
    function createTableRow(length: number) {
        // console.log('createTableRow', length);
        let tabRow = [];
    
        // Outer loop to create parent
        for (let i = 0; i < length; i++) {

            tabRow.push(
            <tr key={i} style={{ background: 'none' }}>
                                    
                <td data-dimension-id="2758945291" className="">
                    <div className="sm-table-label-wrapper">
                        <div className="label txt-shadow-lt" style={{ paddingLeft: '0' }}><div>{props.question.choices[i]}</div></div>
                    </div>
                </td>
                <td>
                    <div className="sm-data-table-liner sm-data-percent">{props.question.weights[i]}</div>
                </td>
                <td>
                    <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore[i]}</div>
                </td>
                <td>
                    <div className="sm-data-table-liner sm-data-total" style={{fontWeight: 'bold'}}>{props.answer.sumScore[i]}</div>
                </td>
            </tr>
            );
            
        }
        return tabRow;
    }

    const chartHeight = props.question.choices.length * 50;

    return (

        <div className="sm-question-view clearfix sm-corner-a " sm-question-id="438586089" view-role="summaryQuestionViewContainer">

            <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                <span className="sm-question-number txt-shadow-lt">Q{props.question.no}</span>
                <div className="sm-question-btns clearfix">
                {/* <span className="sm-float-r"><a href="#" className="wds-button wds-button--util-light wds-button--sm action-menu" onClick={(e) => props.exportHandler(props.question.no)}>Export</a></span> */}
                    {/* <div className="sm-float-r">
                        <a href="#" customize-btn="" full-access-only="" className="wds-button wds-button--util-light wds-button--sm">Customize</a>
                    </div> */}
                </div>
            </div>
            
            <div sm-questionview-content="" className="sm-questionview-content " view-role="summaryMatrixRatingQuestionView" style={{ minHeight: '407px'}}>
                <h1 question-heading="" className="sm-questiontitle" title="">{props.question.label}</h1>
                <ul question-sub-heading="" className="sm-question-view-sub-header">
                    <li>Answered: {props.answer.sumAnswered}</li>
                    <li>Skipped: {props.answer.sumSkip}</li>
                </ul>

                {/* <div className="sm-chart-container" view-role="summaryQuestionChartView"> */}
                <div className="">
                    <div className="sm-chart" data-highcharts-chart="9" view-role="NpsSummaryChartView" style={{ paddingTop: '24px'/*, width: '800px'*/ }}>
                        {/* <Gauge title={props.answer.titleNPS} height={164} percent={ parseFloat(props.answer.avg8)*10 } color="#00BF6F"/> */}

                        {/* <HorizontalChart height={400} data={props.answer.chartData} padding={['0', '50', '50', '100' ]} disable={ props.question.choices.length > 2 ? false : true }/> */}

                        {/* <HorizontalPercent height={200} data={props.answer.chartData} padding={['0', '50', '50', '100' ]} rotate={0} disable={ props.question.choices.length > 2 ? true : false }/> */}
                        {/* <PieChart height={350} data={props.answer.chartData} padding={['0', '0', '0', '0' ]} disable={ false }/> */}

                        <HorizontalChart height={chartHeight} data={props.answer.chartData} padding={['0', '100', '50', '250' ]} disable={ props.question.choices.length > 2 ? false : true }/>

                        <HorizontalPercent height={200} data={props.answer.chartData} padding={['0', '50', '50', '100' ]} rotate={0} disable={ props.question.choices.length > 2 ? true : false }/>
                    </div>
                </div>

                <div className="sm-data-table-container" view-role="SummaryTableContainerView">
                    <div summary-table-container="" className="summary-table-container" view-role="SimpleSummaryTableView">
                        <table cellPadding="0" cellSpacing="0" className="sm-data-table sm-data-table-summary">
                            <thead>
                                <tr style={{ background: 'none' }}>
                                    <th className="sortable " data-dimension-type="labels">
                                        <div className="sm-heading-wrapper">
                                            <a className="sm-heading-label ">Answer Choices</a>
                                        </div>
                                    </th>
                                    <th className="sortable " data-dimension-type="labels">
                                        <div className="sm-heading-wrapper">
                                            <a className="sm-heading-label ">Choice</a>
                                        </div>
                                    </th>
                                    <th className="sortable " data-dimension-type="responses">
                                        <div className="sm-heading-wrapper">
                                            <a className="sm-heading-label ">Responses %</a>
                                        </div>
                                    </th>
                                    <th className="sortable " data-dimension-type="responses">
                                        <div className="sm-heading-wrapper">
                                            <a className="sm-heading-label ">Number of Response</a>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {createTableRow(props.question.choices.length)}

                            </tbody>
                            <tfoot>
                                <tr style={{ background: 'none' }}>
                                    <td>TOTAL</td>
                                    <td></td>
                                    <td colSpan={1}>
                                        <div className="sm-data-table-liner sm-data-percent">100%</div>
                                    </td>
                                    <td colSpan={1}>
                                        <div className="sm-data-table-liner sm-data-total" style={{fontWeight: 'bold'}}>{props.answer.countTotal}</div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="sm-chart-container-text" view-role="summaryQuestionChartView">
                        <div /*className="sm-chart"*/ data-highcharts-chart="8" view-role="NpsSummaryChartView" style={{ paddingTop: '24px' }}>
                            { props.answer.tags.length && props.question.analyze_entity && !props.question.analyze_sentiment ?
                            <div>
                                <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                {/* <TagCloud data={props.answer.tags} height={200} color={""} /> */}
                                <div className="comment-list">
                                    <Collapse accordion>
                                        <Panel header="comment" key="comment">
                                            <List
                                                bordered
                                                dataSource={props.answer.comment as any []}
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
                            : null }

                            { (props.answer.tags_positive.length ||  props.answer.tags_negative.length) && props.question.analyze_entity && props.question.analyze_sentiment ?
                            <div>
                                <Divider style={{ fontSize: '18px', color: 'green', fontStyle: 'italic' }} >POSITIVE</Divider>
                                {/* <TagCloud data={props.answer.tags_positive} height={200} color={"green"}/> */}

                                <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                {/* <TagCloud data={props.answer.tags_negative} height={200} color={"red"}/> */}
                                
                                <div className="comment-list">
                                    <Collapse accordion>
                                        <Panel header="comment" key="comment">
                                            <List
                                                bordered
                                                dataSource={props.answer.comment as any []}
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
                            : null }
                            
                        </div>
                    </div>
                    
                    { props.answer.comment.length && !props.question.analyze_entity && !props.question.analyze_sentiment ?
                    <div className={'comment-list'}>
                        <Collapse accordion>
                            <Panel header="comment" key="comment">
                                <List
                                    bordered
                                    dataSource={props.answer.comment as any []}
                                    renderItem={item => (
                                        <List.Item>
                                            {item}
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        </Collapse>
                    </div>
                    : null }

                </div>

            </div>
        </div>
    );

};
export default CheckboxRow;