import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  category: string;
  prerequisites: string[];
  unlocked: boolean;
}

interface SkillNode extends d3.SimulationNodeDatum, Skill {
  x?: number;
  y?: number;
}

interface SkillLink extends d3.SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
}

const mockSkillData: Skill[] = [
  {
    id: "coding",
    name: "Coding",
    description: "Master the art of programming",
    level: 0,
    maxLevel: 5,
    category: "Technical",
    prerequisites: [],
    unlocked: true
  },
  {
    id: "webdev",
    name: "Web Development",
    description: "Create modern web applications",
    level: 0,
    maxLevel: 5,
    category: "Technical",
    prerequisites: ["coding"],
    unlocked: false
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Lead and inspire teams",
    level: 0,
    maxLevel: 5,
    category: "Soft Skills",
    prerequisites: [],
    unlocked: true
  },
  {
    id: "teamwork",
    name: "Teamwork",
    description: "Collaborate effectively in teams",
    level: 0,
    maxLevel: 5,
    category: "Soft Skills",
    prerequisites: ["leadership"],
    unlocked: false
  }
];

const SkillTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skills, setSkills] = useState<Skill[]>(mockSkillData);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Create the main group
    const g = svg.append("g");

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Prepare data for d3 force simulation
    const nodes: SkillNode[] = skills.map(skill => ({
      ...skill,
      x: width / 2,
      y: height / 2
    }));

    const links: SkillLink[] = skills.flatMap(skill =>
      skill.prerequisites.map(prereq => ({
        source: prereq,
        target: skill.id
      }))
    );

    // Create force simulation
    const simulation = d3.forceSimulation<SkillNode>(nodes)
      .force("link", d3.forceLink<SkillNode, SkillLink>(links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    // Create nodes
    const node = g.append("g")
      .selectAll<SVGGElement, SkillNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "skill-node")
      .call(d3.drag<SVGGElement, SkillNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", 30)
      .attr("fill", d => d.unlocked ? "#4CAF50" : "#666")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text to nodes
    node.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", "#fff")
      .style("font-size", "12px");

    // Add level indicator
    node.append("text")
      .text(d => `${d.level}/${d.maxLevel}`)
      .attr("text-anchor", "middle")
      .attr("dy", 20)
      .attr("fill", "#fff")
      .style("font-size", "10px");

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SkillNode).x!)
        .attr("y1", d => (d.source as SkillNode).y!)
        .attr("x2", d => (d.target as SkillNode).x!)
        .attr("y2", d => (d.target as SkillNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, SkillNode, unknown>, d: SkillNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SkillNode, unknown>, d: SkillNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SkillNode, unknown>, d: SkillNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add click handlers
    node.on("click", (event, d) => {
      event.stopPropagation();
      setSelectedSkill(d);
    });

    return () => {
      simulation.stop();
    };
  }, [skills]);

  const upgradeSkill = (skillId: string) => {
    setSkills(prevSkills => 
      prevSkills.map(skill => 
        skill.id === skillId && skill.level < skill.maxLevel
          ? { ...skill, level: skill.level + 1 }
          : skill
      )
    );
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
      
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 p-6 glass rounded-xl max-w-md"
        >
          <button
            className="absolute top-2 right-2 text-white/60 hover:text-white"
            onClick={() => setSelectedSkill(null)}
          >
            ×
          </button>
          <h3 className="text-xl font-bold mb-2">{selectedSkill.name}</h3>
          <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
          <div className="flex justify-between items-center">
            <div>
              Level: {selectedSkill.level}/{selectedSkill.maxLevel}
            </div>
            {selectedSkill.unlocked && selectedSkill.level < selectedSkill.maxLevel && (
              <button
                className="btn btn-primary"
                onClick={() => upgradeSkill(selectedSkill.id)}
              >
                Upgrade
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillTree; 