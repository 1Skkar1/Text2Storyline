import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRefsComponent } from './about-refs.component';

describe('AboutRefsComponent', () => {
  let component: AboutRefsComponent;
  let fixture: ComponentFixture<AboutRefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutRefsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
