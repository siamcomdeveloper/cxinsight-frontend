import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import SurveyFooterDescriptionForm from '../form/surveyFooterDescriptionForm';
import Surveys from '../../models/surveys';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    // history: History,
    visible: boolean,
    pageNo: number,
    history: History,
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
    visible: boolean
}

class surveyFooterDescriptionModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('collectorEditModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('collectorEditModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('collectorEditModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('collectorEditModal handleCancel', this.state.visible);
    };

    render() {
        return (

            <div>

                <Modal 
                    className="create-survey-modal"
                    // title="Name Your Footer description"
                    title={
                        <div>Name Your Footer description &nbsp;
                            
                        </div>
                    }
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyFooterDescriptionForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                    pageNo={this.props.pageNo}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyFooterDescriptionModal;