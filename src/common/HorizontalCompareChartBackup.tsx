import React from 'react';

// import {
//   G2,
//   Chart,
//   Geom,
//   Axis,
//   Tooltip,
//   Coord,
//   Label,
//   Legend,
//   View,
//   Guide,
//   Shape,
//   Facet,
//   Util,
// } from "bizcharts";
// import DataSet from "@antv/data-set";
// // const { Region, Text } = Guide;

// interface IProps { 
//     height: number;
//     padding: any;
//     data : any;
//     disable: boolean;
// }

// const HorizontalCompareChart: React.StatelessComponent<IProps> = (props) => { 
    
//   const newdata = [
//     {
//       time: '2019-02',
//       level_s_projectA: 123,
//       level_a_projectA: 223,
//       level_b_projectA: 310,
//       level_c_projectA: 412,
//       level_other_projectA: 312,
//       level_s_projectB: 123,
//       level_a_projectB: 542,
//       level_b_projectB: 123,
//       level_c_projectB: 432,
//       level_other_projectB: 531,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//     {
//       time: '2019-03',
//       level_s_projectA: 993,
//       level_a_projectA: 133,
//       level_b_projectA: 343,
//       level_c_projectA: 123,
//       level_other_projectA: 632,
//       level_s_projectB: 342,
//       level_a_projectB: 322,
//       level_b_projectB: 564,
//       level_c_projectB: 422,
//       level_other_projectB: 965,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//     {
//       time: '2019-04',
//       level_s_projectA: 312,
//       level_a_projectA: 533,
//       level_b_projectA: 111,
//       level_c_projectA: 222,
//       level_other_projectA: 333,
//       level_s_projectB: 444,
//       level_a_projectB: 523,
//       level_b_projectB: 383,
//       level_c_projectB: 343,
//       level_other_projectB: 431,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//     {
//       time: '2019-05',
//       level_s_projectA: 300,
//       level_a_projectA: 300,
//       level_b_projectA: 300,
//       level_c_projectA: 300,
//       level_other_projectA: 300,
//       level_s_projectB: 300,
//       level_a_projectB: 300,
//       level_b_projectB: 300,
//       level_c_projectB: 300,
//       level_other_projectB: 300,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//     {
//       time: '2019-06',
//       level_s_projectA: 300,
//       level_a_projectA: 300,
//       level_b_projectA: 300,
//       level_c_projectA: 300,
//       level_other_projectA: 300,
//       level_s_projectB: 300,
//       level_a_projectB: 300,
//       level_b_projectB: 300,
//       level_c_projectB: 300,
//       level_other_projectB: 300,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//     {
//       time: '2019-07',
//       level_s_projectA: 300,
//       level_a_projectA: 300,
//       level_b_projectA: 300,
//       level_c_projectA: 300,
//       level_other_projectA: 300,
//       level_s_projectB: 300,
//       level_a_projectB: 300,
//       level_b_projectB: 300,
//       level_c_projectB: 300,
//       level_other_projectB: 300,
//       level_s_projectC: 100,
//       level_a_projectC: 200,
//       level_b_projectC: 300,
//       level_c_projectC: 400,
//       level_other_projectC: 500,
//       level_s_projectD: 342,
//       level_a_projectD: 322,
//       level_b_projectD: 564,
//       level_c_projectD: 422,
//       level_other_projectD: 965,
//       level_s_projectE: 312,
//       level_a_projectE: 533,
//       level_b_projectE: 111,
//       level_c_projectE: 222,
//       level_other_projectE: 333,
//     },
//   ];

//   const ds = new DataSet();
//   const dv = ds.createView().source(newdata);
//   dv.transform({
//         type: 'fold',
//         fields: [
//             'level_s_projectA', 'level_a_projectA', 'level_b_projectA', 'level_c_projectA',
//             'level_s_projectB', 'level_a_projectB', 'level_b_projectB', 'level_c_projectB',
//             'level_s_projectC', 'level_a_projectC', 'level_b_projectC', 'level_c_projectC',
//             'level_s_projectD', 'level_a_projectD', 'level_b_projectD', 'level_c_projectD',
//             'level_s_projectE', 'level_a_projectE', 'level_b_projectE', 'level_c_projectE'
//         ],
//         //   fields: ['time'],
//         // 展开字段集
//         key: 'key',
//         // key字段
//         value: 'value', // value字段
//     })
//     .transform({
//         type: 'map',
//         callback: (obj) => {
//             if(obj.key.indexOf('projectA') !== -1) {
//                 obj.type = 'Project A'
//             } else if(obj.key.indexOf('projectB') !== -1) {
//                 obj.type = 'project B'
//             } else if(obj.key.indexOf('projectC') !== -1) {
//                 obj.type = 'project C'
//             } else if(obj.key.indexOf('projectD') !== -1) {
//                 obj.type = 'project D'
//             } else if(obj.key.indexOf('projectE') !== -1) {
//                 obj.type = 'project E'
//             }
//             obj.level = obj.key.split('_')[1].toUpperCase();// + '级'
//             // console.log(obj)
//             return obj;
//         },
//     });

//     if (props.disable) {
//       return <div></div>
//     }
//     return (
//       <div>
//         <Chart height={400} data={dv} forceFit>
//             <Legend />
//             <Axis name="key" />
//             <Axis name="type" />
//             <Tooltip />
//             <Geom
//                 type="interval"
//                 position="time*value*type"
//                 color={'level*type'}
//                 tooltip={['time*value*level*type', (time, value, level, type)=>{ // array
//                   console.log(time, value, level, type)
//                   return {
//                     name: level,
//                     value: type + ':' + value
//                   }
//                 }]}
//                 style={{
//                   stroke: '#fff',
//                   lineWidth: 1,
//                 }}
//                 adjust={[
//                   {
//                     type: "dodge",
//                     dodgeBy: "type",
//                     // 按照 type 字段进行分组
//                     marginRatio: 0 // 分组中各个柱子之间不留空隙
//                   },
//                   {
//                     type: "stack"
//                   }
//                 ]}
//                 >       
//             </Geom>
//           </Chart>
//       </div>
//     );
// }
// export default HorizontalCompareChart;