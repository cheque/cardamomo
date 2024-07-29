
import { initViewport, drawMapBubblePlot } from '../cardamomo.js';

document.addEventListener('DOMContentLoaded', async () => {

  //Init ViewPort
  const canvasId = 'miCanvas';
  const width = 1500;
  const height = 900;
  const context = initViewport(canvasId, width, height);

  const canvas = document.getElementById(canvasId);
  const canvasPadding = 50;
  const mapDataFile = "/data/states.geojson"

  //Carga de datos desde CSV
  const csvFilePath  = "/data/bubbles_mapa.csv";

  //Parametros para la gráfica
  const longitudeColumnName = "longitud"
  const latitudeColumnName = "latitud";
  const sizeColumnName = "poblacion";
  const minSizeBubble = 2;
  const maxSizeBubble = 50;
  let infoColumnNames = [longitudeColumnName, latitudeColumnName, "name" , "poblacion"]
  const color = "darkcyan"

  drawMapBubblePlot(canvas, context, mapDataFile, csvFilePath, longitudeColumnName, latitudeColumnName, sizeColumnName,minSizeBubble, maxSizeBubble, infoColumnNames, color, canvasPadding)

  //drawDotPlot(canvas, context, filePath, xColumnName,yColumnName, infoColumnNames, color, canvasPadding);


});
