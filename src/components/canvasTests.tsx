import React, { useRef, useEffect, useState } from "react"

import {
  TimeSeriesGraph,
} from "./../TimeSeriesGraph"

function CanvasTest() {

  let canvasRef = useRef<HTMLCanvasElement>(null);

  const [chart, setChart] = useState<TimeSeriesGraph>();

  if(chart) {
    //Updates due to props / state
  }

  useEffect(()=>{
    let startDate = new Date();
    let timeRange = 1000 * 60 * 20;
    function makeDateRange() : [Date, Date] {
      return [startDate, new Date(startDate.getTime() + timeRange)];
    }

    let startValue = 0;
    let valueRange = 1;
    function makeValueRange() : [number, number]{
      return [
        startValue,
        startValue + valueRange
      ]
    }

    let chart = new TimeSeriesGraph(
      canvasRef.current!,
      {
        Axis: {
          left: {
            type: "Number",
            range: [
              0, 10000
            ],
            minPxPerLabel: 20,
          },
          bottom: {
            type: "Date",
            range: [
              new Date(0),
              new Date(1000000)
            ],
            minPxPerLabel: 50,
          }
        }
      }
      );

    let key : number = 0
      // setInterval(()=>{
      //   valueRange *= 1.1;
      //   chart.props.Axis!.left!.range = makeValueRange();

      //   chart.render();
      // }, 100);
    let onClickListener = ()=>{
      clearInterval(key);
      // @ts-ignore
      key = null;
    }
    window.addEventListener("click", onClickListener);

    setChart(chart);

    return()=>{
      window.removeEventListener("click", onClickListener);
      
      if(key !== null)
        clearInterval(key);

      chart.destroy();
    }
  }, []);

  return(
    <canvas
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={canvasRef}
    />
  )
}

export default CanvasTest;