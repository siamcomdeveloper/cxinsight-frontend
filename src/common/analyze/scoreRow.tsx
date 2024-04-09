import React from 'react';
import 'antd/dist/antd.css';
import { Gauge } from 'ant-design-pro/lib/Charts';
import { TagCloud } from 'ant-design-pro/lib/Charts';
import { List, Collapse, Divider } from 'antd';
const { Panel } = Collapse;

interface IProps {
    question: any;  
    answer: any;
    // exportHandler: (questionNo: any) => void;
}

const ScoreRow: React.StatelessComponent<IProps> = (props) => { 

    return (

        <div className="sm-question-view clearfix sm-corner-a " sm-question-id="414992057" view-role="summaryBenchmarkQuestionViewContainer">

            <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                <span className="sm-question-number txt-shadow-lt">Q{props.question.no} </span>
                <div className="sm-question-btns clearfix">
                {/* <span className="sm-float-r"><a href="#" className="wds-button wds-button--util-light wds-button--sm action-menu" onClick={(e) => props.exportHandler(props.question.no)}>Export</a></span> */}
                    {/* <div className="sm-float-r">
                        <a href="#" customize-btn="" full-access-only="" className="wds-button wds-button--util-light wds-button--sm">Customize</a>
                    </div>
                    <div className="sm-float-r bm-display-options">
                        <span className="btn-menu hide" bm-chart-type-btn="">
                            <a href="#" bm-chart-type-btn="" data-action="bm-chart-type" className="wds-button wds-button--util-light wds-button--sm wds-button--arrow-down"> Chart Type <span></span></a>
                        </span>
                    </div> */}
                </div>
            </div>

            <div className="sm-questionview-content">
            
                <div className="question-heading-ctnr">
                    <h1 question-heading="" className="sm-questiontitle" title={props.question.label}>{props.question.label}</h1>
                </div>
                <ul question-sub-heading="" className="sm-question-view-sub-header">
                    <li>Answered: {props.answer.sumAnswered}</li>
                    <li>Skipped: {props.answer.sumSkip}</li>
                </ul>

                <div className="sm-questionview-data-ctnr" style={{ minHeight: '449px'}}>
                
                    <div className="sm-chart-container" view-role="summaryQuestionChartView" style={{ marginBottom: '30px' }}>

                        {/* <div className="big-stat__label">average net promoter score</div> */}

                        <div className="sm-chart" data-highcharts-chart="9" view-role="NpsSummaryChartView" style={{ paddingTop: '24px', marginBottom: '15px' }}>
                            {/* <h4 style={{ fontSize: '16px', color: 'gray', textAlign: 'center', marginBottom: '10px' }}>Average Net Promoter Score</h4> */}
                            <Gauge title={props.answer.titleNPS} height={164} percent={ parseFloat(props.answer.avg)*10 } color={ parseFloat(props.answer.avg) <= 2 ? 'red' : parseFloat(props.answer.avg) < 4 ? 'orange' : '#00BF6F' }/>
                        </div>
                    </div>

                    <div className="sm-data-table-container" view-role="SummaryTableContainerView">
                        <div summary-table-container="" className="summary-table-container" view-role="NpsSimpleSummaryTableView">
                            <table className="sm-data-table nps-distribution-table">
                                <thead>
                                    <tr style={{ background: 'none' }}><th className="sortable no-action-menu"><div className="sm-heading-wrapper"><a className="sm-heading-label">
                                    Detractors (0-6)
                                        </a></div></th><th className="sortable no-action-menu"><div className="sm-heading-wrapper"><a className="sm-heading-label">
                                    Passives (7-8)
                                        </a></div></th><th className="sortable no-action-menu"><div className="sm-heading-wrapper"><a className="sm-heading-label">
                                    Promoters (9-10)
                                        </a></div></th><th className="sortable no-action-menu"><div className="sm-heading-wrapper"><a className="sm-heading-label">
                                    Total
                                        </a></div></th><th className="sortable no-action-menu"><div className="sm-heading-wrapper"><a className="sm-heading-label">Net Promoter Score</a></div></th></tr>
                                </thead>
                                <tbody>
                                    <tr style={{ background: 'none' }}><td><div className="sm-data-table-liner sm-data-percent">
                                            {props.answer.percentScore1}%
                                        </div><div className="sm-data-table-liner sm-data-total">
                                            {props.answer.sumScore1}
                                        </div></td><td><div className="sm-data-table-liner sm-data-percent">
                                            {props.answer.percentScore2}%
                                        </div><div className="sm-data-table-liner sm-data-total">
                                            {props.answer.sumScore2}
                                        </div></td><td><div className="sm-data-table-liner sm-data-percent">
                                            {props.answer.percentScore3}%
                                        </div><div className="sm-data-table-liner sm-data-total">
                                            {props.answer.sumScore3}
                                        </div></td><td><div className="sm-data-table-liner sm-data-percent">
                                            100%
                                        </div><div className="sm-data-table-liner sm-data-total">
                                            {props.answer.sumAnswered}
                                        </div></td><td><div className="sm-data-table-liner sm-data-percent">
                                            &nbsp;
                                        </div><div className="sm-data-table-liner sm-data-total">
                                            {props.answer.avg}
                                        </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="sm-chart-container-text" view-role="summaryQuestionChartView">
                            <div /*className="sm-chart"*/ data-highcharts-chart="8" view-role="NpsSummaryChartView" style={{ paddingTop: '24px' }}>
                                { props.answer.tags.length && props.question.analyze_entity && !props.question.analyze_sentiment ?
                                <div>
                                    <Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic' }} >WORD CLOUD</Divider>
                                    <TagCloud data={props.answer.tags} height={200} color={""} />
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
                                    <TagCloud data={props.answer.tags_positive} height={200} color={"green"}/>

                                    <Divider style={{ fontSize: '18px', color: 'red', fontStyle: 'italic' }} >NEGATIVE</Divider>
                                    <TagCloud data={props.answer.tags_negative} height={200} color={"red"}/>
                                    
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
        </div>
    );
};
export default ScoreRow;