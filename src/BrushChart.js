import React, { useRef, useEffect, useState } from "react";
import {
  select,
  brushX,
  scaleLinear,
  line,
  max,
  event,
  curveCardinal,
  axisBottom,
  axisLeft
} from "d3";
import useResizeObserver from "./useResizeObserver";
import usePrevious from "./usePrevious";

/**
 * Component that renders a BrushChart
 */

function BrushChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selection, setSelection] = useState([0, 1.2]);
  const prevSelection = usePrevious(selection);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height, 0]);

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

    const myDots = svg
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale);

    // brush
    const brush = brushX()
      .extent([
        [0, 0],
        [width, height]
      ])
      .on("start brush end", () => {
        if (event.selection) {
          const [x0, x1] = event.selection.map(xScale.invert);
          setSelection([x0, x1]);
          myDots
            .transition()
            .duration(50)
            .attr("r", (d, index) => (x0 <= index && index <= x1 ? 4 : 2))
            .attr("fill", (d, index) =>
              x0 <= index && index <= x1 ? "orange" : "black"
            );
        }
      });

    // init + set brush position
    if (selection === prevSelection) {
      svg
        .select(".brush")
        .call(brush)
        .call(brush.move, selection.map(xScale));
    }

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [data, dimensions, prevSelection, selection]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="brush" />
        </svg>
      </div>
      <small style={{ marginBottom: "1rem" }}>
        Selected values: [
        {data
          .filter(
            (value, index) => selection[0] <= index && index <= selection[1]
          )
          .join(", ")}
        ]
      </small>
    </React.Fragment>
  );
}

export default BrushChart;
