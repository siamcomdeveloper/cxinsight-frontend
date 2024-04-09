import React from 'react';
import 'antd/dist/antd.css';
import parse from 'html-react-parser';

interface IProps {
    question: any;  
    answer: any;
}

const CheckboxRowBrowse: React.StatelessComponent<IProps> = (props) => { 

    return (
        <div className="response-question-list-container sm-corner-a" view-role="questionResponseListView" style={{ marginTop: '10px' }}>
            <div className="response-question-list">

                <div className="response-question-container" view-role="questionResponseView">
                    <div className="response-question response-question-type-both response-question-family-datetime sm-corner-a spacer-pam no-question-response">
                        <div className="response-question-header clearfix">
                            <div className="sm-float-l ">
                                <div className="question-title">Q{props.question.no}</div>
                                <div className="response-question-title-text">
                                {props.question.label}
                                </div>
                            </div>
                        </div>
                        <div className={ props.answer.skip ? "hidden" : "response-question-content" }>
                            <div className="response-container essay ta-response-item" view-role="responseEssayView">
                                {/* <p className="response-text openended-response-text">{props.answer.choice}</p> */}
                                <ul className="response-container-ul">
                                    {parse(props.answer.choice)}
                                </ul>
                            </div>
                            <div className={ props.answer.comment ? "response-container matrix-rating matrix" : "hidden" } view-role="responseMatrixRatingView">
                                <ul>
                                    <li className="response-list-item ta-response-item">
                                        <div className="clearfix">
                                            <span className="response-text-label">
                                                Comment
                                            </span>
                                            <div className="response-text other-item ta-response-item">
                                                <span className="">
                                                {props.answer.comment}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className={ props.question.enableConsent ? "response-question-content" : "hidden" }>
                                <br/>
                                {props.answer.signature ? 
                                <div>
                                    <div className="no-response-text"> 
                                        Data Subject Signature
                                    </div>
                                    <img className="response-signed-data-URL-image" src={props.answer.signature} />
                                </div>
                                : null}  

                                <br/>

                                {props.answer.consent ? 
                                <div>
                                    <div className="no-response-text"> 
                                        Customer Consent Photo
                                    </div>
                                    <img src={props.answer.consent} alt="consent" style={{ width: '100%' }} /> 
                                </div>
                                : null}
                            </div>
                        </div>
                        
                        <div className={ props.answer.skip ? "response-question-content" : "hidden" }>
                            <div className="no-response-text"> 
                            Respondent skipped this question
                            </div>
                        </div>
                        
                        <div className="response-question-border-bottom"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default CheckboxRowBrowse;