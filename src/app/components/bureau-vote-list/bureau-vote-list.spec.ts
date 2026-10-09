import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BureauVoteList } from './bureau-vote-list';

describe('BureauVoteList', () => {
  let component: BureauVoteList;
  let fixture: ComponentFixture<BureauVoteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BureauVoteList],
    }).compileComponents();

    fixture = TestBed.createComponent(BureauVoteList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
