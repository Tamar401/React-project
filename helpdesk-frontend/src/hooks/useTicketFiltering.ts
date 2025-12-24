import { useMemo } from "react";
import { Ticket } from "../types";

export const useTicketFiltering = (
  tickets: Ticket[] | undefined,
  searchText: string,
  filterStatus: string,
  filterPriority: string
) => {
  return useMemo(() => {
    if (!tickets) return [];
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.id.toString().includes(searchText);
      const matchesStatus =
        filterStatus === "" || ticket.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesPriority =
        filterPriority === "" || ticket.priority.toLowerCase() === filterPriority.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchText, filterStatus, filterPriority]);
};
