    function drawGraph(config = {}, items) {

        // Default values
        let configType = 'line';
        let configRange = 'percentage';
        let configSteps = 5;
        let configPadding = 10;
        let configFontSize = 10;
        let configFontFamily = "Arial";
        let configShowLabel = false;
        let configElementId = "myCanvas";

        // Overriding default values
        if ('type' in config) {
            configType = config["type"];
        }
        if ('range' in config) {
            configRange = config["range"];
        }
        if ('steps' in config) {
            configSteps = config["steps"];
        }
        if ('padding' in config) {
            configPadding = config["padding"];
        }
        if ('fontSize' in config) {
            configFontSize = config["fontSize"];
        }
        if ('fontFamily' in config) {
            configFontFamily = config["fontFamily"];
        }
        if ('showLabel' in config) {
            configShowLabel = config["showLabel"];
        }
        if ('elementId' in config) {
            configElementId = config["elementId"];
        }

        // Get the size of the canvas
        let c = document.getElementById(configElementId);
        let canvasWidth = c.width;
        let canvasHeight = c.height;
        
        let ctx = c.getContext("2d");
        ctx.font = configFontSize + "px " + configFontFamily;

        let metrics = ctx.measureText("100%");
        let labelMaxWidth = metrics.width;
        let labelHight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        let lebeledArea = 0;

        if (configShowLabel == true) {
            lebeledArea = (items.length * labelHight) + configPadding;
            console.log(lebeledArea);
        }

        // Calculating lines and percentages
        let drawingAreaHeight = (canvasHeight - (configPadding * 2)) - lebeledArea;

        let stepHeight = drawingAreaHeight / (configSteps - 1);

        let stepPercentage = 100 / (configSteps - 1);

        // Draw steps
        for (let i = 0; i < configSteps; i++) {
            let ypos = configPadding+(i * stepHeight);
            let label = Math.round(100 - (i * stepPercentage))+"%";

            ctx.fillText(label, (configPadding / 2), ypos); // +(labelHight / 2) - messes up Ladybird/Browser

            ctx.strokeStyle = '#d3d3d3';
            ctx.beginPath();
            ctx.moveTo(configPadding + labelMaxWidth, ypos);
            ctx.lineTo(canvasWidth-configPadding, ypos);
            ctx.stroke();
        }

        // Get item with most datapoints
        let itemsDataLength = [];
        for (let i = 0; i < items.length; i++) {
            itemsDataLength.push(items[i].data.length);
        }
        let itemsDataLengthMax = Math.max(...itemsDataLength);

        // Make calculations for drawing lines
        let paddinLeftDrawingArea = configPadding + labelMaxWidth;
        let drawingAreaWidth = canvasWidth - (paddinLeftDrawingArea + configPadding);
        let chartPointWidth = drawingAreaWidth / (itemsDataLengthMax - 1);

        // Draw line
        for (let i = 0; i < items.length; i++) {
            ctx.strokeStyle = items[i].config.color;

            let first = true;

            ctx.beginPath();

            /* Ladybird/Browser does not support setLineDash
            ctx.setLineDash([]);

            if ('style' in items[i].config) {
                if (items[i].config.style == "dotted") {
                    ctx.setLineDash([1,1]);
                }
                if (items[i].config.style == "dashed") {
                    ctx.setLineDash([3,3]);
                }
            }
            */

            for (let i2 = 0; i2 < items[i].data.length; i2++) {

                if (items[i].data[i2] == null) {
                    continue;
                }
                if (first) {
                    ctx.moveTo(paddinLeftDrawingArea + (i2*chartPointWidth), configPadding + (drawingAreaHeight - ((items[i].data[i2] / 100) * drawingAreaHeight)));
                    first = false;
                } else {
                    ctx.lineTo(paddinLeftDrawingArea + (i2*chartPointWidth), configPadding + (drawingAreaHeight - ((items[i].data[i2] / 100) * drawingAreaHeight)));
                }
            }
            ctx.stroke();
        }

        // Draw labeled area
        if (configShowLabel == true) {
            for (let i = 0; i < items.length; i++) {
                ctx.fillStyle = items[i].config.color;
                ctx.fillText("■", configPadding + labelMaxWidth, (configPadding * 2.5) + drawingAreaHeight + (i*(labelHight * 1.1)));
                ctx.fillStyle = '#000000';
                ctx.fillText(items[i].config.label, configPadding + labelMaxWidth+15, (configPadding * 2.5) + drawingAreaHeight + (i*(labelHight * 1.1)));
            }
        }

    }
