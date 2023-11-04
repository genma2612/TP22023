import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisturnosComponent } from './misturnos.component';

describe('MisturnosComponent', () => {
  let component: MisturnosComponent;
  let fixture: ComponentFixture<MisturnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisturnosComponent]
    });
    fixture = TestBed.createComponent(MisturnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
