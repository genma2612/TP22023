import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPorEspecialidadComponent } from './turnos-por-especialidad.component';

describe('TurnosPorEspecialidadComponent', () => {
  let component: TurnosPorEspecialidadComponent;
  let fixture: ComponentFixture<TurnosPorEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosPorEspecialidadComponent]
    });
    fixture = TestBed.createComponent(TurnosPorEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
