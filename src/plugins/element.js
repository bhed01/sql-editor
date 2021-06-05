import {
	ElAlert,
	ElAvatar,
	ElButton,
	ElContainer,
	ElDialog,
	ElDropdown,
	ElDropdownItem,
	ElDropdownMenu,
	ElHeader,
	ElInput,
	ElMenu,
	ElMenuItem,
	ElMenuItemGroup,
	ElSubmenu,
	ElTabs,
	ElTabPane,
	ElTable,
	ElTableColumn
} from 'element-plus';

const components = [
	ElContainer,
	ElMenu,
	ElMenuItem,
	ElMenuItemGroup,
	ElDropdownMenu,
	ElSubmenu,
	ElDropdown,
	ElDropdownItem,
	ElButton,
	ElInput,
	ElAlert,
	ElAvatar,
	ElHeader,
	ElDialog,
	ElTabs,
	ElTabPane,
	ElTable,
	ElTableColumn
];

export default (app) => {
	components.forEach((component) => {
		app.use(component);
	});
};
