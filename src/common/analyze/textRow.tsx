import React from 'react';
import 'antd/dist/antd.css';
import { TagCloud } from 'ant-design-pro/lib/Charts';
import { List, Collapse, Divider } from 'antd';
const { Panel } = Collapse;

interface IProps {
    question: any;  
    answer: any;
    // exportHandler: (questionNo: any) => void;
}

const textRow: React.StatelessComponent<IProps> = (props) => { 

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

            <div sm-questionview-content="" className={!props.question.analyze_entity && !props.question.analyze_sentiment ? 'sm-questionview-content' : 'sm-questionview-content sm-questionview-content-minheight' } view-role="summaryMatrixRatingQuestionView">
                <h1 question-heading="" className="sm-questiontitle" title="">{props.question.label}</h1>
                <ul question-sub-heading="" className="sm-question-view-sub-header">
                    <li>Answered: {props.answer.sumAnswered}</li>
                    <li>Skipped: {props.answer.sumSkip}</li>
                </ul>

                <div className="sm-chart-container-text" view-role="summaryQuestionChartView" style={{ padding: '0 12px 16px 15px' }}>
                    <div /*className="sm-chart"*/ data-highcharts-chart="8" view-role="NpsSummaryChartView" /*style={{ paddingTop: '24px' }}*/>
                        { props.answer.tags && props.question.analyze_entity && !props.question.analyze_sentiment ?
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
                            
                            {/* <div className="comment-list" style={{ padding: '0 12px 16px 15px' }}>
                                <Collapse accordion>
                                    <Panel header="comment Positive" key="positive">
                                        <List
                                            bordered
                                            dataSource={props.answer.tags_negative_answer as []}
                                            renderItem={item => (
                                                <List.Item>
                                                    {item}
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            </div>
                            <div className="comment-list" style={{ padding: '0 12px 16px 15px' }}>
                                <Collapse accordion>
                                    <Panel header="comment Negative" key="negative">
                                        <List
                                            bordered
                                            dataSource={props.answer.tags_positive_answer as []}
                                            renderItem={item => (
                                                <List.Item>
                                                    {item}
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            </div> */}
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
export default textRow;