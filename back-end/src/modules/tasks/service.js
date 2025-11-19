import { taskRepository } from "./repository.js";
import { prisma } from "../../database/prismaClient.js";

// Importar gamificação
import {
  addPoints,
  checkAndUnlockAchievements,
  POINTS,
} from "../gamification/gamificationService.js";

const formatDay = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
}

export const taskService = {
    create: async (userId, data) => {
        return taskRepository.create({
            ...data,
            userId: Number(userId), 
            dueDate: new Date(data.dueDate),
            reminderDate: data.reminderDate ? new Date(data.reminderDate) : null,
        });
    },

    findAll: async (userId, filters) => {
        return taskRepository.findAllByUser(Number(userId), filters);
    },

    update: async (id, data, userId) => {

        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task) {
            throw new Error("Tarefa não encontrada.");
        }
        if (task.userId !== Number(userId)) {
            throw new Error("Você não tem permissão para editar esta tarefa.");
        }
        
        const updateData = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            reminderDate: data.reminderDate ? new Date(data.reminderDate) : undefined,
        };

        const updatedTask = await taskRepository.update(Number(id), updateData);

        // Se a tarefa foi concluída, adicionar pontos
        if (data.status === "CONCLUIDA" && task.status !== "CONCLUIDA") {
            try {
                let points = POINTS.TASK_COMPLETED;
                
                // Bônus por prioridade alta
                if (task.priority === "ALTA") {
                    points += POINTS.TASK_HIGH_PRIORITY;
                }
                
                // Bônus por estar no prazo
                if (task.dueDate && new Date() <= new Date(task.dueDate)) {
                    points += POINTS.TASK_COMPLETED_ON_TIME;
                }
                
                await addPoints(Number(userId), points, "TASK_COMPLETED", id);
                await checkAndUnlockAchievements(Number(userId));
            } catch (error) {
                console.error("Erro ao adicionar pontos:", error);
                // Não falha a atualização da tarefa por erro de gamificação
            }
        }

        return updatedTask;
    },

    delete: async (id, userId) => {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });

        if (!task) throw new Error("Tarefa não encontrada");
        if (task.userId !== Number(userId))
            throw new Error("Você não tem permissão para deletar esta tarefa");

        return taskRepository.delete(Number(id));
    },
    
    getStatistics: async (userId) => {
        const data = await taskRepository.getStatistics(Number(userId));

        const stats = data.statusCounts.reduce((acc, item) => {
            acc[item.status.toLowerCase()] = item._count.id;
            return acc;
        }, { pendente: 0, concluida: 0, atrasada: 0 });

        stats.nearestTaskTitle = data.nearestTask?.title || "Nenhuma tarefa pendente";
        stats.nearestTaskDate = data.nearestTask?.dueDate || null;
        stats.totalTasks = data.totalTasks;

        return stats;
    },
    
    getWeeklyFocusData: async (userId) => {
        const rawData = await taskRepository.getWeeklyFocus(Number(userId));
        
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const last7DaysMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayKey = d.toISOString().split('T')[0];
            last7DaysMap[dayKey] = { day: dayNames[d.getDay()], count: 0 };
        }
        
        rawData.forEach(item => {
            const dateKey = item.completedAt.toISOString().split('T')[0];
            
            if (last7DaysMap[dateKey]) {
                last7DaysMap[dateKey].count += item._count.id * 1.5; 
            }
        });
        
        const weeklyFocusData = Object.keys(last7DaysMap)
            .sort() 
            .map(dateKey => ({
                day: last7DaysMap[dateKey].day,
                hours: parseFloat(last7DaysMap[dateKey].count.toFixed(1)),
            }));
            
        return weeklyFocusData;
    }
};