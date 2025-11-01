  const API_URL = 'https://jsonplaceholder.typicode.com/todos'

  export const fetchTodos = async ()=>{
    const res = await fetch(API_URL)
    if(!res.ok){
        throw new Error("Failed to fetch")
    }
    return res.json()
  }

  export const addTodo = async (text) =>{
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: text,
            completed: false,
            userId: 1
        })
    })

    if(!res.ok){
        throw new Error("Failed to Add");
        
    }
    return res.json()
  }


export const toggleTodo = async (id, completed) =>{
    const res  = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({completed})
    })

    if(!res.ok){
        throw new Error("Failed to Update");
        
    }
    return res.json()
}

export const deleteTodo  = async (id) =>{
    const res = await fetch(`${API_URL}/${id}`,{
        method: 'DELETE',
    })
    if(!res.ok){
        throw new Error("Failed to Delete");
        
    }
    return true
}

