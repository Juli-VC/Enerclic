import { Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material"
import axios from "axios";
import React, { useEffect, useState } from "react"

import generacion from "./generacion.scss"

// Importa las dependencias necesarias de Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Decimation,

} from "chart.js";
import { Line, Bar, Annotation } from "react-chartjs-2";
import { exportCsv } from "../../../_ExportCSV/exportCsv";

// Registra los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Decimation,

);

export const Generacion = () => {
    //Es una view con múltiples datos, por lo que habrá que hacer varias peticiones distintas.

    const [data1genEolica, setdata1genEolica] = useState(null);
    const [data2genSolar, setdata2genSolar] = useState(null);
    const [data3genHidraulica, setdata3genHidraulica] = useState(null);


    //Lo de siempre. UseEfect para al cargar la pag se haga la peticion.
    const [chartData, setChartData] = useState(null);
    const [responseData, setresponseData] = useState(null);

    const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loading

    // estado para manejar la view de la unidades de la grafica (GWH o %) 
    const [unitChange, setunitChange] = useState(1)
    // idem para dias/meses...
    const [timeTrunc, settimeTrunc] = useState("day")

    const [lastMonth, setLastMonth] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const url =
                `https://apidatos.ree.es/es/datos/generacion/estructura-generacion?start_date=2023-01-01T00:00&end_date=2023-12-31T23:59&time_trunc=${timeTrunc}&geo_trunc=electric_system&geo_limit=peninsular&geo_ids=8741`;

            setIsLoading(true); // Mostrar spinner/loading cuando haga la petición
            try {
                const response = await axios.get(url);
                const apiData = response.data;

                if (
                    apiData &&
                    apiData.included &&
                    Array.isArray(apiData.included)
                ) {
                    const datasets = apiData.included.map((item) => ({
                        label: item.attributes.title,
                        data: item.attributes.values.map(
                            unitChange === 1 ?
                                (value) => value.value / (item.attributes.title === "Generación total" ? 1000 : 1000) // Dividir por 1000 o 10000 según el caso
                                :
                                unitChange === 2 ? (value) => (value.percentage * 100).toFixed(2) : ""
                        ),
                        backgroundColor: item.attributes.color,
                        type: item.attributes.title === "Generación total" ? "line" : "bar",
                        borderColor: item.attributes.title === "Generación total" ? "black" : undefined,
                        borderWidth: item.attributes.title === "Generación total" ? 2 : undefined,
                        borderCapStyle: item.attributes.title === "Generación total" ? "round" : undefined,
                        tension: item.attributes.title === "Generación total" ? 0.3 : undefined,
                        radius: item.attributes.title === "Generación total" ? true : undefined,
                        order: item.attributes.title === "Generación total" ? 1 : 2,
                        fill: item.attributes.title !== "Generación total",
                    }));

                    const labels = apiData.included[0].attributes.values.map(
                        (value) => value.datetime.split("T")[0]
                    );

                    const newChartData = {
                        labels,
                        datasets,
                    };

                    setChartData(newChartData);
                    setresponseData(apiData)

                    console.log("apidata", apiData);


                    /* Para mostrar datos sueltos de los % del último mes. 
                    Tenia antes el ultimo, pero depende del dia que lo pidas, puede venir el mes 
                    imcompleto. Mejor usar el anterior que tendrá más datos.*/

                    // Obtener la última fecha disponible. Vaya, el mes anterior al último que venga.

                    const lastDate = apiData.included[0].attributes.values.slice(-2)[0].datetime.split('T')[0];
                    setLastMonth(lastDate)

                    // Filtrar los datos correspondientes a la última fecha para cada tecnología
                    const eolicaLastData = apiData.included.find((item) => item.attributes.title === "Eólica").attributes.values.find((value) => value.datetime.split("T")[0] === lastDate);
                    const solarLastData = apiData.included.find((item) => item.attributes.title === "Solar fotovoltaica").attributes.values.find((value) => value.datetime.split("T")[0] === lastDate);
                    const hidraulicaLastData = apiData.included.find((item) => item.attributes.title === "Hidráulica").attributes.values.find((value) => value.datetime.split("T")[0] === lastDate);

                    // Obtener el valor en porcentaje para cada tecnología en la última fecha
                    const eolicaPercentage = eolicaLastData ? parseFloat((eolicaLastData.percentage * 100).toFixed(2)) : 0;
                    const solarPercentage = solarLastData ? parseFloat((solarLastData.percentage * 100).toFixed(2)) : 0;
                    const hidraulicaPercentage = hidraulicaLastData ? parseFloat((hidraulicaLastData.percentage * 100).toFixed(2)) : 0;

                    setdata1genEolica(eolicaPercentage)
                    setdata2genSolar(solarPercentage)
                    setdata3genHidraulica(hidraulicaPercentage)

                }
            } catch (error) {
                console.log("error", error);

            } finally {
                setIsLoading(false); // Ocultar spinner/loading después de la petición
            }
        };

        fetchData();

    }, [unitChange, timeTrunc]); //se pone aquí, para que si el estado cambia, actualice.


    return (
        <div className="generationBody">
            <Container style={{ padding: "0" }}>
                <h2>Datos de Generación</h2>

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
                    (<Box sx={{ flexGrow: 1 }}  >
                        <Grid container spacing={2}>
                            <Grid item xs={12} style={{ padding: "0" }}>
                                <Box sx={{ flexGrow: 1, width: '100%', }}>
                                    <Grid className="tresData" container >
                                        <Grid item xs={3.5} className="dataPercentages" >
                                            <Typography variant="h5" align="center" gutterBottom style={{ color: "#66bb6a", fontWeight: "bold", }}>
                                                {data1genEolica && data1genEolica} %
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                GENERACIÓN EÓLICA NACIONAL
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                {lastMonth && new Date(lastMonth).toLocaleDateString('es-ES')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3.5} className="dataPercentages" >
                                            <Typography variant="h5" align="center" gutterBottom style={{ color: "#66bb6a", fontWeight: "bold", }}>
                                                {data2genSolar && data2genSolar} %
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                GENERACIÓN SOLAR NACIONAL
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                {lastMonth && new Date(lastMonth).toLocaleDateString('es-ES')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3.5} className="dataPercentages" >
                                            <Typography variant="h5" align="center" gutterBottom style={{ color: "#66bb6a", fontWeight: "bold", }}>
                                                {data3genHidraulica && data3genHidraulica} %
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                GENERACIÓN HIDRÁULICA NACIONAL
                                            </Typography>
                                            <Typography variant="p" align="center" gutterBottom>
                                                {lastMonth && new Date(lastMonth).toLocaleDateString('es-ES')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} id="graphicOuter">
                                {chartData && (
                                    <Box className="graphic" >
                                        <Box className="exportCSV" align="right" mb={2}>
                                            <Button
                                                variant='contained' color='success' style={{ fontSize: "10px" }}
                                                onClick={() => exportCsv(responseData)} >Exportar a CSV</Button>
                                        </Box>
                                        <Typography variant="h5" align="center" gutterBottom>
                                            ESTRUCTURA DE LA GENERACIÓN POR TECNOLOGÍAS (GWh) | SISTEMA ELÉCTRICO: Peninsular
                                        </Typography>
                                        <hr />
                                        <Box style={{ paddingLeft: "6%", display: "flex", justifyContent: "space-between", gap: "2px", marginBottom: "20px" }}>

                                            <div className="div" style={{ display: "flex", gap: "2px" }}>
                                                <Button variant={unitChange === 2 ? "contained" : "outlined"} color="error"
                                                    style={{ height: "20px" }}
                                                    onClick={() => { setunitChange(2) }} >%</Button>
                                                <Button variant={unitChange === 1 ? "contained" : "outlined"} color="error"
                                                    style={{ height: "20px" }}
                                                    onClick={() => { setunitChange(1) }}>GWh</Button>
                                            </div>
                                            <div className="div" style={{ display: "flex", gap: "2px" }}>
                                                <Button variant={timeTrunc === "day" ? "contained" : "outlined"} color="info"
                                                    style={{ height: "20px" }}
                                                    onClick={() => { settimeTrunc("day") }} >Diario</Button>
                                                <Button variant={timeTrunc === "month" ? "contained" : "outlined"} color="info"
                                                    style={{ height: "20px" }}
                                                    onClick={() => { settimeTrunc("month") }}>Mensual</Button>
                                                <Button variant={timeTrunc === "year" ? "contained" : "outlined"} color="info"
                                                    style={{ height: "20px" }}
                                                    onClick={() => { settimeTrunc("year") }}>Anual</Button>
                                            </div>

                                        </Box>
                                        <Bar
                                            data={chartData}
                                            options={{
                                                responsive: true,
                                                indexAxis: "x",
                                                scales: {
                                                    x: {
                                                        stacked: true,
                                                        ticks: {
                                                            beginAtZero: true,
                                                        },
                                                    },
                                                    y: {
                                                        stacked: true,
                                                        ticks: {
                                                            beginAtZero: true,
                                                            stepSize: unitChange === 1 ? 100 : 10,
                                                        },

                                                        max: unitChange === 2 ? 100 : undefined,
                                                        title: {
                                                            display: true,
                                                            text: unitChange === 1 ? "GWh" : "%",
                                                            font: {
                                                                weight: "bold",
                                                            },
                                                        },
                                                    },
                                                },
                                                plugins: {
                                                    legend: {
                                                        position: "bottom",
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function (context) {
                                                                const label = context.dataset.label || "";
                                                                const value = context.parsed.y;
                                                                return `${label}: ${value} ${unitChange === 1 ? "GWh" : "%"}`;
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    )
                }
            </Container>
        </div>
    )
}
