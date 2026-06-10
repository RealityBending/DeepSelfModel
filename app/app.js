const d3 = window["d3"]
const coreSelfModel = window["CORE_SELF_MODEL"]

if (!d3 || !coreSelfModel) {
    throw new Error("The simulator dependencies did not load correctly.")
}

const width = 960
const height = 650
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

const xPos = { 1: 140, 2: 390, 3: 640, 4: 850 }
const nodeFillByLevel = { 1: "#3b82f6", 2: "#8b5cf6", 3: "#10b981" }

const nodes = coreSelfModel.nodes.map((node) => ({ ...node, val: node.value ?? 0 }))
const observables = coreSelfModel.observables.map((obs) => ({ ...obs, val: 0 }))
const edges = coreSelfModel.edges.map((edge) => ({ ...edge }))

const nodesById = new Map(nodes.map((node) => [node.id, node]))
const obsById = new Map(observables.map((obs) => [obs.id, obs]))
const incomingEdgesByTarget = d3.group(edges, (edge) => edge.target)

const levelCounts = nodes.reduce((counts, node) => {
    counts[node.level] = Math.max(counts[node.level] ?? 0, node.order)
    return counts
}, {})

nodes.forEach((node) => {
    const spacing = height / (levelCounts[node.level] + 1)
    node.x = xPos[node.level]
    node.y = node.order * spacing + 20
})

// --- Radar Chart Geometry ---
const radarCx = xPos[4] + 10
const radarCy = height / 2
const radarR = 95

const getRadarPoint = (angle, radius) => ({
    x: radarCx + Math.cos(angle) * radius,
    y: radarCy + Math.sin(angle) * radius,
})

const obsCorners = {}
observables.forEach((obs) => {
    obsCorners[obs.id] = getRadarPoint(obs.angle, radarR)
})

const svg = d3.select("#graph").append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height)

const linkGen = d3
    .linkHorizontal()
    .x((point) => point.x)
    .y((point) => point.y)

const buildLinkPath = (edge) => {
    const source = nodesById.get(edge.source)
    const sourceCoords = { x: source.x + 40, y: source.y }

    let targetCoords
    if (nodesById.has(edge.target)) {
        const targetNode = nodesById.get(edge.target)
        targetCoords = { x: targetNode.x - 40, y: targetNode.y }
    } else if (obsCorners[edge.target]) {
        targetCoords = obsCorners[edge.target] // Route exactly to the radar corners
    } else {
        targetCoords = { x: radarCx, y: radarCy }
    }

    return linkGen({ source: sourceCoords, target: targetCoords })
}

const linkPaths = svg.selectAll(".link").data(edges).enter().append("path").attr("class", "link").attr("d", buildLinkPath)

const nodeGroups = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", (node) => (node.level === 1 ? "node node-l1" : "node"))
    .attr("transform", (node) => `translate(${node.x},${node.y})`)

nodeGroups
    .append("rect")
    .attr("class", "node-box")
    .attr("width", 80)
    .attr("height", 50)
    .attr("x", -40)
    .attr("y", -25)
    .attr("fill", "#f8fafc")
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 2)
    .attr("rx", 6)

// --- Filled Distribution Generator ---
const areaGen = d3
    .area()
    .x((d) => d[0])
    .y0(15) // Baseline Y
    .y1((d) => d[1])
    .curve(d3.curveBasis)

const drawDistribution = (value) => {
    const mu = -20 + value * 40
    const sigma = 6
    const points = d3.range(-35, 36, 2).map((x) => {
        const y = Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)))
        return [x, 15 - y * 32]
    })
    return areaGen(points)
}

nodeGroups
    .append("path")
    .attr("class", "node-dist")
    .attr("fill", (node) => nodeFillByLevel[node.level])
    .attr("fill-opacity", 0.25)
    .attr("stroke", (node) => nodeFillByLevel[node.level])
    .attr("stroke-width", 2)

nodeGroups.append("line").attr("x1", -35).attr("x2", 35).attr("y1", 15).attr("y2", 15).attr("stroke", "#cbd5e1")

nodeGroups
    .append("text")
    .attr("class", "node-label")
    .attr("y", -32)
    .text((node) => node.label)

nodeGroups
    .append("text")
    .attr("class", "node-value")
    .attr("y", 38)
    .text((node) => `${Math.round(node.val * 100)}%`)

coreSelfModel.levelHeaders.forEach((header) => {
    svg.append("text").attr("class", "axis-label").attr("x", xPos[header.level]).attr("y", 40).text(header.label)
})

// --- Radar Chart Implementation ---
const radarGroup = svg.append("g").attr("class", "radar-group")

// Background Grid (100% capacity)
radarGroup
    .append("polygon")
    .attr("class", "radar-bg")
    .attr("points", observables.map((o) => `${obsCorners[o.id].x},${obsCorners[o.id].y}`).join(" "))
    .attr("fill", "#f8fafc")
    .attr("stroke", "#cbd5e1")
    .attr("stroke-width", 2)
    .attr("stroke-linejoin", "round")

