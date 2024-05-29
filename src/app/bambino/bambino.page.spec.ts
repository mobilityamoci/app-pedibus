import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BambinoPage } from './bambino.page';

describe('BambinoPage', () => {
  let component: BambinoPage;
  let fixture: ComponentFixture<BambinoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BambinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
