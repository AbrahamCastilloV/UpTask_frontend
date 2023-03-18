import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Alerta from "../components/Alerta";
import {clienteAxios} from '../config/clienteAxios'
import useAuth from "../hooks/useAuth";

export default function Login() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ alerta, setAlerta ] = useState({});

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([email,password].includes('')){
            setAlerta({msg:'Todos los campos son obligatorios', error:true})
            return;
        }
        try {
            const {data} = await clienteAxios.post('usuarios/login', {email,password});
            setAlerta({})
            localStorage.setItem('token', data.token);
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            setAlerta({msg:error.response.data.msg, error:true})

        }

    }

    const {msg} = alerta;
  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia Sesión y administra tus {''}<span className="text-slate-700">proyectos</span></h1>
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
            {msg && <Alerta alerta={alerta}/>}
            <div className="my-5">
                <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">email: </label>
                <input value={email} onChange={e => setEmail(e.target.value)} id="email" type="email" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Email de Registro"/>
            </div>
            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">password: </label>
                <input value={password} onChange={e => setPassword(e.target.value)} id="password" type="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Password de Registro"/>
            </div>
            <input type="submit" value='Iniciar Sesión' className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:bg-sky-800 cursor-pointer transition-colors mb-5" />
        </form>
        <nav className="lg:flex lg:justify-between">
            <Link to="registrar" className="block text-center my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
            <Link to="olvide-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Olvidé mi password</Link>        
        </nav>
    </>
  )
}
