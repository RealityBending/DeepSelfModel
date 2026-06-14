const d3 = window["d3"]
const modelData = window["MODEL_DATA"]
const frameworksData = window["FRAMEWORKS_DATA"]

if (!d3 || !modelData) {
    throw new Error("The simulator dependencies did not load correctly.")
}

// --- Global App State ---
let currentFrameworkMode = "big5" // Toggle between "big5" and "cb5t"
let isDragging = false
let isSliderDragging = false
let activeNodeId = null
let lockedNodeId = null

// 1. Inject Textual Overview
const overviewContainer = document.getElementById("overview-panel")
if (modelData.overview) {
    overviewContainer.innerHTML = `
        <p class="overview-kicker">${modelData.overview.kicker}</p>
        <h2 id="overview-title" class="overview-title">${modelData.overview.title}</h2>
        ${modelData.overview.text.map((p) => `<p class="overview-text">${p}</p>`).join("")}
    `
}

// 2. Inject Related Frameworks Panel
const frameworksContainer = document.getElementById("frameworks-panel")
if (frameworksData && frameworksData.items.length > 0) {
    let frameworksHtml = `
        <p class="overview-kicker">${frameworksData.kicker}</p>
        <h2 id="frameworks-title" class="overview-title">${frameworksData.title}</h2>
        <div class="frameworks-layout">
            <div class="frameworks-menu" id="frameworks-menu" role="tablist">
                ${frameworksData.items
                    .map(
                        (item, index) => `
                    <button class="framework-menu-item ${index === 0 ? "is-active" : ""}"
                            data-index="${index}"
                            role="tab"
                            aria-selected="${index === 0}">
                        ${item.title}
                    </button>
                `,
                    )
                    .join("")}
            </div>
            <div class="frameworks-content-panel" role="tabpanel">
                <h3 class="framework-detail-title" id="framework-detail-title">${frameworksData.items[0].title}</h3>
                <div class="framework-detail-text" id="framework-detail-text">
                    ${frameworksData.items[0].description}
                </div>
            </div>
        </div>
    `
    frameworksContainer.innerHTML = frameworksHtml

    const menuItems = frameworksContainer.querySelectorAll(".framework-menu-item")
    const detailTitle = document.getElementById("framework-detail-title")
    const detailText = document.getElementById("framework-detail-text")

    menuItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            menuItems.forEach((btn) => {
                btn.classList.remove("is-active")
                btn.setAttribute("aria-selected", "false")
            })

            const clickedBtn = e.target
            clickedBtn.classList.add("is-active")
            clickedBtn.setAttribute("aria-selected", "true")

            const index = clickedBtn.getAttribute("data-index")
            const selectedData = frameworksData.items[index]

            detailTitle.textContent = selectedData.title
            detailText.innerHTML = selectedData.description

            // Framework Mode Switcher
            let newFrameworkMode = "big5" // Default

            const frameworkMap = {
                "Cybernetic Big Five Theory": "cb5t",
                "BIS/BAS": "bisbas",
                HiTOP: "hitop",
                "Sensation Seeking": "sensation",
                "Primal World Beliefs": "primals",
                "Primal Emotional Systems": "panksepp",
                "Attachment Theory": "attachment",
                "Constructed Emotion": "emotion",
                Existentialism: "existential",
            }

            // This single line replaces the entire if/else block
            newFrameworkMode = frameworkMap[selectedData.title] || "big5"

            if (newFrameworkMode !== currentFrameworkMode) {
                currentFrameworkMode = newFrameworkMode
                renderRadar(currentFrameworkMode)
                updateSystem()
            }
        })
    })
}

// --- Data Preparation ---
const formatMu = (val) => {
    if (val <= 0) return "0"
    if (val >= 1) return "1"
    return val.toFixed(2).replace(/^0\./, ".")
}

const width = 960
const height = 750
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

const xPos = { 1: 100, 2: 330, 3: 560, 4: 800 }
const nodeFillByLevel = { 1: "#3b82f6", 2: "#8b5cf6", 3: "#10b981" }

