const db = require('../../util/database');

// Clase Indicator
module.exports = class Indicator {

    /**
     * Devuelve todos los indicadores agrupados por usuario y categoría
     * @returns {Promise}
     */
    static async fetchAll() {
        const [rows] = await db.execute(
            `
            SELECT 
                u.IDUser,
                u.name AS userName,
                u.email,
                m.category,
                COUNT(um.IDMission) AS missionCount,
                SUM(m.value) AS totalValue,
                SUM(m.experience) AS totalExperience
            FROM 
                user u
            INNER JOIN 
                userMissions um ON u.IDUser = um.IDUser
            INNER JOIN 
                mission m ON um.IDMission = m.IDMission
            WHERE 
                um.status = 1
                AND u.deleted = 0
                AND m.available = 1
            GROUP BY 
                u.IDUser, 
                u.name, 
                u.email, 
                m.category
            ORDER BY 
                u.IDUser, 
                m.category
            `
        );

        // Agrupar por usuario
        const usersMap = {};

        rows.forEach(row => {
            const userId = row.IDUser;
            
            if (!usersMap[userId]) {
                usersMap[userId] = {
                    IDUser: row.IDUser,
                    userName: row.userName,
                    email: row.email,
                    categories: [],
                    totals: {
                        totalMissions: 0,
                        totalValue: 0,
                        totalExperience: 0
                    }
                };
            }

            // Convertir a números usando Number() o parseInt()
            const missionCount = parseInt(row.missionCount) || 0;
            const totalValue = parseInt(row.totalValue) || 0;
            const totalExperience = parseInt(row.totalExperience) || 0;

            usersMap[userId].categories.push({
                category: row.category,
                missionCount: missionCount,
                totalValue: totalValue,
                totalExperience: totalExperience
            });

            // Ahora sí suma correctamente
            usersMap[userId].totals.totalMissions += missionCount;
            usersMap[userId].totals.totalValue += totalValue;
            usersMap[userId].totals.totalExperience += totalExperience;
        });

        return Object.values(usersMap);
    }
};