import{
  genericAxisLabelMaker,
} from "./GenericLabelMaker"

type Stage = {
  inc : number,
  getStarting : (d : number)=>number,
  toString : (d : number)=>string,
}

const DateAxisStages : Stage[] = (()=>{
  function zeroPad(v : any, targetLength : number) : string {
    let str = String(v);
    while(str.length < targetLength) str = `0${str}`;
    return str;
  }

  function zeroMilliseconds(d : Date) {

    if(d.getTime() !== d.setMilliseconds(0)) {
      d.setSeconds(d.getSeconds()+1);
    }
    return d;
  }
  function zeroSeconds(d : Date) {
    zeroMilliseconds(d);
    if(d.getTime() !== d.setSeconds(0)) {
      d.setMinutes(d.getMinutes()+1);
    }
    return d;
  }
  function zeroMinutes(d : Date) {
    zeroSeconds(d);
    if(d.getTime() !== d.setMinutes(0)) {
      d.setHours(d.getHours()+1);
    }
    return d;
  }


  function makeNSecondsStage(n : number) : Stage {
    return {
      //Seconds
      inc: 1000 * n,
      getStarting: (startVal : number)=>{
        let d = new Date(startVal);
        zeroMilliseconds(d);
        let seconds = d.getSeconds();
        let diff = seconds % n;
        if(diff)
          d.setSeconds(seconds + n - diff);

        return d.getTime();
      },
      toString: (n : number)=>{
        const d = new Date(n);
        return `${zeroPad(d.getHours(), 2)}:${zeroPad(d.getMinutes(), 2)}:${zeroPad(d.getSeconds(), 2)}`
      }
    }
  }
  function makeNMinutesStage(n : number) : Stage {
    return {
      //Seconds
      inc: 1000 * 60 * n,
      getStarting: (startVal : number)=>{
        let d = new Date(startVal);
        zeroSeconds(d);
        let val = d.getMinutes();
        let diff = val % n;
        if(diff)
          d.setMinutes(val + n - diff);
        return d.getTime();
      },
      toString: (n : number)=>{
        const d = new Date(n);
        return `${zeroPad(d.getHours(), 2)}:${zeroPad(d.getMinutes(), 2)}`
      }
    }
  }
  function makeNHoursStage(n : number) : Stage {
    return {
      inc: 1000 * 60 * 60 * n,
      getStarting: (startVal : number)=>{
        let d = new Date(startVal);
        zeroMinutes(d);
        let val = d.getHours();
        //-1 used because hours will never be zero
        let diff = (val-1) % n;
        if(diff)
          d.setHours(val + n - diff);
        return d.getTime();
      },
      toString: (n : number)=>{
        const d = new Date(n);
        return `${zeroPad(d.getHours(), 2)}:00`
      }
    }
  }
  function makeNDaysStage(n : number) : Stage {
    return {
      inc: 1000 * 60 * 60 * 24 * n,
      getStarting: (startVal : number)=>{
        let d = new Date(startVal);
        zeroMinutes(d);
        let val = d.getDate();
        //-1 used because gates will never be zero
        let diff = val-1 % n;
        if(diff)
          d.setDate(val + n - diff);
        return d.getTime();
      },
      toString: (n : number)=>{
        const d = new Date(n);
        return `${d.getMonth() + 1}/${d.getDate()}`
      }
    }
  }

  return [
    ...[1,2,5,10,30].map(makeNSecondsStage),
    ...[1,2,5,10,30].map(makeNMinutesStage),
    ...[1,2,5,10].map(makeNHoursStage),
    ...[1,2,5,10,20,50,100].map(makeNDaysStage),
    //TODO add months, the max days should be nearer 5
  ];
})()

function makeDateAxisLabels(range : [Date, Date], axisLen_px : number, targetPixelsPerLabel : number) {
  return genericAxisLabelMaker(
    [
      range[0].getTime(),
      range[1].getTime(),
    ],
    DateAxisStages,
    axisLen_px,
    targetPixelsPerLabel
  );
}

export{
  makeDateAxisLabels,
}