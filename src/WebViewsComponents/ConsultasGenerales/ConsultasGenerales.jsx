import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import {
    AccountBalance as AccountBalanceIcon,
    BarChart as BarChartIcon,
    FlashOn as FlashOnIcon,
    ImportExport as ImportExportIcon,
    LocalShipping as LocalShippingIcon,
    MonetizationOn as MonetizationOnIcon
} from "@mui/icons-material";
import { Balance } from './Tabs/Balance';
import { Demanda } from './Tabs/Demanda';
import { Generacion } from './Tabs/Generacion';
import { Intercambios } from './Tabs/Intercambios';
import { Transporte } from './Tabs/Transporte';
import { Mercados } from './Tabs/Mercados';

export const ConsultasGenerales = () => {
    const [showTab, setshowTab] = useState(2);

    //Declaramos un array de objetos, para hacer un bucle para botones.
    //Y que estos tengan: nombre e icono.
    const data = [
        { nombre: "Balance", icono: <AccountBalanceIcon /> },
        { nombre: "Demanda", icono: <BarChartIcon /> },
        { nombre: "Generación", icono: <FlashOnIcon /> },
        { nombre: "Intercambios", icono: <ImportExportIcon /> },
        { nombre: "Transporte", icono: <LocalShippingIcon /> },
        { nombre: "Mercados", icono: <MonetizationOnIcon /> }
    ];





    return (
        <div>
            <h3>Consultas Generales:</h3>
            <div className="navTabs">
                <Box className="buttonsTabs" style={{ display: 'flex', alignItems: 'center', flexWrap: "wrap" }}
                    sx={{ justifyContent: { xs: "center", md: "start" } }} >
                    {data.map((item, index) => (
                        <Button
                            key={index}
                            variant={showTab === index + 1 ? "contained" : "outlined"}
                            color="success"
                            startIcon={item.icono}
                            onClick={() => { setshowTab(index + 1) }}
                            style={{ width: "160px" }}
                        >
                            {item.nombre}
                        </Button>
                    ))}
                </Box>
                <div className="tabs">
                    {showTab === 1 ? <Balance /> :
                        showTab === 2 ? <Demanda /> :
                            showTab === 3 ? <Generacion /> :
                                showTab === 4 ? <Intercambios /> :
                                    showTab === 5 ? <Transporte /> :
                                        showTab === 6 ? <Mercados /> :
                                            <p style={{ color: "red" }}>Mensage de Error</p>

                    }
                </div>
            </div>
        </div>
    );
}
