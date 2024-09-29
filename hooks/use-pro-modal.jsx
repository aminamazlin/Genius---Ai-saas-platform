import { create } from "zustand";

export const useProModalStore = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));


//create is a method that creates the store --> takes as argument a function.
//func receives set, a method that updates the store's state.
//isOpen, inital value.
//onOpen, defines a method to update the state when called.
//OnOpen, defines a method that will be available to components to update the state.