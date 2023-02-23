import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatedtextComponent } from './annotatedtext.component';

describe('AnnotatedtextComponent', () => {
  let component: AnnotatedtextComponent;
  let fixture: ComponentFixture<AnnotatedtextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotatedtextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatedtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
