import {
  max,
  scaleLinear,
  scaleBand,
  select,
  stack,
  axisBottom,
  axisLeft,
  scaleOrdinal,
  stackOrderAscending
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a StackedBarChart
 */

function StackedBarChart({ data, keys, colors }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const series = stackGenerator(data);

    // scales + line generator
    const xScale = scaleBand()
      .domain(data.map(value => value.year))
      .range([0, width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, max(series, d => max(d, d => d[1]))])
      .range([height, 0]);

    const colorScale = scaleOrdinal()
      .domain(Object.keys(colors))
      .range(Object.values(colors));

    svg
      .selectAll(".year")
      .data(series)
      .join("g")
      .attr("class", "year")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => xScale(d.data.year))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]));

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [colors, data, dimensions, keys]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default StackedBarChart;
