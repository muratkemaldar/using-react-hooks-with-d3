import React, { useRef, useEffect } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";
import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data, bars = 8 }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    data.sort((a, b) => b.value - a.value);

    const xScale = scaleLinear()
      .domain([0, max(data, entry => entry.value)])
      .range([0, dimensions.width]);

    const yScale = scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, dimensions.height])
      .paddingInner(0.1);

    svg
      .selectAll(".bar")
      .data(data, entry => entry.name)
      .join(enter =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      .attr("class", "bar")
      .attr("fill", entry => entry.color)
      .attr("height", yScale.bandwidth())
      .transition()
      .duration(600)
      .attr("width", entry => xScale(entry.value))
      .attr("x", 0)
      .attr("y", (entry, index) => yScale(index));

    svg
      .selectAll(".label")
      .data(data, entry => entry.name)
      .join(enter =>
        enter
          .append("text")
          .attr("x", 10)
          .attr(
            "y",
            (entry, index) => 5 + yScale(index) + yScale.bandwidth() / 2
          )
      )
      .attr("class", "label")
      .attr("font-size", 14)
      .text(entry => `🐎 ... ${entry.name} (${entry.value} meters)`)
      .transition()
      .duration(600)

      .attr("y", (entry, index) => 5 + yScale(index) + yScale.bandwidth() / 2);
  }, [data, dimensions, bars]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default RacingBarChart;
