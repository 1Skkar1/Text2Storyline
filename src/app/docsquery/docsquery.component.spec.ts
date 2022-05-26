import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsqueryComponent } from './docsquery.component';

describe('DocsqueryComponent', () => {
  let component: DocsqueryComponent;
  let fixture: ComponentFixture<DocsqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsqueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
