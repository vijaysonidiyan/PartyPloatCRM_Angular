import { NgModule } from '@angular/core';
//import { ScrollBarDirective, HighlightDirective } from './common.directive';
import { ScrollBarDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective} from './common.directive';

@NgModule({
  imports: [],
  declarations: [ScrollBarDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective],
  exports: [ScrollBarDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective]
})
export class DirectivesModule { }