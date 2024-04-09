import React from 'react';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
//   Coord,
//   View,
  Guide,
  Coord,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
// const { Region, Text } = Guide;

interface IProps { 
    height: number;
    padding: any;
    data : any;
    rotate: any;
    disable: boolean;
}

const HorizontalPercent: React.StatelessComponent<IProps> = (props) => { 
  try{
    // const data = [
    //   {
    //     answer: props.data[1].answer,
    //     name: props.data[1].name,
    //     percent: props.data[1].percent,
    //   },
    //   {
    //     answer: props.data[0].answer,
    //     name: props.data[0].name,
    //     percent: props.data[0].percent,
    //   },
    // ];
    const data = props.data;
    const color = [] as any;

    for(let i = 0 ; i < data.length ; i++){
      const mathRandom = (Math.random() * 0xffffff).toString();
      const colorCode = '#' + parseInt(mathRandom).toString(16);
      color.push(colorCode);
    }

    // const data = [
    //   {
    //     answer: "พอใจ",
    //     name: "ความพึงพอใจ",
    //     percent: 20,
    //     totalN: 100,
    //     N: 30 
    //   },
    //   {
    //     answer: "ไม่พอใจ",
    //     name: "ความพึงพอใจ",
    //     percent: 80,
    //     totalN: 100,
    //     N: 70 
    //   },
    // ];
    const ds = new DataSet();
    const dv = ds
      .createView()
      // .source(props.data)
      .source(data)
      .transform({
        type: "percent",
        field: "percent",
        dimension: "answer",
        groupBy: ["name"],
        as: "percent"
      });
    const cols = {
      percent: {
        min: 0,
        tickInterval:0.1,
        formatter(val: number) {
          return (val * 100).toFixed(2) + "%";
          // return (val * 100).toFixed(2) + "%";
        }
      }
    };

    if (props.disable) {
      return <div></div>
    }
      return (
        <div>
          <Chart height={props.height}
                data={dv} 
                padding={props.padding}
                scale={cols} 
                forceFit
          >
          <Coord transpose />
            <Legend />
            <Axis name="percent" label={{
                // offset: {Number},
                textStyle: {
                // textAlign: 'center',
                // fill: '#404040',
                // fontSize: '12',
                // fontWeight: 'bold',
                rotate: props.rotate,
                // rotate: 30,
                // textBaseline: 'top'
                },
                // autoRotate: {Boolean},
                // formatter: {Function},
                // htmlTemplate: {Function},

                formatter: val => `${parseFloat(val).toFixed(0)}%`,
                // autoRotate: true, // 是否需要自动旋转，默认为 true
                // offset: 40, // 设置标题 title 距离坐标轴线的距离
                // textStyle: {
                //     fontSize: '12',
                //     textAlign: 'center',
                //     fill: '#999',
                //     fontWeight: 'bold',
                // },
              }}
            />
            <Axis name="name" />
            <Tooltip />
            <Geom
              type="intervalStack"
              position="name*percent"
              // color={"name"}
              color={["answer", color]}//["#24c782", "red"]]}
              tooltip={['name*answer*percent*totalN*N*totalRespondent', (name, answer, percent, totalN, N, totalRespondent)=>{ // array
                      // console.log(name, answer, percent, totalN, N)
                      return {
                        title: `${name} (N = ${totalRespondent})`,
                        name: answer,
                        value: `${(percent * 100).toFixed(2) + "%"} (${N})`
                      }
                    }]}
            />
          </Chart>
        </div>
      );
    }catch(error){ 
      // BaseService.post("/frontendlog/", { method: 'HorizontalPercent catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
      return (<div></div>); 
    }
}
export default HorizontalPercent;