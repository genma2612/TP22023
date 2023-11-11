import { Component, ViewChild } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent {
  @ViewChild('table') table!: APIDefinition;
  public configuration!: Config;
  public data$!: Observable<any>;
  public columns!: Columns[];

  codigosRango = ['No!', 'Si no me queda otra', 'No lo sé', 'Probablemente', 'Definitivamente!'];


  constructor(private auth: UserAuthService) { }

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: '', title: '#', width: '3%' },
      { key: 'nombre', title: 'Nombre' },
      { key: 'puntaje', title: 'Puntaje' },
      { key: 'recomienda', title: 'Recomienda' },
      { key: 'volveria', title: 'Volvería' },
      { key: 'comentario', title: 'Comentario' },
      { key: 'fecha', title: 'Fecha' }
    ];
    this.data$ = this.auth.traerColeccionOrdenada('encuestas', 'fecha');

  }

  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

}
