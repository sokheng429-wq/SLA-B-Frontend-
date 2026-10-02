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
import { useKanban } from '../../context/KanbanContext';

export default function KanbanBoard() {
  const { tickets, columns, moveTicket } = useKanban();
  const [activeTicket, setActiveTicket] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const ticket = tickets.find((t) => t.id === active.id);
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    let targetColumnId = over.id;

    // If dropped directly on another ticket, find that ticket's column
    const overTicket = tickets.find((t) => t.id === over.id);
    if (overTicket) {
      targetColumnId = overTicket.columnId;
    }

    if (targetColumnId && active.id) {
      moveTicket(active.id, targetColumnId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-10 py-2 select-none">
        <div className="flex items-start gap-4 min-w-max pb-6">
          {columns.map((column) => {
            const columnTickets = tickets.filter((t) => t.columnId === column.id);

            return (
              <Column
                key={column.id}
                column={column}
                tickets={columnTickets}
              />
            );
          })}
        </div>
      </div>

      {/* Floating Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTicket ? (
          <div className="w-80 max-w-[340px]">
            <TicketCard ticket={activeTicket} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
