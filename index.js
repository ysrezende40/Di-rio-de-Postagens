const formCriaPost = document.querySelector('form');
const listaDePost = document.querySelector('.listaDePost');
const inputEdit = document.querySelector('.textoParaEdicao');
inputEdit.style.display = 'none';
const btnSalvar = document.querySelector('.salvar');
btnSalvar.style.display = 'none';
const formSelecionarPerfil = document.querySelector('.Selecionar-Perfil');
let perfilSelecionado = null;
const caixaPerfil = document.querySelector('.Caixa-perfil');
const caixaCriaPerfil = document.querySelector('.caixa-cria-novo-perfil');





const tarefas = {
    usuarios: [
        {
           idUser: 1,
           username: "ysaac rezende",
        },
        {
            idUser: 1,
            username: "lucas",
        }
    ],
    post: [
        {
           idPoster: 1,
           criador: "ysaac rezende",
           content: "meu post",
        },
        {
            idPoster: 2,
            criador: "lucas",
            content: "vasco",
         }
    ]
}


function criaPost(criadorREC, contentREC) {
    const newId = tarefas.post.length + 1; 
    tarefas.post.push({
        idPoster:  newId,
        criador: criadorREC,
        content: contentREC
    });
    tarefas.usuarios.push({
        idUser : newId,
        username : criadorREC
    })

    console.log(tarefas.post);
    
}

//read
function renderizarPosts(username) {  
    listaDePost.innerHTML = ''; 
    

    tarefas.post.forEach(post => {
        if (post.criador === username) {
            const novoItemLista = document.createElement('li');
            novoItemLista.textContent = post.content;
           
            listaDePost.insertAdjacentHTML("afterbegin", 
                `<li data-id="${post.idPoster}">
                <button class='btn-delete'>EXCLUIR</button>
                <span class="spn-edit" data-id="${post.idPoster}">
                  ${post.content.toUpperCase()}
                </span>
                <button class='btn-edit'>EDITAR</button>
                </li>`);
        }
    });
}



//create
formCriaPost.addEventListener('submit', function EvitarRecarregamento(posts){

    var campoEntrada = document.querySelector('.campoEntrada');

    if (campoEntrada.value.trim() === "") {
        posts.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Por favor, preencha o campo antes de enviar o post.',
            showConfirmButton: false,
            timer: 1900
        });
        campoEntrada.value = "";
        return false; 
    }
    else{
       
        if(ValidaFormularioPerfil() == true){

            posts.preventDefault();
            var id = null;
        
            tarefas.post.forEach((post)=>{
              id = post.idPoster +1;
            })
            
            const campoPosts = document.querySelector('input[name="campoEntrada"]').value;
            criaPost(perfilSelecionado, campoPosts);
            
            const listaDePost = document.querySelector('.listaDePost');
            listaDePost.insertAdjacentHTML("afterbegin", 
            `<li data-id="${id}">
            <button class='btn-delete'>EXCLUIR</button>
            <span class="spn-edit" data-id"${id}">
              ${campoPosts.toUpperCase()}
            </span>
            <button class='btn-edit'>EDITAR</button>
           
            </li>`);
        
           const Limpa = document.querySelector('input[name="campoEntrada"]');
           
           Limpa.value = ""; 
        }
        else {
            posts.preventDefault();
            Swal.fire({
                icon: 'warning',
                title: 'Selecione um perfil antes.',
                showConfirmButton: false,
                timer: 1500
            });
            campoEntrada.value = "";
        }
        
    }
 

});

//delete
listaDePost.addEventListener('click',function(infodoEvento){
    const elementoClicado = infodoEvento.target;
    const deletou = infodoEvento.target.classList.contains('btn-delete');
    

    btnSalvar.style.display = 'none';
    inputEdit.style.display = 'none';

    
    
    if(deletou){
        
        Swal.fire({
            title: "Você Tem Certeza?",
            text: "Você não poderá reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Excluído!",
                text: "Seu post foi excluído.",
                icon: "success"
              });

              elementoClicado.parentNode.remove();
              const id = elementoClicado.parentNode.getAttribute('data-id');
              apagaPost(id);
              console.log(tarefas.post);

            }
          });

      

    }    

});

