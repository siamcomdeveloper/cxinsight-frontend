import React from 'react';

// import {
//   Chart,
//   Geom,
//   Axis,
//   Tooltip,
//   Coord,
//   Legend,
// } from "bizcharts";
// import DataSet from "@antv/data-set";
// // const { Region, Text } = Guide;

// interface IProps { 
//     height: number;
//     padding: any;
//     data : any;
//     rotate: any;
//     disable: boolean;
// }

// const HorizontalPercentFold: React.StatelessComponent<IProps> = (props) => { 
    
//   const data = [
//     {
//       Label: "Percent",
//       A: 33.34,
//       B: 33.33,
//       C: 33.33
//     }
//   ];
//   const ds = new DataSet();
//   const dv = ds.createView().source(data);
//   dv.transform({
//     type: "fold",
//     fields: ["A", "B", "C"],
//     key: "keyColor",
//     value: "V",
//     retains: ["Label"]
//   });
//   const cols = {
//     percent: {
//       min: 0,
//       tickInterval:0.1,
//       formatter(val: number) {
//         return (val * 100).toFixed(2) + "%";
//         // return (val * 100).toFixed(2) + "%";
//       }
//     }
//   };

//   if (props.disable) {
//     return <div></div>
//   }
//     return (
//       <div>
//         <Chart height={props.height}
//                data={dv} 
//                padding={props.padding}
//                scale={cols} 
//                forceFit
//         >
//           <Legend />
//           <Coord transpose />
//           <Axis
//             name="Label"
//             label={{
//               offset: 12
//             }}
//           />
//           <Axis name="V" label={{
//               // offset: {Number},
//               textStyle: {
//               // textAlign: 'center',
//               // fill: '#404040',
//               // fontSize: '12',
//               // fontWeight: 'bold',
//               rotate: props.rotate,
//               // rotate: 30,
//               // textBaseline: 'top'
//               },
//               // autoRotate: {Boolean},
//               // formatter: {Function},
//               // htmlTemplate: {Function},

//               formatter: val => `${parseFloat(val).toFixed(0)}%`,
//               // autoRotate: true, // 是否需要自动旋转，默认为 true
//               // offset: 40, // 设置标题 title 距离坐标轴线的距离
//               // textStyle: {
//               //     fontSize: '12',
//               //     textAlign: 'center',
//               //     fill: '#999',
//               //     fontWeight: 'bold',
//               // },
//             }}/>
//           <Tooltip 
//             // showTitle={false}
//             itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}%</li>'
//           />
//           <Geom
//             type="intervalStack"
//             position="Label*V"
//             color={"keyColor"}
//           />
//         </Chart>
//       </div>
//     );
// }
// export default HorizontalPercentFold;