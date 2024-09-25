# Cardamomo

### Julio 2024.
### Autor: Luis Alberto García Aguilar.
### Supervisor del proyecto: José Ezequiel Soto Sánchez.

En el universo de la información, la visualización de datos es la llave maestra que desvela patrones y conexiones en un mar de números y datos, como el cardamomo, transforma lo mundano en algo extraordinario, permitiendo que lo invisible se vuelva visible y lo complejo, comprensible. Cada gráfico, cada diagrama, es una ventana a un nuevo entendimiento, un mapa que nos guía visualmente para llegar al conocimiento a través de territorios sinuosos y complejos.

Este desarrollo presenta una biblioteca de visualización de datos en JavaScript orientada a apoyar el entendimiento y la presentación de datos en contextos educativos y profesionales. El proyecto surgió de la necesidad de ofrecer un recurso de apoyo fundamental para la materia de Visualización de Datos Avanzada, impartida por el profesor José Ezequiel Soto Sánchez en el Instituto Tecnológico Autónomo de México, ITAM. Esta materia, siendo un componente esencial de la Maestría en Ciencia de Datos, busca proporcionar a los estudiantes y profesionistas un entendimiento accesible e intuitivo de las técnicas y herramientas necesarias para presentar datos de manera efectiva y atractiva. La intención principal de la biblioteca es actuar como un puente entre la teoría y la práctica, facilitando el aprendizaje de conceptos relacionados con la presentación, diseño y programación de visualizaciones de datos.

Para este desarrollo, se utilizaron tecnologías enfocadas en la programación y programación web como HTML5, CSS y JavaScript, se diseñó una biblioteca que no solo es técnicamente sólida, sino que también considera la experiencia del usuario y la escalabilidad de la misma. La herramienta fomenta que los usuarios puedan diseñar, desarrollar y personalizar sus propios gráficos, adaptándolos a sus necesidades particulares.

En este repositorio encontrarás:

**1. Librería VDA:** Archivo `vda.js` el cual contiene los siguientes métodos para visualización de datos:
  * **drawViewPort** - Método para iniciar el viewPort del canvas.
  * **drawXAxis** - Método para graficar un eje horizontal con base en los parámetros inicio, fin y tamaño de paso.
  * **drawYAxis** - Método para graficar un eje vertical con base en los parámetros inicio, fin y tamaño de paso.
  * **drawXAxisFromArray** - Método para graficar un eje horizontal con base en un arreglo de números.
  * **drawYAxisFromArray** - Método para graficar un eje vertical con base en un arreglo de números.
  * **drawDotPlot** - Método para dibujar una gráfica de puntos con base en un archivo de datos csv.
  * **drawLinePlot** - Método para dibujar una gráfica de puntos unidos por líneas rectas con base en un archivo de datos csv.
  * **drawBarPlot** - Método para dibujar una gráfica de barras con base en un archivo de datos csv.
  * **drawBubblePlot** - Método para dibujar una gráfica de burbujas con base en un archivo de datos csv.
  * **drawMapDotPlot** - Método para dibujar un mapa, y localizar puntos sobre él, con base en un archivo de datos csv.
  * **drawMapBubblePlot** - Método para dibujar un mapa, y localizar burbujas sobre él, con base en un archivo de datos csv.
  * **drawHeatMap** - Método para dibujar un mapa, y colorear regiones usando degradados, con base en un archivo de datos csv.

**2. Casos de uso:** Carpetas de datos enumeradas que contienen ejemplos de uso para cada método. Cada carpeta contiene un archivo de estilos CSS, un archivo HTML y un archivo de código JavaScript.

**3. Datos:** Carpeta de datos utilizados en los diferentes casos de uso.

**4. Guía de usuario:** Documento PDF que contiene información útil para la configuración y manejo de la librería. También encontrarás la documentación de cada uno de los casos de uso, la cual pretende servir como manual de uso para el usuario.

### Contacto: aguilaral24gmail.com
