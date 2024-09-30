/*
  * Junio 2024
  * Autor: García Aguilar Luis Alberto
*/

/**
   * Inicializa el viewport en el canvas especificado.
   * @param {string} canvasId - El ID del elemento canvas.
   * @param {number} width - El ancho deseado para el canvas.
   * @param {number} height - La altura deseada para el canvas.
   * @returns {CanvasRenderingContext2D} - El contexto 2D del canvas configurado.
   */
export function initViewport(canvasId, width, height) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      throw new Error(`Canvas con ID "${canvasId}" no encontrado.`);
    }
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Configura el origen (0, 0) en la esquina inferior izquierda
    context.translate(0, height);
    context.scale(1, -1);

    return context;
}
  

/**
    * Dibuja eje X dado un step y un punto de inicio y fin en el canvas especificado y agrega números debajo de cada marca (tick).
    * @param {CanvasRenderingContext2D} context - Contexto del canvas.
    * @param {number} startX - Valor de inicio del rango del eje X.
    * @param {number} endX - Valor de fin del rango del eje X.
    * @param {number} xPos - Posición X inicial en el canvas.
    * @param {number} yPos - Posición Y en el canvas donde se dibujará la línea del eje X.
    * @param {number} step - Paso entre cada marca (tick) en el eje X.
    * @param {string} color - Color de la línea del eje y las marcas.
    * @param {string} labelSpace - Espacio entre labels y eje
    */
export function drawXAxis(context, startX, endX, xPos, yPos, step, color = 'black', labelSpace) {
    context.strokeStyle = color;
    context.fillStyle = color; 
    context.beginPath();
    context.moveTo(xPos, yPos);
    context.lineTo(endX + xPos, yPos);
    context.stroke();

    const xinit = xPos;
    for (let xPos = startX + xinit; xPos <= endX + xinit; xPos += step) {
        context.moveTo(xPos, yPos - 5);
        context.lineTo(xPos, yPos + 5);
        context.stroke();

        drawText(context,xPos-xinit,xPos-5,yPos-labelSpace, 10,"black",0)
    }
}


/**
    * Dibuja el eje Y en el canvas especificado y agrega números debajo de cada marca (tick).
    * @param {CanvasRenderingContext2D} context - Contexto del canvas.
    * @param {number} startY - Valor de inicio del rango del eje Y.
    * @param {number} endY - Valor de fin del rango del eje Y.
    * @param {number} xPos - Posición X inicial del eje Y en el canvas.
    * @param {number} yPos - Posición Y inician del eje Y en el canvas.
    * @param {number} step - Paso entre cada marca (tick) en el eje Y.
    * @param {string} color - Color de la línea del eje y marcas.
    * @param {string} labelSpace - Espacio entre labels y eje
    */
export function drawYAxis(context, startY, endY, xPos, yPos, step, color = 'black', labelSpace) {
  context.strokeStyle = color;
  context.fillStyle = color; // Para los números
  context.beginPath();
  context.moveTo(xPos, yPos);
  context.lineTo(xPos, endY +yPos);
  context.stroke();

  const yinit = yPos;
  for (let yPos = startY + yinit; yPos <= endY + yinit; yPos += step) {
    context.moveTo(xPos - 5, yPos);
    context.lineTo(xPos + 5, yPos);
    context.stroke();

    drawText(context,yPos-yinit,xPos-labelSpace,yPos, 10,"black",0)

  }
}


/**
 * Dibuja el eje X a partir de un array en el canvas especificado y agrega números debajo de cada marca (tick).
 * @param {CanvasRenderingContext2D} context - Contexto del canvas.
 * @param {Array[Object]} xValues - Array de datos 1xn
 * @param {number} xPos - Posición X inicial en el canvas.
 * @param {number} yPos - Posición Y en el canvas donde se dibujará la línea del eje X.
 * @param {string} color - Color de la línea del eje y las marcas.
 * @param {string} labelSpace - Espacio entre labels y eje
 * @param {number} canvasPadding - Padding del canvas  
 * @param {number} interval - -1: intervalo calculado en base al rango; >0: intervalo usando el valor indicado; 0: se ocupan todos los valores del arreglo
 */
export async function drawXAxisWithIntervals(context, xValues, xPos = 50, yPos = 50, xLabelTextAngle = 0, color = 'black', labelSpace = 20, canvasPadding = context.canvas.width * 0.02, interval = 0) {
  // Ajustar el ancho del canvas teniendo en cuenta x y el padding
  const canvasWidth = context.canvas.width - 2 * canvasPadding;

  let filteredXValues;

  if (interval === -1) {// Calcula intervalos de acuerdo al rango
      interval = calculateDynamicInterval(xValues); 
      filteredXValues = calculateValuesByInterval(interval,xValues);
  } else if (interval > 0) { // Realiza los intervalos de acuerdo al valor dado
      filteredXValues = calculateValuesByInterval(interval,xValues,canvasWidth);
  } else if (interval === 0) {// Se ocupan todos los valores del arreglo 
      filteredXValues = xValues;
  }

  // Mapear los valores de datos a posiciones en el canvas
  const xCanvasValues = filteredXValues.map(value => mapValue(value, canvasPadding, canvasWidth, xValues));

  const startX = Math.min(...xCanvasValues);
  const endX = Math.max(...xCanvasValues);

  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(xPos + canvasPadding, yPos + canvasPadding);
  context.lineTo(xPos + canvasPadding + (endX - startX), yPos + canvasPadding);
  context.stroke();

  filteredXValues.forEach((value) => {
      const tickX = xPos + canvasPadding + (mapValue(value, canvasPadding, canvasWidth, xValues) - startX);

      // Dibujar la marca (tick)
      context.moveTo(tickX, yPos + canvasPadding - 5);
      context.lineTo(tickX, yPos + canvasPadding + 5);
      context.stroke();

      // Dibujar el número debajo de la marca
      drawText(context, value, tickX - 5, yPos + labelSpace, 10, color, -xLabelTextAngle);
  });
}