const nodes = modelData.nodes.map((node) => ({
    ...node,
    val: node.value ?? 0.5,
    sigma: 0.15,
    variance: 0.15 * 0.15,
}))
const observables = modelData.observables.map((obs) => ({ ...obs, val: 0 }))

const edges = []
nodes.forEach((node) => {
    if (node.projectsTo) {
        node.projectsTo.forEach((proj) => {
            edges.push({
                source: node.id,
                target: proj.target,
                weight: proj.weight,
                transform: proj.transform || "direct",
            })
        })
    }
})

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

// --- Math & SVG Setup ---
const radarCx = xPos[4]
const radarCy = height / 2
const radarR = 95

const getAbsoluteRadarPoint = (angle, radius) => ({
    x: radarCx + Math.cos(angle) * radius,
    y: radarCy + Math.sin(angle) * radius,
})

// Calculate corners for all possible observables (cached for link routing)
const obsCorners = {}
observables.forEach((obs) => {
    obsCorners[obs.id] = getAbsoluteRadarPoint(obs.angle, radarR)
})

const svg = d3.select("#graph").append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height)

svg.on("click", () => {
    lockedNodeId = null
    setActiveNode(null)
})

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
        targetCoords = obsCorners[edge.target]
    } else {
        targetCoords = { x: radarCx, y: radarCy }
    }

    return linkGen({ source: sourceCoords, target: targetCoords })
}

// Axis Layer
const axisLayer = svg.append("g").attr("class", "axis-layer")

if (modelData.axes) {
    // Generalize to fetch ALL nodes that belong to an axis group, sorting them by level and order
    // to ensure the bounding box calculation connects the correct top and bottom nodes.
    const axisNodes = nodes.filter((n) => n.axisGroup).sort((a, b) => a.level - b.level || a.order - b.order)

    const axisGroups = d3.group(axisNodes, (n) => n.axisGroup)

    const axisBox = axisLayer
        .selectAll(".axis-box")
        .data(Array.from(axisGroups.entries()))
        .enter()
        .append("g")
        .attr("class", "axis-box")
        .style("cursor", "help")
        .on("mouseenter", function (event, d) {
            // Send Axis info to the right-hand details panel
            const axisData = modelData.axes[d[0]]
            document.getElementById("details-title").textContent = axisData.label + " Axis"
            document.getElementById("details-description").textContent = axisData.description
            document.getElementById("details-sliders").style.display = "none"

            // Intensify the box colors for visual feedback
            d3.select(this)
                .select("rect")
                .transition()
                .duration(150)
                .attr("fill", "rgba(16, 185, 129, 0.08)")
                .attr("stroke", "rgba(16, 185, 129, 0.8)")
        })
        .on("mouseleave", function (event, d) {
            // Revert the box colors
            d3.select(this)
                .select("rect")
                .transition()
                .duration(150)
                .attr("fill", "rgba(16, 185, 129, 0.03)")
                .attr("stroke", "rgba(16, 185, 129, 0.4)")

            // Restore the side panel to the currently focused/locked node
            const currentData = lockedNodeId
                ? nodesById.get(lockedNodeId) || obsById.get(lockedNodeId)
                : activeNodeId
                  ? nodesById.get(activeNodeId) || obsById.get(activeNodeId)
                  : null
            updateDetails(currentData)
        })

    // Draw the dashed bounding box
    axisBox
        .append("rect")
        .attr("x", (d) => d[1][0].x - 48) // Tightened the box back up
        .attr("y", (d) => d[1][0].y - 36)
        .attr("width", 96) // Standard width to wrap just the nodes
        .attr("height", (d) => d[1][d[1].length - 1].y - d[1][0].y + 72)
        .attr("fill", "rgba(16, 185, 129, 0.03)")
        .attr("stroke", "rgba(16, 185, 129, 0.4)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4")
        .attr("rx", 10)

    // Draw the Category Label vertically OUTSIDE on the left
    axisBox
        .append("text")
        .attr("transform", (d) => {
            const boxHeight = d[1][d[1].length - 1].y - d[1][0].y + 72
            const topY = d[1][0].y - 36
            const centerX = d[1][0].x - 64 // Pushed completely outside the left edge of the box
            const centerY = topY + boxHeight / 2
            return `translate(${centerX}, ${centerY}) rotate(-90)`
        })
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .style("font-weight", "600")
        .style("letter-spacing", "0.08em")
        .style("fill", "#0f766e")
        .text((d) => modelData.axes[d[0]].label)
}
// ──────────────────────────────────────────────────────────────────────────

