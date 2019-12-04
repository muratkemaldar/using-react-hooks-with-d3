import React, { useRef, useEffect } from "react";
import { select, hierarchy, cluster, linkVertical } from "d3";
import useResizeObserver from "./useResizeObserver";

function TreeChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const root = hierarchy(data);
    const treeLayout = cluster();

    const linkGen = linkVertical()
      .x(link => link.x)
      .y(link => link.y);

    const highlightLinkGen = linkVertical()
      .source(link => link[0])
      .target(link => link[1])
      .x(link => link.x)
      .y(link => link.y);

    // dimensions
    treeLayout.size([dimensions.width, dimensions.height]);

    // extend data with coordinates
    treeLayout(root);

    // test
    console.warn("descendants", root.descendants());
    console.warn("links", root.links());

    // Nodes
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join("circle")
      .classed("node", true)
      .attr("cx", node => node.x)
      .attr("cy", node => node.y)
      .attr("r", 4);

    // Links
    svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .classed("link", true)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", linkGen);

    svg
      .selectAll(".highlight")
      .data([root.path(root.children[0])])
      .join("path")
      .classed("highlight", true)
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("d", highlightLinkGen);
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default TreeChart;
