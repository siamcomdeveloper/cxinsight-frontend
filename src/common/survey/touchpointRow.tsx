import React from 'react';
import 'antd/dist/antd.css';

interface IProps {
    touchpoint: any;  
    showModal: (visibleStatus: any, touchpoint: any) => void;
}

const TouchpointRow: React.StatelessComponent<IProps> = (props) => { 

    return (
        <div role="button" onClick={() =>  props.showModal(true, props.touchpoint)} className="sm-base-tile sm-survey-template-tile"  data-testid="SurveyTemplateTile_Container">
            <div className="wds-h-100 sm-base-tile__container">
                <div className="sm-survey-template-tile__inner wds-p-0">
                    
                    <div className="sm-survey-template-tile__image-content wds-flex wds-flex-y--center">
                    <img className="sm-survey-template-tile__stock-image" src={props.touchpoint.image} alt={props.touchpoint.image_description}/*src="https://dl.dropboxusercontent.com/s/c29ap3a99kaqabf/crm.png?dl=0" alt="Customer Satisfaction Survey Template"*//>
                    </div>

                    <div className="sm-survey-template-tile__text-content">
                        <div className="wds-p-0 wds-grid__col">
                            <div className="wds-type--left wds-type--body">
                                <div className="wds-grid__row wds-m-0"><span className="wds-type--card-title sm-survey-template-tile__title sm-truncate--multi-line">{props.touchpoint.display_name}</span></div>
                                <div className="wds-grid__row wds-m-0"><span className="wds-type--body-sm sm-survey-template-tile__description sm-truncate--multi-line">{props.touchpoint.descriptions}</span></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default TouchpointRow;