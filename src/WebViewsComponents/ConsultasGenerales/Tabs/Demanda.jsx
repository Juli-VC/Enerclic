import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import { exportCsv } from "../../../_ExportCSV/exportCsv.js"
import demanda from "./demanda.scss"

// Importa las dependencias necesarias de Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Registra los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const Demanda = () => {
    //Estados para guardar datos.
    const [chartData, setChartData] = useState(null);
    const [responseData, setresponseData] = useState(null);

    const [isLoading, setIsLoading] = useState(true); // Estado para controlar el spinner/loading


    useEffect(() => {
        const fetchData = async () => {
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // Se agrega 1 porque los meses en JavaScript se cuentan desde 0
            const currentYear = today.getFullYear();
            const startDate = `${currentYear - 1}-${currentMonth}-01T00:00`; // Primer día del mismo mes, pero del año anterior
            const endDate = today.toISOString(); // Fecha actual en formato ISO 8601

            const url = `https://apidatos.ree.es/es/datos/demanda/ire-general?start_date=${startDate}&end_date=${endDate}&time_trunc=month&geo_limit=peninsular&geo_ids=8741`;

            // Realizar la solicitud a la API con la URL construida
            try {
                const response = await axios.get(url);
                const apiData = response.data;

                setIsLoading(true); // Mostrar spinner/loading cuando haga la petición

                // Verificar si los datos de respuesta son válidos
                if (
                    apiData &&
                    apiData.included &&
                    Array.isArray(apiData.included)
                ) {
                    const datasets = apiData.included.map((item) => ({
                        label: item.attributes.title,
                        data: item.attributes.values.map((value) => value.value),
                        borderColor: item.attributes.color,
                        backgroundColor: !item.type.includes('Variación') ? `${item.attributes.color}22` : item.attributes.color,
                        fill: !item.type.includes('Variación') ? "start" : false,
                        order: !item.type.includes('Variación') ? 2 : 1,
                        yAxisID: item.type.includes('Variación') ? 'y1' : 'y',
                        tension: item.type.includes('Variación') ? 0.3 : 0
                    }));

                    const labels = apiData.included[0].attributes.values.map(
                        (value) => value.datetime.split('T')[0]
                    );

                    const newChartData = {
                        labels,
                        datasets,
                    };
                    console.log("url", url);
                    // Actualizar el estado solo si los datos son válidos
                    setChartData(newChartData);
                    setresponseData(response.data);
                }
            } catch (error) {
                console.log('error', error);
            } finally {
                setIsLoading(false); // Ocultar spinner/loading después de la petición
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Índice general',
                },
                suggestedMax:
                    chartData &&
                        chartData.datasets &&
                        chartData.datasets[0] &&
                        Array.isArray(chartData.datasets[0].data)
                        ? Math.max(...chartData.datasets[0].data) * 1.5
                        : null,
                beginAtZero: true,
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Variación mensual (%)',
                },
                beginAtZero: true,
                suggestedMax: 16,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    },
                },

            },
        },
    };

    return (
        <Container maxWidth="lg" className='demandaBody'>
            {isLoading ? ( // Mostrar el spinner/loading si isLoading es verdadero
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                    }}
                >
                    <CircularProgress color="success" size={50} thickness={5} />
                </Box>
            )
                :
                (<Box className="demandaInner">
                    <Box className="exportCSV" align="right">
                        <Button
                            variant='contained' color='success' style={{ fontSize: "10px" }}
                            onClick={() => exportCsv(responseData)} >Exportar a CSV</Button>
                    </Box>
                    <Box sx={{ marginTop: '2rem' }} className="titleGraph">
                        <Typography variant="h5" align="center" gutterBottom>
                            ÍNDICE DE RED ELÉCTRICA (IRE) - GENERAL - ACUMULADO MES (% | Índice (2010=100)) | SISTEMA ELÉCTRICO:Peninsular
                        </Typography>
                    </Box>
                    <Box sx={{ marginBottom: '2rem', height: "400px" }} align="center">
                        {chartData && chartData.labels && chartData.datasets ? (
                            <Line data={chartData} options={options} />
                        ) : null}
                    </Box>
                    <Box sx={{ marginBottom: '2rem' }}>
                        <p>Notas:</p>
                        <p>{responseData?.data.attributes.description}</p>
                    </Box>
                    <Box sx={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: "darkblue" }}>¿Qué es el Índice Red Eléctrica (IRE)?</h3>
                        <p>Se trata de un indicador cuyo objetivo es facilitar una información adelantada de la evolución del consumo eléctrico del conjunto de empresas que tienen un consumo eléctrico medio/alto, así como su desglose por sectores de actividad (actividades industriales y de servicios).</p>

                        <p>Este indicador se publica a partir de los datos corregidos con los efectos de la composición del calendario y la evolución de las temperaturas.</p>

                        <p>Estas últimas afectan sólo al índice agregado y al de servicios, ya que la evolución de las temperaturas no tiene una influencia significativa sobre el consumo de energía eléctrica de los sectores industriales. Las gráficas y el fichero de descarga de datos de evolución del consumo incluyen los datos tanto brutos como corregidos.</p>

                        <p>Los puntos de consumo considerados para este índice son aquellos que en el sistema de medidas eléctricas están clasificados como de tipo 1 ó 2; es decir, aquellos que tienen una potencia contratada superior a 450 kW. Red Eléctrica recibe estas medidas de los distribuidores, pero no son definitivas hasta transcurridos 10 meses. Durante este período las medidas son provisionales y, por tanto, pueden sufrir variaciones y condicionar el tratamiento estadístico de los datos previos a su publicación.</p>

                        <p>El índice IRE presenta tres grupos de datos de consumo eléctrico (total consumidores medios/grandes, actividades industriales y actividades de servicios), y para su elaboración se ha tomado como base de cálculo el año 2010 por ser el primer ejercicio completo desde el que Red Eléctrica cuenta con medidas estables. Por tanto, las series de datos están disponibles para su consulta desde el 1 de enero de 2010 mientras que en las gráficas se representan solo los datos de los últimos trece meses. </p>
                    </Box>
                </Box>)
            }

        </Container>
    );
};
