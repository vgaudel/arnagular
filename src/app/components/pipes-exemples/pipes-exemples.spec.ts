import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesExemples } from './pipes-exemples';

describe('PipesExemples', () => {
  let component: PipesExemples;
  let fixture: ComponentFixture<PipesExemples>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesExemples],
    }).compileComponents();

    fixture = TestBed.createComponent(PipesExemples);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
