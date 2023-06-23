import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { useForm } from '../../hooks/useForm';
import { types} from '../../types/types';
import { environment } from '../../environment/environment.dev';
import './LoginScreen.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Loader } from '../ui/loader/Loader';

const urlLogin = environment.UrlApiToken;
const urlInfoUser = environment.urlApiInfoUsuario;

export const LoginScreen = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [formValues, handleInputChange] = useForm({
      usuario: '',
      password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      if (formValues.usuario !== "" && formValues.password !== "") {
        const userLogin = {
          User: formValues.usuario,
          Password: formValues.password
        }

         await fetch(urlLogin, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userLogin)
         })
         .then(response => {
          if(response.ok) {
            return response.json();
          } 
         })
         .then(data => {
           if (data != null) {
            handleInfoUser(userLogin.User, data.token);
           } else {
            Swal.fire('Usuario y/o contraseña inválidas', '', 'error');
           }
         })
         .catch((err) => console.log(err));
      } else {
        Swal.fire('Debe completar los campos para realizar el inicio de sesión', '', 'error');
      }
    }

    const handleInfoUser = async (userLogin, token) => {
      try {
        setLoading(true);
        const response = await axios.get(urlInfoUser + userLogin, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
        });
          const { rut } = response.data.data;
          const basicInfoUser = {
            type: types.login,
            payload: { user: userLogin, rut: rut, token: token} 
          }
          dispatch(basicInfoUser);

          const lastPath = localStorage.getItem('lastPath') || '/dashboard';
          navigate(lastPath, {
            replace: true
          });

          setLoading(false);
      } catch (error) {
        console.error('API error:', error);
        setLoading(false);
      }
    }

    return (
      
      <div className='container mt-5'>

          <div id="contenedorcentrado" className='card'>
            <div id="login" className='card-body'>
              <form id="loginform" className='form-group' >
                <div className='row'>
                  <div className="col-lg-12">
                    <label>Usuario</label>
                    <input 
                      type="text" 
                      name='usuario' 
                      className='form-control ' 
                      placeholder='Usuario' 
                      autoComplete="off" 
                      onChange={handleInputChange} 
                      value={formValues.usuario}
                      required
                    />
                  </div>
                </div>
                <br/>
                <div className='row'>
                  <div className="col-lg-12">
                    <label>Contraseña</label>
                    <input 
                      type="password"
                      name='password' 
                      className='form-control' 
                      placeholder='Contraseña' 
                      autoComplete="off" 
                      onChange={handleInputChange} 
                      value={formValues.password}
                      required
                    />
                  </div>
                </div>
                <br />
               
                <div className='d-grid gap-2 col-12 mx-auto'>
                { loading ? <Loader /> : 
                  <button className='btn btn-primary' onClick={handleLogin}>
                      Iniciar
                  </button>}
                  
                </div>
                
              </form>
            </div>

            <div id="derecho">
                    <div className="titulo">
                        Tickets App
                    </div>
                    <hr/>
                    <div className="pie-form">
                        <a href="#">¿Perdiste tu contraseña?</a>
                        <a href="#">¿No tienes Cuenta? Registrate</a>
                        <hr/>
                        {/* <a href="#">« Volver</a> */}
                    </div>
                </div>
          </div>
            
      </div>
    )
}
