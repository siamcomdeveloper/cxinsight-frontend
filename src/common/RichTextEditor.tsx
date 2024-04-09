import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';
import * as toastr from 'toastr';
import reactCSS from 'reactcss';

const Font = Quill.import("formats/font");
Font.whitelist = [false,"AppleTH","AppleEN","Arial","ArialBlack","BookAntiqua","ComicSansMS","CourierNew","Georgia","Helvetica","Impact","Lucida","Monospace","National2","Roboto","Symbol","Tahoma","Terminal","TimesNewRoman","TrebuchetMS","Verdana","Webdings","Wingdings"];
Quill.register(Font, true);

// const fontSizeStyle = Quill.import('attributors/style/size');
// fontSizeStyle.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '36px'];
// fontSizeStyle.whitelist = ['28px', '30px', '32px'];
// Quill.register(fontSizeStyle, true);

interface IProps {
  //code related to your props goes here
	xSite: any;
	id: any;
	index?: any;
	realIndex?: any;
	theme: any;
	// data?: any,
	fontColor: any,
  defaultValue: any;
	placeholder: any;
	disable?: any;
	disableAlign?: any;
	style?: any;
	onChange: (id: any, e: any, index?: any, realIndex?: any) => any;
	// rerender: (id: any, callbackData: any, callbackPlaceholder: any) => any;
	// hideToolbar: any;
	// onBlur: (e: any) => any;
	// onFocus: (e: any) => any;
	// id: any;
  // onChange: (content: string, delta: any, source: any, editor: { getHTML: () => any; getText: () => any; getLength: () => any) => void;
}
interface IState {
	id: any;
	index: any;
	realIndex: any;
	theme: any;
	fontColor: any,
  defaultValue: any;
	placeholder: any;
	disableAlign?: any;
	style: any;

	editorHtml: any;
	disable: any;
	align: any;
}

class RichTextEditor extends Component<IProps, IState> {
  modules: any;
  formats: any;

