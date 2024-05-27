import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccompagnatorePage } from './accompagnatore.page';

describe('AccompagnatorePage', () => {
  let component: AccompagnatorePage;
  let fixture: ComponentFixture<AccompagnatorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccompagnatorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
