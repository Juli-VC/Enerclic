import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { TextField } from '@mui/material';

export default function INPUT_CATEGORY({ categoria, setCategoria, subcategoria, setSubcategoria }) {


    const handleCategoriaChange = (event) => {
        setCategoria(event.target.value);
        setSubcategoria('');
    };

    const handleSubcategoriaChange = (event) => {
        setSubcategoria(event.target.value);
    };


    const categories = ["balance", "demanda", "generacion", "intercambios", "transporte", "mercados"]
    const subCategories = {
        balance: ["balance-electrico"],
        demanda: ["evolucion", "variacion-componentes", "variacion-componentes-movil", "ire-general", "ire-general-anual", "ire-general-movil", "ire-industria", "ire-industria-anual", "ire-industria-movil", "ire-servicios", "ire-servicios-anual", "ire-servicios-movil", "ire-otras", "ire-otras-anual", "ire-otras-movil", "demanda-maxima-diaria", "demanda-maxima-horaria", "perdidas-transporte", "potencia-maxima-instantanea", "variacion-demanda", "potencia-maxima-instantanea-variacion", "potencia-maxima-instantanea-variacion-historico", "demanda-tiempo-real", "variacion-componentes-anual"],
        generacion: ["estructura-generacion", "evolucion-renovable-no-renovable", "estructura-renovables", "estructura-generacion-emisiones-asociadas", "evolucion-estructura-generacion-emisiones-asociadas", "no-renovables-detalle-emisiones-CO2", "maxima-renovable", "potencia-instalada", "maxima-renovable-historico", "maxima-sin-emisiones-historico"],
        intercambios: ["francia-frontera", "portugal-frontera", "marruecos-frontera", "andorra-frontera", "lineas-francia", "lineas-portugal", "lineas-marruecos", "lineas-andorra", "francia-frontera-programado", "portugal-frontera-programado", "marruecos-frontera-programado", "andorra-frontera-programado", "enlace-baleares", "frontera-fisicos", "todas-fronteras-fisicos", "frontera-programados", "todas-fronteras-programados"],
        transporte: ["energia-no-suministrada-ens", "indice-indisponibilidad", "tiempo-interrupcion-medio-tim", "kilometros-lineas", "indice-disponibilidad", "numero-cortes", "ens-tim", "indice-disponibilidad-total"],
        mercados: ["componentes-precio-energia-cierre-desglose", "componentes-precio", "energia-gestionada-servicios-ajuste", "energia-restricciones", "precios-restricciones", "reserva-potencia-adicional", "banda-regulacion-secundaria", "energia-precios-regulacion-secundaria", "energia-precios-regulacion-terciaria", "energia-precios-gestion-desvios", "coste-servicios-ajuste", "volumen-energia-servicios-ajuste-variacion", "precios-mercados-tiempo-real", "energia-precios-ponderados-gestion-desvios-before", "energia-precios-ponderados-gestion-desvios", "energia-precios-ponderados-gestion-desvios-after"]
    }
    return (
        <div className=''>
            <FormControl sx={{ m: 0, maxWidth: 600 }}  >
                <TextField
                    label="Categoría"
                    id="categoria"
                    value={categoria}
                    onChange={handleCategoriaChange}
                    select
                >
                    <MenuItem value="">
                        <em>--</em>
                    </MenuItem>
                    {categories.map((category, index) => (
                        <MenuItem value={category} key={index} >{category}</MenuItem>
                    ))}
                </TextField>
            </FormControl>

            {
                categoria && (
                    <FormControl sx={{ m: 0, }}>
                        <TextField
                            label="Subcategoría"
                            id="subcategoria"
                            value={subcategoria}
                            onChange={handleSubcategoriaChange}
                            select
                        >
                            {subCategories[categoria].map((subCategory, index) => (
                                <MenuItem value={subCategory} key={index}>{subCategory}</MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                )
            }
        </div >
    );
}
