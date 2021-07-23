import {Styles} from "react-modal";

export const customStyles: Styles = {
  content: {
    background: "none",
    inset: "unset",
    border: "none",
    borderRadius: 0,
    padding: 0
  },
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(25, 25, 25, 0.7)",
    position: "fixed",
    inset: 0
  }
};