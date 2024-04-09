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
} from "bizcharts";

// const { Region, Text } = Guide;

interface IProps { 
    height: number;
    padding: any;
    data : any;
    disable: boolean;
}

const HorizontalChart: React.StatelessComponent<IProps> = (props) => { 
    try{
      // const data = [
      //     {
      //       answer: "ไม่พึงพอใจเลย",
      //       percent: 20
      //     },
      //     {
      //       answer: "ไม่ค่อยพึงพอใจ",
      //       percent: 10
      //     },
      //     {
      //       answer: "ปานกลาง",
      //       percent: 10
      //     },
      //     {
      //       answer: "ค่อนข้างพึงพอใจ",
      //       percent: 60
      //     },
      //     {
      //       answer: "พึงพอใจมาก",
      //       percent: 10
      //     }
      // ];
      
      const color = [] as any;

      for(let i = 0 ; i < props.data.length ; i++){
        const mathRandom = (Math.random() * 0xffffff).toString();
        const colorCode = '#' + parseInt(mathRandom).toString(16);
        color.push(colorCode);
      }

      const scale = {
          percent: {
            min: 0,
            max: 100,
            // ticks:[100, 1000, 2000, 3000],
            tickInterval:10,
            // tickCount:10,
          }
      };
      if (props.disable) {
        return <div></div>
      }
      return (
          <div>
            <Chart
              height={props.height}
              // height={400}
              data={props.data}
              // data={data}
              padding={props.padding}
              // padding={[0, 50, 50, 100]}
              scale={scale}
              forceFit
            >
            <Coord transpose />
            <Axis
              name="answer"
              label={{
                offset: 12,
                formatter: (val: string) => {
                  //add a middle new line when the choice charater more then 30
                  // console.log('choices', val);
                  // console.log('choices.length', val.length);
                  if(val.length > 70){
                      val = val.substring(0, 35) + '...';
                  }
                  else if(val.length > 35){
                      const choicesSplit = val.split(' ');
                      // console.log('choicesSplit', choicesSplit);
                      // console.log('choicesSplit.length', choicesSplit.length);
                      if(choicesSplit.length >= 2){
                        const middle = Math.round( choicesSplit.length / 2 );
                        choicesSplit.splice(middle, 0, "\n");
                        val = choicesSplit.join(' ');
                        // console.log('val', val);
                      }
                      else{
                        val = val.substring(0, 35) + '...';
                      }
                  }
                  return val;
                },
              }}
            />
            <Axis name="percent" label={{formatter: val => `${val}%`}}/>
            <Tooltip />
            <Geom type="interval" position="answer*percent" color={["answer", color]}
                  tooltip={['answer*percent*totalN*N', (answer, percent, totalN, N) => {
                              return {
                                // title: "Responses",
                                title: `Responses (N = ${totalN})`,
                                name: answer,
                                value: `${percent + '%'} (${N})`
                                // value: percent + '%'
                              };
                            }]}
            />
            </Chart>
          </div>
      );
    }catch(error){ 
        // BaseService.post("/frontendlog/", { method: 'HorizontalChart catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        return (<div></div>); 
    }
}
export default HorizontalChart;