/**
 * Dibuja el eje Y en el canvas especificado y agrega números debajo de cada marca (tick).
 * @param {CanvasRenderingContext2D} context - Contexto del canvas.
 * @param {Array[Object]} yValues - Arreglo de datos 1xn
 * @param {number} xPos - Posición X inicial en el canvas.
 * @param {number} yPos - Posición Y en el canvas donde se dibujará la línea del eje Y.
 * @param {string} color - Color de la línea del eje y las marcas.
 * @param {string} labelSpace - Espacio entre labels y el eje Y
 * @param {number} canvasPadding- Padding para el canvas
 * @param {number} interval - -1: intervalo calculado en base al rango; >0: intervalo usando el valor indicado; 0: se ocupan todos los valores del arreglo
 */
export async function drawYAxisWithIntervals(context, yValues, xPos = 50, yPos = 50, color = 'black', labelSpace = 20, canvasPadding = context.canvas.width * 0.02, interval = 0) {
  // Ajustar el ancho del canvas teniendo en cuenta y, y el padding
  const canvasHeight = context.canvas.height - 2 * canvasPadding;

  let filteredYValues;

  if (interval === -1) {// Calcula intervalos de acuerdo al rango
      interval = calculateDynamicInterval(yValues);  console.log(interval)
      filteredYValues = calculateValuesByInterval(interval,yValues);
  } else if (interval > 0) { // Realiza los intervalos de acuerdo al valor dado
      filteredYValues = calculateValuesByInterval(interval,yValues,canvasHeight);
  } else if (interval === 0) {// Se ocupan todos los valores del arreglo 
      filteredYValues = yValues;
  }
console.log(filteredYValues)
  // Mapear los valores de datos a posiciones en el canvas
  const yCanvasValues = filteredYValues.map(value => mapValue(value, canvasPadding, canvasHeight, yValues));

  const startY = Math.min(...yCanvasValues);
  const endY = Math.max(...yCanvasValues);

  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(xPos + canvasPadding, yPos + canvasPadding);
  context.lineTo(xPos + canvasPadding, yPos + canvasPadding + (endY - startY));
  context.stroke();

  filteredYValues.forEach((value) => {
      const tickY = yPos + canvasPadding + (mapValue(value, canvasPadding, canvasHeight, yValues) - startY);

      // Dibujar la marca (tick)
      context.moveTo(xPos + canvasPadding - 5, tickY);
      context.lineTo(xPos + canvasPadding + 5, tickY);
      context.stroke();

      // Dibujar el número debajo de la marca
      drawText(context, value, xPos - labelSpace, tickY, 10, color, 0);
  });
}


/**
 * @param {Canvas} canvas - Canvas
 * @param {CanvasRenderingContext2D} context - Contexto del Canvas
 * @param {String} csvFilePath - Ruta al archivo de datos
 * @param {String} xColumnName - Nombre de la columna de datos para el eje X
 * @param {String} yColumnName - Nombre de la columna de datos para el eje Y
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 * @param {String} color - Color de los puntos
 * @param {boolean} filledCircles - indicador para rellenar o no los puntos
 * @param {number} pointRadius - Radio de los puntos a dibujar
 * @param {number} canvasPadding - padding del canvas
 * @param {Object} axesProperties - Objeto que contiene las propiedades definidas para los ejes 
 */
export async function drawDotPlot(canvas, context, csvFilePath, xColumnName, yColumnName, infoColumNames, color="black",filledCircles=false, pointRadius=5, canvasPadding = context.canvas.width * 0.02, axesProperties) {

  // Carga y adecuación de datos
  const data = await loadCSV(csvFilePath);
  const sortedData = sortData(data, xColumnName);

  //Mapeamos los datos a sus equivalentes en canvas
  let dataWithCanvasValues = mapData2Canvas(context, sortedData, xColumnName, "xCanvas", "x", canvasPadding);
  dataWithCanvasValues = mapData2Canvas(context, dataWithCanvasValues, yColumnName, "yCanvas", "y", canvasPadding);

  drawPoints(context,dataWithCanvasValues,color,filledCircles, pointRadius);

  if(axesProperties && Object.keys(axesProperties).length > 0){
    let xValues = data.map(row => row[xColumnName]);
    drawXAxisWithIntervals(context, xValues , axesProperties.xPos, axesProperties.yPos, axesProperties.xLabelTextAngle, axesProperties.color, axesProperties.xLabelSpace,canvasPadding, axesProperties.xAxeType);

    let yValues = data.map(row => row[yColumnName]);
    drawYAxisWithIntervals(context, yValues , axesProperties.xPos, axesProperties.yPos, axesProperties.color, axesProperties.yLabelSpace,canvasPadding, axesProperties.yAxeType);
  }
  

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, infoColumNames, "dot", canvasPadding);
  });
}


