import React from 'react'
import { useForm, FormProvider } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { instanse, postApi } from '../../API/api';
import { isExpired, decodeToken } from "react-jwt";
import { useAppDispatch, useAppSelector } from '../../hook/hook';
import { fetchPosts } from '../../Redux/PostSlice/postsSlice';

type Props = {}

const AddPost = (props: Props) => {
   let dispatch = useAppDispatch()
   let [complete, setComplete] = useState(false)
   let user = useAppSelector(state => state.userReducer)

   const methods = useForm();
   const { handleSubmit } = methods

   // type formData = {
   //    title: string,
   //    content: string,
   //    status: "published" | "draft"
   // }

   const onSubmit = (data: any) => {
      let excerpt = data.content.slice(0, 100) + '...'
      let status = "published"
      let slug = data.title.split(' ').join('-')

      postApi.addPost(data.title, user.id, excerpt, data.content, data.status, slug, "new")
         .then((res) => {
            setComplete(true)
            dispatch(fetchPosts())
         })

   }

   if (complete) { return <Navigate to="/new" /> }
   return (
      <div>
         <FormProvider {...methods} >
            <form onSubmit={handleSubmit(onSubmit)}>
               <p>
                  <label htmlFor="title">title:</label>
                  <input placeholder="title" id="title" type="text"  {...methods.register('title', { required: true })} />
               </p>
               <p>
                  <label htmlFor="content">content:</label>
                  <textarea placeholder="content" id="content" {...methods.register('content', { required: true })} />
               </p>
               <p>
                  <label htmlFor="status">status:</label>
                  <select id="status" {...methods.register('status', { required: true })}>
                     <option value="published">published</option>
                     <option value="draft">draft</option>
                  </select>
               </p>
               {methods.formState.errors.title?.type === 'required' && <p >title is required</p>}
               <button>Добавить</button>
            </form>
         </FormProvider>
      </div>
   )
}

export default AddPost