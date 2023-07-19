export const exportCsv = (chartData) => {
  // Obtener los datos de la respuesta de la API
  const data = chartData.included;

  // Crear el contenido del CSV
  let csvContent = "";

  // Agregar el título
  csvContent += `${chartData.data.attributes.title}\n\n`;

  // Recorrer los datos y agregarlos al CSV
  data.forEach((item) => {
    // Agregar el título de la serie
    csvContent += `${item.attributes.title}\n`;

    // Agregar los encabezados de columna
    csvContent += "Fecha,Valor,Porcentaje\n";

    // Agregar las filas de datos
    item.attributes.values.forEach((value) => {
      csvContent += `${value.datetime},${value.value},${value.percentage}\n`;
    });

    // Agregar una línea en blanco después de cada serie
    csvContent += "\n";
  });

  // Generar el archivo CSV
  const csvData = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const csvUrl = URL.createObjectURL(csvData);

  // Descargar el archivo CSV
  const downloadLink = document.createElement("a");
  downloadLink.href = csvUrl;
  downloadLink.download = "chart_data.csv";
  downloadLink.click();
};
