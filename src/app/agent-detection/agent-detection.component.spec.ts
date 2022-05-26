import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetectionComponent } from './agent-detection.component';

describe('AgentDetectionComponent', () => {
  let component: AgentDetectionComponent;
  let fixture: ComponentFixture<AgentDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDetectionComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
