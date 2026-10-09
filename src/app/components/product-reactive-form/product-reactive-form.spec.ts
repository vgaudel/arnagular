import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductReactiveForm } from './product-reactive-form';

describe('ProductReactiveForm', () => {
  let component: ProductReactiveForm;
  let fixture: ComponentFixture<ProductReactiveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReactiveForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReactiveForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
