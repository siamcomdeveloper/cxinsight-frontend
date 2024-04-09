import React from 'react';
import { Modal } from 'antd';
import Surveys from '../../models/surveys';
import InfoQuestionForm from '../form/design/infoQuestionForm';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    // history: History,
    handleSaveQuestion: () => void;

    visible: boolean,
    defaultActiveKey: any;

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

class RatingQuestionModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('RatingQuestionModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('RatingQuestionModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('RatingQuestionModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('RatingQuestionModal handleCancel', this.state.visible);
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
                    className="design-question-modal"
                    title={`Client Infomation Form`}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <InfoQuestionForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                    defaultActiveKey={this.props.defaultActiveKey}
                    handleCancel={this.handleCancel}
                    handleSaveQuestion={this.handleSaveQuestion}
                />

                </Modal>

            </div>
        );
    }
};
export default RatingQuestionModal;