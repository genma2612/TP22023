import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { UserAuthService } from 'src/app/Servicios/user-auth.service';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit, OnChanges {
  @Input() paciente:any;
  @Output() descargarTurnos = new EventEmitter<any>();

  @ViewChild('table') table!: APIDefinition;

  public configuration!: Config;
  public data$!: Observable<any>;
  public columns!: Columns[];

  constructor(private auth: UserAuthService) {
  }

  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

  ngOnChanges(changes: SimpleChanges):void {
    //console.info(changes['paciente'].currentValue.uid);
    this.data$ = this.auth.traerColeccionTurnosCompleta(changes['paciente'].currentValue.uid);
  }

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: '', title: '#', width: '3%' },
      { key: 'especialista', title: 'Especialista' },
      { key: 'especialidadElegida', title: 'Especialidad' },
      { key: 'fecha', title: 'Fecha', orderBy: 'asc' },
      { key: 'diagnostico', title: 'Diagnostico', width: '50%' },
      { key: 'estado', title: 'Estado' },
      { key: 'calificacion', title: 'Calificación' },
      { key: 'duracion', title: 'Duración' },
      { key: 'comentario', title: 'Comentario' },
    ];
  }

  enviarTurnosPaciente(){
    this.descargarTurnos.emit();
  }

}
