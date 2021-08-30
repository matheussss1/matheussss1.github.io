const fetchAPI = async (url, options={}) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

const options = {
    method: 'GET',
    ContentType: 'application/json',
}

const open_modal_noticia = ({target}) => {
    fetchAPI(`https://powerful-journey-41116.herokuapp.com/post/${target.id}`, options)
        .then(data => [data.body, data.titulo])
}

const open_modal_listener = () => {
    const elements = Array.from(document.querySelectorAll("a[id^='post#']"))
    elements.forEach(e => {
        e.addEventListener('click', () => {
            const path = e.id.replace('post#', '');
            fetchAPI(`https://powerful-journey-41116.herokuapp.com/post/${path}`, options)
            .then(data => {
                const overlay = document.getElementById('overlay');
                const modal = document.getElementById('modal');
                const modal_content = document.getElementById('modal__content');
                const titulo = document.getElementById('modal__titulo');
                overlay.style.display = 'block';
                modal.style.display = 'block';
                modal_content.innerHTML = data.body;
                titulo.innerHTML = data.titulo; 
            })
        })
    });
}

const close_modal_listener = () => {
    document.addEventListener('click', ({target}) =>{
        target.id === 'overlay' && (() => {
            document.getElementById('overlay').style.display = 'none'
            document.getElementById('modal').style.display = 'none'
        })()
    })
}

const add_listeners = () => {
    open_modal_listener();
    close_modal_listener();
}

const list_posts = () => {
    fetchAPI('https://powerful-journey-41116.herokuapp.com/posts/', options)
    .then(data => {
        data.map(e => {
            const status = e.status == 'R'? 'Rascunho' : 'Postado';
            document.querySelector('.post').innerHTML += 
                `<tr>
                    <td><a id=post#${e.slug} class="modal__link">${e.titulo}</a></td>
                    <td>${e.autor['first_name']}</td>
                    <td>${e.criado}</td>
                    <td>${e.atualizado}</td>
                    <td>${status}</td>
                </tr>`;
        })
        add_listeners();
    });
}

const init = () => {
    list_posts();
}

init();