
import { initViewport, drawXAxisFromArray, loadCSV } from '../vda.js';

// Función principal para inicializar el canvas y dibujar el eje X
async function init() {
    
    //Init viewPort
    const canvasId = 'miCanvas';
    const width = 1550;
    const height = 950;
    const context = initViewport(canvasId, width, height);

    //Carga de datos desde CSV
    const data = await loadCSV("/data/xAxisData.csv");
    const xColumnName = "x"
    let xValues = data.map(row => row[xColumnName]);

    //Parametros para el eje X
    const xPos = 0;
    const yPos = 0;
    const color = "black";
    const labelSpace = 20;
    const canvasPadding = 50
    
    // Llamar a la función para dibujar el eje X
    drawXAxisFromArray(context, xValues , xPos, yPos, color, labelSpace,canvasPadding);
}

// Llama a la función principal para inicializar todo
init();
