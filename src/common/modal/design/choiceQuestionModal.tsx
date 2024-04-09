import React from 'react';
import { Modal } from 'antd';
import Surveys from '../../../models/surveys';
import ChoiceQuestionForm from '../../form/design/choiceQuestionForm';
import { History } from 'history';

interface IProps {
    survey: Surveys,
    // history: History,
    handleSaveQuestion: () => void;

    question: any,
    visible: boolean,
    defaultActiveKey: any;
    choices: any;
    choicesEN: any;
    choicesHtml: any;
    choicesENHtml: any;
    weights: any;

    imageType: any;
    imageLabel: any;
    imageLabelHtml: any;
    imageSource: any;

    weightAnswer: any;
    toPage: any;
    toQuestion: any;

    oneOnPage: any;

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

class ChoiceQuestionModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('ChoiceQuestionModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('ChoiceQuestionModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('ChoiceQuestionModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('ChoiceQuestionModal handleCancel', this.state.visible);
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
                    title={`Q${this.props.question.order_no} ${this.props.question.question_label} `}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <ChoiceQuestionForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                    question={this.props.question}
                    defaultActiveKey={this.props.defaultActiveKey}
                    handleCancel={this.handleCancel}
                    handleSaveQuestion={this.handleSaveQuestion}
                    choices={this.props.choices}
                    choicesEN={this.props.choicesEN}
                    choicesHtml={this.props.choicesHtml}
                    choicesENHtml={this.props.choicesENHtml}
                    weights={this.props.weights}

                    imageType={this.props.imageType}
                    imageLabel={this.props.imageLabel}
                    imageLabelHtml={this.props.imageLabelHtml}
                    imageSource={this.props.imageSource}

                    weightAnswer={this.props.weightAnswer}
                    toPage={this.props.toPage}
                    toQuestion={this.props.toQuestion}

                    oneOnPage={this.props.oneOnPage}
                />

                </Modal>

            </div>
        );
    }
};
export default ChoiceQuestionModal;