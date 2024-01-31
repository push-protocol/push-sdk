import { useContext } from "react";
import { NotificationWidgetDataContext } from "../../context";
import { INotificationWidgetDataContextValues } from "../../context/notificationWidgetContext";

export const useNotificationWidgetData = (): INotificationWidgetDataContextValues => {
  const context = useContext(NotificationWidgetDataContext);
  if (!context) {
    throw new Error('useNotificationWidgetData must be used within a NotificationWidgetDataProvider');
  }
  return context;
}