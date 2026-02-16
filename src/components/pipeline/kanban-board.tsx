"use client";

import { motion } from "framer-motion";
import KanbanColumn from "./kanban-column";
import { columns } from "./pipeline-content";
import type { Lead } from "@/lib/types";

interface KanbanBoardProps {
  leads: Lead[];
  onDrop: (leadId: string, targetColumnKey: string) => void;
}

export default function KanbanBoard({ leads, onDrop }: KanbanBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-4 gap-4"
    >
      {columns.map((col, i) => {
        const colLeads = leads.filter((l) => col.statuses.includes(l.status));
        return (
          <KanbanColumn
            key={col.key}
            column={col}
            leads={colLeads}
            onDrop={onDrop}
            index={i}
          />
        );
      })}
    </motion.div>
  );
}
