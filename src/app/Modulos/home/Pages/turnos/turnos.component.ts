import { Component, OnInit, ViewChild  } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement?: DataTableDirective;

  turnos: any;
  dtOptions: DataTables.Settings = {};


  constructor(private auth: UserAuthService) {
    this.auth.traerColeccionOrdenada('turnos', 'fecha').subscribe(
      response => this.turnos = response
    )

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "Todas"]],
      language: {
        "emptyTable": "No hay información para mostrar",
        "info": "Mostrando resultados del _START_ al _END_ de un total de _TOTAL_ filas",
        "infoEmpty": "Mostrando 0 a 0 de 0 entries",
        "infoFiltered": "(Filtrado de _MAX_ entradas totales)",
        "lengthMenu": "Mostrar _MENU_ filas",
        "loadingRecords": "Cargando...",
        "search": "Buscar:",
        "zeroRecords": "No se encontraron coincidencias",
        "paginate": {
          "first": "Primera",
          "last": "Última",
          "next": "Siguiente",
          "previous": "Anterior"
        },
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        }
      }
    };
  }

  filterTable(valor:string,columna:number): void {
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

}
