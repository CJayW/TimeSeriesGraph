import { makeNumberLabels } from "./labels/NumberLabels";
import { makeDateAxisLabels } from "./labels/DateLabels";

//TODO allow range to be null to autocalculat 
type AxisPropsRange<T> = [T, T];

type DateSpecificAxisProps = {
  type : "Date",
  range : AxisPropsRange<Date>,
}
type NumberSpecificAxisProps = {
  type : "Number",
  range : AxisPropsRange<number>,
}

type AxisProps = (DateSpecificAxisProps | NumberSpecificAxisProps) & {
  minPxPerLabel : number,
  textPadding : number,
  axisPerpendicularLineWidth : number,
};

type RenderProps = {
  axisLength : number,
  startPos : [number, number],
  direction : [number, number],
  givenAxisSize : [number, number],
}

const AxisDefaultProps : AxisProps = {
  type: "Date",
  range: [new Date(), new Date()],
  textPadding: 5,
  axisPerpendicularLineWidth: 5,
  minPxPerLabel: 100,
};

class Axis{
  props : Partial<AxisProps>;
  //Returns the props written over the default props

  getFullProps : ()=>AxisProps = ()=>({...AxisDefaultProps, ...this.props} as AxisProps)

  getLabels = (axisLength : number, range : [any, any])=>{
    let props = this.getFullProps();
    switch(props.type) {
      case "Date":
        return makeDateAxisLabels(
          range,
          axisLength,
          props.minPxPerLabel
        )
      case "Number":
        return makeNumberLabels(
          range,
          axisLength,
          props.minPxPerLabel,
        )
    }
  }

  getLabelSize=(ctx : CanvasRenderingContext2D)=>{
    //Picks a good piece of text to measure - It should be on the longer size
    let txt : string = "";
    switch(this.getFullProps().type) {
      case "Date":
        txt = "00:00:00";
        break;
      case "Number":
        txt = "1000";
        break;
    }
    return ctx.measureText(txt);
  }
  //Returns the width of the axis - assumes that the axis is vertical
  getAxisWidth =(ctx : CanvasRenderingContext2D)=>{
    let props = this.getFullProps();
    let labelSize = this.getLabelSize(ctx);
    return labelSize.width
         + props.textPadding*2
         + props.axisPerpendicularLineWidth
         + 1 //axis line width
  }
  //Returns the height of the axis - assumes that the axis is horizontal
  getAxisHeight =(ctx : CanvasRenderingContext2D)=>{
    let props = this.getFullProps();
    let labelSize = this.getLabelSize(ctx);
    return labelSize.actualBoundingBoxAscent
         + labelSize.actualBoundingBoxDescent
         + props.textPadding*2
         + props.axisPerpendicularLineWidth
         + 1 //axis line width
  }

  render=(ctx : CanvasRenderingContext2D, renderProps : RenderProps)=>{
    let props = this.getFullProps();

    let dir = renderProps.direction;
    let perpendicularDir = [
      dir[1],
      dir[0],
    ]
    let perpendicularVec = [
      perpendicularDir[0] * props.axisPerpendicularLineWidth,
      perpendicularDir[1] * props.axisPerpendicularLineWidth
    ];

    let axisDiff = [
      dir[0] * renderProps.axisLength,
      dir[1] * renderProps.axisLength,
    ]

    //Draws the main line outlining the graph for the length of the axis
    ctx.beginPath();
    ctx.moveTo(...renderProps.startPos);
    ctx.lineTo(...[
      renderProps.startPos[0] + axisDiff[0],
      renderProps.startPos[1] + axisDiff[1],
    ] as [number, number]);

    //TODO check if props.range is null, and calculate if needed
    const labels = this.getLabels(renderProps.axisLength, props.range);

    //Renders the text / line for each label
    labels.forEach((l, i)=>{
      let axisPos : [number, number] = [
        renderProps.startPos[0] + (axisDiff[0] * l.pos),
        renderProps.startPos[1] + (axisDiff[1] * l.pos),
      ]
      let perpendicularLineEnd : [number, number] = [
        axisPos[0] + perpendicularVec[0],
        axisPos[1] + perpendicularVec[1],
      ]

      ctx.moveTo(...axisPos);
      ctx.lineTo(...perpendicularLineEnd);

      let textMeasure = ctx.measureText(l.label);
      let centreOff = [
        0,
        (textMeasure.actualBoundingBoxDescent - textMeasure.actualBoundingBoxAscent) / 2
      ];
      let textSize = [
        textMeasure.width,
        textMeasure.actualBoundingBoxDescent + textMeasure.actualBoundingBoxAscent
      ];

      ctx.fillText(l.label,
        //Centres the text on the line end
        perpendicularLineEnd[0] - centreOff[0]
        //Moves the text so it touches the point on its size
        + perpendicularDir[0] * textSize[0] / 2
        //Adds padding to the text
        + perpendicularDir[0] * props.textPadding,

        perpendicularLineEnd[1] - centreOff[1]
        + perpendicularDir[1] * textSize[1] / 2
        + perpendicularDir[1] * props.textPadding
      );
    })

    //Acually draws the lines
    ctx.stroke();
  }

  constructor(props : Partial<AxisProps>) {
    this.props = props;
  }
};

export default Axis;
export type _AxisProps = AxisProps
