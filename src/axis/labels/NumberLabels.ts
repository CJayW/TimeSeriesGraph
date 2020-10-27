function toHumanReadable(val : number) {
  if(!val)
    return String(val);

  // let orderOfMag = Math.floor(Math.log10(val));

  let ret : string = String(val);

  [
    {
      div: 1000000000,
      unit : "b",
    },
    {
      div: 1000000,
      unit : "m",
    },
    {
      div: 1000,
      unit : "k",
    },
  ].find(e=>{

    if(val >= e.div) {
      ret = `${val / e.div}${e.unit}`
      return true;
    }else{
      return false;
    }

  })

  return ret;
}

function makeNumberLabels(range : [number, number], axisLength : number, minPxPerLabel : number) {

  let rangeLen = range[1] - range[0];

  let currentDiv = 1;

  let incs = [
    1,
    2,
    5
  ]

  let foundInc = false;

  let currentValue : number = range[0];
  let incValue : number = 1;

  for(currentDiv; !foundInc; currentDiv *= 10) {
    for(let j = 0; j < incs.length; j++) {
      let div = currentDiv * incs[j];
      let den = axisLength / (rangeLen / div);

      if(den > minPxPerLabel) {
        foundInc = true;
        incValue = div;

        if((currentValue % div) !== 0) {
          currentValue += div - (currentValue % div);
        }

        break;
      }

    }
  }
  
  let res : {
    label : string,
    pos : number,
  }[] = []

  for(currentValue; currentValue < range[1]; currentValue += incValue) {
    res.push({
      // pos: currentValue / rangeLen,
      pos: (currentValue - range[0]) / rangeLen,
      label: toHumanReadable(currentValue)
    });
  }

  return res;
}


export {
  makeNumberLabels,
}
