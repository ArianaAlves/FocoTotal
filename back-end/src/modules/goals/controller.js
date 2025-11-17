import pkg from '@prisma/client';
const { PrismaClient, GoalStatus } = pkg;

const prisma = new PrismaClient();

export const goalsController = {


    listGoals: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Usuário não autenticado." });
            }
            const userId = Number(req.user.id); 

            const goals = await prisma.goal.findMany({
                where: { userId: userId },
                orderBy: { dueDate: 'asc' }, 
            });
            const formattedGoals = goals.map(goal => ({
                ...goal,
                status: goal.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            }));

            return res.status(200).json(formattedGoals);
        } catch (error) {
            console.error("Erro ao listar metas:", error);

            return res.status(500).json({ message: "Falha ao carregar metas.", error: error.message });
        }
    },

    createGoal: async (req, res) => {
        const { title, description, target, dueDate, category } = req.body;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const userId = Number(req.user.id); 

        if (!title || !target || !dueDate) {
            return res.status(400).json({ message: "Dados obrigatórios (título, meta, data limite) faltando." });
        }

        try {
            const newGoal = await prisma.goal.create({
                data: {
                    title,
                    description,
                    target: Number(target),
                    dueDate: new Date(dueDate),
                    category: category || 'Outros',
                    currentProgress: 0,
                    status: GoalStatus.EM_PROGRESSO, 
                    userId: userId,
                },
            });

            const formattedGoal = {
                ...newGoal,
                status: newGoal.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            };

            return res.status(201).json(formattedGoal);
        } catch (error) {
            console.error("Erro ao criar meta:", error);
            return res.status(500).json({ message: "Falha ao salvar a meta.", error: error.message });
        }
    },

    updateGoal: async (req, res) => {
        const goalId = req.params.id;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const userId = Number(req.user.id);
        const updateData = req.body;

        try {
            const updatedGoal = await prisma.goal.update({
                where: { id: Number(goalId), userId: userId }, 
                data: {
                    ...updateData,
                    target: updateData.target ? Number(updateData.target) : undefined,
                    currentProgress: updateData.currentProgress ? Number(updateData.currentProgress) : undefined,
                    dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
                    status: updateData.status ? GoalStatus[updateData.status.toUpperCase().replace(/\s/g, '_')] : undefined,
                },
            });

            const formattedGoal = {
                ...updatedGoal,
                status: updatedGoal.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            };

            return res.status(200).json(formattedGoal);
        } catch (error) {
            console.error("Erro ao atualizar meta:", error);
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Meta não encontrada ou não pertence ao usuário." });
            }
            return res.status(500).json({ message: "Falha ao atualizar a meta.", error: error.message });
        }
    },
    
    removeGoal: async (req, res) => {
        const goalId = req.params.id;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }

        const userId = Number(req.user.id);

        try {
            await prisma.goal.delete({
                where: { id: Number(goalId), userId: userId },
            });
            return res.status(204).send();
        } catch (error) {
            console.error("Erro ao deletar meta:", error);
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Meta não encontrada ou não pertence ao usuário." });
            }
            return res.status(500).json({ message: "Falha ao deletar a meta.", error: error.message });
        }
    },

    updateProgress: async (req, res) => {
        const goalId = req.params.id;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const userId = Number(req.user.id);
        const { newProgress } = req.body;

        try {
            if (newProgress === undefined) {
                 return res.status(400).json({ message: "Novo valor de progresso é obrigatório." });
            }
            
            const goal = await prisma.goal.findUnique({
                where: { id: Number(goalId) }
            });

            if (!goal || goal.userId !== userId) {
                 return res.status(404).json({ message: "Meta não encontrada ou acesso negado." });
            }

            const isCompleted = Number(newProgress) >= goal.target;

            const updatedGoal = await prisma.goal.update({
                where: { id: Number(goalId) },
                data: {
                    currentProgress: Number(newProgress),
                    status: isCompleted ? GoalStatus.CONCLUIDA : GoalStatus.EM_PROGRESSO, 
                },
            });
            
            const formattedGoal = {
                ...updatedGoal,
                status: updatedGoal.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            };

            return res.status(200).json(formattedGoal);
        } catch (error) {
            console.error("Erro ao atualizar progresso:", error);
            return res.status(500).json({ message: "Falha ao atualizar progresso.", error: error.message });
        }
    }
};