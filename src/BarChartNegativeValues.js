import {
  max,
  scaleBand,
  scaleLinear,
  select,
  axisLeft,
  axisBottom,
  min
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a BarChartNegativeValues
 * Also uses techniques / helpers from sessions 06 + further,
 * such as responsiveness and min/max.
 * (No animation at the moment)
 */

function BarChartNegativeValues({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([min(data), max(data)]) // same as d3.extent(data), currently from -40 to +70
      .range([height, 0]);

    // bars
    svgContent
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", "#ff6600")
      .attr("x", (value, index) => xScale(index))
      .attr("y", value => (value < 0 ? yScale(0) : yScale(value))) // same as: value => yScale(Math.max(0, value))
      .attr("width", xScale.bandwidth())
      .attr("height", value => Math.abs(yScale(0) - yScale(value))); // width / height can't be negative, Math.abs makes everything positive

    // axes
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${yScale(0)})`) // position x-axis where y = 0
      .call(xAxis);
    svg.select(".y-axis").call(yAxis);
  }, [data, dimensions]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="content" />
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default BarChartNegativeValues;
