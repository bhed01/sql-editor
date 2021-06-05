export const getCurrentTab = (tabs, id) => {
	return tabs.find((tab) => tab.id === id);
};
