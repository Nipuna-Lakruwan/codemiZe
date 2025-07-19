import fs from 'fs';
import csv from 'csv-parser';

export const parseCSVFile = (file, gameType) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (row) => {
                console.log('Processing row:', row);
                if (gameType === "battle-breakers" || gameType === "route-seekers") {
                    // Expected CSV format: question, answer
                    if (row.question && row.answer) {
                        results.push({
                            question: row.question.trim(),
                            answer: row.answer.trim(),
                        });
                    }
                } else if (gameType === "quiz-hunters") {
                    // Expected CSV format: question, correctAnswer, wrong1, wrong2, wrong3
                    if (row.question && row.correctAnswer && row.wrong1 && row.wrong2 && row.wrong3) {
                        results.push({
                            question: row.question.trim(),
                            correctAnswer: row.correctAnswer.trim(),
                            options: [
                                row.wrong1.trim(),
                                row.wrong2.trim(),
                                row.wrong3.trim(),
                            ],
                        });
                    }
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve(results);
            })
            .on('error', (err) => {
                console.error('Error processing CSV file:', err);
                reject(err);
            });
    });
};