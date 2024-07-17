import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDFAdvisingSlip = async (studentName, studentEmail, coursesTableId) => {
    try {
        const input = document.getElementById(coursesTableId);
        if (input) {
            const canvas = await html2canvas(input, { scale: 1 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width * 0.264583;
            const imgHeight = canvas.height * 0.264583;

            const xPos = (pdfWidth - imgWidth) / 2;
            let yPos = 20;

            pdf.setFontSize(12);
            pdf.text(`Name: ${localStorage.getItem('name')}`, 20, yPos);
            yPos += 10;
            pdf.text(`Email: ${localStorage.getItem('email')}`, 20, yPos);
            yPos += 10;
            pdf.text(`Student ID: ${localStorage.getItem('studentId')}`, 20, yPos);
            yPos += 10;

            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);

            pdf.save('advising-slip.pdf');
        } else {
            console.error(`Element with id "${coursesTableId}" not found.`);
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
