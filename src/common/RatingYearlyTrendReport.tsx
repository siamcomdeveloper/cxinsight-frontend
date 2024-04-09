import React from 'react';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";

interface IProps { 
    height: number;
    padding: any;
    data : any;
    rotate: any;
    disable: boolean;
}

const RatingMonthlyTrendReport: React.StatelessComponent<IProps> = (props) => { 
    
    const cols = {
      month: {
        range: [0, 1]
      },
      score: {
        min: 0,
        max: 5
      },
    };
      
    try{
        return (
            <div>
                <Chart height={props.height} data={props.data} scale={cols} padding={ props.padding } forceFit>
                    <Legend 
                        textStyle={{
                            fontWeight: 'bold',
                            fill: 'black',
                            fontSize: '12',
                        }}
                    />
                    <Axis 
                        name="month"
                        label={{
                            offset: 30,
                            textStyle: {
                                rotate: props.rotate,
                                fontWeight: 'bold',
                                fontSize: '12',
                            },
                            formatter: val => `${val.split(',')[0]}`,
                        }}
                    />
                    <Axis
                        name="score"
                        label={{
                            formatter: val => `${val}`,
                            textStyle: {
                                fontWeight: 'bold',
                                fontSize: '12',
                            },
                        }}
                        title={{
                            // autoRotate: true,
                            offset: 45,
                            textStyle: {
                                rotate: -30,
                                fontSize: '12',
                                textAlign: 'center',
                                fill: 'black',
                                fontWeight: 'bold',
                            },
                            position: 'end',
                        }} 
                    />
                    <Tooltip
                        crosshairs={{
                        type: "y"
                        }}
                    />
                    <Geom
                        type="line"
                        position="month*score"
                        size={4}
                        color={"label"}
                        shape={"smooth"}
                        tooltip={['month*score', (month, score) => {
                            score = `${score} (N = ${month.split(',')[1]})`;
                            return {
                                title: "Average Rating",
                                name: month.split(',')[0],
                                value: score,
                            };
                        }]}
                    />
                    <Geom
                        type="point"
                        position="month*score"
                        size={4}
                        shape={"circle"}
                        color={"label"}
                        style={{
                        stroke: "#fff",
                        lineWidth: 1
                        }}
                        tooltip={['month*score', (month, score) => {
                            score = `${score} (N = ${month.split(',')[1]})`;
                            return {
                                title: "Average Rating",
                                name: month.split(',')[0],
                                value: score,
                            };
                        }]}
                    />
                </Chart>
            </div>
        );
    }catch(error){ 
        // BaseService.post("/frontendlog/", { method: 'RatingYearlyTrendReport catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        return (<div></div>); 
    }
}
export default RatingMonthlyTrendReport;