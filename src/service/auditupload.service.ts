import sequelize from "../config/sequelize";
import AuditData from "../Model/AuditData.model";
import axios from "axios";

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
        // const summaryRows = Array.isArray(payload.auditsummary) ? payload.auditsummary : [];
        console.log("Audit rows", auditRows);
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
        console.log("Audit data inserted successfully");
        await transaction.commit();
        console.log("Transaction committed");
        if (cleanedSelectedMonthYear) {
            console.log("Generating summary");
            const summaryinsertionresponse = await axios.post(
                "https://nwr-whatsapp-api-bqfadsfzc2ergzcx.canadacentral-01.azurewebsites.net/generate-summary",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        "date": cleanedSelectedMonthYear,
                        "param": "audit",
                    },
                }
            );
            console.log("Summary insertion response", summaryinsertionresponse);

            if (!summaryinsertionresponse.data.success) {
                throw new Error(summaryinsertionresponse.data.message);
            }
        }
        console.log("Summary insertion response");

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
