import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement?: DataTableDirective;

  arrayEspecialistas: string[] = [];
  arrayEspecialidades: string[] = [];

  turnos: any;
  dtOptions: DataTables.Settings = {};

  queryS = document.querySelector('div.toolbar') as HTMLDivElement;


  constructor(private auth: UserAuthService, private renderer: Renderer2) {
    this.auth.traerColeccionOrdenada('turnos', 'fecha').subscribe(
      response => {
        this.turnos = response;
        this.turnos.forEach((element: any) => {
          this.arrayEspecialistas.push(element.especialista.nombre + ' ' + element.especialista.apellido);
          this.arrayEspecialidades.push(element.especialidadElegida);
        });
        this.arrayEspecialistas = this.filtrarArray(this.arrayEspecialistas);
        this.arrayEspecialidades = this.filtrarArray(this.arrayEspecialidades);
      })

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
      scrollY:700,
      columnDefs: [{ orderable: false, "width": "5%", "targets": 6 }],
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

  async cancelarTurno(turno: any) {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Por qué quiere cancelar el turno?',
      inputPlaceholder: 'Escriba el comentario aquí...',
      inputAttributes: {
        'aria-label': 'Escriba el comentario aquí'
      },
      showCancelButton: true
    })
    if (text) {
      //Swal.fire(text)
      let obj = { estado: 'Cancelado', estaCancelado: true, comentario: 'Comentario genérico' };
      this.auth.actualizarEstadoTurno(obj, turno.uid, turno.paciente.uid, turno.especialista.uid);
    }
  }

  verComentario(turno: any) {
    Swal.fire({
      title: 'Reseña:',
      text: turno.comentario,
      confirmButtonText: 'Cerrar'
    });
  }

}
