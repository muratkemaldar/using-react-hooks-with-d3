import React, { useRef, useEffect } from "react";
import {
  select,
  hierarchy,
  forceSimulation,
  forceManyBody,
  forceX,
  forceY,
  forceRadial,
  mouse,
  forceCollide
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component, that renders a force layout for hierarchical data.
 */

function ForceTreeChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    // centers the simulation
    svg.attr("viewBox", [
      -dimensions.width / 2,
      -dimensions.height / 2,
      dimensions.width,
      dimensions.height
    ]);

    const root = hierarchy(data);
    const nodeData = root.descendants();
    const linkData = root.links();

    // links
    const links = svg
      .selectAll(".link")
      .data(linkData)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "black")
      .attr("fill", "none");

    // nodes
    const nodes = svg
      .selectAll(".node")
      .data(nodeData)
      .join("circle")
      .attr("class", "node")
      .attr("r", 4);

    // labels
    const labels = svg
      .selectAll(".label")
      .data(nodeData)
      .join("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .text(node => node.data.name);

    // simulation
    const simulation = forceSimulation(nodeData)
      .force("charge", forceManyBody().strength(-50))
      .force("collide", forceCollide(15))
      .on("tick", () => {
        console.warn("current alpha:", simulation.alpha());

        svg
          .selectAll(".alpha")
          .data([data])
          .join("text")
          .attr("class", "alpha")
          .text(simulation.alpha().toFixed(2))
          .attr("x", -dimensions.width / 2 + 10)
          .attr("y", -dimensions.height / 2 + 30);

        nodes.attr("cx", d => d.x).attr("cy", d => d.y);

        links
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        labels.attr("x", d => d.x).attr("y", d => d.y - 12);
      });

    svg.on("click", () => {
      simulation.alpha(0.5).restart();
      const [x, y] = mouse(svgRef.current);

      // render a circle to show radial force
      svg
        .selectAll(".orbit")
        .data([data])
        .join("circle")
        .attr("class", "orbit")
        .attr("stroke", "green")
        .attr("fill", "none")
        .attr("r", 100)
        .attr("cx", x)
        .attr("cy", y);

      // update radial force
      simulation.force("radial", forceRadial(100, x, y).strength(0.7));
    });

    svg.on("mousemove", () => {
      const [x, y] = mouse(svgRef.current);
      simulation
        .force(
          "x",
          forceX(x).strength(node => 0.2 + node.depth * 0.1)
        )
        .force(
          "y",
          forceY(y).strength(node => 0.2 + node.depth * 0.1)
        );
    });
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default ForceTreeChart;
