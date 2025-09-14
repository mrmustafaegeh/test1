import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    login: async (username, password) => {
        set({loading: true});
        try {
            const res = await axios.post("auth/login", {username, password});
            set({user: res.data, loading: false});
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "ERROR Something went wrong");
        }
    },
    logout: async () => {
        try {
            await axios.post("auth/logout");
            set({user: null});
        } catch (error) {
            toast.error(error.response.data.message || "ERROR Something went wrong");
        }
    },
    checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/getuser");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
}));