import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  brushX,
  event,
  axisBottom,
  axisLeft
} from "d3";
import useResizeObserver from "./useResizeObserver";
import usePrevious from "./usePrevious";

/**
 * Component that renders a BrushChart
 */

function BrushChart({ data, children }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selection, setSelection] = useState([0, 1.5]);
  const previousSelection = usePrevious(selection);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([10, width - 10]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 10, 10]);

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y(d => yScale(d))
      .curve(curveCardinal);

    // render the line
    svg
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svg
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", (value, index) =>
        index >= selection[0] && index <= selection[1] ? 4 : 2
      )
      .attr("fill", (value, index) =>
        index >= selection[0] && index <= selection[1] ? "orange" : "black"
      )
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

    // brush
    const brush = brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on("start brush end", () => {
        if (event.selection) {
          const indexSelection = event.selection.map(xScale.invert);
          setSelection(indexSelection);
        }
      });

    // initial position + retaining position on resize
    if (previousSelection === selection) {
      svg
        .select(".brush")
        .call(brush)
        .call(brush.move, selection.map(xScale));
    }
  }, [data, dimensions, previousSelection, selection]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="brush" />
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
      {children(selection)}
    </React.Fragment>
  );
}

export default BrushChart;
