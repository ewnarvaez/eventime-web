import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresComponent } from './interes.component';

describe('InteresComponent', () => {
  let component: InteresComponent;
  let fixture: ComponentFixture<InteresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
