import { arc, interpolate, pie, scaleOrdinal, schemeGreens, select } from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function PieChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // arc takes instructions (objects with special properties, like startAngle, endAngle, etc.)
    // and transforms them into "d" attributes for path elements
    const arcGenerator = arc()
      .innerRadius(0)
      .outerRadius(150);

    // pie will transform data to instructions for arcGenerator
    const pieGenerator = pie()
      .value(d => d.value)
      .sort(null); // makes sure data doesn't get sorted

    // now transform data to instructions for arc()
    const instructions = pieGenerator(data);

    // generate colorScale
    // https://github.com/d3/d3-scale-chromatic
    const colorScale = scaleOrdinal(schemeGreens[3]);

    // render slices (instructions)
    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (d, i) => colorScale(i))
      .style(
        "transform",
        `translate(${dimensions.width / 2}px, ${dimensions.height / 2}px)`
      )
      .transition()
      .attrTween("d", function(nextInstruction, index) {
        // animation when changing data
        const interpolator = interpolate(this.lastInstruction, nextInstruction);
        this.lastInstruction = interpolator(1);
        return function(t) {
          return arcGenerator(interpolator(t));
        };
      });
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default PieChart;
