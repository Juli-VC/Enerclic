import React, { useContext, useState } from 'react';
import { TextField, Button, Typography, Container, Grid, InputAdornment, IconButton } from '@mui/material';
import axios from 'axios';
import { ProviderContext } from '../context/CloudContext';
import jwtDecode from "jwt-decode";

import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //Nos traemos del context los estados globales que podremos usar en toda la web.
  //Si hace el login correcto, se hace un "set" para cambiar el estado, y poder 
  // usar el los datos de usuario/token, etc para el resto de la App.

  const { setIsLogged, setUserToken } = useContext(ProviderContext);

  const navigate = useNavigate(); //para redirigir

  const handleLogin = async () => {
    //Se valida que se ingresen los campos "requeridos". Se podría usar el atributo
    // required, que activa el validate bonito automatico de MUI/bootstrap, pero 
    // por experiencia, al final terminas haciendo un e.preventDefault para hacer el submit personalizado.
    console.log("input", username, password);
    try {
      if (!username.trim() || !password.trim()) {
        setError('Ingrese un correo electrónico y contraseña válidos.');
        return;
      }

      const response = await axios.post(
        'https://fakestoreapi.com/auth/login',
        JSON.stringify({ username, password }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Restablecer el error en caso de que se haya mostrado previamente.
      setError('');

      // Restablecer el estado de la contraseña para que esté oculta cuando se inicie sesión.
      setShowPassword(false);

      // Restablecer los campos de entrada.
      setusername('');
      setPassword('');




      const { token } = response.data;

      // Generar un token usando JSON WEBTOKEN, con el userId como contenido y una hora de expiración.

      /* const token = jwt.sign({ userId }, 'ContraseñaSegura', { expiresIn: '1h' });

      Pero, como no hemos creado un server en NodeJs, da problemas intentar poner 
      el jwtoken, y habría que instalar otra librería para que funcione bien en Front.
      Asi que lo dejo normal, ya que es una prueba. Y el login suele ir asociado a una BD 
      en condiciones, con un montón de validaciones y configuracion de seguridad, pero en el back.
      Dejo abajo del todo, como haría el login en el back de NodeJs.
      */


      // Guardar el token en el almacenamiento local o en el estado global de la aplicación.
      // Se pueden guardar más cosas tanto en el token del storage como en el del context global.
      // Pais, provincia, localización, preferencias, etc. Para que se puedan usar esos datos para + 
      // ...filtros automáticos, sin tener que hacer peticiones a la BD para cosas básicas e iniciales.
      window.localStorage.setItem("token", token);
      setUserToken(jwtDecode(token).username)
      /*  Por lo que veo en la api, user tiene más datos. Se podría, una vez logeado correctamente, 
       traer la info deseada con otra peticion, y añadirla a "userToken".
       El response del login solo trae un token con info básica. */

      setIsLogged(true) // para modificar la web para mostrar el contenido de los usuarios logueados.

      // Restablecer los campos de entrada y los errores.
      setusername('');
      setPassword('');
      setError('');

      //Redirigir a una URL específica. Home, perfil, etc...
      navigate("/")

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales inválidas');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
        console.log("error", error);
      }
    }
  };

  //MUI. Para ver/ocultar la contraseña.
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "50px" }} >
      <div className="loginBody">
        <Typography variant="h4" component="h2" gutterBottom>
          Introduce tus datos
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de usuario"
              type="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'} // Mostrar texto claro o contraseña según el estado de showPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="toggle password visibility"
                      onClick={handlePasswordToggle}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            {error && <Typography color="error">{error}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleLogin} fullWidth>
              Iniciar sesión
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Login;




///////////////////////////////////
///////////////////////////////////
/* Código de como programaría el Login si fuera en el back de NodeJS.

login = (req, res) => {
    let { username, password } = req.body;

    let sql = `SELECT user_id, username, password, img, name, user_type, province_id FROM user WHERE username = '${username}' AND user_is_deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) return res.status(400).json(error);

      if (!result || !result.length || result[0].is_deleted == 1) {
        res.status(401).json("Usuario no registrado");
      } else {
        const [user] = result;

        const hash = user.password;

        bcrypt.compare(password, hash, (error, response) => {
          if (error) return res.status(400).json(error);
          if (response === true) {
            const token = jwt.sign(
              {
                user: {
                  username: user.username,
                  name: user.name,
                  id: user.user_id,
                  type: user.user_type,
                  img: user.img,
                  province_id: user.province_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "10d" }
            );
            res.status(200).json({ token, user: result[0] });
          } else {
            res.status(401).json("Usuario o contraseña incorrectos");
          }
        });
      }
    });
  };


*/