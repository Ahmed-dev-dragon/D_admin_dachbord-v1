import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { g } from 'src/app/shared/global/filter-tool';
import { filterParameter } from 'src/app/shared/models/List.model';
@Component({
  selector: 'filter-by-range',
  templateUrl: './filter-range.component.html',
  styleUrls: ['./filter-range.component.scss'],
})
export class FilterRangeComponent {
  @Input() type: string | string[] = '';
  @Input() label: string | string[] = '';
  @Input() path: string | string[] = '';
  @Input() inData!: any[];
  @Input() DafultValue: number[] = [20, 80];
  @Input() renge: number[] = [0, 100];
  @Input() operator: string = '==';
  @Output() outData: EventEmitter<any> = new EventEmitter();
  @Input() inParameter!: filterParameter;
  @Output() outParameter: any = new EventEmitter();
  parameter!: filterParameter;
  apleyFiler: boolean = false;

  @Input() rule!: 'lass then' | 'biger then';

  ngOnInit(): void {
    this.inParameter
      ? (this.parameter = this.inParameter)
      : (this.parameter = {
          inputValueOne: this.DafultValue[0],
          inputValueTwo: this.DafultValue[1],
          values: this.DafultValue,
        });
  }
  ngAfterViewInit(): void {
    this.outData.emit(this.inData);
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change['rule'] || change['inData']) {
      this.filterBy();
    }
  }

  var: any;
  handeleRenge(renge: number[]) {}
  handleChange(e: any, type: string = 'slider') {
    type == 'slider'
      ? (e.values[0] < this.renge[0]
          ? (this.parameter.inputValueOne = this.renge[0])
          : (this.parameter.inputValueOne = e.values[0]),
        e.values[1] > this.renge[1]
          ? (this.parameter.inputValueTwo = this.renge[1])
          : (this.parameter.inputValueTwo = e.values[1]))
      : '';
    type == 'input'
      ? ((this.parameter.values = []),
        (this.parameter.values = [
          this.parameter.inputValueOne,
          this.parameter.inputValueTwo,
        ]))
      : '';
    this.sendParameter();
  }
  setTimeOutId: any = -1;
  clearDataVar: boolean = false;
  clearFiler() {
    this.clearDataVar = true;
    this.parameter = {
      inputValueOne: this.DafultValue[0],
      inputValueTwo: this.DafultValue[1],
      values: this.DafultValue,
    };
    this.sendParameter();
    this.filterBy();
  }
  filterBy() {
    clearTimeout(this.setTimeOutId);
    this.setTimeOutId = setTimeout(() => {
      let filterInputValue = [
        this.parameter.inputValueOne,
        this.parameter.inputValueTwo,
      ];
      if (!this.clearDataVar && this.path && this.inData) {
        let reusltdata = this.filter(filterInputValue);
        this.apleyFiler
          ? this.outData.emit(reusltdata)
          : this.outData.emit(this.inData);
      } else if (this.clearDataVar) this.outData.emit(this.inData);
    }, 150);
  }
  filter(filterInputValue: number[]) {
    return this.inData.filter((i) =>
      this.path instanceof Array
        ? this.path.some((k) => this.find(g(k, i), filterInputValue))
        : this.find(g(this.path, i), filterInputValue)
    );
  }
  find(findIn: number, findBy: number[]): boolean {
    if (!(findIn && findBy)) return false;
    if (findBy[0] >= findIn && findIn <= findBy[1]) {
      return true;
    }
    return !!(findBy[0] >= findIn || findIn <= findBy[1]);
  }
  apply() {
    this.apleyFiler = true;
  }
  clear() {
    this.apleyFiler = false;
    this.sendParameter(false);
    this.outParameter.emit({});
  }
  sendParameter: any = (a: any = true) => this.outParameter.emit(this.parameter)
}
