import React, { useRef, useLayoutEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a map of Germany.
 */

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [highlightedFeature, setHighlightedFeature] = useState(null);

  // will be called initially and on every data change
  useLayoutEffect(() => {
    const svg = select(svgRef.current);

    // new and updated responsiveness!
    // we fallback to getBoundingClientRect if no dimensions yet!
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // min / max
    const minProp = min(data.features, country => country.properties[property]);
    const maxProp = max(data.features, country => country.properties[property]);

    // color scale
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], highlightedFeature || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render states
    svg
      .selectAll(".state")
      .data(data.features)
      .join("path")
      .attr("class", "state")
      .on("click", feature =>
        setHighlightedFeature(highlightedFeature === feature ? null : feature)
      )
      .transition()
      .duration(300)
      .attr("fill", feature => colorScale(feature.properties[property]))
      .attr("d", pathGenerator);

    // render text
    svg
      .selectAll(".label")
      .data([highlightedFeature])
      .join("text")
      .attr("class", "label")
      .text(
        feature =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, highlightedFeature]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
