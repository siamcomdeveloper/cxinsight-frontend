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
} from "bizcharts";

// const { Region, Text } = Guide;

interface IProps { 
    height: number;
    padding: any;
    data : any;
    max: any;
    color: any;
}

const VerticalChart: React.StatelessComponent<IProps> = (props) => { 
    
    // let data = [
    //     {
    //       name: "A",
    //       score: 4
    //     },
    //     {
    //       name: "B",
    //       score: 2
    //     },
    //     {
    //       name: "C",
    //       score: 5
    //     },
    //     {
    //       name: "D",
    //       score: 3
    //     },
    //     {
    //       name: "E",
    //       score: 2
    //     },
    //     {
    //       name: "F",
    //       score: 1
    //     },
    //     {
    //       name: "G",
    //       score: 2
    //     },
    //     {
    //       name: "H",
    //       score: 4
    //     },
    //     {
    //       name: "I",
    //       score: 4
    //     }
    //   ];
    //   let imageMap = {
    //     A: "https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png",
    //     B: "https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png",
    //     C: "https://zos.alipayobjects.com/rmsportal/zlkGnEMgOawcyeX.png",
    //     D: "https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png",
    //     E: "https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png",
    //     F: "https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png",
    //     G: "https://zos.alipayobjects.com/rmsportal/zlkGnEMgOawcyeX.png",
    //     H: "https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png",
    //     I: "https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png"
    //   };
    const scale = {
      score: {
        min: 0,
        max: props.max
      },
      average: {
        min: 0,
        max: props.max
      } 
    };
      
    try{
      return (
          <div>
            <Chart
              height={props.height}
              data={props.data}
              padding={props.padding}
              scale={scale}
              forceFit
            >

              <Axis name="average" visible={false}/>
              <Axis
                name="score"
              //   labels={null}
                title={null}
                line={null}
                tickLine={null}
              />
              

              {/* <Geom type="line" position="target" size={2} /> */}
              {/* <Geom
                    type="point"
                    position="score*target"
                    color="#square"
                    shape="line"
                    size={15}
                    style={{
                        lineWidth: 2
                    }}
              /> */}

            {/* <Geom
              type="point"
              position="name*average"
              color="#fdae6b"
              size={3}
              shape="circle"
            /> */}

              <Geom
                type="interval" 
                position="name*score"
                // color={"#58afff"}
                // color={["name", ["green", "#fec514", "#db4c3c", "#cec38d", "#6a90c1", "#7f8da9", "brown", "pink", "blueviolet"]]}
                color={["name", props.color]}
                tooltip={['name*score', (name, score) => {
                  return {
                    title: "Score",
                    name: name,
                    value: score 
                  };
                }]}
              />
              <Geom
                type="line"
                position="name*average"
                color="black"
                size={2}
                shape="smooth"
                tooltip={['name*average', (name, average) => {
                  return {
                    title: "Score",
                    name: "Average",
                    value: average 
                  };
                }]}
              />
              <Tooltip />
              {/* <Tooltip
                    crosshairs={{
                    type: "y"
                    }}
                /> */}

              {/* <Tooltip 
                  containerTpl='<div class="g2-tooltip"><p class="g2-tooltip-title"></p><table class="g2-tooltip-list"></table></div>'
                  // itemTpl='<tr class="g2-tooltip-list-item"><td style="color:{color}">{name}</td><td>{value}</td></tr>'
                  itemTpl='<tr class="g2-tooltip-list-item"><td style="color:`black`">{name}</td><td>{value}</td></tr>'
                  offset={50}
                  g2-tooltip={{
                      position: 'absolute',
                      visibility: 'hidden',
                      border : '1px solid #efefef',
                      backgroundColor: 'white',
                      color: '#000',
                      opacity: "0.8",
                      padding: '5px 15px',
                      'transition': 'top 200ms,left 200ms'
                  }}  
                  g2-tooltip-list={{
                      margin: '10px'
                  }}
              /> */}
              {/*<Geom
                type="point"
                position="name*score"
                size={60}
                shape={[
                  "name",
                  function(name) {
                    return ["image", imageMap[name]];
                  }
                ]}
              />*/}
            </Chart>
          </div>
      );
    }catch(error){ 
      // BaseService.post("/frontendlog/", { method: 'VerticalChart catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
      return (<div></div>); 
    }
}
export default VerticalChart;