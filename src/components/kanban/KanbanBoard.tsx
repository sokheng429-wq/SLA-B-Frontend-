import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { WorkflowStatusKey, Ticket } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { TicketCard } from './TicketCard';
import { useTicketStore } from '../../store/ticketStore';
import { useDepartmentStore } from '../../store/departmentStore';
import { useAuthStore } from '../../store/authStore';

const COLUMNS: { key: WorkflowStatusKey; titleEn: string; titleKh: string; color: string }[] = [
  { key: 'SUBMITTED', titleEn: 'Submitted', titleKh: 'បានដាក់ស្នើ', color: 'blue' },
  { key: 'BRIEF_CHECK', titleEn: 'Brief Check', titleKh: 'ត្រួតពិនិត្យ Brief', color: 'amber' },
  { key: 'IN_PRODUCTION', titleEn: 'In Production', titleKh: 'កំពុងផលិត (SLA)', color: 'purple' },
  { key: 'IN_REVIEW', titleEn: 'In Review', titleKh: 'ត្រួតពិនិត្យផ្ទៀងផ្ទាត់', color: 'indigo' },
  { key: 'APPROVED_DELIVERED', titleEn: 'Approved / Delivered', titleKh: 'បានអនុម័ត/ប្រគល់', color: 'emerald' },
  { key: 'WAITING_FOR_REQUESTER', titleEn: 'Waiting for Requester', titleKh: 'រង់ចាំអ្នកស្នើ (Paused)', color: 'orange' },
  { key: 'REJECTED', titleEn: 'Rejected', titleKh: 'បដិសេធ (Brief)', color: 'rose' },
];

export const KanbanBoard: React.FC = () => {
  const { tickets, updateTicketStatus, filters } = useTicketStore();
  const { currentDepartmentId } = useDepartmentStore();
  const { currentUser } = useAuthStore();

  const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold prevents accidental dragging when clicking
      },
    })
  );

  // Filter tickets by Department and active filter criteria
  const filteredTickets = tickets.filter((t) => {
    // Department Filter
    if (t.departmentId !== currentDepartmentId) {
      return false;
    }

    // Search Query (ticket number, title, service code)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.serviceCode.toLowerCase().includes(q) ||
        (t.assigneeName && t.assigneeName.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Assignee Filter
    if (filters.assigneeFilter !== 'ALL') {
      if (t.assigneeId !== filters.assigneeFilter) return false;
    }

    // Priority Filter
    if (filters.priorityFilter !== 'ALL') {
      if (t.priority !== filters.priorityFilter) return false;
    }

    // Rush Filter
    if (filters.rushOnly && !t.isRush) {
      return false;
    }

    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find((t) => t.id === active.id);
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = String(active.id);
    const targetStatus = String(over.id) as WorkflowStatusKey;

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.status === targetStatus) return;

    const actor = {
      id: currentUser?.id || 'unknown',
      name: currentUser?.fullNameEn || 'System User',
      role: currentUser?.role || 'REQUESTER',
    };

    let reason: string | undefined = undefined;
    if (targetStatus === 'REJECTED') {
      const inputReason = prompt("Please provide a rejection reason for the brief ('No Brief = No Start'):");
      if (!inputReason || inputReason.trim() === '') {
        alert('Rejection cancelled: A reason is required.');
        return;
      }
      reason = inputReason.trim();
    }

    updateTicketStatus(ticketId, targetStatus, actor, reason);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-4 md:p-6">
        <div className="flex items-start gap-3.5 min-w-max pb-6">
          {COLUMNS.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col.key);
            return (
              <KanbanColumn
                key={col.key}
                statusKey={col.key}
                titleEn={col.titleEn}
                titleKh={col.titleKh}
                tickets={colTickets}
                badgeColor={col.color}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay Preview */}
      <DragOverlay>
        {activeTicket ? (
          <div className="rotate-2 scale-105 shadow-2xl">
            <TicketCard ticket={activeTicket} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
