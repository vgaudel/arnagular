import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitAddFormSignal } from './produit-add-form-signal';

describe('ProduitAddFormSignal', () => {
  let component: ProduitAddFormSignal;
  let fixture: ComponentFixture<ProduitAddFormSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitAddFormSignal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitAddFormSignal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
