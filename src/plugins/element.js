import { ElButton, ElContainer, ElInput, ElMenu, ElMenuItem, ElMenuItemGroup, ElSubmenu } from 'element-plus';

const components = [ ElContainer, ElMenu, ElMenuItem, ElMenuItemGroup, ElSubmenu, ElButton, ElInput ];

export default (app) => {
	components.forEach((component) => {
		app.use(component);
	});
};
