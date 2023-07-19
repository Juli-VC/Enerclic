import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';



export default function INPUT_QUERY({ startDate, setStartDate, endDate, setEndDate, timeTrunc, setTimeTrunc, geoLimit, setGeoLimit, geoIds, setGeoIds }) {


    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleTimeTruncChange = (event) => {
        setTimeTrunc(event.target.value);
    };

    const handleGeoLimitChange = (event) => {
        setGeoLimit(event.target.value);
        setGeoIds('8741');
    };

    const handleGeoIdsChange = (event) => {
        setGeoIds(event.target.value);
    };

    const geoLimitOptions = ['Peninsular', 'ccaa'];
    const ccaaOptions = [
        { label: 'Andalucía', value: '4' },
        { label: 'Aragón', value: '5' },
        { label: 'Cantabria', value: '6' },
        { label: 'Castilla la Mancha', value: '7' },
        { label: 'Castilla y León', value: '8' },
        { label: 'Cataluña', value: '9' },
        { label: 'País Vasco', value: '10' },
        { label: 'Principado de Asturias', value: '11' },
        { label: 'Comunidad de Ceuta', value: '8744' },
        { label: 'Comunidad de Melilla', value: '8745' },
        { label: 'Comunidad de Madrid', value: '13' },
        { label: 'Comunidad de Navarra', value: '14' },
        { label: 'Comunidad Valenciana', value: '15' },
        { label: 'Extremadura', value: '16' },
        { label: 'Galicia', value: '17' },
        { label: 'Islas Baleares', value: '8743' },
        { label: 'Islas Canarias', value: '8742' },
        { label: 'La Rioja', value: '20' },
        { label: 'Región de Murcia', value: '21' },
    ];

    const getCcaaOptions = () => {
        return ccaaOptions.map((option) => ({
            label: option.label,
            value: option.value,
        }));
    };


    return (
        <div className="formInputs">
            <Grid container spacing={0} justifyContent={'space-between'}>
                <Grid item xs={12} sm={5} md={5} lg={5}>
                    <Box sx={{ m: 0, maxWidth: 250 }}>
                        <InputLabel htmlFor="start-date" sx={{ px: 2 }}>Fecha de inicio</InputLabel>
                        <TextField
                            id="start-date"
                            type="datetime-local"
                            value={startDate}
                            onChange={handleStartDateChange}
                            sx={{ m: 1, }}
                        />
                    </Box>
                    <Box sx={{ m: 0, py: 6, maxWidth: 250 }}>
                        <InputLabel htmlFor="end-date" sx={{ px: 2 }}>Fecha de fin</InputLabel>
                        <TextField
                            id="end-date"
                            type="datetime-local"
                            value={endDate}
                            onChange={handleEndDateChange}

                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={5} md={5} lg={5}>
                    <Box className="formInputs" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControl sx={{ m: 0, py: 2, minWidth: 200, maxWidth: 250 }} >

                            <TextField
                                select
                                id="time-trunc"
                                value={timeTrunc}
                                onChange={handleTimeTruncChange}
                                label="Agregación de tiempo"
                            >
                                <MenuItem value="hour">hour</MenuItem>
                                <MenuItem value="day">day</MenuItem>
                                <MenuItem value="month">month</MenuItem>
                                <MenuItem value="year">year</MenuItem>
                            </TextField>
                        </FormControl>

                        <FormControl sx={{ m: 0, minWidth: 200, maxWidth: 250 }}>

                            <TextField
                                select
                                id="geo-limit"
                                value={geoLimit}
                                onChange={handleGeoLimitChange}
                                label="Ámbito geográfico"
                            >
                                <MenuItem value="">
                                    <em>--</em>
                                </MenuItem>
                                {geoLimitOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        {geoLimit === 'ccaa' && (
                            <FormControl sx={{ m: 0, maxWidth: 250 }} >
                                <TextField
                                    select
                                    id="geo-ids"
                                    value={geoIds}
                                    onChange={handleGeoIdsChange}
                                    label="Región"
                                >
                                    <MenuItem value="">
                                        <em>--</em>
                                    </MenuItem>
                                    {getCcaaOptions().map((option, index) => (
                                        <MenuItem key={index} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        )}
                    </Box>
                </Grid>
            </Grid>







        </div>
    );
}