// Inner Grid (50% mark)
radarGroup
    .append("polygon")
    .attr(
        "points",
        observables
            .map((o) => {
                const p = getRadarPoint(o.angle, radarR * 0.5)
                return `${p.x},${p.y}`
            })
            .join(" "),
    )
    .attr("fill", "none")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "4,4")
    .attr("stroke-linejoin", "round")

// Dynamic Output Polygon
const radarPoly = radarGroup
    .append("polygon")
    .attr("class", "radar-fill")
    .attr("fill", "rgba(59, 130, 246, 0.25)")
    .attr("stroke", "#3b82f6")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")

const obsNodes = radarGroup
    .selectAll(".obs-node")
    .data(observables)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${obsCorners[d.id].x}, ${obsCorners[d.id].y})`)

obsNodes
    .append("circle")
    .attr("r", 5)
    .attr("fill", (d) => d.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)

obsNodes
    .append("text")
    .attr("class", "node-label")
    .attr("x", (d) => Math.cos(d.angle) * 20)
    .attr("y", (d) => (Math.sin(d.angle) > 0 ? 20 : -15))
    .style("text-anchor", (d) => {
        if (Math.abs(Math.cos(d.angle)) < 0.1) return "middle"
        return Math.cos(d.angle) > 0 ? "start" : "end"
    })
    .text((d) => d.label)

const obsValuesTexts = obsNodes
    .append("text")
    .attr("class", "node-value")
    .attr("x", (d) => Math.cos(d.angle) * 20)
    .attr("y", (d) => (Math.sin(d.angle) > 0 ? 34 : -1))
    .style("text-anchor", (d) => {
        if (Math.abs(Math.cos(d.angle)) < 0.1) return "middle"
        return Math.cos(d.angle) > 0 ? "start" : "end"
    })
    .text("0%")

// --- Interaction Logic ---
const detailsTitle = document.getElementById("details-title")
const detailsValue = document.getElementById("details-value")
const detailsDescription = document.getElementById("details-description")

let activeNodeId = null

const getSourceValue = (sourceId) => {
    if (nodesById.has(sourceId)) return nodesById.get(sourceId).val
    if (obsById.has(sourceId)) return obsById.get(sourceId).val
    return 0
}

const getEdgeContribution = (edge) => {
    const sourceValue = getSourceValue(edge.source)
    return edge.transform === "inverse" ? 1 - sourceValue : sourceValue
}

const computeTargetValue = (targetId) => {
    const incomingEdges = incomingEdgesByTarget.get(targetId) || []
    const weightedSum = incomingEdges.reduce((sum, edge) => sum + getEdgeContribution(edge) * edge.weight, 0)
    return clamp(weightedSum, 0, 1)
}

const updateDetails = (node) => {
    if (!node) {
        detailsTitle.textContent = "Hover over a node"
        detailsValue.textContent = ""
        detailsDescription.textContent =
            "Drag the four Level 1 distributions left or right to change the cascade, then hover over any node to inspect how the current CPC revision defines it."
        return
    }
    detailsValue.textContent = `${Math.round(node.val * 100)}%`
    detailsTitle.textContent = node.title || node.label
    detailsDescription.textContent = node.description
}

const renderActiveState = () => {
    nodeGroups.classed("is-active", (node) => node.id === activeNodeId)
}

const setActiveNode = (node) => {
    activeNodeId = node ? node.id : null
    renderActiveState()
    updateDetails(node || null)
}

function updateSystem() {
    nodes
        .filter((node) => node.level > 1)
        .sort((left, right) => left.level - right.level || left.order - right.order)
        .forEach((node) => {
            node.val = computeTargetValue(node.id)
        })

    observables.forEach((obs) => {
        obs.val = computeTargetValue(obs.id)
    })

    nodeGroups.select(".node-dist").attr("d", (node) => drawDistribution(node.val))
    nodeGroups.select(".node-value").text((node) => `${Math.round(node.val * 100)}%`)

    linkPaths
        .attr("stroke", (edge) => (getEdgeContribution(edge) > 0.5 ? "#64748b" : "#cbd5e1"))
        .attr("stroke-width", (edge) => 1 + getEdgeContribution(edge) * 4)

    // Update Radar Polygon
    radarPoly.attr(
        "points",
        observables
            .map((obs) => {
                const p = getRadarPoint(obs.angle, radarR * obs.val)
                return `${p.x},${p.y}`
            })
            .join(" "),
    )

    // Update Radar Texts
    obsValuesTexts.data(observables).text((d) => `${Math.round(d.val * 100)}%`)

    if (activeNodeId) {
        updateDetails(nodesById.get(activeNodeId))
    }
}

nodeGroups
    .on("mouseenter", (_, node) => {
        setActiveNode(node)
    })
    .on("mouseleave", () => {
        setActiveNode(null)
    })

const dragHandler = d3
    .drag()
    .on("start", (_, node) => {
        if (node.level === 1) setActiveNode(node)
    })
    .on("drag", function (event, node) {
        if (node.level !== 1) return
        node.val = clamp(node.val + event.dx * 0.01, 0, 1)
        updateSystem()
    })
    .on("end", () => {
        setActiveNode(null)
    })

nodeGroups.filter((node) => node.level === 1).call(dragHandler)

updateDetails(null)
updateSystem()
