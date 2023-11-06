import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ABMespecialidadesComponent } from './abmespecialidades.component';

describe('ABMespecialidadesComponent', () => {
  let component: ABMespecialidadesComponent;
  let fixture: ComponentFixture<ABMespecialidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ABMespecialidadesComponent]
    });
    fixture = TestBed.createComponent(ABMespecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
