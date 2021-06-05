import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Dashboard from '@/views/Dashboard';

const routes = [
	{
		path: '/',
		component: Home,
		children: [
			{
				path: '',
				name: 'Home',
				component: Dashboard
			},
			{
				path: 'editor/:id',
				name: 'Editor',
				props: true,
				component: () => import('../views/Editor.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue')
	},
	{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: () => import('../views/NotFound.vue')
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
