import React from 'react';
import { Modal } from 'antd';
import SurveyAddLogoForm from '../form/surveyAddLogoForm';
import Surveys from '../../models/surveys';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    // history: History,
    visible: boolean,
    handleSaveQuestion: () => void;
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

class surveyAddLogoModal extends React.Component<IProps, IState> { 

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

    handleSaveQuestion = () => {
        this.setState({
            visible: false,
        });
        this.props.handleSaveQuestion();
    };

    render() {
        return (

            <div>

                <Modal 
                    className="create-survey-modal add-logo-modal"
                    title="Add Your Logo or Banner"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyAddLogoForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                    handleSaveQuestion={this.handleSaveQuestion}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyAddLogoModal;