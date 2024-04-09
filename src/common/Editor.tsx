import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

interface IProps {
  //code related to your props goes here
	// id: any;
	placeholder: any;
	hideToolbar: any;
	onBlur: (e: any) => any;
	onFocus: (e: any) => any;
	onChange: (e: any) => any;
	value: any;
	// id: any;
  // onChange: (content: string, delta: any, source: any, editor: { getHTML: () => any; getText: () => any; getLength: () => any) => void;
}

class Editor extends React.Component<IProps> {
	static formats: string[]
	static modules: { toolbar: { container: string } }
  render() {
    return (
      <div className="text-editor">
        <div style={{
            display: this.props.hideToolbar ? 'none' : 'block'
          }}>
          <CustomToolbar />
        </div>
        <ReactQuill
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          formats={Editor.formats}
          modules={Editor.modules}
          placeholder={this.props.placeholder}
          theme={"snow"} // pass false to use minimal theme
          value={this.props.value}
        />
      </div>
    )
  }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: {
    container: "#toolbar"
  }
}

/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'indent'
]

/* 
 * CustomToolbar Component
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue="">
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="" />
      </select>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
  </div>
)

export default Editor;