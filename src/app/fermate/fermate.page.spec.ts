import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FermatePage } from './fermate.page';

describe('FermatePage', () => {
  let component: FermatePage;
  let fixture: ComponentFixture<FermatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FermatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
