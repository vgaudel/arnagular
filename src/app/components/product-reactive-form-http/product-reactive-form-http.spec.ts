import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductReactiveFormHttp } from './product-reactive-form-http';

describe('ProductReactiveFormHttp', () => {
  let component: ProductReactiveFormHttp;
  let fixture: ComponentFixture<ProductReactiveFormHttp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReactiveFormHttp],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReactiveFormHttp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
