import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import SurveyEndOfSurveyMessageForm from '../form/surveyEndOfSurveyMessageForm';
import Surveys from '../../models/surveys';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    // history: History,
    visible: boolean,
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

class surveyEndOfSurveyMessageModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('surveyEndOfSurveyMessageModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('surveyEndOfSurveyMessageModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('surveyEndOfSurveyMessageModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('surveyEndOfSurveyMessageModal handleCancel', this.state.visible);
    };

    render() {
        return (

            <div>

                <Modal 
                    className="create-survey-modal add-logo-modal"
                    // title="End Of Survey Message"
                    title={
                        <div>End Of Survey Message &nbsp;
                            
                        </div>
                    }
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyEndOfSurveyMessageForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyEndOfSurveyMessageModal;