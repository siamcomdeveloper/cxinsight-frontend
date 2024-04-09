import React from 'react';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
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

const HorizontalCompareChart: React.StatelessComponent<IProps> = (props) => { 
  try{
    // console.log('props', props);

    if (props.disable || props.data === '') {
      return <div></div>
    }
    else{

      let projectsVariableName = new Array(props.data.projects.length);
      let choicesVariableName = new Array(props.data.choices.length);

      const newData = [] as any;
      let countData = 0;
      for(let i = 0; i < props.data.time.length; i++) { 
        newData.push({ time: props.data.time[i] });

        for(let j = 0; j < props.data.projects.length; j++) { 
          projectsVariableName[j] = props.data.projects[j].split(' ').join('_');

          for(let k = 0; k < props.data.choices.length; k++) { 
            choicesVariableName[k] = props.data.choices[k].split(' ').join('_');

            newData[newData.length-1][`${choicesVariableName[k]+'_cName_'+projectsVariableName[j]}`] = props.data.N[countData];
            countData++;
          }
        }
        
      }
      // console.log(`after projectsVariableName`, projectsVariableName);
      // console.log(`after choicesVariableName`, choicesVariableName);
      // console.log(`after newData`, newData);
      
      let projectsChoicesVariableName = [];
      for(let j = 0; j < props.data.projects.length; j++) { 
        projectsVariableName[j] = props.data.projects[j].split(' ').join('_');

        for(let k = 0; k < props.data.choices.length; k++) { 
          choicesVariableName[k] = props.data.choices[k].split(' ').join('_');

          projectsChoicesVariableName.push(`${choicesVariableName[k]}_cName_${projectsVariableName[j]}`);
        }
      }
      // console.log(`after projectsChoicesVariableName`, projectsChoicesVariableName);

      // for(let i = 0; i < projects.length; i++) { 
      //   console.log(`projects[${i}]`, projects[i]);
      //   console.log(`projects[${i}].split`, projects[i].split);

      //   // projects[i].split.map((surveyId: any) => { return surveyId; }).join('/')
      //   console.log(`projects[${i}].split(' ').join('_')`, projects[i].split(' ').join('_'));
      //   projectsVariableName[i] = projects[i].split(' ').join('_');
      //   console.log(`projectsVariableName[${i}]`, projectsVariableName[i]);
      // }
      // console.log(`after projectsVariableName`, projectsVariableName);

      // for(let i = 0; i < choices.length; i++) { 
      //   console.log(`choices[${i}]`, choices[i]);
      //   console.log(`choices[${i}].split`, choices[i].split);

      //   // choices[i].split.map((surveyId: any) => { return surveyId; }).join('/')
      //   console.log(`choices[${i}].split(' ').join('_')`, choices[i].split(' ').join('_'));
      //   choicesVariableName[i] = choices[i].split(' ').join('_');
      //   console.log(`choicesVariableName[${i}]`, choicesVariableName[i]);
      // }
      // console.log(`after choicesVariableName`, choicesVariableName);

      // const newData = [
      //   {
      //     time: '2016',
      //     choice_s_Cname_Project_A: 123,
      //     choice_a_Cname_Project_A: 223,
      //     choice_b_Cname_Project_A: 310,
      //     choice_c_Cname_Project_A: 412,
      //     choice_other_Cname_Project_A: 312,
      //     choice_s_Cname_Project_B: 123,
      //     choice_a_Cname_Project_B: 542,
      //     choice_b_Cname_Project_B: 123,
      //     choice_c_Cname_Project_B: 432,
      //     choice_other_Cname_Project_B: 531,
      //     choice_s_Cname_Project_C: 100,
      //     choice_a_Cname_Project_C: 200,
      //     choice_b_Cname_Project_C: 300,
      //     choice_c_Cname_Project_C: 400,
      //     choice_other_Cname_Project_C: 500,
      //     choice_s_Cname_Project_D: 342,
      //     choice_a_Cname_Project_D: 322,
      //     choice_b_Cname_Project_D: 564,
      //     choice_c_Cname_Project_D: 422,
      //     choice_other_Cname_Project_D: 965,
      //     choice_s_Cname_Project_E: 312,
      //     choice_a_Cname_Project_E: 533,
      //     choice_b_Cname_Project_E: 111,
      //     choice_c_Cname_Project_E: 222,
      //     choice_other_Cname_Project_E: 333,
      //   },
      //   {
      //     time: '2017',
      //     choice_s_Cname_Project_A: 300,
      //     choice_a_Cname_Project_A: 300,
      //     choice_b_Cname_Project_A: 300,
      //     choice_c_Cname_Project_A: 300,
      //     choice_other_Cname_Project_A: 300,
      //     choice_s_Cname_Project_B: 300,
      //     choice_a_Cname_Project_B: 300,
      //     choice_b_Cname_Project_B: 300,
      //     choice_c_Cname_Project_B: 300,
      //     choice_other_Cname_Project_B: 300,
      //     choice_s_Cname_Project_C: 100,
      //     choice_a_Cname_Project_C: 200,
      //     choice_b_Cname_Project_C: 300,
      //     choice_c_Cname_Project_C: 400,
      //     choice_other_Cname_Project_C: 500,
      //     choice_s_Cname_Project_D: 342,
      //     choice_a_Cname_Project_D: 322,
      //     choice_b_Cname_Project_D: 564,
      //     choice_c_Cname_Project_D: 422,
      //     choice_other_Cname_Project_D: 965,
      //     choice_s_Cname_Project_E: 312,
      //     choice_a_Cname_Project_E: 533,
      //     choice_b_Cname_Project_E: 111,
      //     choice_c_Cname_Project_E: 222,
      //     choice_other_Cname_Project_E: 333,
      //   },
      //   {
      //     time: '2018',
      //     choice_s_Cname_Project_A: 993,
      //     choice_a_Cname_Project_A: 133,
      //     choice_b_Cname_Project_A: 343,
      //     choice_c_Cname_Project_A: 123,
      //     choice_other_Cname_Project_A: 632,
      //     choice_s_Cname_Project_B: 342,
      //     choice_a_Cname_Project_B: 322,
      //     choice_b_Cname_Project_B: 564,
      //     choice_c_Cname_Project_B: 422,
      //     choice_other_Cname_Project_B: 965,
      //     choice_s_Cname_Project_C: 100,
      //     choice_a_Cname_Project_C: 200,
      //     choice_b_Cname_Project_C: 300,
      //     choice_c_Cname_Project_C: 400,
      //     choice_other_Cname_Project_C: 500,
      //     choice_s_Cname_Project_D: 342,
      //     choice_a_Cname_Project_D: 322,
      //     choice_b_Cname_Project_D: 564,
      //     choice_c_Cname_Project_D: 422,
      //     choice_other_Cname_Project_D: 965,
      //     choice_s_Cname_Project_E: 312,
      //     choice_a_Cname_Project_E: 533,
      //     choice_b_Cname_Project_E: 111,
      //     choice_c_Cname_Project_E: 222,
      //     choice_other_Cname_Project_E: 333,
      //   },
      //   {
      //     time: '2019',
      //     choice_s_Cname_Project_A: 312,
      //     choice_a_Cname_Project_A: 533,
      //     choice_b_Cname_Project_A: 111,
      //     choice_c_Cname_Project_A: 222,
      //     choice_other_Cname_Project_A: 333,
      //     choice_s_Cname_Project_B: 444,
      //     choice_a_Cname_Project_B: 523,
      //     choice_b_Cname_Project_B: 383,
      //     choice_c_Cname_Project_B: 343,
      //     choice_other_Cname_Project_B: 431,
      //     choice_s_Cname_Project_C: 100,
      //     choice_a_Cname_Project_C: 200,
      //     choice_b_Cname_Project_C: 300,
      //     choice_c_Cname_Project_C: 400,
      //     choice_other_Cname_Project_C: 500,
      //     choice_s_Cname_Project_D: 342,
      //     choice_a_Cname_Project_D: 322,
      //     choice_b_Cname_Project_D: 564,
      //     choice_c_Cname_Project_D: 422,
      //     choice_other_Cname_Project_D: 965,
      //     choice_s_Cname_Project_E: 312,
      //     choice_a_Cname_Project_E: 533,
      //     choice_b_Cname_Project_E: 111,
      //     choice_c_Cname_Project_E: 222,
      //     choice_other_Cname_Project_E: 333,
      //   },
      //   {
      //     time: '2020',
      //     choice_s_Cname_Project_A: 300,
      //     choice_a_Cname_Project_A: 300,
      //     choice_b_Cname_Project_A: 300,
      //     choice_c_Cname_Project_A: 300,
      //     choice_other_Cname_Project_A: 300,
      //     choice_s_Cname_Project_B: 300,
      //     choice_a_Cname_Project_B: 300,
      //     choice_b_Cname_Project_B: 300,
      //     choice_c_Cname_Project_B: 300,
      //     choice_other_Cname_Project_B: 300,
      //     choice_s_Cname_Project_C: 100,
      //     choice_a_Cname_Project_C: 200,
      //     choice_b_Cname_Project_C: 300,
      //     choice_c_Cname_Project_C: 400,
      //     choice_other_Cname_Project_C: 500,
      //     choice_s_Cname_Project_D: 342,
      //     choice_a_Cname_Project_D: 322,
      //     choice_b_Cname_Project_D: 564,
      //     choice_c_Cname_Project_D: 422,
      //     choice_other_Cname_Project_D: 965,
      //     choice_s_Cname_Project_E: 312,
      //     choice_a_Cname_Project_E: 533,
      //     choice_b_Cname_Project_E: 111,
      //     choice_c_Cname_Project_E: 222,
      //     choice_other_Cname_Project_E: 333,
      //   },
      // ];

      const ds = new DataSet();
      const dv = ds.createView().source(newData);
      dv.transform({
            type: 'fold',
            // fields: [
            //     'choice_s_Cname_Project_A', 'choice_a_Cname_Project_A', 'choice_b_Cname_Project_A', 'choice_c_Cname_Project_A', 'choice_other_Cname_Project_A', 
            //     'choice_s_Cname_Project_B', 'choice_a_Cname_Project_B', 'choice_b_Cname_Project_B', 'choice_c_Cname_Project_B', 'choice_other_Cname_Project_B',
            //     'choice_s_Cname_Project_C', 'choice_a_Cname_Project_C', 'choice_b_Cname_Project_C', 'choice_c_Cname_Project_C', 'choice_other_Cname_Project_C',
            //     'choice_s_Cname_Project_D', 'choice_a_Cname_Project_D', 'choice_b_Cname_Project_D', 'choice_c_Cname_Project_D', 'choice_other_Cname_Project_D',
            //     'choice_s_Cname_Project_E', 'choice_a_Cname_Project_E', 'choice_b_Cname_Project_E', 'choice_c_Cname_Project_E', 'choice_other_Cname_Project_E'
            // ],
            fields: projectsChoicesVariableName,
            //   fields: ['time'],
            // 展开字段集
            key: 'key',
            // key字段
            value: 'value', // value字段
        })
        .transform({
            type: 'map',
            callback: (obj) => {
                
                // if(obj.key.indexOf('Project_A') !== -1) {
                //     obj.cName = 'Project A'
                // } else if(obj.key.indexOf('Project_B') !== -1) {
                //     obj.cName = 'Project B'
                // } else if(obj.key.indexOf('Project_C') !== -1) {
                //     obj.cName = 'Project C'
                // } else if(obj.key.indexOf('Project_D') !== -1) {
                //     obj.cName = 'Project D'
                // } else if(obj.key.indexOf('Project_E') !== -1) {
                //     obj.cName = 'Project E'
                // }
                // obj.choice = obj.key.split('_')[1].toUpperCase();// + '级'
                for(let j = 0; j < props.data.projects.length; j++) { 
                  if(obj.key.indexOf(projectsVariableName[j]) !== -1) {
                    obj.cName = projectsVariableName[j].split('_').join(' ').trim();
                    // break;
                  }
                }
                obj.choice = obj.key.split('cName')[0].split('_').join(' ').trim().toUpperCase();// + '级'
                // console.log(obj)
                return obj;
            },
        });
        
        return (
          <div>
            <Chart height={props.height} data={dv} padding={ props.padding } forceFit>
                <Legend />
                {/* <Axis name="key" /> */}
                <Axis 
                    name="time"
                    label={{
                        // offset: 10,
                        textStyle: {
                            rotate: props.rotate,
                            fontWeight: 'bold',
                            fontSize: '12',
                        },
                        formatter: val => `${val}`,
                    }}
                />
                  
                {/* <Axis name="cName" /> */}
                <Axis
                    name="value"
                    label={{
                        formatter: val => `${val}`,
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: '12',
                        },
                    }}
                    // title={{
                    //     // autoRotate: true,
                    //     offset: 60,
                    //     textStyle: {  
                    //         rotate: -30,
                    //         fontSize: '12',
                    //         textAlign: 'center',
                    //         fill: 'black',
                    //         fontWeight: 'bold',
                    //     },
                    //     position: 'end',
                    // }} 
                  />
                <Tooltip />
                <Geom
                    type="interval"
                    position="time*value*cName"
                    color={'choice*cName'}
                    tooltip={['time*value*choice*cName', (time, value, choice, cName)=>{ // array
                      // console.log(time, value, choice, cName)
                      return {
                        name: `${choice} : ${value}`,
                        value: `${cName}`
                      }
                    }]}
                    style={{
                      stroke: '#fff',
                      lineWidth: 1,
                    }}
                    adjust={[
                      {
                        type: "dodge",
                        dodgeBy: "cName",
                        // 按照 type 字段进行分组
                        marginRatio: 0 // 分组中各个柱子之间不留空隙
                      },
                      {
                        type: "stack"
                      }
                    ]}
                    >       
                </Geom>
              </Chart>
          </div>
        );
      }
    }catch(error){ 
      // BaseService.post("/frontendlog/", { method: 'HorizontalCompareChart catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
      return (<div></div>); 
    }
}
export default HorizontalCompareChart;