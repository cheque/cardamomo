
import { initViewport, drawBarPlot, drawXAxisFromArray, drawYAxisFromArray, loadCSV } from '../cardamomo.js';

document.addEventListener('DOMContentLoaded', async () => {

  //Init ViewPort
  const canvasId = 'miCanvas';
  const width = 1500;
  const height = 900;
  const context = initViewport(canvasId, width, height);

  //Carga de datos desde CSV
  const filePath  = "/data/perros.csv";
  const data = await loadCSV(filePath);

  //Parametros para la gráfica
  const canvas = document.getElementById("miCanvas");
  const xColumnName = "raza"
  const canvasPadding = 50;

  drawBarPlot(canvas, context, filePath, xColumnName, canvasPadding);

});
