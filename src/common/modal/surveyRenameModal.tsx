import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
import SurveyRenameForm from '../form/surveyRenameForm';
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

class surveyRenameModal extends React.Component<IProps, IState> { 

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
                    title={
                        <div>Name Your survey &nbsp;
                            {/* <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                                title={`ผู้ใช้งานระบบสามารถใส่ ตัวแปร สำหรับแสดงผลข้อมูลได้ดังนี้
                                - ชื่อโครงการ : \${ProjectName}
                                - ชื่อช่องทางจัดเก็บ : \${CollectorName}
                                - ชื่อ (ผู้ทำแบบสอบถาม) : \${FirstName}
                                - นามสกุล (ผู้ทำแบบสอบถาม) : \${LastName}
                                *โดยระบบจะดึงข้อมูลจากช่องทางการจัดเก็บ (Collector) ที่ผู้ใช้งานระบบได้ตั้งค่าไว้แทน ตัวแปร ข้างต้น`}>
                                <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
                            </Tooltip>  */}
                        </div>
                    }
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >

                <SurveyRenameForm 
                    history={this.props.history} match={this.props.match}
                    survey={this.props.survey}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyRenameModal;