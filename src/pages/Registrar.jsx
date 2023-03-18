import { Link } from "react-router-dom"
import { useState } from "react"
import { clienteAxios } from "../config/clienteAxios"
import { useNavigate } from "react-router-dom";

import Alerta from "../components/Alerta";

export default function Registrar() {
    const [ nombre, setNombre ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ repetirPassword, setRepetirPassword ] = useState('');
    const [ alerta, setAlerta ] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([nombre,email,password,repetirPassword].includes('')){
            setAlerta({msg:'Todos los campos son obligatorios', error:true})
            return;
        }
        if(password.length  < 6){
            setAlerta({msg:'La contraseña es de mínimo 6 caracteres', error:true})
            return;
        }
        if(password !== repetirPassword){
            setAlerta({msg:'Las contraseñas no son iguales', error:true})
            return;
        }

        //Crear Usuario
        try {
            const {data} = await clienteAxios.post(`/usuarios`, {nombre,email,password} );
            setAlerta({msg:data.msg});
             setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
            navigate('/')
        } catch (error) {
            setAlerta({msg:error.response.data.msg, error:true});
        }
    }


    const {msg} = alerta;

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu cuenta y administra tus {''}<span className="text-slate-700">proyectos</span></h1>
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
            {msg && <Alerta alerta={alerta}/>}
            <div className="my-5">
                <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">nombre: </label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" type="text" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Nombre de Registro"/>
            </div>
            <div className="my-5">
                <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">email: </label>
                <input value={email} onChange={e => setEmail(e.target.value)} id="email" type="email" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Email de Registro"/>
            </div>
            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">password: </label>
                <input value={password} onChange={e => setPassword(e.target.value)} id="password" type="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Password de Registro"/>
            </div>
            <div className="my-5">
                <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">repetir password: </label>
                <input value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} id="password2" type="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Repite tu Password de Registro"/>
            </div>
            <input type="submit" value='Crear Cuenta' className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:bg-sky-800 cursor-pointer transition-colors mb-5" />
        </form>
        <nav className="lg:flex lg:justify-between">
            <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia Sesión</Link>
            <Link to="/olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi password</Link>        
        </nav>
    </>
  )
}