/**
 * @param {Canvas} - Canvas
 * @param {CanvasRenderingContext2D} context - Contexto del Canvas
 * @param {CSVFilePath} csvFilePath - Ruta al archivo de datos
 * @param {xColumnName} xColumnName - Nombre de la columna de datos para el eje X
 * @param {yColumnName} yColumnName - Nombre de la columna de datos para el eje Y
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 * @param {String} color - Color de la línea
 * @param {boolean} filledCircles - indicador para rellenar o no los puntos
 * @param {number} pointRadius - Radio de los puntos a dibujar
 * @param {number} lineWidth - ancho de la linea
 * @param {number} canvasPadding - padding del canvas
 * @param {Object} axesProperties - Objeto que contiene las propiedades definidas para los ejes 
 */
export async function drawLinePlot(canvas, context, csvFilePath, xColumnName, yColumnName, infoColumNames, color, filledCircles=false, pointRadius=5 , lineWidth, canvasPadding = context.canvas.width * 0.02, axesProperties) {
   
  if (!context) {
    throw new Error("El contexto no está inicializado.");
  }
  
  // Carga y adecuación de datos
  const data = await loadCSV(csvFilePath);
  const sortedData = sortData(data, xColumnName);
  let dataWithCanvasValues = mapData2Canvas(context, sortedData, xColumnName, "xCanvas", "x", canvasPadding);
  dataWithCanvasValues = mapData2Canvas(context, dataWithCanvasValues, yColumnName, "yCanvas", "y", canvasPadding);

  drawPoints(context,dataWithCanvasValues,color,filledCircles,pointRadius);

  context.strokeStyle = color;
  context.beginPath();
  context.lineWidth = lineWidth; // Grosor de linea

  // Mover al primer punto de datos
  context.moveTo(dataWithCanvasValues[0].xCanvas, dataWithCanvasValues[0].yCanvas);

  // Dibujar líneas a través de los puntos de datos
  for (let i = 1; i < dataWithCanvasValues.length; i++) {
    context.lineTo(dataWithCanvasValues[i].xCanvas, dataWithCanvasValues[i].yCanvas);
    context.moveTo(dataWithCanvasValues[i].xCanvas, dataWithCanvasValues[i].yCanvas); // Volver a mover a la última coordenada para continuar la línea
  }

  context.stroke();

  if(axesProperties && Object.keys(axesProperties).length > 0){
    let xValues = data.map(row => row[xColumnName]);
    drawXAxisWithIntervals(context, xValues , axesProperties.xPos, axesProperties.yPos, axesProperties.xLabelTextAngle, axesProperties.color, axesProperties.xLabelSpace,canvasPadding, axesProperties.xAxeType);

    let yValues = data.map(row => row[yColumnName]);
    drawYAxisWithIntervals(context, yValues , axesProperties.xPos, axesProperties.yPos, axesProperties.color, axesProperties.yLabelSpace,canvasPadding, axesProperties.yAxeType);
  }

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, infoColumNames, "line", canvasPadding);
  });
}


/**
 * 
 * @param {Canvas} canvas - Canvas
 * @param {CanvasRenderingContext2D} context  - Contexto del canvas
 * @param {String} csvFilePath - Ruta al archivo de datos
 * @param {String} xColumnName - columnas de categorías
 * @param {number} canvasPadding - padding del canvas
 */
//Función para dibujar una gráfica de barra
export async function drawBarPlot(canvas, context, csvFilePath, xColumnName, canvasPadding = context.canvas.width * 0.02) {

  // Carga y adecuación de datos
  const data = await loadCSV(csvFilePath);

  // Calcular los conteos para cada categoría en xColumnName
  const counts = data.reduce((acc, row) => {
    acc[row[xColumnName]] = (acc[row[xColumnName]] || 0) + 1;
    return acc;
  }, {});

  // Convertir los datos a un formato adecuado para dibujar
  const mappedData = Object.entries(counts).map(([key, value]) => ({ [xColumnName]: key, count: value }));
  const dataWithCanvasValues = mapData2Canvas(context, mappedData, "count","yCanvas","y", canvasPadding);

  const barWidth = (context.canvas.width - 2 * canvasPadding) / dataWithCanvasValues.length;

  dataWithCanvasValues.forEach((point, index) => {
    const x = canvasPadding + index * barWidth;
    const y = canvasPadding;
    const color = getRandomPastelColor();
    context.fillStyle = color;

    context.beginPath();
    context.rect(x, y, barWidth, point.yCanvas);
    context.fill();

    // Dibujar el nombre de la categoría
    context.textAlign = "center";
    drawText(context,point[xColumnName], x + barWidth / 2, canvasPadding/2, 12, "black",0)
  });

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, [xColumnName, 'count'], "bar", canvasPadding);
  });
}


/**
 * @param {Canvas} - Canvas
 * @param {CanvasRenderingContext2D} context - Contexto del Canvas
 * @param {CSVFilePath} csvFilePath - Ruta al archivo de datos
 * @param {xColumnName} xColumnName - Nombre de la columna de datos para el eje X
 * @param {yColumnName} yColumnName - Nombre de la columna de datos para el eje Y
 * @param {String} sizeColumnName  - Nombre de la columna de datos para representar el tamaño de las burbujas
 * @param {number} minSize - tamaño mínimo de burbuja
 * @param {number} maxSize - tamaño máximo de burbuja
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 * @param {String} color - Color de la línea
 * @param {number} canvasPadding - padding del canvas
 * @param {Object} axesProperties - Objeto que contiene las propiedades definidas para los ejes 
 */
