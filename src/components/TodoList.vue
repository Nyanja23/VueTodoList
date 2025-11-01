<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todos';

const store = useTodoStore()

// const {todos, loading, error, completedCount, loadTodos, addNewTodo, toggle, remove} = store

const {todos, loading, error, completedCount, loadTodos, addNewTodo, toggle, remove} = store


const newTodoText  = ref('')
const addTodo = async()=>{
    const success = await addNewTodo(newTodoText.value)
    if(success){
        newTodoText.value = ''
    }
}

onMounted(()=>{
    console.log('Loading Todos')
    loadTodos()
})
</script>


<template>
    <div class="card">
        <div class="card-body">
            <h1 lass="list-group-item d-flex justify-content-between align-items-center">
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
                    @keyup.enter="addTodo"
                    :disabled="loading"
                    class="form-control"
                    placeholder="New todo..."
                    >
                 </div>

                 <!-- List -->
                  <ul class="list-group">
                    <li
                    v-for="todo in store.todos"
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
                            :disabled="store.loading"
                            @click="remove(todo.id)"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                  </ul>


                  <!-- Summary -->

                  <div class="alert alert-info mt-3">
                    <strong>{{ completedCount }} of <strong>{{ store.todos.length }}</strong> completed</strong>
                  </div>
             </div>
            
        </div>
    </div>
</template>
