import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitTable } from './produit-table';

describe('ProduitTable', () => {
  let component: ProduitTable;
  let fixture: ComponentFixture<ProduitTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
