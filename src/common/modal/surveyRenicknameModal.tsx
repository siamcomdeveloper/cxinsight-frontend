import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import SurveyReNicknameForm from '../form/surveyReNicknameForm';
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

class surveyReNicknameModal extends React.Component<IProps, IState> { 

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
                    // title={<div>Name Your survey nickname <Tooltip title={'ผู้ใช้งานระบบเท่านั้นที่จะเห็นชื่อที่ต้ังนี้ (ผู้ทำแบบสอบถามจะไม่เห็นชื่อที่ตั้งนี้)'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                    title={<div>Name Your survey nickname</div>}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyReNicknameForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyReNicknameModal;