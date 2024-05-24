import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenitorePage } from './genitore.page';

describe('GenitorePage', () => {
  let component: GenitorePage;
  let fixture: ComponentFixture<GenitorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenitorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
