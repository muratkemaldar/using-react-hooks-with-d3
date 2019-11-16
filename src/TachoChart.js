import React, { useRef, useEffect } from "react";
import { select, interpolate, arc, pie } from "d3";
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
      .startAngle(-0.5 * Math.PI)
      .endAngle(0.5 * Math.PI)
      .sort(null);

    const arcs = pieGen([data, 1 - data]);
    const slices = svg.selectAll(".tacho").data(arcs);

    slices
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "tacho")
            .attr("fill", (d, i) => (i ? "#ddd" : "#ffcc00"))
            .attr("d", arcGen)
            .each(function(value) {
              this.currentPieValue = value;
            }),
        update =>
          update
            .transition()
            .duration(300)
            .attrTween("d", function(value) {
              const interpolator = interpolate(this.currentPieValue, value);
              this.currentPieValue = interpolator(0);
              return time => arcGen(interpolator(time));
            })
      )
      .style(
        "transform",
        `translate(${dimensions.width / 2}px, ${dimensions.height}px)`
      );

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