export async function drawBubblePlot(canvas, context, csvFilePath, xColumnName, yColumnName, sizeColumnName, minSize, maxSize, infoColumNames, color="black", canvasPadding = context.canvas.width * 0.02, axesProperties) {
  
  // Carga y adecuación de datos
  let data = await loadCSV(csvFilePath);
  data = sortData(data,sizeColumnName);

  // Mapear datos a valores de canvas
  const dataWithCanvasValues = data.map(row => ({
    ...row,
    xCanvas: mapValue(row[xColumnName], canvasPadding, context.canvas.width - 2 * canvasPadding, data.map(d => d[xColumnName])),
    yCanvas: mapValue(row[yColumnName], canvasPadding, context.canvas.height - 2 * canvasPadding, data.map(d => d[yColumnName])),
    sizeCanvas: mapValue(row[sizeColumnName], minSize, maxSize, data.map(d => d[sizeColumnName])) 
  }));

  //Dibujamos las burbujas
  drawBubbles(context,dataWithCanvasValues,color);

  if(axesProperties && Object.keys(axesProperties).length > 0){
    let xValues = data.map(row => row[xColumnName]);
    drawXAxisWithIntervals(context, xValues , axesProperties.xPos, axesProperties.yPos, axesProperties.xLabelTextAngle, axesProperties.color, axesProperties.xLabelSpace,canvasPadding, axesProperties.xAxeType);

    let yValues = data.map(row => row[yColumnName]);
    drawYAxisWithIntervals(context, yValues , axesProperties.xPos, axesProperties.yPos, axesProperties.color, axesProperties.yLabelSpace,canvasPadding, axesProperties.yAxeType);
  }

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, infoColumNames, "bubble", canvasPadding);
  });
}


/**
 * @param {Canvas} canvas - Canvas
 * @param {CanvasRenderingContext2D} context - Contexto del Canvas
 * @param {String} mapDataFile - Ruta al archivo geoJson
 * @param {String} csvFilePath - Ruta al archivo de datos que contiene los puntos a dibujar
 * @param {String} xColumnName - Nombre de la columna de datos para el eje X
 * @param {String} yColumnName - Nombre de la columna de datos para el eje Y
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 * @param {String} color - Color de los puntos
 * @param {boolean} filledCircles - indica si los circulos deben ser rellenados o no
 * @param {pointRadius} - define el tamaño de los puntos
 * @param {number} canvasPadding - padding del canvas
 */
export async function drawMapDotPlot(canvas, context, mapDataFile, csvFilePath, xColumnName, yColumnName, infoColumNames, color="black", filledCircles, pointRadius, canvasPadding = context.canvas.width * 0.02) {

  // Carga y adecuación de puntos en el mapa
  const data = await loadCSV(csvFilePath);
  const sortedData = sortData(data, xColumnName);

  
  //Dibujamos mapa
  let bbox = await drawMap(canvas, canvasPadding, mapDataFile);

  //Agregamos a sortedData dos nuevos registros con los valores minimos y maximos en latitud y longitud del mapa para tener el marco completo de referencia
  const newRecords = [
    { [xColumnName]: bbox[0][0], [yColumnName]: bbox[0][1], isDummy: true },
    { [xColumnName]: bbox[1][0], [yColumnName]: bbox[1][1], isDummy: true }
  ];

  sortedData.push(...newRecords);
  
  //Mapeamos los valores a sus equivalentes en canvas con el marco de referencia completo (incluyendo el mapa)
  let dataWithCanvasValues = mapData2Canvas(context, sortedData, xColumnName, "xCanvas", "x", canvasPadding);
  dataWithCanvasValues = mapData2Canvas(context, dataWithCanvasValues, yColumnName, "yCanvas", "y", canvasPadding);

  //Una vez que se mapearon los puntos con el marco completo de referencia, eliminamos los puntos dummy para que no sean dibujados
  dataWithCanvasValues = dataWithCanvasValues.filter(record => !record.isDummy);

  //Dibujamos los puntos
  drawPoints(context,dataWithCanvasValues,color, filledCircles, pointRadius);

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, infoColumNames, "dot", canvasPadding);
  });
}

 
/**
 * @param {Canvas} canvas - Canvas
 * @param {CanvasRenderingContext2D} context - Contexto del Canvas
 * @param {String} mapDataFile - Ruta al archivo geoJson
 * @param {String} csvFilePath - Ruta al archivo de datos que contiene los puntos a dibujar
 * @param {String} xColumnName - Nombre de la columna de datos para el eje X
 * @param {String} yColumnName - Nombre de la columna de datos para el eje Y
 * @param {String} sizeColumnName - Nombre de la columna que indica el tamaño de las burbujas
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 * @param {String} color - Color de los puntos
 * @param {number} canvasPadding - padding del canvas
 */
export async function drawMapBubblePlot(canvas, context, mapDataFile, csvFilePath, xColumnName, yColumnName, sizeColumnName, minSize, maxSize, infoColumNames, color="black", canvasPadding = context.canvas.width * 0.02) {

  // Carga y adecuación de puntos en el mapa
  const data = await loadCSV(csvFilePath);
  const sortedData = sortData(data, sizeColumnName);

  
  //Dibujamos mapa
  let bbox = await drawMap(canvas, canvasPadding, mapDataFile);

  //Agregamos a sortedData dos nuevos registros con los valores minimos y maximos en latitud y longitud del mapa para tener el marco completo de referencia
  const newRecords = [
    { [xColumnName]: bbox[0][0], [yColumnName]: bbox[0][1], [sizeColumnName]:1000, isDummy: true },
    { [xColumnName]: bbox[1][0], [yColumnName]: bbox[1][1], [sizeColumnName]:1000,isDummy: true }
  ];

  sortedData.push(...newRecords);

  // Mapear datos a valores de canvas
  let dataWithCanvasValues = sortedData.map(row => ({
    ...row,
    xCanvas: mapValue(row[xColumnName], canvasPadding, context.canvas.width - 2 * canvasPadding, sortedData.map(d => d[xColumnName])),
    yCanvas: mapValue(row[yColumnName], canvasPadding, context.canvas.height - 2 * canvasPadding, sortedData.map(d => d[yColumnName])),
    sizeCanvas: mapValue(row[sizeColumnName], minSize, maxSize, sortedData.map(d => d[sizeColumnName])) 
  }));

  //Una vez que se mapearon los puntos con el marco completo de referencia, eliminamos los puntos dummy para que no sean dibujados
  dataWithCanvasValues = dataWithCanvasValues.filter(record => !record.isDummy);

  //Dibujamos los puntos
  drawBubbles(context,dataWithCanvasValues,color);

  // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHover(event, canvas, dataWithCanvasValues, infoColumNames, "dot", canvasPadding);
  });
}


