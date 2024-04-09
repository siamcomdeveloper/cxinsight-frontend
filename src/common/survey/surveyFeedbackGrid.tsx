import React from 'react';

class SurveyFeedbackGrid extends React.Component { 
    render() {
        return (

            <div>

                {/*Customer Feedback*/}
                <div>
                    <div className="wds-m-b-2 sm-all-templates-tab__category-heading sm-all-templates-tab__category-heading--no-tabs">
                        <div className="sm-all-templates-tab__category-heading--inner"><span className="wds-type--section-title">Customer Feedback</span></div>
                    </div>

                    <div className="wds-flex wds-flex--x sm-all-templates-tab__row wds-w-100 wds-p-b-5">
                        <div data-testid="LimitedList__Container" className="wds-w-100">
                            <div className="wds-w-100 wds-flex wds-flex--y">
                                <div className="sm-limited-list__items--row">

                                    <div role="button" className="sm-base-tile sm-survey-template-tile"  data-testid="SurveyTemplateTile_Container">
                                        <div className="wds-h-100 sm-base-tile__container">
                                            <div className="sm-survey-template-tile__inner wds-p-0">
                                                <div className="sm-survey-template-tile__image-content wds-flex wds-flex-y--center">
                                                    <img className="sm-survey-template-tile__stock-image" src="//cdn.smassets.net/assets/smweb/coreweb/app/pages/CreateSurvey/StockImages/images/customer_satisfaction_template_revised.22f5229e.jpg" alt="Customer Satisfaction Survey Template" data-testid="SurveyTemplateTile__Image" />
                                                </div>
                                                <div className="sm-survey-template-tile__text-content">
                                                    <div className="wds-p-0 wds-grid__col">
                                                        <div className="wds-type--left wds-type--body">
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--card-title sm-survey-template-tile__title sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Customer Satisfaction Survey Template</span></div>
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--body-sm sm-survey-template-tile__description sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Your customers can make or break your business. Hear from them directly about what you're doing well and what you need to improve.</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div role="button" className="sm-base-tile sm-survey-template-tile"  data-testid="SurveyTemplateTile_Container">
                                        <div className="wds-h-100 sm-base-tile__container">
                                            <div className="sm-survey-template-tile__inner wds-p-0">
                                                <div className="sm-survey-template-tile__image-content wds-flex wds-flex-y--center">
                                                    <img className="sm-survey-template-tile__stock-image" src="//cdn.smassets.net/assets/smweb/coreweb/app/pages/CreateSurvey/StockImages/images/customer_service_template.8a5eeefb.jpg" alt="Customer Service Template" data-testid="SurveyTemplateTile__Image"/>
                                                </div>
                                                <div className="sm-survey-template-tile__text-content">
                                                    <div className="wds-p-0 wds-grid__col">
                                                        <div className="wds-type--left wds-type--body">
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--card-title sm-survey-template-tile__title sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Customer Service Template</span></div>
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--body-sm sm-survey-template-tile__description sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Your customers can make or break your business. Hear from them directly about what you're doing well and what you need to improve.</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div role="button" className="sm-base-tile sm-survey-template-tile"  data-testid="SurveyTemplateTile_Container">
                                        <div className="wds-h-100 sm-base-tile__container">
                                            <div className="sm-survey-template-tile__inner wds-p-0">
                                                <div className="sm-survey-template-tile__image-content wds-flex wds-flex-y--center">
                                                    <img className="sm-survey-template-tile__stock-image" src="//cdn.smassets.net/assets/smweb/coreweb/app/pages/CreateSurvey/StockImages/images/net_promoter_score_template.918c2ae4.jpg" alt="Net Promoter® Score (NPS) Template" data-testid="SurveyTemplateTile__Image" />
                                                </div>
                                                <div className="sm-survey-template-tile__text-content">
                                                    <div className="wds-p-0 wds-grid__col">
                                                        <div className="wds-type--left wds-type--body">
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--card-title sm-survey-template-tile__title sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Net Promoter® Score (NPS) Template</span></div>
                                                            <div className="wds-grid__row wds-m-0"><span className="wds-type--body-sm sm-survey-template-tile__description sm-truncate--multi-line" /*style={{WebkitLineClamp: '2'}}*/>Gather customer feedback using Net Promoter® Score. (Net Promoter Score is a trademark of Satmetrix Systems, Inc, F. Reichheld, and Bain &amp; Company)</span></div>
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

                </div>

                {/*Customer Feedback*/}
                {/* end grid view */}

            </div>
        );
    }
};
export default SurveyFeedbackGrid;