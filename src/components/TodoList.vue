<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import { fetchTodos,addTodo,toggleTodo,deleteTodo } from '@/api/todos';

const todos = reactive([])
const newTodoText = ref('')
const loading = ref(false)
const error = ref(null)

onMounted(()=>{
    loadTodos()
})

const loadTodos = async ()=>{
    loading.value = true
    error.value = null

    try{
        const data = await fetchTodos()
        todos.length = 0
        // We want to get like only 10 todos from the api
        data.slice(0,10).forEach(todo => todos.push(todo)) //slice makes a copy of the original array.
    }
    catch (err){
        err.value = err.message
    }finally{
        loading.value = false
    }
}

const addTodos = async ()=>{
    if(!newTodoText.value.trim()){
        return
    }
    loading.value = true
    try{
        const newTodo = await addTodo(newTodoText.value)
        todos.unshift(newTodo)
        newTodoText.value = ''

    }catch(err){
        error.value = 'Failed to Add Todo'
    }finally{
        loading.value = false
    }
}

const toggle = async (id, completed) =>{
    const todo = todos.find(todo => todo.id === id)
    if(!todo){
        return
    }
    const old = todo.completed 
    todo.completed = completed

    try{
        await toggleTodo(id, completed)
    }catch{
        todo.completed = old //Revert
        error.value = 'Failed to Update'
    }
}

const remove = async (id)=>{
    const index = todos.findIndex(todo => todo.id === id)
    if(index === -1){
        return
    }
    todos.splice(index,1)

    try{
        await deleteTodo(id)
    }catch{
        error.value = 'Failed to Delete'
    }
}
const completedTodos = computed(()=>{
    return todos.filter(todo=> todo.completed).length
})
</script>


<template>
    <div class="card">
        <div class="card-body">
            <h1 class="card-title d-flex justify-content-between align-items-center">
                Todos From Api
                <button @click="loadTodos" class="btn btn-success btn-sm">Refresh</button>
            </h1>
            <!-- Loading  -->

            <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Error -->
             <div v-else-if="error" class="alert alert-danger">
                {{ error }}
                <button @click="loadTodos" class="btn btn-sm btn-link">Retry

                </button>
             </div>
            <!-- Todos -->
             <div v-else>
                <!-- Add Form -->
                 <div class="mb-3">
                    <input 
                    v-model="newTodoText"
                    @keyup.enter="addTodos"
                    :disabled="loading"
                    class="form-control"
                    placeholder="New todo..."
                    >
                 </div>

                 <!-- List -->
                  <ul class="list-group">
                    <li
                    v-for="todo in todos"
                    :key="todo.id"
                    class="list-group-item d-flex justify-content-btween align-ittems-center"
                    :class="{'text-decoration-line-through text-muted': todo.completed}"
                    >
                        <span>{{ todo.title }}</span>

                        <div>
                            <button
                             @click="toggle(todo.id, !todo.completed)"
                             class="btn btn-sm me-2"

                             :class="todo.completed ? 'btn-success': 'btn-outline-secondary'"
                             :disabled="loading"
                            >
                            {{ todo.completed? 'Done': 'Pending' }}

                            </button>
                            <button class="btn btn-sm btn-danger"
                            :disabled="loading"
                            @click="remove(todo.id)"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                  </ul>


                  <!-- Summary -->

                  <div class="alert alert-info mt-3">
                    <strong>{{ completedTodos }} of <strong>{{ todos.length }}</strong> completed</strong>
                  </div>
             </div>
            
        </div>
    </div>
</template>
