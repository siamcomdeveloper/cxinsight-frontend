import React from 'react';
import { Modal } from 'antd';
import NewQuestionForm from '../../form/design/newQuestionForm';
import { History } from 'history';

interface IProps {
    survey: any;
    question: any;
    handleSaveQuestion: () => void;
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
    visible: boolean,
    questionTypeLabel: any,
}

class NewQuestionModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible,
            questionTypeLabel: ''
        };
      // console.log('NewQuestionModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('NewQuestionModal componentDidMount');
        this.setQuestionTypeLabel(this.props.question.typeId);
    }

    setQuestionTypeLabel(typeId: any){
        //button save text
        switch(typeId){
            case 1 :  this.setState({ questionTypeLabel: 'Star Rating' }); break;
            case 2 :  this.setState({ questionTypeLabel: 'Multiple Choice' }); break;
            case 3 :  this.setState({ questionTypeLabel: 'Checkboxes' }); break;
            case 4 :  this.setState({ questionTypeLabel: 'Net Promoter Score' }); break;
            case 5 :  this.setState({ questionTypeLabel: 'Comment Box' }); break;
            case 6 :  this.setState({ questionTypeLabel: 'Dropdown' }); break;
        }
    }

    componentWillReceiveProps(props: any) {
      // console.log('NewQuestionModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('NewQuestionModal handleCancel', this.state.visible);
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
                    title={`${this.state.questionTypeLabel}`}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <NewQuestionForm
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                    question={this.props.question}
                    handleCancel={this.handleCancel}
                    handleSaveQuestion={this.handleSaveQuestion}
                />

                </Modal>

            </div>
        );
    }
};
export default NewQuestionModal;