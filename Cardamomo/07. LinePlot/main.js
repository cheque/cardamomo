
import { initViewport, drawLinePlot, drawXAxisFromArray, drawYAxisFromArray, loadCSV } from '../cardamomo.js';

document.addEventListener('DOMContentLoaded', async () => {

  //Init ViewPort
  const canvasId = 'miCanvas';
  const width = 1500;
  const height = 900;
  const context = initViewport(canvasId, width, height);

  //Carga de datos desde CSV
  const filePath  = "/data/pesoEstatura.csv";
  const data = await loadCSV(filePath);

  //Parametros para la gráfica
  const canvas = document.getElementById("miCanvas");
  const xColumnName = "estatura";
  const yColumnName = "peso";
  let infoColumnNames = [xColumnName, yColumnName, "edad"]
  const color = "darkcyan";
  const canvasPadding = 50;


  drawLinePlot(canvas, context, filePath, xColumnName,yColumnName, infoColumnNames, color, canvasPadding);

  //Parametros para el eje X
  let xValues = data.map(row => row[xColumnName]);
  const xPos = 0;
  const yPos = 0;
  const labelSpace = 20;
  const color2 = "black";
  drawXAxisFromArray(context, xValues , xPos, yPos, color2, labelSpace,canvasPadding);

  //Parametros para dibujar eje Y
  let yValues = data.map(row => row[yColumnName]);
  const yPosition = 0;
  const XPosition = 0;
  const labelSpace2 = -10;
  
  // Llamar a la función para dibujar el eje Y
  drawYAxisFromArray(context, yValues, XPosition, yPosition, color2, labelSpace2,canvasPadding);

});
