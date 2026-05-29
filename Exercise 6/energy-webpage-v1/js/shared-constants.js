// Chart Workspace Sizing Bounds
const margin = { top: 30, right: 30, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Color Scheme Matrix Mapping for Histogram
const barColor = "#4682b4";
const hoverBarColor = "#2a52be";

// Scales for Histogram Visuals
const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

// Separate Scales and Dimensions for Scatterplot (Step 1.4)
const xScaleS = d3.scaleLinear().range([0, width]);
const yScaleS = d3.scaleLinear().range([height, 0]);
const colorScale = d3.scaleOrdinal();

// Tooltip Dimensions Constants (Step 1.4)
const tooltipWidth = 130;
const tooltipHeight = 40;

// Global placeholder variable for scatter plot inner chart group context
let innerChartS;

// Bin Generator mapped to the energyConsumption metric
const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(20); 

// Tech-only Filter Configurations Matrix Array 
const filters_screen = [
    { id: "all", label: "All Technologies", isActive: true },
    { id: "led", label: "LED", isActive: false },
    { id: "oled", label: "OLED", isActive: false },
    { id: "lcd", label: "LCD", isActive: false }
];