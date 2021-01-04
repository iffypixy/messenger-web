import {useState} from "react";

export const useModal = () => {
  const [isModalOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {isModalOpen, openModal, closeModal};
};