import React from 'react';
import BaseService from '../../service/base.service';
import { History } from 'history';

interface IProps {
    question: any;
    answerInfoHandler: (index: any, answer: any, requiredStatus: any) => void;
    requiredLabelStatus: any;
    answer: any;
    fontStyles: any;
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
interface IState {
    answer: any,
    answerText: any,
    requiredLabelState: any,
}

class DropdownQuestion extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            answer: props.answer,
            answerText: '',
            requiredLabelState: false,
        };
        // console.log('infoDropdownInstitutionQuestion constructor', props);
    }

    public componentDidMount() { 
        //console.log('DropdownQuestion componentDidMount');
        // if(this.props.question.imageEnabled) this.renderImage(); 
        // this.renderElement();
    }

    componentWillReceiveProps(props: any) {
     //console.log('infoDropdownQuestion componentWillReceiveProps', props);
        this.setState({ requiredLabelState: props.requiredLabelStatus });
    }

    onMouseClickDropdownOptionHandler = (e : any) => {
        try{
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target', e.target);
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target id', e.target.id);
            // console.log('infoDropdownInstitutionQuestion click Dropdown Option target value', e.target.value);

            const value = e.target.value;

            // console.log('click Dropdown value', value);

            this.setState({
                answer: value,
                requiredLabelState: (value === '' || value === 'other') && this.props.question.required,
            },  () => { 
                    // console.log(`this.state.answer ${this.state.answer}`);
                    if(this.state.answer === 'other') this.props.answerInfoHandler(this.props.question.index, '', true);
                    else this.props.answerInfoHandler(this.props.question.index, this.state.answer, this.state.answer === '' ? true : false);
                } 
            );
        }catch(error){ 
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlogclient/", { method: `infoDropdownQuestion onMouseClickDropdownOptionHandler catch`, message: `catch: ${error}` }).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    onChangeTextHandler = (e : any) => {
        //console.log('change text currentTarget id', e.currentTarget.id);
        if(e.currentTarget.id === 'question-'+this.props.question.name+'-text' ){
            // console.log('change text currentTarget value', e.currentTarget.value);
            this.setState({ 
                answerText: e.currentTarget.value,
                requiredLabelState: e.currentTarget.value.trim() === ''
            }, () => { 
                //console.log('change text setState value', this.state.answer); 
                this.props.answerInfoHandler(this.props.question.index, this.state.answerText, this.state.answerText.trim() === '' ? true : false);
            });
        }
    }

    render() {
        //console.log('render');
        return (
            <div className="question-single-choice-select qn question menu"> 
                <fieldset className={ "question-fieldset question-legend" } style={{ marginBottom: 30 }}>
                    <h4 className={ this.state.requiredLabelState ? "question-validation-theme" : "question-validation-theme hidden" } style={{ fontSize: this.props.question.globalFontSize }}>
                        <span className="question-validation-icon">!</span>
                        <span className="user-generated required-label" style={{ display: 'inline', fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                            {this.props.question.requiredLabel}
                        </span>
                    </h4>
                    <h4 className="question-title-container">
                        <span className={ this.props.question.required ? "required-asterisk notranslate" : "required-asterisk notranslate hidden" } style={{ display : 'block' }}>*</span>
                        <span className="user-generated notranslate" style={{ fontFamily: this.props.question.globalFont, fontSize: this.props.question.globalFontSize }}>
                            {this.props.question.label}
                        </span>
                    </h4>

                    <div className="question-body clearfix notranslate">
                        <select id="question-institution-name-dropdown-option" className="select no-touch" style={this.props.fontStyles} defaultValue={this.state.answer} onChange={ (e) => this.onMouseClickDropdownOptionHandler(e) }>
                            <option value="" className="user-generated">กรุณาเลือกชื่อสถาบันของท่าน</option>
                            <option value="โรงเรียนกาญจนาภิเษกวิทยาลัย กระบี่" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย กระบี่</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย กาฬสินธุ์" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย กาฬสินธุ์</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย ฉะเชิงเทรา" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย ฉะเชิงเทรา</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย นครปฐม (พระตำหนักสวนกุหลาบมัธยม)" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย นครปฐม (พระตำหนักสวนกุหลาบมัธยม)</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย เพชรบูรณ์" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย เพชรบูรณ์</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย สุราษฎร์ธานี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย สุราษฎร์ธานี</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย สุพรรณบุรี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย สุพรรณบุรี</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย อุทัยธานี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย อุทัยธานี</option>
<option value="โรงเรียนเฉลิมพระเกียรติพระบาทสมเด็จพระเจ้าอยู่หัวภูมิพลอดุลยเดชฯ ทรงครองสิริราชสมบัติครบ ๕๐ ปี จังหวัดสกลนคร" className="user-generated">โรงเรียนเฉลิมพระเกียรติพระบาทสมเด็จพระเจ้าอยู่หัวภูมิพลอดุลยเดชฯ ทรงครองสิริราชสมบัติครบ ๕๐ ปี จังหวัดสกลนคร</option>
<option value="โรงเรียนแก่นนครวิทยาลัย" className="user-generated">โรงเรียนแก่นนครวิทยาลัย</option>
<option value="โรงเรียนแก่นนครวิทยาลัย ๒" className="user-generated">โรงเรียนแก่นนครวิทยาลัย ๒</option>
<option value="โรงเรียนขอนแก่นวิทยายน" className="user-generated">โรงเรียนขอนแก่นวิทยายน</option>
<option value="โรงเรียนขอนแก่นวิทยายน ๒" className="user-generated">โรงเรียนขอนแก่นวิทยายน ๒</option>
<option value="โรงเรียนขอนแก่นวิทยายน ๓" className="user-generated">โรงเรียนขอนแก่นวิทยายน ๓</option>
<option value="โรงเรียนคณะราษฎร์บำรุง ๑ จังหวัดยะลา" className="user-generated">โรงเรียนคณะราษฎร์บำรุง ๑ จังหวัดยะลา</option>
<option value="โรงเรียนคณะราษฎร์บำรุง ๒ จังหวัดชัยนาท" className="user-generated">โรงเรียนคณะราษฎร์บำรุง ๒ จังหวัดชัยนาท</option>
<option value="โรงเรียนคณะราษฎร์บำรุง ๓ จังหวัดปทุมธานี" className="user-generated">โรงเรียนคณะราษฎร์บำรุง ๓ จังหวัดปทุมธานี</option>
<option value="โรงเรียนคณะราษฎรบำรุง จังหวัดยะลา" className="user-generated">โรงเรียนคณะราษฎรบำรุง จังหวัดยะลา</option>
<option value="โรงเรียนคณะราษฎรบำรุง ๒" className="user-generated">โรงเรียนคณะราษฎรบำรุง ๒</option>
<option value="มหาวิทยาลัยคริสเตียน" className="user-generated">มหาวิทยาลัยคริสเตียน</option>
<option value="มหาวิทยาลัยพายัพ" className="user-generated">มหาวิทยาลัยพายัพ</option>
<option value="โรงเรียนกรุงเทพคริสเตียนวิทยาลัย" className="user-generated">โรงเรียนกรุงเทพคริสเตียนวิทยาลัย</option>
<option value="โรงเรียนกุญแจคริสเตียนวิทยา" className="user-generated">โรงเรียนกุญแจคริสเตียนวิทยา</option>
<option value="โรงเรียนเคนเน็ตแม็คเคนซี" className="user-generated">โรงเรียนเคนเน็ตแม็คเคนซี</option>
<option value="โรงเรียนคริสเตียนเยอรมันเชียงใหม่" className="user-generated">โรงเรียนคริสเตียนเยอรมันเชียงใหม่</option>
<option value="โรงเรียนเจริญราษฎร์" className="user-generated">โรงเรียนเจริญราษฎร์</option>
<option value="โรงเรียนเชียงรายวิทยาคม" className="user-generated">โรงเรียนเชียงรายวิทยาคม</option>
<option value="โรงเรียนเชียงใหม่คริสเตียน" className="user-generated">โรงเรียนเชียงใหม่คริสเตียน</option>
<option value="โรงเรียนดาราวิทยาลัย" className="user-generated">โรงเรียนดาราวิทยาลัย</option>
<option value="โรงเรียนตรังคริสเตียนศึกษา" className="user-generated">โรงเรียนตรังคริสเตียนศึกษา</option>
<option value="โรงเรียนน่านคริสเตียนศึกษา" className="user-generated">โรงเรียนน่านคริสเตียนศึกษา</option>
<option value="โรงเรียนนานาชาติเชียงใหม่" className="user-generated">โรงเรียนนานาชาติเชียงใหม่</option>
<option value="โรงเรียนบึงกาฬคริสเตียน" className="user-generated">โรงเรียนบึงกาฬคริสเตียน</option>
<option value="โรงเรียนบำรุงวิทยา" className="user-generated">โรงเรียนบำรุงวิทยา</option>
<option value="โรงเรียนปรินส์รอยแยลส์วิทยาลัย" className="user-generated">โรงเรียนปรินส์รอยแยลส์วิทยาลัย</option>
<option value="โรงเรียนปรินส์รอยแยลส์วิทยาลัยเวียงป่าเป้า" className="user-generated">โรงเรียนปรินส์รอยแยลส์วิทยาลัยเวียงป่าเป้า</option>
<option value="โรงเรียนผดุงราษฎร์" className="user-generated">โรงเรียนผดุงราษฎร์</option>
<option value="โรงเรียนรังษีวิทยา" className="user-generated">โรงเรียนรังษีวิทยา</option>
<option value="โรงเรียนวัฒนาวิทยาลัย" className="user-generated">โรงเรียนวัฒนาวิทยาลัย</option>
<option value="โรงเรียนวิชชานารี" className="user-generated">โรงเรียนวิชชานารี</option>
<option value="โรงเรียนศรีธรรมราชศึกษา" className="user-generated">โรงเรียนศรีธรรมราชศึกษา</option>
<option value="โรงเรียนศรีธรรมราชศึกษา สุราษฎร์ธานี" className="user-generated">โรงเรียนศรีธรรมราชศึกษา สุราษฎร์ธานี</option>
<option value="โรงเรียนสว่างวิทยา" className="user-generated">โรงเรียนสว่างวิทยา</option>
<option value="โรงเรียนสหคริสเตียนศึกษา" className="user-generated">โรงเรียนสหคริสเตียนศึกษา</option>
<option value="โรงเรียนสัจจพิทยา" className="user-generated">โรงเรียนสัจจพิทยา</option>
<option value="โรงเรียนสืบนทีธรรม" className="user-generated">โรงเรียนสืบนทีธรรม</option>
<option value="โรงเรียนสุริยวงศ์" className="user-generated">โรงเรียนสุริยวงศ์</option>
<option value="โรงเรียนอรุณประดิษฐ" className="user-generated">โรงเรียนอรุณประดิษฐ</option>
<option value="โรงเรียนอุดรคริสเตียนวิทยา" className="user-generated">โรงเรียนอุดรคริสเตียนวิทยา</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดฉะเชิงเทรา" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดฉะเชิงเทรา</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดนครศรีธรรมราช" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดนครศรีธรรมราช</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดราชบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดราชบุรี</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดอุทัยธานี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดอุทัยธานี</option>
<option value="โรงเรียนกรุงเทพคริสเตียนวิทยาลัย" className="user-generated">โรงเรียนกรุงเทพคริสเตียนวิทยาลัย</option>
<option value="โรงเรียนเทพศิรินทร์" className="user-generated">โรงเรียนเทพศิรินทร์</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย</option>
<option value="โรงเรียนอัสสัมชัญ" className="user-generated">โรงเรียนอัสสัมชัญ</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กาญจนบุรี" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กาญจนบุรี</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กำแพงเพชร" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กำแพงเพชร</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ นครศรีธรรมราช" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ นครศรีธรรมราช</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ พะเยา" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ พะเยา</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ภูเก็ต" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ภูเก็ต</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ร้อยเอ็ด" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ร้อยเอ็ด</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ระยอง" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ระยอง</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ลพบุรี" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ลพบุรี</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ศรีสะเกษ" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ศรีสะเกษ</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ สมุทรสาคร" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ สมุทรสาคร</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ หนองบัวลำภู" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ หนองบัวลำภู</option>
<option value="โรงเรียนเซนต์ดอมินิก" className="user-generated">โรงเรียนเซนต์ดอมินิก</option>
<option value="โรงเรียนดอนบอสโกวิทยา อุดรธานี" className="user-generated">โรงเรียนดอนบอสโกวิทยา อุดรธานี</option>
<option value="โรงเรียนสารสิทธิ์พิทยาลัย" className="user-generated">โรงเรียนสารสิทธิ์พิทยาลัย</option>
<option value="โรงเรียนแสงทองวิทยา" className="user-generated">โรงเรียนแสงทองวิทยา</option>
<option value="โรงเรียนหัวหินวิทยาลัย" className="user-generated">โรงเรียนหัวหินวิทยาลัย</option>
<option value="วิทยาลัยเทคโนโลยีดอนบอสโก" className="user-generated">วิทยาลัยเทคโนโลยีดอนบอสโก</option>
<option value="วิทยาลัยเทคโนโลยีดอนบอสโก บ้านโป่ง" className="user-generated">วิทยาลัยเทคโนโลยีดอนบอสโก บ้านโป่ง</option>
<option value="โรงเรียนเซนต์คาเบรียล" className="user-generated">โรงเรียนเซนต์คาเบรียล</option>
<option value="โรงเรียนเซนต์หลุยส์ ฉะเชิงเทรา" className="user-generated">โรงเรียนเซนต์หลุยส์ ฉะเชิงเทรา</option>
<option value="โรงเรียนมงฟอร์ตวิทยาลัย" className="user-generated">โรงเรียนมงฟอร์ตวิทยาลัย</option>
<option value="โรงเรียนอัสสัมชัญ" className="user-generated">โรงเรียนอัสสัมชัญ</option>
<option value="โรงเรียนอัสสัมชัญเทคนิคนครพนม" className="user-generated">โรงเรียนอัสสัมชัญเทคนิคนครพนม</option>
<option value="โรงเรียนอัสสัมชัญธนบุรี" className="user-generated">โรงเรียนอัสสัมชัญธนบุรี</option>
<option value="โรงเรียนอัสสัมชัญนครราชสีมา" className="user-generated">โรงเรียนอัสสัมชัญนครราชสีมา</option>
<option value="โรงเรียนอัสสัมชัญพาณิชยการ" className="user-generated">โรงเรียนอัสสัมชัญพาณิชยการ</option>
<option value="โรงเรียนอัสสัมชัญระยอง" className="user-generated">โรงเรียนอัสสัมชัญระยอง</option>
<option value="โรงเรียนอัสสัมชัญลำปาง" className="user-generated">โรงเรียนอัสสัมชัญลำปาง</option>
<option value="โรงเรียนอัสสัมชัญศรีราชา" className="user-generated">โรงเรียนอัสสัมชัญศรีราชา</option>
<option value="โรงเรียนอัสสัมชัญสมุทรปราการ" className="user-generated">โรงเรียนอัสสัมชัญสมุทรปราการ</option>
<option value="โรงเรียนอัสสัมชัญอุบลราชธานี" className="user-generated">โรงเรียนอัสสัมชัญอุบลราชธานี</option>
<option value="โรงเรียนเจ้าฟ้าอุบลรัตน์" className="user-generated">โรงเรียนเจ้าฟ้าอุบลรัตน์</option>
<option value="โรงเรียนซางตาครู้สคอนแวนท์" className="user-generated">โรงเรียนซางตาครู้สคอนแวนท์</option>
<option value="โรงเรียนเซนต์ปอลคอนแวนต์" className="user-generated">โรงเรียนเซนต์ปอลคอนแวนต์</option>
<option value="โรงเรียนเซนต์ปอลหนองคาย" className="user-generated">โรงเรียนเซนต์ปอลหนองคาย</option>
<option value="โรงเรียนเซนต์ฟรังซีสซาเวียร์คอนแวนต์" className="user-generated">โรงเรียนเซนต์ฟรังซีสซาเวียร์คอนแวนต์</option>
<option value="โรงเรียนเซนต์ฟรังซีสเซเวียร์" className="user-generated">โรงเรียนเซนต์ฟรังซีสเซเวียร์</option>
<option value="โรงเรียนเซนต์โยเซฟเกาะสมุย" className="user-generated">โรงเรียนเซนต์โยเซฟเกาะสมุย</option>
<option value="โรงเรียนเซนต์โยเซฟคอนเวนต์" className="user-generated">โรงเรียนเซนต์โยเซฟคอนเวนต์</option>
<option value="โรงเรียนเซนต์โยเซฟท่าแร่" className="user-generated">โรงเรียนเซนต์โยเซฟท่าแร่</option>
<option value="โรงเรียนเซนต์โยเซฟทิพวัล" className="user-generated">โรงเรียนเซนต์โยเซฟทิพวัล</option>
<option value="โรงเรียนเซนต์โยเซฟนครสวรรค์" className="user-generated">โรงเรียนเซนต์โยเซฟนครสวรรค์</option>
<option value="โรงเรียนเซนต์โยเซฟบางนา" className="user-generated">โรงเรียนเซนต์โยเซฟบางนา</option>
<option value="โรงเรียนเซนต์โยเซฟเพชรบุรี" className="user-generated">โรงเรียนเซนต์โยเซฟเพชรบุรี</option>
<option value="โรงเรียนเซนต์โยเซฟแม่แจ่ม" className="user-generated">โรงเรียนเซนต์โยเซฟแม่แจ่ม</option>
<option value="โรงเรียนเซนต์โยเซฟแม่ระมาด" className="user-generated">โรงเรียนเซนต์โยเซฟแม่ระมาด</option>
<option value="โรงเรียนเซนต์โยเซฟระยอง" className="user-generated">โรงเรียนเซนต์โยเซฟระยอง</option>
<option value="โรงเรียนเซนต์โยเซฟศรีเพชรบูรณ์" className="user-generated">โรงเรียนเซนต์โยเซฟศรีเพชรบูรณ์</option>
<option value="โรงเรียนโรซารีโอวิทยา" className="user-generated">โรงเรียนโรซารีโอวิทยา</option>
<option value="โรงเรียนอัสสัมชัญคอนแวนต์" className="user-generated">โรงเรียนอัสสัมชัญคอนแวนต์</option>
<option value="โรงเรียนอัสสัมชัญคอนแวนต์ ลพบุรี" className="user-generated">โรงเรียนอัสสัมชัญคอนแวนต์ ลพบุรี</option>
<option value="โรงเรียนอัสสัมชัญคอนแวนต์ ลำนารายณ์" className="user-generated">โรงเรียนอัสสัมชัญคอนแวนต์ ลำนารายณ์</option>
<option value="โรงเรียนอัสสัมชัญคอนแวนต์ สีลม" className="user-generated">โรงเรียนอัสสัมชัญคอนแวนต์ สีลม</option>
<option value="โรงเรียนหาดใหญ่วิทยาลัย" className="user-generated">โรงเรียนหาดใหญ่วิทยาลัย</option>
<option value="โรงเรียนหาดใหญ่วิทยาลัย ๒" className="user-generated">โรงเรียนหาดใหญ่วิทยาลัย ๒</option>
<option value="โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา" className="user-generated">โรงเรียนหาดใหญ่วิทยาลัยสมบูรณ์กุลกันยา</option>
<option value="โรงเรียนเตรียมอุดมศึกษา" className="user-generated">โรงเรียนเตรียมอุดมศึกษา</option>
<option value="โรงเรียนเตรียมอุดมศึกษา ภาคตะวันออกเฉียงเหนือ" className="user-generated">โรงเรียนเตรียมอุดมศึกษา ภาคตะวันออกเฉียงเหนือ</option>
<option value="โรงเรียนเตรียมอุดมศึกษา ภาคใต้" className="user-generated">โรงเรียนเตรียมอุดมศึกษา ภาคใต้</option>
<option value="โรงเรียนเตรียมอุดมศึกษา ภาคเหนือ" className="user-generated">โรงเรียนเตรียมอุดมศึกษา ภาคเหนือ</option>
<option value="โรงเรียนเตรียมอุดมศึกษา สุวินทวงศ์" className="user-generated">โรงเรียนเตรียมอุดมศึกษา สุวินทวงศ์</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า กบินทร์บุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า กบินทร์บุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า นครราชสีมา" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า นครราชสีมา</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า นนทบุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า นนทบุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า ปทุมธานี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า ปทุมธานี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า สมุทรปราการ" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า สมุทรปราการ</option>
<option value="โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า อุตรดิตถ์" className="user-generated">โรงเรียนเตรียมอุดมศึกษาน้อมเกล้า อุตรดิตถ์</option>
<option value="โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาน้อมเกล้า" className="user-generated">โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาน้อมเกล้า</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ขอนแก่น" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ขอนแก่น</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ เขลางค์นคร" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ เขลางค์นคร</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ฉะเชิงเทรา" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ฉะเชิงเทรา</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ เชียงราย" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ เชียงราย</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ นนทบุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ นนทบุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ปทุมธานี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ปทุมธานี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ปราณบุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ปราณบุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ยานนาเวศ" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ยานนาเวศ</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ร้อยเอ็ด" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ร้อยเอ็ด</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ รัชดา" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ รัชดา</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ราชบุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ ราชบุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สระบุรี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สระบุรี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สุราษฎร์ธานี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สุราษฎร์ธานี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สุวรรณภูมิ" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ สุวรรณภูมิ</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ อุดรธานี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ อุดรธานี</option>
<option value="โรงเรียนเตรียมอุดมศึกษาพัฒนาการ อุบลราชธานี" className="user-generated">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ อุบลราชธานี</option>
<option value="โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ" className="user-generated">โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ</option>
<option value="โรงเรียนทวีธาภิเศก" className="user-generated">โรงเรียนทวีธาภิเศก</option>
<option value="โรงเรียนทวีธาภิเศก บางขุนเทียน" className="user-generated">โรงเรียนทวีธาภิเศก บางขุนเทียน</option>
<option value="โรงเรียนเทพศิรินทร์" className="user-generated">โรงเรียนเทพศิรินทร์</option>
<option value="โรงเรียนเทพศิรินทร์ ๙ โครงการหลวงในพระบรมราชูปถัมภ์" className="user-generated">โรงเรียนเทพศิรินทร์ ๙ โครงการหลวงในพระบรมราชูปถัมภ์</option>
<option value="โรงเรียนเทพศิรินทร์ ขอนแก่น" className="user-generated">โรงเรียนเทพศิรินทร์ ขอนแก่น</option>
<option value="โรงเรียนเทพศิรินทร์ เชียงใหม่" className="user-generated">โรงเรียนเทพศิรินทร์ เชียงใหม่</option>
<option value="โรงเรียนเทพศิรินทร์ นนทบุรี" className="user-generated">โรงเรียนเทพศิรินทร์ นนทบุรี</option>
<option value="โรงเรียนเทพศิรินทร์ พุแค" className="user-generated">โรงเรียนเทพศิรินทร์ พุแค</option>
<option value="โรงเรียนเทพศิรินทร์ สมุทรปราการ" className="user-generated">โรงเรียนเทพศิรินทร์ สมุทรปราการ</option>
<option value="โรงเรียนเทพศิรินทร์คลองสิบสาม ปทุมธานี" className="user-generated">โรงเรียนเทพศิรินทร์คลองสิบสาม ปทุมธานี</option>
<option value="โรงเรียนเทพศิรินทร์ร่มเกล้า" className="user-generated">โรงเรียนเทพศิรินทร์ร่มเกล้า</option>
<option value="โรงเรียนเทพศิรินทร์ลาดหญ้า กาญจนบุรี" className="user-generated">โรงเรียนเทพศิรินทร์ลาดหญ้า กาญจนบุรี</option>
<option value="โรงเรียนนวมินทราชูทิศ กรุงเทพมหานคร" className="user-generated">โรงเรียนนวมินทราชูทิศ กรุงเทพมหานคร</option>
<option value="โรงเรียนนวมินทราชูทิศ ทักษิณ" className="user-generated">โรงเรียนนวมินทราชูทิศ ทักษิณ</option>
<option value="โรงเรียนนวมินทราชูทิศ พายัพ" className="user-generated">โรงเรียนนวมินทราชูทิศ พายัพ</option>
<option value="โรงเรียนนวมินทราชูทิศ มัชฌิม" className="user-generated">โรงเรียนนวมินทราชูทิศ มัชฌิม</option>
<option value="โรงเรียนนวมินทราชูทิศ อีสาน" className="user-generated">โรงเรียนนวมินทราชูทิศ อีสาน</option>
<option value="โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาน้อมเกล้า" className="user-generated">โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาน้อมเกล้า</option>
<option value="โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ" className="user-generated">โรงเรียนนวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ</option>
<option value="โรงเรียนนวมินทราชินูทิศ บดินทรเดชา" className="user-generated">โรงเรียนนวมินทราชินูทิศ บดินทรเดชา</option>
<option value="โรงเรียนนวมินทราชินูทิศ เบญจมราชาลัย" className="user-generated">โรงเรียนนวมินทราชินูทิศ เบญจมราชาลัย</option>
<option value="โรงเรียนนวมินทราชินูทิศ สตรีวิทยา ๒" className="user-generated">โรงเรียนนวมินทราชินูทิศ สตรีวิทยา ๒</option>
<option value="โรงเรียนนวมินทราชินูทิศ สตรีวิทยา พุทธมณฑล" className="user-generated">โรงเรียนนวมินทราชินูทิศ สตรีวิทยา พุทธมณฑล</option>
<option value="โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย ปทุมธานี" className="user-generated">โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย ปทุมธานี</option>
<option value="โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย สมุทรปราการ" className="user-generated">โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย สมุทรปราการ</option>
<option value="โรงเรียนนวมินทราชินูทิศ หอวัง นนทบุรี" className="user-generated">โรงเรียนนวมินทราชินูทิศ หอวัง นนทบุรี</option>
<option value="โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนวัดนวลนรดิศ" className="user-generated">โรงเรียนวัดนวลนรดิศ</option>
<option value="โรงเรียนบุญวัฒนา" className="user-generated">โรงเรียนบุญวัฒนา</option>
<option value="โรงเรียนบุญวัฒนา ๒" className="user-generated">โรงเรียนบุญวัฒนา ๒</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๑" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๑</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๒" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๒</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๓" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๓</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๔" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๔</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๕" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๕</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๖" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๖</option>
<option value="โรงเรียนบรรหารแจ่มใสวิทยา ๗" className="user-generated">โรงเรียนบรรหารแจ่มใสวิทยา ๗</option>
<option value="โรงเรียนเบญจมราชรังสฤษฎิ์" className="user-generated">โรงเรียนเบญจมราชรังสฤษฎิ์</option>
<option value="โรงเรียนเบญจมราชรังสฤษฎิ์ ๒" className="user-generated">โรงเรียนเบญจมราชรังสฤษฎิ์ ๒</option>
<option value="โรงเรียนเบญจมราชรังสฤษฎิ์ ๓" className="user-generated">โรงเรียนเบญจมราชรังสฤษฎิ์ ๓</option>
<option value="โรงเรียนเบญจมราชรังสฤษฎิ์ ๕" className="user-generated">โรงเรียนเบญจมราชรังสฤษฎิ์ ๕</option>
<option value="โรงเรียนเบญจมเทพอุทิศจังหวัดเพชรบุรี" className="user-generated">โรงเรียนเบญจมเทพอุทิศจังหวัดเพชรบุรี</option>
<option value="โรงเรียนเบญจมราชรังสฤษฎิ์" className="user-generated">โรงเรียนเบญจมราชรังสฤษฎิ์</option>
<option value="โรงเรียนเบญจมราชานุสรณ์" className="user-generated">โรงเรียนเบญจมราชานุสรณ์</option>
<option value="โรงเรียนเบญจมราชาลัย ในพระบรมราชูปถัมภ์" className="user-generated">โรงเรียนเบญจมราชาลัย ในพระบรมราชูปถัมภ์</option>
<option value="โรงเรียนเบญจมราชูทิศ" className="user-generated">โรงเรียนเบญจมราชูทิศ</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี</option>
<option value="โรงเรียนเบญจมราชูทิศ ราชบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ ราชบุรี</option>
<option value="โรงเรียนเบ็ญจะมะมหาราช" className="user-generated">โรงเรียนเบ็ญจะมะมหาราช</option>
<option value="โรงเรียนมัธยมวัดเบญจมบพิตร" className="user-generated">โรงเรียนมัธยมวัดเบญจมบพิตร</option>
<option value="โรงเรียนนวมินทราชินูทิศ บดินทรเดชา" className="user-generated">โรงเรียนนวมินทราชินูทิศ บดินทรเดชา</option>
<option value="โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี)" className="user-generated">โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี)</option>
<option value="โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๒" className="user-generated">โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๒</option>
<option value="โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๔" className="user-generated">โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๔</option>
<option value="โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) นนทบุรี" className="user-generated">โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) นนทบุรี</option>
<option value="โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) สมุทรปราการ" className="user-generated">โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) สมุทรปราการ</option>
<option value="โรงเรียนพระหฤทัยคอนแวนต์" className="user-generated">โรงเรียนพระหฤทัยคอนแวนต์</option>
<option value="โรงเรียนพระหฤทัยดอนเมือง" className="user-generated">โรงเรียนพระหฤทัยดอนเมือง</option>
<option value="โรงเรียนพระหฤทัยนนทบุรี" className="user-generated">โรงเรียนพระหฤทัยนนทบุรี</option>
<option value="โรงเรียนพระหฤทัยพัฒนเวศม์" className="user-generated">โรงเรียนพระหฤทัยพัฒนเวศม์</option>
<option value="โรงเรียนพระหฤทัยสวรรคโลก" className="user-generated">โรงเรียนพระหฤทัยสวรรคโลก</option>
<option value="โรงเรียนกองทัพบกอุปถัมภ์ เพชราวุธวิทยา ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนกองทัพบกอุปถัมภ์ เพชราวุธวิทยา ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนเทศบาลปลูกปัญญา ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนเทศบาลปลูกปัญญา ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนธรรมาธิปไตย" className="user-generated">โรงเรียนธรรมาธิปไตย</option>
<option value="โรงเรียนบุญวาทย์วิทยาลัย" className="user-generated">โรงเรียนบุญวาทย์วิทยาลัย</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี</option>
<option value="โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี" className="user-generated">โรงเรียนเบญจมราชูทิศ จังหวัดปัตตานี</option>
<option value="โรงเรียนเบญจมราชูทิศ ราชบุรี" className="user-generated">โรงเรียนเบญจมราชูทิศ ราชบุรี</option>
<option value="โรงเรียนปรินส์รอยแยลส์วิทยาลัย" className="user-generated">โรงเรียนปรินส์รอยแยลส์วิทยาลัย</option>
<option value="โรงเรียนพนมมาศพิทยากร" className="user-generated">โรงเรียนพนมมาศพิทยากร</option>
<option value="โรงเรียนเพชรรัชต์ ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนเพชรรัชต์ ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนเพชรรัตนราชสุดา" className="user-generated">โรงเรียนเพชรรัตนราชสุดา</option>
<option value="โรงเรียนเพาะปัญญา ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนเพาะปัญญา ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนมหาวชิราวุธ จังหวัดสงขลา" className="user-generated">โรงเรียนมหาวชิราวุธ จังหวัดสงขลา</option>
<option value="โรงเรียนมุกดาลัย" className="user-generated">โรงเรียนมุกดาลัย</option>
<option value="โรงเรียนยุพราชวิทยาลัย" className="user-generated">โรงเรียนยุพราชวิทยาลัย</option>
<option value="โรงเรียนศรีอยุธยา ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนศรีอยุธยา ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนห้องสอนศึกษา ในพระอุปถัมภ์ฯ" className="user-generated">โรงเรียนห้องสอนศึกษา ในพระอุปถัมภ์ฯ</option>
<option value="วชิราวุธวิทยาลัย" className="user-generated">วชิราวุธวิทยาลัย</option>
<option value="วิทยาลัยเทคโนโลยีสยามธุรกิจ ในพระอุปถัมภ์ฯ" className="user-generated">วิทยาลัยเทคโนโลยีสยามธุรกิจ ในพระอุปถัมภ์ฯ</option>
<option value="วิทยาลัยอาชีวศึกษาสันติราษฎร์ ในพระอุปถัมภ์ฯ" className="user-generated">วิทยาลัยอาชีวศึกษาสันติราษฎร์ ในพระอุปถัมภ์ฯ</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (ทวีวัฒนา) ในพระราชูปถัมภ์ฯ" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (ทวีวัฒนา) ในพระราชูปถัมภ์ฯ</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (มัธยมวัดหัตถสารเกษตร) ในพระราชูปถัมภ์" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (มัธยมวัดหัตถสารเกษตร) ในพระราชูปถัมภ์</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (วัดน้อยใน) ในพระราชูปถัมภ์ฯ" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (วัดน้อยใน) ในพระราชูปถัมภ์ฯ</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (วัดโบสถ์) ในพระราชูปถัมภ์ฯ" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (วัดโบสถ์) ในพระราชูปถัมภ์ฯ</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (วัดประดู่) ในพระราชูปถัมภ์ฯ" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (วัดประดู่) ในพระราชูปถัมภ์ฯ</option>
<option value="โรงเรียนทีปังกรวิทยาพัฒน์ (วัดสุนทรสถิต) ในพระราชูปถัมภ์ฯ" className="user-generated">โรงเรียนทีปังกรวิทยาพัฒน์ (วัดสุนทรสถิต) ในพระราชูปถัมภ์ฯ</option>
<option value="โรงเรียนมกุฎเมืองราชวิทยาลัย" className="user-generated">โรงเรียนมกุฎเมืองราชวิทยาลัย</option>
<option value="โรงเรียนมัธยมพัชรกิติยาภา ๑ นครพนม" className="user-generated">โรงเรียนมัธยมพัชรกิติยาภา ๑ นครพนม</option>
<option value="โรงเรียนมัธยมพัชรกิติยาภา ๒ กำแพงเพชร" className="user-generated">โรงเรียนมัธยมพัชรกิติยาภา ๒ กำแพงเพชร</option>
<option value="โรงเรียนมัธยมพัชรกิติยาภา ๓ สุราษฎร์ธานี" className="user-generated">โรงเรียนมัธยมพัชรกิติยาภา ๓ สุราษฎร์ธานี</option>
<option value="โรงเรียนมัธยมสิริวัณวรี ๑ อุดรธานี" className="user-generated">โรงเรียนมัธยมสิริวัณวรี ๑ อุดรธานี</option>
<option value="โรงเรียนมัธยมสิริวัณวรี ๒ สงขลา" className="user-generated">โรงเรียนมัธยมสิริวัณวรี ๒ สงขลา</option>
<option value="โรงเรียนมัธยมสิริวัณวรี ๓ ฉะเชิงเทรา" className="user-generated">โรงเรียนมัธยมสิริวัณวรี ๓ ฉะเชิงเทรา</option>
<option value="โรงเรียนราชปิโยรสา ยุพราชานุสรณ์" className="user-generated">โรงเรียนราชปิโยรสา ยุพราชานุสรณ์</option>
<option value="โรงเรียนอนุราชประสิทธิ์" className="user-generated">โรงเรียนอนุราชประสิทธิ์</option>
<option value="โรงเรียนขลุงรัชดาภิเษก" className="user-generated">โรงเรียนขลุงรัชดาภิเษก</option>
<option value="โรงเรียนจตุรพักตร์พิมานรัชดาภิเษก" className="user-generated">โรงเรียนจตุรพักตร์พิมานรัชดาภิเษก</option>
<option value="โรงเรียนฉวางรัชดาภิเษก" className="user-generated">โรงเรียนฉวางรัชดาภิเษก</option>
<option value="โรงเรียนท่าแซะรัชดาภิเษก" className="user-generated">โรงเรียนท่าแซะรัชดาภิเษก</option>
<option value="โรงเรียนบ่อพลอยรัชดาภิเษก" className="user-generated">โรงเรียนบ่อพลอยรัชดาภิเษก</option>
<option value="โรงเรียนปงรัชดาภิเษก" className="user-generated">โรงเรียนปงรัชดาภิเษก</option>
<option value="โรงเรียนพรหมบุรีรัชดาภิเษก" className="user-generated">โรงเรียนพรหมบุรีรัชดาภิเษก</option>
<option value="โรงเรียนราชประชาสมาสัย ฝ่ายมัธยม รัชดาภิเษก ในพระบรมราชูปถัมภ์" className="user-generated">โรงเรียนราชประชาสมาสัย ฝ่ายมัธยม รัชดาภิเษก ในพระบรมราชูปถัมภ์</option>
<option value="โรงเรียนละหานทรายรัชดาภิเษก" className="user-generated">โรงเรียนละหานทรายรัชดาภิเษก</option>
<option value="โรงเรียนกกตูมประชาสรรค์ รัชมังคลาภิเษก" className="user-generated">โรงเรียนกกตูมประชาสรรค์ รัชมังคลาภิเษก</option>
<option value="โรงเรียนไกรในวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนไกรในวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนดงใหญ่วิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนดงใหญ่วิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนดอยหลวง รัชมังคลาภิเษก" className="user-generated">โรงเรียนดอยหลวง รัชมังคลาภิเษก</option>
<option value="โรงเรียนตาคงวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนตาคงวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนไตรเขตประชาสามัคคี รัชมังคลาภิเษก" className="user-generated">โรงเรียนไตรเขตประชาสามัคคี รัชมังคลาภิเษก</option>
<option value="โรงเรียนทุ่งไชยพิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนทุ่งไชยพิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนทุ่งใหญ่เฉลิมราชอนุสรณ์ รัชมังคลาภิเษก" className="user-generated">โรงเรียนทุ่งใหญ่เฉลิมราชอนุสรณ์ รัชมังคลาภิเษก</option>
<option value="โรงเรียนนครชุมพิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนนครชุมพิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนนวลนรดิศวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนนางแดดวังชมภูวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนนางแดดวังชมภูวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนนาเยียศึกษา รัชมังคลาภิเษก" className="user-generated">โรงเรียนนาเยียศึกษา รัชมังคลาภิเษก</option>
<option value="โรงเรียนนาไหมพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนนาไหมพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนน้ำพองพัฒนศึกษา รัชมังคลาภิเษก" className="user-generated">โรงเรียนน้ำพองพัฒนศึกษา รัชมังคลาภิเษก</option>
<option value="โรงเรียนโนนคูณวิทยาคาร รัชมังคลาภิเษก" className="user-generated">โรงเรียนโนนคูณวิทยาคาร รัชมังคลาภิเษก</option>
<option value="โรงเรียนบางกล่ำวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนบางกล่ำวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนปอพานพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนปอพานพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนโป่งหลวงวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนโป่งหลวงวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนไผ่ดำวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนไผ่ดำวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนพอกพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนพอกพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนร่มเกล้าวัฒนานคร สระแก้ว รัชมังคลาภิเษก" className="user-generated">โรงเรียนร่มเกล้าวัฒนานคร สระแก้ว รัชมังคลาภิเษก</option>
<option value="โรงเรียนรมย์บุรีพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนรมย์บุรีพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนรามวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนรามวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนศรีจันทร์วิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนศรีจันทร์วิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนสะตอวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนสะตอวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนสาธุกิจประชาสรรค์ รัชมังคลาภิเษก" className="user-generated">โรงเรียนสาธุกิจประชาสรรค์ รัชมังคลาภิเษก</option>
<option value="โรงเรียนเสวียดวิทยา รัชมังคลาภิเษก" className="user-generated">โรงเรียนเสวียดวิทยา รัชมังคลาภิเษก</option>
<option value="โรงเรียนหนองยองพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนหนองยองพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนหนามแท่งพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนหนามแท่งพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนห้วยซ้อวิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนห้วยซ้อวิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนเหล่าคามพิทยาคม รัชมังคลาภิเษก" className="user-generated">โรงเรียนเหล่าคามพิทยาคม รัชมังคลาภิเษก</option>
<option value="โรงเรียนรัตนโกสินทร์สมโภชบวรนิเวศศาลายา ในพระสังฆราชูปถัมภ์" className="user-generated">โรงเรียนรัตนโกสินทร์สมโภชบวรนิเวศศาลายา ในพระสังฆราชูปถัมภ์</option>
<option value="โรงเรียนรัตนโกสินทร์สมโภชบางขุนเทียน" className="user-generated">โรงเรียนรัตนโกสินทร์สมโภชบางขุนเทียน</option>
<option value="โรงเรียนรัตนโกสินทร์สมโภชบางเขน" className="user-generated">โรงเรียนรัตนโกสินทร์สมโภชบางเขน</option>
<option value="โรงเรียนรัตนโกสินทร์สมโภชลาดกระบัง" className="user-generated">โรงเรียนรัตนโกสินทร์สมโภชลาดกระบัง</option>
<option value="โรงเรียนราชวินิต" className="user-generated">โรงเรียนราชวินิต</option>
<option value="โรงเรียนราชวินิต นนทบุรี" className="user-generated">โรงเรียนราชวินิต นนทบุรี</option>
<option value="โรงเรียนราชวินิต มัธยม" className="user-generated">โรงเรียนราชวินิต มัธยม</option>
<option value="โรงเรียนราชวินิตบางแก้ว ในพระบรมราชูปถัมภ์" className="user-generated">โรงเรียนราชวินิตบางแก้ว ในพระบรมราชูปถัมภ์</option>
<option value="โรงเรียนราชวินิตบางเขน" className="user-generated">โรงเรียนราชวินิตบางเขน</option>
<option value="โรงเรียนราชวินิตบางแคปานขำ" className="user-generated">โรงเรียนราชวินิตบางแคปานขำ</option>
<option value="โรงเรียนราชวินิตสุวรรณภูมิ" className="user-generated">โรงเรียนราชวินิตสุวรรณภูมิ</option>
<option value="โรงเรียนฤทธิยะวรรณาลัย" className="user-generated">โรงเรียนฤทธิยะวรรณาลัย</option>
<option value="โรงเรียนฤทธิยะวรรณาลัย ๒" className="user-generated">โรงเรียนฤทธิยะวรรณาลัย ๒</option>
<option value="โรงเรียน ภ.ป.ร. ราชวิทยาลัย ในพระบรมราชูปถัมภ์" className="user-generated">โรงเรียน ภ.ป.ร. ราชวิทยาลัย ในพระบรมราชูปถัมภ์</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย กระบี่" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย กระบี่</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย กาฬสินธุ์" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย กาฬสินธุ์</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย ฉะเชิงเทรา" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย ฉะเชิงเทรา</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย นครปฐม (พระตำหนักสวนกุหลาบมัธยม)" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย นครปฐม (พระตำหนักสวนกุหลาบมัธยม)</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย เพชรบูรณ์" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย เพชรบูรณ์</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย สุราษฎร์ธานี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย สุราษฎร์ธานี</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย สุพรรณบุรี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย สุพรรณบุรี</option>
<option value="โรงเรียนกาญจนาภิเษกวิทยาลัย อุทัยธานี" className="user-generated">โรงเรียนกาญจนาภิเษกวิทยาลัย อุทัยธานี</option>
<option value="โรงเรียนเฉลิมพระเกียรติพระบาทสมเด็จพระเจ้าอยู่หัวภูมิพลอดุลยเดชฯ ทรงครองสิริราชสมบัติครบ ๕๐ ปี จังหวัดสกลนคร" className="user-generated">โรงเรียนเฉลิมพระเกียรติพระบาทสมเด็จพระเจ้าอยู่หัวภูมิพลอดุลยเดชฯ ทรงครองสิริราชสมบัติครบ ๕๐ ปี จังหวัดสกลนคร</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กาญจนบุรี" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กาญจนบุรี</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กำแพงเพชร" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ กำแพงเพชร</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ นครศรีธรรมราช" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ นครศรีธรรมราช</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ พะเยา" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ พะเยา</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ภูเก็ต" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ภูเก็ต</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ยะลา</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ร้อยเอ็ด" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ร้อยเอ็ด</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ระยอง" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ระยอง</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ลพบุรี" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ลพบุรี</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ศรีสะเกษ" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ ศรีสะเกษ</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ สมุทรสาคร" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ สมุทรสาคร</option>
<option value="โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ หนองบัวลำภู" className="user-generated">โรงเรียนเฉลิมพระเกียรติสมเด็จพระศรีนครินทร์ หนองบัวลำภู</option>
<option value="โรงเรียนบรมราชินีนาถราชวิทยาลัย" className="user-generated">โรงเรียนบรมราชินีนาถราชวิทยาลัย</option>
<option value="โรงเรียนมกุฎเมืองราชวิทยาลัย" className="user-generated">โรงเรียนมกุฎเมืองราชวิทยาลัย</option>
<option value="โรงเรียนมัธยมสังคีตวิทยา กรุงเทพมหานคร" className="user-generated">โรงเรียนมัธยมสังคีตวิทยา กรุงเทพมหานคร</option>
<option value="โรงเรียนสิรินธรราชวิทยาลัย" className="user-generated">โรงเรียนสิรินธรราชวิทยาลัย</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ชลบุรี" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ชลบุรี</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เชียงราย</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ตรัง" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ตรัง</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย นครศรีธรรมราช" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย นครศรีธรรมราช</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย บุรีรัมย์" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย บุรีรัมย์</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ปทุมธานี" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ปทุมธานี</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เพชรบุรี" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เพชรบุรี</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย พิษณุโลก" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย พิษณุโลก</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย มุกดาหาร" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย มุกดาหาร</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ลพบุรี" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ลพบุรี</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เลย" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย เลย</option>
<option value="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย สตูล" className="user-generated">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย สตูล</option>
<option value="โรงเรียนวิเชียรมาตุ" className="user-generated">โรงเรียนวิเชียรมาตุ</option>
<option value="โรงเรียนวิเชียรมาตุ ๒" className="user-generated">โรงเรียนวิเชียรมาตุ ๒</option>
<option value="โรงเรียนวิเชียรมาตุ ๓" className="user-generated">โรงเรียนวิเชียรมาตุ ๓</option>
<option value="โรงเรียนศรียาภัย" className="user-generated">โรงเรียนศรียาภัย</option>
<option value="โรงเรียนศรียาภัย ๒" className="user-generated">โรงเรียนศรียาภัย ๒</option>
<option value="โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย ปทุมธานี" className="user-generated">โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย ปทุมธานี</option>
<option value="โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย สมุทรปราการ" className="user-generated">โรงเรียนนวมินทราชินูทิศ สวนกุหลาบวิทยาลัย สมุทรปราการ</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย (จิรประวัติ) นครสวรรค์" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย (จิรประวัติ) นครสวรรค์</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย ชลบุรี" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย ชลบุรี</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย ธนบุรี" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย ธนบุรี</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย นครศรีธรรมราช" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย นครศรีธรรมราช</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย นนทบุรี" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย นนทบุรี</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย เพชรบูรณ์" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย เพชรบูรณ์</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย รังสิต" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย รังสิต</option>
<option value="โรงเรียนสวนกุหลาบวิทยาลัย สระบุรี" className="user-generated">โรงเรียนสวนกุหลาบวิทยาลัย สระบุรี</option>
<option value="โรงเรียนสภาราชินี" className="user-generated">โรงเรียนสภาราชินี</option>
<option value="โรงเรียนสภาราชินี ๒" className="user-generated">โรงเรียนสภาราชินี ๒</option>
<option value="โรงเรียนสามเสนวิทยาลัย" className="user-generated">โรงเรียนสามเสนวิทยาลัย</option>
<option value="โรงเรียนราชนันทาจารย์ สามเสนวิทยาลัย ๒" className="user-generated">โรงเรียนราชนันทาจารย์ สามเสนวิทยาลัย ๒</option>
<option value="โรงเรียนสวรรค์อนันต์วิทยา" className="user-generated">โรงเรียนสวรรค์อนันต์วิทยา</option>
<option value="โรงเรียนสวรรค์อนันต์วิทยา ๒" className="user-generated">โรงเรียนสวรรค์อนันต์วิทยา ๒</option>
<option value="โรงเรียนสุราษฎร์พิทยา" className="user-generated">โรงเรียนสุราษฎร์พิทยา</option>
<option value="โรงเรียนสุราษฎร์พิทยา ๒" className="user-generated">โรงเรียนสุราษฎร์พิทยา ๒</option>
<option value="โรงเรียนสุราษฎร์ธานี" className="user-generated">โรงเรียนสุราษฎร์ธานี</option>
<option value="โรงเรียนสุราษฎร์ธานี ๒" className="user-generated">โรงเรียนสุราษฎร์ธานี ๒</option>
<option value="โรงเรียนนวมินทราชินูทิศ หอวัง นนทบุรี" className="user-generated">โรงเรียนนวมินทราชินูทิศ หอวัง นนทบุรี</option>
<option value="โรงเรียนหอวัง" className="user-generated">โรงเรียนหอวัง</option>
<option value="โรงเรียนหอวัง ปทุมธานี" className="user-generated">โรงเรียนหอวัง ปทุมธานี</option>
<option value="โรงเรียนอนุบาลสามเสน" className="user-generated">โรงเรียนอนุบาลสามเสน</option>
<option value="โรงเรียนอนุบาลพิบูลเวศม์" className="user-generated">โรงเรียนอนุบาลพิบูลเวศม์</option>
<option value="โรงเรียนอนุบาลวัดนางนอง" className="user-generated">โรงเรียนอนุบาลวัดนางนอง</option>
<option value="โรงเรียนอนุบาลวัดปรินายก" className="user-generated">โรงเรียนอนุบาลวัดปรินายก</option>
<option value="โรงเรียนอนุบาลกระบี่" className="user-generated">โรงเรียนอนุบาลกระบี่</option>
<option value="โรงเรียนอนุบาลกาญจนบุรี" className="user-generated">โรงเรียนอนุบาลกาญจนบุรี</option>
<option value="โรงเรียนอนุบาลกาฬสินธุ์" className="user-generated">โรงเรียนอนุบาลกาฬสินธุ์</option>
<option value="โรงเรียนอนุบาลกำแพงเพชร" className="user-generated">โรงเรียนอนุบาลกำแพงเพชร</option>
<option value="โรงเรียนอนุบาลขอนแก่น" className="user-generated">โรงเรียนอนุบาลขอนแก่น</option>
<option value="โรงเรียนอนุบาลจันทบุรี" className="user-generated">โรงเรียนอนุบาลจันทบุรี</option>
<option value="โรงเรียนอนุบาลวัดปิตุลาธิราชรังสฤษฎิ์" className="user-generated">โรงเรียนอนุบาลวัดปิตุลาธิราชรังสฤษฎิ์</option>
<option value="โรงเรียนอนุบาลชลบุรี" className="user-generated">โรงเรียนอนุบาลชลบุรี</option>
<option value="โรงเรียนอนุบาลชัยนาท" className="user-generated">โรงเรียนอนุบาลชัยนาท</option>
<option value="โรงเรียนอนุบาลชัยภูมิ" className="user-generated">โรงเรียนอนุบาลชัยภูมิ</option>
<option value="โรงเรียนอนุบาลชุมพร" className="user-generated">โรงเรียนอนุบาลชุมพร</option>
<option value="โรงเรียนอนุบาลเชียงราย" className="user-generated">โรงเรียนอนุบาลเชียงราย</option>
<option value="โรงเรียนอนุบาลเชียงใหม่" className="user-generated">โรงเรียนอนุบาลเชียงใหม่</option>
<option value="โรงเรียนอนุบาลตรัง" className="user-generated">โรงเรียนอนุบาลตรัง</option>
<option value="โรงเรียนอนุบาลตราด" className="user-generated">โรงเรียนอนุบาลตราด</option>
<option value="โรงเรียนอนุบาลตาก" className="user-generated">โรงเรียนอนุบาลตาก</option>
<option value="โรงเรียนอนุบาลนครนายก" className="user-generated">โรงเรียนอนุบาลนครนายก</option>
<option value="โรงเรียนอนุบาลนครปฐม" className="user-generated">โรงเรียนอนุบาลนครปฐม</option>
<option value="โรงเรียนอนุบาลนครพนม" className="user-generated">โรงเรียนอนุบาลนครพนม</option>
<option value="โรงเรียนอนุบาลนครราชสีมา" className="user-generated">โรงเรียนอนุบาลนครราชสีมา</option>
<option value="โรงเรียนอนุบาลนครศรีธรรมราช ณ นครอุทิศ" className="user-generated">โรงเรียนอนุบาลนครศรีธรรมราช ณ นครอุทิศ</option>
<option value="โรงเรียนอนุบาลนครสวรรค์" className="user-generated">โรงเรียนอนุบาลนครสวรรค์</option>
<option value="โรงเรียนอนุบาลนนทบุรี" className="user-generated">โรงเรียนอนุบาลนนทบุรี</option>
<option value="โรงเรียนอนุบาลนราธิวาส" className="user-generated">โรงเรียนอนุบาลนราธิวาส</option>
<option value="โรงเรียนราชานุบาล" className="user-generated">โรงเรียนราชานุบาล</option>
<option value="โรงเรียนอนุบาลบึงกาฬวิศิษฐ์อำนวยศิลป์" className="user-generated">โรงเรียนอนุบาลบึงกาฬวิศิษฐ์อำนวยศิลป์</option>
<option value="โรงเรียนอนุบาลบุรีรัมย์" className="user-generated">โรงเรียนอนุบาลบุรีรัมย์</option>
<option value="โรงเรียนอนุบาลปทุมธานี" className="user-generated">โรงเรียนอนุบาลปทุมธานี</option>
<option value="โรงเรียนอนุบาลประจวบคีรีขันธ์" className="user-generated">โรงเรียนอนุบาลประจวบคีรีขันธ์</option>
<option value="โรงเรียนอนุบาลปราจีนบุรี" className="user-generated">โรงเรียนอนุบาลปราจีนบุรี</option>
<option value="โรงเรียนอนุบาลปัตตานี" className="user-generated">โรงเรียนอนุบาลปัตตานี</option>
<option value="โรงเรียนอนุบาลพระนครศรีอยุธยา" className="user-generated">โรงเรียนอนุบาลพระนครศรีอยุธยา</option>
<option value="โรงเรียนอนุบาลพะเยา" className="user-generated">โรงเรียนอนุบาลพะเยา</option>
<option value="โรงเรียนอนุบาลพังงา" className="user-generated">โรงเรียนอนุบาลพังงา</option>
<option value="โรงเรียนอนุบาลพัทลุง" className="user-generated">โรงเรียนอนุบาลพัทลุง</option>
<option value="โรงเรียนอนุบาลพิจิตร" className="user-generated">โรงเรียนอนุบาลพิจิตร</option>
<option value="โรงเรียนอนุบาลบางมูลนาก ราษฎร์อุทิศ" className="user-generated">โรงเรียนอนุบาลบางมูลนาก ราษฎร์อุทิศ</option>
<option value="โรงเรียนอนุบาลพิษณุโลก" className="user-generated">โรงเรียนอนุบาลพิษณุโลก</option>
<option value="โรงเรียนอนุบาลเพชรบุรี" className="user-generated">โรงเรียนอนุบาลเพชรบุรี</option>
<option value="โรงเรียนอนุบาลเพชรบูรณ์" className="user-generated">โรงเรียนอนุบาลเพชรบูรณ์</option>
<option value="โรงเรียนอนุบาลแพร่" className="user-generated">โรงเรียนอนุบาลแพร่</option>
<option value="โรงเรียนอนุบาลภูเก็ต" className="user-generated">โรงเรียนอนุบาลภูเก็ต</option>
<option value="โรงเรียนอนุบาลมหาสารคาม" className="user-generated">โรงเรียนอนุบาลมหาสารคาม</option>
<option value="โรงเรียนอนุบาลมุกดาหาร" className="user-generated">โรงเรียนอนุบาลมุกดาหาร</option>
<option value="โรงเรียนอนุบาลแม่ฮ่องสอน" className="user-generated">โรงเรียนอนุบาลแม่ฮ่องสอน</option>
<option value="โรงเรียนอนุบาลยโสธร" className="user-generated">โรงเรียนอนุบาลยโสธร</option>
<option value="โรงเรียนอนุบาลยะลา" className="user-generated">โรงเรียนอนุบาลยะลา</option>
<option value="โรงเรียนอนุบาลร้อยเอ็ด" className="user-generated">โรงเรียนอนุบาลร้อยเอ็ด</option>
<option value="โรงเรียนอนุบาลระนอง" className="user-generated">โรงเรียนอนุบาลระนอง</option>
<option value="โรงเรียนอนุบาลระยอง" className="user-generated">โรงเรียนอนุบาลระยอง</option>
<option value="โรงเรียนอนุบาลราชบุรี" className="user-generated">โรงเรียนอนุบาลราชบุรี</option>
<option value="โรงเรียนอนุบาลลพบุรี" className="user-generated">โรงเรียนอนุบาลลพบุรี</option>
<option value="โรงเรียนอนุบาลลำปาง (เขลางค์รัตน์อนุสรณ์)" className="user-generated">โรงเรียนอนุบาลลำปาง (เขลางค์รัตน์อนุสรณ์)</option>
<option value="โรงเรียนอนุบาลลำพูน" className="user-generated">โรงเรียนอนุบาลลำพูน</option>
<option value="โรงเรียนอนุบาลเลย" className="user-generated">โรงเรียนอนุบาลเลย</option>
<option value="โรงเรียนอนุบาลศรีสะเกษ" className="user-generated">โรงเรียนอนุบาลศรีสะเกษ</option>
<option value="โรงเรียนอนุบาลสกลนคร" className="user-generated">โรงเรียนอนุบาลสกลนคร</option>
<option value="โรงเรียนอนุบาลสงขลา" className="user-generated">โรงเรียนอนุบาลสงขลา</option>
<option value="โรงเรียนอนุบาลสตูล" className="user-generated">โรงเรียนอนุบาลสตูล</option>
<option value="โรงเรียนอนุบาลวัดพิชัยสงคราม" className="user-generated">โรงเรียนอนุบาลวัดพิชัยสงคราม</option>
<option value="โรงเรียนอนุบาลสมุทรสงคราม" className="user-generated">โรงเรียนอนุบาลสมุทรสงคราม</option>
<option value="โรงเรียนอนุบาลสมุทรสาคร" className="user-generated">โรงเรียนอนุบาลสมุทรสาคร</option>
<option value="โรงเรียนอนุบาลวัดสระแก้ว" className="user-generated">โรงเรียนอนุบาลวัดสระแก้ว</option>
<option value="โรงเรียนอนุบาลสระบุรี" className="user-generated">โรงเรียนอนุบาลสระบุรี</option>
<option value="โรงเรียนอนุบาลสิงห์บุรี" className="user-generated">โรงเรียนอนุบาลสิงห์บุรี</option>
<option value="โรงเรียนอนุบาลสุโขทัย" className="user-generated">โรงเรียนอนุบาลสุโขทัย</option>
<option value="โรงเรียนอนุบาลสุพรรณบุรี" className="user-generated">โรงเรียนอนุบาลสุพรรณบุรี</option>
<option value="โรงเรียนอนุบาลสุราษฎร์ธานี" className="user-generated">โรงเรียนอนุบาลสุราษฎร์ธานี</option>
<option value="โรงเรียนอนุบาลสุรินทร์" className="user-generated">โรงเรียนอนุบาลสุรินทร์</option>
<option value="โรงเรียนอนุบาลหนองคาย" className="user-generated">โรงเรียนอนุบาลหนองคาย</option>
<option value="โรงเรียนอนุบาลหนองบัวลำภู" className="user-generated">โรงเรียนอนุบาลหนองบัวลำภู</option>
<option value="โรงเรียนอนุบาลวัดอ่างทอง" className="user-generated">โรงเรียนอนุบาลวัดอ่างทอง</option>
<option value="โรงเรียนอนุบาลอำนาจเจริญ" className="user-generated">โรงเรียนอนุบาลอำนาจเจริญ</option>
<option value="โรงเรียนอนุบาลอุดรธานี" className="user-generated">โรงเรียนอนุบาลอุดรธานี</option>
<option value="โรงเรียนอนุบาลอุตรดิตถ์" className="user-generated">โรงเรียนอนุบาลอุตรดิตถ์</option>
<option value="โรงเรียนอนุบาลเมืองอุทัยธานี" className="user-generated">โรงเรียนอนุบาลเมืองอุทัยธานี</option>
<option value="โรงเรียนอนุบาลอุบลราชธานี" className="user-generated">โรงเรียนอนุบาลอุบลราชธานี</option>
<option value="โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย กรุงเทพมหานคร" className="user-generated">โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย กรุงเทพมหานคร</option>
<option value="โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครปฐม" className="user-generated">โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครปฐม</option>
<option value="โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครนายก" className="user-generated">โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครนายก</option>
<option value="โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครราชสีมา" className="user-generated">โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย นครราชสีมา</option>
<option value="โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย พัทลุง" className="user-generated">โรงเรียนอุบลรัตนราชกัญญาราชวิทยาลัย พัทลุง</option>
<option value="โรงเรียนปิยมาตย์" className="user-generated">โรงเรียนปิยมาตย์</option>
<option value="โรงเรียนมาแตร์เดอีวิทยาลัย" className="user-generated">โรงเรียนมาแตร์เดอีวิทยาลัย</option>
<option value="โรงเรียนเรยีนาเชลีวิทยาลัย" className="user-generated">โรงเรียนเรยีนาเชลีวิทยาลัย</option>
<option value="โรงเรียนวาสุเทวี" className="user-generated">โรงเรียนวาสุเทวี</option>
<option value="ABC Pathways International Kindergarten	Bangkok" className="user-generated">ABC Pathways International Kindergarten	Bangkok</option>
<option value="The American School of Bangkok, Sukhumvit Campus	Bangkok" className="user-generated">The American School of Bangkok, Sukhumvit Campus	Bangkok</option>
<option value="Anglo Singapore International School	Bangkok" className="user-generated">Anglo Singapore International School	Bangkok</option>
<option value="Anglo Singapore International School Sukhumvit 31	Bangkok" className="user-generated">Anglo Singapore International School Sukhumvit 31	Bangkok</option>
<option value="Annabel's Early Years International Kindergarten	Bangkok" className="user-generated">Annabel's Early Years International Kindergarten	Bangkok</option>
<option value="Ascot International School	Bangkok" className="user-generated">Ascot International School	Bangkok</option>
<option value="The Australian International School Bangkok	Bangkok" className="user-generated">The Australian International School Bangkok	Bangkok</option>
<option value="Bangkok Advent School	Bangkok" className="user-generated">Bangkok Advent School	Bangkok</option>
<option value="Bangkok Adventist International School	Bangkok" className="user-generated">Bangkok Adventist International School	Bangkok</option>
<option value="Bangkok Christian International School	Bangkok" className="user-generated">Bangkok Christian International School	Bangkok</option>
<option value="Bangkok Grace International School	Bangkok" className="user-generated">Bangkok Grace International School	Bangkok</option>
<option value="Bangkok Patana School	Bangkok" className="user-generated">Bangkok Patana School	Bangkok</option>
<option value="Bangkok International Preparatory and Secondary School	Bangkok" className="user-generated">Bangkok International Preparatory and Secondary School	Bangkok</option>
<option value="Berkeley International School	Bangkok" className="user-generated">Berkeley International School	Bangkok</option>
<option value="Blooming Buds International Kindergarten	Bangkok" className="user-generated">Blooming Buds International Kindergarten	Bangkok</option>
<option value="British Columbia International School Bangkok	Bangkok" className="user-generated">British Columbia International School Bangkok	Bangkok</option>
<option value="Bromsgrove International School	Bangkok" className="user-generated">Bromsgrove International School	Bangkok</option>
<option value="Bromsgrove International Primary School	Bangkok" className="user-generated">Bromsgrove International Primary School	Bangkok</option>
<option value="Charter International School	Bangkok" className="user-generated">Charter International School	Bangkok</option>
<option value="Crescent International School	Bangkok" className="user-generated">Crescent International School	Bangkok</option>
<option value="The Early Learning Centre International School	Bangkok" className="user-generated">The Early Learning Centre International School	Bangkok</option>
<option value="Ekamai International School	Bangkok" className="user-generated">Ekamai International School	Bangkok</option>
<option value="The First Steps International Pre-School	Bangkok" className="user-generated">The First Steps International Pre-School	Bangkok</option>
<option value="Garden International School Bangkok	Bangkok" className="user-generated">Garden International School Bangkok	Bangkok</option>
<option value="Glory Singapore International School	Bangkok" className="user-generated">Glory Singapore International School	Bangkok</option>
<option value="Harrow International School, Bangkok	Bangkok" className="user-generated">Harrow International School, Bangkok	Bangkok</option>
<option value="Heathfield International School	Bangkok" className="user-generated">Heathfield International School	Bangkok</option>
<option value="International Community School	Bangkok" className="user-generated">International Community School	Bangkok</option>
<option value="International Montessori Center	Bangkok" className="user-generated">International Montessori Center	Bangkok</option>
<option value="International Pioneers School	Bangkok" className="user-generated">International Pioneers School	Bangkok</option>
<option value="IPC International Kindergarten	Bangkok" className="user-generated">IPC International Kindergarten	Bangkok</option>
<option value="Ivy Bound International School	Bangkok" className="user-generated">Ivy Bound International School	Bangkok</option>
<option value="Josuikan Bangkok International School	Bangkok" className="user-generated">Josuikan Bangkok International School	Bangkok</option>
<option value="Keerapat International School	Bangkok" className="user-generated">Keerapat International School	Bangkok</option>
<option value="Kensington International Kindergarten	Bangkok" className="user-generated">Kensington International Kindergarten	Bangkok</option>
<option value="Kevalee International School	Bangkok" className="user-generated">Kevalee International School	Bangkok</option>
<option value="Kevalee International Day School	Bangkok" className="user-generated">Kevalee International Day School	Bangkok</option>
<option value="KiddyKare International Kindergarten	Bangkok" className="user-generated">KiddyKare International Kindergarten	Bangkok</option>
<option value="Kids' Academy International Pre-School	Bangkok" className="user-generated">Kids' Academy International Pre-School	Bangkok</option>
<option value="Kids Kingdom International Kindergarten	Bangkok" className="user-generated">Kids Kingdom International Kindergarten	Bangkok</option>
<option value="Kidz Village International Kindergarten	Bangkok" className="user-generated">Kidz Village International Kindergarten	Bangkok</option>
<option value="Kincaid International School	Bangkok" className="user-generated">Kincaid International School	Bangkok</option>
<option value="Kinder Bear Academy International Preschool	Bangkok" className="user-generated">Kinder Bear Academy International Preschool	Bangkok</option>
<option value="Kirakira Kids International Kindergarten	Bangkok" className="user-generated">Kirakira Kids International Kindergarten	Bangkok</option>
<option value="KIS International School	Bangkok" className="user-generated">KIS International School	Bangkok</option>
<option value="Kobato International Kindergarten	Bangkok" className="user-generated">Kobato International Kindergarten	Bangkok</option>
<option value="Korean International School of Bangkok	Bangkok" className="user-generated">Korean International School of Bangkok	Bangkok</option>
<option value="Ladybird International Kindergarten	Bangkok" className="user-generated">Ladybird International Kindergarten	Bangkok</option>
<option value="Learning Home International Kindergarten	Bangkok" className="user-generated">Learning Home International Kindergarten	Bangkok</option>
<option value="Little House International Pre-School	Bangkok" className="user-generated">Little House International Pre-School	Bangkok</option>
<option value="Lycée Français International de Bangkok	Bangkok" className="user-generated">Lycée Français International de Bangkok	Bangkok</option>
<option value="Melodies International Kindergarten	Bangkok" className="user-generated">Melodies International Kindergarten	Bangkok</option>
<option value="Modern International School Bangkok	Bangkok" className="user-generated">Modern International School Bangkok	Bangkok</option>
<option value="Modern Montessori International Pre-School	Bangkok" className="user-generated">Modern Montessori International Pre-School	Bangkok</option>
<option value="Montessori Academy Bangkok International School	Bangkok" className="user-generated">Montessori Academy Bangkok International School	Bangkok</option>
<option value="Mulberry House International Pre-School	Bangkok" className="user-generated">Mulberry House International Pre-School	Bangkok</option>
<option value="New Bambino International Kindergarten	Bangkok" className="user-generated">New Bambino International Kindergarten	Bangkok</option>
<option value="New Sathorn International School	Bangkok" className="user-generated">New Sathorn International School	Bangkok</option>
<option value="NIST International School	Bangkok" className="user-generated">NIST International School	Bangkok</option>
<option value="Niva International School	Bangkok" className="user-generated">Niva International School	Bangkok</option>
<option value="OISCA International Kindergarten	Bangkok" className="user-generated">OISCA International Kindergarten	Bangkok</option>
<option value="Pan-Asia International School	Bangkok" className="user-generated">Pan-Asia International School	Bangkok</option>
<option value="Parkplace International Pre-School	Bangkok" className="user-generated">Parkplace International Pre-School	Bangkok</option>
<option value="Prep International Kindergarten	Bangkok" className="user-generated">Prep International Kindergarten	Bangkok</option>
<option value="Prep Montessori International Kindergarten, Ladprao 88 Campus	Bangkok" className="user-generated">Prep Montessori International Kindergarten, Ladprao 88 Campus	Bangkok</option>
<option value="Ramkhamhaeng Advent International School	Bangkok" className="user-generated">Ramkhamhaeng Advent International School	Bangkok</option>
<option value="Rasami British International School	Bangkok" className="user-generated">Rasami British International School	Bangkok</option>
<option value="RC International School	Bangkok" className="user-generated">RC International School	Bangkok</option>
<option value="Regent's International School, Bangkok	Bangkok" className="user-generated">Regent's International School, Bangkok	Bangkok</option>
<option value="Ruamrudee International School	Bangkok" className="user-generated">Ruamrudee International School	Bangkok</option>
<option value="Sabai-Jai International Kindergarten	Bangkok" className="user-generated">Sabai-Jai International Kindergarten	Bangkok</option>
<option value="St. Andrews International School Bangkok	Bangkok" className="user-generated">St. Andrews International School Bangkok	Bangkok</option>
<option value="St. Andrews International School, Dusit	Bangkok" className="user-generated">St. Andrews International School, Dusit	Bangkok</option>
<option value="St. Andrews International School, Sathorn	Bangkok" className="user-generated">St. Andrews International School, Sathorn	Bangkok</option>
<option value="St. Andrews International School, Sukhumvit 107	Bangkok" className="user-generated">St. Andrews International School, Sukhumvit 107	Bangkok</option>
<option value="St. George's International School	Bangkok" className="user-generated">St. George's International School	Bangkok</option>
<option value="Saint John's International School	Bangkok" className="user-generated">Saint John's International School	Bangkok</option>
<option value="St. Mark's International School Bangkok	Bangkok" className="user-generated">St. Mark's International School Bangkok	Bangkok</option>
<option value="St. Michael's International Kindergarten	Bangkok" className="user-generated">St. Michael's International Kindergarten	Bangkok</option>
<option value="St. Stephen's International School	Bangkok" className="user-generated">St. Stephen's International School	Bangkok</option>
<option value="Seeh Phinong International Kindergarten	Bangkok" className="user-generated">Seeh Phinong International Kindergarten	Bangkok</option>
<option value="Shrewsbury International School	Bangkok" className="user-generated">Shrewsbury International School	Bangkok</option>
<option value="Singapore International School of Bangkok	Bangkok" className="user-generated">Singapore International School of Bangkok	Bangkok</option>
<option value="Takenoko International Kindergarten	Bangkok" className="user-generated">Takenoko International Kindergarten	Bangkok</option>
<option value="Talents International Pre-School	Bangkok" className="user-generated">Talents International Pre-School	Bangkok</option>
<option value="Thai Sikh International School of Bangkok	Bangkok" className="user-generated">Thai Sikh International School of Bangkok	Bangkok</option>
<option value="Thai–Japanese Association School	Bangkok" className="user-generated">Thai–Japanese Association School	Bangkok</option>
<option value="The Tiny Seeds International Pre-School	Bangkok" className="user-generated">The Tiny Seeds International Pre-School	Bangkok</option>
<option value="Topsy Turvy International School	Bangkok" className="user-generated">Topsy Turvy International School	Bangkok</option>
<option value="Traill International School	Bangkok" className="user-generated">Traill International School	Bangkok</option>
<option value="Trinity International School	Bangkok" className="user-generated">Trinity International School	Bangkok</option>
<option value="Wells International School	Bangkok" className="user-generated">Wells International School	Bangkok</option>
<option value="Wells International School On Nut Campus	Bangkok" className="user-generated">Wells International School On Nut Campus	Bangkok</option>
<option value="Wells International Kindergarten	Bangkok" className="user-generated">Wells International Kindergarten	Bangkok</option>
<option value="Youth Exchange International School	Bangkok" className="user-generated">Youth Exchange International School	Bangkok</option>
<option value="Manorom International Christian School	Chai Nat" className="user-generated">Manorom International Christian School	Chai Nat</option>
<option value="Panyaden International School[citation needed]	Chiang Mai" className="user-generated">Panyaden International School[citation needed]	Chiang Mai</option>
<option value="American Pacific International School	Chiang Mai" className="user-generated">American Pacific International School	Chiang Mai</option>
<option value="American Pacific International Kindergarten	Chiang Mai" className="user-generated">American Pacific International Kindergarten	Chiang Mai</option>
<option value="Chiang Mai International School	Chiang Mai" className="user-generated">Chiang Mai International School	Chiang Mai</option>
<option value="Christliche Deutsche Schule Chiang Mai	Chiang Mai" className="user-generated">Christliche Deutsche Schule Chiang Mai	Chiang Mai</option>
<option value="Future Leaders International School	Chiang Mai" className="user-generated">Future Leaders International School	Chiang Mai</option>
<option value="Grace International School	Chiang Mai" className="user-generated">Grace International School	Chiang Mai</option>
<option value="Hana Christian International Kindergarten	Chiang Mai" className="user-generated">Hana Christian International Kindergarten	Chiang Mai</option>
<option value="Lanna International School	Chiang Mai" className="user-generated">Lanna International School	Chiang Mai</option>
<option value="Nakornpayap International School	Chiang Mai" className="user-generated">Nakornpayap International School	Chiang Mai</option>
<option value="Prem Tinsulanonda International School	Chiang Mai" className="user-generated">Prem Tinsulanonda International School	Chiang Mai</option>
<option value="Southeast Asia International School	Chiang Mai" className="user-generated">Southeast Asia International School	Chiang Mai</option>
<option value="Chiang Rai International Christian School	Chiang Rai" className="user-generated">Chiang Rai International Christian School	Chiang Rai</option>
<option value="Chiang Rai International School	Chiang Rai" className="user-generated">Chiang Rai International School	Chiang Rai</option>
<option value="International School of Chonburi	Chon Buri" className="user-generated">International School of Chonburi	Chon Buri</option>
<option value="ISE International School	Chon Buri" className="user-generated">ISE International School	Chon Buri</option>
<option value="Ladybird International Kindergarten	Chon Buri" className="user-generated">Ladybird International Kindergarten	Chon Buri</option>
<option value="Mooltripakdee International School	Chon Buri" className="user-generated">Mooltripakdee International School	Chon Buri</option>
<option value="Regents International School Pattaya	Chon Buri" className="user-generated">Regents International School Pattaya	Chon Buri</option>
<option value="Tara Pattana International School	Chon Buri" className="user-generated">Tara Pattana International School	Chon Buri</option>
<option value="Thai–Japanese Association School Sriracha	Chon Buri" className="user-generated">Thai–Japanese Association School Sriracha	Chon Buri</option>
<option value="Theodore International School	Chumphon" className="user-generated">Theodore International School	Chumphon</option>
<option value="Khon Kaen International School	Khon Kaen" className="user-generated">Khon Kaen International School	Khon Kaen</option>
<option value="Global Village School Lanta	Koh Lanta" className="user-generated">Global Village School Lanta	Koh Lanta</option>
<option value="British International School Krabi	Krabi" className="user-generated">British International School Krabi	Krabi</option>
<option value="Krabi International School	Krabi" className="user-generated">Krabi International School	Krabi</option>
<option value="Nawattaphume International School Lampang	Lampang" className="user-generated">Nawattaphume International School Lampang	Lampang</option>
<option value="Adventist International Mission School – Korat	Nakhon Ratchasima" className="user-generated">Adventist International Mission School – Korat	Nakhon Ratchasima</option>
<option value="Anglo Singapore International School Nakhon Ratchasima	Nakhon Ratchasima" className="user-generated">Anglo Singapore International School Nakhon Ratchasima	Nakhon Ratchasima</option>
<option value="St. Stephen's International School, Khao Yai Campus	Nakhon Ratchasima" className="user-generated">St. Stephen's International School, Khao Yai Campus	Nakhon Ratchasima</option>
<option value="Wesley International School	Nakhon Ratchasima" className="user-generated">Wesley International School	Nakhon Ratchasima</option>
<option value="Hampton International Preschool	Nonthaburi" className="user-generated">Hampton International Preschool	Nonthaburi</option>
<option value="International School Bangkok	Nonthaburi" className="user-generated">International School Bangkok	Nonthaburi</option>
<option value="Little Dragons International School	Nonthaburi" className="user-generated">Little Dragons International School	Nonthaburi</option>
<option value="Magic Years International School	Nonthaburi" className="user-generated">Magic Years International School	Nonthaburi</option>
<option value="St. Andrews Samakee International School	Nonthaburi" className="user-generated">St. Andrews Samakee International School	Nonthaburi</option>
<option value="Global Indian International School	Pathum Thani" className="user-generated">Global Indian International School	Pathum Thani</option>
<option value="Sathit Pathum Demonstration School	Pathum Thani" className="user-generated">Sathit Pathum Demonstration School	Pathum Thani</option>
<option value="Siam International School	Pathum Thani" className="user-generated">Siam International School	Pathum Thani</option>
<option value="Cambridge College (Thailand)	Phitsanulok" className="user-generated">Cambridge College (Thailand)	Phitsanulok</option>
<option value="British International School, Phuket	Phuket" className="user-generated">British International School, Phuket	Phuket</option>
<option value="HeadStart International School	Phuket" className="user-generated">HeadStart International School	Phuket</option>
<option value="Kajonkiet International School Phuket	Phuket" className="user-generated">Kajonkiet International School Phuket	Phuket</option>
<option value="Palm House International School	Phuket" className="user-generated">Palm House International School	Phuket</option>
<option value="QSI International School of Phuket	Phuket" className="user-generated">QSI International School of Phuket	Phuket</option>
<option value="Rawai Progressive International School	Phuket" className="user-generated">Rawai Progressive International School	Phuket</option>
<option value="United World College Thailand	Phuket" className="user-generated">United World College Thailand	Phuket</option>
<option value="Garden International School Rayong	Rayong" className="user-generated">Garden International School Rayong	Rayong</option>
<option value="St. Andrews International School, Green Valley	Rayong" className="user-generated">St. Andrews International School, Green Valley	Rayong</option>
<option value="Silver Fern International School	Roi Et" className="user-generated">Silver Fern International School	Roi Et</option>
<option value="The American School of Bangkok, Green Valley Campus	Samut Prakan" className="user-generated">The American School of Bangkok, Green Valley Campus	Samut Prakan</option>
<option value="Concordian International School	Samut Prakan" className="user-generated">Concordian International School	Samut Prakan</option>
<option value="PPMAS-SINGAPORE International School	Samut Prakan" className="user-generated">PPMAS-SINGAPORE International School	Samut Prakan</option>
<option value="Raffles American School Bangkok[citation needed]	Samut Prakan" className="user-generated">Raffles American School Bangkok[citation needed]	Samut Prakan</option>
<option value="Singapore International School Suvarnabhumi	Samut Prakan" className="user-generated">Singapore International School Suvarnabhumi	Samut Prakan</option>
<option value="Thai-Chinese International School	Samut Prakan" className="user-generated">Thai-Chinese International School	Samut Prakan</option>
<option value="Thai Sikh International School	Samut Prakan" className="user-generated">Thai Sikh International School	Samut Prakan</option>
<option value="Thai–Singapore International School	Samut Prakan" className="user-generated">Thai–Singapore International School	Samut Prakan</option>
<option value="Norwich International School	Samut Sakhon" className="user-generated">Norwich International School	Samut Sakhon</option>
<option value="Adventist International Mission School	Saraburi" className="user-generated">Adventist International Mission School	Saraburi</option>
<option value="California Prep International School	Saraburi" className="user-generated">California Prep International School	Saraburi</option>
<option value="John Wyatt Montessori Nongdon	Saraburi" className="user-generated">John Wyatt Montessori Nongdon	Saraburi</option>
<option value="Saint John Mary International School	Saraburi" className="user-generated">Saint John Mary International School	Saraburi</option>
<option value="Bloomsbury International School Hatyai	Songkhla" className="user-generated">Bloomsbury International School Hatyai	Songkhla</option>
<option value="American Prep International School Hatyai[citation needed]	Songkhla" className="user-generated">American Prep International School Hatyai[citation needed]	Songkhla</option>
<option value="Southern International School Hatyai	Songkhla" className="user-generated">Southern International School Hatyai	Songkhla</option>
<option value="The International School of Samui	Surat Thani" className="user-generated">The International School of Samui	Surat Thani</option>
<option value="Oonrak International School, Koh Samui	Surat Thani" className="user-generated">Oonrak International School, Koh Samui	Surat Thani</option>
<option value="PanyaDee, The British International School of Samui	Surat Thani" className="user-generated">PanyaDee, The British International School of Samui	Surat Thani</option>
<option value="SCL International School (Samui Centre of Learning)	Surat Thani" className="user-generated">SCL International School (Samui Centre of Learning)	Surat Thani</option>
<option value="Surat Thani International School	Surat Thani" className="user-generated">Surat Thani International School	Surat Thani</option>
<option value="Ubon Adventist International Mission School	Ubon Ratchathani" className="user-generated">Ubon Adventist International Mission School	Ubon Ratchathani</option>
<option value="Udon Thani International School	Udon Thani" className="user-generated">Udon Thani International School	Udon Thani</option>
<option value="other" className="user-generated">อื่นๆ</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '25px' }} className={ this.state.answer === 'other' ? "" : "hidden" }>
                        <h4 className="question-title-container">
                            <span className="user-generated notranslate" style={this.props.fontStyles}>{'กรุณากรอกชื่อสถาบันของท่าน'}</span>
                        </h4>
                        <div className="question-body clearfix notranslate ">
                            <textarea id={`question-${this.props.question.name}-text`} value={this.state.answerText} onChange={ (e) => this.onChangeTextHandler(e) } className="textarea" rows={1} cols={50} maxLength={200} style={this.props.fontStyles}></textarea>
                        </div>
                    </div>
                    
                </fieldset>
            </div>
        );
    };
}
export default DropdownQuestion;