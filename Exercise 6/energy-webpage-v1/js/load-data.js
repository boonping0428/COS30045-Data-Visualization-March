let globalTVData = [];

// Initialize local CSV flat-database pipeline file retrieval streaming network process
d3.csv("data/Ex6_TVdata.csv").then(data => {
    
    data.forEach(d => {
        // Map directly into the clean heading properties
        d.energyConsumption = +d.energyConsumption; 
        d.star = +d.star;                         
        d.screenSize = +d.screenSize;
        
        const rawTech = (d.screenTech || "").trim();
        if (/oled/i.test(rawTech)) {
            d.screenTech = "OLED";
        } else if (/led/i.test(rawTech)) {
            d.screenTech = "LED";
        } else if (/lcd/i.test(rawTech)) {
            d.screenTech = "LCD";
        } else {
            d.screenTech = rawTech || "Unknown";
        }
    });

    // Strip unparsed records
    globalTVData = data.filter(d => !isNaN(d.energyConsumption) && !isNaN(d.star));
    console.log("Database arrays loaded cleanly. Total records:", globalTVData.length);

    // Bootstrap initial workspace views
    drawHistogram(globalTVData);
    populateFilters(globalTVData);
    
    // Trigger Scatterplot rendering (Step 1.3)
    drawScatterplot(globalTVData);
    
    // Initialize Tooltip components and handlers (Step 3)
    createTooltip();
    HandleMouseEvents();
}).catch(error => {
    console.error("Fatal data pipeline loading failure:", error);
});