// Global D3 Selections populated dynamically
let linkPaths, obsNodes, radarPoly, lollipops

// Render the standard cascade nodes (Levels 1-3)
const nodeGroups = svg
    .selectAll(".node:not(.obs-node)")
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

const areaGen = d3
    .area()
    .x((d) => d[0])
    .y0(15)
    .y1((d) => d[1])
    .curve(d3.curveBasis)

const drawDistribution = (node) => {
    const mu = -20 + node.val * 40
    const pxSigma = Math.max(2, node.sigma * 40)
    const amplitude = Math.min(42, 32 * (6 / pxSigma))

    const points = d3.range(-35, 36, 2).map((x) => {
        const y = Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(pxSigma, 2)))
        return [x, 15 - y * amplitude]
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
    .style("fill", "var(--muted)")
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style("pointer-events", "none")

modelData.levelHeaders.forEach((header) => {
    svg.append("text").attr("class", "axis-label").attr("x", xPos[header.level]).attr("y", 40).text(header.label)
})

// --- Dynamic Radar Container ---
const radarContainer = svg.append("g").attr("class", "radar-group").attr("transform", `translate(${radarCx}, ${radarCy})`)

function renderRadar(framework) {
    const activeObs = observables.filter((o) => o.framework === framework)
    const isTwoDimensional = activeObs.length <= 2

    // 1. Background Geometry
    const bgPoints = activeObs.map((o) => `${Math.cos(o.angle) * radarR},${Math.sin(o.angle) * radarR}`).join(" ")
    const bgHalfPoints = activeObs.map((o) => `${Math.cos(o.angle) * (radarR * 0.5)},${Math.sin(o.angle) * (radarR * 0.5)}`).join(" ")

    let bgOuter = radarContainer.selectAll(".bg-outer").data([activeObs])
    bgOuter
        .enter()
        .insert("polygon", ":first-child")
        .attr("class", "bg-outer")
        .attr("fill", "#f8fafc")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .merge(bgOuter)
        .attr("points", bgPoints)
        .style("opacity", isTwoDimensional ? 0 : 1) // Hide polygonal area if only 2 points

    let bgInner = radarContainer.selectAll(".bg-inner").data([activeObs])
    bgInner
        .enter()
        .insert("polygon", ".bg-outer + *")
        .attr("class", "bg-inner")
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4")
        .merge(bgInner)
        .attr("points", bgHalfPoints)
        .style("opacity", isTwoDimensional ? 0 : 1)

    // Base axis line for 2D mode
    let axisLines = radarContainer.selectAll(".axis-line").data(isTwoDimensional ? activeObs : [])
    axisLines
        .enter()
        .insert("line", ".radar-fill")
        .attr("class", "axis-line")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .merge(axisLines)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d) => Math.cos(d.angle) * radarR)
        .attr("y2", (d) => Math.sin(d.angle) * radarR)
    axisLines.exit().remove()

    // 2. Radar Fill Polygon
    let radarPolySel = radarContainer.selectAll(".radar-fill").data([activeObs])
    radarPoly = radarPolySel
        .enter()
        .append("polygon")
        .attr("class", "radar-fill")
        .attr("fill", "rgba(59, 130, 246, 0.15)")
        .attr("stroke", "none")
        .merge(radarPolySel)

    // 3. Lollipops
    lollipops = radarContainer.selectAll(".lollipop").data(activeObs, (d) => d.id)
    const lollipopsEnter = lollipops.enter().append("g").attr("class", "lollipop")
    lollipopsEnter
        .append("line")
        .attr("class", "lollipop-stem")
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", 2.5)
    lollipopsEnter
        .append("circle")
        .attr("class", "lollipop-head")
        .attr("r", 5)
        .attr("fill", (d) => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
    lollipops.exit().remove()
    lollipops = lollipopsEnter.merge(lollipops)

    // 4. Observable Nodes
    obsNodes = radarContainer.selectAll(".obs-node").data(activeObs, (d) => d.id)
    const obsEnter = obsNodes
        .enter()
        .append("g")
        .attr("class", "node obs-node")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            event.stopPropagation()
            lockedNodeId = lockedNodeId === d.id ? null : d.id
            setActiveNode(getLockedNodeData())
        })
        .on("mouseenter", (event, d) => {
            if (!isDragging) setActiveNode(d)
        })
        .on("mouseleave", () => {
            if (!isDragging) setActiveNode(getLockedNodeData())
        })

    obsEnter
        .append("circle")
        .attr("cx", (d) => Math.cos(d.angle) * radarR)
        .attr("cy", (d) => Math.sin(d.angle) * radarR)
        .attr("r", 25)
        .attr("fill", "transparent")

    obsEnter
        .append("circle")
        .attr("class", "corner-dot")
        .attr("cx", (d) => Math.cos(d.angle) * radarR)
        .attr("cy", (d) => Math.sin(d.angle) * radarR)
        .attr("r", 6)
        .attr("fill", "#f8fafc")
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", 2)
        .style("transition", "r 0.15s ease, fill 0.15s ease, stroke-width 0.15s ease")

    obsEnter
        .append("text")
        .attr("class", "node-label")
        .attr("x", (d) => Math.cos(d.angle) * (radarR + 42))
        .attr("y", (d) => Math.sin(d.angle) * (radarR + 42))
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text((d) => d.label)

    obsNodes.exit().remove()
    obsNodes = obsEnter.merge(obsNodes)

    // 5. Active Link Edges
    const activeLinkEdges = edges.filter((e) => {
        if (obsById.has(e.target)) {
            return obsById.get(e.target).framework === framework
        }
        return true
    })

    linkPaths = svg.selectAll(".link").data(activeLinkEdges, (d) => d.source + "-" + d.target)
    const linkEnter = linkPaths.enter().insert("path", ".node").attr("class", "link").attr("d", buildLinkPath)
    linkPaths.exit().remove()
    linkPaths = linkEnter.merge(linkPaths)

    // Clean up focus state if the locked node was hidden by framework swap
    if (lockedNodeId && !activeObs.find((o) => o.id === lockedNodeId) && !nodesById.has(lockedNodeId)) {
        lockedNodeId = null
        setActiveNode(null)
    }

    renderActiveState()
}

