import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useImageStore = create((set, get) => ({
  images: [],
  loading: false,
  getImages: async ({
    search = "",
    excludeSubfolders = [],
    includeMain = true,
  } = {}) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (excludeSubfolders.length)
        params.append("excludeSubfolders", excludeSubfolders.join(","));
      params.append("includeMain", includeMain);

      const res = await axios.get(`image?${params.toString()}`);
      set({ images: res.data, loading: false });
      return res.data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
      throw error;
    }
  },
  renameImage: async (id, newName) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`image/${id}`, { newImageName: newName });
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
      throw error;
    }
  },
  saveImage: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.post(`image/${id}/save`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "ERROR Something went wrong");
      throw error;
    }
  },
  removeImage: async (id) => {
    set({ loading: true });
    try {
      //This is not deleteing, only rename the image with prefix "removed"
      const res = await axios.post(`image/${encodeURIComponent(id)}/remove`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "ERROR Something went wrong");
      throw error;
    }
  },
}));
