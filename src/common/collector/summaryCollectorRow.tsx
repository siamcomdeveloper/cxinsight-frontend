import React from 'react';
import Collector from "../../models/collector";  
import 'antd/dist/antd.css';
import { History } from 'history';

interface IProps { 
    collector: Collector;  
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

const SummaryCollectorRow: React.StatelessComponent<IProps> = (props) => { 

    function Link() {
        // console.log("Link click", props.collector.id);

        let collectorURL = '';
        switch (parseInt(props.collector.type)) {
            case 1: //1 = Weblink
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/weblink/${props.collector.id}`;
                break;
            case 2: //2  = mail
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/email/${props.collector.id}`;
                break;
            default:
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/weblink/${props.collector.id}`;
                break;
        }
        
        // console.log(collectorURL);
        return collectorURL;
        // window.location.replace(collectorURL);
    }

    function collectorStatus(status: any) {
        // console.log('collectorStatus', status);
        switch (status) {
            case 1: //1 = NOT CONFIGURED
            return <span className="sm-collector-card__status-badge sm-collector-card__status-badge--warning">NOT CONFIGURED</span>
            case 2: //2 = OPEN
            return <span className="sm-collector-card__status-badge sm-collector-card__status-badge--primary">OPEN</span>
            case 3: //3 = CLOSED
            default:
            return <span className="sm-collector-card__status-badge sm-collector-card__status-badge--secondary">CLOSED</span>
        }
    }
    
    return (
        <div className="wds-card sm-collector-card sm-survey-summary__card">
            <div className="wds-card__body">
                <div className="sm-collector-card__responses-container wds-float--right">
                    <div className="sm-collector-card__responses-count font-number-custom">{props.collector.responses}</div>
                        <div className="sm-collector-card__responses-label wds-m-t-1"><span className="wds-type--body-sm"><span>RESPONSES <br/> COLLECTED</span></span>
                    </div>
                </div>
                <div className="wds-float--left sm-collector-card__info">
                    <div className="wds-type--card-title wds-m-t-3 sm-collector-card__title">
                        <a href={Link()} title="Email Invitation 1">{props.collector.nickname}</a>
                    </div>
                    <div className="sm-collector-card__date-created">
                        <span className="wds-type--body-sm">Created: {props.collector.created_date}</span>
                    </div>
                </div>
                <div className="sm-collector-card__status">
                    {collectorStatus(props.collector.status)}
                    {/* <span className="sm-collector-card__status-badge sm-collector-card__status-badge--primary">OPEN</span> */}
                </div>
            </div>
        </div>
    );
};
export default SummaryCollectorRow;