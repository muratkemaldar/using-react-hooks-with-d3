import React, { useRef, useEffect } from "react";
import { select, min, max, scaleTime, scaleLinear, axisBottom } from "d3";
import useResizeObserver from "./useResizeObserver";

const getDate = dateString => {
  const date = dateString.split("-");
  return new Date(date[2], date[0] - 1, date[1]);
};

function BBTimeline({ data, highlight }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const minDate = min(data, episode => getDate(episode.air_date));
    const maxDate = max(data, episode => getDate(episode.air_date));

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([max(data, episode => episode.characters.length), 0])
      .range([0, dimensions.height]);

    svg
      .selectAll(".episode")
      .data(data)
      .join("line")
      .attr("class", "episode")
      .attr("stroke", episode =>
        episode.characters.includes(highlight) ? "blue" : "black"
      )
      .attr("x1", episode => xScale(getDate(episode.air_date)))
      .attr("y1", dimensions.height)
      .attr("x2", episode => xScale(getDate(episode.air_date)))
      .attr("y2", episode => yScale(episode.characters.length));

    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
  }, [data, dimensions, highlight]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
      </svg>
    </div>
  );
}

export default BBTimeline;
