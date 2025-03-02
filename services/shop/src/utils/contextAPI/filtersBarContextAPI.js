import { createContext, useState, useContext } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FiltersContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
