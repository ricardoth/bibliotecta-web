import { useFormik } from 'formik';
import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { parserTipoUsuario } from '../../types/parsers';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import * as Yup from 'yup';
import {validarRutChileno } from '../../selectors/validarChileanRut';
import { Switch } from '../ui/switch/Switch';
import Swal from 'sweetalert2';
import axios from 'axios';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';

const UrlGetTiposUsuarios = environment.UrlGetTiposUsuarios;
const UrlUsuario = environment.UrlGetUsuarios;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    rutDv: Yup.string().test(
        'Rut Válido', 
        'El Rut no es válido',
        value => validarRutChileno(value)),
    nombre: Yup.string().required('El Nombre es requerido')
});

export const UsuarioAddModal = ({show, close}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formik.resetForm();
    }, []);

    const formik = useFormik({
        initialValues: {
            idTipoUsuario: 0,
            rutDv: '',
            nombre: '',
            apellidoP: '',
            apellidoM: '',
            direccion: '',
            correo: '',
            telefono: '',
            activo: true
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let rutSplit = values.rutDv.split('-');
            let rut = rutSplit[0];
            let dv = rutSplit[1];

            let userValues = {
                idUsuario: 0,
                idTipoUsuario: values.idTipoUsuario,
                rut: rut,
                dv: dv,
                nombres: values.nombre,
                apellidoP: values.apellidoP,
                apellidoM: values.apellidoM,
                direccion: values.direccion,
                correo: values.correo,
                telefono: values.telefono,
                activo: values.activo
            }
            
            Swal.fire({
                title: 'Atención',
                text: '¿Desea Agregar el Usuario?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(!loading);
                    await axios.post(UrlUsuario, userValues, {
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                        },
                    }).then(response => {
                        console.log(response)
                        if(response.status === 200) {
                            setLoading(false);
                            formik.resetForm();
                            close();
                        } else {
                            setLoading(false);
                            Swal.fire('Ha ocurrido un error', 'No se pudo agregar el elemento', 'error');
                        }
                    }).catch(err => {
                        console.log(err)
                    });

                    
                }
            });
        } 
    });

    return (
        <>
            <Modal
                show={show}
                onHide={close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Usuario</Modal.Title>
                </Modal.Header>

                <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-lg-6">
                                <label>TipoUsuario</label>
                                <Combobox
                                    id={"idTipoUsuario"}
                                    value={formik.values.idTipoUsuario}
                                    setValue={formik.handleChange}
                                    url={UrlGetTiposUsuarios}
                                    parser={parserTipoUsuario}
                                    tipoAuth={environment.BasicAuthType}
                                />
                            </div>
                            <div className='col-lg-6'>
                                <label>Rut</label>
                                <input 
                                    type="text" 
                                    placeholder="Rut" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    name="rutDv" 
                                    value={formik.values.rutDv} 
                                    autoComplete="off"
                                    maxLength={10}
                                />

                                {formik.touched.rutDv && formik.errors.rutDv ? (
                                        <div style={{color:'red'}}>{formik.errors.rutDv}</div>
                                        ) : null}
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-lg-6">
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="nombre" 
                                    value={formik.values.nombre} 
                                    autoComplete="off"
                                />

                                {formik.touched.nombre && formik.errors.nombre ? (
                                        <div style={{color:'red'}}>{formik.errors.nombre}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-6'>
                                <label>Apellido Paterno</label>
                                <input 
                                    type="text" 
                                    placeholder="Apellido Paterno" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="apellidoP" 
                                    value={formik.values.apellidoP} 
                                    autoComplete="off"
                                />

                                {formik.touched.apellidoP && formik.errors.apellidoP ? (
                                        <div style={{color:'red'}}>{formik.errors.apellidoP}</div>
                                        ) : null}
                            </div>
                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label>Apellido Materno</label>
                                <input 
                                    type="text" 
                                    placeholder="Apellido Materno" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="apellidoM" 
                                    value={formik.values.apellidoM} 
                                    autoComplete="off"
                                />

                                {formik.touched.apellidoM && formik.errors.apellidoM ? (
                                        <div style={{color:'red'}}>{formik.errors.apellidoM}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-6'>
                                <label>Dirección</label>
                                <input 
                                    type="text" 
                                    placeholder="Dirección" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="direccion" 
                                    value={formik.values.direccion} 
                                    autoComplete="off"
                                />

                                {formik.touched.direccion && formik.errors.direccion ? (
                                        <div style={{color:'red'}}>{formik.errors.direccion}</div>
                                        ) : null}
                            </div>
                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <label>Correo</label>
                                <input 
                                    type="email" 
                                    placeholder="Correo" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="correo" 
                                    value={formik.values.correo} 
                                    autoComplete="off"
                                />

                                {formik.touched.correo && formik.errors.correo ? (
                                        <div style={{color:'red'}}>{formik.errors.correo}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-4'>
                                <label>Teléfono</label>
                                <input 
                                    type="text" 
                                    placeholder="Teléfono" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="telefono" 
                                    value={formik.values.telefono} 
                                    autoComplete="off"
                                />

                                {formik.touched.telefono && formik.errors.telefono ? (
                                        <div style={{color:'red'}}>{formik.errors.telefono}</div>
                                        ) : null}
                            </div>

                            <div className="col-lg-4">
                                <label>Vigencia</label>
                                <Switch
                                    id="activo"
                                    isOn={formik.values.activo}
                                    onToggle={formik.handleChange}
                                />
                            </div>
                        </div>

                    </Modal.Body>


                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">Aceptar</button>
                        <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                    </Modal.Footer>
                </form>
                
            </Modal>
        
        </>
    )
}
