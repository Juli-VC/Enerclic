import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Container, Grid, Icon, LinearProgress } from '@mui/material';

import balanceStyle from "./balanceStyle.scss"

// iconos
import {
    WindPower as WindPowerIcon,
    Opacity as OpacityIcon,
    SolarPower as SolarPowerIcon,
    EnergySavingsLeaf as EnergySavingsLeafIcon,
    WbSunny as WbSunnyIcon,
    RestoreFromTrash as RestoreFromTrashIcon,
    WarningAmber as WarningAmberIcon,
    LocalFireDepartment as LocalFireDepartmentIcon,
    Factory as FactoryIcon,
    DomainDisabled as DomainDisabledIcon,
    HeatPump as HeatPumpIcon,
    DeleteForever as DeleteForeverIcon,
    GasMeter as GasMeterIcon,
    OfflineBoltOutlined as OfflineBoltOutlinedIcon,
    EvStationOutlined as EvStationOutlinedIcon,
    SummarizeOutlined as SummarizeOutlinedIcon,
    AddchartOutlined as AddchartOutlinedIcon
} from "@mui/icons-material";

const iconMap = {
    "Eólica": <WindPowerIcon />,
    "Hidráulica": <OpacityIcon />,
    "Solar fotovoltaica": <SolarPowerIcon />,
    "Otras renovables": <EnergySavingsLeafIcon />,
    "Solar térmica": <WbSunnyIcon />,
    "Residuos renovables": <RestoreFromTrashIcon />,
    "Nuclear": <WarningAmberIcon />,
    "Carbón": <LocalFireDepartmentIcon />,
    "Ciclo combinado": <FactoryIcon />,
    "Cogeneración": <DomainDisabledIcon />,
    "Turbinación bombeo": <HeatPumpIcon />,
    "Residuos no renovables": <DeleteForeverIcon />,
    "Fuel + Gas": <GasMeterIcon />,
    "Generación": <OfflineBoltOutlinedIcon />,
    "Consumos en bombeo": <EvStationOutlinedIcon />,
    "Saldo I. internacionales": <SummarizeOutlinedIcon />,
    "Demanda en b.c.": <AddchartOutlinedIcon />
};

export default function BalanceComponent({ responseData, startDate, endDate, showTabView }) {
    console.log("responseData", responseData);
    // Obtener el array de "included" de la respuesta
    const included = responseData?.data.included;
    console.log("included", included);

    // Crear un objeto para almacenar los arrays clasificados por "title"
    const dataByTitle = {};

    // Iterar sobre los elementos de "included"
    if (included) {
        included?.forEach(item => {
            const title = item.attributes.title;
            const names = item.attributes.content;

            // Si el título no existe en el objeto, crear un array vacío para ese título
            if (!dataByTitle[title]) {
                dataByTitle[title] = [];
            }

            // Iterar sobre los valores y agregarlos al array correspondiente
            names.forEach((n, index) => {
                dataByTitle[title].push({ "tipo": n.type, "valor": n.attributes.values });
            });
        });
    }

    // Ver los datos clasificados por "title"
    console.log("databytitle", dataByTitle);

    //Calculamos el total de Generación elect. Lo necesitamos para los %.
    const generacionTotal = parseInt((dataByTitle["Renovable"].slice(-1)[0].valor[0].value + dataByTitle["Renovable"].slice(-1)[0].valor[1].value + dataByTitle["No-Renovable"].slice(-1)[0].valor[0].value + dataByTitle["No-Renovable"].slice(-1)[0].valor[1].value) / 1000);



    // Ordenar las columnas de Renovable y No Renovable según el valor más alto
    Object.values(dataByTitle).forEach(values => {
        values.sort((a, b) =>
            (parseInt(b.valor[0].value) + parseInt(b.valor[1].value)) -
            (parseInt(a.valor[0].value) + parseInt(a.valor[1].value))
        );
    });

    // Declaramos las fechas primero, para luego obtener el año
    let start = new Date(startDate);
    let end = new Date(endDate);

    const columns = [
        { id: 'title', label: '', minWidth: 170 },
        { id: 'value1', label: start.getFullYear(), minWidth: 100 },
        { id: 'value2', label: end.getFullYear(), minWidth: 100 },
    ];

    return (
        <>
            {showTabView === 2 && <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ minHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="right"
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(dataByTitle).map(([title, values], index) => (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell>{title}</TableCell>
                                    </TableRow>
                                    {values.map((dat, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{dat.tipo}</TableCell>
                                            <TableCell align="right">{parseInt(dat.valor[0].value / 1000).toLocaleString()}</TableCell>
                                            <TableCell align="right">{parseInt(dat.valor[1].value / 1000).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>}

            {showTabView === 1 && <Container className='graficDatabody'>
                <Box sx={{ bgcolor: 'whitesmoke', flexGrow: 1, }} >
                    <Grid container justifyContent="space-evenly" >
                        {Object.entries(dataByTitle).map(([title, values], index) => (
                            <Grid xs={12} sm={5.8} md={3.8} className="dataGroup" key={index} px={"20px"}>
                                <h3>{title}</h3>
                                {values.map((dat, index) => (
                                    <React.Fragment key={index}>
                                        <div style={{ textAlign: 'center', fontWeight: "bold" }}>{dat.tipo}</div>
                                        <div className={dat.tipo.includes("Generación renovable") ? "dataRow bigCellGreen" : dat.tipo.includes("Generación no") ? "dataRow bigCellGrey" : dat.tipo.includes("Demanda en b.c") ? "dataRow bigCellBlue" : "dataRow normalCell"}>
                                            <div>
                                                {iconMap[dat.tipo]}
                                            </div>

                                            <div>{parseInt(((dat.valor[0].value / 1000 + dat.valor[1].value / 1000) / generacionTotal) * 100)} %</div>
                                            <div>
                                                {parseInt(dat.valor[0].value / 1000 + dat.valor[1].value / 1000).toLocaleString()}
                                            </div>
                                        </div>
                                        <Box sx={{ width: '100%', marginTop: '10px' }}>
                                            {title.includes("Renovable") && (
                                                <>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={((dat.valor[0].value / 1000 + dat.valor[1].value / 1000) / generacionTotal) * 100}
                                                        sx={{
                                                            height: '10px', // Tamaño de la barra de progreso
                                                            borderRadius: '20px', // Borde redondeado
                                                            backgroundColor: '#f5f5f5', // Color de fondo de la barra
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: 'purple', // Color de la barra de progreso
                                                            },
                                                            marginBottom: "15px"
                                                        }}
                                                        placeholder='%'
                                                    />

                                                </>
                                            )}
                                        </Box>
                                    </React.Fragment>
                                ))}
                                {title === "Demanda" && (
                                    <div className="dataRow bigCellTotal">
                                        <div>
                                            {iconMap["Generación"]}
                                        </div>
                                        <div>Generación tot.</div>
                                        <div>
                                            {generacionTotal.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container >}
        </>
    );
}
