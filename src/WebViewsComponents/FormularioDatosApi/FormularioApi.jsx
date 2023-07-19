import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import formularioApi from "./formularioApi.scss";
import INPUT_CATEGORY from './Input-Components/INPUT_CATEGORY';
import INPUT_QUERY from './Input-Components/INPUT_QUERY';
import { Button, CircularProgress, Container, FormControl, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BalanceComponent from './DataComponents/BalanceComponent';
import axios from 'axios';

export const FormularioApi = () => {
    const [languageValue, setLanguageValue] = useState('es');
    const [requiredValue, setRequiredValue] = useState('');
    const [categoryValue, setCategoryValue] = useState('');
    const [queryValue, setQueryValue] = useState('');

    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubcategoria] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeTrunc, setTimeTrunc] = useState('');
    const [geoLimit, setGeoLimit] = useState('');
    const [geoIds, setGeoIds] = useState('8741');

    const [responseData, setresponseData] = useState({});

    //Estado para ver una opción de vista de datos (grafico/tabla)
    const [showTabView, setshowTabView] = useState(1) //iniciamos en uno en concreto.

    const [isLoading, setIsLoading] = useState(false); // Estado para controlar el loading

    const [msg, setMsg] = useState(false) // Si se consulta erróneamente. Mostrar error.

    const baseUrl = 'https://apidatos.ree.es';
    /* const apiKey = 'API_KEY'; // normalmente hace falta una */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `${baseUrl}/es/datos/${categoria}/${subcategoria}?start_date=${startDate}&end_date=${endDate}&time_trunc=${timeTrunc}&geo_limit=${geoLimit}&geo_ids=${geoIds}`;

        console.log('URL:', url);
        // Realizar la solicitud a la API con la URL construida
        /* Como es para el ejemplo, solo me he asegurado que funcione con unos 
        campos/selecciones específicos (cada peticion puede traer multivariedad 
        de datos. Tendría que mirar uno por uno que trae, como lo trae,... 
        y luego validar con ifs y que muestre una estructura/grafica, etc..
        asi que solo he puesto un caso en específico. ) */
        if (categoria === "balance" && subcategoria === "balance-electrico" && startDate === "2011-01-01T00:00" && endDate === "2012-12-31T23:59" && geoLimit === "Peninsular" && geoIds === "8741") {
            try {
                setIsLoading(true); // Mostrar spinner/loading cuando haga la petición
                const response = await axios.get(url);
                setresponseData(response)
            } catch (error) {
                console.log("error", error)
            } finally {
                setIsLoading(false); // Ocultar spinner/loading después de la petición
                setMsg(false) //Oculatar mensage de error por seleccion de campos.
            }
        } else {
            setMsg(true)
        };

    };

    //Formula para formatear las fechas y mostrarla en texto simple
    const formatDate = (date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`; // Ajusta el formato según tus necesidades
    };

    return (
        <>
            <div className="container-fluid formularioApi">
                <div >
                    <Container className=" formularioBody" >
                        <div className="formInner">
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, minWidth: 300 },
                                }}
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} lg={4}>
                                        <div className='formInputs '>
                                            <FormControl fullWidth sx={{ m: 0, py: 3, maxWidth: 200 }} >
                                                <TextField
                                                    select
                                                    label="Idioma"
                                                    value={languageValue}
                                                    onChange={(e) => setLanguageValue(e.target.value)}

                                                >
                                                    <MenuItem value="es">Español</MenuItem>
                                                    <MenuItem value="en">Inglés</MenuItem>
                                                </TextField>
                                                <INPUT_CATEGORY
                                                    value={categoryValue}
                                                    onChange={(e) => setCategoryValue(e.target.value)}
                                                    categoria={categoria} setCategoria={setCategoria} subcategoria={subcategoria} setSubcategoria={setSubcategoria}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={8}>
                                        <INPUT_QUERY
                                            value={queryValue}
                                            onChange={(e) => setQueryValue(e.target.value)}
                                            startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} timeTrunc={timeTrunc} setTimeTrunc={setTimeTrunc} geoLimit={geoLimit} setGeoLimit={setGeoLimit} geoIds={geoIds} setGeoIds={setGeoIds}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Button variant="contained" endIcon={<SendIcon />} type="submit" onClick={handleSubmit} >
                                Consultar
                            </Button>
                            {msg === true && <p style={{ color: "red", fontWeight: "bold", fontSize: "small", fontStyle: "italic" }}>Error al seleccionar algún campo. Compruebe las instrucciones de abajo.</p>}
                            <p>Como solo es un ejemplo de funcionalidad para la prueba, solo esta disponible una opción: </p>
                            <ul>Idioma: <b>Español</b> || Categoría: <b>balance</b> || Subcategoría: <b>balance-electrico</b> ||</ul>
                            <ul>Fecha de Inicio: <b>01/01/2011 00:00</b> || Fecha Fin: <b>31/12/2012 23:59</b></ul>
                            <ul>Agregación tiempo: <b>year</b> || Ámbito geogr.: <b>peninsular</b></ul>
                            <i>Puedes comprobar con la web oficial con estos campos, y salen resultados casi iguales. Diferencias que no se qué horas han usado en la web, ni la forma de "aproximar" los decimales que usan en la web.</i>
                        </div>
                    </Container>
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
                        (responseData?.data && <div className=" displayData" >
                            <h3>{subcategoria.toLocaleUpperCase()}</h3>
                            <hr />
                            <br />
                            <div className='tabsOption'>
                                <div className="tabsButton">
                                    <Button variant={showTabView === 1 ? "contained" : "outlined"} color="success"
                                        onClick={() => { setshowTabView(1) }} >Vista gráfica</Button>
                                    <Button variant={showTabView === 2 ? "contained" : "outlined"} color="success"
                                        onClick={() => { setshowTabView(2) }}>Vista en Tabla</Button>
                                </div>

                                <TextField select label="Exportar a..." sx={{ minWidth: "200px" }}></TextField>
                            </div>
                            {responseData && Object.keys(responseData).length > 0 &&
                                <div className="tableData">
                                    <h5 >{subcategoria.toLocaleUpperCase()} (GWh) | {categoria.toLocaleUpperCase()} | {geoLimit.toLocaleUpperCase()} | Periodo consultado: del {formatDate(new Date(startDate))} al {formatDate(new Date(endDate))}</h5>
                                    <hr />

                                    {responseData && <BalanceComponent
                                        responseData={responseData}
                                        endDate={endDate}
                                        startDate={startDate}
                                        showTabView={showTabView}
                                        setshowTabView={setshowTabView}
                                    />}
                                </div>
                            }
                        </div>)
                    }
                </div>
            </div>
        </>
    )
}