/**
 * @param {Canvas} canvas - Canvas
 * @param {number} canvasPadding - padding del canvas
 * @param {String} mapDataFile - Ruta al archivo geoJson
 * @param {String} csvFilePath - Ruta al archivo de datos que contiene los puntos a dibujar
 * @param {String} variableName - Nombre de la columna de datos para determinar el degradado
 * @param {String} baseColor - Color base para el degradado
 * @param {String} stateNameProperty - Nombre de la propiedad que representa el identificador para cada región del mapa
 * @param {String} linkNameProperty - Nombre de la columna en el archivo csv que identifica cada región del mapa y cuyos valores deben coincidir con los valores en stateNameProperty
 * @param {Array[String]} infoColumNames - Arreglo que contiene el nombre de las columnas que serán presentadas en la información desplegada al hacer hover
 */
export async function drawHeatMap(canvas, canvasPadding, mapDataFile, csvFilePath, variableName,baseColor, stateNameProperty, linkNameProperty, infoColumNames) {
  const context = canvas.getContext('2d');
  const mapData = await d3.json(mapDataFile);
  const data = await loadCSV(csvFilePath);
  const coloredData = assignColors(data, variableName, baseColor);

  const bbox = calculateBoundingBox(mapData);  

  //context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

  // Dibujar polígonos del mapa
  mapData.features.forEach(feature => {
    const geometry = feature.geometry;
    let color = 'lightgrey'; // Color por defecto si no se encuentra el estado

    // Buscar el color asignado al estado
    const stateName = feature.properties[stateNameProperty];

    const stateData = coloredData.find(d => d[linkNameProperty] === stateName); 
    if (stateData) {
      color = stateData.color;
    }

    context.fillStyle = color;
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    if (geometry.type === 'Polygon') {
      dibujarPoligono(geometry.coordinates, bbox, canvas, context, canvasPadding);
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(multipolygon => {
        dibujarPoligono(multipolygon, bbox, canvas,context, canvasPadding);
      });
    }
  });

   // Evento de hover sobre el canvas
  canvas.addEventListener('mousemove', function(event) {
    handleHoverMap(event, canvas, mapData, coloredData, stateNameProperty,linkNameProperty, canvasPadding, bbox, infoColumNames);
  });

}




/******************************************************************************************************************************************************** */
/* Funciones auxiliares */
/******************************************************************************************************************************************************** */


/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} text - texto a dibujar
 * @param {number} x - posición en x del texto
 * @param {number} y - posición en y del texto
 * @param {number} size - tamaño del texto 
 * @param {String} color - color del texto 
 * @param {number} angle - ángulo de giro del texto
 */
export function drawText (ctx,text,x,y,size,color,angle) {
  // Save the canvas transform:
  let the_canvas = ctx.save();

  ctx.globalAlpha = 1;
  ctx.font = "bold " + size + "px Arial";
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  
  ctx.translate(x,y);
  ctx.scale(1,-1);
  ctx.rotate(angle * Math.PI / 180);
  ctx.beginPath();
  ctx.fillText(text , 0 , 0);
  ctx.fill();
  ctx.closePath();

  // Restore the canvas transform:
  ctx.restore(the_canvas);
  
  };

/**
 * 
 * @param {String} csvFilePath - ruta del archivo
 * @param {Array[Object]} Promise - Array de objetos donde cada fila es un objeto con los datos del csv
 */
// Función para cargar y parsear archivo CSV
export async function loadCSV(csvFilePath) {
  const response = await fetch(csvFilePath);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: function (results) {
              resolve(results.data);
          },
          error: function (error) {
              reject(error);
          }
      });
  });
}

/**
 * 
 * @param {number} value - valor a mapear 
 * @param {number} minCanvas - valor mínimo del canvas
 * @param {number} maxCanvas - valor máximo del canvas
 * @param {Array} data - Arreglo de valores 
 * @returns 
 */
// Función para mapear un valor de datos a una posición en el canvas
function mapValue(value, minCanvas, maxCanvas, data) {

  // Encontrar los valores mínimos y máximos de x y y
  const minData = Math.min(...data);
  const maxData = Math.max(...data);

  return ((value - minData) / (maxData - minData)) * (maxCanvas - minCanvas) + minCanvas;
}

/**
 * 
 * @param {Array[Object]} data - Arreglo de objetos (Matriz) 
 * @param {String} columnName - Nombre de la columna con la cual se hará el ordenamiento por default descendiente 
 * @returns {Array[Object]} - Arreglo de objetos ordenados (Matriz))
 */
//Función para ordenar un arreglo de objetos (datos) a partir de una columna
function sortData(data,columnName){

  // Ordenar los datos según los valores de columnName
  data.sort((a, b) => a[columnName] - b[columnName]);

  return data;
}

