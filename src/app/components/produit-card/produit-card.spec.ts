import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitCard } from './produit-card';

describe('ProduitCard', () => {
  let component: ProduitCard;
  let fixture: ComponentFixture<ProduitCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
