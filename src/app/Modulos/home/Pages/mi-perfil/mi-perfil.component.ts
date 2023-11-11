import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {
  fechaDeGeneracion!:any;

  perfilActual:any;

  constructor(private userAuth: UserAuthService, private spinner: NgxSpinnerService){
    this.perfilActual = this.userAuth.usuarioLogueado;
    this.fechaDeGeneracion = new Date();
  }


  downloadPDF(): void {
    this.spinner.show();
    const DATA = document.getElementById('hc');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      useCORS: true, //Sino no renderiza la imagen de perfil
      onclone: function (clonedDoc:any) {
        // I made the div hidden and here I am changing it to visible
       clonedDoc.getElementById('fecha').style.visibility = 'visible';
     }
    };
    if(DATA != null){
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