/**
 * 
 * @param {CanvasRenderingContext2D} context  - contexto dle canvas
 * @param {Array[Object]} data - arreglo de objetos con valores a mapear 
 * @param {String} xColumnName - nombre de la columna en eje X 
 * @param {String} yColumnName - nombre de la columna en eje Y 
 * @param {number} padding - canvas padding 
 * @returns {Array[Object]} - arreglo de datos que incluye las columnas xCanvas y yCanvas con los valores mapeados del canvas
 */
//Función para mapear los valores de un arreglo X,Y de objetos (matriz) a sus valores equivalentes en el canvas
function mapXYData2Canvas(context, data, xColumnName, padding) {
  
  const canvasWidth = context.canvas.width - 2 * padding;
  const canvasHeight = context.canvas.height - 2 * padding;

  const xValues = data.map(row => row[xColumnName]);
  const yValues = data.map(row => row[yColumnName]);

  const xCanvasValues = xValues.map(value => mapValue(value, padding, canvasWidth, xValues));
  const yCanvasValues = yValues.map(value => mapValue(value, padding, canvasHeight, yValues));

  return data.map((row, index) => ({
      ...row,
      xCanvas: xCanvasValues[index],
      yCanvas: yCanvasValues[index]   
  }));
}


/**
 * 
 * @param {CanvasRenderingContext2D} context  - contexto dle canvas
 * @param {Array[Object]} data - arreglo de objetos con valores a mapear 
 * @param {String} columnName - nombre de la columna ea mapear  
 * @param {String} newColumnName - nombre de la nueva columna con el mapeo
 * @param {String} type - Tipo de mapeo ("x" o "y")
 * @param {number} padding - canvas padding 
 * @returns {Array[Object]} - arreglo de datos que incluye la columna con los valores mapeados del canvas
 */
//Función para mapear los valores de un arreglo de objetos (matriz) a sus valores equivalentes en el canvas
function mapData2Canvas(context, data, columnName, newColumnName, type, padding) {

  let canvasValues;
  if(type=="x"){
    const canvasWidth = context.canvas.width - 2 * padding;
    const xValues = data.map(row => row[columnName]);
    canvasValues = xValues.map(value => mapValue(value, padding, canvasWidth, xValues));
  }
  else{
    const canvasHeight = context.canvas.height - 2 * padding;
    const yValues = data.map(row => row[columnName]);
    canvasValues = yValues.map(value => mapValue(value, padding, canvasHeight, yValues));
  }

  const newColumn = `${newColumnName}`;
  
  return data.map((row, index) => ({
      ...row,
      [newColumn]: canvasValues[index]
  }));
}


/**
 * 
 * @returns {String} - color aleatorio en RGB 
 */
//Funcion para generar un color aleatorio
function getRandomPastelColor() {
  const r = Math.floor((Math.random() * 127) + 127);
  const g = Math.floor((Math.random() * 127) + 127);
  const b = Math.floor((Math.random() * 127) + 127);
  return `rgb(${r}, ${g}, ${b})`;
}


/**
 * 
 * @param {CanvasRenderingContext2D} context  - Contexto
 * @param {Array[Object]} dataWithCanvasValues - Arreglo de puntos y sus metadatos
 * @param {String}} color . Color con el que se dibujarán los puntos
 */
//Función para dibujar puntos
export function drawPoints(context,dataWithCanvasValues,color,filledCircles = false,pointRadius = 5){

  context.strokeStyle = color;
  context.fillStyle = color;

  dataWithCanvasValues.forEach(point => {
    context.beginPath(); // Comenzar un nuevo camino para cada punto
    context.arc(point.xCanvas, point.yCanvas, pointRadius, 0, 2 * Math.PI);
    if(filledCircles){
      context.fill(); // Rellenar el círculo
    }
    context.stroke();
  });

}

//Función para calcular el intervalo dinamico de los ejes de acuerdo al rango de datos
/**
 * 
 * @param {Array[number]} data - arreglo de datos para el calculo del intervalo
 * @returns {number} - intervalo calculado
 */
function calculateDynamicInterval(data) {
  data.sort((a, b) => a - b);

  // Calcula el rango de datos
  const minValue = data[0];
  const maxValue = data[data.length - 1];
  const range = maxValue - minValue;

  // Determina el número de intervalos deseado (por ejemplo, 10-15 intervalos)
  const desiredIntervals = Math.max(5, Math.round(data.length / 10));

  // Calcula el intervalo inicial
  let interval = range / desiredIntervals;

  // Redondea el intervalo para hacer que sea más fácil de visualizar
  // Escoge la escala basada en el rango
  const logBase10 = Math.log10(interval);
  const exponent = Math.floor(logBase10);
  const fraction = logBase10 - exponent;
  const factor = fraction < 0.301 ? 1 : fraction < 0.699 ? 2 : 5;
  interval = factor * Math.pow(10, exponent);
  return interval;
}


//Función para calcular los valores de los ticks de los ejes dado un intervalo
/**
 * 
 * @param {number} interval - intervalo de los datos
 * @param {Array[number]} values - arreglo de valores de los datos
 * @returns {Array[number]} - Arreglo con los valores calculados mediante el intervalo
 */
