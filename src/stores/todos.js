import { defineStore } from "pinia";
import {ref, computed} from 'vue'

import { fetchTodos, addTodo,toggleTodo, deleteTodo } from "@/api/todos";

export const useTodoStore = defineStore('todos', ()=>{
    // State
    const todos = ref([])
    const loading = ref(false)
    const error = ref(null)

    //computed

    const completedCount = computed(()=>todos.value.filter(todo=> todo.completed).length)

    //Actions
    const loadTodos = async ()=>{
        loading.value = true
        error.value = null
        try{
            const data = await fetchTodos()
            console.log('Fetched data:', data)
            todos.value = data.slice(1,10)
        }catch(err){
            error.value = err.message
        }finally{
            loading.value = false
        }
    }
    
    const addNewTodo = async (text)=>{
        if(!text.value.trim()){
            return
        }
        loading.value = true
        try{
            const newTodo = await addTodo(text)
            todos.value.unshift(newTodo)
            return true
        }catch(error){
            error.value = 'Failed to add'
            return false
        }finally{
            loading.value = false
        }
    }

    const toggle = async (id, completed)=>{
        const todo = todos.value.find(todo => todo.id === id)
        if(!todo){
            return
        }
        const old = todo.completed
        todo.completed = completed

        try{
            await toggleTodo(id, completed)
        }catch{
            todo.completed = old
            error.value = 'Failed to Update'
        }
    }

    const remove = async (id)=>{
        const index = todos.value.findIndex(todo=> todo.id === id)
        if(index === -1){
            return
        }
        todos.value.splice(index, 1)

        try{
            await deleteTodo(id)
        }catch{
            error.value = 'Failed to delete'
        }
    }


    return {todos, loading, error, completedCount, loadTodos, addNewTodo, toggle, remove}
    
})

