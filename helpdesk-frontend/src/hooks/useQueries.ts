import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Ticket, Status, Priority } from "../types";

export const useFetchTickets = (enabled = true) => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await api.get<Ticket[]>("/tickets");
      return response.data;
    },
    enabled,
  });
};
export const useFetchTicketById = (ticketId: string, enabled = true) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const response = await api.get<Ticket>(`/tickets/${ticketId}`);
      return response.data;
    },
    enabled,
  });
};
export const useFetchStatuses = (enabled = true) => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const response = await api.get<Status[]>("/statuses");
      return response.data;
    },
    enabled,
  });
};
export const useFetchPriorities = (enabled = true) => {
  return useQuery({
    queryKey: ["priorities"],
    queryFn: async () => {
      const response = await api.get<Priority[]>("/priorities");
      return response.data;
    },
    enabled,
  });
};
