import { Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'

export const Home = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ height: 'calc: 100vh - 73px' }} py={5} textAlign={"justify"}>
                <Typography variant='h4' color={"#66bb6a"} align='center' py={3}>
                    Prueba técnica de Enerclic
                </Typography>
                <Typography variant='subtitle1' align='center' fontWeight={'bold'} >Prueba de Front</Typography>
                <p>Se pide una aplicación web desarrollado con REACT con las siguientes especificaciones:</p>
                <List sx={{ just: "center" }} >
                    <ListItem variant="body1" gutterBottom >
                        1. Inicie sesión con su usuario y contraseña para acceder a la aplicación.
                    </ListItem>
                    <ListItem variant="body1" gutterBottom>
                        2. Complete el formulario para realizar una llamada a la API de energía.
                    </ListItem>
                    <ListItem variant="body1" gutterBottom>
                        3. Visualice las dos gráficas con diferentes formas de representar los datos.
                    </ListItem>
                    <ListItem variant="body1" gutterBottom>
                        4. Explore la tabla con opciones de ordenación, búsqueda y selector de campos.
                    </ListItem>
                    <ListItem variant="body1" gutterBottom>
                        5. Descargue los datos representados en la tabla en formato CSV.
                    </ListItem>
                </List>


                <Typography variant="h6" gutterBottom>
                    Recursos:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Librería Material-UI"
                            secondary="https://mui.com/"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Librería gráficas React-ChartJS2"
                            secondary="https://www.npmjs.com/package/react-chartjs-2"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="API energía: https://www.ree.es/es/apidatos"
                            secondary="https://www.ree.es/es/apidatos"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="API Login: https://fakestoreapi.com/docs"
                            secondary="https://fakestoreapi.com/docs"
                        />
                    </ListItem>
                </List>
            </Box>
        </Container>
    )
}
