import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import Column from './Column';
import TicketCard from './TicketCard';
import { useApp } from '../../context/AppContext';

export default function Board({
  searchQuery = '',
  selectedAssignee = null,
  selectedPriority = null,
  activeQuickFilter = 'all',
  groupBy = 'none',
  onCardClick = () => {},
  onCreateClick = () => {}
}) {
  const { tickets, moveTicket, lang } = useApp();
  const [activeTicket, setActiveTicket] = useState(null);
  const [collapsedCols, setCollapsedCols] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const toggleColumnCollapse = (colId) => {
    setCollapsedCols((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  // 4 Standard Jira Kanban Columns
  const COLUMNS = [
    {
      id: 'TO_DO',
      title: lang === 'kh' ? 'ត្រូវធ្វើ' : 'TO DO',
      statusKeys: ['BRIEF_CHECK', 'SUBMITTED', 'TO_DO']
    },
    {
      id: 'IN_PROGRESS',
      title: lang === 'kh' ? 'កំពុងដំណើរការ' : 'IN PROGRESS',
      statusKeys: ['IN_PRODUCTION', 'IN_PROGRESS']
    },
    {
      id: 'IN_REVIEW',
      title: lang === 'kh' ? 'កំពុងត្រួតពិនិត្យ' : 'IN REVIEW',
      statusKeys: ['IN_REVIEW']
    },
    {
      id: 'DONE',
      title: lang === 'kh' ? 'រួចរាល់' : 'DONE',
      statusKeys: ['DELIVERED', 'APPROVED_DELIVERED', 'DONE']
    }
  ];

  // Filtering
  const filteredTickets = tickets.filter((ticket) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ticket.title?.toLowerCase().includes(q) ||
        ticket.id?.toLowerCase().includes(q) ||
        ticket.assignee?.toLowerCase().includes(q) ||
        ticket.catalogName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedAssignee && ticket.assignee !== selectedAssignee) return false;
    if (selectedPriority && ticket.priority !== selectedPriority) return false;
    if (activeQuickFilter === 'p1-rush') {
      if (ticket.priority !== 'P1' && !ticket.is_rush) return false;
    } else if (activeQuickFilter === 'paused') {
      if (ticket.clock_state !== 'PAUSED') return false;
    }
    return true;
  });

  const handleDragStart = (event) => {
    const ticket = tickets.find((t) => t.id === event.active.id);
    if (ticket) setActiveTicket(ticket);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTicket(null);
    if (!over) return;

    let targetStatus = over.id;
    const overTicket = tickets.find((t) => t.id === over.id);
    if (overTicket) targetStatus = overTicket.status;

    const statusMap = {
      TO_DO: 'BRIEF_CHECK',
      IN_PROGRESS: 'IN_PRODUCTION',
      IN_REVIEW: 'IN_REVIEW',
      DONE: 'DELIVERED'
    };

    const newStatus = statusMap[targetStatus] || targetStatus;
    const current = tickets.find((t) => t.id === active.id);
    if (current && current.status !== newStatus) {
      moveTicket(active.id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-10 py-4 bg-transparent select-none">
        <div className="flex items-start gap-2 min-w-max">
          {COLUMNS.map((col) => {
            const colTickets = filteredTickets.filter((t) =>
              col.statusKeys.includes(t.status)
            );

            return (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                tickets={colTickets}
                isCollapsed={!!collapsedCols[col.id]}
                onToggleCollapse={() => toggleColumnCollapse(col.id)}
                onCardClick={onCardClick}
                onCreateClick={onCreateClick}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTicket ? (
          <div className="rotate-2 scale-105">
            <TicketCard ticket={activeTicket} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
