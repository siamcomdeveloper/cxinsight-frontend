import React from 'react';
import 'antd/dist/antd.css';
import { TagCloud } from 'ant-design-pro/lib/Charts';
import { List, Collapse, Divider, Icon } from 'antd';
const { Panel } = Collapse;

interface IProps {
    question: any;  
    answer: any;
    // exportHandler: (questionNo: any) => void;
}

const RatingRow: React.StatelessComponent<IProps> = (props) => { 

    return (
        <div className="sm-question-view clearfix sm-corner-a " sm-question-id="438586089" view-role="summaryQuestionViewContainer">

            <div sm-questionview-header="" className="sm-question-view-header clearfix" style={{ marginBottom: '20px' }}>
                <span className="sm-question-number txt-shadow-lt">Q{props.question.no} </span>
                <div className="sm-question-btns clearfix">
                {/* <span className="sm-float-r"><a href="#" className="wds-button wds-button--util-light wds-button--sm action-menu" onClick={(e) => props.exportHandler(props.question.no)}>Export</a></span> */}
                    {/* <div className="sm-float-r">
                        <a href="#" customize-btn="" full-access-only="" className="wds-button wds-button--util-light wds-button--sm">Customize</a>
                    </div> */}
                </div>
            </div>
            
            <div sm-questionview-content="" className="sm-questionview-content " view-role="summaryMatrixRatingQuestionView" style={{ minHeight: '407px'}}>
                <h1 question-heading="" className="sm-questiontitle" title="Star Rating">{props.question.label}</h1>
                <ul question-sub-heading="" className="sm-question-view-sub-header">
                    <li>Answered: {props.answer.sumAnswered}</li>
                    <li>Skipped: {props.answer.sumSkip}</li>
                </ul>
                <div className="sm-chart-container" view-role="summaryQuestionChartView">
                    <div view-role="StarRatingChartReactView">
                        <div className="star-rating-charts">
                            <div className="star-rating-charts__avg" style={{ width: '100%', paddingBottom: '20px' }}>
                                
                                <div className="big-stat" style={{ marginBottom: '0' }}>
                                    <div className="big-stat__contents">
                                        <span className="big-stat__value">{props.answer.avg}</span>
                                        {/* <span className="big-stat__unit" style={{ fontSize: '.56667em' }}>
                                            <span style={{ color: 'rgb(0, 191, 111)'}}>
                                                <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="StarFilled">
                                                    <g>
                                                        <path d="m15.874 6.13a.7507.7507 0 0 0 -.7139-.5191h-4.8388l-1.6152-4.5137a.75.75 0 0 0 -1.4121 0l-1.6163 4.5141h-4.8377a.75.75 0 0 0 -.44 1.3575l3.807 2.7548-1.6728 4.6739a.75.75 0 0 0 1.1162.8809l4.3496-2.8399 4.3486 2.84a.75.75 0 0 0 1.1162-.8809l-1.6728-4.6735 3.808-2.7554a.75.75 0 0 0 .274-.8387z"></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </span> */}
                                    </div>
                                    <div className="big-stat__label">average rating</div>
                                </div>

                                <div className="star-bar-container" style={{ paddingBottom: '18.7817px' }}>

                                <Icon type="star" className={ parseInt(props.answer.avg) >= 1 ? "smf-icon smf-icon-active" : "smf-icon" } style={{ fontSize: '40px', color: '#aaa', display: 'inline-block' }}/>
                                <Icon type="star" className={ parseInt(props.answer.avg) >= 2 ? "smf-icon smf-icon-active" : "smf-icon" } style={{ fontSize: '40px', color: '#aaa', display: 'inline-block' }}/>
                                <Icon type="star" className={ parseInt(props.answer.avg) >= 3 ? "smf-icon smf-icon-active" : "smf-icon" } style={{ fontSize: '40px', color: '#aaa', display: 'inline-block' }}/>
                                <Icon type="star" className={ parseInt(props.answer.avg) >= 4 ? "smf-icon smf-icon-active" : "smf-icon" } style={{ fontSize: '40px', color: '#aaa', display: 'inline-block' }}/>
                                { props.question.sub_type_id === 1 ? null : <Icon type="star" className={ parseInt(props.answer.avg) >= 5 ? "smf-icon smf-icon-active" : "smf-icon" } style={{ fontSize: '40px', color: '#aaa', display: 'inline-block' }}/> }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm-data-table-container" view-role="SummaryTableContainerView">
                    <div summary-table-container="" className="summary-table-container" view-role="MatrixSummaryTableView">
                        <table cellPadding="0" cellSpacing="0" className="sm-data-table sm-matrix-table">
                            <thead>
                                <tr style={{ background: 'none' }}>
                                    <th className=" " data-dimension-type="labels">
                                        <div className="sm-heading-wrapper">
                                            <div className="sm-heading-label">&nbsp;</div>
                                        </div>
                                    </th>
                                    <th className=" " data-dimension-id="2909164622" data-dimension-type="column"><div className="sm-heading-wrapper"><a className="sm-heading-label ">{ props.question.showLabel ? props.question.choices[0] : 1 }</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    <th className=" " data-dimension-id="2909164623" data-dimension-type="column"><div className="sm-heading-wrapper"><a className="sm-heading-label ">{ props.question.showLabel ? props.question.choices[1] : 2 }</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    <th className=" " data-dimension-id="2909164624" data-dimension-type="column"><div className="sm-heading-wrapper"><a className="sm-heading-label ">{ props.question.showLabel ? props.question.choices[2] : 3 }</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    <th className=" " data-dimension-id="2909164625" data-dimension-type="column"><div className="sm-heading-wrapper"><a className="sm-heading-label ">{ props.question.showLabel ? props.question.choices[3] : 4 }</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    { props.question.sub_type_id === 1 ? null :
                                    <th className=" " data-dimension-id="2909164626" data-dimension-type="column"><div className="sm-heading-wrapper"><a className="sm-heading-label ">{ props.question.showLabel ? props.question.choices[4] : 5 }</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    }
                                    <th className="totals " data-dimension-type="totals"><div className="sm-heading-wrapper"><a className="sm-heading-label ">Total</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                    <th className="averageRating " data-dimension-type="averageRating"><div className="sm-heading-wrapper"><a className="sm-heading-label ">Average Rating</a>{/*<span className="action-arrow smf-icon">–</span>*/}</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: 'none' }}>
                                    <td data-dimension-id="2909164621" className="">
                                        <div className="sm-table-label-wrapper">
                                            <div className="label txt-shadow-lt">
                                                <div className="smf-icon">S</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore1}</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumScore1}</div>
                                    </td>
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore2}</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumScore2}</div>
                                    </td>
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore3}</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumScore3}</div>
                                    </td>
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore4}</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumScore4}</div>
                                    </td>

                                    { props.question.sub_type_id === 1 ? null :
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">{props.answer.percentScore5}</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumScore5}</div>
                                    </td>
                                    }

                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">100%</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.sumAnswered}</div>
                                    </td>
                                    <td>
                                        <div className="sm-data-table-liner sm-data-percent">&nbsp;</div>
                                        <div className="sm-data-table-liner sm-data-total">{props.answer.avg}</div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot></tfoot>
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
export default RatingRow;