import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from '../path_to_logo/logo.png'; // Adjust the path according to your project structure

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

        // Positioning the content image
        const xPos = (pdfWidth - imgWidth) / 2;
        const yPos = (pdfHeight - imgHeight) / 2;

        // Add Logo
        const logoImg = new Image();
        logoImg.src = logo;

        logoImg.onload = () => {
            // Adding logo to PDF
            const logoWidth = 50; // Width of the logo in mm
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = pdfWidth - logoWidth - 10; // 10mm margin from the right
            const logoY = 10; // 10mm margin from the top
            pdf.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
            pdf.setFontSize(12);
            pdf.text('Your text goes here', xPos, yPos - 10); // Adjust text position if needed
            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
            
            // Save the PDF
            pdf.save('student-list.pdf');
        };
    } else {
        console.error('Element with id "pdf-content" not found.');
    }
};
