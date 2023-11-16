import { Component, ViewChild } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent {


  constructor(private spinner: NgxSpinnerService) { }


  downloadPDF(id:string): void {
    this.spinner.show();
    const DATA = document.getElementById(id);
    const doc = new jsPDF('l', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      useCORS: true, //Sino no renderiza la imagen de perfil
    };
    if (DATA != null) {
      html2canvas(DATA, options).then((canvas) => {
        const img = canvas.toDataURL("image/jpeg", 1.0);
        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'jpg', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      })
        .then((docResult) => {
          docResult.save(`${new Date().toISOString()}.pdf`);
          this.spinner.hide();
        });
    }
  }


}