// --- Logic & Core Updates ---
const getSourceValue = (sourceId) => {
    if (nodesById.has(sourceId)) return nodesById.get(sourceId).val
    if (obsById.has(sourceId)) return obsById.get(sourceId).val
    return 0
}

const computeTargetState = (targetId) => {
    const incomingEdges = incomingEdgesByTarget.get(targetId) || []
    let sumWeightedMu = 0
    let sumEffectivePrecision = 0

    incomingEdges.forEach((edge) => {
        const sourceNode = nodesById.get(edge.source) || obsById.get(edge.source)
        const sourceVal = sourceNode ? sourceNode.val : 0

        // Retrieve variance, defaulting to 0.0225 (precision ~44) if undefined
        const sourceVar = sourceNode && sourceNode.variance !== undefined ? sourceNode.variance : 0.0225

        // In active inference, precision acts as the multiplier on the message
        const sourcePrecision = 1 / sourceVar

        // The effective weight is the structural weight modulated by the node's precision
        const effectiveWeight = edge.weight * sourcePrecision

        const edgeContribution = edge.transform === "inverse" ? 1 - sourceVal : sourceVal

        sumWeightedMu += edgeContribution * effectiveWeight
        sumEffectivePrecision += effectiveWeight
    })

    // Normalize by total precision to solve the path accumulation problem
    const finalVal = sumEffectivePrecision > 0 ? sumWeightedMu / sumEffectivePrecision : 0

    // The target's new variance is derived from the sum of incoming precisions
    const finalVariance = sumEffectivePrecision > 0 ? 1 / sumEffectivePrecision : 0.0225

    return {
        val: clamp(finalVal, 0, 1),
        variance: clamp(finalVariance, 0.001, 1),
    }
}

