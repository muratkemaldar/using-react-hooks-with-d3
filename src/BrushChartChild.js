import React, { useRef, useEffect } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a BrushChart2Child
 */

function BrushChart2Child({ data, selection }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain(selection)
      .range([10, width - 10]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 10, 10]);

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y(d => yScale(d))
      .curve(curveCardinal);

    // render the line
    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale);

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [data, dimensions, selection]);

  if (!selection) {
    return null;
  }

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <defs>
            <clipPath id="myClipPath">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#myClipPath)"></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default BrushChart2Child;
