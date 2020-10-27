
import Axis from "./axis/axis"
import {
  _AxisProps as AxisProps,
} from "./axis/axis"

type Area = {
  left : number,
  right : number,
  top : number,
  bottom : number,
}
type Rect = {
  x : number,
  y : number,
  w : number,
  h : number,
}
type Range<T> = [T, T];
type TimeRange = Range<Date>;
type NumberRange = Range<number>;

type Props = {
  Axis: Partial<{
    left :   Partial<AxisProps>,
    top :    Partial<AxisProps>,
    right :  Partial<AxisProps>,
    bottom : Partial<AxisProps>,
  }>
}

const defaultProps : Props = {
  Axis: {

  }
}

class TimeSeriesGraph{
  props : Partial<Props>

  //Returns the default props with any user overwrites
  // @ts-ignore - This will work!
  getFullProps : ()=>Props = ()=>({...defaultProps, ...this.props});

  graphArea : Area = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  getGraphRect=()=>{
    return {
      x: this.graphArea.left + this.style.padding,
      y: this.graphArea.top + this.style.padding,
      w: this.canvas.width - (this.graphArea.right + this.graphArea.left) -  + this.style.padding*2,
      h: this.canvas.height - (this.graphArea.bottom + this.graphArea.top) -  + this.style.padding*2,
    } as Rect;
  }

  currentRange : TimeRange = [new Date(), new Date()];
  valueRange : NumberRange = [0,0];

  style={
    padding: 5,
    textPadding: 5,
    axisPerpendicularLineWidth: 5,
  }

  ctx : CanvasRenderingContext2D;

  axis : Partial<{
    left : Axis,
    top : Axis,
    right : Axis,
    bottom : Axis,
  }> = {}

  recalcSize=()=>{
    if(this.axis.left) {
      this.graphArea.left = this.axis.left.getAxisWidth(this.ctx);
    }
    if(this.axis.right) {
      this.graphArea.right = this.axis.right.getAxisWidth(this.ctx);
    }
    if(this.axis.top) {
      this.graphArea.top = this.axis.top.getAxisHeight(this.ctx);
    }
    if(this.axis.bottom) {
      this.graphArea.bottom = this.axis.bottom.getAxisHeight(this.ctx);
    }
  }

  clearCanvas=()=>{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render=()=>{
    this.clearCanvas();

    this.ctx.textAlign = "center";

    let rect = this.getGraphRect();

    if(this.axis.left) {
      this.axis.left.render(this.ctx, {
        axisLength: rect.h,
        direction: [
          0,
          -1,
        ],
        givenAxisSize: [
          this.graphArea.left,
          0,
        ],
        startPos: [
          rect.x,
          rect.y + rect.h,
        ]
      })
    }
    if(this.axis.bottom) {
      this.axis.bottom.render(this.ctx, {
        axisLength: rect.w,
        direction: [
          1,
          0,
        ],
        givenAxisSize: [
          this.graphArea.bottom,
          0,
        ],
        startPos: [
          rect.x,
          rect.y + rect.h,
        ]
      })
    }
    
    //TODO draw graph
  }

  onResize=()=>{
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.render();
  }

  resizeObserver : any;

  //TODO make the number range optional
  constructor(public canvas : HTMLCanvasElement, userProps : Partial<Props>) {
    this.props = userProps;

    this.canvas.addEventListener("resize", this.onResize);

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    // @ts-ignore
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.canvas);

    let props = this.getFullProps();

    for(let axisKey in props.Axis) {
      // @ts-ignore
      this.axis[axisKey] = new Axis(props.Axis[axisKey]);
    }

    this.recalcSize();

    this.render();
  }

  public destroy=()=>{
    
  }
}

export default TimeSeriesGraph;
export {
  TimeSeriesGraph,
}