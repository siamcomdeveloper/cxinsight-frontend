import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import SurveyProgressBarForm from '../form/surveyProgressBarForm';
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

class surveyProgressBarModal extends React.Component<IProps, IState> { 

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
                    title={<div>Progress Bar <Tooltip title={'Progress Bar คือ Indicator เพื่อบอกว่าผู้ทำเซอร์เวย์ทำไปได้มากน้อยแค่ไหน'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyProgressBarForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyProgressBarModal;