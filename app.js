//Tomo elementos de mi HTML.
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    fetchData()

//Pregunto si hay algo en el carrito

    //SIN OPERADOR AND 

    /*if(localStorage.getItem('carrito')) { 
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }*/

    //CON OPERADOR AND
    localStorage.getItem('carrito') && (carrito = JSON.parse(localStorage.getItem('carrito'))) && pintarCarrito()        
})
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

// Traer productos
const fetchData = async() => {
    try {
        const res = await fetch('api.json') //Conecto a mi archivo JSON.
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
      templateCard.querySelector('h6').textContent = producto.title
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
      templateCard.querySelector('button').dataset.id = producto.id
      
    
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
//Accion de añadir al carrito
const addCarrito = e => {
    if(e.target.classList.contains('btn-outline-dark')) {

        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-outline-dark').dataset.id,
        title: objeto.querySelector('h6').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
      templateCarrito.querySelector('th').textContent = producto.id
      templateCarrito.querySelectorAll('td')[0].textContent = producto.title
      templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
      templateCarrito.querySelector('.btn-outline-light').dataset.id = producto.id
      templateCarrito.querySelector('.btn-outline-danger').dataset.id = producto.id
      templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
      const clone = templateCarrito.cloneNode(true)
      fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))//guardo en storage lo que este en el carrito.
    
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) { //Consulto si el carrito esta vacio
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    //Accion que se ejecuta al precionar vaciar carrito con su respectivo sweet alert.
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        swal("Su carrito se encuentra vacio!", "Comienze a comprar!");
    })
    //Accion que se ejecuta al precionar Finalizar compra con su respectivo sweet alert.
    const btnFinalizar = document.getElementById('FinalizarCompra')
    btnFinalizar.addEventListener('click', () => {
       
         swal("Esta seguro que desea finalizar su compra?", {
            buttons: {
              cancel: "Cancelar",
              catch: {
                text: "Finalizar Compra",
                value: "terminar",
              },  
            },
          })
          .then((value) => {
            switch (value) {
              case "terminar":
                swal({
                    icon: 'success',
                    title: 'Pedido Finalizado',
                    text: 'Gracias por su compra!',
                    showConfirmButton: false,
                    timer: 2000
                })
                carrito = {}
                pintarCarrito()
                break; 
            }
          });
    })
}

const btnAccion = e => {
       //Accion de aumentar unidades productos en el carrito.
    if(e.target.classList.contains('btn-outline-light')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++//uso Operador ++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()        
    }

    //Accion restar unidades de productos en carrito.
    if(e.target.classList.contains('btn-outline-danger')) {
        const producto = carrito[e.target.dataset.id] 
        producto.cantidad-- //uso operador -- (menos menos)
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}




