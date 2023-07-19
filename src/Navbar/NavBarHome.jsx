import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useContext } from 'react';
import { ProviderContext } from '../context/CloudContext';
import Login from '../Login/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import navbar from "./navbar.scss"

const pages = ['Home', 'About', 'Contacto', 'Consultas-Api'];
const settings = ['Perfil', 'Cuenta', 'Opciones', 'Cerrar sesión'];



function ResponsiveAppBar() {
    /* Nos traemos del context, datos de variables globales por si las necesitamos.
    Asi, si necesitamos usar la info en otra view/url, pues ya lo tenemos.
    Realmente solo necesitamos saber si está logueado. Esto se puede poner aqui, o en el approute.
    En el login es donde si usaremos la mayoria de estados globales (logued, userinfo, etc) */

    const { isLogged, setIsLogged, usertoken, setUserToken } = useContext(ProviderContext);
    const navigate = useNavigate();


    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const logOut = () => {
        handleCloseNavMenu();
        //Añadimos funciones para borrar el token del local, logueo (false), vaciamos token, y reedireccion a home.
        window.localStorage.removeItem("token");
        setIsLogged(false);
        setUserToken(null);
        navigate("/");
    };

    // Obtener la ubicación actual (URL)
    const location = useLocation();

    // Función para verificar si el enlace está activo
    const isLinkActive = (link) => {
        return location.pathname === `/${link}`;
    };


    return (
        <AppBar position="static" color='success' id='appBarHome'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: "#ffa726" }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/Home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#ffa726',
                            textDecoration: 'none',
                        }}
                    >
                        Enerclic
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu} id='menuLinks'>
                                    <Typography textAlign="center"
                                        href={`/${page}`}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/Home"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Enerclic
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent={'center'} gap={2}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                href={`/${page}`}
                                id={isLinkActive(page) ? 'activeLink' : ''}
                            >
                                {page}
                            </Button>
                        ))}


                    </Box>

                    <Box sx={{ flexGrow: 0 }} id='menuLinks'>
                        {!isLogged ?
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                href={`/Login`}
                                id={isLinkActive("Login") ? 'activeLink' : ''}
                            >
                                Iniciar Sesión
                            </Button>
                            :
                            <>
                                <Box sx={{ display: "flex", gap: "5px" }}>
                                    <Button
                                        onClick={logOut}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                        href={`/`}
                                        id={isLinkActive("Login") ? 'activeLink' : ''}
                                    >
                                        Cerrar sesión
                                    </Button>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={setting === 'Cerrar sesión' ? logOut : handleCloseUserMenu}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>

                            </>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;