import { useEffect, useState } from "react"
import { useParams, Link, useNavigation } from 'react-router-dom'
import { clienteAxios } from "../config/clienteAxios"
import Alerta from "../components/Alerta"


export default function ConfirmarCuenta() {
  const [ alerta, setAlerta ] = useState({})
  const [ cuentaConfirmada, setCuentaConfirmada ] = useState(false)

  const params = useParams();
  const navigate = useNavigation();
  
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${params.token}`
        const {data} = await clienteAxios(url);
        setAlerta({msg:data.msg});
        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({msg:error.response.data.msg, error:true});
      }
    }
    confirmarCuenta();
    navigate('/')
  }, [])
  
  const {msg} = alerta;

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize my-10">Confirma tu cuenta y comienza a crear tus {''}<span className="text-slate-700">proyectos</span></h1>
        <div className="md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
          {msg && <Alerta alerta={alerta}/>}
          {cuentaConfirmada && <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia Sesión</Link> }
        </div>
    </>


  )
}
