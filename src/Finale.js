import React, { useEffect, useRef } from "react";
import { select, scaleLinear, line, max, curveCardinal } from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that sums up the most important things to take away from this series.
 */

function Finale({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // general update pattern (join):
    svg
      .selectAll(".circle1")
      .data(data)
      .join("circle") // returns a selection for both entering/updating circles, removes unnecessary circles
      .attr("class", "circle1")
      .attr("fill", "orange")
      .attr("cx", (value, index) => index * 20)
      .attr("cy", 10)
      .attr("r", 5);

    // general update pattern (old)
    // circles2 = summary about entering/updating/exiting circles,
    // but returns the updating (existing) ones per default
    const circles2 = svg.selectAll(".circle2").data(data);

    circles2
      .enter() // get the entering (new) circles from (enter/update/exit) summary
      .append("circle") // create a new circle for entering (new) piece of data
      .merge(circles2) // merge the "entering circles" with "existing" circles
      .attr("fill", "red")
      .attr("class", "circle2") // then apply all the things to the combined group
      .attr("cx", (value, index) => index * 20)
      .attr("cy", 30)
      .attr("r", 5);

    circles2.exit().remove(); // remove exiting circles

    // scales, and other generators
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height, 0]);

    const lineGenerator = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);
  }, [data, dimensions]);

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

export default Finale;
