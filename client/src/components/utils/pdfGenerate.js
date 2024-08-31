import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from '../Auth/East-west-university-LogoSVG.svg.png'; // Adjust the path as needed

export const generatePDFAdvisingSlip = async () => {
    const input = document.getElementById('pdf-content');
    if (input) {
        const canvas = await html2canvas(input, { scale: 1 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width * 0.264583; // Convert px to mm
        const imgHeight = canvas.height * 0.264583;
        const xPos = (pdfWidth - imgWidth) / 2;
        const yPos = (pdfHeight - imgHeight) / 2;
     
        const logoImg = new Image();
        logoImg.src = logo;

        logoImg.onload = () => {
           
            const logoWidth = 40; // Adjust width in mm
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = pdfWidth - logoWidth - 10; 
            const logoY = 10;
            // Adding the logo to the PDF
            pdf.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
            
            // Add content image
            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
            
            pdf.setFontSize(14); 
            pdf.text('Your customized text here', 10, pdfHeight - 10);

            pdf.save('student-list.pdf');
        };
    } else {
        console.error('Element with id "pdf-content" not found.');
    }
};
