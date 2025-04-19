import ReactApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';

const ApexChart = ({data}:{data:number[]}) => {
  const state:{ options: ApexOptions;
    series: Array<{ name: string; data: number[] }>;
} = {
    
      series: [{
          name: "appointments",
          data: data
      }],
      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        title: {
          text: 'appoiment for this week',
          align: 'left'
        },

        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
    
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'],
        }
      },
    
    
  };

  

  return (
          <ReactApexChart options={state.options}  series={state.series} type="line" height={'100%'} width={'100%'} />
  );
}
export default ApexChart;