const updateDetails = (node) => {
    const detailsSliders = document.getElementById("details-sliders")
    const detailsTitle = document.getElementById("details-title")
    const detailsDescription = document.getElementById("details-description")

    if (!node) {
        detailsTitle.textContent = "Select or hover over a node"
        detailsDescription.textContent =
            "Click a node to lock it, or drag the Level 1 distributions left/right and up/down to change the cascade."
        detailsSliders.style.display = "none"
        return
    }

    detailsSliders.style.display = "flex"

    const labelMu = document.getElementById("label-mu")
    const sliderMuInput = document.getElementById("slider-mu")

    if (node.level === 4) {
        labelMu.textContent = "Trait Expression"
        document.getElementById("val-mu").textContent = `${Math.round(node.val * 100)}%`
        sliderMuInput.style.display = "none"
        document.getElementById("row-pi").style.display = "none"
    } else {
        labelMu.textContent = "Location (μ)"
        document.getElementById("val-mu").textContent = formatMu(node.val)
        sliderMuInput.style.display = "block"
        if (!isSliderDragging) sliderMuInput.value = node.val

        if (node.variance !== undefined) {
            document.getElementById("row-pi").style.display = "flex"
            const pi = Math.round(1 / node.variance)
            document.getElementById("val-pi").textContent = pi
            if (!isSliderDragging) document.getElementById("slider-pi").value = pi
        } else {
            document.getElementById("row-pi").style.display = "none"
        }
    }

    sliderMuInput.disabled = node.level !== 1
    document.getElementById("slider-pi").disabled = node.level !== 1

    detailsTitle.textContent = node.title || node.label
    detailsDescription.textContent = node.description
}

const renderActiveState = () => {
    nodeGroups.classed("is-active", (node) => node.id === activeNodeId)

    // Safety check as obsNodes might not be fully initialized on first pass
    if (obsNodes) {
        obsNodes.classed("is-active", (node) => node.id === activeNodeId)
        obsNodes
            .selectAll(".corner-dot")
            .attr("r", (node) => (node.id === activeNodeId ? 9 : 6))
            .attr("fill", (node) => (node.id === activeNodeId ? node.color : "#f8fafc"))
            .attr("stroke-width", (node) => (node.id === activeNodeId ? 3 : 2))
    }

    if (linkPaths) {
        linkPaths.classed("connected", (edge) => {
            if (!activeNodeId) return false
            return edge.source === activeNodeId || edge.target === activeNodeId
        })
    }
}

const setActiveNode = (node) => {
    activeNodeId = node ? node.id : null
    renderActiveState()
    updateDetails(node || null)
}

const getLockedNodeData = () => {
    return lockedNodeId ? nodesById.get(lockedNodeId) || obsById.get(lockedNodeId) : null
}

// --- Interaction Handlers ---
nodeGroups
    .on("click", (event, node) => {
        event.stopPropagation()
        lockedNodeId = lockedNodeId === node.id ? null : node.id
        setActiveNode(getLockedNodeData())
    })
    .on("mouseenter", (event, node) => {
        if (!isDragging) setActiveNode(node)
    })
    .on("mouseleave", () => {
        if (!isDragging) setActiveNode(getLockedNodeData())
    })

const sliderMu = document.getElementById("slider-mu")
const sliderPi = document.getElementById("slider-pi")

