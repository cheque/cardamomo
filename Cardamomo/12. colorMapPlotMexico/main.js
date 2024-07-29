
import { initViewport, drawHeatMap } from '../cardamomo.js';

document.addEventListener('DOMContentLoaded', async () => {

  //Init ViewPort
  const canvasId = 'miCanvas';
  const width = 1500;
  const height = 900;
  const context = initViewport(canvasId, width, height);

  //Obtención de polígonos para dibujar
  const canvasPadding = 50;
  const mapDataFile = "/data/states.geojson"

  // Parámetros para el heatMap
  const canvas = document.getElementById(canvasId);
  const csvFilePath = '/data/colorMap_Mexico.csv';
  const variableName = 'urbanizacion'; // Nombre de la columna en el CSV
  //const variableName = 'poblacion'; // Nombre de la columna en el CSV
  //const variableName = 'temperatura'; // Nombre de la columna en el CSV
  const stateNameProperty = "state_name" //nombre de la propiedad en el archivo geojson
  const linkNameProperty = "nombre" //nombre de la columna con la que se comparará el stateNameProperty 
  let infoColumnNames = ["nombre", "temperatura", "poblacion", "urbanizacion"];

  drawHeatMap(canvas, canvasPadding, mapDataFile, csvFilePath, variableName, "purple", stateNameProperty, linkNameProperty, infoColumnNames);

});