	constructor(props: IProps) {
		super(props);
		 
		// console.log(`RichTextEditor id = ${this.props.id}`, props);

		this.state = {
			id: this.props.id,
			index: this.props.index ? this.props.index : '',
			realIndex: this.props.realIndex ? this.props.realIndex : '',
			theme: this.props.theme,
			fontColor: this.props.fontColor,
			defaultValue: this.props.defaultValue,
			placeholder: this.props.placeholder,
			disableAlign: this.props.disableAlign ? this.props.disableAlign : false,
			style: this.props.style ? this.props.style : {},
			
			editorHtml: this.props.defaultValue ? this.props.defaultValue : '<p></p>',
			align: this.props.disableAlign ? [] : [{ 'align': [] }],
			disable: this.props.disable ? true : false
		}

		// this.modules = {
		// 	toolbar: [
		//       [{ 'font': [] }],
		//       [{ 'size': ['small', false, 'large', 'huge'] }],
		//       ['bold', 'italic', 'underline'],
		//       // [{'list': 'ordered'}, {'list': 'bullet'}],
		//       [{ 'align': [] }],
    //       [{ 'color': [] }], 
    //       // // { 'background': [] }],
		//       ['clean']
		//     ]
		// };

		this.modules = {
			toolbar: {
				container: [
					[{ 'font': Font.whitelist }],
					[{ 'size': ['small', false, 'large', 'huge'] }],
					// [{ 'font': [] }],
		      // [{ 'size': [false, '8pt', '10pt', '12pt', '14pt', '16pt', '18pt', '24pt', '36pt'] }],
					// [{ size: ['12px','14px', '16px','18px','20px'] }],
					// [{ 'size': fontSizeStyle }],
					['bold', 'italic', 'underline'],
					// [{'indent': '-1'}, {'indent': '+1'}],
					['link'],
		      // [{'list': 'ordered'}, {'list': 'bullet'}],
		      this.state.align,
					[{ 'color': this.props.fontColor }, 'custom-color'],
					['clean']
				],
				handlers: {
					'custom-color': function () { 
						try{
							// console.log('handlers custom', props.fontColor.length+1); 
							const value = window.prompt('Enter Hex Color Code');
							console.log('color value', value);

							if(value !== null){//not null
									// console.log('check firtst value', value.charAt(0) === '#');
									// console.log('check substring(1) value', value.substring(1));
									// const colorNumber = value.substring(1);
									// console.log('colorNumber', colorNumber);
									// const numbers = /^[-+]?[0-9]+$/;
									// if(value.charAt(0) === '#' && colorNumber.length === 6 && colorNumber.match(numbers)){
									const HEX_PATTERN = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
									if(value.match(HEX_PATTERN)){
										// alert('Added the new color');

										const jwt = getJwtToken();
										BaseService.create(props.xSite, "/color/", { hex_code: value, order_no: props.fontColor.length+1 }, jwt).then(
												(rp) => {
														try{
																if (rp.Status) {
																		// console.log(rp);
																		toastr.success(rp.Messages);
																		// console.log('props.id', props.id); 
																		// console.log('props.data', props.data);
																		// console.log('props.placeholder', props.placeholder); 
																		// props.rerender(props.id, props.data, props.placeholder);
																		setTimeout(function(){ window.location.reload(); }, 500);
																} else {
																		// toastr.error(rp.Messages);
																		toastr.error('Something went wrong!, please refresh the page or try again later.');
																		BaseService.post(props.xSite, "/frontendlog/", { method: `RichTextEditor handlers custom BaseService.create /addcustomcolor/ else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
																}
														}catch(error){ 
																toastr.error('Something went wrong!, please refresh the page or try again later.');
																BaseService.post(props.xSite, "/frontendlog/", { method: `RichTextEditor handlers custom BaseService.create /addcustomcolor/ catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
														}
												}
										);
										
									} else {
										toastr.error('Incorrect format, Please try again with corret format (Ex. #FFFFFF or #000)');
									}
							}

						}catch(error){ 
							toastr.error('Something went wrong!, please refresh the page or try again later.');
							BaseService.post(props.xSite, "/frontendlog/", { method: `RichTextEditor handlers custom catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
						}
					}

				}
				// handlers: {
				// 	'color': (value: any) => {
				// 		if (value == 'custom-color') { 
				// 			value = window.prompt('Enter Hex Color Code');
				// 			console.log('color value', value);
				// 		}
				// 		// Quill.format('color', value);
				// 		// let fields = [] as any;
              
				// 		// if(this.state.survey.multi_lang) fields = ['end_of_survey_message', 'end_of_survey_message_EN'];
				// 		// else fields = ['end_of_survey_message'];

				// 		// const jwt = getJwtToken();
				// 		// BaseService.update(props.xSite, "/surveys/", this.state.survey.id, this.selectUpdate(this.state.survey, fields, [this.state.survey.end_of_survey_message, this.state.survey.end_of_survey_message_EN]), jwt).then(
				// 		// 		(rp) => {
				// 		// 				try{
				// 		// 						if (rp.Status) {
				// 		// 								// console.log(rp);
				// 		// 								toastr.success(rp.Messages);
				// 		// 								setTimeout(function(){ window.location.reload(); }, 500);
				// 		// 						} else {
				// 		// 								toastr.error(rp.Messages);
				// 		// 								BaseService.post("/frontendlog/", { method: `surveyEndOfSurveyMessageForm check BaseService.update /surveys/${this.state.survey.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
				// 		// 						}
				// 		// 				}catch(error){ 
				// 		// 						BaseService.post("/frontendlog/", { method: `surveyEndOfSurveyMessageForm check BaseService.update /surveys/${this.state.survey.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
				// 		// 				}
				// 		// 		}
				// 		// );
				// 	}
				// }
				// handlers: {
				// 		"placeholder": (value: any) => { 
				// 				if (value) {
				// 						const cursorPosition = this.quill.getSelection().index;
				// 						this.quill.insertText(cursorPosition, value);
				// 						this.quill.setSelection(cursorPosition + value.length);
				// 				}
				// 		}
				// }
			},
			// keyboard: {
			// 	bindings: {
			// 		tab: false,
			// 		custom: {
			// 			key: 13,
			// 			shiftKey: true,
			// 			handler: function () { /** do nothing */ }
			// 		},
			// 		handleEnter: {
			// 			key: 13,
			// 			handler: function () { /** do nothing */ }
			// 		}
			// 	}
			// },
			// 'emoji-toolbar': true,
			// 'emoji-textarea': true,
			// 'emoji-shortname': true,
		};
	

		// this.modules = {
		// 	toolbar: {
		// 		container: "#toolbar"
		// 	}
		// };

		this.formats = [
			// 'header',
			'font',
			'size',
			'bold', 'italic', 'underline',
			// 'list', 'bullet',
			'align',
			'color', 
			// 'background'
			// 'indent',
			'link'
		];

		// this.formats = [
		// 	'header',
		// 	'bold', 'italic', 'underline',
		// 	'list', 'indent'
		// ];

		this.rteChange = this.rteChange.bind(this);
	}

	componentDidMount() { 
			// console.log('RichTextEditor componentDidMount survey', this.props.survey);
			// console.log('RichTextEditor componentDidMount pageNo', this.props.pageNo);

			// if(this.props.data){
			// 		const descriptionData = this.props.data[0];
			// 		const pageNo = this.props.data[1];
			// 		const description = descriptionData ? descriptionData.includes('~') ? descriptionData.split('~') : [descriptionData] : [''];
			// 		// console.log('description', description);

			// 		const currentDescription = description[pageNo-1];
			// 		// console.log('currentDescription', currentDescription);

			// 		this.setState({ editorHtml: `${currentDescription}` });
			// }
	}

	componentWillReceiveProps(props: any) {
			//Update state with props When Answer Choice Removed
			if(this.state.index && props.index && this.state.index !== props.index){
					// console.log('RichTextEditor componentWillReceiveProps this.state.id', this.state.id);
					// console.log('RichTextEditor componentWillReceiveProps props.id', props.id);

					// console.log('RichTextEditor componentWillReceiveProps this.state.index', this.state.index);
					// console.log('RichTextEditor componentWillReceiveProps props.index', props.index);

					// console.log('RichTextEditor componentWillReceiveProps this.state.realIndex', this.state.realIndex);
					// console.log('RichTextEditor componentWillReceiveProps props.realIndex', props.realIndex);

					// console.log('RichTextEditor componentWillReceiveProps this.state.defaultValue', this.state.defaultValue);
					// console.log('RichTextEditor componentWillReceiveProps this.state.editorHtml', this.state.editorHtml);
					// console.log('RichTextEditor componentWillReceiveProps props.defaultValue', props.defaultValue);

					this.setState({ 
						...this.state,
						index: this.props.index,
						editorHtml: props.defaultValue ? props.defaultValue : `<p></p>`
					});
			}
	 }
	
	rteChange = (content: any, delta: any, source: any, editor: { getHTML: () => any; getText: () => any; getLength: () => any; }) => {
		// console.log('rteChange', editor.getHTML()); // rich text
		// console.log('rteChange', editor.getText()); // plain text
		// console.log('rteChange', editor.getLength()); // number of characters
		
		//Answer Question Choice change
		// if(this.state.realIndex){
		// 	this.setState({ editorHtml: editor.getHTML() }, () => {
		// 		// console.log('this.props.id', this.props.id);
		// 		this.props.onChange(this.state.id, { 
		// 			// id: this.state.id,
		// 			text: editor.getText(),
		// 			html: editor.getHTML(),
		// 			length: editor.getLength()
		// 		}, this.state.index, this.state.realIndex);
		// 	});
		// }
		// else{
			this.setState({ editorHtml: editor.getHTML() }, () => {
				// console.log('this.props.id', this.props.id);
				this.props.onChange(this.state.id, { 
					// id: this.state.id,
					text: editor.getText(),
					html: editor.getHTML(),
					length: editor.getLength()
				}, this.state.index);
			});
		// }
		
		// this.props.onChange({ richText: editor.getText(), richHTML: editor.getHTML(), richLength: editor.getLength()});
		// return editor.getText();
	}

	getDateTime(){
		const today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth()+1; //As January is 0.
		let yyyy = today.getFullYear();
		let HH = today.getHours();
		let MM = today.getMinutes();
		let SS = today.getSeconds();
		let MS = today.getMilliseconds();
		let strDateTime = dd.toString() + mm.toString() + yyyy.toString() + HH.toString() + MM.toString() + SS.toString() + MS.toString();
		return strDateTime;
	}

	render() {

	    return (
	      <div className={this.state.disable ? 'disabled': ''} style={this.state.style}>
					<ReactQuill 
						ref={`${this.state.index ? this.state.id + '_' + this.state.index : this.state.id}`}
						key={`${this.state.index ? this.state.id + '_' + this.state.index : this.state.id}`}  
						// key={`${this.getDateTime()}`}
						// ref={React.createRef()}                 
						theme={`${this.state.theme}`}
						// theme="snow" 
						// theme="bubble" 
						onChange={this.rteChange}
						formats={this.formats} 
						modules={this.modules}
						placeholder={this.state.placeholder}
            value={this.state.editorHtml}
						// onBlur={this.props.onBlur}
						// onFocus={this.props.onFocus}
						/>
				</div>
				// <div className="text-editor">this.props.hideToolbar = {this.props.hideToolbar ? 'true' : 'false'}
				// 	<div style={{
				// 			display: this.props.hideToolbar ? 'none' : 'block'
				// 		}}>
				// 		<CustomToolbar />
				// 	</div>
				// 	<ReactQuill
				// 		onChange={this.rteChange}
				// 		onBlur={this.props.onBlur}
				// 		onFocus={this.props.onFocus}
				// 		formats={this.formats}
				// 		modules={this.modules}
				// 		placeholder={this.props.placeholder}
				// 		theme={"snow"} // pass false to use minimal theme
				// 		key="editor"                     
				// 		ref="editor"
				// 	/>
				// </div>
	    );
	}

}

/* 
 * CustomToolbar Component
 */
// const CustomToolbar = () => (
//   <div id="toolbar">
//     <select className="ql-header" defaultValue="">
//         <option value="1" />
//         <option value="2" />
//         <option value="3" />
//         <option value="" />
//       </select>
//       <span className="ql-formats">
//         <button className="ql-list" value="ordered" />
//         <button className="ql-list" value="bullet" />
//         <button className="ql-indent" value="-1" />
//         <button className="ql-indent" value="+1" />
//       </span>
//       <button className="ql-bold" />
//       <button className="ql-italic" />
//       <button className="ql-underline" />
//   </div>
// )

export default RichTextEditor;