sliderMu.addEventListener("mousedown", () => (isSliderDragging = true))
sliderMu.addEventListener("mouseup", () => (isSliderDragging = false))
sliderMu.addEventListener("input", (e) => {
    if (!activeNodeId) return
    const node = nodesById.get(activeNodeId)
    if (node && node.level === 1) {
        node.val = parseFloat(e.target.value)
        document.getElementById("val-mu").textContent = formatMu(node.val)
        updateSystem()
    }
})

sliderPi.addEventListener("mousedown", () => (isSliderDragging = true))
sliderPi.addEventListener("mouseup", () => (isSliderDragging = false))
sliderPi.addEventListener("input", (e) => {
    if (!activeNodeId) return
    const node = nodesById.get(activeNodeId)
    if (node && node.level === 1) {
        const pi = parseFloat(e.target.value)
        node.variance = 1 / pi
        node.sigma = Math.sqrt(node.variance)
        document.getElementById("val-pi").textContent = pi
        updateSystem()
    }
})

function updateSystem() {
    nodes
        .filter((node) => node.level > 1)
        .sort((left, right) => left.level - right.level || left.order - right.order)
        .forEach((node) => {
            const state = computeTargetState(node.id)
            node.val = state.val
            node.variance = state.variance
            node.sigma = Math.sqrt(node.variance)
        })

    // Compute for ALL observables behind the scenes
    observables.forEach((obs) => {
        obs.val = computeTargetState(obs.id).val
    })

    nodeGroups.select(".node-dist").attr("d", (node) => drawDistribution(node))

    nodeGroups.select(".node-value").text((node) => {
        if (node.variance) {
            return `μ = ${formatMu(node.val)}, π = ${Math.round(1 / node.variance)}`
        }
        return `μ = ${formatMu(node.val)}`
    })

    if (linkPaths) {
        linkPaths
            .attr("stroke", (edge) => {
                const val = getSourceValue(edge.source)
                const edgeVal = edge.transform === "inverse" ? 1 - val : val
                return edgeVal > 0.5 ? "#64748b" : "#cbd5e1"
            })
            .attr("stroke-width", (edge) => {
                const val = getSourceValue(edge.source)
                const edgeVal = edge.transform === "inverse" ? 1 - val : val
                return 1 + edgeVal * 4
            })
    }

    // Only draw the visual elements for the CURRENT framework
    if (radarPoly) {
        radarPoly.attr(
            "points",
            observables
                .filter((o) => o.framework === currentFrameworkMode)
                .map((obs) => `${Math.cos(obs.angle) * radarR * obs.val},${Math.sin(obs.angle) * radarR * obs.val}`)
                .join(" "),
        )
    }

    if (lollipops) {
        lollipops
            .select(".lollipop-stem")
            .attr("x2", (d) => Math.cos(d.angle) * radarR * d.val)
            .attr("y2", (d) => Math.sin(d.angle) * radarR * d.val)

        lollipops
            .select(".lollipop-head")
            .attr("cx", (d) => Math.cos(d.angle) * radarR * d.val)
            .attr("cy", (d) => Math.sin(d.angle) * radarR * d.val)
    }

    if (activeNodeId) {
        const activeData = nodesById.get(activeNodeId) || obsById.get(activeNodeId)
        updateDetails(activeData)
    }
}

const dragHandler = d3
    .drag()
    .on("start", (_, node) => {
        isDragging = true
        if (node.level === 1) setActiveNode(node)
    })
    .on("drag", function (event, node) {
        if (node.level !== 1) return

        node.val = clamp(node.val + event.dx * 0.01, 0, 1)
        node.sigma = clamp(node.sigma + event.dy * 0.002, 0.05, 0.4)
        node.variance = node.sigma * node.sigma

        updateSystem()
    })
    .on("end", () => {
        isDragging = false
        setActiveNode(getLockedNodeData())
    })

nodeGroups.filter((node) => node.level === 1).call(dragHandler)

// Initialize
renderRadar(currentFrameworkMode)
updateDetails(null)
updateSystem()
