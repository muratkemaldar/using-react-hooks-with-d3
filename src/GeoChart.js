import React, { useRef, useEffect, useState } from "react";
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

  const minProp = min(data.features, country => country.properties[property]);
  const maxProp = max(data.features, country => country.properties[property]);

  const colorScale = scaleLinear()
    .domain([minProp, maxProp])
    .range(["#ccc", "red"]);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize(
        [dimensions.width, dimensions.height],
        highlightedFeature || data
      )
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
  }, [colorScale, data, dimensions, property, highlightedFeature]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
