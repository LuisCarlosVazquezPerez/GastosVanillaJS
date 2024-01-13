import { v4 as uuidv4 } from 'uuid';
import { cerrarFormularioGasto } from './eventoBtnFormularioGasto';
import cargarGastos from './cargarGastos';
import cargarTotalGastado from './cargarTotalGastado';


const formulario = document.querySelector('#formulario-gasto form');
const descripcion = formulario.descripcion; //por el name y el id input=descripcion
const precio = formulario.precio;


const expRegDescripcion = /^[a-zA-Z0-9\_\- ]{4,30}$/;
const expRegPrecio = /^\d+(\.\d+)?$/;

const comprobarDescripcion = () => {
    if (!expRegDescripcion.test(descripcion.value)) { //se utiliza para verificar si una cadena de texto coincide con una expresión regular.
        descripcion.classList.add('formulario-gasto__input--error');

        formulario.descripcion.parentElement.querySelector('.formulario-gasto__leyenda') //ACCEDEMOS AL PADRE Y LUEGO DEL PADRE BUSCAMOS formulario-gasto__leyenda
            .classList.add('formulario-gasto__leyenda--active');

        return false
    } else {
        descripcion.classList.remove('formulario-gasto__input--error');

        formulario.descripcion.parentElement.querySelector('.formulario-gasto__leyenda') //ACCEDEMOS AL PADRE Y LUEGO DEL PADRE BUSCAMOS formulario-gasto__leyenda
            .classList.remove('formulario-gasto__leyenda--active');

        return true;

    }

};

const comprobarPrecio = () => {
    if (!expRegPrecio.test(precio.value)) { //se utiliza para verificar si una cadena de texto coincide con una expresión regular.
        precio.classList.add('formulario-gasto__input--error');

        formulario.precio.parentElement.querySelector('.formulario-gasto__leyenda') //ACCEDEMOS AL PADRE Y LUEGO DEL PADRE BUSCAMOS formulario-gasto__leyenda
            .classList.add('formulario-gasto__leyenda--active');

        return false
    } else {
        precio.classList.remove('formulario-gasto__input--error');

        formulario.precio.parentElement.querySelector('.formulario-gasto__leyenda') //ACCEDEMOS AL PADRE Y LUEGO DEL PADRE BUSCAMOS formulario-gasto__leyenda
            .classList.remove('formulario-gasto__leyenda--active');

        return true;

    }

};


//EVENTO CUANDO LOS INPUT PIERDEN EL FOCO
descripcion.addEventListener('blur', (e) => comprobarDescripcion());  //?cuando el usuario pierde el foco

descripcion.addEventListener('keyup', (e) => {
    if ([...e.target.classList].includes('formulario-gasto__input--error')) { //?solo si hay mensaje de error se ejecuta el evento, puede borrar el valor y no se mostrara el mensaje
        comprobarDescripcion()
    };
});  //cuando el usuario levanta la tecla

precio.addEventListener('blur', (e) => comprobarPrecio());  //?cuando el usuario pierde el foco
precio.addEventListener('keyup', (e) => {
    if ([...e.target.classList].includes('formulario-gasto__input--error')) { //?solo si hay mensaje de error se ejecuta el evento, puede borrar el valor y no se mostrara el mensaje
        comprobarPrecio();
    };
});  //cuando el usuario levanta la tecla

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    //OBtenemos el modo del formulario
    const modo = formulario.closest('#formulario-gasto')?.dataset?.modo;

    //comprobamos que la descripcion y el precio esten correctos
    if (comprobarDescripcion() && comprobarPrecio()) {

        const nuevoGasto = {
            id: uuidv4(),
            fecha: new Date(),
            descripcion: descripcion.value,
            precio: precio.value
        }

        const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));

        if (modo === 'agregarGasto') {

            //Comrpobamos si hay gastos
            if (gastosGuardados) {
                //creamos una nueva lista de gastos que incluya el nuevo
                const nuevosGastos = [...gastosGuardados, nuevoGasto];
                window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
            } else {
                //agregamos el primer gasto
                window.localStorage.setItem('gastos', JSON.stringify([{ ...nuevoGasto }]));  //permite pasar un objeto y pasarlo a string
            }
        } else if (modo === 'editarGasto') {
            //obtener el id
            const id = document.getElementById('formulario-gasto').dataset.id;
            //get the descripcion and precio

            //get index to edit
            let indexGastoAEditar;
            if (id && gastosGuardados) {
                gastosGuardados.forEach((gasto, index) => {
                    if (gasto.id === id) {
                        indexGastoAEditar = index;
                    }
                });
            }

            //Hacemos la copia para editarla, make copy for edit
            const nuevosGastos = [...gastosGuardados]; //? HACEMOS UNA NUEVA COPIA
           
            nuevosGastos[indexGastoAEditar] = { //?ACCEDEMOS AL INDEX
                ...gastosGuardados[indexGastoAEditar], //?SOBRESCRIBIMOS LOS VALORES
                descripcion: descripcion.value,
                precio: precio.value
            };

            //remplazamos el local storage con los nuevos gastos.
            window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));

        }

        descripcion.value = '';
        precio.value = '';

        cargarGastos();
        cerrarFormularioGasto();
        cargarTotalGastado();
    }
});