import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BureauVote } from './bureau-vote';

describe('BureauVote', () => {
  let component: BureauVote;
  let fixture: ComponentFixture<BureauVote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BureauVote],
    }).compileComponents();

    fixture = TestBed.createComponent(BureauVote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
