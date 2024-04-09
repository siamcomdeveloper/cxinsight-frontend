/* eslint-disable import/first */
import * as React from "react";
import Collector from '../../models/collector';
import { Form, Input, Button, Spin, Tooltip, Icon} from 'antd';
import { FormComponentProps } from "antd/lib/form";
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
import RichTextEditor from "../RichTextEditor";
import { History } from 'history';

const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
  collector: Collector;
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
  isLoading: boolean;
  fontColor: any;
  collector: Collector;
  backgroundColor: any;
  displayColorPicker: any;
  color: any;
}

class EditForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      this.state = {
          isLoading: true,
          fontColor: [],
          collector: this.props.collector,
          backgroundColor: this.props.collector.color_theme ? this.props.collector.color_theme : 'dodgerblue',
          displayColorPicker: false,
          color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
          },
      }
      this.onFieldValueChange = this.onFieldValueChange.bind(this);
    }

    componentDidMount() { 

        // console.log('CreateForm messageEditForm this.state.collector', this.state.collector);
        const jwt = getJwtToken();
            
        BaseService.getJSON(this.props.match.params.xSite, "/color", '', jwt).then((rp) => {
            try{
                if (rp.Status) {

                    // const colors = rp.Data.result.recordset;
                    const colors = rp.Data.result.recordset.map((colorData: any) => {return colorData.hex_code;});
                    // console.log('colors', colors);
                    
                    this.setState({
                        fontColor: colors
                    }, () => {
                        this.setState({ isLoading: false }, () =>{ 

                          this.props.form.setFieldsValue({
                              subject: this.state.collector.subject,
                              message: this.state.collector.message,
                          }, () => { /*console.log('after')*/ });

                        });
                    });

                } else {
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm componentDidMount BaseService.getJSON /color else', message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                }
            }catch(error){
                toastr.error('Something went wrong!, please refresh the page or try again later.'); 
                BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: 'surveyRenameForm componentDidMount BaseService.getJSON /color catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            }
        });

    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    // }
    
    selectUpdate = (obj: any, selectKeys: any, params: any) => {
        const clone = Object.assign({}, obj);

      // console.log(selectKeys);

        for (const key in obj) {
            let matched = false;

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
          // console.log('check', this.state.collector);
          // console.log('check', this.state.backgroundColor);
          const jwt = getJwtToken();
          BaseService.update(this.props.match.params.xSite, "/collector/", this.state.collector.id, this.selectUpdate(this.state.collector, ['subject', 'message', 'color_theme'], [this.state.collector.subject, this.state.collector.message, this.state.backgroundColor]), jwt).then(
              (rp) => {
                  try{
                      if (rp.Status) {
                          toastr.success('Message Updated!');
                          setTimeout(function(){ window.location.reload(); }, 500);
                      } else {
                          // toastr.error(rp.Messages);
                          toastr.error('Something went wrong!, please refresh the page or try again later.');
                          BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `messageEditForm check BaseService.update /collector/${this.state.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                      }
                  }catch(error){ 
                      toastr.error('Something went wrong!, please refresh the page or try again later.');
                      BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `messageEditForm check catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                  }
              }
          );

        }
      });
    };
  
    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        this.onFieldValueChange(e.target.id, e.target.value);
    }

    onRichChange = (id: any, richTextEditor: any) => {
        this.onFieldValueChange(id, richTextEditor.html.trim()); 
        this.props.form.setFieldsValue({
            [id]: richTextEditor.length === 1 ? '' :richTextEditor.html.trim()
        });
    };
    
    onTextAreaChange = (e: any) => {
      this.onFieldValueChange(e.target.id, e.target.value)
    };

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

    handleClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color: any) => {
        // console.log('handleChange color', color);
        // console.log('handleChange color.hex', color.hex);
        this.setState({ color: color.rgb, backgroundColor: color.hex })
    };

    render() {
      // console.log('this.state.collector', this.state.collector);
      const { getFieldDecorator } = this.props.form;

      const label = parseInt(this.state.collector.type) === 3 ? 'SUBJECT:' : 'SENDER NAME:';

      const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
            backgroundColor: this.state.backgroundColor
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          // popover: {
          //   position: 'absolute',
          //   zIndex: 2,
          // },
          // cover: {
          //   position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px',
          // },
        },
      });

      if (this.state.isLoading) {
          return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
      }
      return (
        <div>
          <Form.Item {...formItemLayout} >
            <label className="sm-label" style={{ marginBottom: '0' }}>MESSAGE:
              &nbsp;
              
            </label>
            {getFieldDecorator('message', {
              rules: [
                {
                  required: true,
                  message: 'Please input the message',
                },
              ],
            })(<TextArea className="wds-textarea wds-textarea--sm wds-textarea--stretched" onChange={this.onTextAreaChange} placeholder="Survey completion redirect url" rows={2}/>)}
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
  
const messageEditForm = Form.create<Props>()(EditForm);
export default messageEditForm;
