import React from 'react';
import { Modal } from 'antd';
import SurveyCompletionRedirectForm from '../form/surveyCompletionRedirectForm';
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

class surveyCompletionRedirectFormModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('surveyCompletionRedirectFormModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('surveyCompletionRedirectFormModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('surveyCompletionRedirectFormModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('surveyCompletionRedirectFormModal handleCancel', this.state.visible);
    };

    render() {
        return (

            <div>

                <Modal 
                    className="create-survey-modal"
                    title="Survey Completion Redirect URL"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyCompletionRedirectForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyCompletionRedirectFormModal;