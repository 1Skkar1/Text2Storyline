import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorylineComponent } from './storyline.component';

describe('StorylineComponent', () => {
  let component: StorylineComponent;
  let fixture: ComponentFixture<StorylineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorylineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorylineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
