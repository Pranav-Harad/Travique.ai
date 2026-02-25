import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Since Clerk manages auth tokens dynamically, we must fetch the token 
// at the component level inside the components that call our APIs 
// by using Clerk's `useAuth().getToken()` hook and passing it in the request.

export default api;
