export interface Ticket {
    id?: number;
    subject: string;
    description: string;
    status_id?: number | null;
    priority_id?: number | null;
    created_at?: string;
    updated_at?: string | null;
    created_by: number;
    assigned_to?: number | null;

}


export interface TicketResponse extends Ticket {
    created_by_name?: string | null;
    created_by_email?: string | null;
    assigned_to_name?: string | null;
    assigned_to_email?: string | null;
    status_name?: string | null;
    priority_name?: string | null;

}
export type CreateTicketDTO = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTicketDTO = Partial<CreateTicketDTO>;
