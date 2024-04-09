/* eslint-disable import/first */
import * as React from "react";
import Collector from '../../models/collector';
import { Form, Input, Button, Select, Tooltip, Icon } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import { History } from 'history';
const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};
// const formTailLayout = {
//     labelCol: { span: 4 },
//     wrapperCol: { span: 8, offset: 4 },
// };

interface Props extends FormComponentProps{
  collector: Collector;
  listProjects: any;
  collectorType: string;
  // onFieldValueChange: (fieldName: any, value: any) => void;
  // onSave: () => void;
  history: History;
  match:{ 
      isExact: boolean
      params: {
          xSite: string
      },
      path: string,
      url: string,
  }
}
interface IState{
  collector: Collector;
  // surveyTemplate: string;
  // surveyTemplateId: string;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      // console.log('constructor', props);

      this.state = {
          collector: this.props.collector
      }
    }

    componentDidMount() { 

    // console.log('CreateForm componentDidMount');
      // console.log(this.props);
      // console.log(this.props.surveyTemplate);
      // console.log(this.props.surveyTemplateId);
      // this.setState({
      //     surveyTemplate: this.props.surveyTemplate,
      //     surveyTemplateId: this.props.surveyTemplateId
      // });

      // console.log(this.state.surveyTemplate);
      // console.log(this.state.surveyTemplateId);
      // this.setState({ collector: this.props.collector });

      this.props.form.setFieldsValue({
        name: this.props.collector.name,
        // project_id: this.props.collector.project_id,
        // template_id: this.state.surveyTemplate
      }, () => { /*console.log('after')*/ });
      // console.log('before');

    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    //     // console.log(this.state);
    //     // this.setState({
    //     //     surveyTemplate: props.surveyTemplate,
    //     //     surveyTemplateId: props.surveyTemplateId
    //     // });
    //     // this.props.form.setFieldsValue({
    //     //   // name: this.props.surveys.name,
    //     //   template_id: this.props.surveyTemplate
    //     // }, () => console.log('after'));
    //     // console.log('before');
    // }
    
    // state = {
    //   checkNick: false,
    // };

    selectUpdate = (obj: any, selectKeys: any, params: any) => {
        const clone = Object.assign({}, obj);

      // console.log(selectKeys);

        for (const key in obj) {
            let matched = false;

            // obj.map((e, i) =>(<div key={i}>{e}</div>))

            selectKeys.forEach((selectKey: any, index: any) => {
                // console.log('index', index);
                if(selectKey === key){
                    matched = true;
                    clone[selectKey] = params[index];
                }
            });
            if(!matched) {
                delete clone[key];
                // console.log('delete!');
            }
        }

        return clone;
    }
  
    check = () => {
      this.props.form.validateFields(err => {
        if (!err) {
          // console.info('success');

          // console.log('success', this.state.collector);

          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['nickname', 'name', 'project_id'], [this.state.collector.nickname, this.state.collector.name, this.state.collector.project_id]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          // console.log(rp);
                          toastr.success(rp.Messages);
                          setTimeout(function(){ window.location.reload(); }, 500);
                            // toastr.success('Collector Updated!');
                            // window.location.reload();
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `loginForm handleSubmit BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){ 
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `loginForm handleSubmit catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                  }
              }
          );

        }
      });
    };
  
    // handleChange = (e: { target: { checked: any; }; }) => {
    //   this.setState(
    //     {
    //       checkNick: e.target.checked,
    //     },
    //     () => {onSave
    //       this.props.form.validateFields(['nickname'], { force: true });
    //     },
    //   );
    // };

    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      // console.log('onChange id', e.target.id);
      // console.log('onChange value', e.target.value);
      this.onFieldValueChange(e.target.id, e.target.value)
    }

    // onChangeNum = (e: React.ChangeEvent<HTMLInputElement>)=> {
    //   this.props.onChange(e.target.id, parseInt(e.target.value))
    // }
  
    // handleSelectChange = (status: any) => {
    // // console.log(`handleSelectChange`, status);

    //   this.props.onChange('template_id', status, status);
    //   // this.props.onChange('template_id', parseInt(status));
    //   this.setState({
    //       surveyTemplateId: status
    //     }
    // );
  // };
    onFieldValueChange = (fieldName: string, value: any) => { 
      const nextState = {
          ...this.state,
          collector: {
              ...this.state.collector,
              [fieldName]: value,
          }
      };

      this.setState(nextState);
    // console.log('Create onFieldValueChange', this.state.collector);
    }

    onSelectChange = (projectId: any)=> {
      // console.log('onSelectChange projectId', projectId);
      this.onFieldValueChange('project_id', projectId);
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <Form.Item  style={{ paddingBottom: 0 }} >
            <label className="label-create">Nickname: </label><Tooltip title={'ผู้ใช้งานระบบเท่านั้นที่จะเห็นชื่อที่ต้ังนี้'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip>
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }}>
            {getFieldDecorator('nickname', {
              initialValue: this.state.collector.nickname,
              rules: [
                {
                  required: true,
                  message: 'Please input the collector nickname',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Collector nickname" />)}
          </Form.Item>

          <Form.Item style={{ paddingBottom: 0 }} >
            <label className="label-create">Display name: </label>
            {/* <Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อที่ต้ังนี้'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}

            <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                title={`ผู้ทำแบบสอบถามจะเห็นชื่อที่ต้ังนี้

                + ผู้ใช้งานระบบสามารถใส่ ตัวแปร สำหรับแสดงผลข้อมูลได้ดังนี้
                - ชื่อโครงการ : \${ProjectName}
                - ชื่อช่องทางจัดเก็บ : \${CollectorName}
                - ชื่อ (ผู้ทำแบบสอบถาม) : \${FirstName}
                - นามสกุล (ผู้ทำแบบสอบถาม) : \${LastName}

                * โดยระบบจะดึงข้อมูลจากช่องทางการจัดเก็บ (Collector)
                ตามที่ผู้ใช้งานระบบได้ตั้งค่าไว้แทน ตัวแปร ข้างต้น`}>
                <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
            </Tooltip> 

          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }} >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the collector display name',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Collector display name" />)}
          </Form.Item>

          <Form.Item label="Project:">
            {getFieldDecorator("project_id", {
                initialValue: this.state.collector.project_id,
                rules: [
                  { required: false, type: "number", message: 'Please select a Project', whitespace: true },
                ],
            })(
              <Select /*defaultValue={this.props.collector.project_id}*/ onChange={this.onSelectChange} placeholder="Please select a Project">
                { this.props.listProjects.map((project: any) => <Select.Option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}</Select.Option> )}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Collector Type:" >
            {/* <Input className="wds-input wds-input--md wds-input--stretched" disabled={true} value={this.props.collectorType} /> */}
            <label>{this.props.collectorType}</label>
          </Form.Item>

          <footer className="wds-modal__foot">
            <div className="wds-modal__actions-right">
              <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.check}>
                APPLY
              </Button>
            </div>
          </footer>
        </div>
      );
    }
  }
  
const CollectorEditForm = Form.create<Props>()(EditForm);
export default CollectorEditForm;
