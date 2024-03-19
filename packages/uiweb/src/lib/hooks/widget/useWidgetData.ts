import { useContext } from "react";
import { WidgetDataContext } from "../../context";
import { IWidgetDataContextValues } from "../../context/widgetContext";

export const useWidgetData = (): IWidgetDataContextValues => {
  const context = useContext(WidgetDataContext);
  if (!context) {
    throw new Error('useWidgetData must be used within a WidgetDataProvider');
  }
  return context;
}