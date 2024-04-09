import React from 'react';
import BaseService from '../service/base.service';
import { getJwtToken } from '../helper/jwt.helper';

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Label,
  Coord,
  Legend
} from "bizcharts";
import DataSet from '@antv/data-set';

// const { Region, Text } = Guide;

interface IProps { 
    height: number;
    padding: any;
    data : any;
    disable: boolean;
}

const HorizontalChart: React.StatelessComponent<IProps> = (props) => { 
    
   // setup formatters
    const percentFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const pf = new Intl.NumberFormat('en-IN', percentFormat);

    const { DataView } = DataSet;

    const dv = new DataView();
    dv.source(props.data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'answer',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val: string) => {
          val = ( parseFloat(val) * 100 ) + '%';
          return val;
        },
      },
      count: {
        formatter: (val: string) => {
          val = val + ' (' + pf.format((parseFloat(val) / props.data[0].total) * 100) + '%)';
          return val;
        },
      },
    };

    function getXY(c: any, { index: idx = 0, field = 'percent', radius = 0.5 }) {
        const d = c.get('data');
        if (idx > d.length) return;
        const scales = c.get('scales');
        let sum = 0;
        for (let i = 0; i < idx + 1; i++) {
          let val = d[i][field];
          if (i === idx) {
            val = val / 2;
          }
          sum += val;
        }
        const pt = {
          y: scales[field].scale(sum),
          x: radius,
        };
        const coord = c.get('coord');
        let xy = coord.convert(pt);
        return xy;
    }
    
    try{
      if (props.disable || props.data[0].total === 0 ) {
        return <div></div>
      }
      return (
        <div>
          <Chart
            height={props.height}
            data={dv}
            scale={cols}
            padding={props.padding}
            forceFit
            onGetG2Instance={c => {
              const xy = getXY(c, { index: 0 });
              c.showTooltip(xy);
            }}
          >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            <Legend/>
            <Tooltip
              showTitle={false}
              itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="answer"
              tooltip={[
                'answer*percent',
                (answer, percent) => {
                  percent = ( percent * props.data[0].total ) + ' (' + pf.format(percent * 100) + '%)';
                  return {
                    name: answer,
                    value: percent,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
            >
              <Label
                content="count"
                formatter={(val, answer) => {
                  // return answer.point.answer ;
                  return answer.point.answer + ': ' + val;
                }}
                textStyle={{
                  fontSize: '14', // font size of label text
                  fontWeight: 'bold', // weight of label text
                }}
              />
            </Geom>
          </Chart>
        </div>
      );
    }catch(error){ 
      // BaseService.post("/frontendlog/", { method: 'PieChart catch', message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
      return (<div></div>); 
    }
}
export default HorizontalChart;