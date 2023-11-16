import { Component, ViewChild } from '@angular/core';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {

  @ViewChild('table') table!: APIDefinition;
  public configuration!: Config;
  public data$!: Observable<any>;
  public columns!: Columns[];

  constructor(private auth: UserAuthService) { }


  
  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: '', title: '#', width: '3%' },
      { key: 'email', title: 'usuario' },
      { key: 'nombre', title: 'Nombre' },
      { key: 'rol', title: 'Rol' },
      { key: 'fecha', title: 'Fecha' },
    ];
    this.data$ = this.auth.traerColeccionOrdenada('ingresos', 'fecha');

  }

  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

}
