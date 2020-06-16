import React, { useEffect, useState } from "react";

import "./styles.css";
import api from './services/api'

function App() {
  const [repository, setRepository] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('https://github.com/')
  const [techs, setTechs] = useState('')
  
  useEffect(() => {
    const getRepositories = async () => {
      await api.get('/repositories')
      .then(res => setRepository(res.data))
      .catch(err => console.log(`Erro ao retornar dados: ${err}`))
    }

    getRepositories()       
  }, [])

  async function handleAddRepository() {
    const techsInArray = techs.trim().split(', ');

    await api.post('/repositories', {
      title,
      url,
      techs: techsInArray
    })
    .then(res => setRepository([...repository, res.data]))
    .catch(err => console.log(`Erro ao add dados: ${err}`))
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`)
      .then(() => {
        const novo = repository.filter(function(el) { 
          return el.id !== id; 
        });

        setRepository(novo)
      })
      .catch(err => console.log(`Erro ao deletar dados: ${err}`))
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repository.map(repo => (
            <li key={repo.id}>
              {repo.title}
              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          ))
        }

      </ul>

      <form>
        <input type="text"
        placeholder="Type the name"
        value={title}
        onChange={e => setTitle(e.target.value)}/>
        <input type="text"
        placeholder="Type the url"
        value={url}
        onChange={e => setUrl(e.target.value)}/>
        <input type="text"
        placeholder="Type the techs separated by comma"
        value={techs}
        onChange={e => setTechs(e.target.value)}/>
      </form>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
