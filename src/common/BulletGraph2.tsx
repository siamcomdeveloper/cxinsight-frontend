import React from 'react';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  View,
  Guide,
} from "bizcharts";

const { Region, Text } = Guide;

interface IProps { 
    unique: any;
    height: number;
    data : any;
    padding : any;
    nlocation : any;
    yGap: any;
}

const BulletGraph2: React.StatelessComponent<IProps> = (props) => { 
    
    let y = 0;
    try{
        return (
        //   <div style={{ borderBottom: '1px solid #eee' }}>
        //   <div>
            <Chart
            key={`Chart-${props.unique}`}
            height={props.height}
            //   data={[1]}
            data={props.data[0]}
            // padding={['100', '100']}
            padding={ props.padding }
            forceFit
            >
            {/* <Legend
                custom
                clickable={false}
                items={[
                {
                    value: "Bad",
                    fill: "#FFA39E",
                    marker: "square"
                },
                {
                    value: "Normal",
                    fill: "#FFD591",
                    marker: "square"
                },
                {
                    value: "Good",
                    fill: "#A7E8B4",
                    marker: "square"
                },
                {
                    value: "Score",
                    fill: "#223273",
                    marker: "square"
                },
                {
                    value: "Current",
                    fill: "#262626",
                    marker: {
                    symbol: "line",
                    stroke: "#262626",
                    radius: 5
                    }
                }
                ]}
            /> */}
            {props.data.map((data: any) => {
                const ranges = data.ranges;
                const cols = {
                actual: {
                    min: 0,
                    max: ranges[2],
                    nice: false
                },
                target: {
                    min: 0,
                    max: ranges[2],
                    nice: false
                }
                };
                return (
                <View
                    key={`View-${props.unique}`}
                    start={{
                    x: 0,
                    y: y
                    }}
                    end={{
                    x: 1,
                    y: y + props.yGap
                    }}
                    data={[data]}
                    scale={cols}
                >
                    <Coord transpose />
                    <Axis name="title" position="left" zIndex={0} label={{ /*offset: 1,*/offset: 30, textStyle: { fontSize: '14', fontWeight: 'normal' } }}/>
                    <Axis name="actual" position="left" label={{ offset: 20, textStyle: { fill: "black", fontSize: '12' } }}/>
                    <Axis name="target" visible={false} />
                    {/* <Axis name="subtitle" label={{formatter: val => `${val}°C`}}
                        title={{
                            autoRotate: true, // 是否需要自动旋转，默认为 true
                            offset: 40, // 设置标题 title 距离坐标轴线的距离
                            textStyle: {
                                fontSize: '12',
                                textAlign: 'center',
                                fill: '#999',
                                fontWeight: 'bold',
                            },
                            position: 'center', // 标题的位置，**新增**
                        }} 
                    /> */}
                    {/* <Geom
                    type="interval"
                    position="title*target"
                    color="#EEE"
                    //   shape="line"
                    size={20}
                    //   style={{
                    //       lineWidth: 2
                    //   }}
                    /> */}
                    {/* <Geom
                    type="interval"
                    position="title*target"
                    color="orange"
                    size={20}
                    /> */}
                    <Geom
                    type="interval"
                    position="title*actual"
                    //   color={ data.actual <= 2 ? "#d04f67" : data.actual >= 4 ? "#00BF6F" : "#fec459" }
                    color={ data.actual <= 2 ? "red" : data.actual >= 4 ? "#00BF6F" : "orange" }
                    size={20}
                    >
                    {/* <Label
                        content='title'
                        textStyle={{
                            textAlign: 'center', // alignment of label text: 'start'|'middle'|'end'
                            fill: '#404040', // color of label text
                            fontSize: '12', // font size of label text
                            fontWeight: 'bold', // weight of label text
                            rotate: 30,
                            textBaseline: 'top' // baseline of label test: top middle bottom，默认为middle
                        }}
                    /> */}
                    </Geom>

                    <Guide>
                        {/* <Region
                            start={[-1, 0]}
                            end={[1, ranges[0]]}
                            style={{
                            fill: "#FFA39E",
                            fillOpacity: 0.85
                            }}
                        />
                        <Region
                            start={[-1, ranges[0]]}
                            end={[1, ranges[1]]}
                            style={{
                            fill: "#FFD591",
                            fillOpacity: 0.85
                            }}
                        />
                        <Region
                            start={[-1, ranges[1]]}
                            end={[1, ranges[2]]}
                            style={{
                            fill: "#A7E8B4",
                            fillOpacity: 0.85
                            }}
                        /> 
                        */}
                        <Region
                            start={[0, 0]}
                            end={[0, ranges[2]]}
                            style={{
                            lineWidth: 20, // The border width of auxiliary region
                            //   fill: "red",
                            fillOpacity: 0.1,
                            stroke: '#eee'
                            }}
                        />
                        <Text
                            content={data.subtitle}
                            //   position={[0,5.3]}
                            //   position={[0,5.8]}
                            position={[0,props.nlocation]}
                            style={{
                                textAlign: 'center', // alignment of label text: 'start'|'middle'|'end'
                                fill: '#404040', // color of label text
                                fontSize: '12', // font size of label text
                                //   fontWeight: 'bold', // weight of label text
                                // fontFamily: 'National2,"Helvetica Neue",Helvetica,Arial,sans-serif !important';
                                // rotate: 30,
                                // textBaseline: 'top' // baseline of label test: top middle bottom，默认为middle
                            }}
                        />
                        <Text
                            content={data.eachN}
                            //   position={[0,5.3]}
                            //   position={[0,5.8]}
                            position={[-16,2.5]}
                            style={{
                                textAlign: 'center', // alignment of label text: 'start'|'middle'|'end'
                                fill: '#404040', // color of label text
                                fontSize: '12', // font size of label text
                                //   fontWeight: 'bold', // weight of label text
                                // fontFamily: 'National2,"Helvetica Neue",Helvetica,Arial,sans-serif !important';
                                // rotate: 30,
                                // textBaseline: 'top' // baseline of label test: top middle bottom，默认为middle
                            }}
                        />
                    </Guide>
                    <Tooltip />
                    <div style={{ display: 'none' }}>{(y += props.yGap + 0.205)}</div>
                </View>
                );
            })}
            </Chart>
        //   </div>
        );
    }catch(error){ 
        // BaseService.post("/frontendlog/", { method: 'BulletGraph2 catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        return (<div></div>); 
    }
}
export default BulletGraph2;