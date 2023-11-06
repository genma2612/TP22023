import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { DataTableDirective } from 'angular-datatables';



@Component({
  selector: 'app-misturnos',
  templateUrl: './misturnos.component.html',
  styleUrls: ['./misturnos.component.css']
})
export class MisturnosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement?: DataTableDirective;

  arrayPacientes: string[] = [];
  arrayEspecialistas: string[] = [];
  arrayEspecialidades: string[] = [];

  turnos: any;
  usuarioActual: any;
  dtOptions: DataTables.Settings = {};



  constructor(private auth: UserAuthService) {
    this.usuarioActual = this.auth.getUsuarioLocalstorage();
    this.auth.traerColeccionOrdenada(`usuarios/${this.usuarioActual.uid}/turnos`, 'fecha').subscribe(
      response => {
        this.turnos = response;
        this.turnos.forEach((element: any) => {
          this.arrayEspecialidades.push(element.especialidadElegida);
          if (this.usuarioActual.rol == 'especialista')
            this.arrayPacientes.push(element.paciente.nombre + ' ' + element.paciente.apellido);
          if (this.usuarioActual.rol == 'paciente')
            this.arrayEspecialistas.push(element.especialista.nombre + ' ' + element.especialista.apellido);
        });
        this.arrayEspecialidades = this.filtrarArray(this.arrayEspecialidades);
        if (this.usuarioActual.rol == 'paciente')
        this.arrayEspecialistas = this.filtrarArray(this.arrayEspecialistas);
        if (this.usuarioActual.rol == 'especialista')
        this.arrayPacientes = this.filtrarArray(this.arrayPacientes);
      }
    )
  }

  filtrarArray(arr: any[]) {
    let m: any = {}
    let newarr = []
    for (let i = 0; i < arr.length; i++) {
      let v = arr[i];
      if (!m[v]) {
        newarr.push(v);
        m[v] = true;
      }
    }
    return newarr;
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

  filterTable(valor: string, columna: number): void {
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

}
