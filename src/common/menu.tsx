import * as React from 'react'; 
import { Link } from "react-router-dom";
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import { History } from 'history';

interface Props {
    surveyId: string;
    menuKey: string;
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

class MenuSurvey extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    state = {
      current: this.props.menuKey,
    };
  
    handleClick = (e: { key: any; }) => {
    // // console.log('click ', e);
      this.setState({
        current: e.key,
      });
    };
  
    render() {
        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" style={{ borderTop: '1px solid #e8e8e8'}}>
                <Menu.Item key="summary">
                    <Link to={`/${this.props.match.params.xSite}/summary/${this.props.surveyId}`} className="nav-link" style={{ fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>SUMMARY</Link>
                </Menu.Item>

                <Menu.Item key="design" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/design/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>DESIGN SURVEY</Link>
                </Menu.Item>

                <Menu.Item key="preview" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/preview/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>PREVIEW & SCORE</Link>
                </Menu.Item>

                <Menu.Item key="collect" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/collect/list/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>COLLECT RESPONSES</Link>
                </Menu.Item>

                <Menu.Item key="analyze" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/analyze/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>ANALYZE RESULTS</Link>
                </Menu.Item>

                <Menu.Item key="cumulative" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/cumulative/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>CUMULATIVE REPORT</Link>
                </Menu.Item>
                
                <Menu.Item key="comparison" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={`/${this.props.match.params.xSite}/comparison/${this.props.surveyId}`} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>COMPARISON REPORT</Link>
                </Menu.Item>

                {/* <Menu.Item key="report" style={{ paddingLeft: '0' }}>
                    <Icon type="arrow-right" style={{ marginRight: '20px' }}/>
                    <Link to={'/report/'+this.props.surveyId} className="nav-link" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none' }}>PRESENT RESULTS</Link>
                </Menu.Item> */}

            </Menu>
        );
    }
}

export default MenuSurvey;
