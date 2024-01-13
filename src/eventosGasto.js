import cargarGastos from "./cargarGastos";
import cargarTotalGastado from "./cargarTotalGastado";
import { abrirFormularioGasto } from "./eventoBtnFormularioGasto";

const contenedorGastos = document.getElementById('gastos');
contenedorGastos.addEventListener('click', (e) => {
    const gasto = e.target.closest('.gasto');
    //Click en el gasto
    if (gasto) {
        if (gasto.scrollLeft > 0) {
            gasto.querySelector('.gasto__info').scrollIntoView({ //CERRAR SCROLL
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest'
            });
        } else {
            gasto.querySelector('.gasto__acciones').scrollIntoView({ //ABRIR SCROLL
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest'
            });
        }
    }

    //Click editar gasto
    if (e.target.closest('[data-accion="editar-gasto"]')) {
        //obtenemos el id del gasto que queremos editar.
        const id = gasto.dataset.id;
        //obtenemos los gastos guardados
        const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos')); //transformamos a obj de js
        let precio = '';
        let descripcion = '';

        //Comprovamos si hay gastos guardados
        if (gastosGuardados && gastosGuardados.length > 0) {
            gastosGuardados.forEach((gasto) => {
                if (gasto.id === id) {
                    precio = gasto.precio;
                    descripcion = gasto.descripcion;

                }
            });

            //Ponemos descripcion y precio a los input
            document.querySelector('#formulario-gasto #descripcion').value = descripcion;
            document.querySelector('#formulario-gasto #precio').value = precio;
            document.querySelector('#formulario-gasto').dataset.id = id;
            abrirFormularioGasto('editarGasto');

        }
    }

    //Borrar gasto
    if (e.target.closest('[data-accion="eliminar-gasto"]')) {
        //obtenemos el id
        const id = e.target.closest('.gasto').dataset.id;

        //Obtener los datos guardados
        const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));
        if (gastosGuardados) {
            const nuevosGastos = gastosGuardados.filter((gasto) => {
                if (gasto.id !== id) {
                    return gasto;
                }
            });
            window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));

        }

        cargarGastos();
        cargarTotalGastado();
    }

});