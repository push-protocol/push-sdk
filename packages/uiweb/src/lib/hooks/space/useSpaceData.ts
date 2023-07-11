import { useContext } from "react";
import { ISpaceDataContextValues } from "../../context/spacesContext";
import { SpaceDataContext } from "../../context";

export const useSpaceData = (): ISpaceDataContextValues => {
  const context = useContext(SpaceDataContext);
  if (!context) {
    throw new Error('useSpaceData must be used within a SpaceDataProvider');
  }
  return context;
}