function calculateValuesByInterval(interval, values){

  let filteredValues;

  // Encuentra el múltiplo inferior al mínimo y superior al máximo
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  // Encuentra el múltiplo inferior y superior
  const startValue = Math.round((Math.floor(minValue / interval) * interval) * 100) / 100;
  const endValue = Math.round((Math.ceil(maxValue / interval) * interval) * 100) / 100;

  filteredValues = [];
  for (let i = minValue; i <= maxValue+interval; i += interval) {
    if(i < maxValue){
      filteredValues.push(Math.round(i * 100) / 100);
    }
    else{
      filteredValues.push(Math.round(maxValue * 100) / 100);
      break;
    }
   
  }
  return filteredValues
}


/**
 * 
 * @param {*CanvasRenderingContext2D} context - Contexto
 * @param {Array[Object]} dataWithCanvasValues - Arrelo de objetos que contienen los puntos, tamaño y metadatos
 * @param {String} color - Color de las burbujas
 */
//Función para dibujar burbujas
export function drawBubbles(context, dataWithCanvasValues, color){

  dataWithCanvasValues.forEach(point => {
    context.fillStyle = color;

    context.beginPath();
    context.arc(point.xCanvas, point.yCanvas, point.sizeCanvas, 0, 2 * Math.PI);
    context.fill();
  });

}


/**
 * 
 * @param {EventListener} event - Evento del handle 
 * @param {Canvas} canvas - Canvas 
 * @param {Array[Object]} data - Arreglo X-Y de puntos 
 * @param {Array[String]} infoColumnNames  - Arreglo de nombres de columnas a mostrar en la información desplegada
 * @param {String} chartType - nombre del tipo de gráfico (dot,line,bar)
 * @param {number} canvasPadding - padding del canvas 
 */
//Función para manejar el evento hover sobre puntos 
function handleHover(event, canvas, data, infoColumnNames, chartType, canvasPadding = 0) {
  
  const infoOverlay = document.getElementById('infoOverlay');
  const rect = canvas.getBoundingClientRect();

  // Borrar contenido anterior
  infoOverlay.style.display = 'none';
  infoOverlay.innerHTML = '';

  data.forEach((point, i) => {
    
    let isInside = false;

    if (chartType === 'dot' || chartType === 'bubble' || chartType === 'line') {
     
      const mouseX = event.clientX - rect.left;
      const mouseY = rect.bottom - event.clientY ;
      const pointRadius = 5; // Radio de detección del punto

      const dist = Math.sqrt(Math.pow(mouseX - point.xCanvas, 2) + Math.pow(mouseY - point.yCanvas, 2));
      isInside = dist <= 5; // Radio de detección del punto

    } else if (chartType === 'bar') {
     
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;  
      const barWidth = (canvas.width - 2 * canvasPadding) / data.length;
      const x = canvasPadding + i * barWidth;
      const y = canvas.height - canvasPadding - point.yCanvas;
      isInside = mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= y + point.yCanvas;

    }

    if (isInside) {
      infoOverlay.style.display = 'block';
      infoOverlay.style.left = (event.clientX + 10) + 'px';
      infoOverlay.style.top = (event.clientY + 10) + 'px';

      // Ajuste para que la información no salga de la pantalla
      if (i > data.length / 2) {
        infoOverlay.style.left = (event.clientX - 180) + 'px';
      } else {
        infoOverlay.style.left = (event.clientX + 50) + 'px';
      }

      infoOverlay.innerHTML = infoColumnNames.map(columnName => {
        const value = point[columnName];
        return `${columnName} : ${typeof value === 'number' ? value.toFixed(3) : value}`;
      }).join('<br>');
    }
  });

}


/**
 * 
 * @param {Canvas} canvas - canvas
 * @param {number} canvasPadding - Padding del canvas 
 * @param {String} mapDataFile  -Ruta al archivo GeoJSON
 * @returns {Promise,Array[][]} - Promesa y Matriz de puntos calculada para determinar la BoundingBox
 */
// Cargamos el GeoJSON con D3
export function drawMap(canvas, canvasPadding, mapDataFile) {
  return new Promise((resolve, reject) => {
      d3.json(mapDataFile).then(data => {
        const bbox = calculateBoundingBox(data);
          dibujarPoligonos(data,bbox,canvas,canvasPadding);
          resolve(bbox);
      }).catch(function(error) {
          console.error('Error al cargar el archivo CSV:', error);
          reject(error);
      });
  });
}


/**
 * 
 * @param {Array[Object]} geojson - Objeto con los poligonos del archivo GeoJSON 
 * @returns {Array[][]} bbox -Array con el cálculo de puntos para la BoundingBox
 */
// Función para calcular el bounding box del GeoJSON
function calculateBoundingBox(geojson) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  geojson.features.forEach(feature => {
    const coordinates = feature.geometry.coordinates;
    if (feature.geometry.type === 'Polygon') {
      coordinates.forEach(ring => {
        ring.forEach(point => {
          const [x, y] = point;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        });
      });
    } else if (feature.geometry.type === 'MultiPolygon') {
      coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          ring.forEach(point => {
            const [x, y] = point;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          });
        });
      });
    }
  });
  return [[minX, minY], [maxX, maxY]];
}


/**
 * 
 * @param {Array[Object]} geojson - objeto con los poligonos del archivo GeoJSON 
 * @param {*} bbox - array con el cálculo de puntos para la BoundingBox
 * @param {*} canvas - canvas
 * @param {*} padding  - padding del canvas
 */
