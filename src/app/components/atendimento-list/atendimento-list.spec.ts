import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentoList } from './atendimento-list';

describe('AtendimentoList', () => {
  let component: AtendimentoList;
  let fixture: ComponentFixture<AtendimentoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendimentoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
