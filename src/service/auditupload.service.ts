import sequelize from "../config/sequelize";
import AuditData from "../Model/AuditData.model";

type UploadPayload = {
    auditdata?: Record<string, any>[];
    auditsummary?: Record<string, any>[];
    selectedMonthYear?: string;
    division?: string;
};

const clean = (value: any) => {
    if (value === undefined || value === null) {
        return null;
    }
    return value.toString();
};

export async function insertAuditUploadData(payload: UploadPayload) {
    console.log("Audit upload payload received");
    const transaction = await sequelize.transaction();

    try {
        await AuditData.sync();

        const auditRows = Array.isArray(payload.auditdata) ? payload.auditdata : [];
        const summaryRows = Array.isArray(payload.auditsummary) ? payload.auditsummary : [];

        const cleanedSelectedMonthYear = clean(payload.selectedMonthYear);

        const auditInsertPayload = auditRows.map((row) => ({
            division: clean(row.division ?? payload.division),
            date: clean(row.date),
            figure: clean(row.figure),
            index: clean(row.index),
            unit: clean(row.unit),
            typeOfAuditObj: clean(row.typeOfAuditObj),
            openingBalance: clean(row.openingBalance),
            accretion: clean(row.accretion),
            clearanceOld: clean(row.clearanceOld),
            clearanceNew: clean(row.clearanceNew),
            closingBalance: clean(row.closingBalance),
            lessThanOneYearOld: clean(row.lessThanOneYearOld),
            moreThanOneYearOld: clean(row.moreThanOneYearOld),
            total: clean(row.total),
            selectedMonthYear: cleanedSelectedMonthYear,
        }));

        if (cleanedSelectedMonthYear) {
            const whereCondition: any = { selectedMonthYear: cleanedSelectedMonthYear };
            if (payload.division) {
                whereCondition.division = payload.division;
            }
            await AuditData.destroy({ where: whereCondition, transaction });
        }

        if (auditInsertPayload.length > 0) {
            await AuditData.bulkCreate(auditInsertPayload, {
                transaction,
                returning: false,
            });
        }

        await transaction.commit();

        return {
            success: true,
            message: "Audit upload data inserted successfully",
            data: {
                division: payload.division ?? null,
                selectedMonthYear: cleanedSelectedMonthYear ?? null,
                auditInserted: auditInsertPayload.length,
            },
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error in insertAuditUploadData:", error);
        throw error;
    }
}
