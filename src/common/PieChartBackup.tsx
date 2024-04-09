import React from 'react';

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

const PieChart: React.StatelessComponent<IProps> = (props) => { 
    
  const percentFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const pf = new Intl.NumberFormat('en-IN', percentFormat);
  
    const { DataView } = DataSet;
    // const data = [
    //   {
    //     item: '事例一',
    //     count: 40,
    //   },
    //   {
    //     item: '事例二',
    //     count: 21,
    //   },
    //   {
    //     item: '事例三',
    //     count: 17,
    //   },
    //   {
    //     item: '事例四',
    //     count: 13,
    //   },
    //   {
    //     item: '事例五',
    //     count: 9,
    //   },
    // ];
    const dv = new DataView();
    dv.source(props.data).transform({
      type: 'percent',
      field: 'percent',
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
    
    if (props.disable) {
      return <div></div>
    }
    return (
      <div>
        <Chart
          // height={window.innerHeight}
          // height={350}
          height={props.height}
          data={dv}
          scale={cols}
          // padding={[0, 0, 0, 0]}
          padding={props.padding}
          forceFit
          onGetG2Instance={c => {
            const xy = getXY(c, { index: 0 });
            c.showTooltip(xy);
          }}
        >
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          {/* <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 200}
          /> */}
          <Tooltip
            //triggerOn='none'
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
                // answer = percent + '%';
                // answer = percent * 100 + '%';
                percent = pf.format(percent * 100) + '%';
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
              // content="type"
              content="percent"
              formatter={(val, answer) => {
                // return answer.point.answer;
                return answer.point.answer + ': ' + pf.format(val);
              }}
              textStyle={{
                // textAlign: 'center', // alignment of label text: 'start'|'middle'|'end'
                // fill: '#404040', // color of label text
                fontSize: '18', // font size of label text
                fontWeight: 'bold', // weight of label text
                // rotate: 30,
                // textBaseline: 'top' // baseline of label test: top middle bottom，默认为middle
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
}
export default PieChart;