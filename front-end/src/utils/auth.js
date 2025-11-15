export const isLogged = () => !!localStorage.getItem("ft_token");
export const getToken = () => localStorage.getItem("ft_token");