//delete array
function apagaPost(id) {
    const postsFiltrados = tarefas.post.filter((post) => {
        return post.idPoster !== Number(id);
    });

    if (postsFiltrados.length !== tarefas.post.length) {
        tarefas.post = postsFiltrados;
        console.log("O post de ID " + id + " foi deletado");
    } else {
        console.log("Post não encontrado");
    }
}

//update:
listaDePost.addEventListener('click',function(infodoEvento){
    const elementoClicado = infodoEvento.target;
    console.log(elementoClicado);
    const editou = infodoEvento.target.classList.contains('btn-edit');

    if(editou){

        inputEdit.style.display = 'block';

     
        btnSalvar.style.display = 'block';

        
        let id = elementoClicado.parentNode.getAttribute('data-id');

        console.log("id do post" + id);

        

        btnSalvar.addEventListener('click', function () {
            const textoDigitado = inputEdit.value;

            const textoAtual = document.querySelector(`[data-id="${id}"] .spn-edit`).textContent;
            inputEdit.value = textoAtual;
            
            
            editarConteudoArray(id, textoDigitado);

           
            inputEdit.value = '';
            inputEdit.style.display = 'none';
            btnSalvar.style.display = 'none';

            id = null;

        });
        
    }
    
    
    
});


function editarConteudoArray(id, novoConteudo) {
    const elementoSpan = document.querySelector(`[data-id="${id}"] .spn-edit`);

    if (elementoSpan) {  
        tarefas.post.forEach(post => {
            if (post.idPoster === Number(id)) {
                post.content = novoConteudo;
            }
        });

        elementoSpan.textContent = novoConteudo;

        
    }
}


//form de seleção de usuário:
formSelecionarPerfil.addEventListener('submit', function(event) {
    event.preventDefault();

    const radios = document.getElementsByName('perfil');
   
   
    
    for (const radio of radios) {
        if (radio.checked) {
            const labelFor = radio.getAttribute('id');
            perfilSelecionado = document.querySelector(`label[for="${labelFor}"]`).textContent.trim();
            
            window.addEventListener('load', renderizarPosts(perfilSelecionado));
            break;
        }
    }



    const h2 = document.querySelector('.H2-criador');
    h2.innerHTML = "Criador: " + (h2.innerHTML = perfilSelecionado);    

});



//valida se um perfil foi selecionado
function ValidaFormularioPerfil(){
    const radios = document.querySelectorAll('input[name="perfil"]');
    const radioSelecionado = Array.from(radios).some(radio => radio.checked);
    const mensagem = document.querySelector('.informacao');
    caixaPerfil.classList.remove('oculto');

    if (radioSelecionado) {
        mensagem.textContent = '';
        return true;
      
    
    } else {  
        mensagem.textContent = 'Selecione um perfil antes de continuar.';
        return false;
    }
}

function MostraFormulario(event){
   event.preventDefault();
   caixaCriaPerfil.classList.remove("oculto-cria-perfil");
}

function CriaPerfil(event){
    event.preventDefault();

    const verificaInput = document.querySelector('.input-cria-perfil');
    const haTexto = verificaInput.value;
    const mensagem = document.querySelector('.informacao-cria-perfil');
    mensagem.style.display = 'block';

     if(haTexto !== ""){
        const novoInput = document.createElement("input");
        novoInput.classList.add("Selecionar-Perfil");
        novoInput.type = "radio";
        novoInput.id = haTexto;
        novoInput.name = "perfil";

    
        const novaLabel = document.createElement("label");
        novaLabel.classList.add("Selecionar-Perfil");
        novaLabel.setAttribute("for", novoInput.id);
        novaLabel.textContent = haTexto;
    
        
        formSelecionarPerfil.appendChild(novaLabel);
        formSelecionarPerfil.appendChild(novoInput);
    
    
        formSelecionarPerfil.insertBefore(novoInput, formSelecionarPerfil.firstElementChild);
        formSelecionarPerfil.insertBefore(novaLabel, formSelecionarPerfil.firstElementChild);

        caixaCriaPerfil.classList.add("oculto-cria-perfil");
        const caixaPerfil = document.querySelector('.Caixa-perfil');
        caixaPerfil.classList.remove('oculto');

        verificaInput.value = "";

        Swal.fire({
            icon: 'success',
            title: 'Perfil criado com sucesso',
            showConfirmButton: false,
            timer: 15000
        });
     }
     else{
        mensagem.textContent = 'Insira um nome valido.';
     }

}


window.addEventListener('load', renderizarPosts(perfilSelecionado));


