import React from 'react';

class SurveyFeedbackList extends React.Component { 
    render() {
        return (

            <div>
                {/* list view */}

                {/* customer feedback */}
                <div>
                    <div className="wds-m-b-2 sm-all-templates-tab__category-heading sm-all-templates-tab__category-heading--no-tabs">
                        <div className="sm-all-templates-tab__category-heading--inner">
                            <span className="wds-type--section-title">Customer Feedback</span>
                        </div>
                    </div>

                    <div className="wds-flex wds-flex--x sm-all-templates-tab__row wds-w-100 wds-p-b-5">
                        <div data-testid="LimitedList__Container" className="wds-w-100">
                            <div className="wds-w-100 wds-flex wds-flex--y">
                                <div className="sm-limited-list__items--column">
                                    
                                    {/* Customer Satisfaction Survey Template */}
                                    <div role="button" className="wds-card sm-base-list-item sm-survey-template-card" data-testid="SurveyTemplateCard_Container">
                                        <div className="wds-grid__row wds-h-100 sm-base-list-item__container">
                                            <div className="wds-flex wds-flex--y-center sm-base-list-item__inner wds-grid__col">
                                                <div className="wds-flex wds-flex--y">
                                                    <span className="wds-type--dark wds-type--card-title sm-survey-template-card__title">Customer Satisfaction Survey Template</span>
                                                    <div>
                                                        <span className="wds-type--dark-muted wds-type--body-sm">10 questions</span>
                                                    </div>
                                                </div>
                                                <div className="wds-modal__actions-right">
                                                    <div className="wds-flex wds-flex--y wds-flex--x-center wds-type--body-sm wds-p-r-5 sm-survey-template-card__action">
                                                        <div className="wds-type--section-title">
                                                            <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="Eye" ><g><path d="m8 4.43a3.57 3.57 0 1 0 3.57 3.57 3.574 3.574 0 0 0 -3.57-3.57zm0 5.74a2.17 2.17 0 1 1 2.1694-2.17 2.1715 2.1715 0 0 1 -2.1694 2.17z"></path><path d="m15.7974 7.635c-.1174-.1914-2.919-4.6894-7.7974-4.6894s-7.68 4.498-7.7974 4.6894a.7.7 0 0 0 0 .7295c.1172.1914 2.919 4.69 7.7969 4.69s7.6807-4.4985 7.7978-4.69a.7.7 0 0 0 .0001-.7295zm-7.7974 4.0191c-3.3394 0-5.6167-2.6631-6.3491-3.6541.7324-.9914 3.0098-3.654 6.3491-3.654s5.6167 2.6626 6.3491 3.654c-.7324.991-3.0097 3.6541-6.3491 3.6541z"></path></g></svg>
                                                        </div>Preview
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Net Promoter® Score (NPS) Template */}
                                    <div role="button" className="wds-card sm-base-list-item sm-survey-template-card" data-testid="SurveyTemplateCard_Container">
                                        <div className="wds-grid__row wds-h-100 sm-base-list-item__container">
                                            <div className="wds-flex wds-flex--y-center sm-base-list-item__inner wds-grid__col">
                                                <div className="wds-flex wds-flex--y">
                                                    <span className="wds-type--dark wds-type--card-title sm-survey-template-card__title">Net Promoter® Score (NPS) Template</span>
                                                    <div>
                                                        <span className="wds-type--dark-muted wds-type--body-sm">8 questions</span>
                                                    </div>
                                                </div>
                                                <div className="wds-modal__actions-right">
                                                    <div className="wds-flex wds-flex--y wds-flex--x-center wds-type--body-sm wds-p-r-5 sm-survey-template-card__action">
                                                        <div className="wds-type--section-title">
                                                            <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="Eye" ><g><path d="m8 4.43a3.57 3.57 0 1 0 3.57 3.57 3.574 3.574 0 0 0 -3.57-3.57zm0 5.74a2.17 2.17 0 1 1 2.1694-2.17 2.1715 2.1715 0 0 1 -2.1694 2.17z"></path><path d="m15.7974 7.635c-.1174-.1914-2.919-4.6894-7.7974-4.6894s-7.68 4.498-7.7974 4.6894a.7.7 0 0 0 0 .7295c.1172.1914 2.919 4.69 7.7969 4.69s7.6807-4.4985 7.7978-4.69a.7.7 0 0 0 .0001-.7295zm-7.7974 4.0191c-3.3394 0-5.6167-2.6631-6.3491-3.6541.7324-.9914 3.0098-3.654 6.3491-3.654s5.6167 2.6626 6.3491 3.654c-.7324.991-3.0097 3.6541-6.3491 3.6541z"></path></g></svg>
                                                        </div>Preview
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Service Template */}
                                    <div role="button" className="wds-card sm-base-list-item sm-survey-template-card" data-testid="SurveyTemplateCard_Container">
                                        <div className="wds-grid__row wds-h-100 sm-base-list-item__container">
                                            <div className="wds-flex wds-flex--y-center sm-base-list-item__inner wds-grid__col">
                                                <div className="wds-flex wds-flex--y">
                                                    <span className="wds-type--dark wds-type--card-title sm-survey-template-card__title">Customer Service Template</span>
                                                    <div>
                                                        <span className="wds-type--dark-muted wds-type--body-sm">8 questions</span>
                                                    </div>
                                                </div>
                                                <div className="wds-modal__actions-right">
                                                    <div className="wds-flex wds-flex--y wds-flex--x-center wds-type--body-sm wds-p-r-5 sm-survey-template-card__action">
                                                        <div className="wds-type--section-title">
                                                            <svg className="wds-icon-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" aria-label="Eye" ><g><path d="m8 4.43a3.57 3.57 0 1 0 3.57 3.57 3.574 3.574 0 0 0 -3.57-3.57zm0 5.74a2.17 2.17 0 1 1 2.1694-2.17 2.1715 2.1715 0 0 1 -2.1694 2.17z"></path><path d="m15.7974 7.635c-.1174-.1914-2.919-4.6894-7.7974-4.6894s-7.68 4.498-7.7974 4.6894a.7.7 0 0 0 0 .7295c.1172.1914 2.919 4.69 7.7969 4.69s7.6807-4.4985 7.7978-4.69a.7.7 0 0 0 .0001-.7295zm-7.7974 4.0191c-3.3394 0-5.6167-2.6631-6.3491-3.6541.7324-.9914 3.0098-3.654 6.3491-3.654s5.6167 2.6626 6.3491 3.654c-.7324.991-3.0097 3.6541-6.3491 3.6541z"></path></g></svg>
                                                        </div>Preview
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                {/* customer feedback */}

                {/* end list view */}

            </div>
        );
    }
};
export default SurveyFeedbackList;