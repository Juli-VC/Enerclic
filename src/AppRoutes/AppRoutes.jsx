import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { About } from '../WebViewsComponents/About/About'
import { FormularioApi } from '../WebViewsComponents/FormularioDatosApi/FormularioApi'
import { Home } from '../WebViewsComponents/Home/Home'
import ResponsiveAppBar from '../Navbar/NavBarHome'
import Login from '../Login/Login'
import { ConsultasTabs } from '../WebViewsComponents/ConsultasTabs/ConsultasTabs'

export const AppRoutes = () => {
    return (
        <BrowserRouter >
            <ResponsiveAppBar />
            <Routes >
                <Route path='/Home' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/Consultas-Api' element={<ConsultasTabs />} />
                <Route path='/Login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
