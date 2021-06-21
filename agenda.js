"use strict";

const d = document,
    $contactos = d.querySelector(".lista-contactos"),
    $registrarContacto = d.querySelector(".form-registro"),
    $title = d.querySelector(".title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment(),
    $btnSend = d.getElementById('enviar');

const ajax = (options) => {
    let {url, method, succes, error, data} = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState !== 4) {
            return
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            succes(json);
        } else {
            let message = xhr.statusText || 'Ocurrio un error';
            error(`Error ${xhr.status}: ${message}`);
        }
    });

    xhr.open(method || 'GET', url);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.send(JSON.stringify(data));
}

const getContact = () => {
    ajax({
        method: 'GET',
        url: 'http://localhost:7000/contactos',
        succes: (res) => {
            res.forEach(contact => {
                $template.querySelector('.nombre').textContent = contact.nombre;
                $template.querySelector('.apellido').textContent = contact.apellido;
                $template.querySelector('.telefono').textContent = contact.telefono;
                $template.querySelector('.email').textContent = contact.email;
                $template.querySelector('.editar').dataset.id = contact.id;
                $template.querySelector('.editar').dataset.nombre = contact.nombre;
                $template.querySelector('.editar').dataset.apellido = contact.apellido;
                $template.querySelector('.editar').dataset.telefono = contact.telefono;
                $template.querySelector('.editar').dataset.email = contact.email;
                $template.querySelector('.eliminar').dataset.id = contact.id;
                $template.querySelector('.eliminar').dataset.nombre = contact.nombre;

                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });
            $contactos.querySelector('tbody').appendChild($fragment)
        },
        error: (err) => {
            $contactos.insertAdjacentHTML('afterend', `<h3 class="error">${err}</h3>`);
        },
        data: null
    });
}

d.addEventListener('DOMContentLoaded', getContact);

d.addEventListener('submit', (e) => {
    if (e.target === $registrarContacto) {
        e.preventDefault()

        if (!e.target.id.value) {
            ajax({
                url: 'http://localhost:7000/contactos',
                method: 'POST',
                succes: (res) => {
                    location.reload();
                },
                error: (err) => {
                    $contactos.insertAdjacentHTML('afterend', `<h3 class="error">${err}</h3>`);
                },
                data: {
                    nombre: e.target.nombre.value,
                    apellido: e.target.apellido.value,
                    telefono: e.target.telefono.value,
                    email: e.target.email.value
                }
            });
        } else {
            ajax({
                url: `http://localhost:7000/contactos/${e.target.id.value}`,
                method: 'PUT',
                succes: (res) => {
                    location.reload()
                },
                error: (err) => {
                    $contactos.insertAdjacentHTML('afterend', `<h3 class="error">${err}</h3>`);
                },
                data: {
                    nombre: e.target.nombre.value,
                    apellido: e.target.apellido.value,
                    telefono: e.target.telefono.value,
                    email: e.target.email.value
                }
            });
        }
    }
});

d.addEventListener('click', (e) => {

    if (e.target.matches('.editar')) {
        $title.textContent = 'Editar Contacto';
        $btnSend.value = 'Actualizar';
        $registrarContacto.nombre.value = e.target.dataset.nombre;
        $registrarContacto.apellido.value = e.target.dataset.apellido;
        $registrarContacto.telefono.value = e.target.dataset.telefono;
        $registrarContacto.email.value = e.target.dataset.email;
        $registrarContacto.id.value = e.target.dataset.id;
    }
    if (e.target.matches('.eliminar')) {
        let eliminar = confirm(`¿Estas seguro de eliminar el contacto ${e.target.dataset.nombre}`);

        if (eliminar) {
            ajax({
                url: `http://localhost:7000/contactos/${e.target.dataset.id}`,
                method: 'DELETE',
                succes: (res) => {
                    location.reload();
                },
                error: (err) => {
                    $contactos.insertAdjacentHTML('afterend', `<h3 class="error">${err}</h3>`);
                }
            });
        }
    }

});