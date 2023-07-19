import { Box, Button, Container } from '@mui/material'
import React, { useState } from 'react'
import { FormularioApi } from '../FormularioDatosApi/FormularioApi'
import { ConsultasGenerales } from '../ConsultasGenerales/ConsultasGenerales'

export const ConsultasTabs = () => {

    //Estado para ver una opción de vista de datos (grafico/tabla)
    const [showTab, setshowTab] = useState(2) //iniciamos en uno en concreto.



    return (
        <Container >
            <Box style={{ padding: "2% 0%", display: "flex", gap: "10px" }}>
                <Button variant={showTab === 1 ? "contained" : "outlined"} color="success"
                    onClick={() => { setshowTab(1) }} >Consulta personalizada</Button>
                <Button variant={showTab === 2 ? "contained" : "outlined"} color="success"
                    onClick={() => { setshowTab(2) }}>Consultas generales</Button>

            </Box>
            <hr />
            <Box >
                {showTab === 1 ? (
                    <FormularioApi />
                ) : showTab === 2 ? (
                    <ConsultasGenerales />
                ) : (
                    <p>Ha habido un error. Por favor, recargue la página o inténtelo más adelante.</p>
                )}
            </Box>
        </Container>
    )
}
