import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoForm } from './servico-form';

describe('ServicoForm', () => {
  let component: ServicoForm;
  let fixture: ComponentFixture<ServicoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
