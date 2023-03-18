import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { clienteAxios } from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';

let socket;
const ProyectosContext = createContext();

export const ProyectosProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([])
    const [ proyecto, setProyecto ] = useState({})
    const [ alerta, setAlerta ] = useState([])
    const [ cargando, setCargando ] = useState(false)
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)

    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
      const obtenerProyectos = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            } 
            const {data} = await clienteAxios('/proyectos', config)
            setProyectos(data);
        } catch (error) {
            console.log(error);
        }
      }
      obtenerProyectos();
    }, [auth])
    
    // * Conexión a socket IO
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, [])    

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})

        }, 1500);
    }

    const submitProyecto = async proyecto => {
        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)

        }
    }
    
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
           //Sincronizar State
            const proyectosActualizados = proyectos.map(
                proyectoState => proyectoState._id === data._id ? data : proyectoState
            )

            setProyectos(proyectosActualizados);

           //Mostrar Alerta
           setAlerta({msg:'Proyecto Actualizado Correctamente'});

           //Redireccionar

            setTimeout(() => {
                setAlerta({});
                navigate('proyectos');
            }, 1500);
        } catch (error) {
            setAlerta({msg:error.message.data.msg, error:true});
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.post('/proyectos', proyecto, config)
           setProyectos([...proyectos, data])

            setAlerta({msg:'Proyecto Creado Correctamente'});

            setTimeout(() => {
                setAlerta({});
                navigate('proyectos');
            }, 1500);
        } catch (error) {
            setAlerta({msg:error.message.data.msg, error:true});
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data);
            setAlerta({})

        } catch (error) {
            navigate('/proyectos')
            setAlerta({msg:error.response.data.msg, error:true});
            setTimeout(() => {
                setAlerta({})
            }, 1500);
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
           const proyectosActualizados = proyectos.filter(
            proyectoState => proyectoState._id !== id
            )

            setProyectos(proyectosActualizados);
           setAlerta({msg:data.msg});

           setTimeout(() => {
               setAlerta({});
               navigate('proyectos');
           }, 1500);
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        if(tarea?.id){
            await editarTarea(tarea);
        }else{
            await crearTarea(tarea);
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.post('/tareas', tarea, config)
            //Agrega la tarea al state, pero sólo para el que la crea

            setAlerta({})
            setModalFormularioTarea(false)

            //Socket IO para agregarlo a todas las personas conectadas en ese proyecto
            socket.emit('nueva tarea', data)

        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            // * Socket IO
            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({msg:data.msg})
            setModalEliminarTarea(false)

            // * Socket IO
            socket.emit('eliminar tarea', tarea)

            setAlerta({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({msg:error.response.data.msg, error:true});
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({msg:data.msg})
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 1500);
        } catch (error) {
     
            setAlerta({msg:error.response.data.msg, error:true})
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador);
    }
    
    const eliminarColaborador = async () => {
         try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
           const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id:colaborador._id} , config)
            

           const proyectoActualizado = {...proyecto}
           proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({msg:data.msg})
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 1500);

        } catch (error) {
            setAlerta({msg:error.response.data.msg, error:true});
        }
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)

            setAlerta({})
            setTarea({})

            // * Socket IO
            socket.emit('cambiar tarea', data)
            
        } catch (error) {
            
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    const submitTareasProyectos = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

         setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
         setProyecto(proyectoActualizado)
    }

    const editarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    
    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = {...proyecto};
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesion = () => {
        setProyectos([])
        setProyecto({})
        setAlerta([])

    }

    return (
        <ProyectosContext.Provider value={{ proyectos, mostrarAlerta, alerta, submitProyecto, obtenerProyecto, proyecto, cargando, eliminarProyecto, handleModalEditarTarea, modalFormularioTarea, handleModalTarea, submitTarea, setModalFormularioTarea, tarea, handleModalEliminarTarea, modalEliminarTarea, eliminarTarea, submitColaborador, colaborador, agregarColaborador, handleModalEliminarColaborador, modalEliminarColaborador, eliminarColaborador, completarTarea, buscador, handleBuscador, submitTareasProyectos, eliminarTareaProyecto, editarTareaProyecto, cambiarEstadoTarea, cerrarSesion }}>
            {children}
        </ProyectosContext.Provider>
    )		
}
export default ProyectosContext;