// Definimos la función para dibujar los polígonos
function dibujarPoligonos(geojson, bbox,canvas, padding) {

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "white";


  // Configuramos el estilo de trazo para que tenga el color deseado
  ctx.strokeStyle = 'black'; 
  ctx.lineWidth = 1; 

  // Dibujamos cada polígono
  geojson.features.forEach(feature => {
      const geometry = feature.geometry;
      if (geometry.type === 'Polygon') {
          dibujarPoligono(geometry.coordinates, bbox,canvas,ctx, padding);
      } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach(multipolygon => {
              dibujarPoligono(multipolygon, bbox,canvas,ctx, padding);
          });
      }
  });
}


/**
 * 
 * @param {Array[Object]} polygon - Polígono que representa una estructura geometríca 
 * @param {*} bbox - array con el cálculo de puntos para la BoundingBox
 * @param {*} canvas  - canvas
 * @param {*} ctx - contexto del canvas
 * @param {*} padding  - padding del canvas
 */
// Función para dibujar un polígono
function dibujarPoligono(polygon, bbox,canvas,ctx, padding) {
  polygon.forEach(ring => {
    ctx.beginPath();

      ring.forEach((point, index) => {
          const x = mapValue(point[0], padding, ctx.canvas.width - 2 * padding, [bbox[0][0], bbox[1][0]]);
          const y = mapValue(point[1],  padding , ctx.canvas.height - 2* padding, [bbox[0][1], bbox[1][1]]);
          if (index === 0) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }
      });
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  });
}


/**
 * 
 * @param {number} minValue - valor mínimo de los datos
 * @param {number} maxValue - valor máximo de los datos
 * @param {String} baseColor - color base para determinar el degradado
 * @returns 
 */
//Función para crear un degradado de color
function createColorScale(minValue, maxValue, baseColor) {
  return d3.scaleSequential(t => d3.interpolateRgb("white", baseColor)(t)).domain([0.95 * minValue, 0.95 * maxValue]);
}


/**
 * 
 * @param {Array[Object]} data - datos provenientes del archivo csv
 * @param {String} variableName - nombre de la columna a usar para determinar el degradado
 * @param {*} baseColor - color base para el degradado
 * @returns {Array[Object]} - datos provenientes del archivo csv con una columna extra que indica el valor asignado del degradao
 */
//Función para asignar un valor de degradado a cada dato
function assignColors(data, variableName,baseColor) {
  const values = data.map(d => parseFloat(d[variableName]));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const colorScale = createColorScale(minValue, maxValue,baseColor);

  return data.map(d => ({
    ...d,
    color: colorScale(parseFloat(d[variableName]))
  }));
}


/**
 * 
 * @param {Event} event - evento hover 
 * @param {Canvas} canvas - canvas
 * @param {Array[Object]} mapData - Objeto que contiene los polígonos que representas las estructuras geográficas
 * @param {Array[Object]} coloredData  - Objeto con la información del archivo csv
 * @param {String} stateNameProperty  - Nombre de la propiedad que representa el identificador para cada región del mapa.
 * @param {String} linkNameProperty - Nombre de la columna en el archivo csv que identifica cada región del mapa y cuyos valores deben coincidir con los valores en stateNameProperty.
 * @param {number} padding - padding del canvas
 * @param {Array[][]} bbox - BoundingBox Calculada
 * @param {Array[String]} infoColumnNames - Arreglo con el nombre de las columnas que se desplegarán como información al pasar el cursor sobre el gráfico.
 */
//Función para manejar la capa de información desplegada al pasar el cursor sobre el mapa de calor
function handleHoverMap(event, canvas, mapData, coloredData, stateNameProperty, linkNameProperty, padding, bbox, infoColumnNames) {
  const infoOverlay = document.getElementById('infoOverlay');
  const rect = canvas.getBoundingClientRect();
  const context = canvas.getContext('2d');

  infoOverlay.style.display = 'none';
  infoOverlay.innerHTML = '';

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  mapData.features.forEach(feature => {
    const geometry = feature.geometry;
    const stateName = feature.properties[stateNameProperty];
    const stateData = coloredData.find(d => d[linkNameProperty] === stateName);
    let isInside = false;

    context.beginPath();
    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach(ring => {
        ring.forEach((point, index) => {
          const x = mapValue(point[0], padding, context.canvas.width - 2 * padding, [bbox[0][0], bbox[1][0]]);
          const y = mapValue(point[1], padding, context.canvas.height - 2 * padding, [bbox[0][1], bbox[1][1]]);
          if (index === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        });
      });
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          ring.forEach((point, index) => {
            const x = mapValue(point[0], padding, context.canvas.width - 2 * padding, [bbox[0][0], bbox[1][0]]);
            const y = mapValue(point[1], padding, context.canvas.height - 2 * padding, [bbox[0][1], bbox[1][1]]);
            if (index === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
          });
        });
      });
    }
    context.closePath();
    
    if (context.isPointInPath(mouseX, mouseY)) {
      isInside = true;
    }

    if (isInside) {
      infoOverlay.style.display = 'block';
      infoOverlay.style.left = (event.clientX + 10) + 'px';
      infoOverlay.style.top = (event.clientY + 10) + 'px';

      // Ajuste para que la información no salga de la pantalla
      if (event.clientX > canvas.width / 2) {
        infoOverlay.style.left = (event.clientX - 180) + 'px';
      } else {
        infoOverlay.style.left = (event.clientX + 50) + 'px';
      }

      //infoOverlay.innerHTML = `${stateName}<br>${variableName}: ${stateData ? stateData[infoColumnNames[0]] : 'N/A'}`;

      infoOverlay.innerHTML = infoColumnNames.map(columnName => {     
        const value = stateData[columnName]; 
        return `${columnName} : ${typeof value === 'number' ? value.toFixed(3) : value}`;
      }).join('<br>');
    }
  });
}






