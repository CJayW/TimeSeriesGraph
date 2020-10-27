//A Generic file that can be utilised to create axis labels for graphs
// This should only be directly used by other axis makers, such as the Date one

type Stage = {
  inc : number,
  getStarting : (d : number)=>number,
  toString : (d : number)=>string,
}

function genericAxisLabelMaker(
  range : [number, number],
  stages: Stage[],
  axisLength_Px : number,
  targetPxPerLabel : number
) {

  let rangeDiff = range[1] - range[0];

  let stage = stages.find(s=>{
    let density = (axisLength_Px / (rangeDiff / s.inc))
    return density > targetPxPerLabel;
  });
  if(!stage) {
    stage = stages[stages.length-1];
  }

  let ret : {
    pos : number,
    label : string,
  }[] = []

  for(let current = stage.getStarting(range[0]);
      current < range[1];
      current += stage.inc
  ) {
    ret.push({
      label: stage.toString(current),
      pos: (current - range[0]) / rangeDiff,
    })
  }

  return ret;
}

export {
  genericAxisLabelMaker
}

