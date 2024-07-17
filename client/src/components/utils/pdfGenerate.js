import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDFAdvisingSlip = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
        const canvas = await html2canvas(input, { scale: 1 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width * 0.264583; // Convert px to mm (1px = 0.264583mm)
        const imgHeight = canvas.height * 0.264583;

        const xPos = (pdfWidth - imgWidth) / 2;
        const yPos = (pdfHeight - imgHeight) / 2;
        pdf.setFontSize(12);
        pdf.text(<br>Name ${localStorage.getItem('name')}</br>)
        pdf.text(<br>Name ${localStorage.getItem('email')}</br>)
        pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
        pdf.save('student-list.pdf');
    } else {
        console.error('Element with id "pdf-content" not found.');
    }
};