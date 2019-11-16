import React, { useRef, useEffect } from "react";
import { select, interpolate, scaleLinear, arc, pie } from "d3";
import useResizeObserver from "./useResizeObserver";

function TachoChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const arcGen = arc()
      .innerRadius(100)
      .outerRadius(150);

    const pieGen = pie()
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const arcs = pieGen([data, 1 - data]);
    const slices = svg.selectAll(".tacho").data(arcs);

    slices
      .enter()
      .append("path")
      .attr("class", "tacho")
      .style(
        "transform",
        `translate(${dimensions.width / 2}px, ${dimensions.height}px)`
      )
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", arcGen)
      .each(function(d, i) {
        // console.warn("each >>", d.startAngle);
        this._current = d;
      });

    slices.transition().attrTween("d", function(d) {
      var interpolator = interpolate(this._current, d);
      console.warn("arct >>", this._current.startAngle, d.startAngle);
      var _this = this;
      return function(t) {
        _this._current = interpolator(t);
        return arcGen(_this._current);
      };
    });

    // draw the bars
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default TachoChart;
